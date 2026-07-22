/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { audio } from '../lib/audio';
import { WheelScreen } from './WheelScreen';
import { DiceScreen } from './DiceScreen';
import { ScratchScreen } from './ScratchScreen';
import { PachinkoScreen } from './PachinkoScreen';
import { LuckyDrawScreen } from './LuckyDrawScreen';
import { AuthenticatedSectionShell } from './app-shell/AuthenticatedSectionShell';
import { ArcadeHubPage } from './arcade-v2/ArcadeHubPage';
import { ArcadeGameId } from './arcade-v2/arcadeTypes';
import { SlotsGameScreen } from './arcade-games/slots/SlotsGameScreen';

export interface MinigamesScreenProps {
  onOpenSettings?: () => void;
}

export const MinigamesScreen: React.FC<MinigamesScreenProps> = ({ onOpenSettings }) => {
  const [activeCabinet, setActiveCabinet] = useState<'select' | ArcadeGameId>('select');

  const selectCabinet = (cabinet: ArcadeGameId) => {
    audio.playClick();
    setActiveCabinet(cabinet);
  };

  const renderActiveGame = () => {
    switch (activeCabinet) {
      case 'slots':
        return <SlotsGameScreen onBack={() => setActiveCabinet('select')} />;
      case 'wheel':
        return <WheelScreen onBack={() => setActiveCabinet('select')} />;
      case 'dice':
        return <DiceScreen onBack={() => setActiveCabinet('select')} />;
      case 'scratch':
        return <ScratchScreen onBack={() => setActiveCabinet('select')} />;
      case 'pachinko':
        return <PachinkoScreen onBack={() => setActiveCabinet('select')} />;
      case 'luckydraw':
        return <LuckyDrawScreen onBack={() => setActiveCabinet('select')} />;
      default:
        return null;
    }
  };

  return (
    <AuthenticatedSectionShell
      activeRoute="minigames"
      onOpenSettings={onOpenSettings}
    >
      {activeCabinet === 'select' ? (
        <ArcadeHubPage onSelectGame={selectCabinet} />
      ) : (
        renderActiveGame()
      )}
    </AuthenticatedSectionShell>
  );
};
