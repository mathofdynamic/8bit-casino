/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  X, 
  Search,
  Menu
} from 'lucide-react';
import { CasinoPanel, CasinoButton } from './ui-v2';
import { audio } from '../lib/audio';

// Import new modular subcomponents
import { CasinoTopNav } from './lobby-v2/CasinoTopNav';
import { CasinoSidebar, SidebarContentItems } from './lobby-v2/CasinoSidebar';
import { PlayerSummary } from './lobby-v2/PlayerSummary';
import { FeaturedHero } from './lobby-v2/FeaturedHero';
import { ContinuePlaying } from './lobby-v2/ContinuePlaying';
import { PopularGames } from './lobby-v2/PopularGames';
import { TournamentBanner } from './lobby-v2/TournamentBanner';
import { DailyRewardsModule } from './lobby-v2/DailyRewardsModule';
import { MissionsModule } from './lobby-v2/MissionsModule';

export const LobbyScreen: React.FC<{ onOpenSettings?: () => void }> = ({ onOpenSettings }) => {
  const { setRoute, triggerToast } = useStore();
  
  // Local states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Local Favorites list, lifted to synchronize between PopularGames and Sidebar counters
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('8bit_casino_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      try {
        localStorage.setItem('8bit_casino_favorites', JSON.stringify(updated));
      } catch (err) {}
      audio.playClick();
      return updated;
    });
  };

  const handleScrollTo = (id: string) => {
    audio.playClick();
    setIsMobileMenuOpen(false);
    
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      triggerToast(`SCROLLING TO ${id.toUpperCase()} MODULE`, 'info');
    }
  };

  return (
    <div className="casino-dashboard min-h-screen flex flex-col bg-[#0B0D18] text-[#F3EBD8] font-jersey select-none overflow-x-hidden">
      
      {/* 1. TOP NAVIGATION HEADER */}
      <CasinoTopNav 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterFavoritesOnly={filterFavoritesOnly}
        setFilterFavoritesOnly={setFilterFavoritesOnly}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onOpenSettings={onOpenSettings}
        handleScrollTo={handleScrollTo}
      />

      {/* 2. MAIN CORE SPLIT VIEW CONTAINER */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT SIDEBAR (Desktop/Tablet wide width) */}
        <CasinoSidebar 
          filterFavoritesOnly={filterFavoritesOnly}
          setFilterFavoritesOnly={setFilterFavoritesOnly}
          favoritesCount={favorites.length}
          handleScrollTo={handleScrollTo}
          onOpenSettings={onOpenSettings}
          setIsHelpModalOpen={setIsHelpModalOpen}
        />

        {/* MIDDLE SCROLLABLE MAIN SECTION */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative">
          
          {/* SEARCH INPUT BAR FOR PHONE VIEW ONLY */}
          <div 
            className="sm:hidden w-full flex items-center bg-[#15182A] border border-[#2E3150] px-3 py-1.5" 
            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
          >
            <Search className="w-4 h-4 text-[#63657A] shrink-0" />
            <input 
              type="text" 
              placeholder="SEARCH THE CASINO..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent font-jersey text-lg border-none outline-none w-full ml-2 text-[#F3EBD8] placeholder-[#63657A] focus:ring-0 leading-none pt-0.5"
            />
          </div>

          {/* A. PLAYER SUMMARY STRIP BAR */}
          <PlayerSummary />

          {/* B. FEATURED HERO BANNER (MEGA FORTUNE) */}
          <FeaturedHero />

          {/* C. CONTINUE PLAYING BANNER */}
          <ContinuePlaying />

          {/* D. POPULAR GAMES SECTION */}
          <PopularGames 
            searchQuery={searchQuery}
            filterFavoritesOnly={filterFavoritesOnly}
            setFilterFavoritesOnly={setFilterFavoritesOnly}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />

          {/* E. TOURNAMENT BANNER BELOW GAME CONTENT */}
          <TournamentBanner />

          {/* TABLET / MOBILE UTILITY MODULES (displayed below content in responsive viewports) */}
          <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div id="daily-rewards">
              <DailyRewardsModule />
            </div>
            <div id="missions">
              <MissionsModule />
            </div>
          </div>

          {/* F. COMPLIANCE HUMAN FOOTER */}
          <footer className="pt-6 border-t border-[#2E3150] text-center">
            <span className="text-[#63657A] font-jersey text-base uppercase">
              Play coins only — no real value. ★ CABINET EMULATOR v1.0 • PURE PLAY COINS NO REAL VALUE ★
            </span>
          </footer>

        </main>

        {/* RIGHT UTILITY RAIL (Desktop wide only) */}
        <aside className="hidden xl:flex flex-col w-80 shrink-0 bg-[#15182A] border-l-2 border-[#2E3150] p-4 space-y-6 overflow-y-auto">
          <div id="daily-rewards">
            <DailyRewardsModule />
          </div>
          <div id="missions">
            <MissionsModule />
          </div>
        </aside>

      </div>

      {/* 3. HELP MODAL */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 cursor-pointer" onClick={() => { audio.playClick(); setIsHelpModalOpen(false); }} />
          <div className="relative w-full max-w-md z-10">
            <CasinoPanel 
              title="8bit Help Desk" 
              subtitle="CABINET EMULATOR USER MANUAL"
              footer={
                <CasinoButton variant="gold" size="sm" onClick={() => { audio.playClick(); setIsHelpModalOpen(false); }}>
                  UNDERSTOOD
                </CasinoButton>
              }
            >
              <div className="font-jersey text-lg text-[#F3EBD8] space-y-3 uppercase leading-tight">
                <p>Welcome to 8bit Casino Concourse!</p>
                <p className="text-[#9A9AB5]">
                  • Coins are granted weekly and daily inside the Daily Loot Chest.
                </p>
                <p className="text-[#9A9AB5]">
                  • Search & Category tab filters can be dynamically paired to navigate.
                </p>
                <p className="text-[#9A9AB5]">
                  • Tap game cards to play! Other areas like slots & roulette will load our arcade engines.
                </p>
                <p className="text-xs text-[#63657A] mt-2">
                  Disclaimer: This console is a simulation for entertainment and play-money tokens. Absolutely zero real money gambling occurs.
                </p>
              </div>
            </CasinoPanel>
          </div>
        </div>
      )}

      {/* 4. MOBILE HAMBURGER NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black/80 animate-fade-in" 
            onClick={() => {
              audio.playClick();
              setIsMobileMenuOpen(false);
            }}
          />
          
          {/* Drawer body */}
          <div 
            className="relative w-64 max-w-[80vw] bg-[#15182A] border-r-2 border-[#2E3150] p-4 flex flex-col justify-between h-full"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-[#2E3150] pb-3">
                <span className="font-jersey text-2xl text-[#F6B73C] uppercase tracking-wider">NAV DECK</span>
                <button 
                  onClick={() => {
                    audio.playClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-[#9A9AB5] hover:text-[#F3EBD8] cursor-pointer focus:outline-none"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-2">
                <SidebarContentItems 
                  filterFavoritesOnly={filterFavoritesOnly}
                  setFilterFavoritesOnly={setFilterFavoritesOnly}
                  favoritesCount={favorites.length}
                  handleScrollTo={handleScrollTo}
                  onOpenSettings={onOpenSettings}
                  setIsHelpModalOpen={setIsHelpModalOpen}
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
