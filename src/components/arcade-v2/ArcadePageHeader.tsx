/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CasinoBadge, CasinoPanel } from '../ui-v2';

export const ArcadePageHeader: React.FC = () => {
  return (
    <CasinoPanel
      chamfer={12}
      borderColor="default"
      className="w-full bg-[#15182A]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-jersey text-sm uppercase text-[#54D6D9] tracking-widest">
              CASINO ARCADE
            </span>
          </div>
          <h1 className="font-jersey text-3xl md:text-4xl uppercase text-[#F3EBD8] tracking-wide leading-none">
            ARCADE GAMES
          </h1>
          <p className="font-jersey text-sm md:text-base text-[#9A9AB5] uppercase leading-tight">
            Choose a play-money game and start a session.
          </p>
        </div>

        <div className="shrink-0 self-start sm:self-center">
          <CasinoBadge variant="cyan" className="px-3 py-1 text-sm font-bold">
            6 GAMES AVAILABLE
          </CasinoBadge>
        </div>
      </div>
    </CasinoPanel>
  );
};
