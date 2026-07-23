/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { X, Volume2, Eye } from 'lucide-react';
import { CasinoPanel, CasinoButton } from '../ui-v2';

export interface GlobalSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  audioMuted: boolean;
  onToggleMute: () => void;
  musicVolume: number;
  onMusicVolumeChange: (val: number) => void;
  sfxVolume: number;
  onSfxVolumeChange: (val: number) => void;
  reduceFlashing: boolean;
  onReduceFlashingChange: (val: boolean) => void;
}

export const GlobalSettingsDialog: React.FC<GlobalSettingsDialogProps> = ({
  isOpen,
  onClose,
  audioMuted,
  onToggleMute,
  musicVolume,
  onMusicVolumeChange,
  sfxVolume,
  onSfxVolumeChange,
  reduceFlashing,
  onReduceFlashingChange,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Capture focused element on open and restore on close
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    focusTimerRef.current = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    return () => {
      if (focusTimerRef.current !== null) {
        clearTimeout(focusTimerRef.current);
        focusTimerRef.current = null;
      }

      const previous = previouslyFocusedElementRef.current;
      if (previous && document.contains(previous)) {
        previous.focus();
      }

      previouslyFocusedElementRef.current = null;
    };
  }, [isOpen]);

  // Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling while open
  useEffect(() => {
    if (!isOpen) return;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = priorOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const musicPercent = Math.round(musicVolume * 100);
  const sfxPercent = Math.round(sfxVolume * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-settings-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80"
    >
      <h2 id="global-settings-title" className="sr-only">
        SETTINGS
      </h2>

      <div
        className="w-full max-w-[560px] max-h-[90vh] overflow-y-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <CasinoPanel
          title="SETTINGS"
          subtitle="Adjust audio, accessibility, and gameplay preferences."
          borderColor="strong"
          headerAccent={
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline font-jersey text-xs text-[#54D6D9] uppercase tracking-wider">
                PLAYER PREFERENCES
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close settings"
                onClick={onClose}
                className="p-1 bg-[#0B0D18] border border-[#2E3150] text-[#9A9AB5] hover:text-[#F3EBD8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6B73C] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          }
          footer={
            <CasinoButton
              type="button"
              variant="gold"
              size="md"
              soundType="none"
              onClick={onClose}
            >
              DONE
            </CasinoButton>
          }
        >
          <div className="flex flex-col gap-5 select-none font-jersey text-sm text-[#F3EBD8]">
            {/* AUDIO GROUP */}
            <div className="bg-[#0B0D18] border-2 border-[#2E3150] p-3.5 flex flex-col gap-3">
              <div className="flex flex-col">
                <h3 className="font-jersey text-lg text-[#F6B73C] uppercase tracking-wide flex items-center gap-1.5 leading-none m-0">
                  <Volume2 className="w-4 h-4 shrink-0 text-[#F6B73C]" />
                  <span>AUDIO</span>
                </h3>
                <p className="font-jersey text-xs text-[#9A9AB5] uppercase mt-1 mb-0 leading-tight">
                  Master audio toggles and volume levels across all games.
                </p>
              </div>

              {/* Row 1: Master Mute */}
              <div className="bg-[#15182A] border border-[#2E3150] p-3 flex items-center justify-between gap-3">
                <div className="flex flex-col min-w-0">
                  <span className="font-jersey text-base text-[#F3EBD8] uppercase leading-none">
                    MASTER MUTE
                  </span>
                  <span className="font-jersey text-xs text-[#9A9AB5] uppercase mt-1 leading-tight">
                    Silence all background music and sound effects.
                  </span>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={audioMuted}
                  aria-label="Master Mute"
                  onClick={onToggleMute}
                  className={`relative inline-flex items-center h-8 w-20 px-1 border-2 border-[#2E3150] transition-colors cursor-pointer select-none shrink-0 ${
                    audioMuted ? 'bg-[#54D6D9]' : 'bg-[#222744]'
                  }`}
                  style={{
                    clipPath:
                      'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
                  }}
                >
                  <span
                    className={`font-jersey text-xs uppercase ${
                      audioMuted ? 'text-black font-bold ml-1' : 'text-[#63657A] ml-auto mr-1'
                    }`}
                  >
                    {audioMuted ? 'ON' : 'OFF'}
                  </span>
                  <span
                    className={`absolute top-0.5 w-6 h-6 bg-[#0B0D18] border border-[#2E3150] transition-all ${
                      audioMuted ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Row 2: Music Volume Slider */}
              <div className="bg-[#15182A] border border-[#2E3150] p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between font-jersey uppercase text-xs">
                  <span className="text-[#F3EBD8] text-sm">MUSIC VOLUME</span>
                  <span className="text-[#54D6D9] font-bold text-sm">{musicPercent}%</span>
                </div>
                <p className="font-jersey text-xs text-[#9A9AB5] uppercase leading-none m-0">
                  Controls background music where available.
                </p>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicVolume}
                  onChange={(e) => onMusicVolumeChange(parseFloat(e.target.value))}
                  aria-label="Music Volume"
                  aria-valuemin={0}
                  aria-valuemax={1}
                  aria-valuenow={musicVolume}
                  aria-valuetext={`${musicPercent}%`}
                  className="w-full h-3 bg-[#222744] border border-[#2E3150] appearance-none cursor-pointer accent-[#F6B73C] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F6B73C] mt-1"
                />
              </div>

              {/* Row 3: Sound Effects Volume Slider */}
              <div className="bg-[#15182A] border border-[#2E3150] p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between font-jersey uppercase text-xs">
                  <span className="text-[#F3EBD8] text-sm">SOUND EFFECTS VOLUME</span>
                  <span className="text-[#54D6D9] font-bold text-sm">{sfxPercent}%</span>
                </div>
                <p className="font-jersey text-xs text-[#9A9AB5] uppercase leading-none m-0">
                  Controls interface and gameplay sound effects.
                </p>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={sfxVolume}
                  onChange={(e) => onSfxVolumeChange(parseFloat(e.target.value))}
                  aria-label="Sound Effects Volume"
                  aria-valuemin={0}
                  aria-valuemax={1}
                  aria-valuenow={sfxVolume}
                  aria-valuetext={`${sfxPercent}%`}
                  className="w-full h-3 bg-[#222744] border border-[#2E3150] appearance-none cursor-pointer accent-[#F6B73C] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F6B73C] mt-1"
                />
              </div>
            </div>

            {/* ACCESSIBILITY GROUP */}
            <div className="bg-[#0B0D18] border-2 border-[#2E3150] p-3.5 flex flex-col gap-3">
              <div className="flex flex-col">
                <h3 className="font-jersey text-lg text-[#D95F9A] uppercase tracking-wide flex items-center gap-1.5 leading-none m-0">
                  <Eye className="w-4 h-4 shrink-0 text-[#D95F9A]" />
                  <span>ACCESSIBILITY</span>
                </h3>
                <p className="font-jersey text-xs text-[#9A9AB5] uppercase mt-1 mb-0 leading-tight">
                  Visual overrides for photosensitivity and comfort.
                </p>
              </div>

              {/* Row 1: Reduce Flashing */}
              <div className="bg-[#15182A] border border-[#2E3150] p-3 flex items-center justify-between gap-3">
                <div className="flex flex-col min-w-0">
                  <span className="font-jersey text-base text-[#F3EBD8] uppercase leading-none">
                    REDUCE FLASHING
                  </span>
                  <span className="font-jersey text-xs text-[#9A9AB5] uppercase mt-1 leading-tight">
                    Reduces decorative flashes and rapid visual effects without changing game outcomes.
                  </span>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={reduceFlashing}
                  aria-label="Reduce Flashing"
                  onClick={() => onReduceFlashingChange(!reduceFlashing)}
                  className={`relative inline-flex items-center h-8 w-20 px-1 border-2 border-[#2E3150] transition-colors cursor-pointer select-none shrink-0 ${
                    reduceFlashing ? 'bg-[#54D6D9]' : 'bg-[#222744]'
                  }`}
                  style={{
                    clipPath:
                      'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
                  }}
                >
                  <span
                    className={`font-jersey text-xs uppercase ${
                      reduceFlashing ? 'text-black font-bold ml-1' : 'text-[#63657A] ml-auto mr-1'
                    }`}
                  >
                    {reduceFlashing ? 'ON' : 'OFF'}
                  </span>
                  <span
                    className={`absolute top-0.5 w-6 h-6 bg-[#0B0D18] border border-[#2E3150] transition-all ${
                      reduceFlashing ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </CasinoPanel>
      </div>
    </div>
  );
};
