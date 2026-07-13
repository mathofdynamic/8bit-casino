/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { CasinoPanel, CasinoButton, CasinoBadge, CasinoProgressBar } from '../ui-v2';
import { audio } from '../../lib/audio';

export const DailyRewardsModule: React.FC = () => {
  const { profile, claimDailyBonus, triggerToast } = useStore();
  const [timeLeftStr, setTimeLeftStr] = useState('');

  // Keep countdown timer updated for Daily Rewards
  useEffect(() => {
    if (!profile.lastClaimedTimestamp) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = now - profile.lastClaimedTimestamp!;
      const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;
      const remaining = MILLISECONDS_IN_A_DAY - diff;

      if (remaining <= 0) {
        setTimeLeftStr('');
      } else {
        const hrs = Math.floor(remaining / (60 * 60 * 1000));
        const mins = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        const secs = Math.floor((remaining % (60 * 1000)) / 1000);
        setTimeLeftStr(
          `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [profile.lastClaimedTimestamp]);

  const isClaimedToday = () => {
    if (!profile.lastClaimedTimestamp) return false;
    const now = Date.now();
    return (now - profile.lastClaimedTimestamp) < (24 * 60 * 60 * 1000);
  };

  const handleClaimReward = async () => {
    if (isClaimedToday()) {
      audio.playClick();
      triggerToast('DAILY BONUSES ARE COOLING DOWN!', 'error');
      return;
    }
    const result = await claimDailyBonus();
    if (result.success) {
      audio.playWin();
    }
  };

  return (
    <CasinoPanel 
      title="DAILY REWARDS" 
      subtitle="LOGIN STREAK AND FREE COINS" 
      borderColor="default"
      compactHeader={true}
      footer={
        <div className="w-full flex justify-between items-center text-[10px] text-[#9A9AB5] uppercase font-jersey">
          <span>COOLDOWN: 24h</span>
          <button 
            onClick={() => triggerToast('BONUS MULTIPLIES FOR EVERY CONSECUTIVE LOG IN!', 'info')}
            className="text-[#54D6D9] hover:underline cursor-pointer"
          >
            INFO
          </button>
        </div>
      }
    >
      <div className="space-y-3 font-jersey">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-[#222744] border border-[#2E3150] text-[#F6B73C] text-sm select-none">🏆</div>
            <div>
              <span className="text-[10px] text-[#9A9AB5] block uppercase leading-none">STREAK</span>
              <span className="text-base text-[#F3EBD8] uppercase leading-none mt-0.5 block">{profile.dailyStreak} DAYS ACTIVE</span>
            </div>
          </div>
          <CasinoBadge variant={isClaimedToday() ? "dark" : "magenta"} className="text-[10px] py-0 px-1">
            {isClaimedToday() ? "CLAIMED" : "AVAILABLE"}
          </CasinoBadge>
        </div>

        <div className="bg-[#0B0D18] border border-[#2E3150] p-2 text-center" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
          {isClaimedToday() ? (
            <div className="space-y-0.5">
              <span className="text-[#9A9AB5] uppercase text-[10px] block leading-none">NEXT REFILL IN</span>
              <span className="text-xl text-[#F29E4C] block leading-none py-0.5">{timeLeftStr || "00:00:00"}</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <span className="text-[#9A9AB5] uppercase text-[10px] block leading-none font-bold">BONUS READY</span>
              <CasinoButton 
                variant="gold" 
                size="sm" 
                shimmer={true}
                className="w-full filter drop-shadow-[2px_2px_0px_#000000] text-xs py-1"
                onClick={handleClaimReward}
              >
                CLAIM 1.00 COINS
              </CasinoButton>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-[#9A9AB5] uppercase leading-none">
            <span>MULTIPLIER METER</span>
            <span>{Math.min(7, profile.dailyStreak)}/7 DAYS</span>
          </div>
          <CasinoProgressBar value={Math.min(100, (profile.dailyStreak % 8) * 14.3)} color="magenta" segments={7} />
        </div>
      </div>
    </CasinoPanel>
  );
};
