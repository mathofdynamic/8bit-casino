import React, { useEffect, useState } from 'react';
import { PokerRoomAsset } from '../../lib/pokerRoomAssets';

interface PokerProgressiveBackgroundProps {
  asset: PokerRoomAsset;
}

const loadedHighResUrls = new Set<string>();

export const PokerProgressiveBackground: React.FC<PokerProgressiveBackgroundProps> = ({ asset }) => {
  const [highResLoaded, setHighResLoaded] = useState(() => loadedHighResUrls.has(asset.full3k));

  useEffect(() => {
    let active = true;

    if (loadedHighResUrls.has(asset.full3k)) {
      setHighResLoaded(true);
      return;
    }

    setHighResLoaded(false);

    const nav = navigator as any;
    if (nav.connection && nav.connection.saveData) {
      return;
    }

    if (window.matchMedia && window.matchMedia('(max-width: 767px)').matches) {
      return;
    }

    const img = new Image();
    img.src = asset.full3k;
    img.onload = async () => {
      if (!active) return;
      if ('decode' in img) {
        try {
          await img.decode();
        } catch (e) {
          // ignore
        }
      }
      if (active) {
        loadedHighResUrls.add(asset.full3k);
        setHighResLoaded(true);
      }
    };

    return () => {
      active = false;
    };
  }, [asset.full3k]);

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden" aria-hidden="true">
      <img
        src={asset.low}
        alt=""
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: highResLoaded ? 0 : 1 }}
      />
      {highResLoaded && (
        <img
          src={asset.full3k}
          alt=""
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover animate-fade-in"
        />
      )}
      {/* Background overlays */}
      <div className="absolute inset-0 bg-[#0d0d1a]/60" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#0d0d1a]/80" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0B0D18]/90 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#0B0D18]/90 to-transparent" />
    </div>
  );
};
