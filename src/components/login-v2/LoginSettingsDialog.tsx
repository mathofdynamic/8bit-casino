/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { CasinoPanel, CasinoButton, CasinoBadge } from '../ui-v2';
import { Volume2, VolumeX, Music, Zap, Eye, Settings } from 'lucide-react';

interface LoginSettingsDialogProps {
  isOpen: boolean;
  audioMuted: boolean;
  musicVolume: number;
  sfxVolume: number;
  reduceFlashing: boolean;
  onToggleMute: () => void;
  onMusicVolumeChange: (value: number) => void;
  onSfxVolumeChange: (value: number) => void;
  onReduceFlashingChange: (value: boolean) => void;
  onClose: () => void;
}

export const LoginSettingsDialog: React.FC<LoginSettingsDialogProps> = ({
  isOpen,
  audioMuted,
  musicVolume,
  sfxVolume,
  reduceFlashing,
  onToggleMute,
  onMusicVolumeChange,
  onSfxVolumeChange,
  onReduceFlashingChange,
  onClose,
}) => {
  const doneBtnRef = useRef<HTMLButtonElement>(null);
  const doneContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const button = doneContainerRef.current?.querySelector('button');
      button?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const musicPercent = Math.round(musicVolume * 100);
  const sfxPercent = Math.round(sfxVolume * 100);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 pointer-events-auto selection:bg-[#54D6D9] selection:text-black"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-settings-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <h2 id="login-settings-title" className="sr-only">
        AUDIO & ACCESSIBILITY
      </h2>

      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <CasinoPanel
          title="AUDIO & ACCESSIBILITY"
          subtitle="Adjust sound and visual comfort."
          chamfer={12}
          borderColor="strong"
          headerAccent={<Settings className="w-6 h-6 text-[#F6B73C]" />}
        >
          <div className="space-y-4">
            
            {/* MASTER SOUND */}
            <div 
              className="bg-[#1D2036] border border-[#2E3150] p-3 flex items-center justify-between gap-3"
              style={{ clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)' }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-jersey text-xl text-[#F3EBD8] uppercase leading-none">
                    MASTER SOUND
                  </span>
                  <CasinoBadge variant={audioMuted ? 'muted' : 'cyan'}>
                    {audioMuted ? 'SOUND MUTED' : 'SOUND ON'}
                  </CasinoBadge>
                </div>
                <p className="font-jersey text-xs text-[#9A9AB5] uppercase mt-1 leading-none m-0">
                  Controls all music and sound effects.
                </p>
              </div>

              <CasinoButton
                variant={audioMuted ? 'gold' : 'dark'}
                size="sm"
                onClick={onToggleMute}
                aria-pressed={audioMuted}
                aria-label={audioMuted ? 'Unmute master sound' : 'Mute master sound'}
              >
                {audioMuted ? (
                  <span className="flex items-center gap-1.5"><VolumeX className="w-4 h-4" /> MUTED</span>
                ) : (
                  <span className="flex items-center gap-1.5"><Volume2 className="w-4 h-4" /> ACTIVE</span>
                )}
              </CasinoButton>
            </div>

            {/* MUSIC VOLUME */}
            <div 
              className="bg-[#111322] border border-[#2E3150] p-3 space-y-2"
              style={{ clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)' }}
            >
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="music-volume-input"
                  className="font-jersey text-lg text-[#F3EBD8] uppercase flex items-center gap-2 leading-none cursor-pointer"
                >
                  <Music className="w-4 h-4 text-[#54D6D9]" />
                  MUSIC VOLUME
                </label>
                <span className="font-jersey text-lg text-[#54D6D9]">
                  {musicPercent}%
                </span>
              </div>
              <input
                id="music-volume-input"
                type="range"
                min={0}
                max={100}
                step={1}
                value={musicPercent}
                onChange={(e) => onMusicVolumeChange(Number(e.target.value) / 100)}
                aria-label="Music volume"
                className="w-full h-2 bg-[#1D2036] accent-[#F6B73C] border border-[#2E3150] cursor-pointer"
              />
            </div>

            {/* SOUND EFFECTS VOLUME */}
            <div 
              className="bg-[#111322] border border-[#2E3150] p-3 space-y-2"
              style={{ clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)' }}
            >
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="sfx-volume-input"
                  className="font-jersey text-lg text-[#F3EBD8] uppercase flex items-center gap-2 leading-none cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-[#F6B73C]" />
                  SOUND EFFECTS VOLUME
                </label>
                <span className="font-jersey text-lg text-[#F6B73C]">
                  {sfxPercent}%
                </span>
              </div>
              <input
                id="sfx-volume-input"
                type="range"
                min={0}
                max={100}
                step={1}
                value={sfxPercent}
                onChange={(e) => onSfxVolumeChange(Number(e.target.value) / 100)}
                aria-label="Sound effects volume"
                className="w-full h-2 bg-[#1D2036] accent-[#F6B73C] border border-[#2E3150] cursor-pointer"
              />
            </div>

            {/* REDUCE FLASHING */}
            <div 
              className="bg-[#1D2036] border border-[#2E3150] p-3 flex items-center justify-between gap-3"
              style={{ clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)' }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-jersey text-xl text-[#F3EBD8] uppercase leading-none">
                    REDUCE FLASHING
                  </span>
                  <CasinoBadge variant={reduceFlashing ? 'magenta' : 'muted'}>
                    {reduceFlashing ? 'REDUCED' : 'NORMAL'}
                  </CasinoBadge>
                </div>
                <p className="font-jersey text-xs text-[#9A9AB5] uppercase mt-1 leading-none m-0">
                  Disables decorative flashing and continuous motion.
                </p>
              </div>

              <CasinoButton
                variant={reduceFlashing ? 'gold' : 'dark'}
                size="sm"
                onClick={() => onReduceFlashingChange(!reduceFlashing)}
                aria-pressed={reduceFlashing}
                aria-label="Toggle reduce flashing"
              >
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {reduceFlashing ? 'REDUCED' : 'NORMAL'}
                </span>
              </CasinoButton>
            </div>

            {/* Primary Action Button */}
            <div ref={doneContainerRef} className="pt-2">
              <CasinoButton
                variant="gold"
                size="lg"
                className="w-full"
                soundType="click"
                onClick={onClose}
                aria-label="Done audio and accessibility settings"
              >
                DONE
              </CasinoButton>
            </div>

          </div>
        </CasinoPanel>
      </div>
    </div>
  );
};
