/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from '../../store';
import { Home, Landmark, Gamepad2, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { CasinoSidebarItem } from '../ui-v2';
import { audio } from '../../lib/audio';

export interface SectionCasinoSidebarProps {
  activeRoute: 'profile' | 'minigames';
  onOpenSettings?: () => void;
  onHelp?: () => void;
  onNavigate?: () => void;
  variant?: 'desktop' | 'drawer';
}

export const SectionCasinoSidebar: React.FC<SectionCasinoSidebarProps> = ({
  activeRoute,
  onOpenSettings,
  onHelp,
  onNavigate,
  variant = 'desktop',
}) => {
  const { setRoute, logout, triggerToast } = useStore();

  const handleAction = (callback: () => void) => {
    audio.playClick();
    if (onNavigate) {
      onNavigate();
    }
    callback();
  };

  const handleLogoutWithConfirmation = () => {
    audio.playLoss();
    if (confirm('LOG OUT AND RETURN TO THE LOGIN SCREEN?')) {
      if (onNavigate) {
        onNavigate();
      }
      logout();
    }
  };

  const handleHelpClick = () => {
    if (onHelp) {
      handleAction(onHelp);
    } else {
      audio.playClick();
      if (onNavigate) {
        onNavigate();
      }
      triggerToast('HELP CENTER IS BEING PREPARED.', 'info');
    }
  };

  const listContent = (
    <div className="flex flex-col justify-between h-full select-none font-jersey">
      {/* Upper Navigation Items List */}
      <div className="space-y-[6px]">
        <CasinoSidebarItem
          active={false}
          onClick={() => handleAction(() => setRoute('lobby'))}
          icon={<Home size={20} />}
        >
          Lobby
        </CasinoSidebarItem>

        <CasinoSidebarItem
          active={false}
          onClick={() => handleAction(() => setRoute('poker'))}
          icon={<Landmark size={20} />}
        >
          Poker Tables
        </CasinoSidebarItem>

        <CasinoSidebarItem
          active={activeRoute === 'minigames'}
          onClick={() => handleAction(() => setRoute('minigames'))}
          icon={<Gamepad2 size={20} />}
        >
          Arcade
        </CasinoSidebarItem>

        <CasinoSidebarItem
          active={activeRoute === 'profile'}
          onClick={() => handleAction(() => setRoute('profile'))}
          icon={<User size={20} />}
        >
          Profile
        </CasinoSidebarItem>
      </div>

      {/* Lower Navigation Items List + Footer Disclaimer */}
      <div className="mt-8 space-y-[6px]">
        <div className="border-t border-[#2E3150] pt-4 space-y-[6px]">
          <CasinoSidebarItem
            active={false}
            onClick={() => {
              if (onOpenSettings) {
                handleAction(onOpenSettings);
              } else {
                audio.playClick();
                if (onNavigate) onNavigate();
              }
            }}
            icon={<Settings size={20} />}
          >
            Settings
          </CasinoSidebarItem>

          <CasinoSidebarItem
            active={false}
            onClick={handleHelpClick}
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
