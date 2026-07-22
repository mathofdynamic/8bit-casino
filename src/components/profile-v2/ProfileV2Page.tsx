/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ProfileV2PageProps } from './profileTypes';
import { ProfilePageHeader } from './ProfilePageHeader';
import { ProfileIdentityCard } from './ProfileIdentityCard';
import { ProfileStatsGrid } from './ProfileStatsGrid';
import { ProfileTransactionTable } from './ProfileTransactionTable';

export const ProfileV2Page: React.FC<ProfileV2PageProps> = ({
  profile,
  nameDraft,
  setNameDraft,
  onSaveName,
  onSelectAvatar,
  lifetimeWinnings,
  lifetimeLosses,
  transactionLog,
  onLogout,
}) => {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-6">
      {/* 1. Page Header */}
      <ProfilePageHeader googleEmail={profile.googleEmail} />

      {/* 2. Two-column account overview (Desktop) / Stacked (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Identity Card */}
        <div className="lg:col-span-6 w-full">
          <ProfileIdentityCard
            profile={profile}
            nameDraft={nameDraft}
            setNameDraft={setNameDraft}
            onSaveName={onSaveName}
            onSelectAvatar={onSelectAvatar}
            onLogout={onLogout}
          />
        </div>

        {/* Right Column: Statistics Grid & Account Info */}
        <div className="lg:col-span-6 w-full">
          <ProfileStatsGrid
            chips={profile.chips}
            lifetimeWinnings={lifetimeWinnings}
            lifetimeLosses={lifetimeLosses}
            dailyStreak={profile.dailyStreak}
            googleEmail={profile.googleEmail}
            profileId={profile.id}
          />
        </div>
      </div>

      {/* 3. Full-width Transaction History */}
      <div className="w-full">
        <ProfileTransactionTable transactionLog={transactionLog} />
      </div>
    </div>
  );
};
