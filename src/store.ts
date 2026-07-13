/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { audio } from './lib/audio';
import { mockBackend, Transaction } from './lib/api';

export type AppRoute = 'login' | 'lobby' | 'poker' | 'minigames' | 'profile';

export interface UserProfile {
  id: string;
  name: string;
  avatarId: number;
  chips: number;
  isLoggedIn: boolean;
  dailyStreak: number;
  lastClaimedTimestamp: number | null;
  googleId?: string;
  googlePicture?: string;
  googleEmail?: string;
  isFirstLoginDone?: boolean;
}

export interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

interface AppState {
  route: AppRoute;
  profile: UserProfile;
  audioMuted: boolean;
  musicVolume: number;
  sfxVolume: number;
  toast: ToastState;
  
  // Wallet / Mock Backend State
  transactionLog: Transaction[];
  lastClaimedAt: number | null;
  lifetimeWinnings: number;
  lifetimeLosses: number;
  isLoadingWallet: boolean;
  
  // Navigation
  setRoute: (route: AppRoute) => void;
  
  // Auth/Profile Actions
  login: (
    name: string, 
    avatarId: number, 
    googleProfile?: { id: string; name: string; email: string; picture: string }
  ) => void;
  logout: () => void;
  updateProfileName: (name: string) => void;
  updateAvatar: (avatarId: number) => void;
  
  // Balance Actions
  addChips: (amount: number, reason?: string) => Promise<boolean>;
  subtractChips: (amount: number, reason?: string) => Promise<boolean>;
  adjustBalance: (amount: number, source: string) => Promise<boolean>;
  
  // Daily Bonus Actions
  claimDailyBonus: () => Promise<{ success: boolean; chipsEarned: number }>;
  
  // Syncing
  syncWallet: () => Promise<void>;
  
  // Audio Controls
  toggleMute: () => void;
  setMusicVolume: (vol: number) => void;
  setSfxVolume: (vol: number) => void;
  
  // Accessibility & Photosensitivity
  reduceFlashing: boolean;
  setReduceFlashing: (val: boolean) => void;

  // Achievements & Milestones
  unlockedAchievements: string[];
  achievementPopup: { id: string; title: string; description: string } | null;
  unlockAchievement: (id: string) => void;
  closeAchievementPopup: () => void;

  // Notification Actions
  triggerToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  closeToast: () => void;
  saveToStorage: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: '',
  name: '',
  avatarId: 0,
  chips: 0, // Starting chips are 0 so first-time grant adds exactly $1.00
  isLoggedIn: false,
  dailyStreak: 0,
  lastClaimedTimestamp: null,
};

// Simple load helpers for localStorage
const loadSavedState = () => {
  try {
    const saved = localStorage.getItem('8bit_casino_save');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Sync loaded settings to raw audio module early
      audio.setMute(parsed.audioMuted ?? false);
      audio.setMusicVolume(parsed.musicVolume ?? 0.5);
      audio.setSfxVolume(parsed.sfxVolume ?? 0.6);
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load saved state:', e);
  }
  return null;
};

const savedState = loadSavedState() || {};

// Heal profile.id during initial setup if logged in but missing an ID
if (savedState.profile && savedState.profile.isLoggedIn && !savedState.profile.id) {
  savedState.profile.id = 'local_' + Date.now();
  try {
    localStorage.setItem('8bit_casino_save', JSON.stringify(savedState));
  } catch (e) {}
}

