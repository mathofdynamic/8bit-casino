import { PlayerState, Card } from '../../lib/pokerEngine';
import { PokerTable } from '../poker-v2/pokerTypes';

export interface PokerGameState {
  table: PokerTable | null;
  players: PlayerState[];
  communityCards: Card[];
  dealerIndex: number;
  currentPlayerIndex: number;
  pot: number;
  currentBet: number;
  gameStage: 'WAITING_FOR_DEAL' | 'PRE_FLOP' | 'FLOP' | 'TURN' | 'RIVER' | 'SHOWDOWN';
  currentHandNum: number;
  turnTimer: number;
  botChatter: string | null;
  sessionLogs: string[];
  winners: { name: string; prize: number; handName: string; cards: Card[] }[];
}

export interface PokerGameUiState {
  isRebuyOpen: boolean;
  rebuyAmount: number;
  isRebuyPending: boolean;
  isExitConfirmOpen: boolean;
  isExitPending: boolean;
  isHandLogOpen: boolean;
}

export interface PokerGameActions {
  onPlayerAction: (act: 'FOLD' | 'CHECK' | 'CALL' | 'RAISE', amt?: number) => void;
  onRaiseChange: (amt: number) => void;
  onOpenRebuy: () => void;
  onCloseRebuy: () => void;
  onRebuyAmountChange: (val: number) => void;
  onConfirmRebuy: () => Promise<void> | void;
  onRequestExit: () => void;
  onCancelExit: () => void;
  onConfirmExit: () => Promise<void> | void;
  onNextHand: () => void;
  onToggleHandLog: () => void;
}
