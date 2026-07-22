import React from 'react';
import { UserProfile } from '../../../store';
import { Transaction } from '../../../lib/api';
import { Wallet, History, Trophy, Coins, Hash } from 'lucide-react';
import { DiceGamePhase, DicePrediction } from './diceTypes';
import { getDynamicMultiplier } from './diceData';

interface DiceSessionPanelProps {
  profile: UserProfile;
  betAmount: number;
  currentSum: number;
  prediction: DicePrediction;
  chainId: number;
  pendingWinnings: number;
  gamePhase: DiceGamePhase;
  lastResultText: string | null;
  transactionLog: Transaction[];
}

export const DiceSessionPanel: React.FC<DiceSessionPanelProps> = ({
  profile,
  betAmount,
  currentSum,
  prediction,
  chainId,
  pendingWinnings,
  gamePhase,
  lastResultText,
  transactionLog,
}) => {
  const recentRolls = transactionLog
    .filter((tx) => tx.source === 'highlow_dice')
    .slice(0, 5);

  const currentMultiplier = getDynamicMultiplier(currentSum, prediction);

  const renderLastResult = () => {
    if (lastResultText) return lastResultText;
    if (gamePhase === 'round-won') return 'CORRECT';
    if (gamePhase === 'round-lost') return 'LOSS';
    if (gamePhase === 'banked') return 'BANKED';
    return 'READY';
  };

  const resultColorClass = () => {
    if (gamePhase === 'round-won') return 'text-[#66D18F]';
    if (gamePhase === 'round-lost') return 'text-[#E85D68]';
    if (gamePhase === 'banked') return 'text-[#54D6D9]';
    return 'text-[#9A9AB5]';
  };

  return (
    <div className="space-y-4 w-full">
      {/* Session Summary Panel */}
      <div className="bg-[#15182A] border-2 border-[#2E3150] p-4 filter drop-shadow-[4px_4px_0px_#000000]">
        <h3 className="font-jersey text-2xl text-[#F3EBD8] uppercase tracking-wide border-b-2 border-[#2E3150] pb-2 mb-3">
          SESSION SUMMARY
        </h3>

        <div className="space-y-2.5 font-jersey uppercase">
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

          {/* Reference Total */}
          <div className="bg-[#1D2036] border border-[#2E3150] p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#9A9AB5]">
              <Hash className="w-4 h-4 text-[#F6B73C]" />
              <span className="text-sm">REFERENCE TOTAL</span>
            </div>
            <span className="text-xl text-[#F6B73C] font-bold">
              {currentSum}
            </span>
          </div>

          {/* Pyramid Chain Step */}
          <div className="bg-[#1D2036] border border-[#2E3150] p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#9A9AB5]">
              <Trophy className="w-4 h-4 text-[#D95F9A]" />
              <span className="text-sm font-jersey">CHAIN STEP</span>
            </div>
            <span className="text-xl text-[#D95F9A]">
              {chainId > 0 ? `STEP ${chainId} OF 5` : 'INACTIVE'}
            </span>
          </div>

          {/* Current Multiplier */}
          <div className="bg-[#1D2036] border border-[#2E3150] p-2.5 flex items-center justify-between">
            <span className="text-sm text-[#9A9AB5]">TARGET MULTIPLIER</span>
            <span className="text-xl text-[#F3EBD8]">
              {currentMultiplier > 0 ? `${currentMultiplier}×` : 'N/A'}
            </span>
          </div>

          {/* Potential Payout */}
          <div className="bg-[#1D2036] border border-[#2E3150] p-2.5 flex items-center justify-between">
            <span className="text-sm text-[#9A9AB5]">PENDING REWARD</span>
            <span className="text-xl text-[#66D18F]">
              {pendingWinnings.toFixed(2)} COINS
            </span>
          </div>

          {/* Last Result */}
          <div className="bg-[#1D2036] border border-[#2E3150] p-2.5 flex items-center justify-between">
            <span className="text-sm text-[#9A9AB5]">LAST RESULT</span>
            <span className={`text-base font-bold ${resultColorClass()}`}>
              {renderLastResult()}
            </span>
          </div>
        </div>
      </div>

      {/* Pyramid Risk Ladder Info */}
      <div className="bg-[#15182A] border-2 border-[#2E3150] p-4 filter drop-shadow-[4px_4px_0px_#000000]">
        <h4 className="font-jersey text-xl text-[#F6B73C] uppercase tracking-wide border-b-2 border-[#2E3150] pb-2 mb-2">
          PYRAMID RISK LADDER
        </h4>
        <div className="space-y-1.5 font-jersey uppercase text-xs text-[#9A9AB5]">
          {[1, 2, 3, 4, 5].map((step) => {
            const isActive = chainId === step;
            const isCompleted = chainId > step;
            return (
              <div
                key={step}
                className={`p-2 border flex justify-between items-center ${
                  isActive
                    ? 'bg-[#222744] border-[#F6B73C] text-[#F6B73C] font-bold'
                    : isCompleted
                    ? 'bg-[#1D2036] border-[#66D18F] text-[#66D18F]'
                    : 'bg-[#1D2036] border-[#2E3150] text-[#9A9AB5]'
                }`}
              >
                <span>{step === 5 ? 'STEP 5 (AUTO BANK)' : `STEP ${step}`}</span>
                <span>{step === 5 ? 'MAX COINS' : `ACTIVE CHAIN`}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Panel */}
      <div className="bg-[#15182A] border-2 border-[#2E3150] p-4 filter drop-shadow-[4px_4px_0px_#000000]">
        <div className="flex items-center gap-2 border-b-2 border-[#2E3150] pb-2 mb-3">
          <History className="w-4 h-4 text-[#54D6D9]" />
          <h3 className="font-jersey text-2xl text-[#F3EBD8] uppercase tracking-wide">
            RECENT DICE ACTIVITY
          </h3>
        </div>

        <div className="space-y-1.5 font-jersey uppercase text-sm">
          {recentRolls.map((tx) => (
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

          {recentRolls.length === 0 && (
            <p className="text-center text-[#9A9AB5] py-4 text-xs">
              NO RECENT ROLLS ON RECORD
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
