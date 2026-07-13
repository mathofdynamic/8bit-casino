/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { audio } from '../../lib/audio';

export type PokerTabId = 'home' | 'cash' | 'sitgo' | 'tournaments';

interface PokerSectionTabsProps {
  activeTab: PokerTabId | 'favorites' | 'recent';
  onTabChange: (tabId: PokerTabId) => void;
}

export const PokerSectionTabs: React.FC<PokerSectionTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: PokerTabId; label: string }[] = [
    { id: 'home', label: 'POKER HOME' },
    { id: 'cash', label: 'CASH GAMES' },
    { id: 'sitgo', label: 'SIT & GO' },
    { id: 'tournaments', label: 'TOURNAMENTS' },
  ];

  const handleTabClick = (tabId: PokerTabId) => {
    audio.playClick();
    onTabChange(tabId);
  };

  return (
    <div className="flex border-b border-[#2E3150] pb-1.5 gap-2 overflow-x-auto scrollbar-none select-none font-jersey flex-nowrap w-full">
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            aria-pressed={isSelected}
            className={`px-4 py-1.5 text-base md:text-lg uppercase tracking-wider transition-none cursor-pointer shrink-0 whitespace-nowrap ${
              isSelected
                ? 'bg-[#54D6D9] text-black font-bold'
                : 'bg-[#15182A] text-[#9A9AB5] hover:text-[#F3EBD8] hover:bg-[#222744]'
            }`}
            style={{
              clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)'
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
