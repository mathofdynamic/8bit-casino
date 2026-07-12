/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { audio } from '../lib/audio';
import { PixelPanel, PixelButton, PixelInput, PixelMascot, PixelModal, PixelToast, PixelSlider } from './PixelUI';
import { avatars, PixelAvatar } from '../lib/avatars';
import { Volume2, VolumeX, Gamepad2, ArrowRight, Settings } from 'lucide-react';

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
  const [stars, setStars] = useState<{ id: number; top: number; left: number; delay: number }[]>([]);
  const [ufoX, setUfoX] = useState(-50);

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

    // Initialize atmospheric background stars
    const starCount = 20;
    const generated = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      top: Math.floor(Math.random() * 50), // Top half of sky
      left: Math.floor(Math.random() * 100),
      delay: Math.random() * 2,
    }));
    setStars(generated);

    // Subtle drifting background UFO / decorative sign
    const ufoInterval = setInterval(() => {
      setUfoX((x) => {
        if (x > 110) return -25;
        return x + 1;
      });
    }, 120);

    return () => {
      document.body.removeChild(script);
      clearInterval(ufoInterval);
    };
  }, []);

  // Listen for Google Sign-In popups (postMessage API aligned with OAuth guidelines)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      // Accept local/deployed preview URLs
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'GOOGLE_SIGN_IN_SUCCESS') {
        const googleProfile = event.data.profile;
        onSuccessfulGoogleLogin(googleProfile);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [selectedAvatar, nickname]);

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
    // If a Google Client ID is configured, trigger actual Google OAuth
    const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || '';
    
    if (clientId && (window as any).google) {
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.access_token) {
            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
              });
              const data = await res.json();
              onSuccessfulGoogleLogin({
                id: data.sub,
                name: data.name || data.given_name || 'GOOGLE PLAYER',
                email: data.email,
                picture: data.picture
              });
            } catch (e) {
              console.error(e);
              triggerToast('GOOGLE PROFILE ACQUISITION FAILED', 'error');
            }
          }
        }
      });
      client.requestAccessToken();
    } else {
      // Otherwise, open our beautiful custom simulated Google Identity accounts popup (for frictionless container preview)
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
        popup.document.write(`
          <html>
            <head>
              <title>Sign in - Google Accounts</title>
              <link href="https://fonts.googleapis.com/css2?family=Jersey+25&display=swap" rel="stylesheet">
              <style>
                body {
                  background-color: #000000;
                  color: #ffffff;
                  font-family: 'Jersey 25', sans-serif;
                  text-align: center;
                  padding: 40px 20px;
                  margin: 0;
                }
                .card {
                  background-color: #111111;
                  border: 3px solid #ff9f00;
                  padding: 30px;
                  max-width: 400px;
                  margin: 0 auto;
                  box-shadow: 4px 4px 0px #000;
                  clip-path: polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 12px 100%, 0% calc(100% - 12px));
                }
                .logo {
                  font-size: 32px;
                  color: #ff9f00;
                  margin-bottom: 5px;
                  letter-spacing: 2px;
                }
                .subtitle {
                  font-size: 18px;
                  color: #ffffff;
                  margin-bottom: 30px;
                  letter-spacing: 1px;
                }
                .account-btn {
                  display: block;
                  width: 100%;
                  background: #000000;
                  border: 2px solid #ffffff;
                  color: white;
                  padding: 12px;
                  font-family: 'Jersey 25', sans-serif;
                  font-size: 20px;
                  text-align: left;
                  margin-bottom: 15px;
                  cursor: pointer;
                  box-shadow: 2px 2px 0px #000;
                  clip-path: polygon(0% 0%, calc(100% - 8px) 0%, 100% 8px, 100% 100%, 8px 100%, 0% calc(100% - 8px));
                }
                .account-btn:hover {
                  background: #111111;
                  border-color: #ff9f00;
                }
                .footer {
                  font-size: 14px;
                  color: #888888;
                  margin-top: 40px;
                }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="logo">GOOGLE SIGN IN</div>
                <div class="subtitle">SELECT ACCOUNT TO BUY-IN TO 8BIT CASINO</div>
                
                <button class="account-btn" onclick="select('mathofdynamic@gmail.com', 'Gamer Dynamic', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=150')">
                  <span style="color: #ff9f00">◆</span> Gamer Dynamic<br>
                  <span style="font-size: 14px; color: #888888;">mathofdynamic@gmail.com</span>
                </button>
                
                <button class="account-btn" onclick="select('arcade_champ@gmail.com', 'Arcade Champ', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150')">
                  <span style="color: #ff9f00">◆</span> Arcade Champ<br>
                  <span style="font-size: 14px; color: #888888;">arcade_champ@gmail.com</span>
                </button>
 
                <button class="account-btn" onclick="select('retro_player@gmail.com', 'Retro Player', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150')">
                  <span style="color: #ffffff">◆</span> Retro Player<br>
                  <span style="font-size: 14px; color: #888888;">retro_player@gmail.com</span>
                </button>

                <div class="footer">
                  Google Identity Services connection simulator. Secure play sandbox environment.
                </div>
              </div>

              <script>
                function select(email, name, picture) {
                  if (window.opener) {
                    window.opener.postMessage({
                      type: 'GOOGLE_SIGN_IN_SUCCESS',
                      profile: {
                        id: 'google_' + Math.random().toString().substr(2, 9),
                        name: name,
                        email: email,
                        picture: picture
                      }
                    }, '*');
                    window.close();
                  }
                }
              </script>
            </body>
          </html>
        `);
      } else {
        alert('Please allow popups to sign in with Google.');
      }
    }
  };

  const handleSkipLoginClick = () => {
    // Generates a mock local profile and checks for first-time onboarding
    const isFirstLogin = !profile.isFirstLoginDone;
    const tag = nickname.trim().toUpperCase() || 'ARCADE_PLAYER';

    const guestProfile = {
      id: 'local_' + Date.now(),
      name: tag,
      email: 'local_test@8bitcasino.local',
      picture: '', // Local guest account uses no profile picture (displays select character avatar)
    };

    if (isFirstLogin) {
      triggerPixelConfetti();
      setPendingLoginData({
        name: tag,
        avatarId: selectedAvatar,
        googleProfile: guestProfile,
      });
      setWelcomeModalOpen(true);
    } else {
      login(tag, selectedAvatar, guestProfile);
    }
  };

  const handleConfirmOnboarding = () => {
    if (pendingLoginData) {
      login(pendingLoginData.name, pendingLoginData.avatarId, pendingLoginData.googleProfile);
    }
    setWelcomeModalOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-[#000000] pixel-dots flex flex-col overflow-hidden">
      {/* 1. STYLED TOP BAR (Requirement 1: matching chamfered system, title & audio only) */}
      <header className="relative z-30 border-b-4 border-white bg-[#111111] px-4 py-3 filter drop-shadow-[0px_4px_0px_#000000]">
        <div className="w-[96%] xl:w-[94%] max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 select-none">
            <span className="text-3xl text-[#ff9f00] leading-none animate-pulse">🎰</span>
            <div>
              <h1 className="text-3xl font-jersey text-[#ff9f00] tracking-widest uppercase leading-none m-0">
                8bit Casino
              </h1>
              <p className="text-[10px] font-jersey text-white/80 tracking-widest uppercase m-0 mt-0.5 leading-none">
                play tokens arcade cabinet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PixelButton
              variant={audioMuted ? 'gold' : 'dark'}
              onClick={toggleMute}
              chamfer={6}
              className="px-2"
              title={audioMuted ? "Unmute sound" : "Mute sound"}
            >
              <div className="flex items-center justify-center">
                {audioMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
              </div>
            </PixelButton>

            <PixelButton
              variant="dark"
              onClick={() => setIsSettingsOpen(true)}
              chamfer={6}
              className="px-2"
              title="Global sound and cabinet settings"
            >
              <div className="flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
            </PixelButton>
          </div>
        </div>
      </header>

      {/* Background Starscape and UFO */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-[60%]">
        {stars.map((s) => (
          <div
            key={s.id}
            className="absolute w-1.5 h-1.5 bg-white animate-pixel-flash"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}

        {/* Drifting UFO Blimp decorative scenery */}
        <div
          className="absolute h-6 bg-[#ff9f00] text-black px-2 font-jersey text-md select-none border-2 border-white filter drop-shadow-[2px_2px_0px_#000] flex items-center justify-center"
          style={{
            top: '12%',
            left: `${ufoX}%`,
            transition: 'left 1s steps(8, end)',
          }}
        >
          👾 PLAY COINS ONLY 👾
        </div>
      </div>

      {/* Main Container below the top bar */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 flex flex-col justify-center relative z-10">
        
        {/* Requirement 2: Logotype Heading */}
        <div className="text-center mb-6">
          <h2 className="text-5xl md:text-6xl font-jersey tracking-widest text-[#ff9f00] uppercase select-none drop-shadow-[4px_4px_0px_#ffffff]">
            8BIT CASINO
          </h2>
        </div>

        {/* Login interface surrounded by grounded scene */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-center">
          
          {/* Left flank: grounded mascot scene */}
          <div className="md:col-span-4 hidden md:flex flex-col items-center justify-center select-none">
            <div className="border-3 border-[#ff9f00] bg-[#111111] p-3 text-center filter drop-shadow-[4px_4px_0px_#000] max-w-[180px] mb-4 relative">
              {/* Border clip logic for panel quote bubble */}
              <p className="font-jersey text-lg text-[#ff9f00] leading-tight uppercase m-0">
                &quot;GREETINGS! PICK THY RETRO CHAMPION &amp; JOIN THE PLAY TABLES!&quot;
              </p>
              {/* Little quote bubble notch */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-3 bg-[#111111] border-r-3 border-b-3 border-[#ff9f00] rotate-45" />
            </div>
            {/* Mascot standing on solid shadow ground shape */}
            <PixelMascot mood="idle" />
          </div>

          {/* Center: ONE Login Card (Requirement 3: PixelPanel structure) */}
          <div className="md:col-span-8 w-full max-w-xl mx-auto">
            <PixelPanel
              title="WELCOME TO 8BIT CASINO"
              subtitle="Sign in to start playing"
              headerAccent="gold"
              icon={<Gamepad2 className="w-5 h-5 text-white" />}
            >
              <div className="space-y-4">
                {/* Body promotion line */}
                <div className="border-2 border-[#ff9f00] bg-[#000000] p-3 text-center">
                  <p className="text-xl font-jersey text-[#ff9f00] uppercase m-0 leading-none animate-pulse">
                    New players get $1.00 in free Chips every day.
                  </p>
                </div>

                {/* Nickname Gamer Tag */}
                <div>
                  <PixelInput
                    label="Enter Gamer Tag"
                    type="text"
                    maxLength={12}
                    required
                    placeholder="E.G. CHIP_CHAMP"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  <p className="text-xs font-jersey text-[#5a5a72] uppercase mt-1 leading-none">
                    Maximum 12 characters. Auto-capitalized in systems.
                  </p>
                </div>

                {/* Avatar Picker (Requirement 4: 6 premium tiles, high-contrast gold fill change) */}
                <div>
                  <span className="block text-xl font-jersey text-white mb-1.5 uppercase leading-none">
                    Choose Champion Avatar
                  </span>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {avatars.map((av) => {
                      const isSelected = selectedAvatar === av.id;
                      return (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => {
                            audio.playClick();
                            setSelectedAvatar(av.id);
                          }}
                          className={`text-left focus:outline-none focus:ring-0 ${
                            isSelected
                              ? 'transform translate-y-[-2px]'
                              : 'hover:translate-y-[-1px]'
                          } transition-all duration-75`}
                        >
                          <div
                            className={`p-[2px] border-2 ${
                              isSelected ? 'bg-[#ff9f00]' : 'bg-white'
                            } filter drop-shadow-[2px_2px_0px_#000]`}
                            style={{
                              clipPath: 'polygon(0% 0%, calc(100% - 6px) 0%, 100% 6px, 100% 100%, 6px 100%, 0% calc(100% - 6px))'
                            }}
                          >
                            <div
                              className={`p-1.5 flex flex-col items-center text-center ${
                                isSelected ? 'bg-[#ff9f00] text-[#0d0d1a]' : 'bg-black text-[#e8e8e8]'
                              }`}
                              style={{
                                clipPath: 'polygon(0% 0%, calc(100% - 6px) 0%, 100% 6px, 100% 100%, 6px 100%, 0% calc(100% - 6px))'
                              }}
                            >
                              {av.svg}
                              <span className="font-jersey text-lg tracking-wider uppercase mt-1 leading-none">
                                {av.name.split(' ')[0]}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Action Button (Requirement 5) */}
                <div className="pt-2 space-y-3">
                  <PixelButton
                    type="button"
                    variant="gold"
                    className="w-full"
                    soundType="coin"
                    onClick={handleGoogleSignInClick}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>SIGN IN WITH GOOGLE</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </PixelButton>

                  <div className="flex items-center justify-center gap-2 select-none">
                    <div className="h-0.5 bg-[#5a5a72] flex-1" />
                    <span className="font-jersey text-lg text-[#5a5a72] uppercase px-2 leading-none">or</span>
                    <div className="h-0.5 bg-[#5a5a72] flex-1" />
                  </div>

                  {/* Dev/test skip login trigger (Requirement 8) */}
                  <PixelButton
                    type="button"
                    variant="dark"
                    className="w-full"
                    soundType="click"
                    onClick={handleSkipLoginClick}
                  >
                    SKIP LOGIN (DEV)
                  </PixelButton>
                </div>

                {/* Footer Disclaimer */}
                <p className="font-jersey text-xs text-[#5a5a72] text-center uppercase m-0 pt-2 leading-tight">
                  8bit Casino uses play-money Chips only. No real money is used, deposited, or paid out.
                </p>
              </div>
            </PixelPanel>
          </div>
        </div>
      </div>

      {/* Confetti Visualizer Layer (Requirement 7: Square & plus shaped particles only) */}
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

      {/* Welcome Onboarding Modal (Requirement 7) */}
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

      <PixelToast />
    </div>
  );
};
