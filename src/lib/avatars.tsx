/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface AvatarItem {
  id: number;
  name: string;
  color: string;
  description: string;
  svg: React.ReactNode;
}

export const avatars: AvatarItem[] = [
  {
    id: 0,
    name: 'LUCKY LARRY',
    color: '#3fff6e',
    description: 'RETRO GAMBLER IN A COY GREEN VISOR.',
    svg: (
      <svg viewBox="0 0 40 40" className="w-16 h-16">
        <rect x="10" y="10" width="20" height="20" fill="#1e5631" stroke="#3fff6e" strokeWidth="2" />
        {/* Visor */}
        <rect x="8" y="18" width="24" height="4" fill="#3fff6e" />
        {/* Eyes */}
        <rect x="14" y="13" width="3" height="3" fill="#e8e8e8" />
        <rect x="23" y="13" width="3" height="3" fill="#e8e8e8" />
        {/* Cigar */}
        <rect x="25" y="24" width="6" height="2" fill="#ff9f00" />
        <rect x="31" y="24" width="2" height="2" fill="#ff3f3f" />
      </svg>
    )
  },
  {
    id: 1,
    name: 'DEALER DAISY',
    color: '#ff9f00',
    description: 'COOL PIT BOSS WITH GOLD SHADES.',
    svg: (
      <svg viewBox="0 0 40 40" className="w-16 h-16">
        <rect x="10" y="10" width="20" height="20" fill="#252542" stroke="#ff9f00" strokeWidth="2" />
        {/* Neon sunglasses */}
        <rect x="12" y="15" width="16" height="5" fill="#ff9f00" />
        <rect x="14" y="17" width="4" height="2" fill="#3ff7ff" />
        <rect x="22" y="17" width="4" height="2" fill="#3ff7ff" />
        {/* Hair spikes */}
        <rect x="8" y="8" width="6" height="6" fill="#ff9f00" />
        <rect x="26" y="8" width="6" height="6" fill="#ff9f00" />
      </svg>
    )
  },
  {
    id: 2,
    name: 'NEON JOE',
    color: '#3ff7ff',
    description: 'CYBER HACKER AND CARD COUNTING GENIUS.',
    svg: (
      <svg viewBox="0 0 40 40" className="w-16 h-16">
        <rect x="10" y="10" width="20" height="20" fill="#1a1a2e" stroke="#3ff7ff" strokeWidth="2" />
        {/* Cybernetic eyepiece */}
        <rect x="12" y="14" width="6" height="6" fill="#3ff7ff" />
        <rect x="14" y="16" width="2" height="2" fill="#ff3f3f" />
        {/* Other eye */}
        <rect x="22" y="15" width="3" height="3" fill="#e8e8e8" />
        {/* Glowing Mohawk */}
        <rect x="18" y="4" width="4" height="6" fill="#3ff7ff" />
      </svg>
    )
  },
  {
    id: 3,
    name: 'PIXEL PETE',
    color: '#ff9f00',
    description: 'CLASSIC 1980S ARCADE CABINET CHAMPION.',
    svg: (
      <svg viewBox="0 0 40 40" className="w-16 h-16">
        <rect x="10" y="10" width="20" height="20" fill="#7a4b28" stroke="#ff9f00" strokeWidth="2" />
        {/* Red Hat */}
        <rect x="8" y="6" width="24" height="6" fill="#ff3f3f" />
        <rect x="14" y="12" width="16" height="2" fill="#e8e8e8" />
        {/* Mustache */}
        <rect x="14" y="22" width="12" height="4" fill="#0d0d1a" />
        {/* Eyes */}
        <rect x="13" y="15" width="3" height="3" fill="#e8e8e8" />
        <rect x="24" y="15" width="3" height="3" fill="#e8e8e8" />
      </svg>
    )
  },
  {
    id: 4,
    name: 'GOLDEN GINA',
    color: '#ff9f00',
    description: 'CYBERPUNK HIGH ROLLER FROM THE FUTURIST VAULT.',
    svg: (
      <svg viewBox="0 0 40 40" className="w-16 h-16">
        <rect x="10" y="10" width="20" height="20" fill="#4a154b" stroke="#ff9f00" strokeWidth="2" />
        {/* Golden sunglasses */}
        <rect x="12" y="16" width="16" height="4" fill="#ff9f00" />
        <rect x="13" y="17" width="4" height="2" fill="#0d0d1a" />
        <rect x="23" y="17" width="4" height="2" fill="#0d0d1a" />
        {/* Gold earrings */}
        <rect x="7" y="24" width="3" height="3" fill="#ff9f00" />
        <rect x="30" y="24" width="3" height="3" fill="#ff9f00" />
      </svg>
    )
  },
  {
    id: 5,
    name: 'ROBO ROLL',
    color: '#ff3f3f',
    description: 'HEAVY METAL DEALER BOT PROGRAMMED TO SHUFFLE.',
    svg: (
      <svg viewBox="0 0 40 40" className="w-16 h-16">
        <rect x="10" y="10" width="20" height="20" fill="#333333" stroke="#ff3f3f" strokeWidth="2" />
        {/* Red Visor */}
        <rect x="8" y="16" width="24" height="4" fill="#ff3f3f" />
        {/* Cyber laser pulse */}
        <rect x="16" y="17" width="8" height="2" fill="#ffef99" />
        {/* Metal screws on ears */}
        <rect x="7" y="18" width="3" height="4" fill="#e8e8e8" />
        <rect x="30" y="18" width="3" height="4" fill="#e8e8e8" />
      </svg>
    )
  }
];

export const PixelAvatar: React.FC<{
  avatarId: number;
  googlePicture?: string;
  size?: number;
  className?: string;
}> = ({ avatarId, googlePicture, size = 40, className = '' }) => {
  const chamfer = Math.max(4, Math.floor(size * 0.15));
  
  const clipStyle = {
    clipPath: `polygon(
      0% 0%, 
      calc(100% - ${chamfer}px) 0%, 
      100% ${chamfer}px, 
      100% 100%, 
      ${chamfer}px 100%, 
      0% calc(100% - ${chamfer}px)
    )`
  };

  if (googlePicture) {
    return (
      <div 
        className={`relative p-[3px] bg-[#ff9f00] border-2 border-[#0d0d1a] filter drop-shadow-[2px_2px_0px_#000000] overflow-hidden ${className}`}
        style={{ ...clipStyle, width: `${size}px`, height: `${size}px` }}
      >
        {/* Real Google Profile Image with retro pixelated rendering inside gold frame */}
        <img 
          referrerPolicy="no-referrer" 
          src={googlePicture} 
          className="w-full h-full object-cover" 
          style={{ imageRendering: 'pixelated', ...clipStyle }} 
          alt="G"
        />
        {/* Blinking cyber led corner light */}
        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#3fff6e] animate-pulse rounded-none border border-black" />
      </div>
    );
  }

  // Find corresponding character SVG
  const selected = avatars.find(a => a.id === avatarId) || avatars[0];
  
  return (
    <div 
      className={`relative border-2 border-[#e8e8e8] bg-[#1a1a2e] filter drop-shadow-[2px_2px_0px_#000000] p-1 ${className}`}
      style={{ ...clipStyle, width: `${size}px`, height: `${size}px` }}
    >
      <div className="w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full">
        {selected.svg}
      </div>
    </div>
  );
};

