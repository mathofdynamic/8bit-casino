/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Heart, Play } from 'lucide-react';
import { audio } from '../../lib/audio';

// -------------------------------------------------------------
// 1. ProgressivePixelImage
// -------------------------------------------------------------
interface ProgressivePixelImageProps {
  thumbnailSrc: string;
  fullSrc: string;
  alt: string;
  aspectRatio?: string;
  objectPosition?: string;
  eager?: boolean;
  className?: string;
  imgClassName?: string;
}

export const ProgressivePixelImage: React.FC<ProgressivePixelImageProps> = ({
  thumbnailSrc,
  fullSrc,
  alt,
  aspectRatio = 'aspect-video',
  objectPosition = 'center',
  eager = false,
  className = '',
  imgClassName = '',
}) => {
  const [isFullLoaded, setIsFullLoaded] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let active = true;
    let observer: IntersectionObserver | null = null;
    
    const startPreload = () => {
      const img = new Image();
      img.src = fullSrc;
      
      const handleLoad = () => {
        if (!active) return;
        if (img.decode) {
          img.decode()
            .then(() => {
              if (active) setIsFullLoaded(true);
            })
            .catch(() => {
              if (active) setIsFullLoaded(true);
            });
        } else {
          setIsFullLoaded(true);
        }
      };

      const handleError = () => {
        if (active) {
          setHasFailed(true);
        }
      };

      img.onload = handleLoad;
      img.onerror = handleError;
      
      if (img.complete) {
        handleLoad();
      }
    };

    if (eager) {
      startPreload();
    } else if ('IntersectionObserver' in window && containerRef.current) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startPreload();
            if (observer && containerRef.current) {
              observer.unobserve(containerRef.current);
            }
          }
        });
      }, { rootMargin: '200px' });
      observer.observe(containerRef.current);
    } else {
      startPreload();
    }

    return () => {
      active = false;
      if (observer && containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [fullSrc, eager]);

  const [thumbFailed, setThumbFailed] = useState(false);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
  };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: objectPosition,
    imageRendering: 'pixelated',
    display: 'block',
  };

  if (hasFailed && thumbFailed) {
    return (
      <div 
        ref={containerRef}
        className={`${aspectRatio} bg-[#0B0D18] border border-[#2E3150] flex items-center justify-center ${className}`}
        style={containerStyle}
      >
        <span className="text-[#63657A] font-jersey text-sm uppercase">IMAGE ERROR</span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`${aspectRatio} bg-[#15182A] ${className}`}
      style={containerStyle}
    >
      {!isFullLoaded && !thumbFailed && (
        <img
          src={thumbnailSrc}
          alt={alt}
          style={imgStyle}
          className={`${imgClassName}`}
          onError={() => setThumbFailed(true)}
          referrerPolicy="no-referrer"
        />
      )}

      <img
        src={fullSrc}
        alt={alt}
        style={{
          ...imgStyle,
          position: isFullLoaded ? 'static' : 'absolute',
          top: 0,
          left: 0,
          opacity: isFullLoaded ? 1 : 0,
        }}
        className={`${imgClassName} transition-opacity duration-200 ease-in-out`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

// -------------------------------------------------------------
// 2. CasinoPanel
// -------------------------------------------------------------
interface CasinoPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  headerAccent?: React.ReactNode;
  footer?: React.ReactNode;
  chamfer?: 8 | 12 | 16;
  borderColor?: 'strong' | 'default';
  className?: string;
}

export const CasinoPanel: React.FC<CasinoPanelProps> = ({
  children,
  title,
  subtitle,
  headerAccent,
  footer,
  chamfer = 12,
  borderColor = 'default',
  className = '',
  ...props
}) => {
  const borderClass = borderColor === 'strong' ? 'bg-[#44476B]' : 'bg-[#2E3150]';
  const innerChamfer = chamfer - 3;
  
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

  const innerClipStyle = {
    clipPath: `polygon(
      0% 0%, 
      calc(100% - ${innerChamfer}px) 0%, 
      100% ${innerChamfer}px, 
      100% 100%, 
      ${innerChamfer}px 100%, 
      0% calc(100% - ${innerChamfer}px)
    )`
  };

  return (
    <div
      style={clipStyle}
      className={`relative ${borderClass} p-[3px] filter drop-shadow-[4px_4px_0px_#000000] ${className}`}
      {...props}
    >
      <div 
        style={innerClipStyle}
        className="w-full h-full bg-[#15182A] flex flex-col"
      >
        {title && (
          <div className="flex items-center justify-between p-3 border-b-2 border-[#2E3150] bg-[#1d2036]">
            <div>
              <h3 className="font-jersey text-2xl text-[#F3EBD8] uppercase tracking-wide leading-none">{title}</h3>
              {subtitle && <p className="font-jersey text-xs text-[#9A9AB5] uppercase mt-1 leading-none">{subtitle}</p>}
            </div>
            {headerAccent && <div className="shrink-0">{headerAccent}</div>}
          </div>
        )}
        
        <div className="p-4 flex-1">
          {children}
        </div>

        {footer && (
          <div className="p-3 border-t-2 border-[#2E3150] bg-[#111322] flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. CasinoButton
// -------------------------------------------------------------
interface CasinoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'cyan' | 'magenta' | 'dark' | 'outline';
  chamfer?: number;
  size?: 'sm' | 'md' | 'lg';
  soundType?: 'click' | 'coin' | 'win' | 'loss' | 'none';
  shimmer?: boolean;
}

export const CasinoButton: React.FC<CasinoButtonProps> = ({
  children,
  variant = 'gold',
  chamfer = 8,
  size = 'md',
  soundType = 'click',
  shimmer = false,
  onClick,
  disabled,
  className = '',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const colors = {
    gold: {
      bg: '#F6B73C',
      hover: '#FFC85E',
      pressed: '#C78C16',
      border: '#784E00',
      text: 'text-black font-bold',
    },
    cyan: {
      bg: '#54D6D9',
      hover: '#7AFFFF',
      pressed: '#2FA8AB',
      border: '#005D60',
      text: 'text-black font-bold',
    },
    magenta: {
      bg: '#D95F9A',
      hover: '#FF88BE',
      pressed: '#A6336B',
      border: '#57002C',
      text: 'text-white font-bold',
    },
    dark: {
      bg: '#222744',
      hover: '#2E355E',
      pressed: '#15182A',
      border: '#111322',
      text: 'text-[#F3EBD8]',
    },
    outline: {
      bg: 'transparent',
      hover: '#1D2036',
      pressed: '#15182A',
      border: '#2E3150',
      text: 'text-[#9A9AB5] hover:text-[#F3EBD8]',
    }
  };

  const current = colors[variant];

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

  let paddingClass = 'px-4 py-1.5 text-xl';
  if (size === 'sm') paddingClass = 'px-3 py-1 text-base';
  if (size === 'lg') paddingClass = 'px-6 py-2.5 text-2xl';

  const bgColor = isPressed 
    ? current.pressed 
    : (isHovered ? current.hover : current.bg);

  const shimmerStyle = shimmer && !isPressed && !disabled ? 'animate-pixel-shimmer' : '';

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled}
      style={{ ...clipStyle, ...offsetStyle }}
      className={`relative cursor-pointer select-none transition-none ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      <div className="p-[2.5px] bg-black h-full w-full" style={clipStyle}>
        <div 
          className={`font-jersey tracking-wider uppercase text-center flex items-center justify-center relative ${current.text} h-full w-full ${paddingClass} ${shimmerStyle}`}
          style={{
            ...clipStyle,
            borderWidth: '2.5px',
            borderStyle: 'solid',
            borderColor: current.border,
            backgroundColor: bgColor,
          }}
        >
          {children}

          {shimmer && !isPressed && !disabled && (
            <style>{`
              @keyframes step-shimmer {
                0% { left: -100%; }
                50% { left: 100%; }
                100% { left: 100%; }
              }
              .animate-pixel-shimmer::after {
                content: '';
                position: absolute;
                top: 0; right: 0; bottom: 0; left: 0;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                width: 30%;
                height: 100%;
                animation: step-shimmer 3s steps(15) infinite;
              }
            `}</style>
          )}

          {!isPressed && !disabled && variant !== 'outline' && (
            <div 
              className="absolute top-[2px] left-[4px] right-[4px] h-[2px] bg-white/45 pointer-events-none" 
              style={{ mixBlendMode: 'overlay' }}
            />
          )}
        </div>
      </div>
    </button>
  );
};

// -------------------------------------------------------------
// 4. CasinoIconButton
// -------------------------------------------------------------
interface CasinoIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'cyan' | 'magenta' | 'dark' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  soundType?: 'click' | 'coin' | 'win' | 'none';
  icon: React.ReactNode;
}

export const CasinoIconButton: React.FC<CasinoIconButtonProps> = ({
  icon,
  variant = 'dark',
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <CasinoButton
      variant={variant}
      size={size}
      chamfer={4}
      className={`p-0 aspect-square ${className}`}
      {...props}
    >
      <div className="flex items-center justify-center">{icon}</div>
    </CasinoButton>
  );
};

// -------------------------------------------------------------
// 5. CasinoBadge
// -------------------------------------------------------------
interface CasinoBadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'cyan' | 'magenta' | 'success' | 'warning' | 'danger' | 'dark';
  className?: string;
}

export const CasinoBadge: React.FC<CasinoBadgeProps> = ({
  children,
  variant = 'gold',
  className = '',
}) => {
  const colors = {
    gold: 'bg-[#F6B73C]/10 border-[#F6B73C] text-[#F6B73C]',
    cyan: 'bg-[#54D6D9]/10 border-[#54D6D9] text-[#54D6D9]',
    magenta: 'bg-[#D95F9A]/10 border-[#D95F9A] text-[#D95F9A]',
    success: 'bg-[#66D18F]/10 border-[#66D18F] text-[#66D18F]',
    warning: 'bg-[#F29E4C]/10 border-[#F29E4C] text-[#F29E4C]',
    danger: 'bg-[#E85D68]/10 border-[#E85D68] text-[#E85D68]',
    dark: 'bg-[#222744] border-[#2E3150] text-[#9A9AB5]',
  };

  const clipStyle = {
    clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)'
  };

  return (
    <div 
      style={clipStyle}
      className={`inline-flex items-center px-2 py-0.5 border text-xs font-jersey uppercase tracking-wider leading-none ${colors[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

// -------------------------------------------------------------
// 6. CasinoNavItem
// -------------------------------------------------------------
interface CasinoNavItemProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export const CasinoNavItem: React.FC<CasinoNavItemProps> = ({
  children,
  active = false,
  onClick,
  className = '',
  icon,
}) => {
  const clipStyle = {
    clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% 100%, 0% 100%, 0% 0%)'
  };

  return (
    <button
      onClick={onClick}
      style={active ? clipStyle : undefined}
      className={`relative py-2 px-3 sm:px-4 flex items-center gap-1.5 sm:gap-2 font-jersey text-xl uppercase tracking-wider transition-all select-none border-b-4 cursor-pointer ${
        active 
          ? 'bg-[#1D2036] border-[#F6B73C] text-[#F3EBD8]' 
          : 'border-transparent text-[#9A9AB5] hover:text-[#F3EBD8] hover:bg-[#15182A]/50'
      } ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="pt-0.5">{children}</span>
    </button>
  );
};

// -------------------------------------------------------------
// 7. CasinoSidebarItem
// -------------------------------------------------------------
interface CasinoSidebarItemProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const CasinoSidebarItem: React.FC<CasinoSidebarItemProps> = ({
  children,
  active = false,
  onClick,
  icon,
  className = '',
}) => {
  const clipStyle = {
    clipPath: 'polygon(0% 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%)'
  };

  return (
    <button
      onClick={onClick}
      style={clipStyle}
      className={`w-full py-2 px-3 flex items-center gap-2.5 font-jersey text-lg uppercase tracking-wider text-left transition-none select-none border-l-4 cursor-pointer ${
        active 
          ? 'bg-[#1D2036] border-[#F6B73C] text-[#F3EBD8] font-bold' 
          : 'border-transparent text-[#9A9AB5] hover:text-[#F3EBD8] hover:bg-[#1D2036]/50'
      } ${className}`}
    >
      {icon && <span className={`${active ? 'text-[#F6B73C]' : 'text-[#9A9AB5]'}`}>{icon}</span>}
      <span className="pt-0.5 flex-1 truncate">{children}</span>
    </button>
  );
};

// -------------------------------------------------------------
// 8. CasinoProgressBar
// -------------------------------------------------------------
interface CasinoProgressBarProps {
  value: number;
  max?: number;
  segments?: number;
  color?: 'gold' | 'cyan' | 'magenta' | 'success';
}

export const CasinoProgressBar: React.FC<CasinoProgressBarProps> = ({
  value,
  max = 100,
  segments = 10,
  color = 'gold',
}) => {
  const clampedVal = Math.max(0, Math.min(max, value));
  const activeCount = Math.round((clampedVal / max) * segments);

  const colors = {
    gold: {
      bg: 'bg-[#F6B73C]',
      border: 'border-t-[#FFE699] border-l-[#FFE699] border-b-[#B37E19] border-r-[#B37E19]',
    },
    cyan: {
      bg: 'bg-[#54D6D9]',
      border: 'border-t-[#96FFFF] border-l-[#96FFFF] border-b-[#2C9AA3] border-r-[#2C9AA3]',
    },
    magenta: {
      bg: 'bg-[#D95F9A]',
      border: 'border-t-[#FF9EC9] border-l-[#FF9EC9] border-b-[#A33D6D] border-r-[#A33D6D]',
    },
    success: {
      bg: 'bg-[#66D18F]',
      border: 'border-t-[#A1FFA9] border-l-[#A1FFA9] border-b-[#3C9C64] border-r-[#3C9C64]',
    },
  }[color];

  return (
    <div 
      className="p-1 bg-[#0B0D18] border-2 border-[#2E3150] flex gap-[2px] w-full"
      style={{
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
      }}
    >
      {Array.from({ length: segments }).map((_, i) => {
        const isActive = i < activeCount;
        return (
          <div
            key={i}
            className={`h-4 flex-1 transition-colors duration-0 relative ${
              isActive ? colors.bg : 'bg-[#15182A]'
            }`}
            style={isActive ? {
              borderWidth: '1.5px',
              borderStyle: 'solid',
            } : {
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: '#1C2036',
            }}
          >
            {isActive && (
              <div className="absolute top-[1px] left-[1px] right-[1px] h-[1px] bg-white/45 pointer-events-none" />
            )}
          </div>
        );
      })}
    </div>
  );
};

// -------------------------------------------------------------
// 9. GameCard
// -------------------------------------------------------------
interface GameCardProps {
  title: string;
  category: string;
  thumbnailSrc: string;
  fullSrc: string;
  metadata?: string;
  badge?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  onClick?: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  category,
  thumbnailSrc,
  fullSrc,
  metadata,
  badge,
  isFavorite = false,
  onToggleFavorite,
  onClick,
}) => {
  const clipStyle = {
    clipPath: 'polygon(0% 0%, calc(100% - 10px) 0%, 100% 10px, 100% 100%, 10px 100%, 0% calc(100% - 10px))'
  };

  return (
    <div
      style={clipStyle}
      onClick={onClick}
      className="group relative cursor-pointer bg-[#15182A] border-2 border-[#2E3150] p-1.5 flex flex-col justify-between filter drop-shadow-[2px_2px_0px_#000000] hover:border-[#F6B73C] transition-colors focus-within:border-[#F6B73C] outline-none"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="relative aspect-video overflow-hidden bg-black border border-[#2E3150] mb-2">
        <ProgressivePixelImage
          thumbnailSrc={thumbnailSrc}
          fullSrc={fullSrc}
          alt={title}
          aspectRatio="aspect-video"
          eager={false}
        />
        
        {badge && (
          <div className="absolute top-2 left-2 z-10">
            <CasinoBadge variant={badge.toUpperCase() === 'HOT' ? 'magenta' : 'gold'}>
              {badge}
            </CasinoBadge>
          </div>
        )}

        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(e);
            }}
            className="absolute top-2 right-2 z-10 p-1.5 bg-[#0B0D18]/80 border border-[#2E3150] text-[#9A9AB5] hover:text-[#D95F9A] hover:bg-[#0B0D18] active:scale-90 transition-all cursor-pointer"
            style={{ clipPath: 'polygon(2px 0%, calc(100% - 2px) 0%, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0% calc(100% - 2px), 0% 2px)' }}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#D95F9A] text-[#D95F9A]' : ''}`} />
          </button>
        )}

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <div 
            className="bg-[#F6B73C] border-2 border-black p-2 filter drop-shadow-[3px_3px_0px_#000000] flex items-center justify-center"
            style={{ clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)' }}
          >
            <Play className="w-5 h-5 text-black fill-black" />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between flex-1 px-1">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-jersey text-sm text-[#9A9AB5] uppercase">{category}</span>
            {metadata && <span className="font-jersey text-xs text-[#54D6D9] uppercase">{metadata}</span>}
          </div>
          <h4 className="font-jersey text-xl text-[#F3EBD8] uppercase tracking-wide group-hover:text-[#F6B73C] truncate leading-none mt-1">
            {title}
          </h4>
        </div>
      </div>
    </div>
  );
};
