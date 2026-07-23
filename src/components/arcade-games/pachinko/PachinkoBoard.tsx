/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  PACHINKO_BOARD_WIDTH,
  PACHINKO_BOARD_HEIGHT,
  PACHINKO_PEG_RADIUS,
  PACHINKO_BALL_RADIUS,
  PACHINKO_SLOTS,
} from './pachinkoData';
import { PachinkoPeg, PachinkoBall } from './pachinkoTypes';

interface PachinkoBoardProps {
  pegs: PachinkoPeg[];
  activeBalls: PachinkoBall[];
  latestResultText: string | null;
  hasFailedSettlement: boolean;
}

export const PachinkoBoard: React.FC<PachinkoBoardProps> = ({
  pegs,
  activeBalls,
  latestResultText,
  hasFailedSettlement,
}) => {
  const slotWidth = PACHINKO_BOARD_WIDTH / 9;

  let statusText = 'READY TO DROP';
  let statusColor = 'text-[#54D6D9]';

  if (hasFailedSettlement) {
    statusText = 'PAYOUT RETRY REQUIRED';
    statusColor = 'text-[#E85D68]';
  } else if (latestResultText) {
    statusText = latestResultText;
    statusColor = 'text-[#F6B73C]';
  } else if (activeBalls.length === 1) {
    statusText = '1 BALL IN PLAY';
    statusColor = 'text-[#54D6D9]';
  } else if (activeBalls.length > 1) {
    statusText = `${activeBalls.length} BALLS IN PLAY`;
    statusColor = 'text-[#54D6D9]';
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Board SVG Container */}
      <div className="relative w-full max-w-[440px] bg-[#0B0D18] border-2 border-[#2E3150] p-3 filter drop-shadow-[4px_4px_0px_#000000]">
        <svg
          viewBox={`0 0 ${PACHINKO_BOARD_WIDTH} ${PACHINKO_BOARD_HEIGHT}`}
          className="w-full h-auto bg-[#0B0D18] block"
          shapeRendering="crispEdges"
          aria-hidden="true"
        >
          {/* Background Grid / Slot Dividers */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={i}
              x1={slotWidth * i}
              y1={PACHINKO_BOARD_HEIGHT - 40}
              x2={slotWidth * i}
              y2={PACHINKO_BOARD_HEIGHT}
              stroke="#2E3150"
              strokeWidth="2"
            />
          ))}

          {/* Pegs */}
          {pegs.map((peg, idx) => (
            <g key={idx}>
              {/* Peg Shadow */}
              <rect
                x={peg.x - PACHINKO_PEG_RADIUS + 1.5}
                y={peg.y - PACHINKO_PEG_RADIUS + 1.5}
                width={PACHINKO_PEG_RADIUS * 2}
                height={PACHINKO_PEG_RADIUS * 2}
                fill="#000000"
              />
              {/* Peg Main */}
              <rect
                x={peg.x - PACHINKO_PEG_RADIUS}
                y={peg.y - PACHINKO_PEG_RADIUS}
                width={PACHINKO_PEG_RADIUS * 2}
                height={PACHINKO_PEG_RADIUS * 2}
                fill="#F3EBD8"
              />
            </g>
          ))}

          {/* Bottom Slots */}
          {PACHINKO_SLOTS.map((slot) => {
            const x = slot.index * slotWidth;
            const y = PACHINKO_BOARD_HEIGHT - 40;

            return (
              <g key={slot.index}>
                {/* Slot fill background */}
                <rect
                  x={x + 2}
                  y={y + 2}
                  width={slotWidth - 4}
                  height={36}
                  fill={slot.color}
                  opacity="0.18"
                />
                {/* Slot bottom indicator line */}
                <rect
                  x={x + 3}
                  y={PACHINKO_BOARD_HEIGHT - 6}
                  width={slotWidth - 6}
                  height={4}
                  fill={slot.color}
                />
                {/* Multiplier label */}
                <text
                  x={x + slotWidth / 2}
                  y={PACHINKO_BOARD_HEIGHT - 16}
                  fill={slot.color}
                  fontSize="13"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="Jersey 25, sans-serif"
                >
                  {slot.multiplier}×
                </text>
              </g>
            );
          })}

          {/* Active Balls */}
          {activeBalls.map((ball) => (
            <g key={ball.id}>
              {/* Ball Drop Shadow */}
              <rect
                x={ball.x - PACHINKO_BALL_RADIUS + 2}
                y={ball.y - PACHINKO_BALL_RADIUS + 2}
                width={PACHINKO_BALL_RADIUS * 2}
                height={PACHINKO_BALL_RADIUS * 2}
                fill="#000000"
              />
              {/* Ball Body */}
              <rect
                x={ball.x - PACHINKO_BALL_RADIUS}
                y={ball.y - PACHINKO_BALL_RADIUS}
                width={PACHINKO_BALL_RADIUS * 2}
                height={PACHINKO_BALL_RADIUS * 2}
                fill="#F6B73C"
              />
              {/* Ball Highlight */}
              <rect
                x={ball.x - PACHINKO_BALL_RADIUS + 1.5}
                y={ball.y - PACHINKO_BALL_RADIUS + 1.5}
                width="3"
                height="3"
                fill="#F3EBD8"
              />
            </g>
          ))}
        </svg>

        {/* Live Status Text Area */}
        <div
          aria-live="polite"
          className="mt-3 p-2 bg-[#15182A] border border-[#2E3150] text-center"
        >
          <span
            className={`font-jersey text-lg md:text-xl uppercase tracking-wider leading-none ${statusColor}`}
          >
            {statusText}
          </span>
        </div>
      </div>
    </div>
  );
};
