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
import { CasinoAppShell } from './app-shell/CasinoAppShell';
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
    
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      triggerToast(`SCROLLING TO ${id.toUpperCase()} MODULE`, 'info');
    }
  };

  return (
    <CasinoAppShell
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      filterFavoritesOnly={filterFavoritesOnly}
      setFilterFavoritesOnly={setFilterFavoritesOnly}
      favoritesCount={favorites.length}
      handleScrollTo={handleScrollTo}
      onOpenSettings={onOpenSettings}
      routeMode="lobby"
      activeItem={filterFavoritesOnly ? 'favorites' : 'home'}
      onHome={() => {
        setFilterFavoritesOnly(false);
        setRoute('lobby');
        // Scroll to top
        const mainEl = document.querySelector('main');
        if (mainEl) {
          mainEl.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
      onFavorites={() => {
        setFilterFavoritesOnly(true);
      }}
      onRecentlyPlayed={() => {
        handleScrollTo('continue-playing');
      }}
      onRewards={() => {
        handleScrollTo('daily-rewards');
      }}
      onMissions={() => {
        handleScrollTo('missions');
      }}
      onTournaments={() => {
        handleScrollTo('tournaments');
      }}
      onVip={() => {
        triggerToast('VIP CLUB REQUIRES HIGHER PLAYER XP LEVEL!', 'info');
      }}
      onSettings={() => {
        if (onOpenSettings) onOpenSettings();
      }}
      onHelp={() => {
        setIsHelpModalOpen(true);
      }}
    >
      <div className="flex flex-col lg:flex-row gap-6 relative">
        {/* MIDDLE SCROLLABLE MAIN SECTION CONTENT */}
        <div className="flex-1 space-y-6">
          
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

        </div>

        {/* RIGHT UTILITY RAIL (Desktop wide only) */}
        <aside className="hidden xl:flex flex-col w-[280px] shrink-0 bg-[#15182A] border-l-2 border-[#2E3150] p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-100px)]">
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
                  • Coins are granted weekly and daily inside the Daily Rewards.
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
    </CasinoAppShell>
  );
};
