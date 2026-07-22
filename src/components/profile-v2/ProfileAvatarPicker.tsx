/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { avatars, PixelAvatar } from '../../lib/avatars';
import { CasinoBadge } from '../ui-v2';
import { ProfileAvatarPickerProps } from './profileTypes';
import { Check } from 'lucide-react';

export const ProfileAvatarPicker: React.FC<ProfileAvatarPickerProps> = ({
  selectedAvatarId,
  onSelectAvatar,
}) => {
  return (
    <div className="space-y-3">
      <label className="block font-jersey text-lg text-[#F3EBD8] uppercase tracking-wide">
        AVATAR SELECTION
      </label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {avatars.map((av) => {
          const isSelected = selectedAvatarId === av.id;

          return (
            <button
              key={av.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectAvatar(av.id, av.name)}
              className={`p-2.5 border-2 text-left transition-colors cursor-pointer select-none relative focus:outline-none focus:ring-2 focus:ring-[#54D6D9] ${
                isSelected
                  ? 'bg-[#1D2036] border-[#54D6D9] shadow-[2px_2px_0px_#000000]'
                  : 'bg-[#0B0D18] border-[#2E3150] hover:border-[#44476B] hover:bg-[#15182A]'
              }`}
              style={{
                clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
              }}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <PixelAvatar avatarId={av.id} size={48} />
                
                <div className="w-full">
                  <div className="font-jersey text-base text-[#F3EBD8] uppercase truncate leading-tight">
                    {av.name}
                  </div>
                </div>

                {isSelected ? (
                  <CasinoBadge variant="cyan" className="mt-0.5">
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      SELECTED
                    </span>
                  </CasinoBadge>
                ) : (
                  <span className="font-jersey text-xs text-[#63657A] uppercase leading-none mt-1">
                    SELECT
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
