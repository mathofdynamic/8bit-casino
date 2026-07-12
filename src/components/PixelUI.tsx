/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../lib/audio';
import { useStore } from '../store';
import { X, Volume2, VolumeX, AlertCircle, Sparkles, Trophy } from 'lucide-react';

interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'gold' | 'cyan' | 'magenta' | 'dark' | 'green' | 'red';
  chamfer?: number;
  borderColorClass?: string;
  fillColorClass?: string;
  shadowClass?: string;
  borderWidth?: number;
  hasShadow?: boolean;
}

const cardColorMapping = {
  dark: {
    outerBorder: 'bg-[#000000]',
    fill: 'bg-[#111111]',
    highlight: '#333333',
    shadow: '#050505',
    glow: true,
  },
  gold: {
    outerBorder: 'bg-[#ff9f00]',
    fill: 'bg-[#111111]',
    highlight: '#ffc04d',
    shadow: '#9e5a00',
    glow: true,
  },
  cyan: {
    outerBorder: 'bg-[#3fff6e]',
    fill: 'bg-[#111111]',
    highlight: '#a3ffb9',
    shadow: '#1ebf47',
    glow: true,
  },
  magenta: {
    outerBorder: 'bg-[#ff3f3f]',
    fill: 'bg-[#111111]',
    highlight: '#ffb3b3',
    shadow: '#bf1e1e',
    glow: true,
  },
  green: {
    outerBorder: 'bg-[#3fff6e]',
    fill: 'bg-[#111111]',
    highlight: '#a3ffb9',
    shadow: '#1ebf47',
    glow: true,
  },
  red: {
    outerBorder: 'bg-[#ff3f3f]',
    fill: 'bg-[#111111]',
    highlight: '#ffb3b3',
    shadow: '#bf1e1e',
    glow: true,
  }
};

