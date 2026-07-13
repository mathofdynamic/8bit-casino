/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { 
  Flame, Heart, Trophy, Gamepad2, Crown, 
  Home, Coins, Bot, History, Target, Gift,
  Settings, HelpCircle, LogOut, ChevronDown, ChevronRight
} from 'lucide-react';
import { CasinoSidebarItem } from '../ui-v2';
import { audio } from '../../lib/audio';

interface GlobalCasinoSidebarProps {
  filterFavoritesOnly: boolean;
  setFilterFavoritesOnly: (f: boolean) => void;
  favoritesCount: number;
  handleScrollTo: (id: string) => void;
  onOpenSettings?: () => void;
  setIsHelpModalOpen: (open: boolean) => void;
  setIsMobileMenuOpen?: (open: boolean) => void;
  // Poker specific
  activePokerView?: 'home' | 'cash' | 'sitgo' | 'favorites' | 'recent';
  setActivePokerView?: (view: 'home' | 'cash' | 'sitgo' | 'favorites' | 'recent') => void;
  onFocusPokerMissions?: () => void;
}

export const GlobalCasinoSidebar: React.FC<GlobalCasinoSidebarProps> = ({
  filterFavoritesOnly,
  setFilterFavoritesOnly,
  favoritesCount,
  handleScrollTo,
  onOpenSettings,
  setIsHelpModalOpen,
  setIsMobileMenuOpen,
  activePokerView = 'home',
  setActivePokerView,
  onFocusPokerMissions,
}) => {
  const { route, setRoute, logout, triggerToast } = useStore();

  // Accordion open/close states
  const [isLobbyOpen, setIsLobbyOpen] = useState(route === 'lobby');
  const [isPokerOpen, setIsPokerOpen] = useState(route === 'poker');
  const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(true);

  // Sync state if route changes
  useEffect(() => {
    if (route === 'lobby') {
      setIsLobbyOpen(true);
    } else if (route === 'poker') {
      setIsPokerOpen(true);
    }
  }, [route]);

  const handleItemClick = (callback: () => void) => {
    audio.playClick();
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    callback();
  };

  const handleLogoutWithConfirmation = () => {
    audio.playClick();
    if (confirm('RETURN TO MAIN TITLE SCREEN?')) {
      if (setIsMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
      logout();
    }
  };

  // Lobby navigation handlers
  const handleLobbyHomeClick = () => {
    handleItemClick(() => {
      setFilterFavoritesOnly(false);
      setRoute('lobby');
    });
  };

  const handleLobbyFavoritesClick = () => {
    handleItemClick(() => {
      setFilterFavoritesOnly(true);
      setRoute('lobby');
    });
  };

  const handleLobbyScrollClick = (id: string) => {
    handleItemClick(() => {
      if (route !== 'lobby') {
        setRoute('lobby');
        // Let state settle, then scroll
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        handleScrollTo(id);
      }
    });
  };

  const handleLobbyTournamentsClick = () => {
    handleItemClick(() => {
      if (route !== 'lobby') {
        setRoute('lobby');
        setTimeout(() => {
          const el = document.getElementById('tournaments');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        handleScrollTo('tournaments');
      }
    });
  };

  // Poker Room navigation handlers
  const handlePokerViewClick = (view: 'home' | 'cash' | 'sitgo' | 'favorites' | 'recent') => {
    handleItemClick(() => {
      if (route !== 'poker') {
        setRoute('poker');
      }
      if (setActivePokerView) {
        setActivePokerView(view);
      }
    });
  };

  const handlePokerMissionsClick = () => {
    handleItemClick(() => {
      if (route !== 'poker') {
        setRoute('poker');
        setTimeout(() => {
          if (onFocusPokerMissions) {
            onFocusPokerMissions();
          } else {
            const el = document.getElementById('poker-missions');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      } else {
        if (onFocusPokerMissions) {
          onFocusPokerMissions();
        } else {
          const el = document.getElementById('poker-missions');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  };

  const toggleLobbyAccordion = () => {
    audio.playClick();
    setIsLobbyOpen(!isLobbyOpen);
  };

  const togglePokerAccordion = () => {
    audio.playClick();
    setIsPokerOpen(!isPokerOpen);
  };

  const toggleUtilitiesAccordion = () => {
    audio.playClick();
    setIsUtilitiesOpen(!isUtilitiesOpen);
  };

  return (
    <aside className="w-[216px] shrink-0 bg-[#15182A] border-r-2 border-[#2E3150] p-3 flex flex-col justify-between h-[calc(100vh-64px)] overflow-y-auto select-none font-jersey">
      
      {/* Category Accordions List */}
      <div className="space-y-4">
        
        {/* Category 1: CASINO LOBBY */}
        <div className="space-y-1">
          <button 
            onClick={toggleLobbyAccordion}
            className="w-full flex items-center justify-between py-1 px-1.5 border border-[#2E3150] bg-[#1d2036]/80 text-[#9A9AB5] hover:text-[#F3EBD8] font-jersey text-sm uppercase tracking-widest cursor-pointer select-none"
            style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}
          >
            <span className="flex items-center gap-1.5">
              <span className="text-xs">🎰</span>
              <span>CASINO FLOOR</span>
            </span>
            {isLobbyOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {isLobbyOpen && (
            <div className="space-y-1 pt-1 pl-1">
              <CasinoSidebarItem 
                active={route === 'lobby' && !filterFavoritesOnly} 
                onClick={handleLobbyHomeClick}
                icon={<Flame className="w-4 h-4" />}
              >
                Home
              </CasinoSidebarItem>
              <CasinoSidebarItem 
                active={route === 'lobby' && filterFavoritesOnly} 
                onClick={handleLobbyFavoritesClick}
                icon={<Heart className="w-4 h-4" />}
              >
                Favorites ({favoritesCount})
              </CasinoSidebarItem>
              <CasinoSidebarItem 
                onClick={() => handleLobbyScrollClick('continue-playing')}
                icon={<Gamepad2 className="w-4 h-4" />}
              >
                Recently Played
              </CasinoSidebarItem>
              <CasinoSidebarItem 
                onClick={() => handleLobbyScrollClick('daily-rewards')}
                icon={<Gift className="w-4 h-4" />}
              >
                Rewards
              </CasinoSidebarItem>
              <CasinoSidebarItem 
                onClick={() => handleLobbyScrollClick('missions')}
                icon={<Target className="w-4 h-4" />}
              >
                Missions
              </CasinoSidebarItem>
              <CasinoSidebarItem 
                onClick={handleLobbyTournamentsClick}
                icon={<Trophy className="w-4 h-4" />}
              >
                Tournaments
              </CasinoSidebarItem>
              <CasinoSidebarItem 
                onClick={() => handleItemClick(() => triggerToast('VIP CLUB REQUIRES HIGHER PLAYER XP LEVEL!', 'info'))}
                icon={<Crown className="w-4 h-4" />}
              >
                VIP Club
              </CasinoSidebarItem>
            </div>
          )}
        </div>

        {/* Category 2: CABINET SERVICES */}
        <div className="space-y-1">
          <button 
            onClick={togglePokerAccordion}
            className="w-full flex items-center justify-between py-1 px-1.5 border border-[#2E3150] bg-[#1d2036]/80 text-[#9A9AB5] hover:text-[#F3EBD8] font-jersey text-sm uppercase tracking-widest cursor-pointer select-none"
            style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}
          >
            <span className="flex items-center gap-1.5">
              <span className="text-xs">♠️</span>
              <span>POKER ROOM</span>
            </span>
            {isPokerOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {isPokerOpen && (
            <div className="space-y-1 pt-1 pl-1">
              <CasinoSidebarItem 
                active={route === 'poker' && activePokerView === 'home'} 
                onClick={() => handlePokerViewClick('home')}
                icon={<Home className="w-4 h-4" />}
              >
                Poker Home
              </CasinoSidebarItem>
              <CasinoSidebarItem 
                active={route === 'poker' && activePokerView === 'cash'} 
                onClick={() => handlePokerViewClick('cash')}
                icon={<Coins className="w-4 h-4" />}
              >
                Cash Games
              </CasinoSidebarItem>
              <CasinoSidebarItem 
                active={route === 'poker' && activePokerView === 'sitgo'} 
                onClick={() => handlePokerViewClick('sitgo')}
                icon={<Bot className="w-4 h-4" />}
              >
                Sit & Go
              </CasinoSidebarItem>
              <CasinoSidebarItem 
                active={route === 'poker' && activePokerView === 'favorites'} 
                onClick={() => handlePokerViewClick('favorites')}
                icon={<Heart className="w-4 h-4" />}
              >
                Poker Favorites
              </CasinoSidebarItem>
              <CasinoSidebarItem 
                active={route === 'poker' && activePokerView === 'recent'} 
                onClick={() => handlePokerViewClick('recent')}
                icon={<History className="w-4 h-4" />}
              >
                Poker Recents
              </CasinoSidebarItem>
              <CasinoSidebarItem 
                onClick={handlePokerMissionsClick}
                icon={<Target className="w-4 h-4" />}
              >
                Poker Missions
              </CasinoSidebarItem>
            </div>
          )}
        </div>

        {/* Category 3: UTILITIES */}
        <div className="space-y-1">
          <button 
            onClick={toggleUtilitiesAccordion}
            className="w-full flex items-center justify-between py-1 px-1.5 border border-[#2E3150] bg-[#1d2036]/80 text-[#9A9AB5] hover:text-[#F3EBD8] font-jersey text-sm uppercase tracking-widest cursor-pointer select-none"
            style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}
          >
            <span className="flex items-center gap-1.5">
              <span className="text-xs">⚙️</span>
              <span>UTILITIES</span>
            </span>
            {isUtilitiesOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {isUtilitiesOpen && (
            <div className="space-y-1 pt-1 pl-1">
              {onOpenSettings && (
                <CasinoSidebarItem 
                  onClick={() => handleItemClick(onOpenSettings)}
                  icon={<Settings className="w-4 h-4" />}
                >
                  Settings
                </CasinoSidebarItem>
              )}
              <CasinoSidebarItem 
                onClick={() => handleItemClick(() => setIsHelpModalOpen(true))}
                icon={<HelpCircle className="w-4 h-4" />}
              >
                Help
              </CasinoSidebarItem>
              <CasinoSidebarItem 
                onClick={handleLogoutWithConfirmation}
                icon={<LogOut className="w-4 h-4 text-[#E85D68]" />}
                className="hover:bg-[#E85D68]/10"
              >
                Log Out
              </CasinoSidebarItem>
            </div>
          )}
        </div>

      </div>

      {/* play-coins-only disclaimer footer */}
      <div className="mt-8 pt-3 border-t border-[#2E3150] text-center">
        <p className="font-jersey text-[#63657A] text-[10px] uppercase tracking-wider leading-tight border border-dashed border-[#2E3150]/40 p-1.5">
          PLAY COINS ONLY<br />— NO REAL VALUE —
        </p>
      </div>

    </aside>
  );
};
