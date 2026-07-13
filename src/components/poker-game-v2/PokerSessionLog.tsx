import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { audio } from '../../lib/audio';

interface PokerSessionLogProps {
  logs: string[];
  isOpen: boolean;
  onClose: () => void;
}

export const PokerSessionLog: React.FC<PokerSessionLogProps> = ({ logs, isOpen, onClose }) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getLogColor = (log: string) => {
    const lower = log.toLowerCase();
    if (lower.includes('you won') || lower.includes('won')) return 'text-[#66D18F]';
    if (lower.includes('error') || lower.includes('insufficient')) return 'text-[#E85D68]';
    if (lower.startsWith('you')) return 'text-[#54D6D9]';
    if (lower.includes('raise')) return 'text-[#F6B73C]';
    return 'text-[#9A9AB5]';
  };

  return (
    <div 
      className="absolute inset-0 z-50 flex flex-col md:flex-row justify-end pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hand-log-title"
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div className="w-full h-[50vh] mt-auto md:mt-0 md:h-full md:w-80 bg-[#0B0D18] border-t-2 md:border-t-0 md:border-l-2 border-[#2E3150] shadow-[-10px_0_20px_rgba(0,0,0,0.8)] flex flex-col animate-in slide-in-from-bottom md:slide-in-from-right duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#15182A] border-b-2 border-[#2E3150] p-4 flex items-center justify-between shrink-0">
          <h2 id="hand-log-title" className="font-jersey text-xl text-[#F3EBD8] uppercase m-0">HAND LOG</h2>
          <button 
            onClick={() => { audio.playClick(); onClose(); }} 
            className="text-[#9A9AB5] hover:text-white transition-colors"
            aria-label="Close hand log"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-[#2E3150] scrollbar-track-transparent">
          {logs.map((log, idx) => (
            <div key={idx} className={`font-jersey text-sm md:text-base leading-tight ${getLogColor(log)}`}>
              {log}
            </div>
          ))}
          {logs.length === 0 && (
            <div className="font-jersey text-[#63657A] text-center mt-4">NO ACTIVITY YET</div>
          )}
        </div>
      </div>
    </div>
  );
};
