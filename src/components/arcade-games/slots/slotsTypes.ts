/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export type SlotSymbolKey =
  | 'CHERRY'
  | 'BELL'
  | 'STAR'
  | 'SEVEN'
  | 'DIAMOND';

export type SlotMode = 3 | 5;

export type LeverState = 'idle' | 'pulling' | 'down';

export interface SlotSymbol {
  id: SlotSymbolKey;
  name: string;
  color: string;
  multiplier3: number;
  multiplier5: number;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SpinResult {
  payoutMultiplier: number;
  winMessage: string;
  isMegaJackpot: boolean;
  payoutAmount: number;
}
