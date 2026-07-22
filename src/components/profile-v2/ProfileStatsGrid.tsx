/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CasinoPanel, CasinoBadge } from '../ui-v2';
import { ProfileStatsGridProps } from './profileTypes';
import { Coins, TrendingUp, TrendingDown, Zap, Shield, Info } from 'lucide-react';

export const ProfileStatsGrid: React.FC<ProfileStatsGridProps> = ({
  chips,
  lifetimeWinnings,
  lifetimeLosses,
  dailyStreak,
  googleEmail,
  profileId,
}) => {
  return (
    <div className="space-y-4">
      {/* Primary 4-Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Card 1: Wallet Balance */}
        <div className="bg-[#15182A] border-2 border-[#2E3150] p-3.5 flex flex-col justify-between filter drop-shadow-[2px_2px_0px_#000000]"
          style={{ clipPath: 'polygon(0% 0%, calc(100% - 8px) 0%, 100% 8px, 100% 100%, 8px 100%, 0% calc(100% - 8px))' }}
        >
          <div className="flex items-center justify-between text-[#9A9AB5] mb-2">
            <span className="font-jersey text-sm uppercase tracking-wider">WALLET BALANCE</span>
            <Coins className="w-4 h-4 text-[#F6B73C]" />
          </div>
          <div className="font-jersey text-2xl sm:text-3xl text-[#F6B73C] uppercase tracking-wide leading-none">
            {chips.toFixed(2)} COINS
          </div>
        </div>

        {/* Card 2: Lifetime Winnings */}
        <div className="bg-[#15182A] border-2 border-[#2E3150] p-3.5 flex flex-col justify-between filter drop-shadow-[2px_2px_0px_#000000]"
          style={{ clipPath: 'polygon(0% 0%, calc(100% - 8px) 0%, 100% 8px, 100% 100%, 8px 100%, 0% calc(100% - 8px))' }}
        >
          <div className="flex items-center justify-between text-[#9A9AB5] mb-2">
            <span className="font-jersey text-sm uppercase tracking-wider">LIFETIME WINNINGS</span>
            <TrendingUp className="w-4 h-4 text-[#66D18F]" />
          </div>
          <div className="font-jersey text-2xl sm:text-3xl text-[#66D18F] uppercase tracking-wide leading-none">
            +{(lifetimeWinnings || 0).toFixed(2)} COINS
          </div>
        </div>

        {/* Card 3: Lifetime Losses */}
        <div className="bg-[#15182A] border-2 border-[#2E3150] p-3.5 flex flex-col justify-between filter drop-shadow-[2px_2px_0px_#000000]"
          style={{ clipPath: 'polygon(0% 0%, calc(100% - 8px) 0%, 100% 8px, 100% 100%, 8px 100%, 0% calc(100% - 8px))' }}
        >
          <div className="flex items-center justify-between text-[#9A9AB5] mb-2">
            <span className="font-jersey text-sm uppercase tracking-wider">LIFETIME LOSSES</span>
            <TrendingDown className="w-4 h-4 text-[#E85D68]" />
          </div>
          <div className="font-jersey text-2xl sm:text-3xl text-[#E85D68] uppercase tracking-wide leading-none">
            -{(lifetimeLosses || 0).toFixed(2)} COINS
          </div>
        </div>

        {/* Card 4: Daily Streak */}
        <div className="bg-[#15182A] border-2 border-[#2E3150] p-3.5 flex flex-col justify-between filter drop-shadow-[2px_2px_0px_#000000]"
          style={{ clipPath: 'polygon(0% 0%, calc(100% - 8px) 0%, 100% 8px, 100% 100%, 8px 100%, 0% calc(100% - 8px))' }}
        >
          <div className="flex items-center justify-between text-[#9A9AB5] mb-2">
            <span className="font-jersey text-sm uppercase tracking-wider">DAILY STREAK</span>
            <Zap className="w-4 h-4 text-[#54D6D9]" />
          </div>
          <div className="font-jersey text-2xl sm:text-3xl text-[#54D6D9] uppercase tracking-wide leading-none">
            {dailyStreak} DAYS
          </div>
        </div>
      </div>

      {/* Account Information Panel */}
      <CasinoPanel
        title="ACCOUNT DETAILS"
        subtitle="Account Specification & Parameters"
        headerAccent={<Info className="w-5 h-5 text-[#54D6D9]" />}
      >
        <div className="space-y-3 font-jersey text-base uppercase">
          <div className="flex items-center justify-between border-b border-[#2E3150] pb-2">
            <span className="text-[#9A9AB5]">ACCOUNT TYPE</span>
            <CasinoBadge variant={googleEmail ? 'gold' : 'dark'}>
              {googleEmail ? 'GOOGLE CONNECTED' : 'LOCAL PROFILE'}
            </CasinoBadge>
          </div>

          <div className="flex items-center justify-between border-b border-[#2E3150] pb-2">
            <span className="text-[#9A9AB5]">PLAY STATUS</span>
            <CasinoBadge variant="cyan">
              PLAY-MONEY ONLY
            </CasinoBadge>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[#9A9AB5]">PROFILE ID</span>
            <span
              className="text-[#F3EBD8] text-sm truncate max-w-[180px] sm:max-w-[240px] text-right"
              title={profileId || 'LOCAL'}
            >
              {profileId || 'LOCAL'}
            </span>
          </div>
        </div>
      </CasinoPanel>
    </div>
  );
};
