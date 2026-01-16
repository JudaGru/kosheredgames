import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

interface NoachFlashcardsIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function NoachFlashcardsIllustration({
  width,
  height,
  primaryColor = '#0284c7',
  secondaryColor = '#7dd3fc',
  accentColor = '#fde047',
}: NoachFlashcardsIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="noachFlashBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
        <LinearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#ef4444" />
          <Stop offset="17%" stopColor="#f97316" />
          <Stop offset="33%" stopColor="#eab308" />
          <Stop offset="50%" stopColor="#22c55e" />
          <Stop offset="67%" stopColor="#3b82f6" />
          <Stop offset="83%" stopColor="#6366f1" />
          <Stop offset="100%" stopColor="#a855f7" />
        </LinearGradient>
      </Defs>

      {/* Background gradient */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#noachFlashBg)" />

      {/* Rain drops */}
      <G opacity="0.3">
        <Path d="M20 10 L18 25" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M50 5 L48 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M85 8 L83 23" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M150 12 L148 27" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M185 6 L183 21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M210 15 L208 30" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </G>

      {/* Rainbow arc */}
      <G transform="translate(175, 25)">
        <Path
          d="M-40 35 Q-40 -5, 0 -5 Q40 -5, 40 35"
          stroke="url(#rainbowGrad)"
          strokeWidth="6"
          fill="none"
          opacity="0.8"
        />
      </G>

      {/* Water waves at bottom */}
      <Path
        d="M0 115 Q20 105, 40 115 T80 115 T120 115 T160 115 T200 115 T220 115 L220 140 L0 140 Z"
        fill="white"
        opacity="0.15"
      />
      <Path
        d="M0 120 Q15 112, 30 120 T60 120 T90 120 T120 120 T150 120 T180 120 T210 120 T220 120 L220 140 L0 140 Z"
        fill="white"
        opacity="0.1"
      />

      {/* Teiva (Ark) */}
      <G transform="translate(25, 75)">
        {/* Hull */}
        <Path
          d="M-20 15 L-25 5 L-20 -15 L30 -15 L35 5 L30 15 Z"
          fill="#92400e"
        />
        {/* Cabin */}
        <Rect x="-15" y="-30" width="40" height="15" rx="2" fill="#b45309" />
        {/* Roof */}
        <Path
          d="M-18 -30 L5 -42 L28 -30 Z"
          fill="#78350f"
        />
        {/* Window */}
        <Rect x="0" y="-26" width="10" height="8" rx="1" fill={accentColor} opacity="0.8" />
      </G>

      {/* Dove with olive branch */}
      <G transform="translate(185, 75)">
        {/* Dove body */}
        <Path
          d="M0 0 Q8 -5, 12 0 Q8 5, 0 0"
          fill="white"
        />
        {/* Wing */}
        <Path
          d="M4 -2 Q10 -10, 15 -5"
          stroke="white"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        {/* Olive branch */}
        <Path
          d="M12 2 L18 5"
          stroke="#22c55e"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Circle cx="18" cy="5" r="2" fill="#22c55e" />
        <Circle cx="16" cy="3" r="1.5" fill="#22c55e" />
      </G>

      {/* Vertical flashcard - Question side (front) */}
      <G transform="translate(65, 18)">
        <Rect width="58" height="72" rx="10" fill="white" />
        <SvgText x="29" y="22" fontSize="7" fill="#64748b" textAnchor="middle">Question:</SvgText>
        <SvgText x="29" y="36" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">How long</SvgText>
        <SvgText x="29" y="48" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">did it rain</SvgText>
        <SvgText x="29" y="60" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">during the Mabul?</SvgText>
        <Rect x="9" y="64" width="40" height="3" rx="1.5" fill="#e2e8f0" />
      </G>

      {/* Vertical flashcard - Answer side (back) */}
      <G transform="translate(128, 22) rotate(3)">
        <Rect width="52" height="65" rx="10" fill={accentColor} />
        <SvgText x="26" y="20" fontSize="7" fill={primaryColor} opacity="0.7" textAnchor="middle">Answer:</SvgText>
        <SvgText x="26" y="36" fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">40 days</SvgText>
        <SvgText x="26" y="48" fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">& nights</SvgText>
        <Rect x="6" y="54" width="40" height="3" rx="1.5" fill={primaryColor} opacity="0.3" />
      </G>

      {/* Checkmark badge */}
      <G transform="translate(195, 95)">
        <Circle r="10" fill={accentColor} />
        <Path
          d="M-4 0 L-1 3 L4 -3"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </G>

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        <Rect x="-40" y="-12" width="80" height="24" rx="12" fill="white" opacity="0.95" />
        <SvgText x="0" y="4" fontSize="12" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Noach
        </SvgText>
      </G>

      {/* Sparkle decorations */}
      <Circle cx="12" cy="115" r="3" fill="white" opacity="0.5" />
      <Circle cx="208" cy="50" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default NoachFlashcardsIllustration;