// 1. The core Chamfered Card Primitive (unifying all panels/buttons)
export const PixelCard: React.FC<PixelCardProps> = ({
  children,
  variant,
  chamfer = 12,
  borderColorClass = 'bg-[#e8e8e8]',
  fillColorClass = '',
  shadowClass = 'shadow-black',
  borderWidth = 3,
  hasShadow = true,
  className = '',
  style = {},
  ...props
}) => {
  // Infer active variant from passed props if variant is undefined
  let activeVariant: 'gold' | 'cyan' | 'magenta' | 'dark' | 'green' | 'red' = variant || 'dark';
  if (!variant && borderColorClass) {
    const borderStr = borderColorClass.toLowerCase();
    if (borderStr.includes('ffd23f') || borderStr.includes('gold')) {
      activeVariant = 'gold';
    } else if (borderStr.includes('3ff7ff') || borderStr.includes('cyan')) {
      activeVariant = 'cyan';
    } else if (borderStr.includes('ff3f8e') || borderStr.includes('magenta')) {
      activeVariant = 'magenta';
    } else if (borderStr.includes('3fff6e') || borderStr.includes('green')) {
      activeVariant = 'green';
    } else if (borderStr.includes('ff3f3f') || borderStr.includes('red')) {
      activeVariant = 'red';
    }
  }

  const { outerBorder, fill, highlight, shadow, glow } = cardColorMapping[activeVariant];
  
  // Keep original customizable classes if passed, otherwise default to active 3D colors
  const finalOuterBorder = variant ? outerBorder : (borderColorClass && !borderColorClass.includes('bg-[#e8e8e8]') ? borderColorClass : outerBorder);
  const finalFill = fillColorClass || fill;

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

  const bevelStyle = {
    borderTopColor: highlight,
    borderLeftColor: highlight,
    borderBottomColor: shadow,
    borderRightColor: shadow,
  };

  return (
    <div
      className={`relative ${finalOuterBorder} ${hasShadow ? 'filter drop-shadow-[4px_4px_0px_#000000]' : ''} ${className}`}
      style={{ ...clipStyle, ...style }}
      {...props}
    >
      <div
        className={`w-full h-full ${finalFill}`}
        style={{
          ...clipStyle,
          borderWidth: `${borderWidth}px`,
          borderStyle: 'solid',
          ...bevelStyle,
        }}
      >
        <div className="w-full h-full text-inherit relative">
          {children}

          {/* Glowing pixel reflection highlight in top-left */}
          {glow && (
            <div 
              className="absolute top-[3px] left-[5px] w-6 h-1.5 bg-white/40 pointer-events-none" 
              style={{ mixBlendMode: 'overlay' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// 2. PixelButton (Supports normal / pressed animation, sounds, and offsets)
interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'cyan' | 'magenta' | 'dark' | 'green' | 'red';
  chamfer?: number;
  soundType?: 'click' | 'coin' | 'win' | 'loss';
  size?: 'sm' | 'md';
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  variant = 'gold',
  chamfer = 8,
  soundType = 'click',
  onClick,
  disabled,
  className = '',
  size = 'md',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const colorMapping = {
    gold: {
      border: 'bg-[#1a0a00]',
      fill: '#ff9f00',
      hoverFill: '#ffb732',
      pressedFill: '#cc7a00',
      text: 'text-black font-bold',
      highlight: '#ffc04d',
      shadow: '#b35900',
    },
    cyan: {
      border: 'bg-[#000000]',
      fill: '#ffffff',
      hoverFill: '#e8e8e8',
      pressedFill: '#cccccc',
      text: 'text-[#000000]',
      highlight: '#ffffff',
      shadow: '#888888',
    },
    magenta: {
      border: 'bg-[#1a0000]',
      fill: '#ff3f3f',
      hoverFill: '#ff6666',
      pressedFill: '#cc1f1f',
      text: 'text-black font-bold',
      highlight: '#ff8585',
      shadow: '#9c1c1c',
    },
    dark: {
      border: 'bg-[#000000]',
      fill: '#111111',
      hoverFill: '#222222',
      pressedFill: '#000000',
      text: 'text-[#ffffff]',
      highlight: '#444444',
      shadow: '#050505',
    },
    green: {
      border: 'bg-[#001a05]',
      fill: '#3fff6e',
      hoverFill: '#66ff8c',
      pressedFill: '#1fcc4e',
      text: 'text-black font-bold',
      highlight: '#85ffab',
      shadow: '#1c9c3e',
    },
    red: {
      border: 'bg-[#1a0000]',
      fill: '#ff3f3f',
      hoverFill: '#ff6666',
      pressedFill: '#cc1f1f',
      text: 'text-white font-bold',
      highlight: '#ff8585',
      shadow: '#9c1c1c',
    },
  };

  const activeVariant = (variant && colorMapping[variant]) ? variant : 'gold';
  const { border, fill, hoverFill, pressedFill, text, highlight, shadow } = colorMapping[activeVariant];

  const handleMouseDown = () => {
    if (!disabled) setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    // Play requested retro sound effect
    if (soundType === 'click') audio.playClick();
    else if (soundType === 'coin') audio.playCoin();
    else if (soundType === 'win') audio.playWin();
    else if (soundType === 'loss') audio.playLoss();
    
    if (onClick) onClick(e);
  };

  const offsetStyle = isPressed 
    ? { transform: 'translate(2px, 2px)', filter: 'drop-shadow-[1px_1px_0px_#000000]' }
    : { transform: 'translate(0px, 0px)', filter: 'drop-shadow-[3px_3px_0px_#000000]' };

  const clipStyle = {
    clipPath: `polygon(
      ${chamfer}px 0%, 
      calc(100% - ${chamfer}px) 0%, 
      100% ${chamfer}px, 
      100% calc(100% - ${chamfer}px), 
      calc(100% - ${chamfer}px) 100%, 
      ${chamfer}px 100%, 
      0% calc(100% - ${chamfer}px), 
      0% ${chamfer}px
    )`
  };

  const bevelStyle = isPressed
    ? {
        borderTopColor: shadow,
        borderLeftColor: shadow,
        borderBottomColor: highlight,
        borderRightColor: highlight,
      }
    : {
        borderTopColor: highlight,
        borderLeftColor: highlight,
        borderBottomColor: shadow,
        borderRightColor: shadow,
      };

  const currentBackgroundColor = isPressed 
    ? pressedFill 
    : (isHovered ? hoverFill : fill);

  const paddingClass = size === 'sm'
    ? 'px-2 py-0.5 text-base sm:text-lg'
    : 'px-2 sm:px-4 py-1 sm:py-1.5 text-lg sm:text-xl';

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled}
      style={{ ...clipStyle, ...offsetStyle }}
      className={`relative cursor-pointer transition-none select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      <div className={`p-[2.5px] ${border} h-full w-full`} style={clipStyle}>
        <div 
          className={`font-jersey tracking-wider uppercase text-center flex items-center justify-center relative ${text} h-full w-full ${paddingClass}`}
          style={{
            ...clipStyle,
            borderWidth: '3px',
            borderStyle: 'solid',
            ...bevelStyle,
            backgroundColor: currentBackgroundColor,
          }}
        >
          {children}

          {/* Glowing pixel reflection highlight in top-left */}
          {!isPressed && !disabled && (
            <div 
              className="absolute top-[3px] left-[5px] w-3 h-1 bg-white/70 pointer-events-none" 
              style={{ mixBlendMode: 'overlay' }}
            />
          )}
        </div>
      </div>
    </button>
  );
};

// 3. PixelPanel (Header band -> Body -> Footer structure aligned to 8px grid)
interface PixelPanelProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerAccent?: 'gold' | 'cyan' | 'magenta' | 'green' | 'none';
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const PixelPanel: React.FC<PixelPanelProps> = ({
  title,
  subtitle,
  icon,
  headerAccent = 'gold',
  children,
  footer,
  className = '',
}) => {
  const accentClass = {
    gold: 'bg-[#ff9f00] text-black',
    cyan: 'bg-[#3ff7ff] text-[#0d0d1a]',
    magenta: 'bg-[#ff9f00] text-black',
    green: 'bg-[#3fff6e] text-[#0d0d1a]',
    none: 'bg-[#252542] text-[#e8e8e8]',
  }[headerAccent];

  return (
    <PixelCard chamfer={12} borderWidth={3} className={`w-full ${className}`}>
      <div className="flex flex-col h-full">
        {/* Optional Header Band */}
        {title && (
          <div className={`flex items-center gap-3 p-3 border-b-3 border-[#e8e8e8] ${accentClass} pixel-checker`}>
            {icon && (
              <div className="flex items-center justify-center w-8 h-8 border-2 border-[#0d0d1a] bg-[#1a1a2e] text-[#ff9f00] shrink-0">
                {icon}
              </div>
            )}
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-jersey tracking-wider uppercase leading-none">{title}</h2>
              {subtitle && <p className="text-xs font-jersey uppercase opacity-80 leading-tight mt-0.5">{subtitle}</p>}
            </div>
          </div>
        )}

        {/* Panel Body */}
        <div className="p-4 flex-1">
          {children}
        </div>

        {/* Optional Footer Row */}
        {footer && (
          <div className="p-3 border-t-3 border-[#e8e8e8] bg-[#121224] flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </PixelCard>
  );
};

// 4. PixelProgressBar (Discrete segmented health-bar blocks)
interface PixelProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  segments?: number;
  activeColorClass?: string;
}

export const PixelProgressBar: React.FC<PixelProgressBarProps> = ({
  value,
  max = 100,
  segments = 12,
  activeColorClass = 'bg-[#ff9f00]',
}) => {
  const clampedVal = Math.max(0, Math.min(max, value));
  const activeCount = Math.round((clampedVal / max) * segments);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-sm font-jersey text-[#5a5a72] uppercase">
        <span>STREAK METER</span>
        <span>{clampedVal}%</span>
      </div>
      {/* 3D Recessed Track Slot */}
      <div 
        className="p-1 bg-[#0d0d1a] border-[#05050d] flex gap-[2px]"
        style={{
          borderWidth: '3px',
          borderStyle: 'solid',
          borderTopColor: '#05050d',
          borderLeftColor: '#05050d',
          borderBottomColor: '#45456b',
          borderRightColor: '#45456b',
        }}
      >
        {Array.from({ length: segments }).map((_, i) => {
          const isActive = i < activeCount;
          return (
            <div
              key={i}
              className={`h-5 flex-1 transition-colors duration-0 relative ${
                isActive ? activeColorClass : 'bg-[#141424]'
              }`}
              style={isActive ? {
                borderWidth: '2px',
                borderStyle: 'solid',
                borderTopColor: '#ffb3d1',
                borderLeftColor: '#ffb3d1',
                borderBottomColor: '#b51e59',
                borderRightColor: '#b51e59',
              } : {
                borderWidth: '1px',
                borderStyle: 'solid',
                borderTopColor: '#0d0d1f',
                borderLeftColor: '#0d0d1f',
                borderBottomColor: '#202038',
                borderRightColor: '#202038',
              }}
            >
              {isActive && (
                <div className="absolute top-[1px] left-[2px] w-2 h-0.5 bg-white/60 pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 5. PixelSlider (Interactive customized range with square notches)
interface PixelSliderProps {
  value: number; // raw value or 0 to 100
  onChange: (val: number) => void;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  showTicks?: boolean;
  valueSuffix?: string;
}

export const PixelSlider: React.FC<PixelSliderProps> = ({
  value,
  onChange,
  label,
  min = 0,
  max = 100,
  step,
  showTicks,
  valueSuffix = '%',
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const range = max - min;
  const valPercent = range === 0 ? 0 : Math.max(0, Math.min(100, ((value - min) / range) * 100));

  const handleSelect = (e: React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offset = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percentage = offset / rect.width;
    
    const rawVal = min + percentage * range;
    
    let snapped = rawVal;
    if (step !== undefined) {
      snapped = Math.round((rawVal - min) / step) * step + min;
    } else if (min === 0 && max === 100) {
      // Snap to nearest 5 for default volume sliders
      const pct = Math.round(percentage * 100);
      snapped = Math.round(pct / 5) * 5;
    }
    
    // Clamp to min and max bounds
    const finalVal = Math.max(min, Math.min(max, snapped));
    onChange(finalVal);
    audio.playClick();
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleSelect(e);
    }
  };

  const ticks = [0, 25, 50, 75, 100];
  const shouldShowTicks = showTicks !== undefined ? showTicks : (min === 0 && max === 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xl font-jersey text-[#e8e8e8] mb-1">
          <span>{label.toUpperCase()}</span>
          <span className="text-[#ff9f00]">
            {valueSuffix === '%' ? `${value}%` : valueSuffix === '$' ? `$${value.toFixed(2)}` : `${value}${valueSuffix}`}
          </span>
        </div>
      )}
      {/* 3D Recessed Track */}
      <div 
        ref={sliderRef}
        onMouseDown={handleSelect}
        onMouseMove={handleDrag}
        className="relative h-6 bg-[#0d0d1a] cursor-pointer flex items-center px-1"
        style={{
          borderWidth: '3px',
          borderStyle: 'solid',
          borderTopColor: '#05050d',
          borderLeftColor: '#05050d',
          borderBottomColor: '#45456b',
          borderRightColor: '#45456b',
        }}
      >
        {/* Filled Portion */}
        <div 
          className="h-2 bg-[#ff9f00] relative" 
          style={{ 
            width: `${valPercent}%`,
            borderWidth: '1.5px',
            borderStyle: 'solid',
            borderTopColor: '#ffef99',
            borderLeftColor: '#ffef99',
            borderBottomColor: '#b35900',
            borderRightColor: '#b35900',
          }}
        >
          <div className="absolute top-[1px] left-[2px] w-4 h-[2px] bg-white/50 pointer-events-none" />
        </div>
        
        {/* Raised 3D tactile square knob */}
        <div 
          className="absolute w-5 h-5 -translate-x-1/2 cursor-grab active:cursor-grabbing"
          style={{ 
            left: `${valPercent}%`,
            backgroundColor: '#ff9f00',
            borderWidth: '2.5px',
            borderStyle: 'solid',
            borderTopColor: '#ffc04d',
            borderLeftColor: '#ffc04d',
            borderBottomColor: '#b35900',
            borderRightColor: '#b35900',
            boxShadow: '2px 2px 0px #000000',
          }}
        >
          {/* Vertical tactile grip ridges inside knob */}
          <div className="absolute inset-0 flex justify-around items-center px-[2px] py-[3px] pointer-events-none">
            <div className="w-[1.5px] h-full bg-[#1a0a00]" />
            <div className="w-[1.5px] h-full bg-[#1a0a00]" />
            <div className="w-[1.5px] h-full bg-[#1a0a00]" />
          </div>
        </div>
      </div>
      {/* Tick Labels */}
      {shouldShowTicks && (
        <div className="flex justify-between px-1 mt-1 text-xs font-jersey text-[#5a5a72]">
          {ticks.map((t) => (
            <span key={t} className="cursor-pointer hover:text-white" onClick={() => onChange(t)}>
              {t}%
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// 6. PixelInput (Fully styled input field matching design guidelines)
interface PixelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const PixelInput: React.FC<PixelInputProps> = ({
  label,
  className = '',
  ...props
}) => {
  const clipStyle = {
    clipPath: 'polygon(0% 0%, calc(100% - 8px) 0%, 100% 8px, 100% 100%, 8px 100%, 0% calc(100% - 8px))'
  };

  return (
    <div className="w-full">
      {label && <label className="block text-xl font-jersey text-[#ff9f00] mb-1 uppercase">{label}</label>}
      <div className="bg-[#05050d] p-[2.5px]" style={clipStyle}>
        <input
          style={{
            ...clipStyle,
            borderWidth: '3px',
            borderStyle: 'solid',
            borderTopColor: '#05050d',
            borderLeftColor: '#05050d',
            borderBottomColor: '#45456b',
            borderRightColor: '#45456b',
          }}
          className={`w-full bg-[#141424] text-[#e8e8e8] font-jersey text-xl px-3 py-1.5 outline-none focus:bg-[#1a1a2e] selection:bg-[#ff9f00] ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

// 7. PixelCoinCounter (Stepped count-up effect)
interface PixelCoinCounterProps {
  value: number;
  className?: string;
}

export const PixelCoinCounter: React.FC<PixelCoinCounterProps> = ({ value, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (Math.abs(value - displayValue) < 0.01) {
      setDisplayValue(value);
      return;
    }

    const diff = value - displayValue;
    const stepSize = Math.max(0.01, Number((Math.abs(diff) / 10).toFixed(2)));
    const increment = diff > 0 ? stepSize : -stepSize;

    const interval = setInterval(() => {
      setDisplayValue((prev) => {
        const next = Number((prev + increment).toFixed(2));
        if ((increment > 0 && next >= value) || (increment < 0 && next <= value)) {
          clearInterval(interval);
          return value;
        }
        
        // Play audio beep occasionally to match increment ticks
        if (Math.random() > 0.4) {
          audio.playCoin();
        }
        
        return next;
      });
    }, 40); // 40ms chunky ticking

    return () => clearInterval(interval);
  }, [value, displayValue]);

  const clipStyle = {
    clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
  };

  return (
    <div 
      className={`relative inline-block select-none ${className}`}
    >
      <div className="p-[2.5px] bg-[#ff9f00] h-full w-full" style={clipStyle}>
        <div 
          className="bg-[#1a1a2e] h-full w-full flex items-center justify-center gap-2 px-3"
          style={{
            ...clipStyle,
            borderWidth: '3px',
            borderColor: 'transparent',
          }}
        >
          {/* Pixel Coin Icon */}
          <svg className="w-5 h-5 animate-pulse shrink-0" viewBox="0 0 16 16" fill="none">
            <path d="M6 1h4v1H6V1zM4 2h2v1H4V2zm6 0h2v1h-2V2zM2 4h2v1H2V4zm10 0h2v1h-2V4zM1 6h1v4H1V6zm13 0h1v4h-1V6zM2 11h2v1H2v-1zm10 0h2v1h-2v-1zm-6 2h4v1H6v-1z" fill="#ff9f00"/>
            <rect x="5" y="4" width="6" height="8" fill="#ffc04d"/>
            <rect x="7" y="5" width="2" height="6" fill="#ff9f00"/>
          </svg>
          <span className="text-xl font-jersey tracking-wider text-[#ff9f00] select-none pt-0.5 leading-none">
            ${displayValue.toFixed(2)}
          </span>
        </div>
      </div>
      {/* 3D shadow effect */}
      <div 
        className="absolute inset-0 bg-[#000000] -z-10 transition-none"
        style={{
          ...clipStyle,
          transform: 'translate(3px, 3px)',
        }}
      />
    </div>
  );
};

// 8. PixelModal
interface PixelModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const PixelModal: React.FC<PixelModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  useEffect(() => {
    if (isOpen) {
      audio.playModalOpen();
      return () => {
        audio.playModalClose();
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay (dimmed, NOT blurred) */}
      <div 
        className="absolute inset-0 bg-[#0d0d1a]/85 cursor-pointer" 
        onClick={() => {
          audio.playClick();
          onClose();
        }}
      />
      {/* Modal Card content */}
      <div className="relative w-full max-w-lg animate-pixel-enter z-10">
        <PixelPanel
          title={title}
          headerAccent="gold"
          icon={<AlertCircle className="w-5 h-5 text-black" />}
          footer={
            footer || (
              <PixelButton variant="gold" onClick={onClose} chamfer={8}>
                CLOSE
              </PixelButton>
            )
          }
        >
          {children}
        </PixelPanel>
      </div>
    </div>
  );
};

// 9. PixelToast (Instant notifications with zero blur)
export const PixelToast: React.FC = () => {
  const { toast, closeToast } = useStore();

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        closeToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast.visible, closeToast]);

  if (!toast.visible) return null;

  const cardVariant = {
    success: 'green',
    error: 'red',
    info: 'cyan',
  }[toast.type] as 'green' | 'red' | 'cyan';

  const icon = {
    success: '★',
    error: '▲',
    info: '◆',
  }[toast.type];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-11/12 animate-bounce">
      <PixelCard variant={cardVariant} chamfer={12} borderWidth={3}>
        <div className="p-4 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-jersey">
              {icon}
            </span>
            <p className="text-xl font-jersey uppercase tracking-wider leading-none mt-1">
              {toast.message}
            </p>
          </div>
          <button 
            onClick={() => {
              audio.playClick();
              closeToast();
            }} 
            className="text-inherit hover:opacity-80 font-bold font-jersey text-xl"
          >
            [X]
          </button>
        </div>
      </PixelCard>
    </div>
  );
};

// 10. PixelMascot (Stepped SVG robot with glowing parts and platform grounding)
export const PixelMascot: React.FC<{ mood?: 'happy' | 'idle' | 'deal' }> = ({ mood = 'idle' }) => {
  const [frame, setFrame] = useState(0);

  // Simple stepped tick counter for retro 8fps-like animations
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, 250); // 4 frames looping at 250ms (4Hz)
    return () => clearInterval(interval);
  }, []);

  const offsetBob = frame % 2 === 0 ? 3 : 0; // Chunky bobbing

  return (
    <div className="flex flex-col items-center">
      {/* SVG Layered Art */}
      <svg 
        className="w-36 h-40 overflow-visible" 
        viewBox="0 0 100 120" 
        fill="none" 
        style={{ transform: `translateY(${offsetBob}px)` }}
      >
        {/* Head Antennas */}
        <rect x="47" y="10" width="6" height="15" fill="#5a5a72" />
        <rect x="44" y="5" width="12" height="6" fill="#5a5a72" />
        {/* Glowing blinking neon bulb */}
        <rect 
          x="46" 
          y="0" 
          width="8" 
          height="6" 
          fill={frame === 1 || frame === 3 ? '#ff9f00' : '#ffe480'} 
        />

        {/* Head Container */}
        <rect x="25" y="20" width="50" height="36" fill="#1a1a2e" stroke="#e8e8e8" strokeWidth="3" />
        {/* Face plate shadow */}
        <rect x="28" y="23" width="44" height="10" fill="#0d0d1a" />

        {/* Glowing Eyes */}
        {frame === 2 ? (
          // Blinking eyes frame
          <>
            <rect x="34" y="32" width="10" height="3" fill="#3fff6e" />
            <rect x="56" y="32" width="10" height="3" fill="#3fff6e" />
          </>
        ) : (
          // Wide cyber eyes
          <>
            <rect x="34" y="30" width="10" height="8" fill="#3fff6e" />
            <rect x="37" y="33" width="4" height="4" fill="#0d0d1a" />
            <rect x="56" y="30" width="10" height="8" fill="#3fff6e" />
            <rect x="59" y="33" width="4" height="4" fill="#0d0d1a" />
          </>
        )}

        {/* Cyber Mouth / Matrix lines */}
        <rect x="42" y="44" width="16" height="4" fill="#ff9f00" />
        {frame % 2 === 0 && <rect x="45" y="45" width="10" height="2" fill="#0d0d1a" />}

        {/* Neck */}
        <rect x="44" y="56" width="12" height="6" fill="#5a5a72" />

        {/* Main Body (Slot machine reel chest) */}
        <rect x="20" y="62" width="60" height="42" fill="#1a1a2e" stroke="#e8e8e8" strokeWidth="3" />
        {/* Decorative gold coin deposit slot */}
        <rect x="25" y="67" width="14" height="24" fill="#0d0d1a" stroke="#ff9f00" strokeWidth="2" />
        <rect x="31" y="71" width="2" height="16" fill="#ff9f00" className="animate-pulse" />

        {/* Mini reel window */}
        <rect x="44" y="67" width="30" height="16" fill="#0d0d1a" stroke="#3fff6e" strokeWidth="2" />
        {/* Animated pixel mini cherry inside reel */}
        <circle cx="51" cy="75" r="3" fill="#ff3f3f" />
        <circle cx="58" cy="77" r="3" fill="#ff3f3f" />
        <rect x="54" y="71" width="4" height="3" fill="#3fff6e" />
        {frame % 2 === 1 && <rect x="65" y="70" width="6" height="10" fill="#ff9f00" />}

        {/* Left Arm holding cards */}
        <rect x="6" y="70" width="14" height="8" fill="#5a5a72" />
        <rect x="6" y="78" width="8" height="16" fill="#e8e8e8" />
        {/* A tiny Ace card held in hand */}
        <rect x="4" y="86" width="12" height="16" fill="#f2ead3" stroke="#0d0d1a" strokeWidth="1" />
        <rect x="9" y="93" width="2" height="4" fill="#ff3f3f" />

        {/* Right Arm dealing chips */}
        <rect x="80" y="70" width="14" height="8" fill="#5a5a72" />
        <rect x="86" y="78" width="8" height="16" fill="#e8e8e8" />
        <circle cx="90" cy="94" r="5" fill="#ff9f00" />
        <circle cx="90" cy="94" r="2" fill="#e8e8e8" />
      </svg>

      {/* Ground shadows so the mascot looks "standing inside the scene" rather than floating */}
      <div 
        className="w-40 h-3 bg-black/60 rounded-full blur-none filter opacity-90 transition-all"
        style={{ transform: `scaleX(${frame % 2 === 0 ? 0.95 : 1.05})` }}
      />
    </div>
  );
};
