/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ArcadeGameId =
  | 'slots'
  | 'wheel'
  | 'dice'
  | 'scratch'
  | 'pachinko'
  | 'luckydraw';

export interface ArcadeGameData {
  id: ArcadeGameId;
  title: string;
  shortTitle: string;
  description: string;
  category: string;
  maximumPayoutLabel: string;
  accent: 'gold' | 'cyan' | 'magenta' | 'success' | 'warning';
  featured?: boolean;
}
