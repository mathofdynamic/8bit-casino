/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CasinoButton, CasinoPanel } from '../ui-v2';
import { HelpCircle, X, ChevronRight } from 'lucide-react';
import { audio } from '../../lib/audio';

interface PokerHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PokerHelpModal: React.FC<PokerHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 select-none">
      
      {/* Absolute Backdrop close */}
      <button 
        onClick={() => { audio.playClick(); onClose(); }}
        className="absolute inset-0 w-full h-full bg-transparent border-none cursor-pointer"
        aria-label="Close help overlay"
      />

      <div className="relative w-full max-w-2xl z-10 animate-pixel-entrance">
        <CasinoPanel 
          title="SALOON RULEBOOK & INTEL" 
          subtitle="Reference system guidelines, poker hand scales, and bot profiles"
          headerAccent={
            <button 
              onClick={() => { audio.playClick(); onClose(); }}
              className="p-1 text-[#63657A] hover:text-[#E85D68] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          }
        >
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
            
            {/* 1. Quick guidelines */}
            <div className="bg-[#0B0D18] p-3 border border-[#2E3150]" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
              <span className="font-jersey text-sm text-[#F6B73C] font-bold uppercase block mb-1">SYSTEM CONTROLS & STRUCTURE</span>
              <p className="font-jersey text-xs text-[#9A9AB5] uppercase leading-tight">
                Blinds are placed automatically on your behalf. Standard Texas Hold'em uses 2 hole cards and 5 community cards. Omaha uses 4 hole cards and requires exactly 2 hole cards and 3 community cards to make a hand.
              </p>
            </div>

            {/* 2. Hand Ranks list */}
            <div>
              <span className="font-jersey text-sm text-[#54D6D9] font-bold uppercase block mb-2">CABINET HAND SCALES (STRONGEST TO WEAKEST)</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { rank: "1. ROYAL FLUSH", desc: "A-K-Q-J-10 same suit" },
                  { rank: "2. STRAIGHT FLUSH", desc: "Five consecutive same suit" },
                  { rank: "3. FOUR OF A KIND", desc: "Four cards of same rank" },
                  { rank: "4. FULL HOUSE", desc: "Three of kind + One Pair" },
                  { rank: "5. FLUSH", desc: "Five cards of same suit" },
                  { rank: "6. STRAIGHT", desc: "Five consecutive ranks" },
                  { rank: "7. THREE OF A KIND", desc: "Three cards of same rank" },
                  { rank: "8. TWO PAIR", desc: "Two pairs of ranks" },
                  { rank: "9. ONE PAIR", desc: "Two cards of same rank" },
                  { rank: "10. HIGH CARD", desc: "Highest single value card" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-[#1D2036]/50 p-2 border border-[#2E3150]/60" style={{ clipPath: 'polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)' }}>
                    <span className="font-jersey font-bold text-[#F3EBD8]">{item.rank}</span>
                    <span className="font-jersey text-[#63657A] text-[10px] text-right">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Bot behaviors */}
            <div>
              <span className="font-jersey text-sm text-[#D95F9A] font-bold uppercase block mb-2">BOT DECODER TELEMETRY</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 bg-[#0B0D18] border border-[#2E3150]/40">
                  <span className="font-jersey font-bold text-[#66D18F] uppercase block mb-1">BOT CHIP / GARY</span>
                  <p className="font-jersey text-[#63657A] leading-tight text-[11px] uppercase">Tight & Passive. Only commits chips when holding premium hands. Easy to bluff off mediocre draws.</p>
                </div>
                <div className="p-2.5 bg-[#0B0D18] border border-[#2E3150]/40">
                  <span className="font-jersey font-bold text-[#F29E4C] uppercase block mb-1">BOT BIT / CYBER</span>
                  <p className="font-jersey text-[#63657A] leading-tight text-[11px] uppercase">Loose Aggressive. Raises and bets on wide ranges. Expect high volatility and heavy showdown bluffs.</p>
                </div>
                <div className="p-2.5 bg-[#0B0D18] border border-[#2E3150]/40">
                  <span className="font-jersey font-bold text-[#E85D68] uppercase block mb-1">BOT ACE / DEEP</span>
                  <p className="font-jersey text-[#63657A] leading-tight text-[11px] uppercase">GTO Expert. Optimized statistics-based decisions. Unbluffable and will exploit positional advantages.</p>
                </div>
              </div>
            </div>

            {/* 4. Play Money disclaimer */}
            <div className="bg-[#111322] p-2 text-center border-t border-[#2E3150]">
              <p className="font-jersey text-[11px] text-[#63657A] uppercase leading-none">
                ATTENTION: THIS GAME IS 100% PLAY MONEY COINS ONLY. NO REAL MONEY VALUE. PLAY RESPONSIBLY.
              </p>
            </div>

          </div>

          <div className="flex justify-end pt-3 border-t border-[#2E3150] mt-3">
            <CasinoButton 
              variant="gold" 
              size="sm" 
              onClick={() => { audio.playClick(); onClose(); }}
            >
              DISMISS RULEBOOK
            </CasinoButton>
          </div>
        </CasinoPanel>
      </div>
    </div>
  );
};
