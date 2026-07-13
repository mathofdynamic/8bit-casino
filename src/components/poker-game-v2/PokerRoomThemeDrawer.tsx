import React from 'react';
import { POKER_ROOM_ASSETS } from '../../lib/pokerRoomAssets';
import { PixelButton } from '../PixelUI';
import { X } from 'lucide-react';
import { audio } from '../../lib/audio';

interface PokerRoomThemeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: string;
  onSelectTheme: (id: string) => void;
}

export const PokerRoomThemeDrawer: React.FC<PokerRoomThemeDrawerProps> = ({ isOpen, onClose, currentThemeId, onSelectTheme }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="w-full md:w-96 bg-[#0B0D18] h-full border-l-2 border-[#2E3150] shadow-[-10px_0_20px_rgba(0,0,0,0.8)] flex flex-col animate-in slide-in-from-right duration-200">
        <div className="bg-[#15182A] border-b-2 border-[#2E3150] p-4 flex items-center justify-between shrink-0">
          <h2 className="font-jersey text-xl text-[#F3EBD8] uppercase m-0">ROOM THEMES</h2>
          <button onClick={() => { audio.playClick(); onClose(); }} className="text-[#9A9AB5] hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {Object.entries(POKER_ROOM_ASSETS).map(([id, asset]) => {
            const isSelected = id === currentThemeId;
            return (
              <button
                key={id}
                onClick={() => {
                  audio.playClick();
                  onSelectTheme(id);
                }}
                className={`group relative text-left bg-[#15182A] border-2 transition-all p-2 ${
                  isSelected ? 'border-[#54D6D9] shadow-[0_0_10px_rgba(84,214,217,0.3)]' : 'border-[#2E3150] hover:border-[#44476B]'
                }`}
                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
              >
                <div className="aspect-[4/3] bg-[#0d0d1a] overflow-hidden mb-2 relative" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
                  <img src={asset.thumb} alt={asset.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-[#54D6D9] text-[#0B0D18] font-jersey text-xs px-2 py-0.5">
                      ACTIVE
                    </div>
                  )}
                </div>
                <div className="font-jersey text-lg text-[#F3EBD8] uppercase leading-tight mb-1">{asset.label}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
