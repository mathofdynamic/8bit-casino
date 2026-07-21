/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { CasinoPanel, CasinoButton, CasinoBadge } from '../ui-v2';
import { PixelAvatar } from '../../lib/avatars';
import { PendingLoginData } from './loginTypes';
import { Sparkles, Coins } from 'lucide-react';

interface LoginWelcomeDialogProps {
  isOpen: boolean;
  pendingLoginData: PendingLoginData | null;
  isCompleting: boolean;
  onConfirm: () => void;
}

export const LoginWelcomeDialog: React.FC<LoginWelcomeDialogProps> = ({
  isOpen,
  pendingLoginData,
  isCompleting,
  onConfirm,
}) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        confirmBtnRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !pendingLoginData) {
    return null;
  }

  const emailText = pendingLoginData.googleProfile?.email || 'LOCAL GUEST PROFILE';

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 pointer-events-auto selection:bg-[#54D6D9] selection:text-black"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-dialog-title"
    >
      <div className="w-full max-w-md">
        <CasinoPanel
          title="WELCOME BONUS READY"
          subtitle="CLAIM YOUR STARTER BALANCE"
          chamfer={12}
          borderColor="strong"
          headerAccent={<Sparkles className="w-6 h-6 text-[#F6B73C]" />}
        >
          <div className="space-y-4">
            
            {/* Main Starter Value */}
            <div 
              className="bg-[#1D2036] border-2 border-[#2E3150] p-4 text-center" 
              style={{ clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)' }}
            >
              <div id="welcome-dialog-title" className="inline-flex items-center justify-center gap-2 mb-1">
                <Coins className="w-6 h-6 text-[#F6B73C]" />
                <span className="font-jersey text-4xl text-[#F6B73C] uppercase tracking-wider leading-none">
                  1.00 COINS
                </span>
              </div>
              <p className="font-jersey text-sm text-[#9A9AB5] uppercase leading-snug m-0">
                Your starter balance will be added when you enter the casino.
              </p>
            </div>

            {/* Compact Identity Summary */}
            <div 
              className="bg-[#111322] border border-[#2E3150] p-3 flex items-center gap-3" 
              style={{ clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)' }}
            >
              <PixelAvatar
                avatarId={pendingLoginData.avatarId}
                googlePicture={pendingLoginData.googleProfile?.picture}
                size={48}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-jersey text-xl text-[#F3EBD8] uppercase truncate leading-none m-0">
                    {pendingLoginData.name}
                  </h4>
                  <CasinoBadge variant="gold">
                    PLAY-MONEY ONLY
                  </CasinoBadge>
                </div>
                <p className="font-jersey text-xs text-[#9A9AB5] uppercase truncate mt-1 leading-none m-0">
                  {emailText}
                </p>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <CasinoButton
                ref={confirmBtnRef}
                variant="gold"
                size="lg"
                shimmer
                className="w-full"
                soundType="coin"
                disabled={isCompleting}
                onClick={onConfirm}
                aria-label="Enter the casino and claim the welcome bonus"
              >
                {isCompleting ? 'ENTERING...' : 'ENTER CASINO'}
              </CasinoButton>
            </div>

          </div>
        </CasinoPanel>
      </div>
    </div>
  );
};
