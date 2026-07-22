/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CasinoTopNav } from '../lobby-v2/CasinoTopNav';
import { SectionCasinoSidebar } from './SectionCasinoSidebar';
import { X } from 'lucide-react';
import { audio } from '../../lib/audio';

export interface AuthenticatedSectionShellProps {
  children: React.ReactNode;
  activeRoute: 'profile' | 'minigames';
  onOpenSettings?: () => void;
}

export const AuthenticatedSectionShell: React.FC<AuthenticatedSectionShellProps> = ({
  children,
  activeRoute,
  onOpenSettings,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0D18] text-[#F3EBD8] flex flex-col font-jersey select-none overflow-x-hidden">
      {/* 1. Section top navigation bar */}
      <CasinoTopNav
        variant="section"
        activeRoute={activeRoute}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onOpenSettings={onOpenSettings}
      />

      {/* 2. Main content container split into Sidebar and Children */}
      <div className="flex-1 flex min-w-0 w-full overflow-hidden relative">
        {/* Desktop Sidebar Left (w-[216px]) */}
        <div className="hidden md:block">
          <SectionCasinoSidebar
            activeRoute={activeRoute}
            onOpenSettings={onOpenSettings}
            variant="desktop"
          />
        </div>

        {/* Scrollable central content panel */}
        <main className="flex-1 min-w-0 w-full max-w-full overflow-y-auto overflow-x-hidden p-4 md:p-6 space-y-6 relative">
          {children}
        </main>
      </div>

      {/* 3. Mobile drawer navigation menu (hidden on desktop) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop Dimmer */}
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer container panel */}
          <div className="relative flex flex-col w-[240px] h-full bg-[#15182A] border-r-2 border-[#2E3150] p-4 z-10 animate-fade-in">
            <div className="flex justify-between items-center mb-4 border-b border-[#2E3150] pb-2">
              <span className="font-jersey text-xl text-[#F6B73C] tracking-widest uppercase">NAV DECK</span>
              <button
                onClick={() => {
                  audio.playClick();
                  setIsMobileMenuOpen(false);
                }}
                className="text-[#9A9AB5] hover:text-[#F3EBD8] cursor-pointer p-1 border-none bg-transparent"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Render section sidebar inside mobile drawer */}
            <div className="flex-1 overflow-y-auto">
              <SectionCasinoSidebar
                activeRoute={activeRoute}
                onOpenSettings={onOpenSettings}
                onNavigate={() => setIsMobileMenuOpen(false)}
                variant="drawer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
