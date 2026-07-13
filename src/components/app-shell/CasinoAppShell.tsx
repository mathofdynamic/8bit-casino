/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../../store';
import { CasinoTopNav } from '../lobby-v2/CasinoTopNav';
import { GlobalCasinoSidebar } from './GlobalCasinoSidebar';
import { X } from 'lucide-react';
import { audio } from '../../lib/audio';

interface CasinoAppShellProps {
  children: React.ReactNode;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterFavoritesOnly: boolean;
  setFilterFavoritesOnly: (f: boolean) => void;
  favoritesCount: number;
  handleScrollTo: (id: string) => void;
  onOpenSettings?: () => void;
  setIsHelpModalOpen: (open: boolean) => void;
  // Poker specific
  activePokerView?: 'home' | 'cash' | 'sitgo' | 'favorites' | 'recent';
  setActivePokerView?: (view: 'home' | 'cash' | 'sitgo' | 'favorites' | 'recent') => void;
  onFocusPokerMissions?: () => void;
}

export const CasinoAppShell: React.FC<CasinoAppShellProps> = ({
  children,
  searchQuery,
  setSearchQuery,
  filterFavoritesOnly,
  setFilterFavoritesOnly,
  favoritesCount,
  handleScrollTo,
  onOpenSettings,
  setIsHelpModalOpen,
  activePokerView = 'home',
  setActivePokerView,
  onFocusPokerMissions,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0D18] text-[#F3EBD8] flex flex-col font-jersey select-none overflow-x-hidden">
      
      {/* 1. Global top navigation bar */}
      <CasinoTopNav
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterFavoritesOnly={filterFavoritesOnly}
        setFilterFavoritesOnly={setFilterFavoritesOnly}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onOpenSettings={onOpenSettings}
        handleScrollTo={handleScrollTo}
      />

      {/* 2. Main content container split into Sidebar and Children */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Desktop Sidebar Left (w-[216px]) */}
        <div className="hidden md:block">
          <GlobalCasinoSidebar
            filterFavoritesOnly={filterFavoritesOnly}
            setFilterFavoritesOnly={setFilterFavoritesOnly}
            favoritesCount={favoritesCount}
            handleScrollTo={handleScrollTo}
            onOpenSettings={onOpenSettings}
            setIsHelpModalOpen={setIsHelpModalOpen}
            activePokerView={activePokerView}
            setActivePokerView={setActivePokerView}
            onFocusPokerMissions={onFocusPokerMissions}
          />
        </div>

        {/* Scrollable central content panel */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative">
          {children}
        </main>

      </div>

      {/* 3. Mobile drawer navigation menu (hidden on desktop) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop Dimmer (dims but does not blur per retro guide) */}
          <div 
            className="fixed inset-0 bg-black/60" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer container panel with chamfered style */}
          <div className="relative flex flex-col w-[240px] max-w-xs h-full bg-[#15182A] border-r-2 border-[#2E3150] p-4 z-10 animate-fade-in">
            <div className="flex justify-between items-center mb-4 border-b border-[#2E3150] pb-2">
              <span className="font-jersey text-xl text-[#F6B73C] tracking-widest uppercase">NAV DECK</span>
              <button 
                onClick={() => { audio.playClick(); setIsMobileMenuOpen(false); }}
                className="text-[#9A9AB5] hover:text-[#F3EBD8] cursor-pointer p-1 border-none bg-transparent"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Render shared sidebar inside mobile drawer */}
            <div className="flex-1 overflow-y-auto">
              <GlobalCasinoSidebar
                filterFavoritesOnly={filterFavoritesOnly}
                setFilterFavoritesOnly={setFilterFavoritesOnly}
                favoritesCount={favoritesCount}
                handleScrollTo={handleScrollTo}
                onOpenSettings={onOpenSettings}
                setIsHelpModalOpen={setIsHelpModalOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                activePokerView={activePokerView}
                setActivePokerView={setActivePokerView}
                onFocusPokerMissions={onFocusPokerMissions}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
