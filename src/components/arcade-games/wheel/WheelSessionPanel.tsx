import React from 'react';
import { UserProfile } from '../../../store';
import { Transaction } from '../../../lib/api';
import { Wallet, History, Trophy, Coins } from 'lucide-react';
import { WheelResultState } from './wheelTypes';

interface WheelSessionPanelProps {
  profile: UserProfile;
  betAmount: number;
  lastMultiplier: number | null;
  lastWin: number | null;
  resultState: WheelResultState;
  transactionLog: Transaction[];
}

export const WheelSessionPanel: React.FC<WheelSessionPanelProps> = ({
  profile,
  betAmount,
  lastMultiplier,
  lastWin,
  resultState,
  transactionLog,
}) => {
  const recentSpins = transactionLog
    .filter((tx) => tx.source === 'wheel_of_fortune')
    .slice(0, 5);

  const renderLastResultText = () => {
    if (resultState === 'ready' || lastMultiplier === null) return 'READY';
    if (resultState === 'loss' || lastMultiplier === 0) return 'LOSS';
    if (resultState === 'major-win' && lastWin !== null) {
      return `MAJOR WIN +${lastWin.toFixed(2)} COINS`;
    }
    if (lastWin !== null) {
      return `+${lastWin.toFixed(2)} COINS`;
    }
    return 'READY';
  };

  const resultColorClass = () => {
    if (resultState === 'ready' || lastMultiplier === null) return 'text-[#9A9AB5]';
    if (resultState === 'loss' || lastMultiplier === 0) return 'text-[#E85D68]';
    if (resultState === 'major-win') return 'text-[#D95F9A]';
    return 'text-[#66D18F]';
  };

  return (
    <div className="space-y-4 w-full">
      {/* Session Summary Panel */}
      <div className="bg-[#15182A] border-2 border-[#2E3150] p-4 filter drop-shadow-[4px_4px_0px_#000000]">
        <h3 className="font-jersey text-2xl text-[#F3EBD8] uppercase tracking-wide border-b-2 border-[#2E3150] pb-2 mb-3">
          SESSION SUMMARY
        </h3>

        <div className="space-y-3 font-jersey uppercase">
          {/* Wallet */}
          <div className="bg-[#1D2036] border border-[#2E3150] p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#9A9AB5]">
              <Wallet className="w-4 h-4 text-[#F6B73C]" />
              <span className="text-sm">WALLET</span>
            </div>
            <span className="text-xl text-[#F6B73C]">
              {profile.chips.toFixed(2)} COINS
            </span>
          </div>

          {/* Current Bet */}
          <div className="bg-[#1D2036] border border-[#2E3150] p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#9A9AB5]">
              <Coins className="w-4 h-4 text-[#54D6D9]" />
              <span className="text-sm">CURRENT BET</span>
            </div>
            <span className="text-xl text-[#F3EBD8]">
              {betAmount.toFixed(2)} COINS
            </span>
          </div>

          {/* Last Multiplier */}
          <div className="bg-[#1D2036] border border-[#2E3150] p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#9A9AB5]">
              <Trophy className="w-4 h-4 text-[#D95F9A]" />
              <span className="text-sm">LAST MULTIPLIER</span>
            </div>
            <span className="text-xl text-[#F6B73C]">
              {lastMultiplier !== null ? `${lastMultiplier}×` : '—'}
            </span>
          </div>

          {/* Last Result */}
          <div className="bg-[#1D2036] border border-[#2E3150] p-2.5 flex items-center justify-between">
            <span className="text-sm text-[#9A9AB5]">LAST RESULT</span>
            <span className={`text-lg font-bold ${resultColorClass()}`}>
              {renderLastResultText()}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity Panel */}
      <div className="bg-[#15182A] border-2 border-[#2E3150] p-4 filter drop-shadow-[4px_4px_0px_#000000]">
        <div className="flex items-center gap-2 border-b-2 border-[#2E3150] pb-2 mb-3">
          <History className="w-4 h-4 text-[#54D6D9]" />
          <h3 className="font-jersey text-2xl text-[#F3EBD8] uppercase tracking-wide">
            RECENT WHEEL ACTIVITY
          </h3>
        </div>

        <div className="space-y-1.5 font-jersey uppercase text-sm">
          {recentSpins.map((tx) => (
            <div
              key={tx.id}
              className="bg-[#1D2036] border border-[#2E3150]/60 p-2 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span
                  className={
                    tx.type === 'CREDIT' ? 'text-[#66D18F]' : 'text-[#E85D68]'
                  }
                >
                  {tx.type === 'CREDIT' ? 'WIN' : 'BET'}
                </span>
                <span className="text-[#9A9AB5] text-xs">
                  {new Date(tx.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>
              <span
                className={
                  tx.type === 'CREDIT' ? 'text-[#66D18F]' : 'text-[#E85D68]'
                }
              >
                {tx.type === 'CREDIT' ? '+' : '-'}
                {tx.amount.toFixed(2)} COINS
              </span>
            </div>
          ))}

          {recentSpins.length === 0 && (
            <p className="text-center text-[#9A9AB5] py-4 text-xs">
              NO RECENT SPINS ON RECORD
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
