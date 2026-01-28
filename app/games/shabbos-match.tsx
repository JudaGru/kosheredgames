import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, G, Ellipse, Line } from 'react-native-svg';
import { useDeviceType } from '@/hooks/useDeviceType';

// Custom SVG Icons for Shabbos items
function CandlesIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Left candle */}
      <Rect x="14" y="24" width="10" height="32" rx="2" fill={color} />
      <Ellipse cx="19" cy="24" rx="5" ry="2" fill={color} />
      {/* Left flame */}
      <Path d="M19 8 C19 8 14 16 14 20 C14 23 16 24 19 24 C22 24 24 23 24 20 C24 16 19 8 19 8Z" fill="#fbbf24" />
      <Path d="M19 12 C19 12 17 16 17 18 C17 20 18 21 19 21 C20 21 21 20 21 18 C21 16 19 12 19 12Z" fill="#fef3c7" />
      {/* Right candle */}
      <Rect x="40" y="24" width="10" height="32" rx="2" fill={color} />
      <Ellipse cx="45" cy="24" rx="5" ry="2" fill={color} />
      {/* Right flame */}
      <Path d="M45 8 C45 8 40 16 40 20 C40 23 42 24 45 24 C48 24 50 23 50 20 C50 16 45 8 45 8Z" fill="#fbbf24" />
      <Path d="M45 12 C45 12 43 16 43 18 C43 20 44 21 45 21 C46 21 47 20 47 18 C47 16 45 12 45 12Z" fill="#fef3c7" />
      {/* Candlestick base */}
      <Rect x="8" y="56" width="48" height="4" rx="2" fill="#a16207" />
    </Svg>
  );
}

function ChallahIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Braided challah shape */}
      <Path d="M8 40 Q8 28 20 26 Q32 24 44 26 Q56 28 56 40 Q56 52 44 54 Q32 56 20 54 Q8 52 8 40Z" fill={color} />
      {/* Braid lines */}
      <Path d="M16 32 Q24 28 32 32 Q40 36 48 32" stroke="#fef3c7" strokeWidth="3" fill="none" />
      <Path d="M14 40 Q24 36 32 40 Q40 44 50 40" stroke="#fef3c7" strokeWidth="3" fill="none" />
      <Path d="M16 48 Q24 44 32 48 Q40 52 48 48" stroke="#fef3c7" strokeWidth="3" fill="none" />
      {/* Seeds/sesame on top */}
      <Circle cx="20" cy="30" r="1.5" fill="#fef3c7" />
      <Circle cx="28" cy="28" r="1.5" fill="#fef3c7" />
      <Circle cx="36" cy="28" r="1.5" fill="#fef3c7" />
      <Circle cx="44" cy="30" r="1.5" fill="#fef3c7" />
    </Svg>
  );
}

function WineIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Wine glass stem */}
      <Rect x="29" y="38" width="6" height="16" fill="#94a3b8" />
      {/* Wine glass base */}
      <Ellipse cx="32" cy="56" rx="12" ry="4" fill="#94a3b8" />
      {/* Wine glass bowl */}
      <Path d="M16 12 L16 28 Q16 40 32 40 Q48 40 48 28 L48 12 Z" fill="white" stroke="#94a3b8" strokeWidth="2" />
      {/* Wine liquid */}
      <Path d="M18 18 L18 28 Q18 38 32 38 Q46 38 46 28 L46 18 Z" fill={color} />
      {/* Glass shine */}
      <Path d="M22 14 L22 22" stroke="white" strokeWidth="2" opacity="0.6" />
    </Svg>
  );
}

function KiddushCupIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Cup body */}
      <Path d="M18 8 L14 44 Q14 52 32 52 Q50 52 50 44 L46 8 Z" fill={color} />
      {/* Cup base */}
      <Ellipse cx="32" cy="56" rx="14" ry="4" fill={color} />
      <Rect x="28" y="52" width="8" height="4" fill={color} />
      {/* Decorative band */}
      <Rect x="16" y="20" width="32" height="4" fill="#fef3c7" />
      <Rect x="15" y="36" width="34" height="4" fill="#fef3c7" />
      {/* Star of David decoration */}
      <Path d="M32 26 L35 32 L29 32 Z" fill="#fef3c7" />
      <Path d="M32 34 L35 28 L29 28 Z" fill="#fef3c7" />
    </Svg>
  );
}

function ZemirosIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Open songbook */}
      <Path d="M8 16 L32 20 L32 56 L8 52 Z" fill="#fef3c7" />
      <Path d="M56 16 L32 20 L32 56 L56 52 Z" fill="#fef3c7" />
      {/* Book spine */}
      <Rect x="30" y="18" width="4" height="40" fill={color} />
      {/* Music notes on left page */}
      <Circle cx="16" cy="28" r="3" fill={color} />
      <Line x1="19" y1="28" x2="19" y2="20" stroke={color} strokeWidth="2" />
      <Circle cx="24" cy="34" r="3" fill={color} />
      <Line x1="27" y1="34" x2="27" y2="26" stroke={color} strokeWidth="2" />
      {/* Music notes on right page */}
      <Circle cx="40" cy="30" r="3" fill={color} />
      <Line x1="43" y1="30" x2="43" y2="22" stroke={color} strokeWidth="2" />
      <Circle cx="48" cy="36" r="3" fill={color} />
      <Line x1="51" y1="36" x2="51" y2="28" stroke={color} strokeWidth="2" />
      {/* Text lines */}
      <Line x1="12" y1="42" x2="26" y2="44" stroke="#94a3b8" strokeWidth="1" />
      <Line x1="12" y1="46" x2="24" y2="48" stroke="#94a3b8" strokeWidth="1" />
      <Line x1="38" y1="44" x2="52" y2="42" stroke="#94a3b8" strokeWidth="1" />
      <Line x1="38" y1="48" x2="50" y2="46" stroke="#94a3b8" strokeWidth="1" />
      {/* Floating music notes */}
      <Circle cx="20" cy="10" r="2" fill={color} opacity="0.6" />
      <Line x1="22" y1="10" x2="22" y2="6" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <Circle cx="44" cy="8" r="2" fill={color} opacity="0.6" />
      <Line x1="46" y1="8" x2="46" y2="4" stroke={color} strokeWidth="1.5" opacity="0.6" />
    </Svg>
  );
}

function ShulIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Building base */}
      <Rect x="10" y="28" width="44" height="28" fill={color} />
      {/* Roof/dome */}
      <Path d="M8 28 L32 10 L56 28 Z" fill={color} />
      {/* Door */}
      <Path d="M26 40 L26 56 L38 56 L38 40 Q38 34 32 34 Q26 34 26 40Z" fill="#1e3a8a" />
      {/* Windows */}
      <Rect x="14" y="36" width="8" height="10" rx="4" fill="#bfdbfe" />
      <Rect x="42" y="36" width="8" height="10" rx="4" fill="#bfdbfe" />
      {/* Star of David on top */}
      <Circle cx="32" cy="16" r="6" fill="#fef3c7" />
    </Svg>
  );
}

function DaveningIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Person shape - head */}
      <Circle cx="32" cy="14" r="8" fill="#fcd9b6" />
      {/* Yarmulke */}
      <Path d="M24 12 Q32 6 40 12" fill={color} />
      {/* Body */}
      <Path d="M24 22 L24 48 L40 48 L40 22 Q40 18 32 18 Q24 18 24 22Z" fill={color} />
      {/* Arms raised in prayer */}
      <Path d="M24 28 L12 20 L10 24 L22 34Z" fill={color} />
      <Path d="M40 28 L52 20 L54 24 L42 34Z" fill={color} />
      {/* Hands */}
      <Circle cx="10" cy="22" r="4" fill="#fcd9b6" />
      <Circle cx="54" cy="22" r="4" fill="#fcd9b6" />
      {/* Tallis stripes */}
      <Line x1="26" y1="24" x2="26" y2="46" stroke="#1e3a8a" strokeWidth="1" />
      <Line x1="38" y1="24" x2="38" y2="46" stroke="#1e3a8a" strokeWidth="1" />
    </Svg>
  );
}

function SeferIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Book cover */}
      <Rect x="12" y="12" width="40" height="44" rx="2" fill={color} />
      {/* Book spine */}
      <Rect x="12" y="12" width="6" height="44" fill="#0f766e" />
      {/* Pages */}
      <Rect x="18" y="14" width="32" height="40" fill="#fef3c7" />
      {/* Text lines */}
      <Line x1="22" y1="22" x2="46" y2="22" stroke="#94a3b8" strokeWidth="1" />
      <Line x1="22" y1="28" x2="46" y2="28" stroke="#94a3b8" strokeWidth="1" />
      <Line x1="22" y1="34" x2="46" y2="34" stroke="#94a3b8" strokeWidth="1" />
      <Line x1="22" y1="40" x2="46" y2="40" stroke="#94a3b8" strokeWidth="1" />
      <Line x1="22" y1="46" x2="38" y2="46" stroke="#94a3b8" strokeWidth="1" />
    </Svg>
  );
}

function FamilyIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Father */}
      <Circle cx="16" cy="18" r="6" fill="#fcd9b6" />
      <Rect x="10" y="24" width="12" height="20" rx="2" fill={color} />
      {/* Mother */}
      <Circle cx="48" cy="18" r="6" fill="#fcd9b6" />
      <Path d="M42 24 L42 44 L54 44 L54 24 Q48 20 42 24Z" fill="#ec4899" />
      {/* Child 1 */}
      <Circle cx="28" cy="28" r="5" fill="#fcd9b6" />
      <Rect x="23" y="33" width="10" height="14" rx="2" fill="#22c55e" />
      {/* Child 2 */}
      <Circle cx="40" cy="30" r="4" fill="#fcd9b6" />
      <Rect x="36" y="34" width="8" height="12" rx="2" fill="#3b82f6" />
      {/* Table */}
      <Rect x="8" y="52" width="48" height="4" rx="1" fill="#a16207" />
    </Svg>
  );
}

function RestIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Bed frame */}
      <Rect x="8" y="36" width="48" height="20" rx="4" fill="#a16207" />
      {/* Mattress */}
      <Rect x="10" y="28" width="44" height="12" rx="2" fill="white" />
      {/* Pillow */}
      <Ellipse cx="20" cy="32" rx="8" ry="5" fill={color} />
      {/* Blanket */}
      <Path d="M10 34 L54 34 L54 44 Q32 50 10 44 Z" fill={color} />
      {/* Zzz */}
      <Path d="M44 14 L52 14 L44 22 L52 22" stroke="#64748b" strokeWidth="2" fill="none" />
      <Path d="M50 6 L56 6 L50 12 L56 12" stroke="#64748b" strokeWidth="1.5" fill="none" />
    </Svg>
  );
}

function HavdalahIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Moon */}
      <Path d="M44 8 Q56 16 56 32 Q56 48 44 56 Q52 48 52 32 Q52 16 44 8Z" fill={color} />
      {/* Stars */}
      <Circle cx="20" cy="16" r="2" fill="#fbbf24" />
      <Circle cx="12" cy="28" r="1.5" fill="#fbbf24" />
      <Circle cx="24" cy="36" r="1.5" fill="#fbbf24" />
      {/* Havdalah candle (braided) */}
      <Path d="M28 40 Q32 38 36 40 L36 58 Q32 60 28 58 Z" fill="#3b82f6" />
      <Path d="M30 40 Q32 42 34 40" stroke="#60a5fa" strokeWidth="1" fill="none" />
      <Path d="M30 46 Q32 48 34 46" stroke="#60a5fa" strokeWidth="1" fill="none" />
      <Path d="M30 52 Q32 54 34 52" stroke="#60a5fa" strokeWidth="1" fill="none" />
      {/* Flame */}
      <Path d="M32 28 C32 28 28 34 28 38 C28 40 30 41 32 41 C34 41 36 40 36 38 C36 34 32 28 32 28Z" fill="#fbbf24" />
    </Svg>
  );
}

function BesamimIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Spice tower base */}
      <Rect x="24" y="48" width="16" height="8" rx="2" fill="#94a3b8" />
      {/* Tower body */}
      <Path d="M22 20 L20 48 L44 48 L42 20 Z" fill="#94a3b8" />
      {/* Tower top/dome */}
      <Path d="M22 20 Q32 8 42 20 Z" fill="#94a3b8" />
      {/* Flag on top */}
      <Line x1="32" y1="8" x2="32" y2="16" stroke="#94a3b8" strokeWidth="2" />
      <Path d="M32 8 L40 12 L32 16 Z" fill={color} />
      {/* Decorative holes */}
      <Circle cx="28" cy="28" r="2" fill="#1e293b" />
      <Circle cx="36" cy="28" r="2" fill="#1e293b" />
      <Circle cx="32" cy="36" r="2" fill="#1e293b" />
      <Circle cx="28" cy="42" r="2" fill="#1e293b" />
      <Circle cx="36" cy="42" r="2" fill="#1e293b" />
      {/* Spice aroma lines */}
      <Path d="M18 16 Q16 12 18 8" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
      <Path d="M46 16 Q48 12 46 8" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
    </Svg>
  );
}

// Map item IDs to their icon components
function ShabbosIcon({ itemId, size, color }: { itemId: string; size: number; color: string }) {
  switch (itemId) {
    case 'candles': return <CandlesIcon size={size} color={color} />;
    case 'challah': return <ChallahIcon size={size} color={color} />;
    case 'wine': return <WineIcon size={size} color={color} />;
    case 'kiddush': return <KiddushCupIcon size={size} color={color} />;
    case 'zemiros': return <ZemirosIcon size={size} color={color} />;
    case 'shul': return <ShulIcon size={size} color={color} />;
    case 'davening': return <DaveningIcon size={size} color={color} />;
    case 'sefer': return <SeferIcon size={size} color={color} />;
    case 'family': return <FamilyIcon size={size} color={color} />;
    case 'rest': return <RestIcon size={size} color={color} />;
    case 'havdalah': return <HavdalahIcon size={size} color={color} />;
    case 'besamim': return <BesamimIcon size={size} color={color} />;
    default: return null;
  }
}

// Shabbos items data with Hebrew names including nekudos
const SHABBOS_DATA = [
  { id: 'candles', name: 'Licht', hebrew: 'נֵרוֹת', symbol: '🕯️', color: '#eab308' },
  { id: 'challah', name: 'Challah', hebrew: 'חַלָּה', symbol: '🍞', color: '#92400e' },
  { id: 'wine', name: 'Kiddush', hebrew: 'קִדּוּשׁ', symbol: '🍷', color: '#7c3aed' },
  { id: 'kiddush', name: 'Becher', hebrew: 'כּוֹס', symbol: '🏆', color: '#f59e0b' },
  { id: 'zemiros', name: 'Zemiros', hebrew: 'זְמִירוֹת', symbol: '🎵', color: '#ec4899' },
  { id: 'shul', name: 'Shul', hebrew: 'בֵּית כְּנֶסֶת', symbol: '🏛️', color: '#0ea5e9' },
  { id: 'davening', name: 'Davening', hebrew: 'תְּפִלָּה', symbol: '🙏', color: '#8b5cf6' },
  { id: 'sefer', name: 'Sefer', hebrew: 'סֵפֶר', symbol: '📖', color: '#14b8a6' },
  { id: 'family', name: 'Mishpacha', hebrew: 'מִשְׁפָּחָה', symbol: '👨‍👩‍👧‍👦', color: '#f97316' },
  { id: 'rest', name: 'Menucha', hebrew: 'מְנוּחָה', symbol: '😴', color: '#64748b' },
  { id: 'havdalah', name: 'Havdalah', hebrew: 'הַבְדָּלָה', symbol: '🌙', color: '#1e3a8a' },
  { id: 'besamim', name: 'Besamim', hebrew: 'בְּשָׂמִים', symbol: '🌿', color: '#22c55e' },
];

