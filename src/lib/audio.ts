/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private musicVolumeNode: GainNode | null = null;
  private sfxVolumeNode: GainNode | null = null;
  private masterVolumeNode: GainNode | null = null;
  private isMuted: boolean = false;
  private musicVolumeValue: number = 0.5;
  private sfxVolumeValue: number = 0.6;
  
  // Looping background music variables
  private isMusicPlaying: boolean = false;
  private musicIntervalId: any = null;
  private musicStep: number = 0;
  private currentTrackType: 'login' | 'lobby' | 'poker' | 'arcade' | null = null;

  // Simple happy retro 8-bit melodies and basslines for different tracks
  private tracks: Record<'login' | 'lobby' | 'poker' | 'arcade', { tempo: number; oscillatorType: OscillatorType; melody: (number | null)[]; bassline: (number | null)[] }> = {
    login: {
      tempo: 90, // Atmospheric, slower
      oscillatorType: 'sine', // Soft and spacey
      melody: [
        57, null, 60, null, 64, null, 60, null,
        55, null, 59, null, 62, null, 59, null,
        53, null, 57, null, 60, null, 57, null,
        55, null, 59, null, 62, null, 67, null
      ],
      bassline: [
        45, null, 45, null, 45, null, 45, null,
        43, null, 43, null, 43, null, 43, null,
        41, null, 41, null, 41, null, 41, null,
        43, null, 43, null, 43, null, 47, null
      ]
    },
    lobby: {
      tempo: 130, // Upbeat casino floor
      oscillatorType: 'triangle', // Bouncy but sweet
      melody: [
        60, null, 64, 67, 72, 67, 64, null,
        62, null, 65, 69, 74, 69, 65, null,
        64, null, 67, 71, 76, 71, 67, null,
        67, 69, 71, 72, 74, 76, 79, null
      ],
      bassline: [
        48, 48, 48, 48, 52, 52, 52, 52,
        50, 50, 50, 50, 53, 53, 53, 53,
        52, 52, 52, 52, 55, 55, 55, 55,
        55, 55, 55, 55, 48, 48, 48, null
      ]
    },
    poker: {
      tempo: 100, // Jazzy, lounge saloon vibe
      oscillatorType: 'sine',
      melody: [
        57, null, 60, 64, 67, 64, 60, null,
        53, null, 57, 60, 65, 60, 57, null,
        55, null, 59, 62, 67, 62, 59, null,
        57, null, 60, 64, 69, 64, 60, null
      ],
      bassline: [
        45, 45, null, 45, 41, 41, null, 41,
        43, 43, null, 43, 45, 45, null, null,
        45, 45, null, 45, 41, 41, null, 41,
        43, 43, null, 43, 47, 47, 48, null
      ]
    },
    arcade: {
      tempo: 140, // Energetic gameplay drive
      oscillatorType: 'triangle',
      melody: [
        60, 64, 67, 72, 74, 72, 67, 64,
        65, 69, 72, 77, 79, 77, 72, 69,
        67, 71, 74, 79, 81, 79, 74, 71,
        72, null, 72, null, 72, 74, 76, null
      ],
      bassline: [
        48, 48, 52, 52, 53, 53, 57, 57,
        50, 50, 53, 53, 55, 55, 59, 59,
        52, 52, 55, 55, 57, 57, 60, 60,
        53, 53, 55, 55, 48, 48, 48, null
      ]
    }
  };

  constructor() {
    try {
      const saved = localStorage.getItem('8bit_casino_save');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.isMuted = parsed.audioMuted ?? false;
        this.musicVolumeValue = parsed.musicVolume ?? 0.5;
        this.sfxVolumeValue = parsed.sfxVolume ?? 0.6;
      }
    } catch (e) {
      console.warn("Could not load volumes from localStorage", e);
    }
  }

  private init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();
      
      this.masterVolumeNode = this.ctx.createGain();
      this.musicVolumeNode = this.ctx.createGain();
      this.sfxVolumeNode = this.ctx.createGain();
      
      this.musicVolumeNode.connect(this.masterVolumeNode);
      this.sfxVolumeNode.connect(this.masterVolumeNode);
      this.masterVolumeNode.connect(this.ctx.destination);
      
      this.updateVolumes();
    } catch (e) {
      console.warn("Audio Context could not be initialized", e);
    }
  }

  private resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    this.updateVolumes();
  }

  public setMusicVolume(volume: number) {
    this.musicVolumeValue = volume;
    this.updateVolumes();
  }

  public setSfxVolume(volume: number) {
    this.sfxVolumeValue = volume;
    this.updateVolumes();
  }

  private updateVolumes() {
    this.init();
    if (!this.masterVolumeNode || !this.musicVolumeNode || !this.sfxVolumeNode) return;
    
    const targetMaster = this.isMuted ? 0 : 1;
    this.masterVolumeNode.gain.setValueAtTime(targetMaster, this.ctx!.currentTime);
    this.musicVolumeNode.gain.setValueAtTime(this.musicVolumeValue * 0.4, this.ctx!.currentTime); // damp music a bit
    this.sfxVolumeNode.gain.setValueAtTime(this.sfxVolumeValue, this.ctx!.currentTime);
  }

  private midiToFreq(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  // Play a simple synthesized chiptune sound effect
  public playBeep(freqStart: number, freqEnd: number, duration: number, type: OscillatorType = 'square') {
    this.resume();
    if (!this.ctx || !this.sfxVolumeNode) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, this.ctx.currentTime);
    if (freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(freqEnd, this.ctx.currentTime + duration);
    }

    gainNode.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.sfxVolumeNode);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // --- Retro Sound Effects ---
  
  public playClick() {
    this.playBeep(800, 150, 0.08, 'square');
  }

  public playCoin() {
    this.playCoinGain();
  }

  public playCoinGain() {
    this.resume();
    if (!this.ctx || !this.sfxVolumeNode) return;
    
    // Classic sweet dual-tone retro coin sound
    const now = this.ctx.currentTime;
    
    const playTone = (freq: number, startOffset: number, duration: number) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + startOffset);
      gainNode.gain.setValueAtTime(0.12, now + startOffset);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);
      osc.connect(gainNode);
      gainNode.connect(this.sfxVolumeNode!);
      osc.start(now + startOffset);
      osc.stop(now + startOffset + duration);
    };

    playTone(987.77, 0, 0.08); // B5
    playTone(1318.51, 0.08, 0.25); // E6
  }

  public playCoinLoss() {
    this.playBeep(400, 100, 0.15, 'triangle');
  }

  public playCardDeal() {
    this.resume();
    if (!this.ctx || !this.sfxVolumeNode) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(this.sfxVolumeNode);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playCardFlip() {
    this.resume();
    if (!this.ctx || !this.sfxVolumeNode) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.sfxVolumeNode);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playChipStack() {
    this.resume();
    if (!this.ctx || !this.sfxVolumeNode) return;
    const now = this.ctx.currentTime;
    const playTick = (time: number) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, time);
      osc.frequency.exponentialRampToValueAtTime(120, time + 0.04);
      gain.gain.setValueAtTime(0.1, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
      osc.connect(gain);
      gain.connect(this.sfxVolumeNode!);
      osc.start(time);
      osc.stop(time + 0.04);
    };
    playTick(now);
    playTick(now + 0.05);
  }

  public playWin() {
    this.playWinMedium();
  }

  public playWinSmall() {
    this.resume();
    if (!this.ctx || !this.sfxVolumeNode) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gainNode.gain.setValueAtTime(0.12, now + idx * 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.15);
      osc.connect(gainNode);
      gainNode.connect(this.sfxVolumeNode!);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.15);
    });
  }

  public playWinMedium() {
    this.resume();
    if (!this.ctx || !this.sfxVolumeNode) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gainNode.gain.setValueAtTime(0.12, now + idx * 0.06);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
      osc.connect(gainNode);
      gainNode.connect(this.sfxVolumeNode!);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.25);
    });
  }

  public playWinJackpot() {
    this.playJackpot();
  }

  public playJackpot() {
    this.resume();
    if (!this.ctx || !this.sfxVolumeNode) return;

    const now = this.ctx.currentTime;
    // An epic rapid cascading 8-bit victory arpeggio
    const notes = [
      523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00,
      1318.51, 1567.98, 2093.00, 2637.02, 3135.96, 4186.01
    ];
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();
      osc.type = 'square'; // Classic retro square wave for piercing jackpots!
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gainNode.gain.setValueAtTime(0.15, now + idx * 0.06);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
      osc.connect(gainNode);
      gainNode.connect(this.sfxVolumeNode!);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.25);
    });
  }

  public playLoss() {
    this.resume();
    if (!this.ctx || !this.sfxVolumeNode) return;

    const now = this.ctx.currentTime;
    // Descending retro buzz
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.4);
    
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.linearRampToValueAtTime(0.001, now + 0.4);
    
    osc.connect(gainNode);
    gainNode.connect(this.sfxVolumeNode);
    
    osc.start(now);
    osc.stop(now + 0.4);
  }

  public playCountdownTick() {
    this.playBeep(440, 440, 0.05, 'triangle');
  }

  public playModalOpen() {
    this.resume();
    if (!this.ctx || !this.sfxVolumeNode) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.sfxVolumeNode);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playModalClose() {
    this.resume();
    if (!this.ctx || !this.sfxVolumeNode) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.sfxVolumeNode);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // --- Background Music Loop Engine ---

  public startMusic(track: 'login' | 'lobby' | 'poker' | 'arcade' = 'lobby') {
    this.resume();
    if (this.isMusicPlaying && this.currentTrackType === track) return;
    
    this.stopMusic();
    this.isMusicPlaying = true;
    this.currentTrackType = track;
    this.musicStep = 0;
    
    const config = this.tracks[track];
    const stepDuration = 60 / config.tempo / 2; // eighth notes
    
    const playStep = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicVolumeNode) return;
      if (this.currentTrackType !== track) return; // Guard against stale timeouts
      
      const now = this.ctx.currentTime;
      
      // Melody note
      const melNote = config.melody[this.musicStep % config.melody.length];
      if (melNote !== null) {
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        osc.type = config.oscillatorType;
        osc.frequency.setValueAtTime(this.midiToFreq(melNote), now);
        
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.95);
        
        osc.connect(gainNode);
        gainNode.connect(this.musicVolumeNode);
        osc.start(now);
        osc.stop(now + stepDuration * 0.95);
      }

      // Bass note
      const bassNote = config.bassline[this.musicStep % config.bassline.length];
      if (bassNote !== null) {
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(this.midiToFreq(bassNote), now);
        
        gainNode.gain.setValueAtTime(0.07, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.85);
        
        osc.connect(gainNode);
        gainNode.connect(this.musicVolumeNode);
        osc.start(now);
        osc.stop(now + stepDuration * 0.85);
      }

      // Quick retro high-hat noise pulse on beat (every 4 steps)
      if (this.musicStep % 4 === 2) {
        const bufferSize = this.ctx.sampleRate * 0.04; // short burst
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(7000, now);
        
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.015, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.musicVolumeNode);
        
        noise.start(now);
      }

      this.musicStep++;
      
      // Schedule next step
      this.musicIntervalId = setTimeout(playStep, stepDuration * 1000);
    };

    playStep();
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    this.currentTrackType = null;
    if (this.musicIntervalId) {
      clearTimeout(this.musicIntervalId);
      this.musicIntervalId = null;
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getMusicVolume(): number {
    return this.musicVolumeValue;
  }

  public getSfxVolume(): number {
    return this.sfxVolumeValue;
  }
}

export const audio = new AudioEngine();