export const useStore = create<AppState>((set, get) => ({
  route: savedState.route || 'login',
  profile: savedState.profile || DEFAULT_PROFILE,
  audioMuted: savedState.audioMuted ?? false,
  musicVolume: savedState.musicVolume ?? 0.5,
  sfxVolume: savedState.sfxVolume ?? 0.6,
  toast: { message: '', type: 'info', visible: false },
  
  // Accessibility & Photosensitivity
  reduceFlashing: savedState.reduceFlashing ?? false,

  // Achievements
  unlockedAchievements: savedState.unlockedAchievements || [],
  achievementPopup: null,

  // Wallet / Mock Backend State
  transactionLog: savedState.transactionLog || [],
  lastClaimedAt: savedState.lastClaimedAt || null,
  lifetimeWinnings: savedState.lifetimeWinnings || 0,
  lifetimeLosses: savedState.lifetimeLosses || 0,
  isLoadingWallet: false,

  setRoute: (route) => {
    set({ route });
    audio.playClick();
    get().saveToStorage();
    if (get().profile.isLoggedIn) {
      get().syncWallet();
    }
  },

  login: (name, avatarId, googleProfile) => {
    const trimmed = name.trim().toUpperCase();
    if (!trimmed) {
      get().triggerToast('ENTER A NICKNAME FIRST!', 'error');
      return;
    }
    
    const uId = googleProfile?.id || get().profile.id || 'local_' + Date.now();
    const isFirstLogin = !get().profile.isFirstLoginDone;

    set((state) => ({
      profile: {
        ...state.profile,
        id: uId,
        name: trimmed,
        avatarId,
        isLoggedIn: true,
        isFirstLoginDone: true,
        googleId: googleProfile?.id,
        googlePicture: googleProfile?.picture,
        googleEmail: googleProfile?.email,
      },
      route: 'lobby',
    }));
    
    audio.playCoin();
    get().triggerToast(`WELCOME TO THE CASINO, ${trimmed}!`, 'success');
    get().saveToStorage();
    
    // Auto-start music if not muted
    if (!get().audioMuted) {
      audio.startMusic();
    }

    if (isFirstLogin) {
      // Grant exactly $1.00 (1 chip) onboarding chip through mockBackend!
      mockBackend.adjustBalance(uId, 1.00, 'ONBOARDING').then(() => {
        get().syncWallet();
      });
    } else {
      get().syncWallet();
    }
  },

  logout: () => {
    set(() => ({
      profile: DEFAULT_PROFILE,
      route: 'login',
      transactionLog: [],
      lastClaimedAt: null,
      lifetimeWinnings: 0,
      lifetimeLosses: 0,
    }));
    audio.stopMusic();
    audio.playLoss();
    localStorage.removeItem('8bit_casino_save');
  },

  updateProfileName: (name) => {
    const trimmed = name.trim().toUpperCase();
    if (!trimmed) return;
    set((state) => ({
      profile: { ...state.profile, name: trimmed }
    }));
    get().saveToStorage();
  },

  updateAvatar: (avatarId) => {
    set((state) => ({
      profile: { ...state.profile, avatarId }
    }));
    audio.playClick();
    get().saveToStorage();
  },

  addChips: async (amount, reason = 'GAME_WIN') => {
    return get().adjustBalance(amount, reason);
  },

  subtractChips: async (amount, reason = 'GAME_BET') => {
    return get().adjustBalance(-amount, reason);
  },

  adjustBalance: async (amount, source) => {
    let userId = get().profile.id;
    if (!userId) {
      userId = 'local_' + Date.now();
      set((state) => ({
        profile: { ...state.profile, id: userId }
      }));
      get().saveToStorage();
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum === 0) return false;

    // Optimistically update the local Zustand state for instantaneous visual feedback
    const originalChips = get().profile.chips;
    set((state) => ({
      profile: {
        ...state.profile,
        chips: Number(Math.max(0, state.profile.chips + amountNum).toFixed(2))
      }
    }));

    // Trigger audio cues
    if (amountNum > 0) {
      audio.playCoin();
      // Automatic achievement triggers for wins
      const cleanSrc = source.toUpperCase();
      const isExempt = cleanSrc.includes('ONBOARDING') || 
                       cleanSrc.includes('DAILY') || 
                       cleanSrc.includes('STREAK') || 
                       cleanSrc.includes('REBUY') || 
                       cleanSrc.includes('CASH_OUT');
      if (!isExempt) {
        get().unlockAchievement('first_win');
        if (amountNum >= 5.0 || cleanSrc.includes('JACKPOT') || cleanSrc.includes('MEGA') || cleanSrc.includes('ULTRA')) {
          get().unlockAchievement('jackpot');
        }
      }
    } else {
      audio.playClick();
    }

    try {
      const result = await mockBackend.adjustBalance(userId, amountNum, source);
      if (result.success) {
        set((state) => ({
          profile: { ...state.profile, chips: result.walletBalance },
          transactionLog: result.transactionLog,
        }));
        
        // Sync full stats for accurate leaderboard/displays
        const wallet = await mockBackend.getWallet(userId);
        set({
          lifetimeWinnings: wallet.lifetimeWinnings,
          lifetimeLosses: wallet.lifetimeLosses,
          transactionLog: wallet.transactionLog,
        });
        
        get().saveToStorage();
        return true;
      } else {
        // Rollback the optimistic update on failure
        set((state) => ({
          profile: { ...state.profile, chips: originalChips }
        }));
        get().triggerToast(result.message, 'error');
        return false;
      }
    } catch (e) {
      console.error(e);
      // Rollback
      set((state) => ({
        profile: { ...state.profile, chips: originalChips }
      }));
      return false;
    }
  },

  claimDailyBonus: async () => {
    let userId = get().profile.id;
    if (!userId) {
      userId = 'local_' + Date.now();
      set((state) => ({
        profile: { ...state.profile, id: userId }
      }));
      get().saveToStorage();
    }

    try {
      const result = await mockBackend.claimDailyBonus(userId);
      if (result.success) {
        // Increment streak meter in store
        const nextStreak = get().profile.dailyStreak + 1;
        set((state) => ({
          profile: {
            ...state.profile,
            chips: result.walletBalance,
            dailyStreak: nextStreak,
            lastClaimedTimestamp: result.lastClaimedAt,
          },
          lastClaimedAt: result.lastClaimedAt,
          transactionLog: result.transactionLog,
        }));
        
        // Check for 7-day streak milestone
        if (nextStreak > 0 && nextStreak % 7 === 0) {
          get().unlockAchievement('streak_7');
          // Award $1.00 chips automatically as a streak prize!
          await get().adjustBalance(1.00, 'DAILY_STREAK_7_BONUS');
        }

        // Refresh wallet statistics
        const wallet = await mockBackend.getWallet(userId);
        set({
          lifetimeWinnings: wallet.lifetimeWinnings,
          lifetimeLosses: wallet.lifetimeLosses,
        });

        audio.playWin();
        get().triggerToast(`CLAIMED DAILY BONUS! +${result.chipsEarned.toFixed(2)} COINS!`, 'success');
        get().saveToStorage();
        return { success: true, chipsEarned: result.chipsEarned };
      } else {
        get().triggerToast(result.message, 'error');
        return { success: false, chipsEarned: 0 };
      }
    } catch (e) {
      console.error(e);
      return { success: false, chipsEarned: 0 };
    }
  },

  syncWallet: async () => {
    let userId = get().profile.id;
    if (!userId) {
      userId = 'local_' + Date.now();
      set((state) => ({
        profile: { ...state.profile, id: userId }
      }));
      get().saveToStorage();
    }

    set({ isLoadingWallet: true });
    try {
      const wallet = await mockBackend.getWallet(userId);
      set((state) => ({
        profile: {
          ...state.profile,
          chips: wallet.walletBalance,
          lastClaimedTimestamp: wallet.lastClaimedAt,
        },
        transactionLog: wallet.transactionLog,
        lastClaimedAt: wallet.lastClaimedAt,
        lifetimeWinnings: wallet.lifetimeWinnings,
        lifetimeLosses: wallet.lifetimeLosses,
        isLoadingWallet: false,
      }));
      get().saveToStorage();
    } catch (e) {
      console.error('Wallet synchronization failed:', e);
      set({ isLoadingWallet: false });
    }
  },

  toggleMute: () => {
    const targetMuted = !get().audioMuted;
    set({ audioMuted: targetMuted });
    audio.setMute(targetMuted);
    
    if (targetMuted) {
      audio.stopMusic();
    } else {
      if (get().profile.isLoggedIn) {
        audio.startMusic();
      }
    }
    
    get().saveToStorage();
  },

  setMusicVolume: (vol) => {
    set({ musicVolume: vol });
    audio.setMusicVolume(vol);
    get().saveToStorage();
  },

  setSfxVolume: (vol) => {
    set({ sfxVolume: vol });
    audio.setSfxVolume(vol);
    get().saveToStorage();
  },

  setReduceFlashing: (val) => {
    set({ reduceFlashing: val });
    get().saveToStorage();
  },

  unlockAchievement: (id) => {
    const list = get().unlockedAchievements;
    if (list.includes(id)) return;

    const newList = [...list, id];
    set({ unlockedAchievements: newList });

    // Play special achievement sound
    audio.playWinJackpot();

    // Map ID to readable visual labels
    let title = 'MILESTONE ACHIEVED';
    let description = 'YOU HAVE PROVEN YOUR SECTOR WORTH!';
    if (id === 'first_win') {
      title = 'FIRST WIN!';
      description = 'CONGRATULATIONS ON YOUR FIRST PAYOUT!';
    } else if (id === 'poker_win') {
      title = 'POKER CHAMP!';
      description = 'BESTED THE SALOON IN SHOWN HAND!';
    } else if (id === 'jackpot') {
      title = 'JACKPOT HERO!';
      description = 'HIT A MONSTER MULTIPLIER PAYOUT!';
    } else if (id === 'streak_7') {
      title = '7-DAY STREAK!';
      description = 'CLAIMED 7 DAYS RUNNING! AWARDED +$1.00 BONUS!';
    }

    set({
      achievementPopup: { id, title, description }
    });

    get().saveToStorage();
    get().triggerToast(`ACHIEVEMENT UNLOCKED: ${title}`, 'success');
  },

  closeAchievementPopup: () => {
    set({ achievementPopup: null });
  },

  triggerToast: (message, type = 'info') => {
    set({
      toast: { message, type, visible: true }
    });
  },

  closeToast: () => {
    set((state) => ({
      toast: { ...state.toast, visible: false }
    }));
  },

  saveToStorage: () => {
    const { 
      route, 
      profile, 
      audioMuted, 
      musicVolume, 
      sfxVolume, 
      transactionLog, 
      lastClaimedAt, 
      lifetimeWinnings, 
      lifetimeLosses,
      reduceFlashing,
      unlockedAchievements
    } = get();
    
    localStorage.setItem(
      '8bit_casino_save',
      JSON.stringify({ 
        route, 
        profile, 
        audioMuted, 
        musicVolume, 
        sfxVolume,
        transactionLog,
        lastClaimedAt,
        lifetimeWinnings,
        lifetimeLosses,
        reduceFlashing,
        unlockedAchievements
      })
    );
  }
}));
