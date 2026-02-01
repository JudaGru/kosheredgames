import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  withDelay,
  withSequence,
  withSpring,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDeviceType } from '@/hooks/useDeviceType';

// Note definitions - 3 octaves
interface NoteDefinition {
  note: string;
  key: string;
  type: 'white' | 'black';
  label: string;
}

const NOTES: NoteDefinition[] = [
  // Octave 3
  { note: 'C3', key: '', type: 'white', label: '' },
  { note: 'C#3', key: '', type: 'black', label: '' },
  { note: 'D3', key: '', type: 'white', label: '' },
  { note: 'D#3', key: '', type: 'black', label: '' },
  { note: 'E3', key: '', type: 'white', label: '' },
  { note: 'F3', key: '', type: 'white', label: '' },
  { note: 'F#3', key: '', type: 'black', label: '' },
  { note: 'G3', key: '', type: 'white', label: '' },
  { note: 'G#3', key: '', type: 'black', label: '' },
  { note: 'A3', key: '', type: 'white', label: '' },
  { note: 'A#3', key: '', type: 'black', label: '' },
  { note: 'B3', key: '', type: 'white', label: '' },
  // Octave 4 (middle C) - with keyboard shortcuts
  { note: 'C4', key: 'a', type: 'white', label: 'A' },
  { note: 'C#4', key: 'w', type: 'black', label: 'W' },
  { note: 'D4', key: 's', type: 'white', label: 'S' },
  { note: 'D#4', key: 'e', type: 'black', label: 'E' },
  { note: 'E4', key: 'd', type: 'white', label: 'D' },
  { note: 'F4', key: 'f', type: 'white', label: 'F' },
  { note: 'F#4', key: 't', type: 'black', label: 'T' },
  { note: 'G4', key: 'g', type: 'white', label: 'G' },
  { note: 'G#4', key: 'y', type: 'black', label: 'Y' },
  { note: 'A4', key: 'h', type: 'white', label: 'H' },
  { note: 'A#4', key: 'u', type: 'black', label: 'U' },
  { note: 'B4', key: 'j', type: 'white', label: 'J' },
  // Octave 5
  { note: 'C5', key: 'k', type: 'white', label: 'K' },
  { note: 'C#5', key: 'o', type: 'black', label: 'O' },
  { note: 'D5', key: 'l', type: 'white', label: 'L' },
  { note: 'D#5', key: 'p', type: 'black', label: 'P' },
  { note: 'E5', key: ';', type: 'white', label: ';' },
  { note: 'F5', key: '', type: 'white', label: '' },
  { note: 'F#5', key: '', type: 'black', label: '' },
  { note: 'G5', key: '', type: 'white', label: '' },
  { note: 'G#5', key: '', type: 'black', label: '' },
  { note: 'A5', key: '', type: 'white', label: '' },
  { note: 'A#5', key: '', type: 'black', label: '' },
  { note: 'B5', key: '', type: 'white', label: '' },
  // Octave 6
  { note: 'C6', key: '', type: 'white', label: '' },
];

// Instrument definitions
const INSTRUMENTS: Record<string, { name: string; icon: string }> = {
  piano: { name: 'Piano', icon: 'musical-notes' },
  rhodes: { name: 'Rhodes', icon: 'radio' },
  musicbox: { name: 'Music Box', icon: 'gift' },
  strings: { name: 'Strings', icon: 'disc' },
  organ: { name: 'Organ', icon: 'home' },
  synth: { name: 'Synth', icon: 'pulse' },
};

// Tone.js types
let Tone: any = null;

// Piano Key Component
interface PianoKeyProps {
  noteObj: NoteDefinition;
  isActive: boolean;
  onPress: () => void;
  onRelease: () => void;
  whiteKeyWidth: number;
  whiteKeyHeight: number;
  whiteKeyIndex: number;
  animationDelay: number;
  isAnimating: boolean;
}

