/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LoginBackdrop } from './LoginBackdrop';
import { LoginTopBar } from './LoginTopBar';
import { LoginBrandPanel } from './LoginBrandPanel';
import { LoginAccessPanel } from './LoginAccessPanel';

interface LoginV2ShellProps {
  audioMuted: boolean;
  onToggleMute: () => void;
  onOpenSettings: () => void;
  nickname: string;
  setNickname: (name: string) => void;
  selectedAvatarId: number;
  onSelectAvatar: (id: number) => void;
  onGoogleSignIn: () => void;
  onGuestSignIn: () => void;
  isGooglePending: boolean;
  isGuestPending: boolean;
}

export const LoginV2Shell: React.FC<LoginV2ShellProps> = ({
  audioMuted,
  onToggleMute,
  onOpenSettings,
  nickname,
  setNickname,
  selectedAvatarId,
  onSelectAvatar,
  onGoogleSignIn,
  onGuestSignIn,
  isGooglePending,
  isGuestPending,
}) => {
  return (
    <div className="relative min-h-screen w-full bg-[#0B0D18] flex flex-col justify-between overflow-x-hidden selection:bg-[#54D6D9] selection:text-black">
      {/* Background Layer */}
      <LoginBackdrop />

      {/* Unauthenticated Top Bar */}
      <LoginTopBar
        audioMuted={audioMuted}
        onToggleMute={onToggleMute}
        onOpenSettings={onOpenSettings}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full max-w-[1200px] mx-auto px-4 py-6 md:py-10 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Brand Panel: Appears second on mobile, first on desktop */}
          <div className="order-2 md:order-1 md:col-span-6 lg:col-span-6 flex flex-col">
            <LoginBrandPanel />
          </div>

          {/* Access Panel: Appears first on mobile, second on desktop */}
          <div className="order-1 md:order-2 md:col-span-6 lg:col-span-6 flex flex-col">
            <LoginAccessPanel
              nickname={nickname}
              setNickname={setNickname}
              selectedAvatarId={selectedAvatarId}
              onSelectAvatar={onSelectAvatar}
              onGoogleSignIn={onGoogleSignIn}
              onGuestSignIn={onGuestSignIn}
              isGooglePending={isGooglePending}
              isGuestPending={isGuestPending}
            />
          </div>

        </div>
      </main>

      {/* Footer copyright and platform indicator */}
      <footer className="relative z-10 w-full py-3 px-4 border-t border-[#2E3150] bg-[#0B0D18]/90 text-center">
        <p className="font-jersey text-xs text-[#63657A] uppercase tracking-wider m-0">
          8BIT CASINO &copy; {new Date().getFullYear()} &bull; PLAY-MONEY SIMULATION ONLY
        </p>
      </footer>
    </div>
  );
};
