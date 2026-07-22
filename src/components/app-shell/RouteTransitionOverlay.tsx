import React from 'react';
import type { AppRoute } from '../../store';

interface RouteTransitionOverlayProps {
  wipeProgress: number;
  transitionProgress: number;
  destinationRoute: AppRoute;
  reduceFlashing: boolean;
}

const getDestinationLabel = (route: AppRoute): string => {
  switch (route) {
    case 'login':
      return 'SIGN IN';
    case 'lobby':
      return 'CASINO LOBBY';
    case 'poker':
      return 'POKER TABLES';
    case 'minigames':
      return 'ARCADE GAMES';
    case 'profile':
      return 'PLAYER PROFILE';
    default:
      return 'CASINO';
  }
};

export const RouteTransitionOverlay: React.FC<RouteTransitionOverlayProps> = ({
  wipeProgress,
  transitionProgress,
  destinationRoute,
  reduceFlashing: _reduceFlashing,
}) => {
  const destinationLabel = getDestinationLabel(destinationRoute);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={`Loading ${destinationLabel}`}
      className="fixed inset-0 z-[100] pointer-events-auto flex flex-col justify-between"
    >
      {/* Horizontal shutter bars */}
      <div aria-hidden="true" className="absolute inset-0 flex flex-col pointer-events-none">
        {Array.from({ length: 8 }).map((_, idx) => {
          const isCovered = wipeProgress > idx;
          const isOdd = idx % 2 === 1;
          return (
            <div
              key={idx}
              className={`h-[12.5%] w-full border-b border-[#2E3150] transition-all duration-0 ${
                isOdd ? 'bg-[#15182A]' : 'bg-[#0B0D18]'
              }`}
              style={{
                opacity: isCovered ? 1 : 0,
              }}
            />
          );
        })}
      </div>

      {/* Loading core panel */}
      {wipeProgress >= 8 && (
        <div
          aria-hidden="false"
          className="absolute inset-0 bg-[#0B0D18] flex flex-col items-center justify-center select-none font-jersey px-4"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(46, 49, 80, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(46, 49, 80, 0.15) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        >
          <div
            className="w-[calc(100%-32px)] max-w-[480px] bg-[#15182A] border-2 border-[#44476B] p-6 text-center relative filter drop-shadow-[6px_6px_0px_#000000]"
            style={{
              clipPath:
                'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)',
            }}
          >
            {/* Accent bands */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#F6B73C]" />
            <div className="absolute top-1 left-0 right-0 h-0.5 bg-[#54D6D9]" />

            {/* Header info */}
            <div className="flex items-center justify-between border-b border-[#2E3150] pb-2 mb-4 mt-1">
              <span className="text-sm text-[#F6B73C] uppercase tracking-widest">
                8BIT CASINO
              </span>
              <span className="text-xs text-[#54D6D9] uppercase tracking-widest bg-[#222744] px-2 py-0.5 border border-[#2E3150]">
                ROUTE TRANSITION
              </span>
            </div>

            {/* Main title & copy */}
            <h2 className="text-2xl md:text-3xl text-[#F3EBD8] uppercase tracking-wide leading-tight mb-1">
              LOADING {destinationLabel}
            </h2>
            <p className="text-xs text-[#9A9AB5] uppercase tracking-wider mb-5">
              Preparing your play-money session.
            </p>

            {/* 5-segment Progress Bar */}
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={transitionProgress}
              aria-label="Route loading progress"
              className="bg-[#0B0D18] border-2 border-[#2E3150] p-1.5 h-12 flex items-center gap-1.5 mb-3"
            >
              {Array.from({ length: 5 }).map((_, idx) => {
                const stepPercent = (idx + 1) * 20;
                const filled = transitionProgress >= stepPercent;
                const isFinalStep = idx === 4;

                return (
                  <div
                    key={idx}
                    className={`h-full flex-1 transition-none ${
                      filled
                        ? isFinalStep
                          ? 'bg-[#F6B73C] border border-[#0B0D18]'
                          : 'bg-[#54D6D9] border border-[#0B0D18]'
                        : 'bg-[#222744] border border-[#2E3150]'
                    }`}
                  />
                );
              })}
            </div>

            {/* Progress Status Text */}
            <div className="flex items-center justify-between text-xs text-[#9A9AB5] uppercase tracking-widest font-jersey mb-4">
              <span>{transitionProgress}% COMPLETE</span>
              <span className={transitionProgress >= 100 ? 'text-[#66D18F] font-bold' : 'text-[#9A9AB5]'}>
                {transitionProgress >= 100 ? 'READY' : 'IN PROGRESS'}
              </span>
            </div>

            {/* Destination footer detail */}
            <div className="bg-[#222744] border border-[#2E3150] p-2 flex items-center justify-between text-xs text-[#F3EBD8] uppercase font-jersey">
              <span className="text-[#9A9AB5]">DESTINATION</span>
              <span className="text-[#F6B73C] font-bold">{destinationLabel}</span>
            </div>
            <div className="mt-2 text-[10px] text-[#63657A] uppercase tracking-widest">
              PLAY-MONEY SESSION
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
