/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart } from 'lucide-react';
import { PokerTable } from './pokerTypes';
import { CasinoBadge } from '../ui-v2';
import { audio } from '../../lib/audio';

interface PokerTableRowProps {
  table: PokerTable;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export const PokerTableRow: React.FC<PokerTableRowProps> = ({
  table,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) => {
  // Simple custom pixel seat bar to mimic mockup
  const renderSeatDots = () => {
    const dots = [];
    for (let i = 0; i < table.maxSeats; i++) {
      const isFilled = i < table.seatsFilled;
      dots.push(
        <div 
          key={i} 
          className={`w-2.5 h-2.5 border border-black ${
            isFilled 
              ? 'bg-[#66D18F]' 
              : 'bg-[#15182A]'
          }`}
          style={{ clipPath: 'polygon(1px 0, calc(100% - 1px) 0, 100% 1px, 100% calc(100% - 1px), calc(100% - 1px) 100%, 1px 100%, 0 calc(100% - 1px), 0 1px)' }}
        />
      );
    }
    return <div className="flex gap-1 items-center">{dots}</div>;
  };

  const getStatusBadgeVariant = () => {
    switch (table.status) {
      case 'OPEN': return 'success';
      case 'ONE SEAT LEFT': return 'warning';
      case 'FULL': return 'danger';
      case 'INVITE ONLY': return 'dark';
      default: return 'gold';
    }
  };

  return (
    <tr 
      onClick={() => { audio.playClick(); onSelect(); }}
      className={`border-b border-[#2E3150]/60 cursor-pointer transition-none select-none ${
        isSelected 
          ? 'bg-[#1D2036] text-[#F3EBD8]' 
          : 'bg-transparent text-[#9A9AB5] hover:bg-[#1D2036]/30 hover:text-[#F3EBD8]'
      }`}
    >
      {/* 1. Favorite Column */}
      <td className="py-3 px-4 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            audio.playClick();
            onToggleFavorite(e);
          }}
          aria-label={
            isFavorite
              ? `Remove ${table.name} from favorites`
              : `Add ${table.name} to favorites`
          }
          aria-pressed={isFavorite}
          className="p-1 text-[#63657A] hover:text-[#D95F9A] transition-none cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#D95F9A] text-[#D95F9A]' : ''}`} />
        </button>
      </td>

      {/* 2. Table Name & Mode */}
      <td className="py-3 px-3 min-w-0">
        <div className="font-jersey text-[19px] uppercase font-bold leading-none flex flex-wrap items-center gap-1.5 break-words">
          {table.isLocked && <span className="text-[#E85D68] text-sm shrink-0">🔒</span>}
          <span className="truncate max-w-[150px] md:max-w-none">{table.name}</span>
          {table.isHot && <CasinoBadge variant="danger" className="py-0 px-1 text-[10px] shrink-0">HOT</CasinoBadge>}
        </div>
        <div className="font-jersey text-xs text-[#63657A] uppercase mt-1 leading-none truncate">
          {table.gameType} • {table.difficulty}
        </div>
      </td>

      {/* 3. Blinds Stakes */}
      <td className="py-3 px-3 font-jersey text-lg leading-none">
        {table.smallBlind.toFixed(2)} / {table.bigBlind.toFixed(2)} COINS
      </td>

      {/* 4. Buy-In limits */}
      <td className="py-3 px-3 font-jersey text-lg leading-none text-[#54D6D9]">
        {table.minBuyIn.toFixed(2)} – {table.maxBuyIn.toFixed(2)} COINS
      </td>

      {/* 5. Seats Occupancy */}
      <td className="py-3 px-3">
        <div className="flex flex-col gap-1.5">
          <div className="font-jersey text-base leading-none">
            {table.seatsFilled} / {table.maxSeats} SEATS
          </div>
          {renderSeatDots()}
        </div>
      </td>

      {/* 6. Status Badge & Arrow */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-3">
          <CasinoBadge variant={getStatusBadgeVariant()}>
            {table.status}
          </CasinoBadge>
          <span className={`text-[#F6B73C] text-lg select-none transition-transform duration-75 ${
            isSelected ? 'translate-x-1' : ''
          }`}>
            ▶
          </span>
        </div>
      </td>
    </tr>
  );
};
