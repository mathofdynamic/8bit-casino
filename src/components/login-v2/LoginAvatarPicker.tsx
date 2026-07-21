/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { avatars } from '../../lib/avatars';
import { audio } from '../../lib/audio';
import { Check } from 'lucide-react';

interface LoginAvatarPickerProps {
  selectedAvatarId: number;
  onSelectAvatar: (id: number) => void;
}

export const LoginAvatarPicker: React.FC<LoginAvatarPickerProps> = ({
  selectedAvatarId,
  onSelectAvatar,
}) => {
  return (
    <div className="space-y-2">
      <label className="block font-jersey text-xl text-[#F3EBD8] uppercase leading-none">
        CHOOSE CHAMPION AVATAR
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {avatars.map((av) => {
          const isSelected = selectedAvatarId === av.id;

          const clipStyle = {
            clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
          };

          return (
            <button
              key={av.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                audio.playClick();
                onSelectAvatar(av.id);
              }}
              className={`relative group cursor-pointer p-2 border-2 transition-all text-left focus:outline-none focus:ring-2 focus:ring-[#54D6D9] focus:ring-offset-2 focus:ring-offset-[#0B0D18] ${
                isSelected
                  ? 'bg-[#1D2036] border-[#54D6D9] shadow-[3px_3px_0_#000000]'
                  : 'bg-[#15182A] border-[#2E3150] hover:border-[#44476B] hover:bg-[#1D2036]/60 shadow-[2px_2px_0_#000000]'
              }`}
              style={clipStyle}
            >
              {/* Top Selected Indicator Badge */}
              {isSelected && (
                <div 
                  className="absolute top-1.5 right-1.5 z-10 bg-[#54D6D9] text-black p-0.5 border border-black flex items-center justify-center shadow-[1px_1px_0_#000]"
                  style={{ clipPath: 'polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)' }}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              {/* Avatar SVG Container */}
              <div className="flex flex-col items-center justify-center text-center p-1">
                <div className="w-12 h-12 flex items-center justify-center [&_svg]:w-full [&_svg]:h-full">
                  {av.svg}
                </div>
                <span className={`font-jersey text-base tracking-wider uppercase mt-1 leading-none ${
                  isSelected ? 'text-[#54D6D9] font-bold' : 'text-[#F3EBD8]'
                }`}>
                  {av.name.split(' ')[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
