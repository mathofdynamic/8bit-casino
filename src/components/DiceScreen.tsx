import React from 'react';
import { DiceGameScreen } from './arcade-games/dice/DiceGameScreen';

export const DiceScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  return <DiceGameScreen onBack={onBack} />;
};
