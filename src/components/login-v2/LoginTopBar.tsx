/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { CasinoIconButton } from '../ui-v2';

interface LoginTopBarProps {
  audioMuted: boolean;
  onToggleMute: () => void;
  onOpenSettings: () => void;
}

export const LoginTopBar: React.FC<LoginTopBarProps> = ({
  audioMuted,
  onToggleMute,
  onOpenSettings,
}) => {
  return (
    <header className="relative z-30 w-full border-b-2 border-[#2E3150] bg-[#15182A] px-4 py-2.5 shadow-[0_4px_0_#000000]">
      <div className="w-full max-w-[1200px] mx-auto flex items-center justify-between">
        {/* Brand Logo & Subtitle */}
        <div className="flex items-center gap-3 select-none">
          <div 
            className="w-8 h-8 bg-[#F6B73C] border-2 border-black flex items-center justify-center font-jersey text-xl font-bold text-black shadow-[2px_2px_0_#000]"
            style={{ clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)' }}
          >
            8
          </div>
          <div>
            <h1 className="font-jersey text-2xl text-[#F6B73C] tracking-widest uppercase leading-none m-0">
              8BIT CASINO
            </h1>
            <p className="font-jersey text-xs text-[#9A9AB5] tracking-wider uppercase m-0 mt-0.5 leading-none">
              PLAY-MONEY ARCADE & TABLE GAMES
            </p>
          </div>
        </div>

        {/* Unauthenticated Actions */}
        <div className="flex items-center gap-2">
          <CasinoIconButton
            variant={audioMuted ? 'gold' : 'dark'}
            size="sm"
            soundType="click"
            onClick={onToggleMute}
            aria-label={audioMuted ? 'Unmute sound' : 'Mute sound'}
            title={audioMuted ? 'Unmute sound' : 'Mute sound'}
            icon={audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          />

          <CasinoIconButton
            variant="dark"
            size="sm"
            soundType="click"
            onClick={onOpenSettings}
            aria-label="Open audio and accessibility settings"
            title="Open audio and accessibility settings"
            icon={<Settings className="w-4 h-4" />}
          />
        </div>
      </div>
    </header>
  );
};
