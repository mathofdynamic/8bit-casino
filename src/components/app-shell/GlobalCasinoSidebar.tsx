/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from '../../store';
import { 
  Home, Heart, Gamepad2, Gift, Target, Trophy, Crown, 
  Settings, HelpCircle, LogOut 
} from 'lucide-react';
import { CasinoSidebarItem } from '../ui-v2';
import { audio } from '../../lib/audio';

export interface GlobalCasinoSidebarProps {
  routeMode: 'lobby' | 'poker';
  activeItem?: 'home' | 'favorites' | 'recent' | 'rewards' | 'missions' | 'tournaments' | 'vip' | 'settings' | 'help';
  favoritesCount: number;

  onHome: () => void;
  onFavorites: () => void;
  onRecentlyPlayed: () => void;
  onRewards: () => void;
  onMissions: () => void;
  onTournaments: () => void;
  onVip: () => void;
  onSettings: () => void;
  onHelp: () => void;

  onNavigate?: () => void;
  variant?: 'desktop' | 'drawer';
}

export const GlobalCasinoSidebar: React.FC<GlobalCasinoSidebarProps> = ({
  routeMode,
  activeItem,
  favoritesCount,
  onHome,
  onFavorites,
  onRecentlyPlayed,
  onRewards,
  onMissions,
  onTournaments,
  onVip,
  onSettings,
  onHelp,
  onNavigate,
  variant = 'desktop',
}) => {
  const { logout } = useStore();

  const handleAction = (callback: () => void) => {
    audio.playClick();
    if (onNavigate) {
      onNavigate();
    }
    callback();
  };

  const handleLogoutWithConfirmation = () => {
    audio.playLoss();
    if (confirm('RETURN TO MAIN TITLE SCREEN?')) {
      if (onNavigate) {
        onNavigate();
      }
      logout();
    }
  };

  const listContent = (
    <div className="flex flex-col justify-between h-full select-none font-jersey">
      
      {/* Upper Navigation Items List */}
      <div className="space-y-[6px]">
        <CasinoSidebarItem 
          active={activeItem === 'home'} 
          onClick={() => handleAction(onHome)}
          icon={<Home size={20} />}
        >
          Home
        </CasinoSidebarItem>

        <CasinoSidebarItem 
          active={activeItem === 'favorites'} 
          onClick={() => handleAction(onFavorites)}
          icon={<Heart size={20} />}
        >
          Favorites ({favoritesCount})
        </CasinoSidebarItem>

        <CasinoSidebarItem 
          active={activeItem === 'recent'}
          onClick={() => handleAction(onRecentlyPlayed)}
          icon={<Gamepad2 size={20} />}
        >
          Recently Played
        </CasinoSidebarItem>

        <CasinoSidebarItem 
          active={activeItem === 'rewards'}
          onClick={() => handleAction(onRewards)}
          icon={<Gift size={20} />}
        >
          Rewards
        </CasinoSidebarItem>

        <CasinoSidebarItem 
          active={activeItem === 'missions'}
          onClick={() => handleAction(onMissions)}
          icon={<Target size={20} />}
        >
          Missions
        </CasinoSidebarItem>

        <CasinoSidebarItem 
          active={activeItem === 'tournaments'}
          onClick={() => handleAction(onTournaments)}
          icon={<Trophy size={20} />}
        >
          Tournaments
        </CasinoSidebarItem>

        <CasinoSidebarItem 
          active={activeItem === 'vip'}
          onClick={() => handleAction(onVip)}
          icon={<Crown size={20} />}
        >
          VIP Club
        </CasinoSidebarItem>
      </div>

      {/* Lower Navigation Items List + Footer Disclaimer */}
      <div className="mt-8 space-y-[6px]">
        <div className="border-t border-[#2E3150] pt-4 space-y-[6px]">
          <CasinoSidebarItem 
            active={activeItem === 'settings'}
            onClick={() => handleAction(onSettings)}
            icon={<Settings size={20} />}
          >
            Settings
          </CasinoSidebarItem>

          <CasinoSidebarItem 
            active={activeItem === 'help'}
            onClick={() => handleAction(onHelp)}
            icon={<HelpCircle size={20} />}
          >
            Help
          </CasinoSidebarItem>

          <CasinoSidebarItem 
            onClick={handleLogoutWithConfirmation}
            icon={<LogOut size={20} className="text-[#E85D68]" />}
            className="hover:bg-[#E85D68]/10"
          >
            Log Out
          </CasinoSidebarItem>
        </div>

        {/* play-coins-only disclaimer footer */}
        <div className="pt-3">
          <p className="font-jersey text-[#63657A] text-[10px] uppercase tracking-wider leading-tight text-center border border-dashed border-[#2E3150]/40 p-1.5">
            PLAY COINS ONLY<br />— NO REAL VALUE —
          </p>
        </div>
      </div>

    </div>
  );

  if (variant === 'drawer') {
    return <div className="h-full flex flex-col justify-between">{listContent}</div>;
  }

  return (
    <aside className="w-[216px] shrink-0 bg-[#15182A] border-r-2 border-[#2E3150] p-3 flex flex-col justify-between h-[calc(100vh-64px)] overflow-y-auto">
      {listContent}
    </aside>
  );
};
