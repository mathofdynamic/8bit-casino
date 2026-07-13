/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useStore, AppRoute } from './store';
import { audio } from './lib/audio';
import { LoginScreen } from './components/LoginScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { PokerScreen } from './components/PokerScreen';
import { MinigamesScreen } from './components/MinigamesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { PixelCoinCounter, PixelButton, PixelToast, PixelModal, PixelSlider } from './components/PixelUI';
import { PixelAvatar } from './lib/avatars';
import { Volume2, VolumeX, Landmark, User, LayoutGrid, Gamepad2, Settings, LogOut } from 'lucide-react';

interface GlobalAppOverlaysProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  audioMuted: boolean;
  toggleMute: () => void;
  musicVolume: number;
  setMusicVolume: (val: number) => void;
  sfxVolume: number;
  setSfxVolume: (val: number) => void;
  reduceFlashing: boolean;
  setReduceFlashing: (val: boolean) => void;
  isTransitioning: boolean;
  renderLoadingOverlay: () => React.ReactNode;
  achievementPopup: any;
  closeAchievementPopup: () => void;
}

const GlobalAppOverlays: React.FC<GlobalAppOverlaysProps> = ({
  isSettingsOpen,
  setIsSettingsOpen,
  audioMuted,
  toggleMute,
  musicVolume,
  setMusicVolume,
  sfxVolume,
  setSfxVolume,
  reduceFlashing,
  setReduceFlashing,
  isTransitioning,
  renderLoadingOverlay,
  achievementPopup,
  closeAchievementPopup,
}) => {
  return (
    <>
      {/* Global pixel alert toaster */}
      <PixelToast />

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
          <div className="border-2 border-[#5a5a72]/30 bg-black p-4 flex items-center justify-between select-none">
            <div className="flex flex-col text-left">
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
          <div className="border-2 border-[#5a5a72]/30 bg-black p-4 space-y-2 select-none text-left">
            <PixelSlider
              label="CHIPTUNE LOOPS VOLUME"
              value={Math.round(musicVolume * 100)}
              onChange={(val) => setMusicVolume(val / 100)}
            />
          </div>

          {/* Subpanel 3: SFX Volume */}
          <div className="border-2 border-[#5a5a72]/30 bg-black p-4 space-y-2 select-none text-left">
            <PixelSlider
              label="SOUND EFFECTS VOLUME"
              value={Math.round(sfxVolume * 100)}
              onChange={(val) => setSfxVolume(val / 100)}
            />
          </div>

          {/* Subpanel 4: Photosensitivity */}
          <div className="border-2 border-[#5a5a72]/30 bg-black p-4 flex items-center justify-between select-none">
            <div className="flex flex-col text-left">
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

      {/* Global Wipe / Loading Overlay */}
      {isTransitioning && renderLoadingOverlay()}

      {/* Achievement Milestone Popup Banner */}
      {achievementPopup && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto max-w-sm w-full px-4 animate-[bounce_0.5s_infinite_alternate]">
          <div 
            className="border-4 border-[#ff9f00] bg-[#111111] p-4 flex items-center gap-4 relative select-none"
            style={{
              clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)',
              boxShadow: '4px 4px 0px #000000',
            }}
          >
            <div className="w-12 h-12 bg-[#ff9f00] border-2 border-white flex items-center justify-center text-2xl shrink-0 relative">
              🏆
            </div>

            <div className="flex-1 text-left">
              <span className="font-jersey text-xs text-[#ff9f00] tracking-wider uppercase block leading-none">MILESTONE UNLOCKED!</span>
              <h4 className="font-jersey text-2xl text-white uppercase leading-tight mt-0.5">{achievementPopup.title}</h4>
              <p className="font-jersey text-sm text-white/60 uppercase leading-none mt-1">{achievementPopup.description}</p>
            </div>

            <button 
              onClick={closeAchievementPopup}
              className="absolute top-2 right-2 font-jersey text-xl text-[#ff3f3f] hover:text-white leading-none border-2 border-transparent hover:border-[#ff3f3f] px-1"
            >
              X
            </button>
          </div>
        </div>
      )}

      {/* Photosensitive Style Overrides */}
      {reduceFlashing && (
        <style>{`
          .animate-pulse {
            animation: none !important;
          }
          .animate-bounce {
            animation: none !important;
          }
          .animate-ping {
            animation: none !important;
          }
          .animate-spin {
            animation: none !important;
          }
          * {
            animation-duration: 0s !important;
            transition-duration: 0s !important;
          }
        `}</style>
      )}
    </>
  );
};

