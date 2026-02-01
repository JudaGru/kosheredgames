import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDeviceType } from '@/hooks/useDeviceType';

// Piano key definitions
interface PianoKey {
  note: string;
  octave: number;
  isBlack: boolean;
  frequency: number;
}

// Generate all 88 piano keys
const generatePianoKeys = (): PianoKey[] => {
  const keys: PianoKey[] = [];
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const blackNotes = ['C#', 'D#', 'F#', 'G#', 'A#'];

  // First add A0, A#0, B0
  const startNotes = ['A', 'A#', 'B'];
  startNotes.forEach((note) => {
    const isBlack = blackNotes.includes(note);
    const semitone = notes.indexOf(note) - 9;
    const frequency = 27.5 * Math.pow(2, semitone / 12);
    keys.push({ note, octave: 0, isBlack, frequency });
  });

  // Then add C1 through B7
  for (let octave = 1; octave <= 7; octave++) {
    notes.forEach((note) => {
      const isBlack = blackNotes.includes(note);
      const semitone = (octave - 1) * 12 + notes.indexOf(note) + 3;
      const frequency = 27.5 * Math.pow(2, semitone / 12);
      keys.push({ note, octave, isBlack, frequency });
    });
  }

  // Finally add C8
  keys.push({ note: 'C', octave: 8, isBlack: false, frequency: 4186.01 });

  return keys;
};

// Keyboard mappings
const KEYBOARD_MAP: Record<string, string> = {
  'a': 'C3', 'w': 'C#3', 's': 'D3', 'e': 'D#3', 'd': 'E3',
  'f': 'F3', 't': 'F#3', 'g': 'G3', 'y': 'G#3', 'h': 'A3',
  'u': 'A#3', 'j': 'B3',
  'k': 'C4', 'o': 'C#4', 'l': 'D4', 'p': 'D#4', ';': 'E4',
  "'": 'F4', ']': 'F#4',
  'z': 'C3', 'x': 'D3', 'c': 'E3', 'v': 'F3', 'b': 'G3', 'n': 'A3', 'm': 'B3',
  ',': 'C4', '.': 'D4', '/': 'E4',
};

const ALL_PIANO_KEYS = generatePianoKeys();

// Sound presets - Grand Piano is now the star
type SoundPreset = 'grand' | 'bright' | 'warm' | 'intimate' | 'concert';

const SOUND_PRESETS: { id: SoundPreset; name: string }[] = [
  { id: 'grand', name: 'Grand Piano' },
  { id: 'concert', name: 'Concert Hall' },
  { id: 'intimate', name: 'Intimate' },
  { id: 'bright', name: 'Bright' },
  { id: 'warm', name: 'Warm' },
];

// Steinway-inspired Grand Piano Synthesizer
// Models the physics of a concert grand piano with:
// - Multiple strings per note (2-3 strings in unison, slightly detuned)
// - Hammer strike transients
// - Sympathetic string resonance
// - Register-dependent timbre (bass vs treble)
// - Natural harmonic series
// - Damper pedal simulation
class RealisticPianoSynth {
  private audioContext: AudioContext | null = null;
  private activeNotes: Map<string, {
    oscillators: OscillatorNode[];
    gainNodes: GainNode[];
    mainGain: GainNode;
    filterNode?: BiquadFilterNode;
    releaseTimeout?: NodeJS.Timeout;
  }> = new Map();
  private masterGain: GainNode | null = null;
  private dryGain: GainNode | null = null;
  private wetGain: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private masterCompressor: DynamicsCompressorNode | null = null;
  private isInitialized = false;
  private isInitializing = false;
  private volumeMultiplier = 0.6;
  private reverbAmount = 1.0;
  private currentPreset: SoundPreset = 'grand';

  private ensureInitialized(): boolean {
    if (this.isInitialized) return true;
    if (this.isInitializing) return false;
    if (Platform.OS !== 'web') return false;

    this.isInitializing = true;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Web Audio API not supported');
        return false;
      }

      this.audioContext = new AudioContextClass();

      // Master compressor for smooth dynamics
      this.masterCompressor = this.audioContext.createDynamicsCompressor();
      this.masterCompressor.threshold.value = -24;
      this.masterCompressor.knee.value = 30;
      this.masterCompressor.ratio.value = 4;
      this.masterCompressor.attack.value = 0.003;
      this.masterCompressor.release.value = 0.25;

      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.volumeMultiplier;

