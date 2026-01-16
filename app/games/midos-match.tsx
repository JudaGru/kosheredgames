import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { useDeviceType } from '@/hooks/useDeviceType';
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

// Custom SVG Icons for Midos (Character Traits)
function ChesedIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Person giving food/help to another - Chesed (Kindness) */}
      {/* Giver - standing tall */}
      <Circle cx="20" cy="14" r="7" fill="#fcd9b6" />
      <Rect x="14" y="21" width="12" height="18" rx="2" fill={color} />
      {/* Giver's arm extending with bowl */}
      <Path d="M26 28 L38 32" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Bowl of food */}
      <Ellipse cx="42" cy="32" rx="8" ry="4" fill="#fbbf24" />
      <Path d="M34 32 Q42 28 50 32" fill={color} />
      {/* Receiver - seated/smaller */}
      <Circle cx="48" cy="44" r="6" fill="#fcd9b6" />
      <Rect x="43" y="50" width="10" height="10" rx="2" fill="#94a3b8" />
      {/* Heart above the giving */}
      <Path d="M32 10 L29 7 C27 5 27 2 29 0 L32 3 L35 0 C37 2 37 5 35 7 Z" fill={color} />
      {/* Ground */}
      <Line x1="8" y1="60" x2="56" y2="60" stroke="#e2e8f0" strokeWidth="2" />
    </Svg>
  );
}

function EmesIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Scale of justice / balance for Emes (Truth) */}
      {/* Center pole */}
      <Rect x="30" y="16" width="4" height="40" fill="#a16207" />
      <Rect x="26" y="56" width="12" height="4" rx="2" fill="#a16207" />
      {/* Balance beam */}
      <Rect x="8" y="14" width="48" height="4" rx="2" fill={color} />
      {/* Left pan */}
      <Path d="M8 18 L8 24 L20 24 L20 18" stroke={color} strokeWidth="2" fill="none" />
      <Ellipse cx="14" cy="28" rx="10" ry="4" fill={color} />
      {/* Right pan */}
      <Path d="M44 18 L44 24 L56 24 L56 18" stroke={color} strokeWidth="2" fill="none" />
      <Ellipse cx="50" cy="28" rx="10" ry="4" fill={color} />
      {/* Checkmark in center */}
      <Path d="M28 38 L32 44 L40 32" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Light rays from top */}
      <Line x1="32" y1="4" x2="32" y2="10" stroke={color} strokeWidth="2" />
      <Line x1="24" y1="6" x2="26" y2="11" stroke={color} strokeWidth="2" />
      <Line x1="40" y1="6" x2="38" y2="11" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

function SavlanusIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Person waiting calmly while others rush - Savlanus (Patience) */}
      {/* Calm person in center */}
      <Circle cx="32" cy="18" r="8" fill="#fcd9b6" />
      <Rect x="26" y="26" width="12" height="20" rx="2" fill={color} />
      {/* Peaceful closed eyes */}
      <Path d="M28 17 Q30 15 32 17" stroke="#64748b" strokeWidth="1.5" fill="none" />
      <Path d="M32 17 Q34 15 36 17" stroke="#64748b" strokeWidth="1.5" fill="none" />
      {/* Gentle smile */}
      <Path d="M29 22 Q32 25 35 22" stroke="#64748b" strokeWidth="1.5" fill="none" />
      {/* Clock nearby */}
      <Circle cx="50" cy="20" r="10" fill="white" stroke={color} strokeWidth="2" />
      <Line x1="50" y1="20" x2="50" y2="14" stroke={color} strokeWidth="2" />
      <Line x1="50" y1="20" x2="54" y2="20" stroke={color} strokeWidth="2" />
      {/* Swirling chaos around but person is calm */}
      <Path d="M8 30 Q12 26 16 30" stroke="#94a3b8" strokeWidth="2" fill="none" />
      <Path d="M6 38 Q10 34 14 38" stroke="#94a3b8" strokeWidth="2" fill="none" />
      {/* Ground with person standing firm */}
      <Ellipse cx="32" cy="50" rx="12" ry="4" fill={color} opacity="0.3" />
    </Svg>
  );
}

function AnavahIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Person stepping back/letting others go first - Anavah (Humility) */}
      {/* Humble person stepping aside */}
      <Circle cx="16" cy="24" r="7" fill="#fcd9b6" />
      <Rect x="10" y="31" width="12" height="16" rx="2" fill={color} />
      {/* Hand gesturing "you first" */}
      <Path d="M22 36 L32 32" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <Circle cx="34" cy="31" r="3" fill="#fcd9b6" />
      {/* Arrow showing "you go ahead" */}
      <Path d="M36 28 L48 28 L44 24 M48 28 L44 32" stroke={color} strokeWidth="2" fill="none" />
      {/* Other person walking ahead */}
      <Circle cx="52" cy="20" r="6" fill="#fcd9b6" />
      <Rect x="47" y="26" width="10" height="14" rx="2" fill="#64748b" />
      {/* Crown/trophy being declined (crossed out) */}
      <Path d="M14 8 L10 14 L18 14 Z" fill="#fbbf24" />
      <Line x1="10" y1="6" x2="18" y2="16" stroke="#ef4444" strokeWidth="2" />
      {/* Ground */}
      <Line x1="4" y1="52" x2="60" y2="52" stroke="#e2e8f0" strokeWidth="2" />
    </Svg>
  );
}

function SimchaIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Person dancing/celebrating with joy - Simcha (Joy) */}
      {/* Happy dancing person */}
      <Circle cx="32" cy="14" r="8" fill="#fcd9b6" />
      {/* Big happy eyes */}
      <Circle cx="28" cy="12" r="2" fill="#1e293b" />
      <Circle cx="36" cy="12" r="2" fill="#1e293b" />
      {/* Big smile */}
      <Path d="M26 18 Q32 24 38 18" stroke="#1e293b" strokeWidth="2" fill="none" />
      {/* Body in dance pose */}
      <Path d="M28 22 L26 38 L32 34 L38 38 L36 22 Z" fill={color} />
      {/* Arms raised in joy */}
      <Path d="M26 26 L14 18" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <Path d="M38 26 L50 18" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Hands */}
      <Circle cx="12" cy="16" r="4" fill="#fcd9b6" />
      <Circle cx="52" cy="16" r="4" fill="#fcd9b6" />
      {/* Dancing legs */}
      <Path d="M28 38 L20 54 M36 38 L44 50" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Musical notes / celebration marks */}
      <Circle cx="8" cy="28" r="2" fill={color} />
      <Line x1="10" y1="28" x2="10" y2="22" stroke={color} strokeWidth="1.5" />
      <Circle cx="56" cy="30" r="2" fill={color} />
      <Line x1="58" y1="30" x2="58" y2="24" stroke={color} strokeWidth="1.5" />
      {/* Stars of joy */}
      <Path d="M20 6 L21 9 L24 9 L22 11 L23 14 L20 12 L17 14 L18 11 L16 9 L19 9 Z" fill="#fbbf24" />
      <Path d="M46 4 L47 6 L49 6 L47.5 7.5 L48 10 L46 8.5 L44 10 L44.5 7.5 L43 6 L45 6 Z" fill="#fbbf24" />
    </Svg>
  );
}

function HakrasHatovIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Person saying thank you with hand on heart - Hakras Hatov (Gratitude) */}
      {/* Grateful person */}
      <Circle cx="32" cy="16" r="9" fill="#fcd9b6" />
      {/* Warm grateful eyes */}
      <Circle cx="28" cy="14" r="2" fill="#1e293b" />
      <Circle cx="36" cy="14" r="2" fill="#1e293b" />
      {/* Gentle smile */}
      <Path d="M28 20 Q32 24 36 20" stroke="#1e293b" strokeWidth="1.5" fill="none" />
      {/* Body */}
      <Rect x="24" y="25" width="16" height="22" rx="3" fill={color} />
      {/* Hand on heart */}
      <Circle cx="32" cy="34" r="5" fill="#fcd9b6" />
      {/* Heart glowing on chest */}
      <Path d="M32 32 L30 30 C28 28 28 26 30 24 L32 26 L34 24 C36 26 36 28 34 30 Z" fill="#ef4444" />
      {/* Speech bubble with "Thank You" */}
      <Path d="M46 8 Q56 4 56 14 Q56 22 48 22 L46 26 L46 22 Q42 22 42 14 Q42 8 46 8 Z" fill="white" stroke={color} strokeWidth="1.5" />
      <Circle cx="47" cy="13" r="1.5" fill={color} />
      <Circle cx="51" cy="13" r="1.5" fill={color} />
      <Circle cx="49" cy="17" r="1.5" fill={color} />
      {/* Other person who helped (smaller) */}
      <Circle cx="14" cy="28" r="6" fill="#fcd9b6" />
      <Rect x="9" y="34" width="10" height="14" rx="2" fill="#64748b" />
      {/* Ground */}
      <Line x1="4" y1="54" x2="60" y2="54" stroke="#e2e8f0" strokeWidth="2" />
    </Svg>
  );
}

function KibudAvIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Child helping elderly parent - Kibud Av (Honoring Parents) */}
      {/* Elderly parent with gray hair */}
      <Circle cx="22" cy="18" r="9" fill="#fcd9b6" />
      <Path d="M13 14 Q22 6 31 14" fill="#9ca3af" />
      {/* Parent's body - slightly bent */}
      <Path d="M16 27 Q22 32 22 44 L28 44 Q28 32 22 27 Z" fill={color} />
      {/* Walking cane */}
      <Line x1="12" y1="32" x2="8" y2="52" stroke="#78716c" strokeWidth="3" strokeLinecap="round" />
      {/* Child helping */}
      <Circle cx="44" cy="24" r="7" fill="#fcd9b6" />
      <Rect x="38" y="31" width="12" height="16" rx="2" fill="#22c55e" />
      {/* Child's supportive arm around parent */}
      <Path d="M38 36 L28 38" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
      <Circle cx="26" cy="38" r="3" fill="#fcd9b6" />
      {/* Heart between them */}
      <Path d="M33 16 L31 14 C29 12 29 9 31 7 L33 9 L35 7 C37 9 37 12 35 14 Z" fill="#ec4899" />
      {/* Ground */}
      <Line x1="4" y1="52" x2="60" y2="52" stroke="#e2e8f0" strokeWidth="2" />
    </Svg>
  );
}

function AchduIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Circle of people holding hands - Achdus (Unity) */}
      {/* Top person */}
      <Circle cx="32" cy="10" r="6" fill="#fcd9b6" />
      <Rect x="28" y="16" width="8" height="10" rx="2" fill={color} />
      {/* Left person */}
      <Circle cx="12" cy="32" r="6" fill="#fcd9b6" />
      <Rect x="8" y="38" width="8" height="10" rx="2" fill="#0ea5e9" />
      {/* Right person */}
      <Circle cx="52" cy="32" r="6" fill="#fcd9b6" />
      <Rect x="48" y="38" width="8" height="10" rx="2" fill="#22c55e" />
      {/* Bottom left */}
      <Circle cx="20" cy="52" r="5" fill="#fcd9b6" />
      <Rect x="16" y="57" width="8" height="6" rx="2" fill="#f59e0b" />
      {/* Bottom right */}
      <Circle cx="44" cy="52" r="5" fill="#fcd9b6" />
      <Rect x="40" y="57" width="8" height="6" rx="2" fill="#8b5cf6" />
      {/* Connecting hands - circle of unity */}
      <Path d="M28 22 Q20 24 16 32" stroke="#fcd9b6" strokeWidth="3" fill="none" />
      <Path d="M36 22 Q44 24 48 32" stroke="#fcd9b6" strokeWidth="3" fill="none" />
      <Path d="M12 44 Q14 48 18 50" stroke="#fcd9b6" strokeWidth="3" fill="none" />
      <Path d="M52 44 Q50 48 46 50" stroke="#fcd9b6" strokeWidth="3" fill="none" />
      <Path d="M24 54 L28 54 M36 54 L40 54" stroke="#fcd9b6" strokeWidth="3" />
      {/* Heart in center */}
      <Path d="M32 34 L29 31 C26 28 26 24 29 21 L32 24 L35 21 C38 24 38 28 35 31 Z" fill="#ec4899" />
    </Svg>
  );
}

function BitachonIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Person looking up to shamayim with hands raised - Bitachon (Trust) */}
      {/* Person with face looking up */}
      <Circle cx="32" cy="28" r="10" fill="#fcd9b6" />
      {/* Eyes looking up */}
      <Circle cx="28" cy="26" r="2" fill="#1e293b" />
      <Circle cx="36" cy="26" r="2" fill="#1e293b" />
      <Circle cx="28" cy="25" r="1" fill="white" />
      <Circle cx="36" cy="25" r="1" fill="white" />
      {/* Peaceful expression */}
      <Path d="M29 32 Q32 34 35 32" stroke="#64748b" strokeWidth="1.5" fill="none" />
      {/* Body */}
      <Rect x="26" y="38" width="12" height="18" rx="2" fill={color} />
      {/* Arms raised toward heaven */}
      <Path d="M26 42 L18 30 L16 32" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" />
      <Path d="M38 42 L46 30 L48 32" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" />
      <Circle cx="16" cy="30" r="3" fill="#fcd9b6" />
      <Circle cx="48" cy="30" r="3" fill="#fcd9b6" />
      {/* Divine light from above */}
      <Path d="M32 4 L34 10 L40 10 L35 14 L37 20 L32 16 L27 20 L29 14 L24 10 L30 10 Z" fill="#fbbf24" />
      {/* Light rays */}
      <Line x1="32" y1="2" x2="32" y2="6" stroke="#fbbf24" strokeWidth="2" />
      <Line x1="22" y1="6" x2="24" y2="10" stroke="#fbbf24" strokeWidth="1.5" />
      <Line x1="42" y1="6" x2="40" y2="10" stroke="#fbbf24" strokeWidth="1.5" />
    </Svg>
  );
}

function TzedakahIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Hand putting coin in pushka - Tzedakah (Charity) */}
      {/* Pushka/Tzedakah box */}
      <Rect x="18" y="32" width="28" height="26" rx="3" fill={color} />
      {/* Coin slot */}
      <Rect x="26" y="34" width="12" height="3" rx="1" fill="#1e293b" />
      {/* Hebrew צ on box */}
      <Path d="M28 48 L32 42 L36 48 M32 42 L32 54" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Hand dropping coin */}
      <Path d="M32 6 L28 6 Q22 6 22 12 L22 20 Q22 24 26 24 L32 24" fill="#fcd9b6" />
      <Path d="M32 6 L36 6 Q40 6 40 10 L40 12" fill="#fcd9b6" />
      {/* Individual fingers */}
      <Rect x="26" y="4" width="4" height="12" rx="2" fill="#fcd9b6" />
      <Rect x="31" y="3" width="4" height="10" rx="2" fill="#fcd9b6" />
      <Rect x="36" y="5" width="4" height="8" rx="2" fill="#fcd9b6" />
      {/* Coin being dropped */}
      <Circle cx="32" cy="28" r="4" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
      <Circle cx="32" cy="28" r="2" fill="#f59e0b" />
      {/* Motion lines for falling coin */}
      <Line x1="28" y1="26" x2="28" y2="30" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />
      <Line x1="36" y1="26" x2="36" y2="30" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />
      {/* Sparkles */}
      <Circle cx="44" cy="26" r="2" fill="#fbbf24" />
      <Circle cx="20" cy="28" r="1.5" fill="#fbbf24" />
    </Svg>
  );
}

function ShmiraHalashonIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Person choosing not to speak lashon hara - Shmiras Halashon */}
      {/* Person's face */}
      <Circle cx="32" cy="24" r="12" fill="#fcd9b6" />
      {/* Thoughtful/careful eyes */}
      <Circle cx="27" cy="22" r="2.5" fill="#1e293b" />
      <Circle cx="37" cy="22" r="2.5" fill="#1e293b" />
      {/* Closed/sealed lips - choosing silence */}
      <Line x1="26" y1="30" x2="38" y2="30" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* Lock on mouth symbolizing guarding speech */}
      <Rect x="29" y="32" width="6" height="5" rx="1" fill={color} />
      <Circle cx="32" cy="35" r="1" fill="white" />
      {/* Speech bubble with X - rejecting bad speech */}
      <Path d="M48 10 Q58 6 58 16 Q58 24 50 24 L48 28 L48 24 Q44 24 44 16 Q44 10 48 10 Z" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
      <Line x1="48" y1="13" x2="54" y2="19" stroke="#ef4444" strokeWidth="2" />
      <Line x1="54" y1="13" x2="48" y2="19" stroke="#ef4444" strokeWidth="2" />
      {/* Body */}
      <Rect x="24" y="38" width="16" height="16" rx="3" fill={color} />
      {/* Hand gesture - "stop" or thinking */}
      <Path d="M44 44 L52 38" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <Circle cx="54" cy="36" r="4" fill="#fcd9b6" />
    </Svg>
  );
}

function ZerizusIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Person eagerly doing mitzvah quickly - Zerizus (Alacrity) */}
      {/* Energetic person running to do mitzvah */}
      <Circle cx="36" cy="12" r="8" fill="#fcd9b6" />
      {/* Determined happy face */}
      <Circle cx="33" cy="10" r="1.5" fill="#1e293b" />
      <Circle cx="39" cy="10" r="1.5" fill="#1e293b" />
      <Path d="M33 15 Q36 18 39 15" stroke="#1e293b" strokeWidth="1.5" fill="none" />
      {/* Body leaning forward eagerly */}
      <Path d="M32 20 L28 36 L36 34 L40 38 L38 20 Z" fill={color} />
      {/* Arms reaching forward */}
      <Path d="M32 24 L20 20" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <Circle cx="18" cy="18" r="4" fill="#fcd9b6" />
      {/* Legs in running motion */}
      <Path d="M28 36 L18 50 M38 36 L48 44" stroke={color} strokeWidth="5" strokeLinecap="round" />
      {/* Siddur/Sefer being reached for */}
      <Rect x="4" y="12" width="10" height="14" rx="2" fill="#1e3a8a" />
      <Rect x="5" y="13" width="8" height="12" fill="#fef3c7" />
      {/* Speed/motion lines */}
      <Line x1="50" y1="16" x2="56" y2="16" stroke="#94a3b8" strokeWidth="2" />
      <Line x1="52" y1="24" x2="58" y2="24" stroke="#94a3b8" strokeWidth="2" />
      <Line x1="50" y1="32" x2="56" y2="32" stroke="#94a3b8" strokeWidth="2" />
      {/* Sunrise/early - doing mitzvah at first opportunity */}
      <Path d="M54 52 Q58 48 62 52" fill="#fbbf24" />
      <Circle cx="58" cy="54" r="6" fill="#fbbf24" />
    </Svg>
  );
}

// Map item IDs to their icon components
function MidosIcon({ itemId, size, color }: { itemId: string; size: number; color: string }) {
  switch (itemId) {
    case 'chesed': return <ChesedIcon size={size} color={color} />;
    case 'emes': return <EmesIcon size={size} color={color} />;
    case 'savlanus': return <SavlanusIcon size={size} color={color} />;
    case 'anavah': return <AnavahIcon size={size} color={color} />;
    case 'simcha': return <SimchaIcon size={size} color={color} />;
    case 'hakras-hatov': return <HakrasHatovIcon size={size} color={color} />;
    case 'kibud-av': return <KibudAvIcon size={size} color={color} />;
    case 'achdus': return <AchduIcon size={size} color={color} />;
    case 'bitachon': return <BitachonIcon size={size} color={color} />;
    case 'tzedakah': return <TzedakahIcon size={size} color={color} />;
    case 'shmiras-halashon': return <ShmiraHalashonIcon size={size} color={color} />;
    case 'zerizus': return <ZerizusIcon size={size} color={color} />;
    default: return null;
  }
}

