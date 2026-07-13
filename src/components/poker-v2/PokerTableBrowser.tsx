/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PokerTable } from './pokerTypes';
import { PokerTableRow } from './PokerTableRow';
import { audio } from '../../lib/audio';

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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Reset page to 1 when the tables collection changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tables.length]);

  if (tables.length === 0) {
    return (
      <div className="bg-[#15182A] border-2 border-[#2E3150] p-12 text-center select-none" style={{ clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 12px 100%, 0% calc(100% - 12px))' }}>
        <p className="font-jersey text-xl text-[#9A9AB5] uppercase leading-none">NO ACTIVE POKER TABLES MATCH YOUR CHOSEN FILTERS!</p>
        <p className="font-jersey text-sm text-[#63657A] uppercase mt-2 leading-none">RESET SEARCH FILTERS OR CHANGE SELECTIONS TO DISCOVER TABLES.</p>
      </div>
    );
  }

  const totalTables = tables.length;
  const totalPages = Math.max(1, Math.ceil(totalTables / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalTables);
  const paginatedTables = tables.slice(startIndex, endIndex);

  return (
    <div className="bg-[#15182A] border-2 border-[#2E3150] w-full max-w-full min-w-0 overflow-hidden flex flex-col" style={{ clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 12px 100%, 0% calc(100% - 12px))' }}>
      
      {/* Scrollable table container (only local wrapper may scroll on narrow viewports) */}
      <div className="w-full max-w-full overflow-x-auto overscroll-contain">
        <table className="w-full text-left border-collapse table-fixed">
          {/* Explicit column proportions to prevent unreadable wrapping and ensure proper containment */}
          <colgroup>
            <col style={{ width: '50px' }} />
            <col style={{ width: '27%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: 'auto' }} />
          </colgroup>
          
          {/* Table headers */}
          <thead>
            <tr className="bg-[#1D2036] border-b-2 border-[#2E3150] text-[#63657A] select-none">
              <th className="py-2.5 px-4 text-center font-jersey text-xs uppercase tracking-wider">FAV</th>
              <th className="py-2.5 px-3 font-jersey text-xs uppercase tracking-wider">POKER TABLE NAME & MODE</th>
              <th className="py-2.5 px-3 font-jersey text-xs uppercase tracking-wider">BLINDS (STAKES)</th>
              <th className="py-2.5 px-3 font-jersey text-xs uppercase tracking-wider">BUY-IN RANGE</th>
              <th className="py-2.5 px-3 font-jersey text-xs uppercase tracking-wider">SEATS FILLED</th>
              <th className="py-2.5 px-4 text-right font-jersey text-xs uppercase tracking-wider">STATUS</th>
            </tr>
          </thead>

          {/* Table body content */}
          <tbody>
            {paginatedTables.map((table) => (
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

      {/* Browser Footer / Pagination (Height approximately 44-50px) */}
      <div className="bg-[#1D2036] border-t-2 border-[#2E3150] px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs md:text-sm font-jersey text-[#9A9AB5] uppercase h-auto sm:h-12 select-none">
        <div>
          SHOWING {totalTables === 0 ? 0 : startIndex + 1}–{endIndex} OF {totalTables} TABLES
        </div>
        
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { audio.playClick(); setCurrentPage(1); }}
            disabled={validCurrentPage === 1}
            className="px-2.5 py-1 border border-[#2E3150] bg-[#15182A] text-xs font-bold hover:bg-[#222744] hover:text-[#F3EBD8] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-none"
            aria-label="First Page"
          >
            &lt;&lt;
          </button>
          
          <button
            onClick={() => { audio.playClick(); setCurrentPage(prev => Math.max(1, prev - 1)); }}
            disabled={validCurrentPage === 1}
            className="px-2.5 py-1 border border-[#2E3150] bg-[#15182A] text-xs font-bold hover:bg-[#222744] hover:text-[#F3EBD8] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-none"
            aria-label="Previous Page"
          >
            &lt;
          </button>
          
          <span className="px-3 py-1 bg-[#0B0D18] border border-[#2E3150] text-[#F6B73C] font-bold text-xs">
            PAGE {validCurrentPage} OF {totalPages}
          </span>
          
          <button
            onClick={() => { audio.playClick(); setCurrentPage(prev => Math.min(totalPages, prev + 1)); }}
            disabled={validCurrentPage === totalPages}
            className="px-2.5 py-1 border border-[#2E3150] bg-[#15182A] text-xs font-bold hover:bg-[#222744] hover:text-[#F3EBD8] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-none"
            aria-label="Next Page"
          >
            &gt;
          </button>
          
          <button
            onClick={() => { audio.playClick(); setCurrentPage(totalPages); }}
            disabled={validCurrentPage === totalPages}
            className="px-2.5 py-1 border border-[#2E3150] bg-[#15182A] text-xs font-bold hover:bg-[#222744] hover:text-[#F3EBD8] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-none"
            aria-label="Last Page"
          >
            &gt;&gt;
          </button>
        </div>
      </div>

    </div>
  );
};