      this.dryGain = this.audioContext.createGain();
      this.dryGain.gain.value = 1;

      this.dryGain.connect(this.masterCompressor);
      this.masterCompressor.connect(this.masterGain);
      this.masterGain.connect(this.audioContext.destination);

      this.isInitialized = true;
      this.isInitializing = false;

      setTimeout(() => this.initConcertHallReverb(), 50);

      return true;
    } catch (e) {
      console.warn('Web Audio not available:', e);
      this.isInitializing = false;
      return false;
    }
  }

  private initConcertHallReverb() {
    if (!this.audioContext || !this.masterCompressor) return;

    try {
      this.reverb = this.audioContext.createConvolver();
      this.createConcertHallImpulse();

      this.wetGain = this.audioContext.createGain();
      this.updateReverbMix();

      this.reverb.connect(this.wetGain);
      this.wetGain.connect(this.masterCompressor);
    } catch (e) {
      console.warn('Reverb init failed:', e);
    }
  }

  async init() {
    // Lazy initialization on first touch
  }

  private updateReverbMix() {
    if (this.dryGain && this.wetGain) {
      // More natural reverb blend for grand piano
      this.dryGain.gain.value = 1 - this.reverbAmount * 0.25;
      this.wetGain.gain.value = this.reverbAmount * 0.5;
    }
  }

  // Concert hall impulse response - rich, spacious reverb
  private createConcertHallImpulse() {
    if (!this.audioContext || !this.reverb) return;

    const sampleRate = this.audioContext.sampleRate;
    const length = Math.floor(sampleRate * 2.5); // 2.5 second tail
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        // Multi-stage decay for realistic hall
        const earlyDecay = Math.exp(-i / (sampleRate * 0.1));
        const lateDecay = Math.exp(-i / (sampleRate * 0.8));
        const combined = earlyDecay * 0.3 + lateDecay * 0.7;

        // Add some modulation for natural feel
        const modulation = 1 + Math.sin(i * 0.0001) * 0.1;
        data[i] = (Math.random() * 2 - 1) * combined * modulation * 0.4;
      }
    }

    this.reverb.buffer = impulse;
  }

  setPreset(preset: SoundPreset) {
    this.currentPreset = preset;
  }

  playNote(frequency: number, noteId: string, velocity: number = 0.8) {
    if (!this.isInitialized) {
      if (!this.ensureInitialized()) return;
    }

    if (!this.audioContext || !this.masterGain) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.stopNoteImmediate(noteId);

    const now = this.audioContext.currentTime;
    const oscillators: OscillatorNode[] = [];
    const gainNodes: GainNode[] = [];

    const mainGain = this.audioContext.createGain();

    // Low-pass filter to shape the tone (like piano soundboard)
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 1;

    switch (this.currentPreset) {
      case 'grand':
        this.createGrandPianoSound(frequency, velocity, now, oscillators, gainNodes, mainGain, filter);
        break;
      case 'concert':
        this.createConcertPianoSound(frequency, velocity, now, oscillators, gainNodes, mainGain, filter);
        break;
      case 'intimate':
        this.createIntimatePianoSound(frequency, velocity, now, oscillators, gainNodes, mainGain, filter);
        break;
      case 'bright':
        this.createBrightPianoSound(frequency, velocity, now, oscillators, gainNodes, mainGain, filter);
        break;
      case 'warm':
        this.createWarmPianoSound(frequency, velocity, now, oscillators, gainNodes, mainGain, filter);
        break;
    }

    filter.connect(mainGain);
    mainGain.connect(this.dryGain!);
    if (this.reverb) {
      mainGain.connect(this.reverb);
    }

    oscillators.forEach(osc => {
      osc.start(now);
      osc.stop(now + 12); // Longer sustain for grand piano
    });

    this.activeNotes.set(noteId, {
      oscillators,
      gainNodes,
      mainGain,
      filterNode: filter,
    });
  }

  // Steinway Model D inspired grand piano sound
  private createGrandPianoSound(freq: number, vel: number, now: number, oscs: OscillatorNode[], gains: GainNode[], mainGain: GainNode, filter: BiquadFilterNode) {
    const ctx = this.audioContext!;

    // Determine register for different timbral characteristics
    const isLowBass = freq < 100;
    const isBass = freq < 250;
    const isMid = freq >= 250 && freq < 1000;
    const isTreble = freq >= 1000;

    // Number of strings (bass notes have 1-2, mid/treble have 3)
    const numStrings = isLowBass ? 1 : isBass ? 2 : 3;

    // Slight detuning between strings (in cents) - creates chorus/richness
    const detuning = isBass ? 1.5 : 0.8;

    // Filter frequency - higher notes are brighter
    const filterFreq = Math.min(freq * 8, 12000);
    filter.frequency.setValueAtTime(filterFreq * 1.5, now);
    filter.frequency.exponentialRampToValueAtTime(filterFreq * 0.7, now + 0.1);
    filter.frequency.exponentialRampToValueAtTime(filterFreq * 0.4, now + 2);

    // === FUNDAMENTAL + STRINGS ===
    for (let s = 0; s < numStrings; s++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Custom waveform for piano-like timbre
      const real = new Float32Array([0, 1, 0.5, 0.33, 0.25, 0.2, 0.16, 0.14, 0.12, 0.1]);
      const imag = new Float32Array(real.length);
      const wave = ctx.createPeriodicWave(real, imag);
      osc.setPeriodicWave(wave);

      // Detune strings slightly for richness
      const detuneAmount = (s - (numStrings - 1) / 2) * detuning;
      osc.detune.value = detuneAmount;
      osc.frequency.value = freq;

      const stringVol = vel * 0.35 / numStrings;
      gain.gain.value = stringVol;

      osc.connect(gain);
      gain.connect(filter);
      oscs.push(osc);
      gains.push(gain);
    }

    // === HARMONICS (piano has strong even and odd harmonics) ===
    const harmonics = [
      { ratio: 2, amp: 0.4 },     // Octave
      { ratio: 3, amp: 0.25 },    // Fifth
      { ratio: 4, amp: 0.18 },    // 2nd octave
      { ratio: 5, amp: 0.12 },    // Major 3rd
      { ratio: 6, amp: 0.09 },    // 5th + octave
      { ratio: 7, amp: 0.06 },    // Minor 7th
      { ratio: 8, amp: 0.04 },    // 3rd octave
    ];

    // Reduce harmonics for high notes (they're naturally brighter)
    const harmonicMultiplier = isTreble ? 0.4 : isMid ? 0.7 : 1.0;

    harmonics.forEach(h => {
      if (freq * h.ratio > 10000) return; // Skip if too high

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq * h.ratio;

      // Slight random detuning for natural feel
      osc.detune.value = (Math.random() - 0.5) * 2;

      const harmVol = vel * h.amp * 0.25 * harmonicMultiplier;
      gain.gain.value = harmVol;

      osc.connect(gain);
      gain.connect(filter);
      oscs.push(osc);
      gains.push(gain);
    });

    // === HAMMER ATTACK TRANSIENT ===
    const attackOsc = ctx.createOscillator();
    const attackGain = ctx.createGain();
    const attackFilter = ctx.createBiquadFilter();

    attackFilter.type = 'bandpass';
    attackFilter.frequency.value = freq * 3;
    attackFilter.Q.value = 2;

    attackOsc.type = 'sawtooth';
    attackOsc.frequency.value = freq * 1.5;

    // Very short, percussive attack
    attackGain.gain.setValueAtTime(vel * 0.15, now);
    attackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    attackOsc.connect(attackFilter);
    attackFilter.connect(attackGain);
    attackGain.connect(filter);
    oscs.push(attackOsc);
    gains.push(attackGain);

    // === SOUNDBOARD RESONANCE (low frequency body resonance) ===
    if (isBass || isMid) {
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();

      bodyOsc.type = 'sine';
      bodyOsc.frequency.value = Math.max(freq * 0.5, 40);

      bodyGain.gain.setValueAtTime(vel * 0.08, now);
      bodyGain.gain.exponentialRampToValueAtTime(vel * 0.04, now + 0.3);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 3);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(filter);
      oscs.push(bodyOsc);
      gains.push(bodyGain);
    }

    // === ENVELOPE (realistic piano decay) ===
    // Bass notes sustain longer, treble decays faster
    const attackTime = 0.005;
    const decayTime = isBass ? 0.4 : isMid ? 0.25 : 0.15;
    const sustainLevel = isBass ? 0.5 : isMid ? 0.4 : 0.3;
    const decayTotal = isBass ? 8 : isMid ? 5 : 3;

    mainGain.gain.setValueAtTime(0.001, now);
    mainGain.gain.exponentialRampToValueAtTime(vel * 0.8, now + attackTime);
    mainGain.gain.exponentialRampToValueAtTime(vel * sustainLevel, now + decayTime);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + decayTotal);
  }

  // Concert grand - extra sparkle and projection
  private createConcertPianoSound(freq: number, vel: number, now: number, oscs: OscillatorNode[], gains: GainNode[], mainGain: GainNode, filter: BiquadFilterNode) {
    this.createGrandPianoSound(freq, vel, now, oscs, gains, mainGain, filter);

    // Add extra brilliance for concert projection
    const ctx = this.audioContext!;
    const brillianceOsc = ctx.createOscillator();
    const brillianceGain = ctx.createGain();

    brillianceOsc.type = 'sine';
    brillianceOsc.frequency.value = freq * 4;

    brillianceGain.gain.setValueAtTime(vel * 0.06, now);
    brillianceGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    brillianceOsc.connect(brillianceGain);
    brillianceGain.connect(filter);
    oscs.push(brillianceOsc);
    gains.push(brillianceGain);

    // Boost filter for more presence
    filter.frequency.value *= 1.3;
  }

  // Intimate piano - softer, more mellow
  private createIntimatePianoSound(freq: number, vel: number, now: number, oscs: OscillatorNode[], gains: GainNode[], mainGain: GainNode, filter: BiquadFilterNode) {
    const ctx = this.audioContext!;

    // Warmer, softer fundamental
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    const real = new Float32Array([0, 1, 0.6, 0.35, 0.2, 0.1]);
    const imag = new Float32Array(real.length);
    const wave = ctx.createPeriodicWave(real, imag);
    osc1.setPeriodicWave(wave);
    osc1.frequency.value = freq;

    gain1.gain.value = vel * 0.5;
    osc1.connect(gain1);
    gain1.connect(filter);
    oscs.push(osc1);
    gains.push(gain1);

    // Soft second string
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = freq;
    osc2.detune.value = 3;
    gain2.gain.value = vel * 0.3;
    osc2.connect(gain2);
    gain2.connect(filter);
    oscs.push(osc2);
    gains.push(gain2);

    // Gentle harmonics
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.value = freq * 2;
    gain3.gain.value = vel * 0.15;
    osc3.connect(gain3);
    gain3.connect(filter);
    oscs.push(osc3);
    gains.push(gain3);

    // Very soft filter
    filter.frequency.setValueAtTime(freq * 5, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 2, now + 0.5);

    // Gentle envelope
    mainGain.gain.setValueAtTime(0.001, now);
    mainGain.gain.exponentialRampToValueAtTime(vel * 0.6, now + 0.01);
    mainGain.gain.exponentialRampToValueAtTime(vel * 0.35, now + 0.4);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 5);
  }

  // Bright piano - crisp, clear attack
  private createBrightPianoSound(freq: number, vel: number, now: number, oscs: OscillatorNode[], gains: GainNode[], mainGain: GainNode, filter: BiquadFilterNode) {
    const ctx = this.audioContext!;

    // Strong fundamental with overtones
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    const real = new Float32Array([0, 1, 0.7, 0.5, 0.4, 0.3, 0.2, 0.15, 0.1]);
    const imag = new Float32Array(real.length);
    const wave = ctx.createPeriodicWave(real, imag);
    osc1.setPeriodicWave(wave);
    osc1.frequency.value = freq;

    gain1.gain.value = vel * 0.4;
    osc1.connect(gain1);
    gain1.connect(filter);
    oscs.push(osc1);
    gains.push(gain1);

    // Bright harmonics
    [2, 3, 4, 5].forEach((ratio, i) => {
      if (freq * ratio > 12000) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq * ratio;
      gain.gain.value = vel * 0.15 / (i + 1);
      osc.connect(gain);
      gain.connect(filter);
      oscs.push(osc);
      gains.push(gain);
    });

    // Sharp attack
    const attackOsc = ctx.createOscillator();
    const attackGain = ctx.createGain();
    attackOsc.type = 'sawtooth';
    attackOsc.frequency.value = freq * 2;
    attackGain.gain.setValueAtTime(vel * 0.2, now);
    attackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
    attackOsc.connect(attackGain);
    attackGain.connect(filter);
    oscs.push(attackOsc);
    gains.push(attackGain);

    // Bright filter
    filter.frequency.setValueAtTime(freq * 12, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 4, now + 0.5);

    mainGain.gain.setValueAtTime(0.001, now);
    mainGain.gain.exponentialRampToValueAtTime(vel * 0.85, now + 0.003);
    mainGain.gain.exponentialRampToValueAtTime(vel * 0.4, now + 0.2);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);
  }

  // Warm piano - rich bass, mellow treble
  private createWarmPianoSound(freq: number, vel: number, now: number, oscs: OscillatorNode[], gains: GainNode[], mainGain: GainNode, filter: BiquadFilterNode) {
    const ctx = this.audioContext!;

    // Rich fundamental
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.value = freq;
    gain1.gain.value = vel * 0.55;
    osc1.connect(gain1);
    gain1.connect(filter);
    oscs.push(osc1);
    gains.push(gain1);

    // Sub-harmonic warmth
    if (freq > 80) {
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.value = freq / 2;
      subGain.gain.value = vel * 0.12;
      subOsc.connect(subGain);
      subGain.connect(filter);
      oscs.push(subOsc);
      gains.push(subGain);
    }

    // Warm harmonics (emphasize lower partials)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2;
    gain2.gain.value = vel * 0.25;
    osc2.connect(gain2);
    gain2.connect(filter);
    oscs.push(osc2);
    gains.push(gain2);

    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.value = freq * 3;
    gain3.gain.value = vel * 0.1;
    osc3.connect(gain3);
    gain3.connect(filter);
    oscs.push(osc3);
    gains.push(gain3);

    // Warm, rolled-off filter
    filter.frequency.setValueAtTime(freq * 4, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.8);

    // Long, warm envelope
    mainGain.gain.setValueAtTime(0.001, now);
    mainGain.gain.exponentialRampToValueAtTime(vel * 0.7, now + 0.008);
    mainGain.gain.exponentialRampToValueAtTime(vel * 0.45, now + 0.5);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 6);
  }

  releaseNote(noteId: string) {
    const active = this.activeNotes.get(noteId);
    if (!active || !this.audioContext) return;

    const now = this.audioContext.currentTime;
    const releaseTime = 0.5; // Longer release for grand piano

    try {
      active.mainGain.gain.cancelScheduledValues(now);
      const currentValue = Math.max(active.mainGain.gain.value, 0.001);
      active.mainGain.gain.setValueAtTime(currentValue, now);
      active.mainGain.gain.exponentialRampToValueAtTime(0.001, now + releaseTime);

      // Also fade the filter for natural damper effect
      if (active.filterNode) {
        const currentFreq = active.filterNode.frequency.value;
        active.filterNode.frequency.exponentialRampToValueAtTime(
          Math.max(currentFreq * 0.3, 200),
          now + releaseTime * 0.5
        );
      }

      active.releaseTimeout = setTimeout(() => {
        this.stopNoteImmediate(noteId);
      }, releaseTime * 1000 + 100);
    } catch {
      this.stopNoteImmediate(noteId);
    }
  }

  private stopNoteImmediate(noteId: string) {
    const active = this.activeNotes.get(noteId);
    if (!active) return;

    if (active.releaseTimeout) {
      clearTimeout(active.releaseTimeout);
    }

    try {
      active.oscillators.forEach(osc => {
        try { osc.stop(); } catch {}
      });
    } catch {}

    this.activeNotes.delete(noteId);
  }

  setVolume(volume: number) {
    this.volumeMultiplier = volume;
    if (this.masterGain) {
      this.masterGain.gain.value = volume;
    }
  }

  setReverb(amount: number) {
    this.reverbAmount = amount;
    this.updateReverbMix();
  }

  stopAllNotes() {
    this.activeNotes.forEach((_, noteId) => {
      this.stopNoteImmediate(noteId);
    });
  }
}