// Midos data with Hebrew names including nekudos
const MIDOS_DATA = [
  { id: 'chesed', name: 'Chesed', hebrew: 'חֶסֶד', symbol: '💖', color: '#ec4899' },
  { id: 'emes', name: 'Emes', hebrew: 'אֱמֶת', symbol: '✨', color: '#eab308' },
  { id: 'savlanus', name: 'Savlanus', hebrew: 'סַבְלָנוּת', symbol: '⏳', color: '#0891b2' },
  { id: 'anavah', name: 'Anavah', hebrew: 'עֲנָוָה', symbol: '🙏', color: '#8b5cf6' },
  { id: 'simcha', name: 'Simcha', hebrew: 'שִׂמְחָה', symbol: '😊', color: '#f97316' },
  { id: 'hakras-hatov', name: 'Hakras Hatov', hebrew: 'הַכָּרַת הַטּוֹב', symbol: '🎁', color: '#22c55e' },
  { id: 'kibud-av', name: 'Kibud Av', hebrew: 'כִּבּוּד אָב', symbol: '👨‍👧', color: '#0ea5e9' },
  { id: 'achdus', name: 'Achdus', hebrew: 'אַחְדוּת', symbol: '🤝', color: '#f43f5e' },
  { id: 'bitachon', name: 'Bitachon', hebrew: 'בִּטָּחוֹן', symbol: '🛡️', color: '#6366f1' },
  { id: 'tzedakah', name: 'Tzedakah', hebrew: 'צְדָקָה', symbol: '💰', color: '#14b8a6' },
  { id: 'shmiras-halashon', name: 'Shmiras Halashon', hebrew: 'שְׁמִירַת הַלָּשׁוֹן', symbol: '🤫', color: '#a855f7' },
  { id: 'zerizus', name: 'Zerizus', hebrew: 'זְרִיזוּת', symbol: '🏃', color: '#84cc16' },
];

