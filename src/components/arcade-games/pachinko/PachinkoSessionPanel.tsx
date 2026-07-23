/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PachinkoLandingResult } from './pachinkoTypes';
import { Transaction } from '../../../lib/api';
import { CasinoPanel, CasinoButton, CasinoBadge } from '../../ui-v2';

interface PachinkoSessionPanelProps {
  chips: number;
  betAmount: number;
  activeBallsCount: number;
  landingResults: PachinkoLandingResult[];
  transactionLog: Transaction[];
  onRetryPayout: (result: PachinkoLandingResult) => void;
}

export const PachinkoSessionPanel: React.FC<PachinkoSessionPanelProps> = ({
  chips,
  betAmount,
  activeBallsCount,
  landingResults,
  transactionLog,
  onRetryPayout,
}) => {
  // Determine LAST LANDING display
  let lastLandingDisplay = '—';
  let lastLandingColor = 'text-[#9A9AB5]';

  if (landingResults.length > 0) {
    const newest = landingResults[0];
    if (newest.status === 'crediting') {
      lastLandingDisplay = 'PAYOUT PENDING';
      lastLandingColor = 'text-[#54D6D9]';
    } else if (newest.status === 'failed') {
      lastLandingDisplay = 'PAYOUT RETRY REQUIRED';
      lastLandingColor = 'text-[#E85D68]';
    } else {
      lastLandingDisplay = `${newest.multiplier}× (+${newest.payout.toFixed(2)} COINS)`;
      lastLandingColor = newest.multiplier >= 1.0 ? 'text-[#66D18F]' : 'text-[#F6B73C]';
    }
  }

  const recentLandings = landingResults.slice(0, 5);
  const pachinkoTxs = transactionLog
    .filter((tx) => tx.source === 'pachinko')
    .slice(0, 5);

  return (
    <CasinoPanel title="SESSION SUMMARY" className="w-full">
      <div className="space-y-4">
        {/* Metric Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#0B0D18] border border-[#2E3150] p-2">
            <span className="font-jersey text-xs text-[#9A9AB5] uppercase block">
              WALLET
            </span>
            <span className="font-jersey text-lg text-[#F6B73C] uppercase font-bold">
              {chips.toFixed(2)} COINS
            </span>
          </div>

          <div className="bg-[#0B0D18] border border-[#2E3150] p-2">
            <span className="font-jersey text-xs text-[#9A9AB5] uppercase block">
              BET PER BALL
            </span>
            <span className="font-jersey text-lg text-[#F3EBD8] uppercase font-bold">
              {betAmount.toFixed(2)} COINS
            </span>
          </div>

          <div className="bg-[#0B0D18] border border-[#2E3150] p-2">
            <span className="font-jersey text-xs text-[#9A9AB5] uppercase block">
              ACTIVE BALLS
            </span>
            <span className="font-jersey text-lg text-[#54D6D9] uppercase font-bold">
              {activeBallsCount}
            </span>
          </div>

          <div className="bg-[#0B0D18] border border-[#2E3150] p-2">
            <span className="font-jersey text-xs text-[#9A9AB5] uppercase block">
              LAST LANDING
            </span>
            <span className={`font-jersey text-base uppercase font-bold truncate block ${lastLandingColor}`}>
              {lastLandingDisplay}
            </span>
          </div>
        </div>

        {/* Recent Landings */}
        <div>
          <h4 className="font-jersey text-sm text-[#9A9AB5] uppercase mb-2">
            RECENT LANDINGS
          </h4>
          {recentLandings.length === 0 ? (
            <p className="font-jersey text-xs text-[#63657A] uppercase m-0 py-2">
              NO BALLS LANDED YET
            </p>
          ) : (
            <div className="space-y-1.5">
              {recentLandings.map((res) => (
                <div
                  key={res.id}
                  className="bg-[#0B0D18] border border-[#2E3150] p-2 flex items-center justify-between text-xs font-jersey uppercase"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[#F6B73C] font-bold">
                      {res.multiplier}×
                    </span>
                    <span className="text-[#F3EBD8]">
                      +{res.payout.toFixed(2)} COINS
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {res.status === 'crediting' && (
                      <CasinoBadge variant="cyan">CREDITING</CasinoBadge>
                    )}
                    {res.status === 'credited' && (
                      <CasinoBadge variant="success">CREDITED</CasinoBadge>
                    )}
                    {res.status === 'failed' && (
                      <CasinoButton
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => onRetryPayout(res)}
                      >
                        RETRY {res.payout.toFixed(2)} COINS
                      </CasinoButton>
                    )}
                    <span className="text-[#63657A] text-[10px]">
                      {new Date(res.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Plinko Activity */}
        <div>
          <h4 className="font-jersey text-sm text-[#9A9AB5] uppercase mb-2">
            RECENT PLINKO ACTIVITY
          </h4>
          {pachinkoTxs.length === 0 ? (
            <p className="font-jersey text-xs text-[#63657A] uppercase m-0 py-2">
              NO RECENT TRANSACTIONS
            </p>
          ) : (
            <div className="space-y-1.5 font-jersey uppercase text-xs">
              {pachinkoTxs.map((tx) => {
                const isCredit = tx.type === 'CREDIT';
                const label = isCredit ? 'PAYOUT' : 'DROP';
                const amountText = `${isCredit ? '+' : '-'}${tx.amount.toFixed(2)} COINS`;
                const colorClass = isCredit ? 'text-[#66D18F]' : 'text-[#E85D68]';

                return (
                  <div
                    key={tx.id}
                    className="bg-[#0B0D18] border border-[#2E3150] p-2 flex items-center justify-between"
                  >
                    <span className="text-[#F3EBD8]">{label}</span>
                    <span className={`font-bold ${colorClass}`}>
                      {amountText}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </CasinoPanel>
  );
};