// Piano Key Component with press animation
interface PianoKeyProps {
  pianoKey: PianoKey;
  isPressed: boolean;
  isHighlighted: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
  whiteKeyWidth: number;
  whiteKeyHeight: number;
  showLabels: boolean;
}

function PianoKeyComponent({
  pianoKey,
  isPressed,
  isHighlighted,
  onPressIn,
  onPressOut,
  whiteKeyWidth,
  whiteKeyHeight,
  showLabels,
}: PianoKeyProps) {
  const isActive = isPressed || isHighlighted;
  const pressAnim = useSharedValue(0);

  // Use instant timing instead of spring to avoid delay
  useEffect(() => {
    pressAnim.value = withTiming(isActive ? 1 : 0, {
      duration: isActive ? 0 : 80, // Instant press, quick release
    });
  }, [isActive]);

  const blackKeyWidth = whiteKeyWidth * 0.6;
  const blackKeyHeight = whiteKeyHeight * 0.6;

  const noteLabel = `${pianoKey.note}${pianoKey.octave}`;
  const keyboardShortcut = Object.entries(KEYBOARD_MAP).find(
    ([, note]) => note === noteLabel
  )?.[0]?.toUpperCase();

  // Animated styles for white key
  const whiteKeyAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      pressAnim.value,
      [0, 1],
      [0, 4],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      pressAnim.value,
      [0, 1],
      [1, 0.98],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateY },
        { scale },
      ],
    };
  });

  // Animated styles for black key
  const blackKeyAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      pressAnim.value,
      [0, 1],
      [0, 3],
      Extrapolation.CLAMP
    );
    const scaleY = interpolate(
      pressAnim.value,
      [0, 1],
      [1, 0.95],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateY },
        { scaleY },
      ],
    };
  });

  if (pianoKey.isBlack) {
    return (
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: blackKeyWidth,
            height: blackKeyHeight,
            marginLeft: -blackKeyWidth / 2,
            zIndex: 2,
          },
          blackKeyAnimatedStyle,
        ]}
      >
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={{
            flex: 1,
            borderRadius: 4,
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            overflow: 'hidden',
          }}
        >
          {/* Black key gradient effect */}
          <View
            style={{
              flex: 1,
              backgroundColor: isHighlighted ? '#6d28d9' : isPressed ? '#2d2d2d' : '#1a1a1a',
              borderWidth: isHighlighted ? 2 : 1,
              borderColor: isHighlighted ? '#a78bfa' : '#000',
              borderRadius: 4,
              borderBottomLeftRadius: 6,
              borderBottomRightRadius: 6,
            }}
          >
            {/* Highlight on top */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '30%',
                backgroundColor: isHighlighted ? 'rgba(167,139,250,0.3)' : isPressed ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              }}
            />
            {/* Labels at bottom */}
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 8 }}>
              {showLabels && (
                <Text style={{ color: '#666', fontSize: 8, fontWeight: '600' }}>
                  {pianoKey.note}
                </Text>
              )}
              {keyboardShortcut && (
                <Text style={{ color: '#555', fontSize: 7, marginTop: 2 }}>
                  {keyboardShortcut}
                </Text>
              )}
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        {
          width: whiteKeyWidth,
          height: whiteKeyHeight,
          marginRight: 2,
        },
        whiteKeyAnimatedStyle,
      ]}
    >
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={{
          flex: 1,
          borderRadius: 6,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          overflow: 'hidden',
        }}
      >
        {/* White key with realistic styling */}
        <View
          style={{
            flex: 1,
            backgroundColor: isHighlighted ? '#ddd6fe' : isPressed ? '#e8e8e8' : '#fafafa',
            borderWidth: isHighlighted ? 2 : 1,
            borderColor: isHighlighted ? '#8b5cf6' : '#ccc',
            borderBottomColor: isHighlighted ? '#7c3aed' : '#999',
            borderRadius: 6,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
          {/* Subtle gradient effect */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '20%',
              backgroundColor: isHighlighted ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.8)',
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
            }}
          />
          {/* Side shadows */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: 'rgba(0,0,0,0.05)',
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: 'rgba(0,0,0,0.03)',
            }}
          />
          {/* Labels at bottom */}
          <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 12 }}>
            {showLabels && (
              <Text style={{ color: '#555', fontSize: 11, fontWeight: '600' }}>
                {pianoKey.note}{pianoKey.octave}
              </Text>
            )}
            {keyboardShortcut && (
              <Text style={{ color: '#999', fontSize: 9, marginTop: 2 }}>
                {keyboardShortcut}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function VirtualPianoScreen() {
  const { width, height } = useWindowDimensions();
  const { isMobile } = useDeviceType();
  const isLandscape = width > height;

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [volume, setVolume] = useState(0.7);
  const [reverb, setReverb] = useState(1.0); // Default 100%
  const [showLabels, setShowLabels] = useState(true);
  const [soundPreset, setSoundPreset] = useState<SoundPreset>('grand');
  const [currentOctave, setCurrentOctave] = useState(4);

  const synthRef = useRef<RealisticPianoSynth | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Initialize synth
  useEffect(() => {
    if (Platform.OS === 'web') {
      synthRef.current = new RealisticPianoSynth();
      synthRef.current.init();
    }
    return () => {
      synthRef.current?.stopAllNotes();
    };
  }, []);

  // Update volume, reverb, and preset
  useEffect(() => {
    synthRef.current?.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    synthRef.current?.setReverb(reverb);
  }, [reverb]);

  useEffect(() => {
    synthRef.current?.setPreset(soundPreset);
  }, [soundPreset]);

  // Keyboard handlers
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      const key = e.key.toLowerCase();

      if (key === 'arrowleft') {
        setCurrentOctave((prev) => Math.max(1, prev - 1));
        return;
      }
      if (key === 'arrowright') {
        setCurrentOctave((prev) => Math.min(7, prev + 1));
        return;
      }

      const noteStr = KEYBOARD_MAP[key];
      if (noteStr) {
        const match = noteStr.match(/([A-G]#?)(\d)/);
        if (match) {
          const [, note, octaveStr] = match;
          const baseOctave = parseInt(octaveStr);
          const adjustedOctave = baseOctave + (currentOctave - 4);
          const adjustedNoteId = `${note}${adjustedOctave}`;

          const pianoKey = ALL_PIANO_KEYS.find(
            (k) => `${k.note}${k.octave}` === adjustedNoteId
          );

          if (pianoKey) {
            handleKeyPress(adjustedNoteId, pianoKey.frequency);
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      const noteStr = KEYBOARD_MAP[key];
      if (noteStr) {
        const match = noteStr.match(/([A-G]#?)(\d)/);
        if (match) {
          const [, note, octaveStr] = match;
          const baseOctave = parseInt(octaveStr);
          const adjustedOctave = baseOctave + (currentOctave - 4);
          const adjustedNoteId = `${note}${adjustedOctave}`;
          handleKeyRelease(adjustedNoteId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentOctave]);

  const handleKeyPress = useCallback((noteId: string, frequency: number) => {
    setPressedKeys((prev) => new Set(prev).add(noteId));
    synthRef.current?.playNote(frequency, noteId, 0.8);
  }, []);

  const handleKeyRelease = useCallback((noteId: string) => {
    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.delete(noteId);
      return next;
    });
    synthRef.current?.releaseNote(noteId);
  }, []);

  // Calculate dimensions
  const whiteKeys = ALL_PIANO_KEYS.filter((k) => !k.isBlack);
  const whiteKeyWidth = isMobile ? 42 : 50;
  const whiteKeyHeight = isLandscape ? Math.min(height * 0.5, 260) : Math.min(height * 0.35, 200);

  // Scroll to middle C on mount
  useEffect(() => {
    const middleCIndex = whiteKeys.findIndex((k) => k.note === 'C' && k.octave === 4);
    const scrollPosition = middleCIndex * (whiteKeyWidth + 2) - width / 2 + whiteKeyWidth / 2;

    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: Math.max(0, scrollPosition), animated: false });
    }, 100);
  }, []);

  // Build piano layout
  const pianoLayout = useMemo(() => {
    const layout: { key: PianoKey; position: number }[] = [];
    let whiteKeyIndex = 0;

    ALL_PIANO_KEYS.forEach((key) => {
      if (key.isBlack) {
        const position = whiteKeyIndex * (whiteKeyWidth + 2);
        layout.push({ key, position });
      } else {
        const position = whiteKeyIndex * (whiteKeyWidth + 2);
        layout.push({ key, position });
        whiteKeyIndex++;
      }
    });

    return layout;
  }, [whiteKeyWidth]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#2a2a4a',
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 }}
        >
          <FontAwesome name="arrow-left" size={20} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Back</Text>
        </Pressable>

        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>Virtual Piano</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Controls */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
          paddingHorizontal: 12,
          gap: 16,
          backgroundColor: '#252545',
          flexWrap: 'wrap',
        }}
      >
        {/* Octave Controls */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ color: '#94a3b8', fontSize: 11 }}>Octave</Text>
          <Pressable
            onPress={() => setCurrentOctave((prev) => Math.max(1, prev - 1))}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: '#3a3a5a',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FontAwesome name="minus" size={12} color="#fff" />
          </Pressable>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', minWidth: 24, textAlign: 'center' }}>
            {currentOctave}
          </Text>
          <Pressable
            onPress={() => setCurrentOctave((prev) => Math.min(7, prev + 1))}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: '#3a3a5a',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FontAwesome name="plus" size={12} color="#fff" />
          </Pressable>
        </View>

        {/* Echo/Reverb Controls */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Pressable
            onPress={() => setReverb((prev) => Math.max(0, prev - 0.2))}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: '#3a3a5a',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="remove" size={14} color="#fff" />
          </Pressable>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="water" size={14} color="#94a3b8" />
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600', minWidth: 28 }}>
              {Math.round(reverb * 100)}%
            </Text>
          </View>
          <Pressable
            onPress={() => setReverb((prev) => Math.min(1, prev + 0.2))}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: '#3a3a5a',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="add" size={14} color="#fff" />
          </Pressable>
        </View>

        {/* Labels Toggle */}
        <Pressable
          onPress={() => setShowLabels(!showLabels)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 14,
            backgroundColor: showLabels ? '#4f46e5' : '#3a3a5a',
          }}
        >
          <Ionicons name="text" size={14} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Labels</Text>
        </Pressable>
      </View>

      {/* Sound Presets */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 8,
          paddingHorizontal: 12,
          gap: 8,
          backgroundColor: '#1e1e3a',
        }}
      >
        <Text style={{ color: '#94a3b8', fontSize: 11, marginRight: 4 }}>Sound:</Text>
        {SOUND_PRESETS.map((preset) => (
          <Pressable
            key={preset.id}
            onPress={() => setSoundPreset(preset.id)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 14,
              backgroundColor: soundPreset === preset.id ? '#7c3aed' : '#3a3a5a',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>{preset.name}</Text>
          </Pressable>
        ))}
      </View>

      {/* Keyboard Hints */}
      {Platform.OS === 'web' && (
        <View style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#1a1a2e' }}>
          <Text style={{ color: '#64748b', fontSize: 11, textAlign: 'center' }}>
            Keyboard: A-J lower, K-; upper | Arrows: Change octave
          </Text>
        </View>
      )}

      {/* Piano */}
      <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 16 }}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
        >
          <View style={{ flexDirection: 'row', height: whiteKeyHeight + 10, position: 'relative' }}>
            {/* White keys */}
            {pianoLayout
              .filter(({ key }) => !key.isBlack)
              .map(({ key }) => {
                const noteId = `${key.note}${key.octave}`;
                return (
                  <PianoKeyComponent
                    key={noteId}
                    pianoKey={key}
                    isPressed={pressedKeys.has(noteId)}
                    isHighlighted={false}
                    onPressIn={() => handleKeyPress(noteId, key.frequency)}
                    onPressOut={() => handleKeyRelease(noteId)}
                    whiteKeyWidth={whiteKeyWidth}
                    whiteKeyHeight={whiteKeyHeight}
                    showLabels={showLabels}
                  />
                );
              })}

            {/* Black keys */}
            {pianoLayout
              .filter(({ key }) => key.isBlack)
              .map(({ key, position }) => {
                const noteId = `${key.note}${key.octave}`;
                return (
                  <View key={noteId} style={{ position: 'absolute', left: position, top: 0 }}>
                    <PianoKeyComponent
                      pianoKey={key}
                      isPressed={pressedKeys.has(noteId)}
                      isHighlighted={false}
                      onPressIn={() => handleKeyPress(noteId, key.frequency)}
                      onPressOut={() => handleKeyRelease(noteId)}
                      whiteKeyWidth={whiteKeyWidth}
                      whiteKeyHeight={whiteKeyHeight}
                      showLabels={showLabels}
                    />
                  </View>
                );
              })}
          </View>
        </ScrollView>
      </View>

    </SafeAreaView>
  );
}
