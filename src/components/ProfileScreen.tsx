/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from '../store';
import { PixelPanel, PixelButton, PixelInput, PixelSlider } from './PixelUI';
import { avatars, PixelAvatar } from '../lib/avatars';
import { User, Volume2, VolumeX, Shield, Award, LogOut, Landmark } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    profile,
    audioMuted,
    musicVolume,
    sfxVolume,
    updateProfileName,
    updateAvatar,
    toggleMute,
    setMusicVolume,
    setSfxVolume,
    logout,
    triggerToast,
    transactionLog,
    lifetimeWinnings,
    lifetimeLosses,
  } = useStore();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProfileName(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="border-3 border-[#ff9f00] bg-[#111111] p-4 text-center">
        <h1 className="text-4xl font-jersey text-[#ff9f00] tracking-widest uppercase m-0">
          Gamer Settings &amp; Dashboard
        </h1>
        <p className="font-jersey text-md text-[#3ff7ff] tracking-wide uppercase m-0 mt-1">
          Adjust sound synthesizers, change nickname, and view profile statistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Player Card & Avatars */}
        <div className="md:col-span-6 space-y-6">
          <PixelPanel
            title="Player Profile"
            subtitle="View stats and update nickname"
            headerAccent="gold"
            icon={<User className="w-5 h-5 text-black" />}
          >
            <div className="space-y-6">
              {/* Profile Image Highlight Frame */}
              <div className="flex items-center gap-4 border-2 border-[#5a5a72] p-3 bg-black">
                <PixelAvatar avatarId={profile.avatarId} googlePicture={profile.googlePicture} size={64} />
                <div>
                  <h3 className="text-2xl font-jersey text-white leading-none uppercase">{profile.name || 'GUEST PLAYER'}</h3>
                  <p className="text-xs font-jersey text-[#3ff7ff] uppercase mt-1 leading-none">
                    {profile.googleEmail ? `VERIFIED: ${profile.googleEmail}` : 'LOCAL CABINET ACCOUNT'}
                  </p>
                </div>
              </div>

              {/* Nickname Input */}
              <PixelInput
                label="Edit Nickname"
                type="text"
                maxLength={12}
                value={profile.name}
                onChange={handleNameChange}
              />

              {/* Character Avatars Selection */}
              <div>
                <label className="block text-xl font-jersey text-[#ff9f00] mb-2 uppercase">
                  Switch Active Champion
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {avatars.map((av) => {
                    const isSelected = profile.avatarId === av.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          updateAvatar(av.id);
                          triggerToast(`CHANGED CHAMPION TO ${av.name}!`, 'info');
                        }}
                        className={`p-1.5 border-2 text-center font-jersey text-md cursor-pointer uppercase ${
                          isSelected 
                            ? 'bg-[#111111] border-[#ff9f00] text-[#ff9f00]' 
                            : 'bg-black border-[#e8e8e8] text-[#5a5a72] hover:text-[#e8e8e8]'
                        }`}
                      >
                        {av.name.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Enhanced Stats Panel with Lifetime Statistics as per Section 5.2 & 5.3 */}
              <div className="border-2 border-[#5a5a72] p-3 bg-black">
                <div className="flex justify-between items-center text-lg font-jersey uppercase text-[#5a5a72]">
                  <span>ACCOUNT TIER</span>
                  <span className="text-[#3ff7ff] flex items-center gap-1">
                    <Shield className="w-4 h-4" /> RETRO VIP
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-jersey uppercase text-[#5a5a72] mt-1">
                  <span>STREAK RECORD</span>
                  <span className="text-[#3fff6e] flex items-center gap-1">
                    <Award className="w-4 h-4" /> {profile.dailyStreak} DAYS
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-jersey uppercase text-[#5a5a72] mt-1 border-b border-[#5a5a72]/20 pb-1 mb-1">
                  <span>WALLET STATUS</span>
                  <span className="text-[#ff9f00]">
                    ${profile.chips.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-jersey uppercase text-[#5a5a72] mt-1">
                  <span>LIFETIME WINNINGS</span>
                  <span className="text-[#3fff6e]">
                    +${(lifetimeWinnings || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-jersey uppercase text-[#5a5a72] mt-1">
                  <span>LIFETIME LOSSES</span>
                  <span className="text-[#ff3f3f]">
                    -${(lifetimeLosses || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </PixelPanel>
        </div>

        {/* Right Column: Audio Control Console */}
        <div className="md:col-span-6 space-y-6">
          <PixelPanel
            title="Audio Synthesizers"
            subtitle="Customize chiptune generators and clicks"
            headerAccent="cyan"
            icon={audioMuted ? <VolumeX className="w-5 h-5 text-black" /> : <Volume2 className="w-5 h-5 text-black" />}
          >
            <div className="space-y-6">
              {/* Mute Button Card */}
              <div className="border-2 border-[#e8e8e8] p-3 bg-[#111111] flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-jersey uppercase text-white leading-none">MASTER SOUND SWITCH</h3>
                  <p className="text-xs font-jersey text-[#5a5a72] uppercase mt-1 leading-none">
                    Mute all synthesized square &amp; triangle waves
                  </p>
                </div>
                <PixelButton
                  variant={audioMuted ? 'red' : 'green'}
                  onClick={toggleMute}
                  chamfer={6}
                >
                  {audioMuted ? 'MUTED' : 'ACTIVE'}
                </PixelButton>
              </div>

              {/* Music Volume Slider */}
              <PixelSlider
                label="Chiptune Music Volume"
                value={Math.round(musicVolume * 100)}
                onChange={(v) => setMusicVolume(v / 100)}
              />

              {/* SFX Volume Slider */}
              <PixelSlider
                label="Sound Effects Volume"
                value={Math.round(sfxVolume * 100)}
                onChange={(v) => setSfxVolume(v / 100)}
              />

              {/* Synthesizer Specs List (Section 3 aesthetic) */}
              <div className="p-3 bg-black border-2 border-[#5a5a72]">
                <h4 className="text-lg font-jersey text-[#ff9f00] uppercase mb-1">SYNTH SPECIFICATIONS</h4>
                <div className="grid grid-cols-2 gap-1 text-xs font-jersey text-[#5a5a72] uppercase">
                  <span>oscillator 1: triangle</span>
                  <span>oscillator 2: square</span>
                  <span>perc: noise burst</span>
                  <span>filters: hi-pass</span>
                </div>
              </div>
            </div>
          </PixelPanel>
        </div>
      </div>

      {/* Transaction History styled like an old arcade high-score list */}
      <PixelPanel
        title="★ TRANSACTION ARCHIVES (HIGH SCORE STYLE) ★"
        subtitle="Historical play-chip transaction history"
        headerAccent="pink"
        icon={<Landmark className="w-5 h-5 text-black" />}
      >
        <div className="bg-black border-2 border-[#5a5a72] p-4 font-mono text-sm uppercase">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-2 border-b-2 border-[#5a5a72] pb-2 font-jersey text-lg text-[#ff9f00] tracking-wide">
            <span className="col-span-3 text-left">TIMESTAMP</span>
            <span className="col-span-4 text-left">TRANSACTION SOURCE</span>
            <span className="col-span-2 text-right">DELTA CHIPS</span>
            <span className="col-span-3 text-right">BALANCE AFTER</span>
          </div>
          
          {/* List */}
          <div className="max-h-64 overflow-y-auto mt-2 divide-y divide-[#5a5a72]/30 space-y-1">
            {transactionLog && transactionLog.length > 0 ? (
              [...transactionLog].reverse().map((tx, idx) => {
                const date = new Date(tx.timestamp);
                const timeStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                const isPositive = tx.amount >= 0;
                
                return (
                  <div key={tx.timestamp + '_' + idx} className="grid grid-cols-12 gap-2 pt-1 pb-1 font-jersey text-md items-center tracking-wider text-[#e8e8e8]">
                    <span className="col-span-3 text-left text-xs font-mono text-[#5a5a72]">{timeStr}</span>
                    <span className="col-span-4 text-left truncate text-white">{tx.source}</span>
                    <span className={`col-span-2 text-right ${isPositive ? 'text-[#3fff6e]' : 'text-[#ff3f3f]'}`}>
                      {isPositive ? '+' : ''}${tx.amount.toFixed(2)}
                    </span>
                    <span className="col-span-3 text-right text-[#ff9f00]">
                      ${tx.balanceAfter.toFixed(2)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 font-jersey text-lg text-[#5a5a72]">
                [ NO TRANSACTION LOGS RECORDED - PLAY TO INITIATE ]
              </div>
            )}
          </div>
        </div>
      </PixelPanel>

      {/* Logout Row */}
      <div className="flex justify-end pt-2">
        <PixelButton 
          variant="red" 
          onClick={() => {
            if (confirm('RESET ACCOUNT AND RETURN TO TITLE? ALL CHIPS WILL BE CLEARED.')) {
              logout();
            }
          }}
          soundType="loss"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            <span>RESET CASINO CHIPS &amp; LOGOUT</span>
          </div>
        </PixelButton>
      </div>
    </div>
  );
};
