import React from 'react';
import { WheelGameScreen } from './arcade-games/wheel/WheelGameScreen';

export const WheelScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  return <WheelGameScreen onBack={onBack} />;
};
