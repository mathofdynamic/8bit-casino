import React, { useState, useEffect } from 'react';
import { PokerGameState, PokerGameActions } from './pokerGameTypes';
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
  actions: PokerGameActions;
  walletBalance: number;
  userRaiseAmount: number;
  minRaise: number;
}

export const PokerGameShell: React.FC<PokerGameShellProps> = ({ 
  state, 
  actions, 
  walletBalance,
  userRaiseAmount,
  minRaise
}) => {
  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false);
  const [isRebuyOpen, setIsRebuyOpen] = useState(false);
  const [themeId, setThemeId] = useState<string>('room-1');

  useEffect(() => {
    if (state.table) {
      if (state.table.roomThemeId) {
        setThemeId(state.table.roomThemeId);
      } else if (state.table.theme) {
        setThemeId(getLegacyThemeRoomAsset(state.table.theme));
      }
    }
  }, [state.table]);

  const asset = getPokerRoomAsset(themeId);

  const handleOpenRebuy = () => {
    setIsRebuyOpen(true);
    actions.onOpenRebuy();
  };

  const handleCloseRebuy = () => setIsRebuyOpen(false);

  const decoratedActions: PokerGameActions = {
    ...actions,
    onOpenRebuy: handleOpenRebuy,
    onConfirmRebuy: () => {
      actions.onConfirmRebuy();
      setIsRebuyOpen(false);
    }
  };

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
        onExitTable={actions.onExitTable}
      />

      <main className="flex-1 relative flex flex-col overflow-hidden w-full h-[calc(100dvh-64px)] pb-32 md:pb-24">
        <PokerGameHud 
          state={state} 
          actions={decoratedActions} 
          roomThemeName={asset.label} 
          onOpenThemeDrawer={() => setIsThemeDrawerOpen(true)} 
        />
        
        <div className="flex-1 relative w-full h-full flex flex-col items-center justify-center pointer-events-none">
          <PokerTableArena state={state} />
        </div>

        <PokerSessionLog logs={state.sessionLogs} />
      </main>

      <PokerActionDock 
        state={state} 
        actions={decoratedActions} 
        userRaiseAmount={userRaiseAmount}
        minRaise={minRaise}
      />

      <PokerRoomThemeDrawer 
        isOpen={isThemeDrawerOpen} 
        onClose={() => setIsThemeDrawerOpen(false)} 
        currentThemeId={themeId} 
        onSelectTheme={setThemeId} 
      />

      <PokerGameModals 
        state={state} 
        actions={decoratedActions} 
        isRebuyOpen={isRebuyOpen} 
        onCloseRebuy={handleCloseRebuy}
        walletBalance={walletBalance}
      />
    </div>
  );
};
