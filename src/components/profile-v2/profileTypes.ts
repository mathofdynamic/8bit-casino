/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile } from '../../store';
import { Transaction } from '../../lib/api';

export interface ProfileV2PageProps {
  profile: UserProfile;
  nameDraft: string;
  setNameDraft: (val: string) => void;
  onSaveName: () => void;
  onSelectAvatar: (avatarId: number, avatarName: string) => void;
  lifetimeWinnings: number;
  lifetimeLosses: number;
  transactionLog: Transaction[];
  onLogout: () => void;
}

export interface ProfilePageHeaderProps {
  googleEmail?: string;
}

export interface ProfileIdentityCardProps {
  profile: UserProfile;
  nameDraft: string;
  setNameDraft: (val: string) => void;
  onSaveName: () => void;
  onSelectAvatar: (avatarId: number, avatarName: string) => void;
  onLogout: () => void;
}

export interface ProfileAvatarPickerProps {
  selectedAvatarId: number;
  onSelectAvatar: (avatarId: number, avatarName: string) => void;
}

export interface ProfileStatsGridProps {
  chips: number;
  lifetimeWinnings: number;
  lifetimeLosses: number;
  dailyStreak: number;
  googleEmail?: string;
  profileId: string;
}

export interface ProfileTransactionTableProps {
  transactionLog: Transaction[];
}
