/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useStore, AppRoute, ToastState } from './store';
import { audio } from './lib/audio';
import { LoginScreen } from './components/LoginScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { PokerScreen } from './components/PokerScreen';
import { MinigamesScreen } from './components/MinigamesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { RouteTransitionOverlay } from './components/app-shell/RouteTransitionOverlay';
import { GlobalSettingsDialog } from './components/app-shell/GlobalSettingsDialog';
import {
  GlobalAchievementBanner,
  type AchievementPopupData,
} from './components/app-shell/GlobalAchievementBanner';
import { GlobalToastNotification } from './components/app-shell/GlobalToastNotification';
import { PixelCoinCounter, PixelButton } from './components/PixelUI';
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
  achievementPopup: AchievementPopupData | null;
  closeAchievementPopup: () => void;
  toast: ToastState;
  closeToast: () => void;
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
  toast,
  closeToast,
}) => {
  return (
    <>
      {/* Global Toast Notification */}
      <GlobalToastNotification
        toast={toast}
        onAutoDismiss={closeToast}
        onDismiss={() => {
          audio.playClick();
          closeToast();
        }}
      />

      {/* Global V2 Settings Dialog */}
      <GlobalSettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        audioMuted={audioMuted}
        onToggleMute={toggleMute}
        musicVolume={musicVolume}
        onMusicVolumeChange={setMusicVolume}
        sfxVolume={sfxVolume}
        onSfxVolumeChange={setSfxVolume}
        reduceFlashing={reduceFlashing}
        onReduceFlashingChange={setReduceFlashing}
      />

      {/* Global Wipe / Loading Overlay */}
      {isTransitioning && renderLoadingOverlay()}

      {/* Global V2 Achievement Banner */}
      <GlobalAchievementBanner
        achievement={achievementPopup}
        onClose={closeAchievementPopup}
      />

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
    syncWallet,
    toast,
    closeToast
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

  const renderLoadingOverlay = () => {
    return (
      <RouteTransitionOverlay
        wipeProgress={wipeProgress}
        transitionProgress={transitionProgress}
        destinationRoute={route}
        reduceFlashing={reduceFlashing}
      />
    );
  };

  // If not logged in, force LoginScreen scene
  if (!profile.isLoggedIn || activeRoute === 'login') {
    return (
      <div className="min-h-screen bg-[#000000] relative">
        <LoginScreen />
        <GlobalToastNotification
          toast={toast}
          onAutoDismiss={closeToast}
          onDismiss={() => {
            audio.playClick();
            closeToast();
          }}
        />
        
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
        return <MinigamesScreen onOpenSettings={() => setIsSettingsOpen(true)} />;
      case 'profile':
        return <ProfileScreen onOpenSettings={() => setIsSettingsOpen(true)} />;
      default:
        return <LobbyScreen onOpenSettings={() => setIsSettingsOpen(true)} />;
    }
  };

  // If activeRoute is 'lobby', 'poker', 'profile', or 'minigames', bypass the global header/footer structure completely
  if (activeRoute === 'lobby' || activeRoute === 'poker' || activeRoute === 'profile' || activeRoute === 'minigames') {
    return (
      <div className="min-h-screen bg-[#0B0D18] text-[#F3EBD8]">
        {activeRoute === 'lobby' && (
          <LobbyScreen onOpenSettings={() => setIsSettingsOpen(true)} />
        )}
        {activeRoute === 'poker' && (
          <PokerScreen onOpenSettings={() => setIsSettingsOpen(true)} />
        )}
        {activeRoute === 'profile' && (
          <ProfileScreen onOpenSettings={() => setIsSettingsOpen(true)} />
        )}
        {activeRoute === 'minigames' && (
          <MinigamesScreen onOpenSettings={() => setIsSettingsOpen(true)} />
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
          toast={toast}
          closeToast={closeToast}
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
        toast={toast}
        closeToast={closeToast}
      />
    </div>
  );
}
