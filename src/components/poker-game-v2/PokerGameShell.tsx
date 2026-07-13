import React, { useState, useEffect } from 'react';
import { PokerGameState, PokerGameActions, PokerGameUiState } from './pokerGameTypes';
import { CasinoTopNav } from '../lobby-v2/CasinoTopNav';
import { PokerProgressiveBackground } from './PokerProgressiveBackground';
import { PokerGameHud } from './PokerGameHud';
import { PokerTableArena } from './PokerTableArena';
import { PokerActionDock } from './PokerActionDock';
import { PokerSessionLog } from './PokerSessionLog';
import { PokerRoomThemeDrawer } from './PokerRoomThemeDrawer';
import { PokerGameModals } from './PokerGameModals';
import { getPokerRoomAsset, getLegacyThemeRoomAsset } from '../../lib/pokerRoomAssets';

interface PokerGameShellProps {
  state: PokerGameState;
  uiState: PokerGameUiState;
  actions: PokerGameActions;
  walletBalance: number;
  userRaiseAmount: number;
  minRaise: number;
}

const THEME_STORAGE_KEY = '8bit_casino_poker_room_theme';

export const PokerGameShell: React.FC<PokerGameShellProps> = ({ 
  state, 
  uiState,
  actions, 
  walletBalance,
  userRaiseAmount,
  minRaise
}) => {
  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false);
  const [themeId, setThemeId] = useState<string>('room-1');

  // Initialize theme from storage or table defaults
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      setThemeId(savedTheme);
    } else if (state.table) {
      if (state.table.roomThemeId) {
        setThemeId(state.table.roomThemeId);
      } else if (state.table.theme) {
        setThemeId(getLegacyThemeRoomAsset(state.table.theme));
      }
    }
  }, [state.table]);

  const handleSelectTheme = (id: string) => {
    setThemeId(id);
    localStorage.setItem(THEME_STORAGE_KEY, id);
  };

  const asset = getPokerRoomAsset(themeId);

  return (
    <div className="w-full h-screen bg-[#0B0D18] flex flex-col font-jersey overflow-hidden selection:bg-[#E85D68] selection:text-white relative">
      <PokerProgressiveBackground asset={asset} />
      
      <CasinoTopNav
        walletBalance={walletBalance}
        activeTab="poker"
        onTabChange={() => {}}
        onLoginClick={() => {}}
        isAuthenticated={true}
        username={state.players[0]?.name || "PLAYER"}
        variant="gameplay"
        onExitTable={actions.onRequestExit}
      />

      <main className="flex-1 relative flex flex-col overflow-hidden w-full h-[calc(100dvh-64px)] pb-32 md:pb-24">
        <PokerGameHud 
          state={state} 
          actions={actions} 
          roomThemeName={asset.label} 
          onOpenThemeDrawer={() => setIsThemeDrawerOpen(true)} 
          onOpenHandLog={actions.onToggleHandLog}
        />
        
        <div className="flex-1 relative w-full h-full flex flex-col items-center justify-center pointer-events-none">
          <PokerTableArena state={state} />
        </div>

        <PokerSessionLog 
          logs={state.sessionLogs} 
          isOpen={uiState.isHandLogOpen} 
          onClose={actions.onToggleHandLog} 
        />
      </main>

      <PokerActionDock 
        state={state} 
        actions={actions} 
        userRaiseAmount={userRaiseAmount}
        minRaise={minRaise}
      />

      <PokerRoomThemeDrawer 
        isOpen={isThemeDrawerOpen} 
        onClose={() => setIsThemeDrawerOpen(false)} 
        currentThemeId={themeId} 
        onSelectTheme={handleSelectTheme} 
      />

      <PokerGameModals 
        state={state} 
        uiState={uiState}
        actions={actions} 
        walletBalance={walletBalance}
      />
    </div>
  );
};
