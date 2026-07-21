/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { PixelModal, PixelButton, PixelSlider } from './PixelUI';
import { LoginV2Shell } from './login-v2/LoginV2Shell';

export const LoginScreen: React.FC = () => {
  const { 
    profile, 
    audioMuted, 
    toggleMute, 
    login, 
    triggerToast,
    musicVolume,
    sfxVolume,
    setMusicVolume,
    setSfxVolume,
    reduceFlashing,
    setReduceFlashing
  } = useStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  // Authentication pending states & completion guard
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [isGuestPending, setIsGuestPending] = useState(false);
  const googlePopupRef = useRef<Window | null>(null);
  const popupCheckIntervalRef = useRef<NodeJS.Timeout | number | null>(null);
  const loginCompletionStartedRef = useRef(false);

  // Confetti State (Square/plus shaped particles only)
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    speedX: number;
    speedY: number;
    shape: 'square' | 'plus';
  }[]>([]);

  // Welcome Modal and Pending Data for New Player Flow
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  const [pendingLoginData, setPendingLoginData] = useState<{
    name: string;
    avatarId: number;
    googleProfile?: { id: string; name: string; email: string; picture: string };
  } | null>(null);

  // Load Google Identity Services client script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Popup monitoring cleanup on unmount
  useEffect(() => {
    return () => {
      if (popupCheckIntervalRef.current) {
        clearInterval(popupCheckIntervalRef.current);
      }
      googlePopupRef.current = null;
    };
  }, []);

  // Listen for Google Sign-In popups (postMessage API aligned with OAuth guidelines)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      if (googlePopupRef.current && event.source !== googlePopupRef.current) {
        return;
      }
      if (event.data?.type === 'GOOGLE_SIGN_IN_SUCCESS') {
        const p = event.data.profile;
        if (
          p &&
          typeof p.id === 'string' &&
          typeof p.name === 'string' &&
          typeof p.email === 'string' &&
          typeof p.picture === 'string'
        ) {
          if (popupCheckIntervalRef.current) {
            clearInterval(popupCheckIntervalRef.current);
            popupCheckIntervalRef.current = null;
          }
          googlePopupRef.current = null;
          setIsGooglePending(false);
          onSuccessfulGoogleLogin(p);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [selectedAvatar, nickname, profile.isFirstLoginDone]);

  // physics loop for pixel confetti (square/plus-shaped only)
  useEffect(() => {
    if (!showConfetti || confettiParticles.length === 0) return;

    const interval = setInterval(() => {
      setConfettiParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            speedY: p.speedY + 0.6, // Gravity pulling down
          }))
          .filter((p) => p.y < window.innerHeight + 50 && p.x > -50 && p.x < window.innerWidth + 50)
      );
    }, 33); // ~30fps chunky frame updates

    return () => clearInterval(interval);
  }, [showConfetti, confettiParticles.length]);

  const triggerPixelConfetti = () => {
    setShowConfetti(true);
    const colors = ['#ffffff', '#888888', '#ff9f00', '#ffef99', '#e8e8e8'];
    const particles = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 80,
      y: window.innerHeight * 0.4 + (Math.random() - 0.5) * 80,
      size: Math.floor(Math.random() * 5) + 6, // 6px to 10px chunky squares
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 10,
      speedY: (Math.random() - 1.2) * 10, // shoot up
      shape: Math.random() > 0.5 ? 'square' : 'plus' as 'square' | 'plus',
    }));
    setConfettiParticles(particles);
  };

  const onSuccessfulGoogleLogin = (googleProfile: { id: string; name: string; email: string; picture: string }) => {
    if (loginCompletionStartedRef.current) return;
    loginCompletionStartedRef.current = true;

    const isFirstLogin = !profile.isFirstLoginDone;

    if (isFirstLogin) {
      triggerPixelConfetti();
      setPendingLoginData({
        name: googleProfile.name,
        avatarId: selectedAvatar,
        googleProfile,
      });
      setWelcomeModalOpen(true);
    } else {
      login(googleProfile.name, selectedAvatar, googleProfile);
    }
  };

  const handleGoogleSignInClick = () => {
    if (isGooglePending || isGuestPending) return;
    loginCompletionStartedRef.current = false;
    setIsGooglePending(true);

    const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || '';
    
    if (clientId && (window as any).google) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: async (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                if (!res.ok) {
                  throw new Error('Userinfo acquisition failed');
                }
                const data = await res.json();
                onSuccessfulGoogleLogin({
                  id: data.sub || ('google_' + Date.now()),
                  name: data.name || data.given_name || 'GOOGLE PLAYER',
                  email: data.email || '',
                  picture: data.picture || ''
                });
                setIsGooglePending(false);
              } catch (e) {
                console.error(e);
                triggerToast('GOOGLE SIGN-IN FAILED. PLEASE TRY AGAIN.', 'error');
                setIsGooglePending(false);
              }
            } else {
              triggerToast('GOOGLE SIGN-IN WAS CANCELLED.', 'error');
              setIsGooglePending(false);
            }
          },
          error_callback: (err: any) => {
            console.error('Google OAuth error:', err);
            triggerToast('GOOGLE SIGN-IN FAILED. PLEASE TRY AGAIN.', 'error');
            setIsGooglePending(false);
          }
        });
        client.requestAccessToken();
      } catch (err) {
        console.error('Google client init error:', err);
        triggerToast('GOOGLE SIGN-IN FAILED. PLEASE TRY AGAIN.', 'error');
        setIsGooglePending(false);
      }
    } else {
      // Custom simulated Google Identity popup redesigned for V2
      const width = 500;
      const height = 550;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        '',
        'Google_Sign_In_Fallback',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );

      if (popup) {
        googlePopupRef.current = popup;
        if (popupCheckIntervalRef.current) {
          clearInterval(popupCheckIntervalRef.current);
        }

        popupCheckIntervalRef.current = setInterval(() => {
          if (googlePopupRef.current && googlePopupRef.current.closed) {
            if (popupCheckIntervalRef.current) {
              clearInterval(popupCheckIntervalRef.current);
              popupCheckIntervalRef.current = null;
            }
            googlePopupRef.current = null;
            setIsGooglePending(false);
          }
        }, 500);

        const currentOrigin = window.location.origin;

        popup.document.write(`<!DOCTYPE html>
<html>
  <head>
    <title>Sign in - Google Accounts</title>
    <link href="https://fonts.googleapis.com/css2?family=Jersey+25&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; }
      body {
        background-color: #0B0D18;
        color: #F3EBD8;
        font-family: 'Jersey 25', sans-serif;
        text-align: center;
        padding: 30px 20px;
        margin: 0;
        user-select: none;
      }
      .card {
        background-color: #15182A;
        border: 2px solid #2E3150;
        padding: 28px 24px;
        max-width: 420px;
        margin: 0 auto;
        box-shadow: 4px 4px 0px #000000;
        clip-path: polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px);
      }
      .logo {
        font-size: 32px;
        color: #F6B73C;
        margin-bottom: 4px;
        letter-spacing: 2px;
        text-transform: uppercase;
        line-height: 1;
      }
      .subtitle {
        font-size: 18px;
        color: #9A9AB5;
        margin-bottom: 24px;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
      .account-btn {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        background: #222744;
        border: 2px solid #2E3150;
        color: #F3EBD8;
        padding: 12px;
        font-family: 'Jersey 25', sans-serif;
        text-align: left;
        margin-bottom: 12px;
        cursor: pointer;
        box-shadow: 3px 3px 0px #000000;
        clip-path: polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px);
        transition: border-color 0.15s, background-color 0.15s;
      }
      .account-btn:hover {
        background: #1D2036;
        border-color: #54D6D9;
      }
      .avatar-img {
        width: 38px;
        height: 38px;
        border-radius: 4px;
        border: 1px solid #2E3150;
        object-fit: cover;
      }
      .acc-name {
        font-size: 20px;
        color: #F3EBD8;
        line-height: 1.1;
        text-transform: uppercase;
      }
      .acc-email {
        font-size: 14px;
        color: #9A9AB5;
      }
      .footer {
        font-size: 13px;
        color: #63657A;
        margin-top: 24px;
        text-transform: uppercase;
        border-top: 1px solid #2E3150;
        padding-top: 12px;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="logo">CONTINUE WITH GOOGLE</div>
      <div class="subtitle">Select a preview account.</div>
      
      <button class="account-btn" onclick="select('mathofdynamic@gmail.com', 'Gamer Dynamic', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=150')">
        <img src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=150" class="avatar-img" />
        <div>
          <div class="acc-name">Gamer Dynamic</div>
          <div class="acc-email">mathofdynamic@gmail.com</div>
        </div>
      </button>
      
      <button class="account-btn" onclick="select('arcade_champ@gmail.com', 'Arcade Champ', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150')">
        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" class="avatar-img" />
        <div>
          <div class="acc-name">Arcade Champ</div>
          <div class="acc-email">arcade_champ@gmail.com</div>
        </div>
      </button>

      <button class="account-btn" onclick="select('retro_player@gmail.com', 'Retro Player', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150')">
        <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150" class="avatar-img" />
        <div>
          <div class="acc-name">Retro Player</div>
          <div class="acc-email">retro_player@gmail.com</div>
        </div>
      </button>

      <div class="footer">
        Preview identity simulator. No external account is modified.
      </div>
    </div>

    <script>
      function select(email, name, picture) {
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_SIGN_IN_SUCCESS',
            profile: {
              id: 'google_' + Math.random().toString().slice(2, 11),
              name: name,
              email: email,
              picture: picture
            }
          }, ${JSON.stringify(currentOrigin)});
          window.close();
        }
      }
    </script>
  </body>
</html>`);
      } else {
        triggerToast('ALLOW POPUPS TO CONTINUE WITH GOOGLE.', 'error');
        setIsGooglePending(false);
      }
    }
  };

  const handleSkipLoginClick = () => {
    if (isGuestPending || isGooglePending) return;
    loginCompletionStartedRef.current = false;
    setIsGuestPending(true);

    try {
      const isFirstLogin = !profile.isFirstLoginDone;
      const tag = nickname.trim().toUpperCase() || 'ARCADE_PLAYER';

      const guestProfile = {
        id: 'local_' + Date.now(),
        name: tag,
        email: 'local_test@8bitcasino.local',
        picture: '',
      };

      if (isFirstLogin) {
        if (loginCompletionStartedRef.current) return;
        loginCompletionStartedRef.current = true;
        triggerPixelConfetti();
        setPendingLoginData({
          name: tag,
          avatarId: selectedAvatar,
          googleProfile: guestProfile,
        });
        setWelcomeModalOpen(true);
      } else {
        if (loginCompletionStartedRef.current) return;
        loginCompletionStartedRef.current = true;
        login(tag, selectedAvatar, guestProfile);
      }
    } finally {
      setIsGuestPending(false);
    }
  };

  const handleConfirmOnboarding = () => {
    if (pendingLoginData) {
      login(pendingLoginData.name, pendingLoginData.avatarId, pendingLoginData.googleProfile);
    }
    setWelcomeModalOpen(false);
  };

  return (
    <div className="relative min-h-screen">
      <LoginV2Shell
        audioMuted={audioMuted}
        onToggleMute={toggleMute}
        onOpenSettings={() => setIsSettingsOpen(true)}
        nickname={nickname}
        setNickname={setNickname}
        selectedAvatarId={selectedAvatar}
        onSelectAvatar={setSelectedAvatar}
        onGoogleSignIn={handleGoogleSignInClick}
        onGuestSignIn={handleSkipLoginClick}
        isGooglePending={isGooglePending}
        isGuestPending={isGuestPending}
      />

      {/* Confetti Visualizer Layer (Square & plus shaped particles only) */}
      {showConfetti && confettiParticles.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none z-50 select-none"
          style={{
            top: `${p.y}px`,
            left: `${p.x}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.shape === 'square' ? p.color : 'transparent',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {p.shape === 'plus' && (
            <div className="relative w-full h-full">
              <div className="absolute inset-0 m-auto" style={{ width: '100%', height: '34%', backgroundColor: p.color }} />
              <div className="absolute inset-0 m-auto" style={{ width: '34%', height: '100%', backgroundColor: p.color }} />
            </div>
          )}
        </div>
      ))}

      {/* Welcome Onboarding Modal */}
      <PixelModal
        isOpen={welcomeModalOpen}
        onClose={handleConfirmOnboarding}
        title="CONGRATULATIONS!"
        footer={
          <PixelButton variant="gold" onClick={handleConfirmOnboarding} soundType="coin" className="w-full">
            START RETRO PLAYING
          </PixelButton>
        }
      >
        <div className="text-center p-2 space-y-4">
          <div className="text-5xl text-[#ff9f00] leading-none animate-bounce">🪙</div>
          <h3 className="text-3xl font-jersey text-[#ff9f00] uppercase m-0 leading-none">WELCOME TO 8BIT CASINO!</h3>
          
          <div className="border-2 border-[#ff9f00] bg-black p-4 font-jersey text-2xl text-white uppercase">
            Here&apos;s your first <span className="text-[#ff9f00]">$1.00</span> in Chips.
          </div>

          <p className="font-jersey text-md text-[#5a5a72] uppercase m-0 leading-snug">
            We credited thy wallet with free amusement chips to buy in at any Texas Hold&apos;em table or arcade slots!
          </p>
        </div>
      </PixelModal>

      {/* Global Sound & Cabinet Settings Modal */}
      <PixelModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="CABINET SOUND DECK"
        footer={
          <PixelButton
            variant="gold"
            onClick={() => setIsSettingsOpen(false)}
            className="w-full"
          >
            RETURN TO CABINET
          </PixelButton>
        }
      >
        <div className="space-y-4 py-2">
          {/* Subpanel 1: Mute State */}
          <div className="border-2 border-white/20 bg-black p-4 flex items-center justify-between select-none">
            <div className="flex flex-col">
              <span className="font-jersey text-2xl text-white uppercase leading-none">MASTER MUTE</span>
              <span className="font-jersey text-xs text-white/50 uppercase mt-1">Silence all chiptunes & SFX</span>
            </div>
            <PixelButton
              variant={audioMuted ? 'gold' : 'dark'}
              onClick={toggleMute}
              chamfer={6}
              className="px-4"
            >
              {audioMuted ? 'MUTED' : 'ACTIVE'}
            </PixelButton>
          </div>

          {/* Subpanel 2: Music Volume */}
          <div className="border-2 border-white/20 bg-black p-4 space-y-2 select-none">
            <PixelSlider
              label="CHIPTUNE LOOPS VOLUME"
              value={Math.round(musicVolume * 100)}
              onChange={(val) => setMusicVolume(val / 100)}
            />
          </div>

           {/* Subpanel 3: SFX Volume */}
          <div className="border-2 border-white/20 bg-black p-4 space-y-2 select-none">
            <PixelSlider
              label="SOUND EFFECTS VOLUME"
              value={Math.round(sfxVolume * 100)}
              onChange={(val) => setSfxVolume(val / 100)}
            />
          </div>

          {/* Subpanel 4: Photosensitivity */}
          <div className="border-2 border-white/20 bg-black p-4 flex items-center justify-between select-none">
            <div className="flex flex-col">
              <span className="font-jersey text-2xl text-white uppercase leading-none">REDUCE FLASHING</span>
              <span className="font-jersey text-xs text-white/50 uppercase mt-1">Tone down animations & pulses</span>
            </div>
            <PixelButton
              variant={reduceFlashing ? 'gold' : 'dark'}
              onClick={() => setReduceFlashing(!reduceFlashing)}
              chamfer={6}
              className="px-4"
            >
              {reduceFlashing ? 'REDUCED' : 'NORMAL'}
            </PixelButton>
          </div>
        </div>
      </PixelModal>
    </div>
  );
};
