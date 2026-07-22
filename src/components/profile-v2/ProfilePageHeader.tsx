/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CasinoBadge } from '../ui-v2';
import { ProfilePageHeaderProps } from './profileTypes';

export const ProfilePageHeader: React.FC<ProfilePageHeaderProps> = ({ googleEmail }) => {
  return (
    <div className="bg-[#15182A] border-2 border-[#2E3150] p-4 sm:p-5 filter drop-shadow-[4px_4px_0px_#000000]"
      style={{ clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 12px 100%, 0% calc(100% - 12px))' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="font-jersey text-sm text-[#54D6D9] uppercase tracking-wider block">
            PLAYER ACCOUNT
          </span>
          <h1 className="font-jersey text-3xl sm:text-4xl text-[#F3EBD8] uppercase tracking-wide leading-none mt-1">
            PROFILE &amp; PROGRESS
          </h1>
          <p className="font-jersey text-base text-[#9A9AB5] uppercase mt-1 leading-tight">
            Manage your identity, review your play-money balance, and inspect account activity.
          </p>
        </div>
        <div className="shrink-0 self-start sm:self-center">
          <CasinoBadge variant={googleEmail ? 'gold' : 'dark'}>
            {googleEmail ? 'GOOGLE PROFILE' : 'LOCAL PROFILE'}
          </CasinoBadge>
        </div>
      </div>
    </div>
  );
};
