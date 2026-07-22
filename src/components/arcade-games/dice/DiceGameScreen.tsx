import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../../store';
import { audio } from '../../../lib/audio';
import { DicePrediction, DiceGamePhase } from './diceTypes';
import { getDynamicMultiplier } from './diceData';
import { DiceGameHeader } from './DiceGameHeader';
import { DiceTable } from './DiceTable';
import { DicePredictionControls } from './DicePredictionControls';
import { DiceBetControls } from './DiceBetControls';
import { DiceSessionPanel } from './DiceSessionPanel';
import { DiceRulesDialog } from './DiceRulesDialog';

interface DiceGameScreenProps {
  onBack?: () => void;
}

export const DiceGameScreen: React.FC<DiceGameScreenProps> = ({ onBack }) => {
  const {
    profile,
    setRoute,
    adjustBalance,
    triggerToast,
    transactionLog,
    reduceFlashing,
  } = useStore();

  const [betAmount, setBetAmount] = useState<number>(10);
  const [currentSum, setCurrentSum] = useState<number>(7);
  const [die1, setDie1] = useState<number>(3);
  const [die2, setDie2] = useState<number>(4);

  const [prediction, setPrediction] = useState<DicePrediction>('higher');
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [gamePhase, setGamePhase] = useState<DiceGamePhase>('betting');
  const [lastResultText, setLastResultText] = useState<string | null>(null);

  const [chainId, setChainId] = useState<number>(0);
  const [initialChainBet, setInitialChainBet] = useState<number>(0);
  const [pendingWinnings, setPendingWinnings] = useState<number>(0);

  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);

  const actionLockRef = useRef<boolean>(false);
  const rollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      actionLockRef.current = false;
      if (rollIntervalRef.current) {
        clearInterval(rollIntervalRef.current);
      }
    };
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setRoute('lobby');
    }
  };

  const handleRoll = async () => {
    if (actionLockRef.current || isRolling) return;
    actionLockRef.current = true;

    const currentBet = chainId > 0 ? pendingWinnings : betAmount;

    if (chainId === 0 && profile.chips < currentBet) {
      actionLockRef.current = false;
      triggerToast('NOT ENOUGH COINS FOR THIS BET.', 'error');
      return;
    }

    setIsRolling(true);
    setGamePhase('rolling');
    setLastResultText(null);

    if (chainId === 0) {
      setInitialChainBet(currentBet);
      const deductSuccess = await adjustBalance(-currentBet, 'highlow_dice');
      if (!deductSuccess) {
        actionLockRef.current = false;
        setIsRolling(false);
        setGamePhase('betting');
        return;
      }
    }

    const totalRollFrames = 15;
    const frameIntervalMs = 80;
    let currentFrame = 0;

    if (rollIntervalRef.current) {
      clearInterval(rollIntervalRef.current);
    }

    rollIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current) {
        if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
        return;
      }

      setDie1(Math.floor(Math.random() * 6) + 1);
      setDie2(Math.floor(Math.random() * 6) + 1);
      audio.playClick();
      currentFrame++;

      if (currentFrame >= totalRollFrames) {
        if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
        rollIntervalRef.current = null;
        resolveRoll(currentBet);
      }
    }, frameIntervalMs);
  };

  const resolveRoll = async (activeBet: number) => {
    if (!isMountedRef.current) {
      actionLockRef.current = false;
      return;
    }

    const nextDie1 = Math.floor(Math.random() * 6) + 1;
    const nextDie2 = Math.floor(Math.random() * 6) + 1;
    const newSum = nextDie1 + nextDie2;

    setDie1(nextDie1);
    setDie2(nextDie2);

    const mult = getDynamicMultiplier(currentSum, prediction);

    let correct = false;
    if (prediction === 'higher' && newSum > currentSum) correct = true;
    if (prediction === 'lower' && newSum < currentSum) correct = true;
    if (prediction === 'equal' && newSum === currentSum) correct = true;

    const payout = correct ? Number((activeBet * mult).toFixed(2)) : 0;

    if (correct) {
      const nextChainStep = chainId + 1;
      const isMaxChain = nextChainStep >= 5;

      if (isMaxChain) {
        const payoutSuccess = await adjustBalance(payout, 'highlow_dice');
        if (payoutSuccess) {
          audio.playJackpot();
          setGamePhase('banked');
          setLastResultText(`MAX CHAIN WINNER! +${payout.toFixed(2)} COINS`);
          triggerToast(
            `MAX CHAIN COMPLETED! PAID +${payout.toFixed(2)} COINS`,
            'success'
          );

          setChainId(0);
          setPendingWinnings(0);
          setInitialChainBet(0);
        } else {
          triggerToast(
            'PAYOUT COULD NOT BE CREDITED. USE BANK TO RETRY.',
            'error'
          );
          setChainId(5);
          setPendingWinnings(payout);
          setGamePhase('round-won');
          setLastResultText(
            `MAX CHAIN COMPLETE — BANK ${payout.toFixed(2)} COINS`
          );
        }
      } else {
        audio.playWin();
        setChainId(nextChainStep);
        setPendingWinnings(payout);
        setGamePhase('round-won');
        setLastResultText(`CORRECT! PENDING: +${payout.toFixed(2)} COINS`);
        triggerToast(
          `CORRECT! STEP ${nextChainStep} REACHED (+${payout.toFixed(2)} COINS)`,
          'success'
        );
      }
    } else {
      audio.playLoss();
      setGamePhase('round-lost');
      setLastResultText(`INCORRECT ROLL (${newSum})`);
      triggerToast('PREDICTION MISSED. ROUND ENDED.', 'info');

      setChainId(0);
      setPendingWinnings(0);
      setInitialChainBet(0);
    }

    setCurrentSum(newSum);
    setIsRolling(false);
    actionLockRef.current = false;
  };

  const handleBank = async () => {
    if (
      actionLockRef.current ||
      isRolling ||
      chainId === 0 ||
      pendingWinnings <= 0
    ) {
      return;
    }
    actionLockRef.current = true;

    const payoutSuccess = await adjustBalance(pendingWinnings, 'highlow_dice');
    if (payoutSuccess) {
      audio.playWin();
      triggerToast(`BANKED +${pendingWinnings.toFixed(2)} COINS!`, 'success');
      setLastResultText(`BANKED +${pendingWinnings.toFixed(2)} COINS`);
      setGamePhase('banked');
      setChainId(0);
      setPendingWinnings(0);
      setInitialChainBet(0);
    } else {
      triggerToast('PAYOUT COULD NOT BE CREDITED. TRY AGAIN.', 'error');
    }
    actionLockRef.current = false;
  };

  const handleResetBaseline = () => {
    if (actionLockRef.current || isRolling || chainId > 0) return;
    audio.playClick();
    setCurrentSum(7);
    setDie1(3);
    setDie2(4);
    setLastResultText(null);
    setGamePhase('betting');
  };

  return (
    <div className="min-h-screen bg-[#0B0D18] text-[#F3EBD8] p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <DiceGameHeader onBack={handleBack} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Table and Controls */}
        <div className="lg:col-span-8 space-y-6 flex flex-col items-center w-full">
          <DiceTable
            die1={die1}
            die2={die2}
            currentSum={currentSum}
            gamePhase={gamePhase}
            isRolling={isRolling}
            chainId={chainId}
            pendingWinnings={pendingWinnings}
            reduceFlashing={reduceFlashing}
          />

          <DicePredictionControls
            currentSum={currentSum}
            selectedPrediction={prediction}
            isRolling={isRolling}
            disabled={isRolling}
            onSelectPrediction={setPrediction}
          />

          <DiceBetControls
            betAmount={betAmount}
            isRolling={isRolling}
            chainId={chainId}
            pendingWinnings={pendingWinnings}
            onBetChange={setBetAmount}
            onRoll={handleRoll}
            onBank={handleBank}
            onResetBaseline={handleResetBaseline}
            onOpenRules={() => setIsRulesOpen(true)}
          />
        </div>

        {/* Right Column: Session Panel */}
        <div className="lg:col-span-4 w-full">
          <DiceSessionPanel
            profile={profile}
            betAmount={betAmount}
            currentSum={currentSum}
            prediction={prediction}
            chainId={chainId}
            pendingWinnings={pendingWinnings}
            gamePhase={gamePhase}
            lastResultText={lastResultText}
            transactionLog={transactionLog}
          />
        </div>
      </div>

      <DiceRulesDialog
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
};
