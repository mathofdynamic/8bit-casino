import React from 'react';

export type ScratchSymbolId =
  | 'GOLD_SEVEN'
  | 'GOLD_BAR'
  | 'DIAMOND'
  | 'BELL'
  | 'CLOVER'
  | 'CHERRY'
  | 'COIN';

export type ScratchOutcome = ScratchSymbolId | 'LOSS';

export interface ScratchSymbol {
  id: ScratchSymbolId;
  name: string;
  multiplier: number;
  icon: React.ComponentType;
  color: string;
  probabilityText: string;
  rtpValueText: string;
}

export type ScratchGamePhase =
  | 'idle'
  | 'active'
  | 'auto-revealing'
  | 'crediting'
  | 'win'
  | 'loss'
  | 'payout-error';
