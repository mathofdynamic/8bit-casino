import React, { useEffect, useRef } from 'react';

interface PokerSessionLogProps {
  logs: string[];
}

export const PokerSessionLog: React.FC<PokerSessionLogProps> = ({ logs }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [logs]);

  return (
    <div className="absolute bottom-20 md:bottom-[72px] right-2 md:right-4 w-64 md:w-80 h-32 md:h-48 bg-[#0B0D18]/80 border-2 border-[#2E3150] flex flex-col z-10" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
      <div className="bg-[#15182A] border-b-2 border-[#2E3150] px-2 py-1">
        <span className="font-jersey text-[10px] text-[#9A9AB5] uppercase tracking-wider">SESSION LOG</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[#2E3150] scrollbar-track-transparent">
        {logs.map((log, idx) => (
          <div key={idx} className="font-jersey text-[10px] md:text-xs text-[#9A9AB5] uppercase leading-tight mb-1">
            {log.replace(/\$/g, '').replace(' WON POT', ' WON').replace(' COINS', '')}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};
