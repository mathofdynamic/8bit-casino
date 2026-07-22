import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../../store';
import { audio } from '../../../lib/audio';
import { WHEEL_SLICES } from './wheelData';
import { WheelResultState } from './wheelTypes';
import { WheelGameHeader } from './WheelGameHeader';
import { MultiplierWheel } from './MultiplierWheel';
import { WheelBetControls } from './WheelBetControls';
import { WheelSessionPanel } from './WheelSessionPanel';
import { WheelOutcomeDialog } from './WheelOutcomeDialog';

interface WheelGameScreenProps {
  onBack?: () => void;
}

export const WheelGameScreen: React.FC<WheelGameScreenProps> = ({ onBack }) => {
  const {
    profile,
    setRoute,
    adjustBalance,
    triggerToast,
    transactionLog,
    reduceFlashing,
  } = useStore();

  const [betAmount, setBetAmount] = useState<number>(10);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [lastMultiplier, setLastMultiplier] = useState<number | null>(null);
  const [resultState, setResultState] = useState<WheelResultState>('ready');
  const [isOutcomeDialogOpen, setIsOutcomeDialogOpen] = useState<boolean>(false);

  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
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

  const handleSpin = async () => {
    if (isSpinning) return;

    if (profile.chips < betAmount) {
      triggerToast('NOT ENOUGH COINS FOR THIS BET.', 'error');
      return;
    }

    setResultState('spinning');
    setLastWin(null);
    setLastMultiplier(null);
    setIsSpinning(true);

    const deductSuccess = await adjustBalance(-betAmount, 'wheel_of_fortune');
    if (!deductSuccess) {
      setIsSpinning(false);
      setResultState('ready');
      return;
    }

    audio.playClick();

    const roll = Math.random();
    let winningMultiplier = 0;

    if (roll < 0.02) {
      winningMultiplier = 10;
    } else if (roll < 0.07) {
      winningMultiplier = 5;
    } else if (roll < 0.19) {
      winningMultiplier = 2;
    } else if (roll < 0.37) {
      winningMultiplier = 1;
    } else if (roll < 0.47) {
      winningMultiplier = 0.5;
    } else {
      winningMultiplier = 0;
    }

    const matchingSlices = WHEEL_SLICES.filter(
      (s) => s.multiplier === winningMultiplier
    );
    const chosenSlice =
      matchingSlices[Math.floor(Math.random() * matchingSlices.length)];
    const targetSliceIndex = chosenSlice.index;

    const sliceAngle = targetSliceIndex * 22.5;
    const randomOffset = Math.random() * 12 - 6;
    const baseTargetAngle = 360 - sliceAngle + randomOffset;

    const totalSpins = 6;
    const targetAngle = totalSpins * 360 + baseTargetAngle;

    const startAngle = currentAngle % 360;
    const totalSteps = 36;
    const stepDurationMs = 80;

    let currentStep = 0;
    let prevAngle = startAngle;

    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
    }

    spinIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current) {
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
        return;
      }

      currentStep++;
      const t = currentStep / totalSteps;
      const progress = 1 - Math.pow(1 - t, 2.8);
      const rawAngle = startAngle + (targetAngle - startAngle) * progress;
      const snappedAngle = Math.round(rawAngle / 4.5) * 4.5;

      setCurrentAngle(snappedAngle);

      const prevPegCount = Math.floor((prevAngle + 11.25) / 22.5);
      const currPegCount = Math.floor((snappedAngle + 11.25) / 22.5);
      if (currPegCount > prevPegCount) {
        audio.playClick();
      }

      prevAngle = snappedAngle;

      if (currentStep >= totalSteps) {
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;

        if (!isMountedRef.current) return;

        setCurrentAngle(targetAngle);
        setIsSpinning(false);
        setLastMultiplier(winningMultiplier);

        if (winningMultiplier > 0) {
          const payoutAmount = Number(
            (betAmount * winningMultiplier).toFixed(2)
          );
          adjustBalance(payoutAmount, 'wheel_of_fortune');
          setLastWin(payoutAmount);

          if (winningMultiplier >= 5) {
            setResultState('major-win');
            audio.playJackpot();
            triggerToast(
              `MAJOR WIN! ${winningMultiplier}× — +${payoutAmount.toFixed(2)} COINS`,
              'success'
            );
          } else {
            setResultState('win');
            audio.playWin();
            triggerToast(
              `WIN! ${winningMultiplier}× — +${payoutAmount.toFixed(2)} COINS`,
              'success'
            );
          }
        } else {
          setResultState('loss');
          setLastWin(0);
          audio.playLoss();
          triggerToast('LANDED 0×. TRY AGAIN.', 'info');
        }
      }
    }, stepDurationMs);
  };

  return (
    <div className="min-h-screen bg-[#0B0D18] text-[#F3EBD8] p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <WheelGameHeader onBack={handleBack} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Wheel and Bet Controls */}
        <div className="lg:col-span-8 space-y-6 flex flex-col items-center w-full">
          <MultiplierWheel
            currentAngle={currentAngle}
            isSpinning={isSpinning}
            lastMultiplier={lastMultiplier}
            lastWin={lastWin}
            resultState={resultState}
            reduceFlashing={reduceFlashing}
          />

          <div className="w-full">
            <WheelBetControls
              betAmount={betAmount}
              isSpinning={isSpinning}
              onBetChange={setBetAmount}
              onSpin={handleSpin}
              onOpenOutcomes={() => setIsOutcomeDialogOpen(true)}
            />
          </div>
        </div>

        {/* Right Column: Session Panel */}
        <div className="lg:col-span-4 w-full">
          <WheelSessionPanel
            profile={profile}
            betAmount={betAmount}
            lastMultiplier={lastMultiplier}
            lastWin={lastWin}
            resultState={resultState}
            transactionLog={transactionLog}
          />
        </div>
      </div>

      <WheelOutcomeDialog
        isOpen={isOutcomeDialogOpen}
        onClose={() => setIsOutcomeDialogOpen(false)}
      />
    </div>
  );
};