function PianoKey({
  noteObj,
  isActive,
  onPress,
  onRelease,
  whiteKeyWidth,
  whiteKeyHeight,
  whiteKeyIndex,
  animationDelay,
  isAnimating,
}: PianoKeyProps) {
  const pressAnim = useSharedValue(0);
  const entryAnim = useSharedValue(0);

  // Entry animation - keys dance in
  useEffect(() => {
    if (isAnimating) {
      entryAnim.value = withDelay(
        animationDelay,
        withSequence(
          withSpring(1.1, { damping: 8, stiffness: 200 }),
          withSpring(1, { damping: 12, stiffness: 150 })
        )
      );
    } else {
      entryAnim.value = 1;
    }
  }, [isAnimating, animationDelay]);

  useEffect(() => {
    pressAnim.value = withTiming(isActive ? 1 : 0, {
      duration: isActive ? 0 : 80,
    });
  }, [isActive]);

  const blackKeyWidth = whiteKeyWidth * 0.65;
  const blackKeyHeight = whiteKeyHeight * 0.62;

  const whiteKeyAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(pressAnim.value, [0, 1], [0, 3], Extrapolation.CLAMP);
    const scale = entryAnim.value;
    const entryTranslateY = interpolate(entryAnim.value, [0, 1], [50, 0], Extrapolation.CLAMP);
    return {
      transform: [
        { translateY: translateY + entryTranslateY },
        { scale }
      ],
      opacity: entryAnim.value,
    };
  });

  const blackKeyAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(pressAnim.value, [0, 1], [0, 2], Extrapolation.CLAMP);
    const scale = entryAnim.value;
    const entryTranslateY = interpolate(entryAnim.value, [0, 1], [30, 0], Extrapolation.CLAMP);
    return {
      transform: [
        { translateY: translateY + entryTranslateY },
        { scale }
      ],
      opacity: entryAnim.value,
    };
  });

  // Handle tap - play note and auto-release after short duration
  const handleTap = () => {
    onPress();
    setTimeout(() => {
      onRelease();
    }, 200);
  };

  if (noteObj.type === 'black') {
    const leftPos = whiteKeyIndex * (whiteKeyWidth + 2) - blackKeyWidth / 2;

    return (
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: leftPos,
            width: blackKeyWidth,
            height: blackKeyHeight,
            zIndex: 10,
          },
          blackKeyAnimatedStyle,
        ]}
      >
        <Pressable
          onPress={handleTap}
          style={({ pressed }) => ({
            flex: 1,
            backgroundColor: isActive || pressed ? '#4c1d95' : '#1a1a1a',
            borderRadius: 4,
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            borderWidth: 1,
            borderColor: isActive ? '#7c3aed' : '#000',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 8,
          })}
        >
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '25%',
              backgroundColor: isActive ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)',
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
            }}
          />
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
        onPress={handleTap}
        style={({ pressed }) => ({
          flex: 1,
          backgroundColor: isActive || pressed ? '#e0e7ff' : '#fafafa',
          borderRadius: 6,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          borderWidth: isActive ? 2 : 1,
          borderColor: isActive ? '#7c3aed' : '#ccc',
          borderBottomColor: isActive ? '#6d28d9' : '#999',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: isActive ? 2 : 5 },
          shadowOpacity: isActive ? 0.15 : 0.25,
          shadowRadius: isActive ? 2 : 6,
          elevation: isActive ? 2 : 6,
        })}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '15%',
            backgroundColor: isActive ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.8)',
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
          }}
        />
      </Pressable>
    </Animated.View>
  );
}