const PLAYER_COLORS = [
  { name: 'Player 1', color: '#eab308', bgColor: '#fef9c3', darkColor: '#a16207' },
  { name: 'Player 2', color: '#0ea5e9', bgColor: '#e0f2fe', darkColor: '#075985' },
  { name: 'Player 3', color: '#8b5cf6', bgColor: '#ede9fe', darkColor: '#5b21b6' },
  { name: 'Player 4', color: '#10b981', bgColor: '#d1fae5', darkColor: '#047857' },
];

interface Card {
  id: string;
  itemId: string;
  symbol: string;
  name: string;
  hebrew: string;
  color: string;
}

interface Player {
  id: number;
  name: string;
  color: string;
  bgColor: string;
  darkColor: string;
  matches: number;
  matchedCardIds: Set<string>;
}

interface CardComponentProps {
  card: Card;
  isFlipped: boolean;
  isMatched: boolean;
  matchedByPlayerId?: number;
  onPress: () => void;
  disabled: boolean;
  cardSize: number;
  index: number;
}

function CardComponent({ card, isFlipped, isMatched, matchedByPlayerId, onPress, disabled, cardSize, index }: CardComponentProps) {
  const flipProgress = useSharedValue(0);
  const scale = useSharedValue(1);
  const matchGlow = useSharedValue(0);
  const entranceAnim = useSharedValue(0);

  useEffect(() => { entranceAnim.value = withDelay(index * 30, withSpring(1, { damping: 12, stiffness: 100 })); }, [index]);
  useEffect(() => { flipProgress.value = withTiming(isFlipped || isMatched ? 1 : 0, { duration: 350, easing: Easing.out(Easing.cubic) }); }, [isFlipped, isMatched]);
  useEffect(() => {
    if (isMatched) {
      scale.value = withSequence(withSpring(1.15, { damping: 8, stiffness: 200 }), withSpring(1, { damping: 10, stiffness: 150 }));
      matchGlow.value = withSequence(withTiming(1, { duration: 200 }), withTiming(0.3, { duration: 400 }));
    }
  }, [isMatched]);

  const containerStyle = useAnimatedStyle(() => ({ transform: [{ scale: entranceAnim.value }], opacity: entranceAnim.value }));
  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${interpolate(flipProgress.value, [0, 1], [0, 180])}deg` }, { scale: scale.value }],
    opacity: flipProgress.value < 0.5 ? 1 : 0,
  }));
  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${interpolate(flipProgress.value, [0, 1], [180, 360])}deg` }, { scale: scale.value }],
    opacity: flipProgress.value >= 0.5 ? 1 : 0,
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: matchGlow.value }));

  const margin = cardSize > 60 ? 5 : 3;
  const glowColor = matchedByPlayerId !== undefined ? PLAYER_COLORS[matchedByPlayerId].color : '#eab308';

  return (
    <Animated.View style={[containerStyle, { margin }]}>
      <Pressable onPress={onPress} disabled={disabled || isFlipped || isMatched} style={{ width: cardSize, height: cardSize * 1.25 }}>
        {isMatched && <Animated.View style={[glowStyle, { position: 'absolute', top: -4, left: -4, right: -4, bottom: -4, borderRadius: 14, backgroundColor: glowColor }]} />}

        <Animated.View
          style={[frontAnimatedStyle, {
            position: 'absolute', width: '100%', height: '100%', backgroundColor: '#eab308', borderRadius: 10,
            justifyContent: 'center', alignItems: 'center', backfaceVisibility: 'hidden',
            shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5,
          }]}
        >
          <View style={{ position: 'absolute', width: '80%', height: '85%', borderRadius: 6, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' }} />
          <CandlesIcon size={cardSize * 0.5} color="white" />
        </Animated.View>

        <Animated.View
          style={[backAnimatedStyle, {
            position: 'absolute', width: '100%', height: '100%',
            backgroundColor: isMatched ? PLAYER_COLORS[matchedByPlayerId ?? 0].bgColor : 'white',
            borderRadius: 10, justifyContent: 'center', alignItems: 'center', backfaceVisibility: 'hidden',
            borderWidth: isMatched ? 3 : 1, borderColor: isMatched ? glowColor : '#e2e8f0',
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, paddingVertical: 4,
          }]}
        >
          <ShabbosIcon itemId={card.itemId} size={cardSize * 0.55} color={card.color} />
          <Text style={{ fontSize: cardSize * 0.13, fontWeight: '600', color: card.color, textAlign: 'center', marginTop: 2 }}>{card.name}</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

function Confetti() {
  return (
    <View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 100 }} pointerEvents="none">
      {Array.from({ length: 50 }).map((_, i) => <ConfettiParticle key={i} index={i} />)}
    </View>
  );
}

function ConfettiParticle({ index }: { index: number }) {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const emojis = ['✨', '🕯️', '🍞', '🍷', '💫', '🌙', '⭐'];
  const emoji = emojis[index % emojis.length];
  const startLeft = useRef(10 + Math.random() * 80).current;
  const fontSize = useRef(20 + Math.random() * 12).current;

  useEffect(() => {
    const randomDelay = Math.random() * 400;
    const randomX = (Math.random() - 0.5) * 200;
    const fallDuration = 2000 + Math.random() * 1000;

    opacity.value = withDelay(randomDelay, withTiming(1, { duration: 200 }));
    scale.value = withDelay(randomDelay, withSpring(1, { damping: 10 }));
    translateY.value = withDelay(randomDelay, withTiming(600, { duration: fallDuration, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) }));
    translateX.value = withDelay(randomDelay, withTiming(randomX, { duration: fallDuration }));
    rotate.value = withDelay(randomDelay, withTiming(360 * (Math.random() > 0.5 ? 2 : -2), { duration: fallDuration }));
    opacity.value = withDelay(randomDelay + fallDuration * 0.7, withTiming(0, { duration: 600 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }, { rotate: `${rotate.value}deg` }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[animStyle, { position: 'absolute', left: `${startLeft}%`, top: -50 }]}><Text style={{ fontSize }}>{emoji}</Text></Animated.View>;
}

function PlayerIndicator({ player, isActive, matchCount, position }: { player: Player; isActive: boolean; matchCount: number; position: number }) {
  const scale = useSharedValue(0.9);
  useEffect(() => { scale.value = withSpring(isActive ? 1 : 0.9, { damping: 8, stiffness: 150 }); }, [isActive]);
  const containerStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeIn.duration(300).delay(position * 100)} style={[containerStyle, { alignItems: 'center' }]}>
      <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: isActive ? player.color : player.bgColor, borderWidth: 3, borderColor: isActive ? player.darkColor : player.color, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: isActive ? 'white' : player.darkColor }}>{matchCount}</Text>
      </View>
      <Text style={{ fontSize: 11, fontWeight: isActive ? '700' : '600', color: isActive ? player.darkColor : '#64748b', marginTop: 6 }}>{player.name}</Text>
    </Animated.View>
  );
}

