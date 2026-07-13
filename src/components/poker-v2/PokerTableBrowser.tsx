/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PokerTable } from './pokerTypes';
import { PokerTableRow } from './PokerTableRow';

interface PokerTableBrowserProps {
  tables: PokerTable[];
  selectedTableId: string | null;
  onSelectTable: (table: PokerTable) => void;
  favorites: string[];
  onToggleFavorite: (tableId: string) => void;
}

export const PokerTableBrowser: React.FC<PokerTableBrowserProps> = ({
  tables,
  selectedTableId,
  onSelectTable,
  favorites,
  onToggleFavorite,
}) => {
  if (tables.length === 0) {
    return (
      <div className="bg-[#15182A] border-2 border-[#2E3150] p-12 text-center select-none" style={{ clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 12px 100%, 0% calc(100% - 12px))' }}>
        <p className="font-jersey text-xl text-[#9A9AB5] uppercase leading-none">NO ACTIVE POKER CABINETS MATCH YOUR CHOSEN MATRIX FILTERS!</p>
        <p className="font-jersey text-sm text-[#63657A] uppercase mt-2 leading-none">RESET SEARCH MATRIX OR CHANGE SELECTOR CATEGORIES TO DEPLOY SEATS.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#15182A] border-2 border-[#2E3150] overflow-hidden flex flex-col" style={{ clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 12px 100%, 0% calc(100% - 12px))' }}>
      {/* Scrollable table container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table headers */}
          <thead>
            <tr className="bg-[#1D2036] border-b-2 border-[#2E3150] text-[#63657A] select-none">
              <th className="py-2.5 px-4 text-center font-jersey text-sm uppercase tracking-wider w-12">FAV</th>
              <th className="py-2.5 px-3 font-jersey text-sm uppercase tracking-wider">SALOON TABLE NAME & MODE</th>
              <th className="py-2.5 px-3 font-jersey text-sm uppercase tracking-wider">BLINDS (STAKES)</th>
              <th className="py-2.5 px-3 font-jersey text-sm uppercase tracking-wider">BUY-IN RANGE</th>
              <th className="py-2.5 px-3 font-jersey text-sm uppercase tracking-wider">SEATS FILLED</th>
              <th className="py-2.5 px-4 text-right font-jersey text-sm uppercase tracking-wider">STATUS</th>
            </tr>
          </thead>

          {/* Table body content */}
          <tbody>
            {tables.map((table) => (
              <PokerTableRow
                key={table.id}
                table={table}
                isSelected={selectedTableId === table.id}
                isFavorite={favorites.includes(table.id)}
                onSelect={() => onSelectTable(table)}
                onToggleFavorite={() => onToggleFavorite(table.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
