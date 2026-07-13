/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from '../../store';
import { Flame, Heart, Gamepad2, Gift, ClipboardList, Trophy, Crown, Settings, HelpCircle, LogOut } from 'lucide-react';
import { CasinoSidebarItem } from '../ui-v2';
import { audio } from '../../lib/audio';

interface CasinoSidebarProps {
  filterFavoritesOnly: boolean;
  setFilterFavoritesOnly: (f: boolean) => void;
  favoritesCount: number;
  handleScrollTo: (id: string) => void;
  onOpenSettings?: () => void;
  setIsHelpModalOpen: (open: boolean) => void;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export const SidebarContentItems: React.FC<CasinoSidebarProps> = ({
  filterFavoritesOnly,
  setFilterFavoritesOnly,
  favoritesCount,
  handleScrollTo,
  onOpenSettings,
  setIsHelpModalOpen,
  setIsMobileMenuOpen,
}) => {
  const { logout, triggerToast } = useStore();

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

  return (
    <div className="flex flex-col h-full justify-between font-jersey text-left select-none">
      <div className="space-y-1.5">
        <CasinoSidebarItem 
          active={!filterFavoritesOnly} 
          onClick={() => handleItemClick(() => setFilterFavoritesOnly(false))}
          icon={<Flame className="w-5 h-5" />}
        >
          Home
        </CasinoSidebarItem>
        <CasinoSidebarItem 
          active={filterFavoritesOnly} 
          onClick={() => handleItemClick(() => setFilterFavoritesOnly(true))}
          icon={<Heart className="w-5 h-5" />}
        >
          Favorites ({favoritesCount})
        </CasinoSidebarItem>
        <CasinoSidebarItem 
          onClick={() => handleItemClick(() => handleScrollTo('continue-playing'))}
          icon={<Gamepad2 className="w-5 h-5" />}
        >
          Recently Played
        </CasinoSidebarItem>
        <CasinoSidebarItem 
          onClick={() => handleItemClick(() => handleScrollTo('daily-rewards'))}
          icon={<Gift className="w-5 h-5" />}
        >
          Rewards
        </CasinoSidebarItem>
        <CasinoSidebarItem 
          onClick={() => handleItemClick(() => handleScrollTo('missions'))}
          icon={<ClipboardList className="w-5 h-5" />}
        >
          Missions
        </CasinoSidebarItem>
        <CasinoSidebarItem 
          onClick={() => handleItemClick(() => handleScrollTo('tournaments'))}
          icon={<Trophy className="w-5 h-5" />}
        >
          Tournaments
        </CasinoSidebarItem>
        <CasinoSidebarItem 
          onClick={() => handleItemClick(() => triggerToast('VIP CLUB REQUIRES HIGHER PLAYER XP LEVEL!', 'info'))}
          icon={<Crown className="w-5 h-5" />}
        >
          VIP Club
        </CasinoSidebarItem>
      </div>

      <div className="space-y-1.5 pt-4 border-t border-[#2E3150] mt-auto">
        {onOpenSettings && (
          <CasinoSidebarItem 
            onClick={() => handleItemClick(onOpenSettings)}
            icon={<Settings className="w-5 h-5" />}
          >
            Settings
          </CasinoSidebarItem>
        )}
        <CasinoSidebarItem 
          onClick={() => handleItemClick(() => setIsHelpModalOpen(true))}
          icon={<HelpCircle className="w-5 h-5" />}
        >
          Help
        </CasinoSidebarItem>
        <CasinoSidebarItem 
          onClick={handleLogoutWithConfirmation}
          icon={<LogOut className="w-5 h-5 text-[#E85D68]" />}
          className="hover:bg-[#E85D68]/10"
        >
          Log Out
        </CasinoSidebarItem>
      </div>
    </div>
  );
};

export const CasinoSidebar: React.FC<CasinoSidebarProps> = (props) => {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-[#15182A] border-r-2 border-[#2E3150] p-4 overflow-y-auto">
      <SidebarContentItems {...props} />
    </aside>
  );
};
