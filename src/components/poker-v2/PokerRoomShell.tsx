/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store';
import { CasinoTopNav } from '../lobby-v2/CasinoTopNav';
import { PokerSidebar } from './PokerSidebar';
import { PokerRoomHeader } from './PokerRoomHeader';
import { PokerQuickJoin } from './PokerQuickJoin';
import { PokerFilters } from './PokerFilters';
import { PokerTableBrowser } from './PokerTableBrowser';
import { PokerTableDetails } from './PokerTableDetails';
import { PokerMissions } from './PokerMissions';
import { PokerHelpModal } from './PokerHelpModal';
import { POKER_TABLES } from './pokerTables';
import { PokerTable, PokerFiltersState, SortField, GameType, SpeedType, DifficultyType } from './pokerTypes';
import { CasinoPanel, CasinoButton } from '../ui-v2';
import { Bot, Settings, Sliders, Play, Info } from 'lucide-react';
import { audio } from '../../lib/audio';

interface PokerRoomShellProps {
  onJoinTable: (table: PokerTable, buyIn: number) => void;
  onLaunchCustomBotMatch: (config: {
    tableName: string;
    buyIn: number;
    botCount: number;
    difficulty: 'BEGINNER' | 'CASUAL' | 'ADVANCED' | 'EXPERT';
    theme: 'red' | 'green' | 'gold' | 'orange';
  }) => void;
}

