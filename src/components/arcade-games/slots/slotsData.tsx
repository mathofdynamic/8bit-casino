/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SlotSymbolKey, SlotSymbol } from './slotsTypes';

export const PixelCherryIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12 md:w-16 md:h-16" }) => (
  <svg className={className} viewBox="0 0 16 16" shapeRendering="crispEdges">
    <rect x="7" y="1" width="2" height="1" fill="#66D18F" />
    <rect x="8" y="2" width="1" height="3" fill="#66D18F" />
    <rect x="5" y="4" width="3" height="1" fill="#66D18F" />
    <rect x="4" y="5" width="2" height="1" fill="#66D18F" />
    <rect x="9" y="5" width="2" height="1" fill="#66D18F" />
    <rect x="2" y="7" width="4" height="4" fill="#E85D68" />
    <rect x="3" y="6" width="2" height="1" fill="#E85D68" />
    <rect x="3" y="11" width="2" height="1" fill="#E85D68" />
    <rect x="3" y="7" width="1" height="1" fill="#F3EBD8" />
    <rect x="2" y="8" width="1" height="1" fill="#F3EBD8" />
    <rect x="10" y="7" width="4" height="4" fill="#E85D68" />
    <rect x="11" y="6" width="2" height="1" fill="#E85D68" />
    <rect x="11" y="11" width="2" height="1" fill="#E85D68" />
    <rect x="11" y="7" width="1" height="1" fill="#F3EBD8" />
    <rect x="10" y="8" width="1" height="1" fill="#F3EBD8" />
  </svg>
);

export const PixelBellIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12 md:w-16 md:h-16" }) => (
  <svg className={className} viewBox="0 0 16 16" shapeRendering="crispEdges">
    <rect x="7" y="1" width="2" height="2" fill="#222744" />
    <rect x="6" y="3" width="4" height="1" fill="#222744" />
    <rect x="7" y="4" width="2" height="1" fill="#F6B73C" />
    <rect x="6" y="5" width="4" height="1" fill="#F6B73C" />
    <rect x="5" y="6" width="6" height="1" fill="#F6B73C" />
    <rect x="4" y="7" width="8" height="2" fill="#F6B73C" />
    <rect x="3" y="9" width="10" height="2" fill="#F6B73C" />
    <rect x="5" y="5" width="1" height="2" fill="#F3EBD8" />
    <rect x="4" y="7" width="1" height="2" fill="#F3EBD8" />
    <rect x="3" y="9" width="1" height="2" fill="#F3EBD8" />
    <rect x="10" y="5" width="1" height="2" fill="#F29E4C" />
    <rect x="11" y="7" width="1" height="2" fill="#F29E4C" />
    <rect x="12" y="9" width="1" height="2" fill="#F29E4C" />
    <rect x="2" y="11" width="12" height="2" fill="#F3EBD8" />
    <rect x="2" y="13" width="12" height="1" fill="#F29E4C" />
    <rect x="7" y="14" width="2" height="1" fill="#222744" />
  </svg>
);

export const PixelStarIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12 md:w-16 md:h-16" }) => (
  <svg className={className} viewBox="0 0 16 16" shapeRendering="crispEdges">
    <rect x="7" y="1" width="2" height="2" fill="#F6B73C" />
    <rect x="6" y="3" width="4" height="1" fill="#F6B73C" />
    <rect x="5" y="4" width="6" height="1" fill="#F6B73C" />
    <rect x="4" y="5" width="8" height="1" fill="#F6B73C" />
    <rect x="1" y="6" width="14" height="2" fill="#F6B73C" />
    <rect x="2" y="8" width="12" height="1" fill="#F6B73C" />
    <rect x="3" y="9" width="10" height="1" fill="#F6B73C" />
    <rect x="4" y="10" width="8" height="1" fill="#F6B73C" />
    <rect x="3" y="11" width="3" height="1" fill="#F6B73C" />
    <rect x="10" y="11" width="3" height="1" fill="#F6B73C" />
    <rect x="2" y="12" width="3" height="1" fill="#F6B73C" />
    <rect x="11" y="12" width="3" height="1" fill="#F6B73C" />
    <rect x="2" y="13" width="2" height="2" fill="#F6B73C" />
    <rect x="12" y="13" width="2" height="2" fill="#F6B73C" />
    <rect x="7" y="4" width="2" height="6" fill="#F3EBD8" />
    <rect x="4" y="6" width="8" height="2" fill="#F3EBD8" />
  </svg>
);

