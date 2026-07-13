/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore, AppRoute } from '../../store';
import { GameCard } from '../ui-v2';
import { LOBBY_ASSETS } from '../../lib/lobbyAssets';
import { audio } from '../../lib/audio';

interface PopularGamesProps {
  searchQuery: string;
  filterFavoritesOnly: boolean;
  setFilterFavoritesOnly: (f: boolean) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const PopularGames: React.FC<PopularGamesProps> = ({
  searchQuery,
  filterFavoritesOnly,
  setFilterFavoritesOnly,
  favorites,
  onToggleFavorite,
}) => {
  const { setRoute, triggerToast } = useStore();
  const [activeTab, setActiveTab] = useState('All Games');

  // Local static list of Popular Games
  const games = [
    {
      id: 'lucky7s',
      title: 'Lucky 7s',
      category: 'Slots',
      asset: LOBBY_ASSETS.lucky7s,
      metadata: 'Payout: 98.4%',
      badge: 'HOT',
      destination: 'minigames' as AppRoute,
    },
    {
      id: 'texasHoldem',
      title: 'Texas Hold’em',
      category: 'Poker',
      asset: LOBBY_ASSETS.texasHoldem,
      metadata: 'Players: 1,420',
      destination: 'poker' as AppRoute,
    },
    {
      id: 'rouletteLive',
      title: 'Roulette Live',
      category: 'Live Casino',
      asset: LOBBY_ASSETS.rouletteLive,
      metadata: 'RTP: 97.3%',
      destination: 'minigames' as AppRoute,
    },
    {
      id: 'megaStack',
      title: 'Mega Stack',
      category: 'Slots',
      asset: LOBBY_ASSETS.megaStack,
      metadata: 'Min Bet: 1 Coin',
      badge: 'NEW',
      destination: 'minigames' as AppRoute,
    },
    {
      id: 'neonBlackjack',
      title: 'Neon Blackjack',
      category: 'Table Games',
      asset: LOBBY_ASSETS.neonBlackjack,
      metadata: 'RTP: 99.6%',
      destination: 'minigames' as AppRoute,
    },
    {
      id: 'goldRush',
      title: 'Gold Rush',
      category: 'Slots',
      asset: LOBBY_ASSETS.goldRush,
      metadata: 'Jackpot Game',
      destination: 'minigames' as AppRoute,
    }
  ];

  // Search, Category, and Favorites tab filtering combined
  const filteredGames = games.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 'Slots') matchesTab = g.category === 'Slots';
    else if (activeTab === 'Poker') matchesTab = g.category === 'Poker';
    else if (activeTab === 'Table Games') matchesTab = g.category === 'Table Games' || g.category === 'Poker';
    else if (activeTab === 'Live') matchesTab = g.category === 'Live Casino';
    else if (activeTab === 'New') matchesTab = g.badge === 'NEW' || g.badge === 'HOT';
    else if (activeTab === 'Jackpots') {
      matchesTab = g.title.toLowerCase().includes('fortune') || 
                   g.title.toLowerCase().includes('mega') || 
                   g.title.toLowerCase().includes('gold') || 
                   g.title.toLowerCase().includes('7s');
    }
    
    const matchesFavorites = filterFavoritesOnly ? favorites.includes(g.id) : true;

    return matchesSearch && matchesTab && matchesFavorites;
  });

  return (
    <section className="space-y-4 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#2E3150] pb-1.5 gap-3 font-jersey">
        <h3 className="text-2xl text-[#F3EBD8] uppercase tracking-wide leading-none">Popular Games</h3>
        
        {/* Responsive Category Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {['All Games', 'Slots', 'Poker', 'Table Games', 'Live', 'New', 'Jackpots'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                audio.playClick();
                setActiveTab(tab);
              }}
              className={`px-3 py-1 text-base uppercase font-jersey tracking-wider transition-none cursor-pointer ${
                activeTab === tab 
                  ? 'bg-[#F6B73C] text-black font-bold' 
                  : 'bg-[#15182A] text-[#9A9AB5] hover:text-[#F3EBD8] hover:bg-[#222744]'
              }`}
              style={{ clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)' }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid container */}
      {filteredGames.length === 0 ? (
        <div className="border border-dashed border-[#2E3150] py-12 text-center text-[#9A9AB5] uppercase text-xl font-jersey">
          NO GAMES MATCH YOUR ACTIVE SEARCH FILTERS!
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              category={game.category}
              thumbnailSrc={game.asset.thumbnailSrc}
              fullSrc={game.asset.fullSrc}
              metadata={game.metadata}
              badge={game.badge}
              isFavorite={favorites.includes(game.id)}
              onToggleFavorite={(e) => onToggleFavorite(game.id, e)}
              onClick={() => {
                audio.playClick();
                setRoute(game.destination);
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};
