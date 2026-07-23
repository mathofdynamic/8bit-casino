/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PachinkoGameScreen } from './arcade-games/pachinko/PachinkoGameScreen';

export const PachinkoScreen: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  return <PachinkoGameScreen onBack={onBack} />;
};