function PlayerOptionButton({
  playerCount,
  index,
  onPress
}: {
  playerCount: number;
  index: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const shadowIntensity = useSharedValue(0.08);
  const borderColor = useSharedValue(0);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handleHoverIn = () => {
    scale.value = withSpring(1.02, { damping: 12, stiffness: 200 });
    shadowIntensity.value = withTiming(0.18, { duration: 200 });
    borderColor.value = withTiming(1, { duration: 200 });
  };

  const handleHoverOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    shadowIntensity.value = withTiming(0.08, { duration: 200 });
    borderColor.value = withTiming(0, { duration: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    shadowOpacity: shadowIntensity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value === 1 ? '#eab308' : '#fde68a',
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(400).delay(index * 120)}
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
      >
        <Animated.View
          style={[
            containerStyle,
            shadowStyle,
            {
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 20,
              borderWidth: 2,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              shadowColor: '#eab308',
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 8,
              elevation: 3,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#a16207' }}>
              {playerCount === 1 ? 'Solo' : `${playerCount} Players`}
            </Text>
            <Text style={{ fontSize: 14, color: '#ca8a04', marginTop: 4 }}>
              {playerCount === 1 ? 'Play by yourself' : `Compete with ${playerCount} players`}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 6 }}>
            {Array(playerCount)
              .fill(0)
              .map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: PLAYER_COLORS[i].color,
                    borderWidth: 2.5,
                    borderColor: 'white',
                    shadowColor: PLAYER_COLORS[i].color,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                />
              ))}
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

function HeaderButton({ onPress, icon }: { onPress: () => void; icon: string }) {
  const isWeb = Platform.OS === 'web';
  const scale = useSharedValue(1);
  const bgColor = useSharedValue(0);

  const handleHoverIn = () => {
    if (isWeb) {
      scale.value = withSpring(1.1, { damping: 15, stiffness: 300 });
      bgColor.value = withTiming(1, { duration: 150 });
    }
  };

  const handleHoverOut = () => {
    if (isWeb) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      bgColor.value = withTiming(0, { duration: 150 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: bgColor.value === 1 ? '#fde68a' : '#fef9c3',
  }));

  return (
    <Pressable onPress={onPress} onHoverIn={handleHoverIn} onHoverOut={handleHoverOut}>
      <Animated.View style={[animatedStyle, {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
      }]}>
        <FontAwesome name={icon as any} size={18} color="#a16207" />
      </Animated.View>
    </Pressable>
  );
}

function PlayerSetupScreen({ onStartGame }: { onStartGame: (playerCount: number) => void }) {
  const isWeb = Platform.OS === 'web';
  const [backHovered, setBackHovered] = useState(false);

  const displayItems = [
    { symbol: '🕯️', color: '#eab308' },
    { symbol: '🍞', color: '#92400e' },
    { symbol: '🍷', color: '#7c3aed' },
    { symbol: '🌙', color: '#1e3a8a' },
    { symbol: '🌿', color: '#22c55e' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-yellow-50">
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: isWeb ? 24 : 16,
          paddingHorizontal: 24,
        }}
      >
        <Animated.View
          entering={FadeIn.duration(500)}
          className="items-center"
          style={{ width: '100%', maxWidth: 380, marginBottom: isWeb ? 40 : 24 }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: isWeb ? 20 : 12,
              gap: isWeb ? 12 : 4,
            }}
          >
            {displayItems.map((item, index) => (
              <Animated.View
                key={index}
                entering={FadeIn.duration(400).delay(100 + index * 80)}
                style={{
                  width: isWeb ? 52 : 40,
                  height: isWeb ? 52 : 40,
                  borderRadius: isWeb ? 26 : 20,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: item.color,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  elevation: 3,
                  borderWidth: 2,
                  borderColor: item.color + '30',
                }}
              >
                <Text style={{ fontSize: isWeb ? 24 : 18 }}>{item.symbol}</Text>
              </Animated.View>
            ))}
          </View>

          <View className="items-center">
            <Text
              style={{
                fontSize: isWeb ? 42 : 34,
                fontWeight: '800',
                color: '#a16207',
                letterSpacing: -1,
              }}
            >
              Shabbos
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 8,
                marginBottom: isWeb ? 16 : 8,
                gap: 8,
              }}
            >
              <View style={{ height: 1, width: 40, backgroundColor: '#fde68a' }} />
              <Text
                style={{
                  fontSize: 14,
                  color: '#ca8a04',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: 2
                }}
              >
                Memory Match
              </Text>
              <View style={{ height: 1, width: 40, backgroundColor: '#fde68a' }} />
            </View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(500).delay(300)}
          style={{ width: '100%', maxWidth: 340, gap: 14 }}
        >
          {[1, 2, 3, 4].map((playerCount, index) => (
            <PlayerOptionButton
              key={playerCount}
              playerCount={playerCount}
              index={index}
              onPress={() => onStartGame(playerCount)}
            />
          ))}
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(600)}>
          <Pressable
            onPress={() => router.back()}
            onHoverIn={isWeb ? () => setBackHovered(true) : undefined}
            onHoverOut={isWeb ? () => setBackHovered(false) : undefined}
            style={{
              marginTop: isWeb ? 32 : 16,
              paddingVertical: 10,
              paddingHorizontal: 24,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: backHovered ? '#fef9c3' : 'transparent',
              borderRadius: 8,
            }}
          >
            <FontAwesome name="arrow-left" size={14} color={backHovered ? '#a16207' : '#ca8a04'} />
            <Text style={{ color: backHovered ? '#a16207' : '#ca8a04', fontWeight: '600', fontSize: 15 }}>Back</Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

