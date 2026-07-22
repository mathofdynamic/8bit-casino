/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArcadeGameData, ArcadeGameId } from './arcadeTypes';
import { ArcadeGameCard } from './ArcadeGameCard';

interface ArcadeGameGridProps {
  games: ArcadeGameData[];
  onSelectGame: (id: ArcadeGameId) => void;
}

export const ArcadeGameGrid: React.FC<ArcadeGameGridProps> = ({
  games,
  onSelectGame,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
      {games.map((game) => (
        <ArcadeGameCard
          key={game.id}
          game={game}
          onSelectGame={onSelectGame}
        />
      ))}
    </div>
  );
};
