/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Home, 
  Coins, 
  Trophy, 
  Bot, 
  Heart, 
  History, 
  Target, 
  Gift, 
  Settings, 
  HelpCircle 
} from 'lucide-react';
import { CasinoSidebarItem } from '../ui-v2';
import { useStore } from '../../store';
import { audio } from '../../lib/audio';

interface PokerSidebarProps {
  activeView: 'home' | 'cash' | 'sitgo' | 'favorites' | 'recent';
  setActiveView: (view: 'home' | 'cash' | 'sitgo' | 'favorites' | 'recent') => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
  onFocusMissions?: () => void;
}

export const PokerSidebar: React.FC<PokerSidebarProps> = ({
  activeView,
  setActiveView,
  onOpenSettings,
  onOpenHelp,
  onFocusMissions,
}) => {
  const { triggerToast } = useStore();

  const handleTournamentsClick = () => {
    audio.playClick();
    triggerToast("POKER TOURNAMENTS MODE IS COMING SOON! STAKE YOUR COINS IN CASH GAMES FOR NOW.", "info");
  };

  const handleRewardsClick = () => {
    audio.playClick();
    triggerToast("POKER LOYALTY REWARDS SCHEME WILL INITIATE IN THE NEXT CABINET ERA!", "info");
  };

  return (
    <aside className="w-52 md:w-56 shrink-0 bg-[#15182A] border-r-2 border-[#2E3150] flex flex-col justify-between p-3 select-none h-[calc(100vh-64px)] overflow-y-auto">
      {/* Upper Navigation Sections */}
      <div className="space-y-6">
        <div className="space-y-1">
          <CasinoSidebarItem 
            active={activeView === 'home'} 
            onClick={() => { audio.playClick(); setActiveView('home'); }}
            icon={<Home className="w-4 h-4" />}
          >
            Poker Home
          </CasinoSidebarItem>
          
          <CasinoSidebarItem 
            active={activeView === 'cash'} 
            onClick={() => { audio.playClick(); setActiveView('cash'); }}
            icon={<Coins className="w-4 h-4" />}
          >
            Cash Games
          </CasinoSidebarItem>

          <CasinoSidebarItem 
            active={false} 
            onClick={handleTournamentsClick}
            icon={<Trophy className="w-4 h-4" />}
          >
            Tournaments
          </CasinoSidebarItem>

          <CasinoSidebarItem 
            active={activeView === 'sitgo'} 
            onClick={() => { audio.playClick(); setActiveView('sitgo'); }}
            icon={<Bot className="w-4 h-4" />}
          >
            Sit & Go
          </CasinoSidebarItem>

          <CasinoSidebarItem 
            active={activeView === 'favorites'} 
            onClick={() => { audio.playClick(); setActiveView('favorites'); }}
            icon={<Heart className="w-4 h-4" />}
          >
            Favorites
          </CasinoSidebarItem>

          <CasinoSidebarItem 
            active={activeView === 'recent'} 
            onClick={() => { audio.playClick(); setActiveView('recent'); }}
            icon={<History className="w-4 h-4" />}
          >
            Recently Played
          </CasinoSidebarItem>
        </div>

        {/* Divider */}
        <div className="border-t border-[#2E3150]" />

        {/* Lower Navigation Section */}
        <div className="space-y-1">
          <CasinoSidebarItem 
            active={false} 
            onClick={() => { audio.playClick(); onFocusMissions?.(); }}
            icon={<Target className="w-4 h-4" />}
          >
            Poker Missions
          </CasinoSidebarItem>

          <CasinoSidebarItem 
            active={false} 
            onClick={handleRewardsClick}
            icon={<Gift className="w-4 h-4" />}
          >
            Poker Rewards
          </CasinoSidebarItem>

          <CasinoSidebarItem 
            active={false} 
            onClick={() => { audio.playClick(); onOpenSettings?.(); }}
            icon={<Settings className="w-4 h-4" />}
          >
            Settings
          </CasinoSidebarItem>

          <CasinoSidebarItem 
            active={false} 
            onClick={() => { audio.playClick(); onOpenHelp?.(); }}
            icon={<HelpCircle className="w-4 h-4" />}
          >
            Help
          </CasinoSidebarItem>
        </div>
      </div>

      {/* Play Coins Disclaimer Footer */}
      <div className="mt-8 pt-3 border-t border-[#2E3150] text-center">
        <p className="font-jersey text-[#63657A] text-[11px] leading-tight uppercase tracking-wider">
          Play Coins Only<br />— No Real Value —
        </p>
      </div>
    </aside>
  );
};
