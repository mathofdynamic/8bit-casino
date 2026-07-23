import React from 'react';
import { ScratchGamePhase } from './scratchTypes';

interface Transaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  source: string;
  timestamp: number;
}

interface UserProfile {
  chips: number;
}

interface ScratchSessionPanelProps {
  profile: UserProfile;
  cardPrice: number;
  revealedCount: number;
  gamePhase: ScratchGamePhase;
  lastResultText: string | null;
  transactionLog: Transaction[];
}

export const ScratchSessionPanel: React.FC<ScratchSessionPanelProps> = ({
  profile,
  cardPrice,
  revealedCount,
  gamePhase,
  lastResultText,
  transactionLog,
}) => {
  const getStatusLabel = (phase: ScratchGamePhase): string => {
    switch (phase) {
      case 'idle':
        return 'READY';
      case 'active':
        return 'SCRATCHING';
      case 'auto-revealing':
        return 'AUTO REVEALING';
      case 'crediting':
        return 'CREDITING PAYOUT';
      case 'win':
        return 'WIN';
      case 'loss':
        return 'NO MATCH';
      case 'payout-error':
        return 'PAYOUT PENDING';
      default:
        return 'READY';
    }
  };

  const scratchTxList = transactionLog
    .filter((tx) => tx.source === 'scratch_card')
    .slice(0, 5);

  return (
    <div className="space-y-4 font-jersey uppercase">
      {/* Session Summary Panel */}
      <div className="bg-[#15182A] border-2 border-[#2E3150] p-4 filter drop-shadow-[4px_4px_0px_#000000]">
        <h2 className="text-lg text-[#F6B73C] border-b border-[#2E3150] pb-2 mb-3 m-0 tracking-wider">
          SESSION SUMMARY
        </h2>

        <div className="space-y-2 text-sm text-[#9A9AB5]">
          <div className="flex justify-between items-center border-b border-[#2E3150]/50 pb-1.5">
            <span>WALLET</span>
            <span className="text-[#F3EBD8] font-bold">
              {profile.chips.toFixed(2)} COINS
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-[#2E3150]/50 pb-1.5">
            <span>CARD PRICE</span>
            <span className="text-[#F6B73C] font-bold">
              {cardPrice.toFixed(2)} COINS
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-[#2E3150]/50 pb-1.5">
            <span>CELLS REVEALED</span>
            <span className="text-[#54D6D9] font-bold">{revealedCount} / 9</span>
          </div>

          <div className="flex justify-between items-center border-b border-[#2E3150]/50 pb-1.5">
            <span>CARD STATUS</span>
            <span
              className={`font-bold ${
                gamePhase === 'win'
                  ? 'text-[#66D18F]'
                  : gamePhase === 'payout-error'
                  ? 'text-[#E85D68]'
                  : gamePhase === 'active' || gamePhase === 'auto-revealing'
                  ? 'text-[#54D6D9]'
                  : 'text-[#F3EBD8]'
              }`}
            >
              {getStatusLabel(gamePhase)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span>LAST RESULT</span>
            <span className="text-[#F3EBD8] font-bold text-right">
              {lastResultText || '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Scratch Activity */}
      <div className="bg-[#15182A] border-2 border-[#2E3150] p-4 filter drop-shadow-[4px_4px_0px_#000000]">
        <h2 className="text-lg text-[#F6B73C] border-b border-[#2E3150] pb-2 mb-3 m-0 tracking-wider">
          RECENT SCRATCH ACTIVITY
        </h2>

        <div className="space-y-2 text-xs">
          {scratchTxList.length > 0 ? (
            scratchTxList.map((tx) => (
              <div
                key={tx.id}
                className="flex justify-between items-center border-b border-[#2E3150]/30 pb-1.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`px-1.5 py-0.5 border text-[10px] ${
                      tx.type === 'CREDIT'
                        ? 'border-[#66D18F] text-[#66D18F] bg-[#66D18F]/10'
                        : 'border-[#2E3150] text-[#9A9AB5] bg-[#222744]'
                    }`}
                  >
                    {tx.type === 'CREDIT' ? 'WIN' : 'CARD'}
                  </span>
                  <span className="text-[#9A9AB5]">
                    {new Date(tx.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>

                <span
                  className={`font-mono font-bold ${
                    tx.type === 'CREDIT' ? 'text-[#66D18F]' : 'text-[#9A9AB5]'
                  }`}
                >
                  {tx.type === 'CREDIT' ? '+' : '-'}
                  {tx.amount.toFixed(2)} COINS
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-[#9A9AB5] py-3 m-0">
              NO RECENT SCRATCHES RECORDED
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
