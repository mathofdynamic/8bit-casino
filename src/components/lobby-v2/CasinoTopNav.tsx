/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from '../../store';
import { Search, Bell, Settings, LogOut, Menu } from 'lucide-react';
import { CasinoNavItem } from '../ui-v2';
import { PixelAvatar } from '../../lib/avatars';
import { audio } from '../../lib/audio';

type CasinoTopNavProps = {
  variant?: 'default';
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterFavoritesOnly: boolean;
  setFilterFavoritesOnly: (f: boolean) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  onOpenSettings?: () => void;
  handleScrollTo: (id: string) => void;
} | {
  variant: 'gameplay';
  onOpenSettings?: () => void;
  navigationLocked?: boolean;
  navigationLockedMessage?: string;
};

export const CasinoTopNav: React.FC<CasinoTopNavProps> = (props) => {
  const { route, profile, setRoute, triggerToast, logout } = useStore();
  const isGameplay = props.variant === 'gameplay';
  const navigationLocked = isGameplay ? props.navigationLocked : false;
  const lockedMsg = isGameplay ? props.navigationLockedMessage : 'NAVIGATION BLOCKED!';

  const handleNav = (targetRoute: string, customAction?: () => void) => {
    if (navigationLocked) {
      audio.playLoss();
      triggerToast(lockedMsg || 'STAND & EXIT THE TABLE BEFORE LEAVING THIS MATCH.', 'error');
      return;
    }
    audio.playClick();
    if (customAction) customAction();
    if (targetRoute) setRoute(targetRoute as any);
  };

  const handleLiveCasinoToast = () => {
    if (navigationLocked) {
      handleNav('');
      return;
    }
    audio.playClick();
    triggerToast('LIVE CASINO STREAM IS CURRENTLY DOWN FOR RE-MAINTENANCE!', 'info');
  };

  const handleLogoutWithConfirmation = () => {
    if (navigationLocked) {
      handleNav('');
      return;
    }
    audio.playClick();
    if (confirm('RETURN TO MAIN TITLE SCREEN?')) {
      logout();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#15182A] border-b-2 border-[#2E3150] md:h-16 h-14 shrink-0 flex items-center px-6 justify-between select-none">
      
      {/* Left branding and hamburger */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger menu toggle */}
        {!isGameplay && (
          <button 
            onClick={() => {
              audio.playClick();
              if (props.variant !== 'gameplay') props.setIsMobileMenuOpen(true);
            }}
            className="md:hidden text-[#9A9AB5] hover:text-[#F3EBD8] cursor-pointer focus:outline-none"
            aria-label="Open side navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        
        <button 
          onClick={() => {
            handleNav('lobby', () => {
              if (props.variant !== 'gameplay') props.setFilterFavoritesOnly(false);
            });
          }}
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6B73C] p-1 border-none bg-transparent select-none text-left w-[180px] md:w-[190px]"
        >
          <span className="text-2xl text-[#F6B73C] leading-none">🎰</span>
          <span className="text-2xl font-jersey text-[#F6B73C] tracking-widest uppercase leading-none pt-0.5">
            8bit Casino
          </span>
        </button>

        {/* Nav links (hidden on mobile, visible on desktop/tablet) */}
        <nav className="hidden md:flex items-center ml-6 h-16">
          <CasinoNavItem 
            active={!isGameplay && route === 'lobby' && (!isGameplay && !props.filterFavoritesOnly)} 
            onClick={() => handleNav('lobby', () => {
              if (props.variant !== 'gameplay') props.setFilterFavoritesOnly(false);
            })}
          >
            Lobby
          </CasinoNavItem>
          <CasinoNavItem active={!isGameplay && route === 'minigames'} onClick={() => handleNav('minigames')}>
            Slots
          </CasinoNavItem>
          <CasinoNavItem active={isGameplay || route === 'poker'} onClick={() => handleNav('poker')}>
            Table Games
          </CasinoNavItem>
          <CasinoNavItem active={false} onClick={handleLiveCasinoToast}>
            Live Casino
          </CasinoNavItem>
          <CasinoNavItem active={false} onClick={() => {
            if (navigationLocked) {
              handleNav('');
            } else {
              if (props.variant !== 'gameplay') props.handleScrollTo('tournaments');
            }
          }}>
            Tournaments
          </CasinoNavItem>
        </nav>
      </div>

      {/* Right HUD items */}
      <div className="flex items-center gap-4">
        
        {/* Search container (hidden on mobile, visible on desktop/tablet) */}
        {!isGameplay && (
          <div className="hidden sm:flex items-center bg-[#0B0D18] border border-[#2E3150] px-2.5 h-9" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
            <Search className="w-4 h-4 text-[#63657A]" />
            <input 
              type="text" 
              placeholder="SEARCH GAMES..." 
              value={props.variant !== 'gameplay' ? props.searchQuery : ''}
              onChange={(e) => {
                if (props.variant !== 'gameplay') props.setSearchQuery(e.target.value);
              }}
              className="bg-transparent font-jersey text-base border-none outline-none w-32 lg:w-52 ml-2 text-[#F3EBD8] placeholder-[#63657A] focus:ring-0 leading-none"
            />
          </div>
        )}

        {/* Notification badge button */}
        <button 
          onClick={() => {
            audio.playClick();
            triggerToast('YOUR MAILBOX IS CURRENTLY SECURED!', 'info');
          }}
          className="relative p-1.5 text-[#9A9AB5] hover:text-[#F3EBD8] cursor-pointer"
          aria-label="View system notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#D95F9A] border border-black" />
        </button>

        {/* Stepped Coin Ticker HUD */}
        <button 
          className="p-[2px] bg-[#F6B73C] hover:opacity-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6B73C] select-none text-left border-none" 
          style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }} 
          onClick={() => handleNav('profile')}
        >
          <div className="bg-[#15182A] px-2.5 py-1.5 flex items-center gap-1.5" style={{ clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)' }}>
            {/* Coin icon SVG */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none">
              <path d="M6 1h4v1H6V1zM4 2h2v1H4V2zm6 0h2v1h-2V2zM2 4h2v1H2V4zm10 0h2v1h-2V4zM1 6h1v4H1V6zm13 0h1v4h-1V6zM2 11h2v1H2v-1zm10 0h2v1h-2v-1zm-6 2h4v1H6v-1z" fill="#F6B73C"/>
              <rect x="5" y="4" width="6" height="8" fill="#FFC85E"/>
              <rect x="7" y="5" width="2" height="6" fill="#F6B73C"/>
            </svg>
            <span className="text-lg font-bold text-[#F6B73C] pt-0.5 leading-none">
              {profile.chips.toFixed(2)} COINS
            </span>
          </div>
        </button>

        {/* Profile Quick Link */}
        <button 
          onClick={() => handleNav('profile')}
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 pl-3 border-l border-[#2E3150] h-9 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6B73C] bg-transparent border-t-0 border-r-0 border-b-0 text-left select-none"
        >
          <PixelAvatar avatarId={profile.avatarId} googlePicture={profile.googlePicture} size={28} />
          <span className="hidden lg:inline font-jersey text-lg text-[#F3EBD8] uppercase leading-none pt-0.5">
            {profile.name}
          </span>
        </button>

        {/* Quick Settings Icon */}
        {props.onOpenSettings && (
          <button 
            onClick={() => {
              audio.playClick();
              if (props.onOpenSettings) props.onOpenSettings();
            }}
            className="hidden sm:inline-flex p-1.5 text-[#9A9AB5] hover:text-[#F3EBD8] cursor-pointer"
            aria-label="Open settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}

        {/* Log Out Icon */}
        <button 
          onClick={handleLogoutWithConfirmation}
          className="hidden sm:inline-flex p-1.5 text-[#9A9AB5] hover:text-[#E85D68] cursor-pointer"
          aria-label="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
