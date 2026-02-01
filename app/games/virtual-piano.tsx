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

// Sample Jewish songs with note sequences
interface SongNote {
  note: string; // e.g., 'C4', 'D#5'
  duration: number; // in milliseconds
}

interface Song {
  id: string;
  title: string;
  hebrewTitle?: string;
  notes: SongNote[];
  tempo: number; // BPM
}

const SAMPLE_SONGS: Song[] = [
  {
    id: 'hava-nagila',
    title: 'Hava Nagila',
    hebrewTitle: 'הבה נגילה',
    tempo: 140,
    notes: [
      // Hava nagila, hava nagila
      { note: 'E4', duration: 300 },
      { note: 'F4', duration: 300 },
      { note: 'G#4', duration: 600 },
      { note: 'G#4', duration: 300 },
      { note: 'A4', duration: 300 },
      { note: 'G#4', duration: 300 },
      { note: 'F4', duration: 300 },
      { note: 'E4', duration: 600 },
      { note: 'E4', duration: 300 },
      { note: 'F4', duration: 300 },
      { note: 'G#4', duration: 600 },
      { note: 'G#4', duration: 300 },
      { note: 'A4', duration: 300 },
      { note: 'G#4', duration: 300 },
      { note: 'F4', duration: 300 },
      { note: 'E4', duration: 600 },
      // Hava neranena
      { note: 'E4', duration: 300 },
      { note: 'F4', duration: 300 },
      { note: 'G#4', duration: 300 },
      { note: 'A4', duration: 300 },
      { note: 'B4', duration: 600 },
      { note: 'B4', duration: 300 },
      { note: 'C5', duration: 300 },
      { note: 'B4', duration: 300 },
      { note: 'A4', duration: 300 },
      { note: 'G#4', duration: 600 },
    ],
  },
  {
    id: 'shabbat-shalom',
    title: 'Shabbat Shalom',
    hebrewTitle: 'שבת שלום',
    tempo: 120,
    notes: [
      // Shabbat shalom
      { note: 'C4', duration: 400 },
      { note: 'E4', duration: 400 },
      { note: 'G4', duration: 400 },
      { note: 'G4', duration: 200 },
      { note: 'A4', duration: 200 },
      { note: 'G4', duration: 800 },
      // Hey!
      { note: 'E4', duration: 400 },
      { note: 'G4', duration: 400 },
      { note: 'A4', duration: 400 },
      { note: 'A4', duration: 200 },
      { note: 'B4', duration: 200 },
      { note: 'A4', duration: 800 },
      // Shabbat shalom
      { note: 'G4', duration: 400 },
      { note: 'A4', duration: 400 },
      { note: 'B4', duration: 400 },
      { note: 'C5', duration: 800 },
      { note: 'B4', duration: 400 },
      { note: 'A4', duration: 400 },
      { note: 'G4', duration: 800 },
    ],
  },
  {
    id: 'maoz-tzur',
    title: 'Maoz Tzur',
    hebrewTitle: 'מעוז צור',
    tempo: 100,
    notes: [
      // Ma-oz tzur ye-shu-a-ti
      { note: 'D4', duration: 500 },
      { note: 'D4', duration: 500 },
      { note: 'D4', duration: 500 },
      { note: 'E4', duration: 500 },
      { note: 'F#4', duration: 500 },
      { note: 'F#4', duration: 500 },
      { note: 'F#4', duration: 500 },
      { note: 'G4', duration: 500 },
      // Le-cha na-eh le-sha-bei-ach
      { note: 'A4', duration: 500 },
      { note: 'A4', duration: 500 },
      { note: 'A4', duration: 500 },
      { note: 'B4', duration: 250 },
      { note: 'A4', duration: 250 },
      { note: 'G4', duration: 500 },
      { note: 'F#4', duration: 500 },
      { note: 'E4', duration: 500 },
      { note: 'D4', duration: 1000 },
    ],
  },
  {
    id: 'dayenu',
    title: 'Dayenu',
    hebrewTitle: 'דיינו',
    tempo: 130,
    notes: [
      // I-lu ho-tzi ho-tzi-a-nu
      { note: 'A4', duration: 300 },
      { note: 'A4', duration: 300 },
      { note: 'A4', duration: 300 },
      { note: 'G4', duration: 300 },
      { note: 'F4', duration: 300 },
      { note: 'E4', duration: 300 },
      { note: 'D4', duration: 600 },
      // Ho-tzi-a-nu mi-mitz-ra-yim
      { note: 'D4', duration: 300 },
      { note: 'E4', duration: 300 },
      { note: 'F4', duration: 300 },
      { note: 'G4', duration: 300 },
      { note: 'A4', duration: 600 },
      { note: 'A4', duration: 600 },
      // Da-ye-nu!
      { note: 'A4', duration: 200 },
      { note: 'A4', duration: 200 },
      { note: 'G4', duration: 200 },
      { note: 'F4', duration: 200 },
      { note: 'E4', duration: 400 },
      { note: 'D4', duration: 800 },
    ],
  },
  {
    id: 'hatikva',
    title: 'Hatikva',
    hebrewTitle: 'התקווה',
    tempo: 80,
    notes: [
      // Kol od ba-le-vav
      { note: 'E4', duration: 600 },
      { note: 'E4', duration: 300 },
      { note: 'E4', duration: 300 },
      { note: 'F4', duration: 600 },
      { note: 'E4', duration: 600 },
      { note: 'D4', duration: 600 },
      { note: 'C4', duration: 600 },
      // Pe-ni-ma
      { note: 'D4', duration: 400 },
      { note: 'E4', duration: 400 },
      { note: 'F4', duration: 800 },
      // Ne-fesh ye-hu-di
      { note: 'G4', duration: 600 },
      { note: 'G4', duration: 300 },
      { note: 'G4', duration: 300 },
      { note: 'A4', duration: 600 },
      { note: 'G4', duration: 600 },
      { note: 'F4', duration: 600 },
      { note: 'E4', duration: 600 },
      // Ho-mi-ya
      { note: 'F4', duration: 400 },
      { note: 'G4', duration: 400 },
      { note: 'A4', duration: 800 },
    ],
  },
  {
    id: 'adon-olam',
    title: 'Adon Olam',
    hebrewTitle: 'אדון עולם',
    tempo: 110,
    notes: [
      // A-don o-lam
      { note: 'G4', duration: 400 },
      { note: 'G4', duration: 200 },
      { note: 'A4', duration: 200 },
      { note: 'B4', duration: 400 },
      { note: 'A4', duration: 400 },
      // A-sher ma-lach
      { note: 'G4', duration: 400 },
      { note: 'F#4', duration: 200 },
      { note: 'G4', duration: 200 },
      { note: 'A4', duration: 400 },
      { note: 'G4', duration: 400 },
      // Be-te-rem kol
      { note: 'G4', duration: 400 },
      { note: 'A4', duration: 200 },
      { note: 'B4', duration: 200 },
      { note: 'C5', duration: 400 },
      { note: 'B4', duration: 400 },
      // Ye-tzir niv-ra
      { note: 'A4', duration: 400 },
      { note: 'G4', duration: 200 },
      { note: 'F#4', duration: 200 },
      { note: 'E4', duration: 400 },
      { note: 'D4', duration: 800 },
    ],
  },
];

