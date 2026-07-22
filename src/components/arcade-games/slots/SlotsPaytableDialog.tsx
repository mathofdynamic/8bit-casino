/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { CasinoButton, CasinoPanel } from '../../ui-v2';
import { X } from 'lucide-react';
import { SLOT_SYMBOLS } from './slotsData';

interface SlotsPaytableDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SlotsPaytableDialog: React.FC<SlotsPaytableDialogProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const DiamondIcon = SLOT_SYMBOLS.DIAMOND.icon;
  const SevenIcon = SLOT_SYMBOLS.SEVEN.icon;
  const StarIcon = SLOT_SYMBOLS.STAR.icon;
  const BellIcon = SLOT_SYMBOLS.BELL.icon;
  const CherryIcon = SLOT_SYMBOLS.CHERRY.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="paytable-dialog-title"
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CasinoPanel
          chamfer={16}
          borderColor="strong"
          className="bg-[#15182A] p-4 md:p-6"
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2E3150] pb-3">
              <h2
                id="paytable-dialog-title"
                className="font-jersey text-2xl md:text-3xl uppercase text-[#F3EBD8] tracking-wide"
              >
                777 REELS PAYTABLE
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close paytable dialog"
                className="w-8 h-8 bg-[#0B0D18] border border-[#2E3150] hover:border-[#F6B73C] text-[#9A9AB5] hover:text-[#F3EBD8] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Paytables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 3-Reel Mode */}
              <div className="bg-[#0B0D18] border border-[#2E3150] p-4 space-y-3">
                <h3 className="font-jersey text-xl text-[#54D6D9] uppercase border-b border-[#2E3150] pb-1">
                  3-REEL MODE
                </h3>
                <ul className="space-y-2 font-jersey text-base uppercase text-[#F3EBD8]">
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DiamondIcon className="w-6 h-6" />
                      <span>3 DIAMONDS</span>
                    </div>
                    <span className="text-[#F6B73C] font-bold">50×</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SevenIcon className="w-6 h-6" />
                      <span>3 SEVENS</span>
                    </div>
                    <span className="text-[#F6B73C] font-bold">25×</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StarIcon className="w-6 h-6" />
                      <span>3 STARS</span>
                    </div>
                    <span className="text-[#F6B73C] font-bold">10×</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BellIcon className="w-6 h-6" />
                      <span>3 BELLS</span>
                    </div>
                    <span className="text-[#F6B73C] font-bold">5×</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CherryIcon className="w-6 h-6" />
                      <span>3 CHERRIES</span>
                    </div>
                    <span className="text-[#F6B73C] font-bold">3×</span>
                  </li>
                  <li className="flex items-center justify-between border-t border-[#2E3150] pt-1">
                    <span>ANY TWO MATCHING</span>
                    <span className="text-[#F6B73C] font-bold">1.5×</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>SINGLE CHERRY</span>
                    <span className="text-[#66D18F] font-bold">1× RETURN</span>
                  </li>
                </ul>
              </div>

              {/* 5-Reel Mode */}
              <div className="bg-[#0B0D18] border border-[#2E3150] p-4 space-y-3">
                <h3 className="font-jersey text-xl text-[#54D6D9] uppercase border-b border-[#2E3150] pb-1">
                  5-REEL MODE
                </h3>
                <ul className="space-y-2 font-jersey text-base uppercase text-[#F3EBD8]">
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DiamondIcon className="w-6 h-6" />
                      <span>5 DIAMONDS</span>
                    </div>
                    <span className="text-[#F6B73C] font-bold">100×</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DiamondIcon className="w-6 h-6" />
                      <span>4 DIAMONDS</span>
                    </div>
                    <span className="text-[#F6B73C] font-bold">30×</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SevenIcon className="w-6 h-6" />
                      <span>5 SEVENS</span>
                    </div>
                    <span className="text-[#F6B73C] font-bold">50×</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SevenIcon className="w-6 h-6" />
                      <span>4 SEVENS</span>
                    </div>
                    <span className="text-[#F6B73C] font-bold">15×</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StarIcon className="w-6 h-6" />
                      <span>5 STARS</span>
                    </div>
                    <span className="text-[#F6B73C] font-bold">20×</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StarIcon className="w-6 h-6" />
                      <span>4 STARS</span>
                    </div>
                    <span className="text-[#F6B73C] font-bold">8×</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BellIcon className="w-6 h-6" />
                      <span>5 BELLS</span>
                    </div>
                    <span className="text-[#F6B73C] font-bold">10×</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BellIcon className="w-6 h-6" />
                      <span>4 BELLS</span>
                    </div>
                    <span className="text-[#F6B73C] font-bold">4×</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CherryIcon className="w-6 h-6" />
                      <span>5 CHERRIES</span>
                    </div>
                    <span className="text-[#F6B73C] font-bold">5×</span>
                  </li>
                  <li className="flex items-center justify-between border-t border-[#2E3150] pt-1">
                    <span>ANY THREE MATCHING</span>
                    <span className="text-[#F6B73C] font-bold">2×</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>ANY TWO MATCHING</span>
                    <span className="text-[#66D18F] font-bold">0.5×</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-2 flex justify-end">
              <CasinoButton
                type="button"
                variant="gold"
                size="md"
                onClick={onClose}
                className="px-6"
              >
                <span>DONE</span>
              </CasinoButton>
            </div>
          </div>
        </CasinoPanel>
      </div>
    </div>
  );
};