export default function VirtualPianoScreen() {
  const { width, height } = useWindowDimensions();
  const { isMobile, isMobileWeb } = useDeviceType();
  const isLandscape = width > height;
  const isNarrowMobile = isMobile || isMobileWeb || width < 768;

  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [instrument, setInstrument] = useState('piano');
  const [reverb, setReverb] = useState(30);
  const [audioStarted, setAudioStarted] = useState(false);
  const [toneLoaded, setToneLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  const synthRef = useRef<any>(null);
  const hammerSynthRef = useRef<any>(null);
  const harmonicsSynthRef = useRef<any>(null);
  const reverbRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Stop animation after it completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Load Tone.js dynamically (web only)
  useEffect(() => {
    if (Platform.OS === 'web') {
      import('tone').then((ToneModule) => {
        Tone = ToneModule;
        setToneLoaded(true);
      }).catch((err) => {
        console.warn('Failed to load Tone.js:', err);
      });
    }

    return () => {
      if (synthRef.current) synthRef.current.dispose?.();
      if (hammerSynthRef.current) hammerSynthRef.current.dispose?.();
      if (harmonicsSynthRef.current) harmonicsSynthRef.current.dispose?.();
      if (reverbRef.current) reverbRef.current.dispose?.();
    };
  }, []);

  // Create synth based on instrument
  const createSynth = useCallback(() => {
    if (!Tone) return;

    if (synthRef.current) synthRef.current.dispose?.();
    if (hammerSynthRef.current) hammerSynthRef.current.dispose?.();
    if (harmonicsSynthRef.current) harmonicsSynthRef.current.dispose?.();
    if (reverbRef.current) reverbRef.current.dispose?.();

    reverbRef.current = new Tone.Reverb({
      decay: 2.5,
      wet: reverb / 100,
    }).toDestination();

    const vol = new Tone.Volume(-6).connect(reverbRef.current);

    switch (instrument) {
      case 'piano':
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'fatsine', count: 3, spread: 20 },
          envelope: { attack: 0.003, decay: 1.8, sustain: 0.15, release: 2.2 },
          volume: -3,
        }).connect(vol);

        hammerSynthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.08 },
          volume: -8,
        }).connect(vol);

        harmonicsSynthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'custom', partials: [1, 0.7, 0.4, 0.25, 0.15, 0.08, 0.04] },
          envelope: { attack: 0.005, decay: 2.5, sustain: 0.1, release: 3 },
          volume: -6,
        }).connect(vol);
        break;

      case 'rhodes':
        synthRef.current = new Tone.PolySynth(Tone.FMSynth, {
          harmonicity: 3.01,
          modulationIndex: 1.5,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 1.5, sustain: 0.2, release: 1.8 },
          modulation: { type: 'sine' },
          modulationEnvelope: { attack: 0.002, decay: 0.8, sustain: 0.1, release: 1.2 },
          volume: -2,
        }).connect(vol);

        hammerSynthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.5 },
          volume: -12,
        }).connect(vol);
        harmonicsSynthRef.current = null;
        break;

      case 'musicbox':
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 2.5, sustain: 0, release: 2 },
          volume: -3,
        }).connect(vol);

        hammerSynthRef.current = new Tone.PolySynth(Tone.FMSynth, {
          harmonicity: 8,
          modulationIndex: 2,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.8, sustain: 0, release: 0.5 },
          modulation: { type: 'sine' },
          modulationEnvelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.3 },
          volume: -15,
        }).connect(vol);

        harmonicsSynthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sine', partials: [1, 0.5, 0.25] },
          envelope: { attack: 0.001, decay: 1.5, sustain: 0, release: 1.5 },
          volume: -10,
        }).connect(vol);
        break;

      case 'strings':
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'fatsawtooth', count: 4, spread: 30 },
          envelope: { attack: 0.3, decay: 0.5, sustain: 0.8, release: 1.5 },
          volume: -4,
        }).connect(vol);

        hammerSynthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'fatsawtooth', count: 3, spread: 25 },
          envelope: { attack: 0.35, decay: 0.4, sustain: 0.7, release: 1.8 },
          volume: -8,
        }).connect(vol);

        harmonicsSynthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sine' },
          envelope: { attack: 0.4, decay: 0.3, sustain: 0.5, release: 2 },
          volume: -12,
        }).connect(vol);
        break;

      case 'organ':
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'custom', partials: [1, 1, 0.5, 0.5, 0.25, 0.25, 0.125, 0.125, 0.0625] },
          envelope: { attack: 0.02, decay: 0.1, sustain: 0.9, release: 0.1 },
          volume: -3,
        }).connect(vol);

        hammerSynthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.1 },
          volume: -8,
        }).connect(vol);
        harmonicsSynthRef.current = null;
        break;

      case 'synth':
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'fatsawtooth', count: 3, spread: 20 },
          envelope: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.8 },
          volume: -4,
        }).connect(vol);

        hammerSynthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'pulse', width: 0.4 },
          envelope: { attack: 0.01, decay: 0.25, sustain: 0.4, release: 0.7 },
          volume: -8,
        }).connect(vol);
        harmonicsSynthRef.current = null;
        break;

      default:
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.005, decay: 0.3, sustain: 0.4, release: 1.2 },
        }).connect(vol);
        hammerSynthRef.current = null;
        harmonicsSynthRef.current = null;
    }
  }, [instrument, reverb]);

  // Update synth when settings change
  useEffect(() => {
    if (audioStarted && toneLoaded) {
      createSynth();
    }
  }, [instrument, reverb, audioStarted, toneLoaded, createSynth]);

  // Play a note
  const playNote = useCallback(async (note: string) => {
    if (Platform.OS !== 'web' || !Tone) return;

    if (!audioStarted) {
      await Tone.start();
      setAudioStarted(true);
      createSynth();
    }

    if (!synthRef.current) {
      createSynth();
    }

    const velocity = 0.6 + Math.random() * 0.4;
    const now = Tone.now();

    synthRef.current?.triggerAttack(note, now, velocity);
    hammerSynthRef.current?.triggerAttack(note, now, velocity * 1.2);
    harmonicsSynthRef.current?.triggerAttack(note, now, velocity * 0.7);
  }, [audioStarted, createSynth]);

  // Release a note
  const releaseNote = useCallback((note: string) => {
    if (Platform.OS !== 'web' || !Tone) return;

    const now = Tone.now();
    synthRef.current?.triggerRelease(note, now);
    hammerSynthRef.current?.triggerRelease(note, now);
    harmonicsSynthRef.current?.triggerRelease(note, now);
  }, []);

  // Handle key press (desktop only)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.repeat) return;
    const key = e.key.toLowerCase();

    const noteObj = NOTES.find((n) => n.key === key);
    if (noteObj && !activeKeys.has(key)) {
      setActiveKeys((prev) => new Set([...prev, key]));
      playNote(noteObj.note);
    }
  }, [activeKeys, playNote]);

  // Handle key release (desktop only)
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();

    const noteObj = NOTES.find((n) => n.key === key);
    if (noteObj) {
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      releaseNote(noteObj.note);
    }
  }, [releaseNote]);

  // Keyboard event listeners (desktop only)
  useEffect(() => {
    if (Platform.OS !== 'web' || isNarrowMobile) return;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp, isNarrowMobile]);

  // Calculate dimensions based on orientation and device
  const whiteKeys = NOTES.filter((n) => n.type === 'white');
  const blackKeys = NOTES.filter((n) => n.type === 'black');

  // Responsive key sizing
  const getKeyWidth = () => {
    if (isLandscape) {
      // Landscape: fit more keys, smaller width
      return Math.max(32, Math.floor((width - 48) / whiteKeys.length) - 2);
    } else if (isNarrowMobile) {
      // Portrait mobile: balance between visibility and scrolling
      return 36;
    } else {
      // Desktop/tablet
      return 52;
    }
  };

  const whiteKeyWidth = getKeyWidth();
  const whiteKeyHeight = isLandscape
    ? Math.min(height * 0.55, 280)
    : Math.min(height * 0.35, 240);

  // Scroll to center on mount and orientation change
  useEffect(() => {
    const middleIndex = Math.floor(whiteKeys.length / 2);
    const scrollPosition = middleIndex * (whiteKeyWidth + 2) - width / 2 + whiteKeyWidth / 2;
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: Math.max(0, scrollPosition), animated: false });
    }, 150);
  }, [width, whiteKeyWidth, whiteKeys.length]);

  // Calculate black key positions
  const getWhiteKeyIndexForBlackKey = (blackNote: NoteDefinition): number => {
    const noteIndex = NOTES.indexOf(blackNote);
    return NOTES.filter((n, i) => i < noteIndex && n.type === 'white').length;
  };

  // Calculate animation delays for wave effect
  const getAnimationDelay = (index: number, total: number) => {
    const center = Math.floor(total / 2);
    const distance = Math.abs(index - center);
    return distance * 30; // 30ms delay per key from center
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
      <StatusBar style="light" />

      {/* Header - compact on mobile */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: isNarrowMobile ? 12 : 16,
          paddingVertical: isNarrowMobile ? 8 : 12,
          borderBottomWidth: 1,
          borderBottomColor: '#2a2a4a',
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, padding: 6 }}
        >
          <FontAwesome name="arrow-left" size={isNarrowMobile ? 18 : 20} color="#fff" />
          {!isNarrowMobile && (
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Back</Text>
          )}
        </Pressable>

        <Text style={{ color: '#fff', fontSize: isNarrowMobile ? 16 : 20, fontWeight: '700' }}>
          Virtual Piano
        </Text>

        <View style={{ width: isNarrowMobile ? 30 : 80 }} />
      </View>

      {/* Instrument Selection - scrollable chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingVertical: 8,
          gap: 6,
        }}
        style={{ backgroundColor: '#252545', maxHeight: isNarrowMobile ? 48 : 56 }}
      >
        {Object.entries(INSTRUMENTS).map(([key, { name, icon }]) => (
          <Pressable
            key={key}
            onPress={async () => {
              if (!audioStarted && Tone) {
                await Tone.start();
                setAudioStarted(true);
              }
              setInstrument(key);
            }}
            style={{
              paddingHorizontal: isNarrowMobile ? 10 : 14,
              paddingVertical: isNarrowMobile ? 6 : 8,
              borderRadius: 14,
              backgroundColor: instrument === key ? '#7c3aed' : 'rgba(255,255,255,0.08)',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Ionicons name={icon as any} size={isNarrowMobile ? 12 : 14} color={instrument === key ? '#fff' : '#94a3b8'} />
            <Text style={{ color: '#fff', fontSize: isNarrowMobile ? 11 : 12, fontWeight: '600' }}>{name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Controls Row - simplified on mobile */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: isNarrowMobile ? 6 : 10,
          paddingHorizontal: 10,
          gap: isNarrowMobile ? 10 : 16,
          backgroundColor: '#1e1e3a',
        }}
      >
        {/* Reverb Control */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="water" size={isNarrowMobile ? 14 : 16} color="#94a3b8" />
          <View style={{ flexDirection: 'row', gap: 3 }}>
            {[0, 30, 60, 100].map((r) => (
              <Pressable
                key={r}
                onPress={() => setReverb(r)}
                style={{
                  width: isNarrowMobile ? 24 : 28,
                  height: isNarrowMobile ? 24 : 28,
                  borderRadius: 6,
                  backgroundColor: reverb === r ? '#0891b2' : '#3a3a5a',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontSize: isNarrowMobile ? 9 : 10 }}>{r}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Keyboard Hints - desktop only */}
      {Platform.OS === 'web' && !isNarrowMobile && (
        <View style={{ paddingVertical: 6, paddingHorizontal: 16, backgroundColor: '#1a1a2e' }}>
          <Text style={{ color: '#475569', fontSize: 10, textAlign: 'center' }}>
            White keys: A S D F G H J K L ; | Black keys: W E T Y U O P
          </Text>
        </View>
      )}

      {/* Piano */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View
          style={{
            backgroundColor: '#252545',
            paddingVertical: isNarrowMobile ? 10 : 16,
            paddingHorizontal: 4,
            marginHorizontal: 4,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 10,
          }}
        >
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
          >
            <View style={{ flexDirection: 'row', height: whiteKeyHeight, position: 'relative' }}>
              {/* White Keys */}
              {whiteKeys.map((noteObj, index) => (
                <PianoKey
                  key={noteObj.note}
                  noteObj={noteObj}
                  isActive={noteObj.key ? activeKeys.has(noteObj.key) : false}
                  onPress={() => {
                    if (noteObj.key) {
                      setActiveKeys((prev) => new Set([...prev, noteObj.key]));
                    }
                    playNote(noteObj.note);
                  }}
                  onRelease={() => {
                    if (noteObj.key) {
                      setActiveKeys((prev) => {
                        const next = new Set(prev);
                        next.delete(noteObj.key);
                        return next;
                      });
                    }
                    releaseNote(noteObj.note);
                  }}
                  whiteKeyWidth={whiteKeyWidth}
                  whiteKeyHeight={whiteKeyHeight}
                  whiteKeyIndex={index}
                  animationDelay={getAnimationDelay(index, whiteKeys.length)}
                  isAnimating={isAnimating}
                />
              ))}

              {/* Black Keys */}
              {blackKeys.map((noteObj, index) => (
                <PianoKey
                  key={noteObj.note}
                  noteObj={noteObj}
                  isActive={noteObj.key ? activeKeys.has(noteObj.key) : false}
                  onPress={() => {
                    if (noteObj.key) {
                      setActiveKeys((prev) => new Set([...prev, noteObj.key]));
                    }
                    playNote(noteObj.note);
                  }}
                  onRelease={() => {
                    if (noteObj.key) {
                      setActiveKeys((prev) => {
                        const next = new Set(prev);
                        next.delete(noteObj.key);
                        return next;
                      });
                    }
                    releaseNote(noteObj.note);
                  }}
                  whiteKeyWidth={whiteKeyWidth}
                  whiteKeyHeight={whiteKeyHeight}
                  whiteKeyIndex={getWhiteKeyIndexForBlackKey(noteObj)}
                  animationDelay={getAnimationDelay(index, blackKeys.length) + 100}
                  isAnimating={isAnimating}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
