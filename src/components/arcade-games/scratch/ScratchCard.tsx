import React from 'react';
import { ScratchGamePhase, ScratchSymbolId } from './scratchTypes';
import { SCRATCH_SYMBOLS } from './scratchData';

interface ScratchCardProps {
  gamePhase: ScratchGamePhase;
  cardSymbols: ScratchSymbolId[];
  scratchedBlocks: Record<string, boolean>;
  revealedCells: boolean[];
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
  onLostPointerCapture: (e: React.PointerEvent<HTMLDivElement>) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({
  gamePhase,
  cardSymbols,
  scratchedBlocks,
  revealedCells,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onLostPointerCapture,
  containerRef,
}) => {
  const isCardActive =
    gamePhase === 'active' ||
    gamePhase === 'auto-revealing' ||
    gamePhase === 'crediting' ||
    gamePhase === 'win' ||
    gamePhase === 'loss' ||
    gamePhase === 'payout-error';

  const revealedCount = revealedCells.filter(Boolean).length;

  return (
    <div className="w-full flex flex-col items-center space-y-3">
      {/* Instruction & Status text outside interactive surface */}
      <div className="flex items-center justify-between w-full max-w-[440px] px-1 font-jersey uppercase text-xs">
        <span className="text-[#54D6D9]">
          {gamePhase === 'idle'
            ? 'CARD COVER LOCKED'
            : gamePhase === 'active' || gamePhase === 'auto-revealing'
            ? 'DRAG OR TAP ACROSS THE FOIL'
            : gamePhase === 'win'
            ? 'CARD COMPLETED — WINNER'
            : gamePhase === 'loss'
            ? 'CARD COMPLETED — NO MATCH'
            : 'CARD COMPLETED'}
        </span>
        <span aria-live="polite" className="text-[#F6B73C] font-bold">
          {revealedCount} OF 9 CELLS REVEALED
        </span>
      </div>

      {/* Main Card Frame */}
      <div className="bg-[#15182A] border-2 border-[#2E3150] p-3 w-full max-w-[440px] filter drop-shadow-[4px_4px_0px_#000000] relative">
        <div
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onLostPointerCapture={onLostPointerCapture}
          aria-label="Scratch card. Drag across the foil or use Auto Reveal."
          className={`relative w-full aspect-square bg-[#222744] border-2 border-[#44476B] p-2 select-none overflow-hidden ${
            gamePhase === 'active' ? 'cursor-crosshair' : 'cursor-default'
          }`}
          style={{ touchAction: 'none' }}
        >
          {/* Card Cover Overlay (Idle State) */}
          {!isCardActive && (
            <div className="absolute inset-0 z-20 bg-[#0B0D18]/95 flex flex-col items-center justify-center p-6 text-center font-jersey">
              <span className="text-4xl text-[#F6B73C] mb-2">✦</span>
              <h3 className="text-2xl text-[#F3EBD8] uppercase m-0 tracking-wide">
                BUY A CARD TO START
              </h3>
              <p className="text-xs text-[#9A9AB5] uppercase mt-1 mb-4">
                Choose a card price below.
              </p>
              <div className="bg-[#15182A] border border-[#2E3150] px-3 py-1 text-[#66D18F] text-xs">
                92.00% THEORETICAL RTP
              </div>
            </div>
          )}

          {/* 3x3 Grid */}
          <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full relative z-0">
            {cardSymbols.map((symId, idx) => {
              const sym = SCRATCH_SYMBOLS[symId] || SCRATCH_SYMBOLS.COIN;
              const Icon = sym.icon;
              const isCellRevealed = revealedCells[idx];

              return (
                <div
                  key={idx}
                  className="relative bg-[#15182A] border border-[#2E3150] flex flex-col items-center justify-center overflow-hidden p-1"
                >
                  {/* Revealed Symbol Detail */}
                  <div className="flex flex-col items-center justify-center text-center select-none">
                    <Icon />
                    <span
                      className="font-jersey text-[11px] tracking-tight uppercase leading-none mt-1 font-bold"
                      style={{ color: sym.color }}
                    >
                      {sym.name}
                    </span>
                    <span className="font-jersey text-[10px] text-[#9A9AB5] mt-0.5">
                      {sym.multiplier}×
                    </span>
                  </div>

                  {/* Foil Shroud Overlay */}
                  {!isCellRevealed && (
                    <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 pointer-events-none select-none">
                      {Array.from({ length: 25 }).map((_, bIdx) => {
                        const r = Math.floor(bIdx / 5);
                        const c = bIdx % 5;
                        const isBlockScratched = scratchedBlocks[`${idx}-${r}-${c}`];

                        return (
                          <div
                            key={bIdx}
                            className={`border-[0.5px] border-[#0B0D18]/30 ${
                              isBlockScratched
                                ? 'opacity-0 bg-transparent'
                                : 'bg-[#44476B] opacity-100'
                            }`}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