export default function App() {
  const { 
    route, 
    profile, 
    audioMuted, 
    toggleMute, 
    setRoute, 
    logout,
    musicVolume,
    sfxVolume,
    setMusicVolume,
    setSfxVolume,
    reduceFlashing,
    setReduceFlashing,
    achievementPopup,
    closeAchievementPopup,
    syncWallet
  } = useStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState<AppRoute>(route);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [wipeProgress, setWipeProgress] = useState(0);

  // Transition handler for route changes (consistent blocky horizontal wipe + retro loading bar)
  useEffect(() => {
    if (route !== activeRoute) {
      setIsTransitioning(true);
      setTransitionProgress(0);
      setWipeProgress(0);
      
      // Step 1: Wipe closes in chunky steps
      let closeStep = 0;
      const closeInterval = setInterval(() => {
        closeStep++;
        audio.playClick(); // Retro chiptune tick per shutter step
        setWipeProgress(closeStep);
        if (closeStep >= 8) {
          clearInterval(closeInterval);
          
          // Switch route inside the covered state
          setActiveRoute(route);
          
          // Step 2: Show loading bar and fill chunkily
          let loadProgress = 0;
          const loadInterval = setInterval(() => {
            loadProgress += 20;
            setTransitionProgress(loadProgress);
            audio.playClick(); // Chunky loading tick
            if (loadProgress >= 100) {
              clearInterval(loadInterval);
              
              // Step 3: Wipe opens in chunky steps
              let openStep = 8;
              const openInterval = setInterval(() => {
                openStep--;
                audio.playClick();
                setWipeProgress(openStep);
                if (openStep <= 0) {
                  clearInterval(openInterval);
                  setIsTransitioning(false);
                }
              }, 40);
            }
          }, 120);
        }
      }, 40);
    }
  }, [route, activeRoute]);

  // Handle music state based on login/mute configuration and active route
  useEffect(() => {
    if (audioMuted) {
      audio.stopMusic();
    } else if (profile.isLoggedIn) {
      if (activeRoute === 'poker') {
        audio.startMusic('poker');
      } else if (activeRoute === 'minigames') {
        audio.startMusic('arcade');
      } else {
        audio.startMusic('lobby');
      }
    } else {
      audio.startMusic('login');
    }
    return () => {
      audio.stopMusic();
    };
  }, [profile.isLoggedIn, activeRoute, audioMuted]);

  // Unlocking audio context on first user click
  useEffect(() => {
    const unlock = () => {
      audio.playClick();
      window.removeEventListener('click', unlock);
    };
    window.addEventListener('click', unlock);
    return () => window.removeEventListener('click', unlock);
  }, []);

  // Synchronize backend wallet and local state on startup
  useEffect(() => {
    if (profile.isLoggedIn) {
      syncWallet();
    }
  }, []);

  // Auto-dismiss achievements popup
  useEffect(() => {
    if (achievementPopup) {
      const timer = setTimeout(() => {
        closeAchievementPopup();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievementPopup, closeAchievementPopup]);

  const renderLoadingOverlay = () => {
    return (
      <div className="fixed inset-0 z-[100] pointer-events-auto flex flex-col justify-between">
        {/* Horizontal shutter bars */}
        <div className="absolute inset-0 flex flex-col pointer-events-none">
          {Array.from({ length: 8 }).map((_, idx) => {
            const isCovered = wipeProgress > idx;
            return (
              <div 
                key={idx}
                className="h-[12.5%] w-full bg-[#000000] transition-all duration-0"
                style={{
                  opacity: isCovered ? 1 : 0,
                }}
              />
            );
          })}
        </div>

        {/* Loading core panel */}
        {wipeProgress >= 8 && (
          <div className="absolute inset-0 bg-[#000000] flex flex-col items-center justify-center select-none font-jersey px-4">
            <div 
              className="border-4 border-[#ff9f00] bg-[#111111] p-8 max-w-sm w-full text-center relative"
              style={{
                clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)',
                boxShadow: '6px 6px 0px #000000',
              }}
            >
              {/* Flashing insertion prompt */}
              <div className={`text-4xl text-[#ff9f00] tracking-widest uppercase mb-2 ${reduceFlashing ? '' : 'animate-pulse'}`}>
                INSERT COIN
              </div>
              
              <div className="text-lg text-white tracking-wider uppercase mb-6">
                LOADING CONSOLE STACK...
              </div>

              {/* Segmented Progress Bar */}
              <div className="border-4 border-[#ff9f00] bg-[#000000] p-1 h-12 flex items-center gap-1">
                {Array.from({ length: 10 }).map((_, idx) => {
                  const filled = transitionProgress >= (idx + 1) * 10;
                  return (
                    <div
                      key={idx}
                      className={`h-full flex-1 transition-all duration-0 ${
                        filled ? 'bg-[#ff9f00]' : 'bg-transparent'
                      }`}
                      style={{
                        border: filled ? '2px solid #000000' : 'none'
                      }}
                    />
                  );
                })}
              </div>

              <div className="text-xs text-[#5a5a72] mt-4 uppercase tracking-widest leading-none">
                CABINET BAY ACTIVE ({transitionProgress}%)
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // If not logged in, force LoginScreen scene
  if (!profile.isLoggedIn || activeRoute === 'login') {
    return (
      <div className="min-h-screen bg-[#000000] relative">
        <LoginScreen />
        <PixelToast />
        
        {/* Render loading overlay on login route transitions too! */}
        {isTransitioning && renderLoadingOverlay()}
      </div>
    );
  }

  // Choose the active viewport screen based on our active route state
  const renderActiveScreen = () => {
    switch (activeRoute) {
      case 'lobby':
        return <LobbyScreen onOpenSettings={() => setIsSettingsOpen(true)} />;
      case 'poker':
        return <PokerScreen />;
      case 'minigames':
        return <MinigamesScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <LobbyScreen onOpenSettings={() => setIsSettingsOpen(true)} />;
    }
  };

  // If activeRoute is 'lobby' or 'poker', bypass the global header/footer structure completely
  if (activeRoute === 'lobby' || activeRoute === 'poker') {
    return (
      <div className="min-h-screen bg-[#0B0D18] text-[#F3EBD8]">
        {activeRoute === 'lobby' ? (
          <LobbyScreen onOpenSettings={() => setIsSettingsOpen(true)} />
        ) : (
          <PokerScreen />
        )}
        
        <GlobalAppOverlays
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          audioMuted={audioMuted}
          toggleMute={toggleMute}
          musicVolume={musicVolume}
          setMusicVolume={setMusicVolume}
          sfxVolume={sfxVolume}
          setSfxVolume={setSfxVolume}
          reduceFlashing={reduceFlashing}
          setReduceFlashing={setReduceFlashing}
          isTransitioning={isTransitioning}
          renderLoadingOverlay={renderLoadingOverlay}
          achievementPopup={achievementPopup}
          closeAchievementPopup={closeAchievementPopup}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] pixel-dots text-white flex flex-col justify-between">
      {/* 1. Global Persistent Header Console */}
      <header className="relative z-30 border-b-4 border-[#ff9f00] bg-[#111111] px-4 py-3 filter drop-shadow-[0px_4px_0px_#000000]">
        <div className="w-[96%] xl:w-[94%] max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand / Ticker sign */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setRoute('lobby')}
          >
            <span className="text-4xl text-[#ff9f00] leading-none animate-pulse">🎰</span>
            <div>
              <h1 className="text-3xl font-jersey text-[#ff9f00] tracking-widest uppercase leading-none m-0 select-none">
                8bit Casino
              </h1>
              <p className="text-[10px] font-jersey text-white/80 tracking-widest uppercase m-0 mt-0.5 leading-none">
                play tokens arcade cabinet
              </p>
            </div>
          </div>

          {/* Interactive Player HUD Panel */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            
            {/* Player Avatar Index & Name Badge */}
            <PixelButton
              variant="dark"
              onClick={() => setRoute('profile')}
              chamfer={6}
              size="sm"
              className="h-[42px] px-3"
              title="View player profile stats"
            >
              <div className="flex items-center gap-2 h-full">
                <PixelAvatar avatarId={profile.avatarId} googlePicture={profile.googlePicture} size={22} />
                <span className="font-jersey text-xl text-white uppercase leading-none pt-0.5">
                  {profile.name}
                </span>
              </div>
            </PixelButton>

            {/* Stepped Coin Ticker counter */}
            <PixelCoinCounter 
              value={profile.chips} 
              className="h-[42px]"
            />

            {/* Audio Toggle button in top bar */}
            <PixelButton
              variant={audioMuted ? 'gold' : 'dark'}
              onClick={toggleMute}
              chamfer={6}
              size="sm"
              className="px-3 h-[42px] flex items-center justify-center"
              title={audioMuted ? "Unmute chiptunes" : "Mute chiptunes"}
            >
              <div className="flex items-center justify-center h-full">
                {audioMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
              </div>
            </PixelButton>

            {/* Global Settings button */}
            <PixelButton
              variant="dark"
              onClick={() => setIsSettingsOpen(true)}
              chamfer={6}
              size="sm"
              className="px-3 h-[42px] flex items-center justify-center"
              title="Global sound and cabinet settings"
            >
              <div className="flex items-center justify-center h-full">
                <Settings className="w-5 h-5 text-white" />
              </div>
            </PixelButton>

            {/* Micro Logout trigger as a beautifully integrated red arcade button */}
            <PixelButton
              variant="red"
              onClick={() => {
                if (confirm('RETURN TO MAIN TITLE SCREEN?')) logout();
              }}
              chamfer={6}
              size="sm"
              className="px-3 h-[42px] flex items-center justify-center gap-1.5 font-jersey"
              title="Return to Title screen"
            >
              <LogOut className="w-4 h-4 text-white" />
              <span className="text-white text-lg leading-none pt-0.5">EXIT</span>
            </PixelButton>
          </div>
        </div>
      </header>

      {/* 2. Main Router Workspace container */}
      <main className="flex-1 w-[96%] xl:w-[94%] max-w-[1800px] mx-auto p-4 md:p-6 relative z-10">
        {renderActiveScreen()}
      </main>

      {/* 3. Global quick-navigation dock (chunky status bar at bottom) */}
      <footer className="relative z-20 border-t-4 border-[#ff9f00] bg-[#111111] py-3 px-4 filter drop-shadow-[0px_-4px_0px_#000]">
        <div className="w-[96%] xl:w-[94%] max-w-[1800px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Quick-select navigation tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-row justify-center gap-2 sm:gap-2.5 w-full lg:w-auto">
            <PixelButton
              variant={route === 'lobby' ? 'gold' : 'dark'}
              onClick={() => setRoute('lobby')}
              chamfer={6}
              className="w-full lg:w-auto"
            >
              <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm py-0.5">
                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="whitespace-nowrap">CONCOURSE LOBBY</span>
              </div>
            </PixelButton>

            <PixelButton
              variant={route === 'poker' ? 'gold' : 'dark'}
              onClick={() => setRoute('poker')}
              chamfer={6}
              className="w-full lg:w-auto"
            >
              <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm py-0.5">
                <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="whitespace-nowrap">TEXAS SALOON</span>
              </div>
            </PixelButton>

            <PixelButton
              variant={route === 'minigames' ? 'gold' : 'dark'}
              onClick={() => setRoute('minigames')}
              chamfer={6}
              className="w-full lg:w-auto"
            >
              <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm py-0.5">
                <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="whitespace-nowrap">COIN-OP ARCADE</span>
              </div>
            </PixelButton>

            <PixelButton
              variant={route === 'profile' ? 'gold' : 'dark'}
              onClick={() => setRoute('profile')}
              chamfer={6}
              className="w-full lg:w-auto"
            >
              <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm py-0.5">
                <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="whitespace-nowrap">SETTINGS VAULT</span>
              </div>
            </PixelButton>
          </div>

          {/* Legal status banner */}
          <div className="text-center lg:text-right">
            <p className="font-jersey text-[#5a5a72] text-sm uppercase m-0 leading-none">
              ★ CABINET EMULATOR v1.0 • TOKENS GRANTED WEEKLY • PURE PLAY COINS NO REAL VALUE ★
            </p>
          </div>
        </div>
      </footer>

      <GlobalAppOverlays
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        audioMuted={audioMuted}
        toggleMute={toggleMute}
        musicVolume={musicVolume}
        setMusicVolume={setMusicVolume}
        sfxVolume={sfxVolume}
        setSfxVolume={setSfxVolume}
        reduceFlashing={reduceFlashing}
        setReduceFlashing={setReduceFlashing}
        isTransitioning={isTransitioning}
        renderLoadingOverlay={renderLoadingOverlay}
        achievementPopup={achievementPopup}
        closeAchievementPopup={closeAchievementPopup}
      />
    </div>
  );
}