const PLAYER_COLORS = [
  { name: 'Player 1', color: '#9333ea', bgColor: '#f3e8ff', darkColor: '#6b21a8' },
  { name: 'Player 2', color: '#0ea5e9', bgColor: '#e0f2fe', darkColor: '#075985' },
  { name: 'Player 3', color: '#ec4899', bgColor: '#fce7f3', darkColor: '#9d174d' },
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
  const glowColor = matchedByPlayerId !== undefined ? PLAYER_COLORS[matchedByPlayerId].color : '#9333ea';

  return (
    <Animated.View style={[containerStyle, { margin }]}>
      <Pressable onPress={onPress} disabled={disabled || isFlipped || isMatched} style={{ width: cardSize, height: cardSize * 1.25 }}>
        {isMatched && <Animated.View style={[glowStyle, { position: 'absolute', top: -4, left: -4, right: -4, bottom: -4, borderRadius: 14, backgroundColor: glowColor }]} />}

        <Animated.View
          style={[frontAnimatedStyle, {
            position: 'absolute', width: '100%', height: '100%', backgroundColor: '#9333ea', borderRadius: 10,
            justifyContent: 'center', alignItems: 'center', backfaceVisibility: 'hidden',
            shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5,
          }]}
        >
          <View style={{ position: 'absolute', width: '80%', height: '85%', borderRadius: 6, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' }} />
          <ChesedIcon size={cardSize * 0.5} color="white" />
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
          <MidosIcon itemId={card.itemId} size={cardSize * 0.55} color={card.color} />
          <Text style={{ fontSize: cardSize * 0.12, fontWeight: '600', color: card.color, textAlign: 'center', marginTop: 2 }}>{card.name}</Text>
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

  const emojis = ['💖', '✨', '🌟', '💫', '🙏', '🤝', '⭐'];
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
    borderColor: borderColor.value === 1 ? '#9333ea' : '#e9d5ff',
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
              shadowColor: '#9333ea',
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 8,
              elevation: 3,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#6b21a8' }}>
              {playerCount === 1 ? 'Solo' : `${playerCount} Players`}
            </Text>
            <Text style={{ fontSize: 14, color: '#9333ea', marginTop: 4 }}>
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
    backgroundColor: bgColor.value === 1 ? '#e9d5ff' : '#f3e8ff',
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
        <FontAwesome name={icon as any} size={18} color="#6b21a8" />
      </Animated.View>
    </Pressable>
  );
}

function PlayerSetupScreen({ onStartGame }: { onStartGame: (playerCount: number) => void }) {
  const isWeb = Platform.OS === 'web';
  const [backHovered, setBackHovered] = useState(false);

  const displayItems = [
    { symbol: '💖', color: '#ec4899' },
    { symbol: '✨', color: '#eab308' },
    { symbol: '🙏', color: '#8b5cf6' },
    { symbol: '🤝', color: '#f43f5e' },
    { symbol: '😊', color: '#f97316' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-purple-50">
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
                color: '#6b21a8',
                letterSpacing: -1,
              }}
            >
              Midos
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
              <View style={{ height: 1, width: 40, backgroundColor: '#e9d5ff' }} />
              <Text
                style={{
                  fontSize: 14,
                  color: '#9333ea',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: 2
                }}
              >
                Memory Match
              </Text>
              <View style={{ height: 1, width: 40, backgroundColor: '#e9d5ff' }} />
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
              backgroundColor: backHovered ? '#f3e8ff' : 'transparent',
              borderRadius: 8,
            }}
          >
            <FontAwesome name="arrow-left" size={14} color={backHovered ? '#6b21a8' : '#9333ea'} />
            <Text style={{ color: backHovered ? '#6b21a8' : '#9333ea', fontWeight: '600', fontSize: 15 }}>Back</Text>
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
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(107, 33, 168, 0.9)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
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
          color: '#6b21a8',
          marginTop: 20,
          textAlign: 'center',
        }}>
          Amazing Midos!
        </Text>

        <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 8, fontSize: 16 }}>
          {playerCount === 1 ? 'All Midos matched!' : 'Game Complete!'}
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
          <View style={{ marginTop: 24, backgroundColor: '#f3e8ff', borderRadius: 16, padding: 24, width: '100%' }}>
            <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#6b21a8', textAlign: 'center' }}>{elapsedTime}</Text>
            <Text style={{ color: '#9333ea', textAlign: 'center', marginTop: 4, fontWeight: '600', letterSpacing: 2 }}>SECONDS</Text>
          </View>
        )}

        <Pressable
          onPress={onPlayAgain}
          onHoverIn={handlePlayAgainHoverIn}
          onHoverOut={handlePlayAgainHoverOut}
          style={{ width: '100%', marginTop: 32 }}
        >
          <Animated.View style={[playAgainStyle, {
            backgroundColor: '#9333ea',
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

export default function MidosMatchGame() {
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
    MIDOS_DATA.forEach((item) => {
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
      <SafeAreaView className="flex-1 bg-rose-50 items-center justify-center">
        <StatusBar style="dark" />
        <Text style={{ color: '#e11d48', fontSize: 16 }}>Loading...</Text>
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
    <SafeAreaView className="flex-1 bg-purple-50">
      <StatusBar style="dark" />

      <View className="bg-white border-b border-purple-200">
        <View className="flex-row items-center justify-between px-4 py-3">
          <HeaderButton onPress={() => setGameStarted(false)} icon="arrow-left" />
          <View className="items-center flex-1 mx-4">
            <Text className={`font-bold text-purple-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>Midos</Text>
          </View>
          <HeaderButton onPress={() => initializeGame()} icon="refresh" />
        </View>

        {playerCount > 1 && (
          <View className="px-4 py-4 bg-white border-t border-purple-100">
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              {players.map((player, idx) => <PlayerIndicator key={player.id} player={player} isActive={currentPlayerIndex === player.id} matchCount={Math.floor((playerMatches.get(player.id)?.size ?? 0) / 2)} position={idx} />)}
            </View>
          </View>
        )}

        <View className="flex-row justify-center py-3 bg-purple-50 border-t border-purple-100" style={{ gap: isMobile ? 32 : 48 }}>
          <View className="items-center">
            <Text className="text-xs text-purple-600 uppercase tracking-wide font-semibold">Time</Text>
            <Text className={`font-bold text-purple-900 ${isMobile ? 'text-xl' : 'text-2xl'} mt-1`}>{formatTime(elapsedTime)}</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-purple-600 uppercase tracking-wide font-semibold">Matched</Text>
            <Text className={`font-bold text-purple-600 ${isMobile ? 'text-xl' : 'text-2xl'} mt-1`}>{Math.floor(allMatched.size / 2)}/12</Text>
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
