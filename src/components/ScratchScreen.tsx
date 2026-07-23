import React from 'react';
import { ScratchGameScreen } from './arcade-games/scratch/ScratchGameScreen';

export const ScratchScreen: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  return <ScratchGameScreen onBack={onBack} />;
};
