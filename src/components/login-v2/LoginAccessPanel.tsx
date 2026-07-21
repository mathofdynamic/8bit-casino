/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CasinoPanel, CasinoButton } from '../ui-v2';
import { LoginAvatarPicker } from './LoginAvatarPicker';
import { ArrowRight, UserCheck } from 'lucide-react';

interface LoginAccessPanelProps {
  nickname: string;
  setNickname: (name: string) => void;
  selectedAvatarId: number;
  onSelectAvatar: (id: number) => void;
  onGoogleSignIn: () => void;
  onGuestSignIn: () => void;
}

export const LoginAccessPanel: React.FC<LoginAccessPanelProps> = ({
  nickname,
  setNickname,
  selectedAvatarId,
  onSelectAvatar,
  onGoogleSignIn,
  onGuestSignIn,
}) => {
  return (
    <CasinoPanel 
      title="ENTER THE CASINO" 
      subtitle="Choose your player identity and continue."
      chamfer={16} 
      borderColor="strong"
      className="w-full"
    >
      <div className="space-y-5">
        {/* Starter Balance Notice */}
        <div 
          className="border-2 border-[#F6B73C] bg-[#0B0D18] p-3 text-center shadow-[2px_2px_0_#000]"
          style={{ clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)' }}
        >
          <p className="font-jersey text-xl text-[#F6B73C] uppercase leading-none m-0">
            NEW PLAYERS START WITH 1.00 FREE COINS
          </p>
          <p className="font-jersey text-xs text-[#9A9AB5] uppercase leading-tight m-0 mt-1">
            Your starter balance can be used across poker tables and arcade games.
          </p>
        </div>

        {/* Gamer Tag Input */}
        <div>
          <label 
            htmlFor="gamer-tag-input" 
            className="block font-jersey text-xl text-[#F3EBD8] uppercase leading-none mb-1.5"
          >
            GAMER TAG
          </label>
          <div 
            className="relative bg-[#0B0D18] border-2 border-[#2E3150] focus-within:border-[#54D6D9] p-1.5 shadow-[inset_2px_2px_0_#000]"
            style={{ clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)' }}
          >
            <input
              id="gamer-tag-input"
              type="text"
              maxLength={12}
              placeholder="CHIP_CHAMP"
              value={nickname}
              onChange={(e) => setNickname(e.target.value.toUpperCase())}
              className="w-full bg-transparent font-jersey text-2xl text-[#F3EBD8] placeholder-[#63657A] uppercase focus:outline-none px-2"
            />
          </div>
          <p className="font-jersey text-xs text-[#9A9AB5] uppercase mt-1 leading-none">
            Up to 12 characters.
          </p>
        </div>

        {/* Avatar Selection */}
        <LoginAvatarPicker
          selectedAvatarId={selectedAvatarId}
          onSelectAvatar={onSelectAvatar}
        />

        {/* Primary Action Buttons */}
        <div className="pt-2 space-y-3">
          {/* Continue with Google - Light surface button */}
          <button
            type="button"
            onClick={onGoogleSignIn}
            className="w-full relative cursor-pointer select-none border-2 border-black bg-[#F3EBD8] hover:bg-[#FFFFFF] active:bg-[#E2D8C3] text-black font-jersey text-2xl uppercase tracking-wider py-2.5 px-4 flex items-center justify-center gap-2 shadow-[3px_3px_0_#000000] focus:outline-none focus:ring-2 focus:ring-[#54D6D9]"
            style={{ clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)' }}
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>CONTINUE WITH GOOGLE</span>
            <ArrowRight className="w-5 h-5 ml-auto text-black" />
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 py-1 select-none">
            <div className="h-0.5 bg-[#2E3150] flex-1" />
            <span className="font-jersey text-base text-[#9A9AB5] uppercase px-1 leading-none">OR</span>
            <div className="h-0.5 bg-[#2E3150] flex-1" />
          </div>

          {/* Continue as Guest */}
          <div>
            <CasinoButton
              type="button"
              variant="dark"
              size="lg"
              className="w-full"
              soundType="click"
              onClick={onGuestSignIn}
            >
              <div className="flex items-center justify-center gap-2">
                <UserCheck className="w-5 h-5 text-[#9A9AB5]" />
                <span>CONTINUE AS GUEST</span>
              </div>
            </CasinoButton>
            <p className="font-jersey text-xs text-[#9A9AB5] text-center uppercase mt-1 leading-none">
              Creates a local play-money profile on this device.
            </p>
          </div>
        </div>

        {/* Play-Money Disclaimer */}
        <div className="pt-2 border-t border-[#2E3150]">
          <p className="font-jersey text-xs text-[#63657A] text-center uppercase leading-tight m-0">
            PLAY-MONEY EXPERIENCE ONLY
          </p>
          <p className="font-jersey text-[11px] text-[#63657A] text-center uppercase leading-tight m-0 mt-0.5">
            No deposits, withdrawals, or cash prizes.
          </p>
        </div>
      </div>
    </CasinoPanel>
  );
};