// Sound presets
type SoundPreset = 'bright' | 'warm' | 'bell' | 'soft' | 'classic';

const SOUND_PRESETS: { id: SoundPreset; name: string }[] = [
  { id: 'classic', name: 'Classic' },
  { id: 'bright', name: 'Bright' },
  { id: 'warm', name: 'Warm' },
  { id: 'bell', name: 'Bell' },
  { id: 'soft', name: 'Soft' },
];

// Multi-preset Piano Synthesizer
class RealisticPianoSynth {
  private audioContext: AudioContext | null = null;
  private activeNotes: Map<string, {
    oscillators: OscillatorNode[];
    gainNodes: GainNode[];
    mainGain: GainNode;
    releaseTimeout?: NodeJS.Timeout;
  }> = new Map();
  private masterGain: GainNode | null = null;
  private dryGain: GainNode | null = null;
  private wetGain: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private isInitialized = false;
  private isInitializing = false;
  private volumeMultiplier = 0.6;
  private reverbAmount = 1.0; // Default 100%
  private currentPreset: SoundPreset = 'classic';

  // Initialize lazily - called on first user interaction for mobile browser support
  private ensureInitialized(): boolean {
    if (this.isInitialized) return true;
    if (this.isInitializing) return false;
    if (Platform.OS !== 'web') return false;

    this.isInitializing = true;

    try {
      // Create AudioContext - on mobile this must happen during user gesture
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Web Audio API not supported');
        return false;
      }

      this.audioContext = new AudioContextClass();

      // Master gain - create immediately for fast first note
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.volumeMultiplier;

      // Dry gain for immediate sound
      this.dryGain = this.audioContext.createGain();
      this.dryGain.gain.value = 1;
      this.dryGain.connect(this.masterGain);
      this.masterGain.connect(this.audioContext.destination);

      this.isInitialized = true;
      this.isInitializing = false;

      // Create reverb in background after first note plays
      setTimeout(() => this.initReverb(), 50);

      return true;
    } catch (e) {
      console.warn('Web Audio not available:', e);
      this.isInitializing = false;
      return false;
    }
  }

  private initReverb() {
    if (!this.audioContext || !this.masterGain) return;

    try {
      this.reverb = this.audioContext.createConvolver();
      this.createReverbImpulse();

      this.wetGain = this.audioContext.createGain();
      this.updateReverbMix();

      this.reverb.connect(this.wetGain);
      this.wetGain.connect(this.masterGain);
    } catch (e) {
      console.warn('Reverb init failed:', e);
    }
  }

  async init() {
    // No-op now - initialization happens lazily on first touch
  }

  private updateReverbMix() {
    if (this.dryGain && this.wetGain) {
      this.dryGain.gain.value = 1 - this.reverbAmount * 0.3;
      this.wetGain.gain.value = this.reverbAmount * 0.7;
    }
  }

  private createReverbImpulse() {
    if (!this.audioContext || !this.reverb) return;

    const sampleRate = this.audioContext.sampleRate;
    // Shorter reverb - 1 second is enough and much faster to create
    const length = Math.floor(sampleRate * 1);
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const decay = Math.exp(-i / (sampleRate * 0.3));
        data[i] = (Math.random() * 2 - 1) * decay * 0.5;
      }
    }

    this.reverb.buffer = impulse;
  }

  setPreset(preset: SoundPreset) {
    this.currentPreset = preset;
  }

  playNote(frequency: number, noteId: string, velocity: number = 0.8) {
    // Initialize on first touch (required for mobile browsers)
    if (!this.isInitialized) {
      if (!this.ensureInitialized()) return;
    }

    if (!this.audioContext || !this.masterGain) return;

    // Resume audio context if suspended (mobile browsers suspend by default)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.stopNoteImmediate(noteId);

    const now = this.audioContext.currentTime;
    const oscillators: OscillatorNode[] = [];
    const gainNodes: GainNode[] = [];

    // Main envelope
    const mainGain = this.audioContext.createGain();

    // Different sound based on preset
    switch (this.currentPreset) {
      case 'classic':
        this.createClassicSound(frequency, velocity, now, oscillators, gainNodes, mainGain);
        break;
      case 'bright':
        this.createBrightSound(frequency, velocity, now, oscillators, gainNodes, mainGain);
        break;
      case 'warm':
        this.createWarmSound(frequency, velocity, now, oscillators, gainNodes, mainGain);
        break;
      case 'bell':
        this.createBellSound(frequency, velocity, now, oscillators, gainNodes, mainGain);
        break;
      case 'soft':
        this.createSoftSound(frequency, velocity, now, oscillators, gainNodes, mainGain);
        break;
    }

    // Connect to dry path (always available)
    mainGain.connect(this.dryGain!);
    // Connect to reverb if available (may not be ready on first note)
    if (this.reverb) {
      mainGain.connect(this.reverb);
    }

    // Start all oscillators and schedule stop
    oscillators.forEach(osc => {
      osc.start(now);
      osc.stop(now + 5); // Stop after 5 seconds max
    });

    this.activeNotes.set(noteId, {
      oscillators,
      gainNodes,
      mainGain,
    });
  }

  private createClassicSound(freq: number, vel: number, now: number, oscs: OscillatorNode[], gains: GainNode[], mainGain: GainNode) {
    // Classic piano - simplified for mobile performance
    const osc1 = this.audioContext!.createOscillator();
    const gain1 = this.audioContext!.createGain();
    osc1.type = 'triangle';
    osc1.frequency.value = freq;
    gain1.gain.value = vel * 0.6;
    osc1.connect(gain1);
    gain1.connect(mainGain);
    oscs.push(osc1);
    gains.push(gain1);

    const osc2 = this.audioContext!.createOscillator();
    const gain2 = this.audioContext!.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2;
    gain2.gain.value = vel * 0.25;
    osc2.connect(gain2);
    gain2.connect(mainGain);
    oscs.push(osc2);
    gains.push(gain2);

    mainGain.gain.setValueAtTime(vel * 0.7, now);
    mainGain.gain.exponentialRampToValueAtTime(vel * 0.3, now + 0.2);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
  }

  private createBrightSound(freq: number, vel: number, now: number, oscs: OscillatorNode[], gains: GainNode[], mainGain: GainNode) {
    // Bright - sawtooth for rich harmonics
    const osc1 = this.audioContext!.createOscillator();
    const gain1 = this.audioContext!.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.value = freq;
    gain1.gain.value = vel * 0.35;
    osc1.connect(gain1);
    gain1.connect(mainGain);
    oscs.push(osc1);
    gains.push(gain1);

    mainGain.gain.setValueAtTime(vel * 0.8, now);
    mainGain.gain.exponentialRampToValueAtTime(vel * 0.2, now + 0.3);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 2);
  }

  private createWarmSound(freq: number, vel: number, now: number, oscs: OscillatorNode[], gains: GainNode[], mainGain: GainNode) {
    // Warm - pure sine with sub
    const osc1 = this.audioContext!.createOscillator();
    const gain1 = this.audioContext!.createGain();
    osc1.type = 'sine';
    osc1.frequency.value = freq;
    gain1.gain.value = vel * 0.7;
    osc1.connect(gain1);
    gain1.connect(mainGain);
    oscs.push(osc1);
    gains.push(gain1);

    // Sub octave for warmth
    const osc2 = this.audioContext!.createOscillator();
    const gain2 = this.audioContext!.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = freq / 2;
    gain2.gain.value = vel * 0.2;
    osc2.connect(gain2);
    gain2.connect(mainGain);
    oscs.push(osc2);
    gains.push(gain2);

    mainGain.gain.setValueAtTime(vel * 0.6, now);
    mainGain.gain.exponentialRampToValueAtTime(vel * 0.3, now + 0.4);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 3);
  }

  private createBellSound(freq: number, vel: number, now: number, oscs: OscillatorNode[], gains: GainNode[], mainGain: GainNode) {
    // Bell-like - triangle with fast decay
    const osc1 = this.audioContext!.createOscillator();
    const gain1 = this.audioContext!.createGain();
    osc1.type = 'triangle';
    osc1.frequency.value = freq;
    gain1.gain.value = vel * 0.5;
    osc1.connect(gain1);
    gain1.connect(mainGain);
    oscs.push(osc1);
    gains.push(gain1);

    // High harmonic for bell shimmer
    const osc2 = this.audioContext!.createOscillator();
    const gain2 = this.audioContext!.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2.5;
    gain2.gain.value = vel * 0.3;
    osc2.connect(gain2);
    gain2.connect(mainGain);
    oscs.push(osc2);
    gains.push(gain2);

    mainGain.gain.setValueAtTime(vel * 0.7, now);
    mainGain.gain.exponentialRampToValueAtTime(vel * 0.15, now + 0.6);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
  }

  private createSoftSound(freq: number, vel: number, now: number, oscs: OscillatorNode[], gains: GainNode[], mainGain: GainNode) {
    // Soft - pure sine
    const osc1 = this.audioContext!.createOscillator();
    const gain1 = this.audioContext!.createGain();
    osc1.type = 'sine';
    osc1.frequency.value = freq;
    gain1.gain.value = vel * 0.8;
    osc1.connect(gain1);
    gain1.connect(mainGain);
    oscs.push(osc1);
    gains.push(gain1);

    mainGain.gain.setValueAtTime(vel * 0.5, now);
    mainGain.gain.exponentialRampToValueAtTime(vel * 0.3, now + 0.5);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 4);
  }

  releaseNote(noteId: string) {
    const active = this.activeNotes.get(noteId);
    if (!active || !this.audioContext) return;

    const now = this.audioContext.currentTime;
    const releaseTime = 0.3;

    try {
      active.mainGain.gain.cancelScheduledValues(now);
      const currentValue = Math.max(active.mainGain.gain.value, 0.001);
      active.mainGain.gain.setValueAtTime(currentValue, now);
      active.mainGain.gain.exponentialRampToValueAtTime(0.001, now + releaseTime);

      active.releaseTimeout = setTimeout(() => {
        this.stopNoteImmediate(noteId);
      }, releaseTime * 1000 + 50);
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


// Songs Panel
interface SongsPanelProps {
  visible: boolean;
  onClose: () => void;
  onPlaySong: (song: Song) => void;
  isPlaying: boolean;
  currentSongId: string | null;
  onStop: () => void;
}

function SongsPanel({
  visible,
  onClose,
  onPlaySong,
  isPlaying,
  currentSongId,
  onStop,
}: SongsPanelProps) {
  if (!visible) return null;

  return (
    <Pressable
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
      }}
      onPress={onClose}
    >
      <Pressable
        style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 24,
          width: '90%',
          maxWidth: 450,
          maxHeight: '80%',
        }}
        onPress={(e) => e.stopPropagation()}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#111' }}>
            Sample Songs
          </Text>
          <Pressable onPress={onClose} style={{ padding: 4 }}>
            <Ionicons name="close" size={24} color="#666" />
          </Pressable>
        </View>

        <Text style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
          Listen to these Jewish melodies or play along with the highlighted keys.
        </Text>

        <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
          {SAMPLE_SONGS.map((song) => {
            const isCurrent = currentSongId === song.id;
            return (
              <View
                key={song.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 14,
                  backgroundColor: isCurrent ? '#f0f4ff' : '#f9fafb',
                  borderRadius: 12,
                  marginBottom: 10,
                  borderWidth: isCurrent ? 2 : 1,
                  borderColor: isCurrent ? '#4f46e5' : '#e5e7eb',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 2 }}>
                    {song.title}
                  </Text>
                  {song.hebrewTitle && (
                    <Text style={{ fontSize: 14, color: '#666', fontFamily: Platform.OS === 'web' ? 'inherit' : undefined }}>
                      {song.hebrewTitle}
                    </Text>
                  )}
                </View>
                <Pressable
                  onPress={() => {
                    if (isCurrent && isPlaying) {
                      onStop();
                    } else {
                      onPlaySong(song);
                    }
                  }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: isCurrent && isPlaying ? '#ef4444' : '#4f46e5',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons
                    name={isCurrent && isPlaying ? 'stop' : 'play'}
                    size={20}
                    color="#fff"
                  />
                </Pressable>
              </View>
            );
          })}
        </ScrollView>

        <Pressable
          onPress={onClose}
          style={{
            marginTop: 16,
            backgroundColor: '#f3f4f6',
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#374151', fontSize: 16, fontWeight: '600' }}>Close</Text>
        </Pressable>
      </Pressable>
    </Pressable>
  );
}

