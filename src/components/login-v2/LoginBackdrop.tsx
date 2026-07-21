/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const LoginBackdrop: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#0B0D18]">
      {/* Subtle pixel grid pattern */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, #2E3150 1px, transparent 1px),
            linear-gradient(to bottom, #2E3150 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Atmospheric Cyan Glow Top Left */}
      <div 
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: '#54D6D9' }}
      />

      {/* Atmospheric Magenta Glow Bottom Right */}
      <div 
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-15 blur-3xl"
        style={{ backgroundColor: '#D95F9A' }}
      />

      {/* Subtle vignette border overlay */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
    </div>
  );
};
