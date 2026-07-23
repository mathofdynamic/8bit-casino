/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PachinkoSlot {
  index: number;
  multiplier: number;
  name: string;
  color: string;
}

export interface PachinkoPeg {
  x: number;
  y: number;
}

export interface PachinkoBall {
  id: number;
  bet: number;
  currentStep: number;
  column: number;
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  animationProgress: number;
}

export interface PachinkoLandingInput {
  ballId: number;
  bet: number;
  slotIndex: number;
}

export type PachinkoSettlementStatus =
  | 'crediting'
  | 'credited'
  | 'failed';

export interface PachinkoLandingResult {
  id: number;
  ballId: number;
  bet: number;
  slotIndex: number;
  multiplier: number;
  payout: number;
  status: PachinkoSettlementStatus;
  timestamp: number;
}