export default function VirtualPianoScreen() {
  const { width, height } = useWindowDimensions();
  const { isMobile } = useDeviceType();
  const isLandscape = width > height;

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [showSongs, setShowSongs] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [reverb, setReverb] = useState(1.0); // Default 100%
  const [showLabels, setShowLabels] = useState(true);
  const [soundPreset, setSoundPreset] = useState<SoundPreset>('classic');
  const [currentOctave, setCurrentOctave] = useState(4);
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [highlightedNote, setHighlightedNote] = useState<string | null>(null);

  const synthRef = useRef<RealisticPianoSynth | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const songTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Song playback functions
  const stopSong = useCallback(() => {
    if (songTimeoutRef.current) {
      clearTimeout(songTimeoutRef.current);
      songTimeoutRef.current = null;
    }
    setIsPlayingSong(false);
    setCurrentSongId(null);
    setCurrentNoteIndex(0);
    setHighlightedNote(null);
    synthRef.current?.stopAllNotes();
  }, []);

  const playSong = useCallback((song: Song) => {
    stopSong();
    setIsPlayingSong(true);
    setCurrentSongId(song.id);
    setShowSongs(false);

    let noteIndex = 0;

    const playNextNote = () => {
      if (noteIndex >= song.notes.length) {
        stopSong();
        return;
      }

      const currentNote = song.notes[noteIndex];
      const pianoKey = ALL_PIANO_KEYS.find(
        (k) => `${k.note}${k.octave}` === currentNote.note
      );

      if (pianoKey) {
        // Highlight and play the note
        setHighlightedNote(currentNote.note);
        setCurrentNoteIndex(noteIndex);
        synthRef.current?.playNote(pianoKey.frequency, currentNote.note, 0.8);

        // Release after a portion of the duration
        setTimeout(() => {
          synthRef.current?.releaseNote(currentNote.note);
        }, currentNote.duration * 0.8);
      }

      noteIndex++;

      // Schedule next note
      songTimeoutRef.current = setTimeout(playNextNote, currentNote.duration);
    };

    // Start playing
    playNextNote();
  }, [stopSong]);

  // Cleanup song on unmount
  useEffect(() => {
    return () => {
      if (songTimeoutRef.current) {
        clearTimeout(songTimeoutRef.current);
      }
    };
  }, []);

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

        <Pressable onPress={() => setShowSongs(true)} style={{ padding: 8 }}>
          <Ionicons name="musical-notes" size={24} color="#fff" />
        </Pressable>
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
      {Platform.OS === 'web' && !isPlayingSong && (
        <View style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#1a1a2e' }}>
          <Text style={{ color: '#64748b', fontSize: 11, textAlign: 'center' }}>
            Keyboard: A-J lower, K-; upper | Arrows: Change octave
          </Text>
        </View>
      )}

      {/* Song Playing Indicator */}
      {isPlayingSong && currentSongId && (
        <View style={{
          paddingVertical: 10,
          paddingHorizontal: 16,
          backgroundColor: '#2d1f5e',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="musical-notes" size={18} color="#a78bfa" />
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
              {SAMPLE_SONGS.find(s => s.id === currentSongId)?.title}
            </Text>
          </View>
          <Pressable
            onPress={stopSong}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: '#ef4444',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
            }}
          >
            <Ionicons name="stop" size={14} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Stop</Text>
          </Pressable>
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
                    isHighlighted={highlightedNote === noteId}
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
                      isHighlighted={highlightedNote === noteId}
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

      {/* Current Note Display */}
      <View style={{ paddingVertical: 16, alignItems: 'center', backgroundColor: '#252545' }}>
        <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>
          {isPlayingSong ? 'Song Note' : 'Now Playing'}
        </Text>
        <Text style={{ color: isPlayingSong ? '#a78bfa' : '#fff', fontSize: 24, fontWeight: '700', minHeight: 32 }}>
          {highlightedNote || (pressedKeys.size > 0 ? Array.from(pressedKeys).join(' + ') : '-')}
        </Text>
      </View>

      {/* Songs Panel */}
      <SongsPanel
        visible={showSongs}
        onClose={() => setShowSongs(false)}
        onPlaySong={playSong}
        isPlaying={isPlayingSong}
        currentSongId={currentSongId}
        onStop={stopSong}
      />
    </SafeAreaView>
  );
}
