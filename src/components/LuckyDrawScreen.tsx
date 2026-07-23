/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LuckyDrawGameScreen } from './arcade-games/lucky-draw/LuckyDrawGameScreen';

export const LuckyDrawScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return <LuckyDrawGameScreen onBack={onBack} />;
};