export const PokerRoomShell: React.FC<PokerRoomShellProps> = ({
  onJoinTable,
  onLaunchCustomBotMatch,
}) => {
  const { profile, setRoute, triggerToast } = useStore();

  // Navigation / View states
  const [activeView, setActiveView] = useState<'home' | 'cash' | 'sitgo' | 'favorites' | 'recent'>('home');
  const [selectedTable, setSelectedTable] = useState<PokerTable | null>(POKER_TABLES[0]);

  // Search query state for topnav
  const [topnavSearch, setTopnavSearch] = useState('');

  // Favorites state persistent in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('poker_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Recently played persistent in localStorage
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('poker_recently_played');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Master filters state
  const [filters, setFilters] = useState<PokerFiltersState>({
    gameType: 'All',
    stakes: 'All',
    seats: 'All',
    speed: 'All',
    difficulty: 'All',
    search: '',
    favoritesOnly: false,
  });

  const [sortField, setSortField] = useState<SortField>('Recommended');

  // Modals
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Focus mission anchor
  const missionsRef = useRef<HTMLDivElement>(null);

  const handleFocusMissions = () => {
    missionsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Toggle favorites helper
  const handleToggleFavorite = (tableId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(tableId)
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId];
      try {
        localStorage.setItem('poker_favorites', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Sync TopNav search query into central filter
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: topnavSearch }));
  }, [topnavSearch]);

  // Sidebar filtering triggers
  useEffect(() => {
    if (activeView === 'favorites') {
      setFilters((prev) => ({ ...prev, favoritesOnly: true }));
    } else {
      setFilters((prev) => ({ ...prev, favoritesOnly: false }));
    }
  }, [activeView]);

  // Custom Sit & Go Lab Staging states (classic bot builder)
  const [customTableName, setCustomTableName] = useState('KINETIC SHARK ARENA');
  const [customBuyIn, setCustomBuyIn] = useState(10);
  const [customBotCount, setCustomBotCount] = useState(3);
  const [customDifficulty, setCustomDifficulty] = useState<'BEGINNER' | 'CASUAL' | 'ADVANCED' | 'EXPERT'>('CASUAL');
  const [customTheme, setCustomTheme] = useState<'red' | 'green' | 'gold' | 'orange'>('green');

  // Filter & Sort Logic
  const filteredTables = POKER_TABLES.filter((table) => {
    // 1. Sidebar view filter
    if (activeView === 'favorites' && !favorites.includes(table.id)) return false;
    if (activeView === 'recent' && !recentlyPlayed.includes(table.id)) return false;

    // 2. Game Mode dropdown
    if (filters.gameType !== 'All' && table.gameType !== filters.gameType) return false;

    // 3. Stakes tier
    if (filters.stakes === 'Low' && table.maxBuyIn > 1.00) return false;
    if (filters.stakes === 'Medium' && (table.minBuyIn < 1.00 || table.minBuyIn > 50.00)) return false;
    if (filters.stakes === 'High' && table.minBuyIn <= 50.00) return false;

    // 4. Seats
    if (filters.seats === 'Available' && table.seatsFilled >= table.maxSeats) return false;
    if (filters.seats === 'OneSeat' && table.seatsFilled !== table.maxSeats - 1) return false;
    if (filters.seats === 'NotFull' && table.seatsFilled === table.maxSeats) return false;

    // 5. Speed
    if (filters.speed !== 'All' && table.speed !== filters.speed) return false;

    // 6. Difficulty
    if (filters.difficulty !== 'All' && table.difficulty.toUpperCase() !== filters.difficulty.toUpperCase()) return false;

    // 7. Text Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const matchName = table.name.toLowerCase().includes(q);
      const matchDiff = table.difficulty.toLowerCase().includes(q);
      return matchName || matchDiff;
    }

    return true;
  }).sort((a, b) => {
    if (sortField === 'Stakes') {
      return a.smallBlind - b.smallBlind;
    }
    if (sortField === 'Players') {
      return b.seatsFilled - a.seatsFilled;
    }
    if (sortField === 'Buy-In') {
      return a.minBuyIn - b.minBuyIn;
    }
    // 'Recommended' default sort
    if (a.isLocked && !b.isLocked) return 1;
    if (!a.isLocked && b.isLocked) return -1;
    if (a.isHot && !b.isHot) return -1;
    if (!a.isHot && b.isHot) return 1;
    return a.minBuyIn - b.minBuyIn;
  });

  // Quick Join logic
  const handleQuickJoin = (gameType: GameType | 'All', stakes: 'All' | 'Low' | 'Medium' | 'High', speed: SpeedType | 'All') => {
    audio.playClick();
    
    // Find optimal matches
    const matches = POKER_TABLES.filter((table) => {
      if (table.isLocked || table.seatsFilled >= table.maxSeats) return false;
      if (profile.chips < table.minBuyIn) return false;
      if (gameType !== 'All' && table.gameType !== gameType) return false;
      if (speed !== 'All' && table.speed !== speed) return false;

      if (stakes === 'Low' && table.maxBuyIn > 1.00) return false;
      if (stakes === 'Medium' && (table.minBuyIn < 1.00 || table.minBuyIn > 50.00)) return false;
      if (stakes === 'High' && table.minBuyIn <= 50.00) return false;

      return true;
    }).sort((a, b) => b.seatsFilled - a.seatsFilled); // Prefer nearly full tables

    if (matches.length > 0) {
      const best = matches[0];
      const rec = Math.min(Number(((best.minBuyIn + best.maxBuyIn) / 2).toFixed(2)), profile.chips);
      triggerToast(`QUICK JOIN MATCHED YOU TO ${best.name}!`, 'success');
      
      // Update recently played
      setRecentlyPlayed(prev => {
        const next = [best.id, ...prev.filter(id => id !== best.id)].slice(0, 10);
        try { localStorage.setItem('poker_recently_played', JSON.stringify(next)); } catch {}
        return next;
      });

      onJoinTable(best, rec);
    } else {
      triggerToast("COULD NOT QUICK-MATCH A VIABLE CABINET SLOT WITH CURRENT PARAMETERS. TRY MANUAL INGRESS.", "error");
    }
  };

  // Join Table Ingress Trigger
  const handleJoinTableTrigger = (table: PokerTable, buyIn: number) => {
    // Record into recently played
    setRecentlyPlayed(prev => {
      const next = [table.id, ...prev.filter(id => id !== table.id)].slice(0, 10);
      try { localStorage.setItem('poker_recently_played', JSON.stringify(next)); } catch {}
      return next;
    });

    onJoinTable(table, buyIn);
  };

  // Launch custom bot match
  const handleCustomBotMatchTrigger = () => {
    onLaunchCustomBotMatch({
      tableName: customTableName,
      buyIn: customBuyIn,
      botCount: customBotCount,
      difficulty: customDifficulty,
      theme: customTheme,
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0D18] text-[#F3EBD8] flex flex-col font-jersey">
      
      {/* 1. Global Navigation Top bar */}
      <CasinoTopNav
        searchQuery={topnavSearch}
        setSearchQuery={setTopnavSearch}
        filterFavoritesOnly={false}
        setFilterFavoritesOnly={() => {}}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onOpenSettings={() => {}}
        handleScrollTo={() => {}}
      />

      {/* 2. Main content block with sidebar and spreadsheet monitor */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Left */}
        <PokerSidebar
          activeView={activeView}
          setActiveView={setActiveView}
          onOpenHelp={() => setIsHelpOpen(true)}
          onFocusMissions={handleFocusMissions}
        />

        {/* Console Spreadsheet Monitor Right */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <PokerRoomHeader />

          {activeView === 'sitgo' ? (
            /* SIT & GO CUSTOM BOT BUILDER SCENE */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Setup form (Left - 7 columns) */}
              <div className="lg:col-span-7 space-y-6">
                <CasinoPanel 
                  title="SIT & GO CUSTOM BOT LAB" 
                  subtitle="Configure custom parameters to deploy a dedicated computer skirmish"
                >
                  <div className="space-y-4">
                    
                    {/* Block A: Table Nickname */}
                    <div className="bg-[#0B0D18] p-3 border border-[#2E3150]" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
                      <label className="block font-jersey text-xs text-[#63657A] uppercase mb-1 leading-none">
                        TABLE NICKNAME LOG:
                      </label>
                      <input 
                        type="text"
                        value={customTableName}
                        onChange={(e) => setCustomTableName(e.target.value)}
                        className="bg-transparent font-jersey text-xl border-b border-[#2E3150] outline-none w-full text-[#F6B73C] uppercase tracking-wider focus:border-[#F6B73C]"
                      />
                    </div>

                    {/* Block B: CPU Opponents */}
                    <div className="bg-[#0B0D18] p-3 border border-[#2E3150]" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
                      <label className="block font-jersey text-xs text-[#63657A] uppercase mb-1 leading-none">
                        TOTAL CPU OPPONENTS SEATED:
                      </label>
                      <div className="grid grid-cols-4 gap-2 mt-1">
                        {[2, 3, 4, 5].map((cnt) => (
                          <button
                            key={cnt}
                            onClick={() => { audio.playClick(); setCustomBotCount(cnt); }}
                            className={`py-1 font-jersey text-base uppercase border transition-none cursor-pointer ${
                              customBotCount === cnt
                                ? 'bg-[#1D2036] border-[#F6B73C] text-[#F6B73C] font-bold'
                                : 'bg-[#15182A] border-[#2E3150] text-[#9A9AB5] hover:text-[#F3EBD8]'
                            }`}
                            style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}
                          >
                            {cnt} Bots
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Block C: Bot Intelligence */}
                    <div className="bg-[#0B0D18] p-3 border border-[#2E3150]" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
                      <label className="block font-jersey text-xs text-[#63657A] uppercase mb-1 leading-none">
                        CPU SYSTEM INTELLIGENCE MATRIX:
                      </label>
                      <div className="grid grid-cols-4 gap-2 mt-1">
                        {(['BEGINNER', 'CASUAL', 'ADVANCED', 'EXPERT'] as const).map((diff) => (
                          <button
                            key={diff}
                            onClick={() => { audio.playClick(); setCustomDifficulty(diff); }}
                            className={`py-1 font-jersey text-base uppercase border transition-none cursor-pointer ${
                              customDifficulty === diff
                                ? 'bg-[#1D2036] border-[#F6B73C] text-[#F6B73C] font-bold'
                                : 'bg-[#15182A] border-[#2E3150] text-[#9A9AB5] hover:text-[#F3EBD8]'
                            }`}
                            style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}
                          >
                            {diff}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Block D: Felt theme */}
                    <div className="bg-[#0B0D18] p-3 border border-[#2E3150]" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
                      <label className="block font-jersey text-xs text-[#63657A] uppercase mb-1 leading-none">
                        FELT MATRIX COVER THEME:
                      </label>
                      <div className="grid grid-cols-4 gap-2 mt-1">
                        {(['red', 'green', 'gold', 'orange'] as const).map((tTheme) => (
                          <button
                            key={tTheme}
                            onClick={() => { audio.playClick(); setCustomTheme(tTheme); }}
                            className={`py-1 font-jersey text-base uppercase border transition-none cursor-pointer ${
                              customTheme === tTheme
                                ? 'bg-[#1D2036] border-[#F6B73C] text-[#F6B73C] font-bold'
                                : 'bg-[#15182A] border-[#2E3150] text-[#9A9AB5] hover:text-[#F3EBD8]'
                            }`}
                            style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}
                          >
                            {tTheme}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Block E: Custom Buyin */}
                    <div className="bg-[#0B0D18] p-3 border border-[#2E3150]" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-jersey text-xs text-[#63657A] uppercase leading-none">BUY-IN CHIP COMMITMENT:</span>
                        <span className="font-jersey text-base text-[#F6B73C] uppercase leading-none font-bold">
                          {customBuyIn.toFixed(2)} COINS
                        </span>
                      </div>
                      <input 
                        type="range"
                        min="1"
                        max={Math.min(500, profile.chips)}
                        step="1"
                        value={customBuyIn}
                        onChange={(e) => setCustomBuyIn(Number(e.target.value))}
                        className="w-full accent-[#F6B73C] bg-[#15182A] border border-[#2E3150] h-2.5 cursor-pointer outline-none"
                      />
                    </div>

                  </div>
                </CasinoPanel>
              </div>

              {/* Preview and launch (Right - 5 columns) */}
              <div className="lg:col-span-5 space-y-6">
                <CasinoPanel title="LAB SIMULATOR READOUT">
                  <div className="space-y-4">
                    
                    {/* Live table telemetry outline */}
                    <div className="bg-[#0B0D18] p-3.5 border border-[#2E3150] text-center" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
                      <Bot className="w-8 h-8 text-[#54D6D9] mx-auto mb-2" />
                      <span className="font-jersey text-xs text-[#63657A] uppercase block">DEPLOYED TARGET BOT POOL</span>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-left">
                        {Array.from({ length: customBotCount }).map((_, i) => {
                          const botNamesPool = [
                            'BOT KERNEL', 'BOT GIGA', 'BOT CACHE', 'BOT BITWISE', 'BOT SHIFT',
                            'BOT STACK', 'BOT HEAP', 'BOT COMPILE', 'BOT TRACE', 'BOT COBALT'
                          ];
                          return (
                            <div key={i} className="bg-[#15182A] p-2 border border-[#2E3150]/60 flex items-center justify-between">
                              <span className="font-jersey text-[#F3EBD8]">{botNamesPool[i % botNamesPool.length]}</span>
                              <span className="font-jersey text-[#66D18F]">{(customBuyIn * (0.85 + (i * 0.12) % 0.35)).toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Launch duel button */}
                    {profile.chips < customBuyIn ? (
                      <div className="border border-[#E85D68] bg-[#E85D68]/10 text-[#E85D68] p-3 font-jersey text-sm uppercase text-center" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
                        ⚠️ COIN RESERVE DEFICIT! ADJUST BUY-IN METER LOWER TO INITIALIZE ASSEMBLY ⚠️
                      </div>
                    ) : (
                      <CasinoButton
                        variant="gold"
                        shimmer
                        className="w-full h-12"
                        onClick={handleCustomBotMatchTrigger}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Play className="w-5 h-5 fill-current" />
                          <span>DECRYPT & INITIALIZE ASSEMBLY</span>
                        </div>
                      </CasinoButton>
                    )}
                  </div>
                </CasinoPanel>
              </div>

            </div>
          ) : (
            /* STANDARD POKER ROOM TABLES EXPLORE MONITOR SCENE */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Spreadsheet search filter list browser (Left - 8 columns) */}
              <div className="lg:col-span-8 space-y-6">
                <PokerFilters
                  filters={filters}
                  setFilters={setFilters}
                  sortField={sortField}
                  setSortField={setSortField}
                />

                <PokerTableBrowser
                  tables={filteredTables}
                  selectedTableId={selectedTable ? selectedTable.id : null}
                  onSelectTable={setSelectedTable}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>

              {/* Quick Join / Table Details (Right - 4 columns) */}
              <div className="lg:col-span-4 space-y-6">
                <PokerQuickJoin onQuickJoin={handleQuickJoin} />

                <PokerTableDetails
                  table={selectedTable}
                  onJoinTable={handleJoinTableTrigger}
                />
              </div>

            </div>
          )}

          {/* 3. Saloon Bounty Achievements Panel */}
          <PokerMissions id="poker-missions" ref={missionsRef as any} />
        </main>
      </div>

      {/* 4. Compact help modal */}
      <PokerHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};
