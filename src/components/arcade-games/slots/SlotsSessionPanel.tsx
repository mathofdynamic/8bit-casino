/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SlotMode } from './slotsTypes';
import { CasinoPanel } from '../../ui-v2';

interface SlotsSessionPanelProps {
  chips: number;
  betAmount: number;
  cabinetMode: SlotMode;
  lastWin: number | null;
  jackpotBanner: string | null;
  transactionLog: Array<{
    id: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    source: string;
    timestamp: number;
  }>;
}

export const SlotsSessionPanel: React.FC<SlotsSessionPanelProps> = ({
  chips,
  betAmount,
  cabinetMode,
  lastWin,
  jackpotBanner,
  transactionLog,
}) => {
  const recentSlotsTx = transactionLog
    .filter((tx) => tx.source === 'slot_machine')
    .slice(0, 5);

  const renderLastResultText = () => {
    if (jackpotBanner && lastWin !== null) {
      return `JACKPOT +${lastWin.toFixed(2)} COINS`;
    }
    if (lastWin !== null) {
      if (lastWin > 0) {
        return `+${lastWin.toFixed(2)} COINS`;
      }
      return `LOSS`;
    }
    return `READY`;
  };

  return (
    <div className="space-y-4 w-full">
      {/* Session Stats Panel */}
      <CasinoPanel
        chamfer={12}
        borderColor="default"
        className="w-full bg-[#15182A]"
      >
        <div className="space-y-3 p-1">
          <h3 className="font-jersey text-xl uppercase text-[#F3EBD8] tracking-wide border-b border-[#2E3150] pb-2">
            SESSION SUMMARY
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0B0D18] border border-[#2E3150] p-2.5 space-y-0.5">
              <span className="font-jersey text-xs text-[#9A9AB5] uppercase block">
                WALLET
              </span>
              <span className="font-jersey text-lg text-[#F6B73C] font-bold block truncate">
                {chips.toFixed(2)} COINS
              </span>
            </div>

            <div className="bg-[#0B0D18] border border-[#2E3150] p-2.5 space-y-0.5">
              <span className="font-jersey text-xs text-[#9A9AB5] uppercase block">
                CURRENT BET
              </span>
              <span className="font-jersey text-lg text-[#F3EBD8] font-bold block truncate">
                {betAmount.toFixed(2)} COINS
              </span>
            </div>

            <div className="bg-[#0B0D18] border border-[#2E3150] p-2.5 space-y-0.5">
              <span className="font-jersey text-xs text-[#9A9AB5] uppercase block">
                MODE
              </span>
              <span className="font-jersey text-lg text-[#54D6D9] font-bold block">
                {cabinetMode} REELS
              </span>
            </div>

            <div className="bg-[#0B0D18] border border-[#2E3150] p-2.5 space-y-0.5">
              <span className="font-jersey text-xs text-[#9A9AB5] uppercase block">
                LAST RESULT
              </span>
              <span
                className={`font-jersey text-lg font-bold block truncate ${
                  lastWin && lastWin > 0
                    ? 'text-[#66D18F]'
                    : lastWin === 0
                    ? 'text-[#E85D68]'
                    : 'text-[#9A9AB5]'
                }`}
              >
                {renderLastResultText()}
              </span>
            </div>
          </div>
        </div>
      </CasinoPanel>

      {/* Recent Slot Activity */}
      <CasinoPanel
        chamfer={12}
        borderColor="default"
        className="w-full bg-[#15182A]"
      >
        <div className="space-y-3 p-1">
          <h3 className="font-jersey text-xl uppercase text-[#F3EBD8] tracking-wide border-b border-[#2E3150] pb-2">
            RECENT SLOT ACTIVITY
          </h3>

          <div className="space-y-2">
            {recentSlotsTx.length > 0 ? (
              recentSlotsTx.map((tx) => {
                const isWin = tx.type === 'CREDIT';
                const timeStr = new Date(tx.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between bg-[#0B0D18] border border-[#2E3150] px-3 py-2 text-sm font-jersey"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold uppercase ${
                          isWin ? 'text-[#66D18F]' : 'text-[#E85D68]'
                        }`}
                      >
                        {isWin ? 'WIN' : 'BET'}
                      </span>
                      <span className="text-[#9A9AB5] text-xs">{timeStr}</span>
                    </div>

                    <span
                      className={`font-bold ${
                        isWin ? 'text-[#66D18F]' : 'text-[#E85D68]'
                      }`}
                    >
                      {isWin ? '+' : '-'}{tx.amount.toFixed(2)} COINS
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="font-jersey text-sm text-[#9A9AB5] uppercase text-center py-4 bg-[#0B0D18] border border-[#2E3150]">
                NO RECENT SPINS RECORDED
              </p>
            )}
          </div>
        </div>
      </CasinoPanel>
    </div>
  );
};
