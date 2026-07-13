/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import { PokerFiltersState, SortField, GameType, SpeedType, DifficultyType } from './pokerTypes';
import { audio } from '../../lib/audio';

interface PokerFiltersProps {
  filters: PokerFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<PokerFiltersState>>;
  sortField: SortField;
  setSortField: (field: SortField) => void;
}

export const PokerFilters: React.FC<PokerFiltersProps> = ({
  filters,
  setFilters,
  sortField,
  setSortField,
}) => {
  const handleReset = () => {
    audio.playClick();
    setFilters({
      gameType: 'All',
      stakes: 'All',
      seats: 'All',
      speed: 'All',
      difficulty: 'All',
      search: '',
      favoritesOnly: false,
    });
    setSortField('Recommended');
  };

  const updateFilter = (key: keyof PokerFiltersState, value: any) => {
    audio.playClick();
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-[#15182A] border-2 border-[#2E3150] p-4 select-none" style={{ clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 12px 100%, 0% calc(100% - 12px))' }}>
      <div className="flex flex-col gap-4">
        {/* Row 1: Search, Sorting and Reset */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="flex-1 flex items-center bg-[#0B0D18] border border-[#2E3150] px-3 h-10" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
            <Search className="w-4 h-4 text-[#63657A] shrink-0" />
            <input
              type="text"
              placeholder="SEARCH BY SALOON OR DIFFICULTY..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="bg-transparent font-jersey text-base border-none outline-none w-full ml-2 text-[#F3EBD8] placeholder-[#63657A] focus:ring-0 leading-none"
            />
          </div>

          {/* Sorting buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-jersey text-sm text-[#9A9AB5] uppercase">Sort by:</span>
            {(['Recommended', 'Stakes', 'Players', 'Buy-In'] as SortField[]).map((field) => (
              <button
                key={field}
                onClick={() => { audio.playClick(); setSortField(field); }}
                className={`px-3 py-1 font-jersey text-base uppercase border cursor-pointer ${
                  sortField === field
                    ? 'bg-[#1D2036] border-[#F6B73C] text-[#F6B73C] font-bold'
                    : 'bg-[#0B0D18] border-[#2E3150] text-[#9A9AB5] hover:text-[#F3EBD8]'
                }`}
                style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}
              >
                {field}
              </button>
            ))}

            <button
              onClick={handleReset}
              className="p-2 border border-[#E85D68] text-[#E85D68] hover:bg-[#E85D68]/10 cursor-pointer flex items-center justify-center"
              style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#2E3150]" />

        {/* Row 2: Categorized filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {/* Game Type Filter */}
          <div>
            <label className="block font-jersey text-xs text-[#63657A] uppercase mb-1 leading-none">Game Mode:</label>
            <select
              value={filters.gameType}
              onChange={(e) => updateFilter('gameType', e.target.value)}
              className="w-full bg-[#0B0D18] border border-[#2E3150] font-jersey text-base text-[#F3EBD8] py-1.5 px-2.5 outline-none focus:border-[#F6B73C]"
              style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
            >
              <option value="All">All Modes</option>
              <option value="Texas Hold'em">Texas Hold'em</option>
              <option value="Omaha">Omaha</option>
            </select>
          </div>

          {/* Stakes Filter */}
          <div>
            <label className="block font-jersey text-xs text-[#63657A] uppercase mb-1 leading-none">Stakes Tier:</label>
            <select
              value={filters.stakes}
              onChange={(e) => updateFilter('stakes', e.target.value)}
              className="w-full bg-[#0B0D18] border border-[#2E3150] font-jersey text-base text-[#F3EBD8] py-1.5 px-2.5 outline-none focus:border-[#F6B73C]"
              style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
            >
              <option value="All">All Stakes</option>
              <option value="Low">Low (under 1 Coin)</option>
              <option value="Medium">Medium (1 - 50 Coins)</option>
              <option value="High">High (above 50 Coins)</option>
            </select>
          </div>

          {/* Seats Filter */}
          <div>
            <label className="block font-jersey text-xs text-[#63657A] uppercase mb-1 leading-none">Seat Slots:</label>
            <select
              value={filters.seats}
              onChange={(e) => updateFilter('seats', e.target.value)}
              className="w-full bg-[#0B0D18] border border-[#2E3150] font-jersey text-base text-[#F3EBD8] py-1.5 px-2.5 outline-none focus:border-[#F6B73C]"
              style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
            >
              <option value="All">All Seats</option>
              <option value="Available">Has Open Seats</option>
              <option value="OneSeat">Only 1 Seat Left</option>
              <option value="NotFull">Not Full</option>
            </select>
          </div>

          {/* Speed Filter */}
          <div>
            <label className="block font-jersey text-xs text-[#63657A] uppercase mb-1 leading-none">Blind Speed:</label>
            <select
              value={filters.speed}
              onChange={(e) => updateFilter('speed', e.target.value)}
              className="w-full bg-[#0B0D18] border border-[#2E3150] font-jersey text-base text-[#F3EBD8] py-1.5 px-2.5 outline-none focus:border-[#F6B73C]"
              style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
            >
              <option value="All">All Speeds</option>
              <option value="Standard">Standard</option>
              <option value="Fast">Fast</option>
              <option value="Turbo">Turbo</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block font-jersey text-xs text-[#63657A] uppercase mb-1 leading-none">Bot Difficulty:</label>
            <select
              value={filters.difficulty}
              onChange={(e) => updateFilter('difficulty', e.target.value)}
              className="w-full bg-[#0B0D18] border border-[#2E3150] font-jersey text-base text-[#F3EBD8] py-1.5 px-2.5 outline-none focus:border-[#F6B73C]"
              style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Casual">Casual</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
              <option value="VIP">VIP Elite</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
