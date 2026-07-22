import React from 'react';
import { DiceGamePhase } from './diceTypes';

interface DiceTableProps {
  die1: number;
  die2: number;
  currentSum: number;
  gamePhase: DiceGamePhase;
  isRolling: boolean;
  chainId: number;
  pendingWinnings: number;
  reduceFlashing: boolean;
}

const PixelDieFace: React.FC<{ value: number; size?: number }> = ({ value, size = 72 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className="filter drop-shadow-[3px_3px_0px_#000000]"
    >
      {/* Outer chamfered border */}
      <path d="M 2 0 L 14 0 L 16 2 L 16 14 L 14 16 L 2 16 L 0 14 L 0 2 Z" fill="#2E3150" />
      {/* Inner warm card background */}
      <path d="M 2 1 L 14 1 L 15 2 L 15 14 L 14 15 L 2 15 L 1 14 L 1 2 Z" fill="#F3EBD8" />

      {/* Pips based on value */}
      {value === 1 && <rect x="7" y="7" width="2" height="2" fill="#E85D68" />}
      {value === 2 && (
        <>
          <rect x="3" y="3" width="2" height="2" fill="#0B0D18" />
          <rect x="11" y="11" width="2" height="2" fill="#0B0D18" />
        </>
      )}
      {value === 3 && (
        <>
          <rect x="3" y="3" width="2" height="2" fill="#0B0D18" />
          <rect x="7" y="7" width="2" height="2" fill="#0B0D18" />
          <rect x="11" y="11" width="2" height="2" fill="#0B0D18" />
        </>
      )}
      {value === 4 && (
        <>
          <rect x="3" y="3" width="2" height="2" fill="#0B0D18" />
          <rect x="11" y="3" width="2" height="2" fill="#0B0D18" />
          <rect x="3" y="11" width="2" height="2" fill="#0B0D18" />
          <rect x="11" y="11" width="2" height="2" fill="#0B0D18" />
        </>
      )}
      {value === 5 && (
        <>
          <rect x="3" y="3" width="2" height="2" fill="#0B0D18" />
          <rect x="11" y="3" width="2" height="2" fill="#0B0D18" />
          <rect x="7" y="7" width="2" height="2" fill="#0B0D18" />
          <rect x="3" y="11" width="2" height="2" fill="#0B0D18" />
          <rect x="11" y="11" width="2" height="2" fill="#0B0D18" />
        </>
      )}
      {value === 6 && (
        <>
          <rect x="3" y="2" width="2" height="2" fill="#0B0D18" />
          <rect x="11" y="2" width="2" height="2" fill="#0B0D18" />
          <rect x="3" y="7" width="2" height="2" fill="#0B0D18" />
          <rect x="11" y="7" width="2" height="2" fill="#0B0D18" />
          <rect x="3" y="12" width="2" height="2" fill="#0B0D18" />
          <rect x="11" y="12" width="2" height="2" fill="#0B0D18" />
        </>
      )}
    </svg>
  );
};

export const DiceTable: React.FC<DiceTableProps> = ({
  die1,
  die2,
  currentSum,
  gamePhase,
  isRolling,
  chainId,
  pendingWinnings,
  reduceFlashing,
}) => {
  const renderStatusText = () => {
    if (isRolling || gamePhase === 'rolling') {
      return 'ROLLING...';
    }
    if (gamePhase === 'round-won') {
      return 'CORRECT — CONTINUE OR BANK';
    }
    if (gamePhase === 'round-lost') {
      return 'ROUND LOST';
    }
    if (gamePhase === 'banked') {
      return 'PAYOUT BANKED';
    }
    if (chainId > 0) {
      return 'CHOOSE THE NEXT TOTAL';
    }
    return 'SET YOUR BET TO BEGIN';
  };

  const getStatusStyle = () => {
    if (isRolling || gamePhase === 'rolling') {
      return 'bg-[#1D2036] border-[#F6B73C] text-[#F6B73C]';
    }
    if (gamePhase === 'round-won') {
      return 'bg-[#1D2036] border-[#66D18F] text-[#66D18F]';
    }
    if (gamePhase === 'round-lost') {
      return 'bg-[#1D2036] border-[#E85D68] text-[#E85D68]';
    }
    if (gamePhase === 'banked') {
      return 'bg-[#1D2036] border-[#54D6D9] text-[#54D6D9]';
    }
    return 'bg-[#1D2036] border-[#2E3150] text-[#9A9AB5]';
  };

  return (
    <div className="w-full bg-[#15182A] border-2 border-[#2E3150] p-4 flex flex-col items-center gap-4 filter drop-shadow-[4px_4px_0px_#000000]">
      {/* Chain Status Banner */}
      {chainId > 0 && (
        <div className="w-full bg-[#222744] border-2 border-[#F6B73C] p-2 text-center font-jersey text-lg text-[#F6B73C] uppercase tracking-wide">
          STEP {chainId} OF 5 • PENDING REWARD: {pendingWinnings.toFixed(2)} COINS
        </div>
      )}

      {/* Main Dice Showcase Area */}
      <div className="w-full bg-[#0B0D18] border-2 border-[#2E3150] p-6 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
        {/* Baseline Header */}
        <div className="text-center">
          <span className="font-jersey text-xs text-[#9A9AB5] uppercase tracking-wider block">
            CURRENT BASELINE TOTAL
          </span>
          <span className="font-jersey text-5xl md:text-6xl text-[#F6B73C] leading-none block mt-1 filter drop-shadow-[2px_2px_0px_#000000]">
            {currentSum}
          </span>
        </div>

        {/* Dice Faces */}
        <div className="flex items-center justify-center gap-6 my-2 select-none">
          <div className={isRolling && !reduceFlashing ? 'animate-bounce' : ''}>
            <PixelDieFace value={die1} size={76} />
          </div>
          <div className={isRolling && !reduceFlashing ? 'animate-bounce [animation-delay:0.1s]' : ''}>
            <PixelDieFace value={die2} size={76} />
          </div>
        </div>

        {/* Math summary label */}
        <span className="font-jersey text-sm text-[#9A9AB5] uppercase select-none">
          DICE COMBINATION: {die1} + {die2} = {currentSum}
        </span>
      </div>

      {/* Status Banner */}
      <div
        aria-live="polite"
        className={`w-full p-3 text-center border-2 font-jersey text-xl md:text-2xl uppercase tracking-wider ${getStatusStyle()}`}
      >
        {renderStatusText()}
      </div>
    </div>
  );
};
