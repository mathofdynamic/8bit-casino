/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArcadeGameId } from './arcadeTypes';
import { ARCADE_GAMES } from './arcadeData';
import { ArcadePageHeader } from './ArcadePageHeader';
import { ArcadeFeaturedGame } from './ArcadeFeaturedGame';
import { ArcadeGameGrid } from './ArcadeGameGrid';

interface ArcadeHubPageProps {
  onSelectGame: (id: ArcadeGameId) => void;
}

export const ArcadeHubPage: React.FC<ArcadeHubPageProps> = ({ onSelectGame }) => {
  const featuredGame = ARCADE_GAMES.find((g) => g.id === 'slots') || ARCADE_GAMES[0];
  const gridGames = ARCADE_GAMES.filter((g) => g.id !== 'slots');

  return (
    <div className="space-y-6 md:space-y-8 pb-12 w-full max-w-7xl mx-auto">
      <ArcadePageHeader />

      <ArcadeFeaturedGame
        game={featuredGame}
        onSelectGame={(id) => onSelectGame(id)}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#2E3150] pb-2">
          <h2 className="font-jersey text-2xl uppercase text-[#F3EBD8] tracking-wide">
            ALL ARCADE GAMES
          </h2>
          <span className="font-jersey text-xs text-[#9A9AB5] uppercase">
            5 MORE GAMES AVAILABLE
          </span>
        </div>

        <ArcadeGameGrid
          games={gridGames}
          onSelectGame={onSelectGame}
        />
      </div>
    </div>
  );
};