export const PixelSevenIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12 md:w-16 md:h-16" }) => (
  <svg className={className} viewBox="0 0 16 16" shapeRendering="crispEdges">
    <rect x="2" y="1" width="12" height="3" fill="#F29E4C" />
    <rect x="2" y="1" width="12" height="1" fill="#F3EBD8" />
    <rect x="10" y="4" width="4" height="2" fill="#F29E4C" />
    <rect x="9" y="6" width="4" height="2" fill="#F29E4C" />
    <rect x="8" y="8" width="4" height="2" fill="#F29E4C" />
    <rect x="7" y="10" width="4" height="2" fill="#F29E4C" />
    <rect x="6" y="12" width="4" height="3" fill="#F29E4C" />
    <rect x="11" y="2" width="2" height="3" fill="#F3EBD8" />
    <rect x="10" y="5" width="1" height="2" fill="#F3EBD8" />
    <rect x="9" y="7" width="1" height="2" fill="#F3EBD8" />
    <rect x="8" y="9" width="1" height="2" fill="#F3EBD8" />
    <rect x="7" y="11" width="1" height="2" fill="#F3EBD8" />
  </svg>
);

export const PixelDiamondIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12 md:w-16 md:h-16" }) => (
  <svg className={className} viewBox="0 0 16 16" shapeRendering="crispEdges">
    <rect x="7" y="1" width="2" height="1" fill="#F3EBD8" />
    <rect x="6" y="2" width="4" height="2" fill="#54D6D9" />
    <rect x="4" y="4" width="8" height="2" fill="#54D6D9" />
    <rect x="2" y="6" width="12" height="2" fill="#54D6D9" />
    <rect x="1" y="8" width="14" height="1" fill="#54D6D9" />
    <rect x="2" y="9" width="12" height="1" fill="#54D6D9" />
    <rect x="3" y="10" width="10" height="1" fill="#54D6D9" />
    <rect x="4" y="11" width="8" height="1" fill="#54D6D9" />
    <rect x="5" y="12" width="6" height="1" fill="#54D6D9" />
    <rect x="6" y="13" width="4" height="1" fill="#54D6D9" />
    <rect x="7" y="14" width="2" height="1" fill="#54D6D9" />
    <rect x="7" y="1" width="1" height="1" fill="#F3EBD8" />
    <rect x="6" y="2" width="2" height="1" fill="#F3EBD8" />
    <rect x="4" y="4" width="3" height="1" fill="#F3EBD8" />
    <rect x="2" y="6" width="4" height="1" fill="#F3EBD8" />
    <rect x="1" y="8" width="1" height="1" fill="#F3EBD8" />
    <rect x="11" y="4" width="1" height="2" fill="#222744" />
    <rect x="13" y="6" width="1" height="2" fill="#222744" />
    <rect x="14" y="8" width="1" height="1" fill="#222744" />
    <rect x="11" y="9" width="3" height="1" fill="#222744" />
    <rect x="10" y="10" width="3" height="1" fill="#222744" />
    <rect x="9" y="11" width="3" height="1" fill="#222744" />
    <rect x="8" y="12" width="3" height="1" fill="#222744" />
    <rect x="7" y="13" width="3" height="1" fill="#222744" />
    <rect x="8" y="14" width="1" height="1" fill="#222744" />
  </svg>
);

export const SLOT_SYMBOLS: Record<SlotSymbolKey, SlotSymbol> = {
  CHERRY: { id: 'CHERRY', name: 'CHERRY', color: '#E85D68', multiplier3: 3, multiplier5: 5, icon: PixelCherryIcon },
  BELL: { id: 'BELL', name: 'BELL', color: '#F6B73C', multiplier3: 5, multiplier5: 10, icon: PixelBellIcon },
  STAR: { id: 'STAR', name: 'STAR', color: '#F6B73C', multiplier3: 10, multiplier5: 20, icon: PixelStarIcon },
  SEVEN: { id: 'SEVEN', name: 'SEVEN', color: '#F29E4C', multiplier3: 25, multiplier5: 50, icon: PixelSevenIcon },
  DIAMOND: { id: 'DIAMOND', name: 'DIAMOND', color: '#54D6D9', multiplier3: 50, multiplier5: 100, icon: PixelDiamondIcon },
};

export const SYMBOL_KEYS: SlotSymbolKey[] = ['CHERRY', 'BELL', 'STAR', 'SEVEN', 'DIAMOND'];
