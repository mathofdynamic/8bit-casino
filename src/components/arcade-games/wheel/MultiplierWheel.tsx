import React from 'react';
import { WHEEL_SLICES } from './wheelData';
import { WheelResultState } from './wheelTypes';

interface MultiplierWheelProps {
  currentAngle: number;
  isSpinning: boolean;
  lastMultiplier: number | null;
  lastWin: number | null;
  resultState: WheelResultState;
  reduceFlashing: boolean;
}

export const MultiplierWheel: React.FC<MultiplierWheelProps> = ({
  currentAngle,
  isSpinning,
  lastMultiplier,
  lastWin,
  resultState,
  reduceFlashing,
}) => {
  const renderStatusText = () => {
    if (resultState === 'spinning') {
      return 'SPINNING...';
    }
    if (resultState === 'ready' || lastMultiplier === null) {
      return 'READY TO SPIN';
    }
    if (resultState === 'loss' || lastMultiplier === 0) {
      return 'LANDED 0× — NO PAYOUT';
    }
    if (resultState === 'major-win' && lastWin !== null) {
      return `MAJOR WIN ${lastMultiplier}× — +${lastWin.toFixed(2)} COINS`;
    }
    if (lastWin !== null) {
      return `LANDED ${lastMultiplier}× — +${lastWin.toFixed(2)} COINS`;
    }
    return 'READY TO SPIN';
  };

  const getStatusStyle = () => {
    switch (resultState) {
      case 'spinning':
        return 'bg-[#1D2036] border-[#F6B73C] text-[#F6B73C]';
      case 'loss':
        return 'bg-[#1D2036] border-[#E85D68] text-[#E85D68]';
      case 'win':
        return 'bg-[#1D2036] border-[#66D18F] text-[#66D18F]';
      case 'major-win':
        return `bg-[#1D2036] border-[#D95F9A] text-[#D95F9A] ${
          !reduceFlashing ? 'animate-pulse' : ''
        }`;
      case 'ready':
      default:
        return 'bg-[#1D2036] border-[#2E3150] text-[#9A9AB5]';
    }
  };

  return (
    <div className="w-full max-w-[420px] bg-[#15182A] border-2 border-[#2E3150] p-4 flex flex-col items-center gap-4 filter drop-shadow-[4px_4px_0px_#000000]">
      {/* Outer Wheel Container */}
      <div className="relative w-full aspect-square bg-[#0B0D18] border-2 border-[#2E3150] p-4 flex items-center justify-center overflow-hidden">
        {/* Stationary Pointer Arrow at 12 o'clock */}
        <div className="absolute top-2 z-30 flex flex-col items-center">
          <div className="w-7 h-7 bg-[#E85D68] border-2 border-[#F3EBD8] rotate-45 transform origin-center filter drop-shadow-[2px_2px_0px_#000000] flex items-center justify-center">
            <div className="w-2 h-2 bg-white opacity-80" />
          </div>
          <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-[12px] border-t-[#E85D68] -mt-1.5 filter drop-shadow-[0px_2px_0px_#000]" />
        </div>

        {/* SVG Rotating Wheel */}
        <div
          className="w-full h-full relative transition-transform duration-75 select-none"
          style={{
            transform: `rotate(${currentAngle}deg)`,
            imageRendering: 'pixelated',
          }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 400 400" className="w-full h-full" shapeRendering="crispEdges">
            {/* Outer Wheel Board Frame */}
            <circle cx="200" cy="200" r="195" fill="#15182A" stroke="#2E3150" strokeWidth="6" />

            {/* 16 Wheel Slices */}
            {WHEEL_SLICES.map((slice) => {
              const angleOffset = slice.index * 22.5;
              return (
                <g key={slice.index} transform={`rotate(${angleOffset}, 200, 200)`}>
                  {/* Slice Pie Wedge */}
                  <path
                    d="M 200 200 L 164.88 23.46 A 180 180 0 0 1 235.12 23.46 Z"
                    fill={slice.color}
                    stroke="#15182A"
                    strokeWidth="2.5"
                  />

                  {/* Multiplier Label */}
                  <text
                    x="200"
                    y="62"
                    fill={slice.textColor}
                    fontFamily="Jersey 25"
                    fontSize="24"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {slice.label}
                  </text>

                  {/* Perimeter Peg Mark */}
                  <circle cx="200" cy="21" r="3" fill="#F3EBD8" stroke="#0B0D18" strokeWidth="1.5" />
                </g>
              );
            })}

            {/* Center Hub */}
            <circle cx="200" cy="200" r="42" fill="#15182A" stroke="#F6B73C" strokeWidth="4" />
            <circle cx="200" cy="200" r="34" fill="#F6B73C" />
            <text
              x="200"
              y="207"
              fill="#0B0D18"
              fontFamily="Jersey 25"
              fontSize="22"
              textAnchor="middle"
              fontWeight="bold"
            >
              8BIT
            </text>
          </svg>
        </div>
      </div>

      {/* Result Status Display */}
      <div
        aria-live="polite"
        className={`w-full p-3 text-center border-2 font-jersey text-xl md:text-2xl uppercase tracking-wider ${getStatusStyle()}`}
      >
        {renderStatusText()}
      </div>
    </div>
  );
};