function VictoryScreen({ playerCount, players, playerMatches, elapsedTime, onPlayAgain, onBackToHome }: { playerCount: number; players: Player[]; playerMatches: Map<number, Set<string>>; elapsedTime: number; onPlayAgain: () => void; onBackToHome: () => void }) {
  const isWeb = Platform.OS === 'web';
  const trophyScale = useSharedValue(0);
  const trophyRotate = useSharedValue(0);

  useEffect(() => {
    trophyScale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 100 }));
    trophyRotate.value = withDelay(300, withSequence(
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 200 }),
      withTiming(-5, { duration: 150 }),
      withTiming(5, { duration: 150 }),
      withTiming(0, { duration: 100 })
    ));
  }, []);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }, { rotate: `${trophyRotate.value}deg` }],
  }));

  const playAgainScale = useSharedValue(1);
  const backScale = useSharedValue(1);

  const handlePlayAgainHoverIn = () => {
    if (Platform.OS === 'web') {
      playAgainScale.value = withSpring(1.05, { damping: 15, stiffness: 300 });
    }
  };

  const handlePlayAgainHoverOut = () => {
    if (Platform.OS === 'web') {
      playAgainScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const handleBackHoverIn = () => {
    if (Platform.OS === 'web') {
      backScale.value = withSpring(1.05, { damping: 15, stiffness: 300 });
    }
  };

  const handleBackHoverOut = () => {
    if (Platform.OS === 'web') {
      backScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const playAgainStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playAgainScale.value }],
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(161, 98, 7, 0.9)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Confetti />
      <Animated.View entering={FadeIn.duration(400).delay(200)} style={{
        backgroundColor: 'white',
        borderRadius: 24,
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
        padding: isWeb ? 48 : 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
      }}>
        <Animated.View style={trophyStyle}>
          <Text style={{ fontSize: 80 }}>🏆</Text>
        </Animated.View>

        <Text style={{
          fontSize: isWeb ? 36 : 32,
          fontWeight: 'bold',
          color: '#a16207',
          marginTop: 20,
          textAlign: 'center',
        }}>
          Gut Shabbos!
        </Text>

        <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 8, fontSize: 16 }}>
          {playerCount === 1 ? 'All Shabbos items matched!' : 'Game Complete!'}
        </Text>

        {playerCount > 1 ? (
          <View style={{ marginTop: 24, width: '100%' }}>
            {players.sort((a, b) => (playerMatches.get(b.id)?.size ?? 0) - (playerMatches.get(a.id)?.size ?? 0)).map((player, idx) => (
              <Animated.View
                key={player.id}
                entering={FadeIn.duration(300).delay(400 + idx * 100)}
                style={{
                  backgroundColor: player.bgColor,
                  borderLeftWidth: 5,
                  borderLeftColor: player.color,
                  padding: 16,
                  marginBottom: 8,
                  borderRadius: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontWeight: 'bold', color: player.darkColor, fontSize: 16 }}>
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : ''} {player.name}
                </Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: player.color }}>
                  {Math.floor((playerMatches.get(player.id)?.size ?? 0) / 2)}
                </Text>
              </Animated.View>
            ))}
          </View>
        ) : (
          <View style={{ marginTop: 24, backgroundColor: '#fef9c3', borderRadius: 16, padding: 24, width: '100%' }}>
            <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#a16207', textAlign: 'center' }}>{elapsedTime}</Text>
            <Text style={{ color: '#ca8a04', textAlign: 'center', marginTop: 4, fontWeight: '600', letterSpacing: 2 }}>SECONDS</Text>
          </View>
        )}

        <Pressable
          onPress={onPlayAgain}
          onHoverIn={handlePlayAgainHoverIn}
          onHoverOut={handlePlayAgainHoverOut}
          style={{ width: '100%', marginTop: 32 }}
        >
          <Animated.View style={[playAgainStyle, {
            backgroundColor: '#eab308',
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 32,
          }]}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>Play Again</Text>
          </Animated.View>
        </Pressable>

        <Pressable
          onPress={onBackToHome}
          onHoverIn={handleBackHoverIn}
          onHoverOut={handleBackHoverOut}
          style={{ marginTop: 16, padding: 12 }}
        >
          <Animated.View style={backStyle}>
            <Text style={{ color: '#64748b', fontWeight: '600' }}>Back to Home</Text>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default function ShabbosMatchGame() {
  const { isMobile, isLoading: isDetectingDevice } = useDeviceType();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [gameStarted, setGameStarted] = useState(false);
  const [playerCount, setPlayerCount] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [playerMatches, setPlayerMatches] = useState<Map<number, Set<string>>>(new Map());
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [firstCardFlipped, setFirstCardFlipped] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const isProcessing = useRef(false);

  const calculateCardSize = useCallback(() => {
    const padding = 16;
    const headerHeight = isMobile ? 200 : 160;
    const availableWidth = screenWidth - padding;
    const availableHeight = screenHeight - headerHeight - padding;
    if (isMobile) {
      const maxCardWidth = (availableWidth - 30) / 4;
      const maxCardHeight = (availableHeight - 50) / 6 / 1.25;
      return Math.min(maxCardWidth, maxCardHeight, 65);
    } else {
      const maxCardWidth = (availableWidth - 60) / 6;
      const maxCardHeight = (availableHeight - 40) / 4 / 1.25;
      return Math.min(maxCardWidth, maxCardHeight, 80);
    }
  }, [screenWidth, screenHeight, isMobile]);

  const cardSize = calculateCardSize();

  const initializeGame = useCallback((newPlayers?: Player[]) => {
    const gameCards: Card[] = [];
    SHABBOS_DATA.forEach((item) => {
      gameCards.push({ id: `${item.id}-1`, itemId: item.id, symbol: item.symbol, name: item.name, hebrew: item.hebrew, color: item.color });
      gameCards.push({ id: `${item.id}-2`, itemId: item.id, symbol: item.symbol, name: item.name, hebrew: item.hebrew, color: item.color });
    });
    for (let i = gameCards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]]; }

    const playersToUse = newPlayers || players;
    setCards(gameCards);
    setFlippedIndices([]);
    setPlayerMatches(new Map(playersToUse.map((p) => [p.id, new Set<string>()])));
    setGameComplete(false);
    setStartTime(null);
    setElapsedTime(0);
    setFirstCardFlipped(false);
    setCurrentPlayerIndex(0);
    setGameStarted(true);
    setGameKey(prev => prev + 1);
    isProcessing.current = false;
  }, [players]);

  const handleStartGame = useCallback((count: number) => {
    setPlayerCount(count);
    const newPlayers = Array.from({ length: count }).map((_, i) => ({
      id: i, name: PLAYER_COLORS[i].name, color: PLAYER_COLORS[i].color, bgColor: PLAYER_COLORS[i].bgColor, darkColor: PLAYER_COLORS[i].darkColor, matches: 0, matchedCardIds: new Set<string>(),
    }));
    setPlayers(newPlayers);
    initializeGame(newPlayers);
  }, [initializeGame]);

  useEffect(() => {
    if (!startTime || gameComplete) return;
    const interval = setInterval(() => { setElapsedTime(Math.floor((Date.now() - startTime) / 1000)); }, 1000);
    return () => clearInterval(interval);
  }, [startTime, gameComplete]);

  // Show loader while detecting device type - MUST be after all hooks
  if (isDetectingDevice) {
    return (
      <SafeAreaView className="flex-1 bg-amber-50 items-center justify-center">
        <StatusBar style="dark" />
        <Text style={{ color: '#d97706', fontSize: 16 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const handleCardPress = (index: number) => {
    if (isProcessing.current || flippedIndices.length === 2 || flippedIndices.includes(index)) return;
    const allMatched = Array.from(playerMatches.values()).reduce((acc, set) => new Set([...acc, ...set]), new Set<string>());
    if (allMatched.has(cards[index].id)) return;
    if (!firstCardFlipped) { setFirstCardFlipped(true); setStartTime(Date.now()); }

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      isProcessing.current = true;
      const [first, second] = newFlipped;
      const card1 = cards[first];
      const card2 = cards[second];

      if (card1.itemId === card2.itemId && card1.id !== card2.id) {
        setTimeout(() => {
          setPlayerMatches((prev) => {
            const newMatches = new Map(prev);
            const current = newMatches.get(currentPlayerIndex) || new Set();
            current.add(card1.id);
            current.add(card2.id);
            newMatches.set(currentPlayerIndex, current);
            if (Array.from(newMatches.values()).reduce((acc, set) => new Set([...acc, ...set]), new Set<string>()).size === 24) setGameComplete(true);
            return newMatches;
          });
          setFlippedIndices([]);
          isProcessing.current = false;
        }, 600);
      } else {
        setTimeout(() => { setFlippedIndices([]); isProcessing.current = false; if (playerCount > 1) setCurrentPlayerIndex((prev) => (prev + 1) % playerCount); }, 1200);
      }
    }
  };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  const columns = isMobile ? 4 : 6;
  const gridWidth = columns * (cardSize + (cardSize > 60 ? 10 : 6));
  const allMatched = Array.from(playerMatches.values()).reduce((acc, set) => new Set([...acc, ...set]), new Set<string>());

  if (!gameStarted) return <PlayerSetupScreen onStartGame={handleStartGame} />;

  return (
    <SafeAreaView className="flex-1 bg-yellow-50">
      <StatusBar style="dark" />

      <View className="bg-white border-b border-yellow-200">
        <View className="flex-row items-center justify-between px-4 py-3">
          <HeaderButton onPress={() => setGameStarted(false)} icon="arrow-left" />
          <View className="items-center flex-1 mx-4">
            <Text className={`font-bold text-yellow-900 ${!isMobile ? 'text-xl' : 'text-lg'}`}>Shabbos</Text>
          </View>
          <HeaderButton onPress={() => initializeGame()} icon="refresh" />
        </View>

        {playerCount > 1 && (
          <View className="px-4 py-4 bg-white border-t border-yellow-100">
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              {players.map((player, idx) => <PlayerIndicator key={player.id} player={player} isActive={currentPlayerIndex === player.id} matchCount={Math.floor((playerMatches.get(player.id)?.size ?? 0) / 2)} position={idx} />)}
            </View>
          </View>
        )}

        <View className="flex-row justify-center py-3 bg-yellow-50 border-t border-yellow-100" style={{ gap: !isMobile ? 48 : 32 }}>
          <View className="items-center">
            <Text className="text-xs text-yellow-600 uppercase tracking-wide font-semibold">Time</Text>
            <Text className={`font-bold text-yellow-900 ${!isMobile ? 'text-2xl' : 'text-xl'} mt-1`}>{formatTime(elapsedTime)}</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-yellow-600 uppercase tracking-wide font-semibold">Matched</Text>
            <Text className={`font-bold text-yellow-600 ${!isMobile ? 'text-2xl' : 'text-xl'} mt-1`}>{Math.floor(allMatched.size / 2)}/12</Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: gridWidth }}>
          {cards.map((card, index) => {
            let matchedByPlayerId: number | undefined;
            for (const [playerId, cardIds] of playerMatches) { if (cardIds.has(card.id)) { matchedByPlayerId = playerId; break; } }
            return <CardComponent key={`${gameKey}-${card.id}`} card={card} isFlipped={flippedIndices.includes(index)} isMatched={allMatched.has(card.id)} matchedByPlayerId={matchedByPlayerId} onPress={() => handleCardPress(index)} disabled={isProcessing.current} cardSize={cardSize} index={index} />;
          })}
        </View>
      </View>

      {gameComplete && <VictoryScreen playerCount={playerCount} players={players} playerMatches={playerMatches} elapsedTime={elapsedTime} onPlayAgain={() => initializeGame()} onBackToHome={() => setGameStarted(false)} />}
    </SafeAreaView>
  );
}
