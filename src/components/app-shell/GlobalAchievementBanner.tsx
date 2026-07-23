/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, Trophy, Spade, Sparkles, Flame, X, type LucideIcon } from 'lucide-react';

export interface AchievementPopupData {
  id: string;
  title: string;
  description: string;
}

interface GlobalAchievementBannerProps {
  achievement: AchievementPopupData | null;
  onClose: () => void;
}

interface AchievementPresentation {
  Icon: LucideIcon;
  accentText: string;
  accentBorder: string;
  accentSurface: string;
  description: string;
}

const getAchievementPresentation = (
  id: string,
  fallbackDescription: string
): AchievementPresentation => {
  switch (id) {
    case 'first_win':
      return {
        Icon: Trophy,
        accentText: 'text-[#54D6D9]',
        accentBorder: 'border-[#54D6D9]',
        accentSurface: 'bg-[#54D6D9]',
        description: 'Earned your first successful play-money payout.',
      };
    case 'poker_win':
      return {
        Icon: Spade,
        accentText: 'text-[#54D6D9]',
        accentBorder: 'border-[#54D6D9]',
        accentSurface: 'bg-[#54D6D9]',
        description: 'Won a completed poker hand.',
      };
    case 'jackpot':
      return {
        Icon: Sparkles,
        accentText: 'text-[#D95F9A]',
        accentBorder: 'border-[#D95F9A]',
        accentSurface: 'bg-[#D95F9A]',
        description: 'Landed a major multiplier payout.',
      };
    case 'streak_7':
      return {
        Icon: Flame,
        accentText: 'text-[#F6B73C]',
        accentBorder: 'border-[#F6B73C]',
        accentSurface: 'bg-[#F6B73C]',
        description: 'Completed a seven-day daily bonus streak and earned 1.00 bonus Coins.',
      };
    default:
      return {
        Icon: Award,
        accentText: 'text-[#F6B73C]',
        accentBorder: 'border-[#F6B73C]',
        accentSurface: 'bg-[#F6B73C]',
        description: fallbackDescription,
      };
  }
};

export const GlobalAchievementBanner: React.FC<GlobalAchievementBannerProps> = ({
  achievement,
  onClose,
}) => {
  if (!achievement) return null;

  const presentation = getAchievementPresentation(achievement.id, achievement.description);
  const { Icon } = presentation;

  return (
    <div className="fixed top-20 inset-x-0 z-[90] px-4 flex justify-center md:justify-end pointer-events-none">
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="w-full max-w-[420px] pointer-events-auto bg-[#15182A] border-2 border-[#44476B] p-3.5 relative flex flex-col gap-2 select-none"
        style={{
          clipPath:
            'polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px)',
          boxShadow: '4px 4px 0px #000000',
        }}
      >
        {/* Main content block */}
        <div className="flex items-start gap-3 min-w-0 pr-6">
          {/* Icon block */}
          <div
            className={`w-12 h-12 bg-[#0B0D18] border-2 ${presentation.accentBorder} flex items-center justify-center shrink-0`}
            style={{
              clipPath:
                'polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)',
            }}
          >
            <Icon className={`w-6 h-6 ${presentation.accentText}`} aria-hidden="true" />
          </div>

          <div className="flex flex-col min-w-0 text-left">
            <span className={`font-jersey text-xs uppercase tracking-wider font-bold ${presentation.accentText}`}>
              ACHIEVEMENT UNLOCKED
            </span>
            <h4 className="font-jersey text-xl text-[#F3EBD8] uppercase leading-tight m-0 whitespace-normal break-words">
              {achievement.title}
            </h4>
            <p className="font-jersey text-xs text-[#9A9AB5] uppercase leading-snug mt-1 mb-0 break-words">
              {presentation.description}
            </p>
          </div>
        </div>

        {/* Bottom accent bar & supporting tag */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2E3150] text-[10px] font-jersey uppercase text-[#63657A]">
          <span>PLAY-MONEY MILESTONE</span>
          <div className={`h-1 w-12 ${presentation.accentSurface}`} />
        </div>

        {/* Close Button */}
        <button
          type="button"
          aria-label="Dismiss achievement notification"
          onClick={onClose}
          className="absolute top-2 right-2 p-1 bg-[#0B0D18] border border-[#2E3150] text-[#9A9AB5] hover:text-[#F3EBD8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6B73C] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
