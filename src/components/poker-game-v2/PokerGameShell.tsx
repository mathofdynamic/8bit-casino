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
import { getPokerRoomAsset, getLegacyThemeRoomAsset, isValidPokerRoomAssetId } from '../../lib/pokerRoomAssets';

interface PokerGameShellProps {
  state: PokerGameState;
  uiState: PokerGameUiState;
  actions: PokerGameActions;
  walletBalance: number;
  userRaiseAmount: number;
  minRaise: number;
  onOpenSettings?: () => void;
}

const THEME_STORAGE_KEY = '8bit_casino_poker_room_theme';

interface PokerRoomThemePreferences {
  globalThemeId: string;
  perTable: Record<string, string>;
}

export const PokerGameShell: React.FC<PokerGameShellProps> = ({ 
  state, 
  uiState,
  actions, 
  walletBalance,
  userRaiseAmount,
  minRaise,
  onOpenSettings
}) => {
  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false);
  const [themeId, setThemeId] = useState<string>('room-1');

  // Initialize theme from storage or table defaults
  useEffect(() => {
    if (!state.table) return;
    
    const tableKey = state.table.id.startsWith('custom_sitgo_') ? 'custom-sitgo' : state.table.id;
    let selectedTheme = '';

    try {
      const savedRaw = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedRaw) {
        if (savedRaw.startsWith('{')) {
          const prefs = JSON.parse(savedRaw) as PokerRoomThemePreferences;
          if (prefs.perTable && isValidPokerRoomAssetId(prefs.perTable[tableKey])) {
            selectedTheme = prefs.perTable[tableKey];
          } else if (isValidPokerRoomAssetId(prefs.globalThemeId)) {
            selectedTheme = prefs.globalThemeId;
          }
        } else {
          // legacy string storage
          if (isValidPokerRoomAssetId(savedRaw)) {
            selectedTheme = savedRaw;
          }
        }
      }
    } catch (e) {
      // ignore JSON parse error
    }

    if (selectedTheme) {
      setThemeId(selectedTheme);
    } else if (isValidPokerRoomAssetId(state.table.roomThemeId)) {
      setThemeId(state.table.roomThemeId);
    } else if (state.table.theme) {
      setThemeId(getLegacyThemeRoomAsset(state.table.theme));
    }
  }, [state.table]);

  const handleSelectTheme = (id: string) => {
    setThemeId(id);
    
    if (!state.table) return;
    const tableKey = state.table.id.startsWith('custom_sitgo_') ? 'custom-sitgo' : state.table.id;
    
    try {
      const savedRaw = localStorage.getItem(THEME_STORAGE_KEY);
      let prefs: PokerRoomThemePreferences = { globalThemeId: id, perTable: {} };
      if (savedRaw && savedRaw.startsWith('{')) {
        prefs = JSON.parse(savedRaw) as PokerRoomThemePreferences;
      }
      prefs.globalThemeId = id;
      if (!prefs.perTable) prefs.perTable = {};
      prefs.perTable[tableKey] = id;
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      // Ignore
    }
  };

  const asset = getPokerRoomAsset(themeId);

  return (
    <div className="relative isolate w-full h-screen overflow-hidden bg-[#0B0D18] flex flex-col font-jersey selection:bg-[#E85D68] selection:text-white">
      <PokerProgressiveBackground asset={asset} />
      
      <div className="relative z-10 flex-1 flex flex-col h-full pointer-events-none">
        <div className="pointer-events-auto shrink-0">
          <CasinoTopNav
            variant="gameplay"
            navigationLocked
            navigationLockedMessage="STAND & EXIT THE TABLE BEFORE LEAVING THIS MATCH."
            onOpenSettings={onOpenSettings}
          />
        </div>

        <main className="flex-1 relative flex flex-col overflow-hidden w-full pb-32 md:pb-24 pointer-events-auto">
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
    </div>
  );
};
