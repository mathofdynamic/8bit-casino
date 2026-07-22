/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { ProfileV2Page } from './profile-v2/ProfileV2Page';
import { AuthenticatedSectionShell } from './app-shell/AuthenticatedSectionShell';

interface ProfileScreenProps {
  onOpenSettings?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onOpenSettings }) => {
  const {
    profile,
    updateProfileName,
    updateAvatar,
    logout,
    triggerToast,
    transactionLog,
    lifetimeWinnings,
    lifetimeLosses,
  } = useStore();

  const [nameDraft, setNameDraft] = useState<string>(profile.name || '');

  // Keep draft in sync if profile.name changes externally
  useEffect(() => {
    setNameDraft(profile.name || '');
  }, [profile.name]);

  const handleSaveName = () => {
    const trimmed = nameDraft.trim();
    if (!trimmed) {
      triggerToast('ENTER A GAMER TAG.', 'error');
      return;
    }

    const upper = trimmed.toUpperCase();
    updateProfileName(upper);
    setNameDraft(upper);
    triggerToast('GAMER TAG UPDATED.', 'info');
  };

  const handleSelectAvatar = (avatarId: number, avatarName: string) => {
    updateAvatar(avatarId);
    triggerToast(`AVATAR UPDATED TO ${avatarName}.`, 'info');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <AuthenticatedSectionShell
      activeRoute="profile"
      onOpenSettings={onOpenSettings}
    >
      <ProfileV2Page
        profile={profile}
        nameDraft={nameDraft}
        setNameDraft={setNameDraft}
        onSaveName={handleSaveName}
        onSelectAvatar={handleSelectAvatar}
        lifetimeWinnings={lifetimeWinnings}
        lifetimeLosses={lifetimeLosses}
        transactionLog={transactionLog}
        onLogout={handleLogout}
      />
    </AuthenticatedSectionShell>
  );
};
