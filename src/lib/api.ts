/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Transaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  balanceAfter: number;
  timestamp: number;
  source: string; // e.g., 'ONBOARDING', 'DAILY_BONUS', 'POKER_WIN', 'SLOTS_PLAY'
}

export interface WalletData {
  userId: string;
  walletBalance: number;
  transactionLog: Transaction[];
  lastClaimedAt: number | null;
  lifetimeWinnings: number;
  lifetimeLosses: number;
}

const STORAGE_PREFIX = '8bit_casino_wallet_';

// Helper to get or create a wallet for a user
export const getWalletFromStorage = (userId: string): WalletData => {
  if (!userId) {
    return {
      userId: 'anonymous',
      walletBalance: 0,
      transactionLog: [],
      lastClaimedAt: null,
      lifetimeWinnings: 0,
      lifetimeLosses: 0,
    };
  }

  const key = `${STORAGE_PREFIX}${userId}`;
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      // Backwards compatibility & verification
      if (typeof parsed.walletBalance !== 'number') parsed.walletBalance = 0;
      if (!Array.isArray(parsed.transactionLog)) parsed.transactionLog = [];
      if (!parsed.lifetimeWinnings) parsed.lifetimeWinnings = 0;
      if (!parsed.lifetimeLosses) parsed.lifetimeLosses = 0;
      return parsed as WalletData;
    }
  } catch (e) {
    console.error('Failed to parse wallet from storage:', e);
  }

  // Create new wallet with initial balance of 0 (Phase 1 onboarding will grant $1.00)
  const newWallet: WalletData = {
    userId,
    walletBalance: 0,
    transactionLog: [],
    lastClaimedAt: null,
    lifetimeWinnings: 0,
    lifetimeLosses: 0,
  };
  saveWalletToStorage(userId, newWallet);
  return newWallet;
};

// Helper to save a wallet
export const saveWalletToStorage = (userId: string, data: WalletData) => {
  if (!userId) return;
  const key = `${STORAGE_PREFIX}${userId}`;
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * MOCK BACKEND SERVICE ENDPOINTS
 * Simulates async server endpoints with latency for highly realistic feel.
 */
export const mockBackend = {
  /**
   * getWallet
   * Retrieves the wallet balance, logs, and metadata for a user.
   */
  getWallet: async (userId: string): Promise<WalletData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const wallet = getWalletFromStorage(userId);
        resolve(wallet);
      }, 150); // simulated latency
    });
  },

  /**
   * claimDailyBonus
   * Verifies if a user is eligible for the daily bonus ($1.00) and executes it.
   */
  claimDailyBonus: async (userId: string): Promise<{
    success: boolean;
    walletBalance: number;
    transactionLog: Transaction[];
    lastClaimedAt: number | null;
    message: string;
    chipsEarned: number;
    nextClaimInMs: number;
  }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const wallet = getWalletFromStorage(userId);
        const now = Date.now();
        const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

        if (wallet.lastClaimedAt) {
          const diff = now - wallet.lastClaimedAt;
          if (diff < MILLISECONDS_IN_A_DAY) {
            resolve({
              success: false,
              walletBalance: wallet.walletBalance,
              transactionLog: wallet.transactionLog,
              lastClaimedAt: wallet.lastClaimedAt,
              message: 'STILL COOLING DOWN! TRY AGAIN LATER.',
              chipsEarned: 0,
              nextClaimInMs: MILLISECONDS_IN_A_DAY - diff,
            });
            return;
          }
        }

        // Grant daily $1.00 (represented as 1.00)
        const earned = 1.00;
        const newBalance = Number((wallet.walletBalance + earned).toFixed(2));
        
        const newTransaction: Transaction = {
          id: 'tx_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          type: 'CREDIT',
          amount: earned,
          balanceAfter: newBalance,
          timestamp: now,
          source: 'DAILY_BONUS',
        };

        const updatedWallet: WalletData = {
          ...wallet,
          walletBalance: newBalance,
          lastClaimedAt: now,
          transactionLog: [newTransaction, ...wallet.transactionLog],
        };

        saveWalletToStorage(userId, updatedWallet);

        resolve({
          success: true,
          walletBalance: newBalance,
          transactionLog: updatedWallet.transactionLog,
          lastClaimedAt: now,
          message: 'DAILY REWARD GRANTED! +$1.00 CHIPS',
          chipsEarned: earned,
          nextClaimInMs: MILLISECONDS_IN_A_DAY,
        });
      }, 300);
    });
  },

  /**
   * adjustBalance
   * Adjusts the wallet balance (credits/debits) and registers a transaction entry.
   * Keeps track of lifetime stats.
   */
  adjustBalance: async (
    userId: string,
    amount: number, // positive for credits, negative for debits
    source: string // 'POKER_WIN', 'POKER_BET', 'SLOTS_PLAY', 'SLOTS_WIN', etc.
  ): Promise<{
    success: boolean;
    walletBalance: number;
    transactionLog: Transaction[];
    message: string;
  }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const wallet = getWalletFromStorage(userId);
        const now = Date.now();
        const amountNum = Number(amount);
        
        if (isNaN(amountNum) || amountNum === 0) {
          resolve({
            success: false,
            walletBalance: wallet.walletBalance,
            transactionLog: wallet.transactionLog,
            message: 'INVALID CHIP VALUE SPECIFIED.',
          });
          return;
        }

        const isDebit = amountNum < 0;
        const absoluteAmount = Math.abs(amountNum);

        // For debits, ensure user has sufficient balance
        if (isDebit && wallet.walletBalance < absoluteAmount) {
          resolve({
            success: false,
            walletBalance: wallet.walletBalance,
            transactionLog: wallet.transactionLog,
            message: 'INSUFFICIENT PLAY CHIPS IN YOUR WALLET!',
          });
          return;
        }

        const newBalance = Number((wallet.walletBalance + amountNum).toFixed(2));
        
        const newTransaction: Transaction = {
          id: 'tx_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          type: isDebit ? 'DEBIT' : 'CREDIT',
          amount: absoluteAmount,
          balanceAfter: newBalance,
          timestamp: now,
          source: source.toUpperCase(),
        };

        // Update lifetime stats
        let lifetimeWinnings = wallet.lifetimeWinnings;
        let lifetimeLosses = wallet.lifetimeLosses;

        if (!isDebit) {
          // Onboarding and daily bonus shouldn't skew game winning statistics
          if (source !== 'ONBOARDING' && source !== 'DAILY_BONUS') {
            lifetimeWinnings = Number((lifetimeWinnings + absoluteAmount).toFixed(2));
          }
        } else {
          lifetimeLosses = Number((lifetimeLosses + absoluteAmount).toFixed(2));
        }

        const updatedWallet: WalletData = {
          ...wallet,
          walletBalance: newBalance,
          transactionLog: [newTransaction, ...wallet.transactionLog],
          lifetimeWinnings,
          lifetimeLosses,
        };

        saveWalletToStorage(userId, updatedWallet);

        resolve({
          success: true,
          walletBalance: newBalance,
          transactionLog: updatedWallet.transactionLog,
          message: isDebit 
            ? `DEBITED $${absoluteAmount.toFixed(2)} CHIPS`
            : `CREDITED $${absoluteAmount.toFixed(2)} CHIPS`,
        });
      }, 200);
    });
  },
};
