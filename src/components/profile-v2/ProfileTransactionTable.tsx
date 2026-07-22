/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CasinoPanel } from '../ui-v2';
import { ProfileTransactionTableProps } from './profileTypes';
import { History } from 'lucide-react';

export function formatTransactionSource(source: string): string {
  if (!source) return 'Transaction';
  const clean = source.toUpperCase();
  if (clean === 'ONBOARDING') return 'Welcome Bonus';
  if (clean === 'DAILY_BONUS') return 'Daily Bonus';
  if (clean === 'GAME_WIN') return 'Game Win';
  if (clean === 'GAME_BET') return 'Game Bet';

  return source
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function formatTransactionDate(timestamp: number): string {
  if (!timestamp) return '—';
  const date = new Date(timestamp);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month}/${day}/${year} ${hours}:${minutes}`;
}

export const ProfileTransactionTable: React.FC<ProfileTransactionTableProps> = ({
  transactionLog,
}) => {
  const sortedTransactions = React.useMemo(
    () => (transactionLog ? [...transactionLog].reverse() : []),
    [transactionLog]
  );

  return (
    <CasinoPanel
      title="TRANSACTION HISTORY"
      subtitle="Recent play-money wallet activity."
      headerAccent={<History className="w-5 h-5 text-[#54D6D9]" />}
    >
      {sortedTransactions.length === 0 ? (
        <div className="text-center py-10 px-4 space-y-2">
          <div className="font-jersey text-2xl text-[#F3EBD8] uppercase tracking-wide">
            NO TRANSACTIONS YET
          </div>
          <p className="font-jersey text-base text-[#9A9AB5] uppercase">
            Your play-money wallet activity will appear here.
          </p>
        </div>
      ) : (
        <div>
          {/* Desktop Table Grid Header (hidden on mobile) */}
          <div className="hidden sm:grid grid-cols-12 gap-2 border-b-2 border-[#2E3150] pb-2 font-jersey text-base text-[#9A9AB5] uppercase tracking-wider px-2">
            <span className="col-span-3 text-left">DATE</span>
            <span className="col-span-4 text-left">SOURCE</span>
            <span className="col-span-2 text-right">AMOUNT</span>
            <span className="col-span-3 text-right">BALANCE</span>
          </div>

          {/* List Container with scrollable height */}
          <div className="max-h-80 overflow-y-auto mt-1 sm:mt-2 space-y-2 sm:space-y-1 pr-1">
            {sortedTransactions.map((tx, idx) => {
              const formattedDate = formatTransactionDate(tx.timestamp);
              const formattedSource = formatTransactionSource(tx.source);
              const isPositive = tx.amount >= 0;
              const formattedAmount = `${isPositive ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)} COINS`;
              const formattedBalance = `${tx.balanceAfter.toFixed(2)} COINS`;
              const itemKey = tx.id || `${tx.timestamp}_${idx}`;

              return (
                <React.Fragment key={itemKey}>
                  {/* Desktop Row */}
                  <div className="hidden sm:grid grid-cols-12 gap-2 py-2 px-2 font-jersey text-base items-center tracking-wide border-b border-[#2E3150]/40 hover:bg-[#1D2036]/50 transition-colors">
                    <span className="col-span-3 text-left text-[#9A9AB5] text-sm">
                      {formattedDate}
                    </span>
                    <span className="col-span-4 text-left text-[#F3EBD8] truncate">
                      {formattedSource}
                    </span>
                    <span
                      className={`col-span-2 text-right font-bold ${
                        isPositive ? 'text-[#66D18F]' : 'text-[#E85D68]'
                      }`}
                    >
                      {formattedAmount}
                    </span>
                    <span className="col-span-3 text-right text-[#F6B73C]">
                      {formattedBalance}
                    </span>
                  </div>

                  {/* Mobile Stacked Card (hidden on desktop) */}
                  <div className="sm:hidden bg-[#0B0D18] border border-[#2E3150] p-3 space-y-1.5"
                    style={{
                      clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                    }}
                  >
                    <div className="flex items-center justify-between font-jersey text-base">
                      <span className="text-[#F3EBD8] font-bold truncate max-w-[200px]">
                        {formattedSource}
                      </span>
                      <span
                        className={`font-bold ${
                          isPositive ? 'text-[#66D18F]' : 'text-[#E85D68]'
                        }`}
                      >
                        {formattedAmount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between font-jersey text-xs text-[#9A9AB5]">
                      <span>{formattedDate}</span>
                      <span className="text-[#F6B73C] text-sm">
                        BAL: {formattedBalance}
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </CasinoPanel>
  );
};
