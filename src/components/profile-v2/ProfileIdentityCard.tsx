/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CasinoPanel, CasinoButton, CasinoBadge } from '../ui-v2';
import { PixelAvatar } from '../../lib/avatars';
import { ProfileIdentityCardProps } from './profileTypes';
import { ProfileAvatarPicker } from './ProfileAvatarPicker';
import { User, Coins, LogOut } from 'lucide-react';

export const ProfileIdentityCard: React.FC<ProfileIdentityCardProps> = ({
  profile,
  nameDraft,
  setNameDraft,
  onSaveName,
  onSelectAvatar,
  onLogout,
}) => {
  const isNameChanged = nameDraft.trim().toUpperCase() !== profile.name;

  const handleNameFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveName();
  };

  const handleLogoutClick = () => {
    if (window.confirm('LOG OUT AND CLEAR THIS LOCAL PLAY-MONEY PROFILE?')) {
      onLogout();
    }
  };

  return (
    <CasinoPanel
      title="PLAYER IDENTITY"
      subtitle="Identity & Avatar Settings"
      headerAccent={<User className="w-5 h-5 text-[#F6B73C]" />}
    >
      <div className="space-y-6">
        {/* Profile Card Summary Banner */}
        <div className="bg-[#0B0D18] border-2 border-[#2E3150] p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          style={{
            clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
          }}
        >
          <div className="shrink-0">
            <PixelAvatar
              avatarId={profile.avatarId}
              googlePicture={profile.googlePicture}
              size={64}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-jersey text-2xl sm:text-3xl text-[#F3EBD8] uppercase leading-none truncate">
              {profile.name || 'GUEST PLAYER'}
            </h2>
            
            <p className="font-jersey text-xs sm:text-sm text-[#54D6D9] uppercase mt-1 leading-tight truncate">
              {profile.googleEmail ? profile.googleEmail : 'LOCAL PLAY-MONEY PROFILE'}
            </p>

            <p className="font-jersey text-xs text-[#63657A] uppercase mt-1 leading-tight truncate" title={profile.id}>
              ID: {profile.id || 'LOCAL'}
            </p>

            <div className="mt-2.5 flex items-center gap-1.5 text-[#F6B73C]">
              <Coins className="w-4 h-4 shrink-0 fill-[#F6B73C]/20" />
              <span className="font-jersey text-xl uppercase tracking-wider leading-none">
                {profile.chips.toFixed(2)} COINS
              </span>
            </div>
          </div>
        </div>

        {/* Gamer Tag Editing Form */}
        <form onSubmit={handleNameFormSubmit} className="space-y-2">
          <label htmlFor="gamer-tag-input" className="block font-jersey text-lg text-[#F3EBD8] uppercase tracking-wide">
            GAMER TAG
          </label>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="gamer-tag-input"
              type="text"
              maxLength={12}
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder="ENTER TAG"
              className="flex-1 bg-[#0B0D18] border-2 border-[#2E3150] focus:border-[#F6B73C] focus:outline-none px-3 py-2 font-jersey text-xl text-[#F3EBD8] uppercase tracking-wider placeholder-[#63657A] transition-colors"
              style={{
                clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
              }}
            />
            
            <CasinoButton
              type="submit"
              variant="gold"
              size="sm"
              disabled={!isNameChanged}
              soundType="click"
            >
              SAVE GAMER TAG
            </CasinoButton>
          </div>
        </form>

        {/* Avatar Picker */}
        <ProfileAvatarPicker
          selectedAvatarId={profile.avatarId}
          onSelectAvatar={onSelectAvatar}
        />

        {/* Session / Logout Section */}
        <div className="border-t-2 border-[#2E3150] pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-jersey text-lg text-[#F3EBD8] uppercase tracking-wide">
              SESSION
            </span>
            <CasinoBadge variant="danger">ACCOUNT LOGOUT</CasinoBadge>
          </div>

          <p className="font-jersey text-xs text-[#9A9AB5] uppercase leading-tight">
            This clears the current local session and returns to the login screen.
          </p>

          <CasinoButton
            type="button"
            variant="danger"
            size="sm"
            onClick={handleLogoutClick}
            soundType="loss"
            className="w-full sm:w-auto"
          >
            <div className="flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>LOG OUT</span>
            </div>
          </CasinoButton>
        </div>
      </div>
    </CasinoPanel>
  );
};
