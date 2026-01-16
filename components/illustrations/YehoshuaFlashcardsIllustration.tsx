import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

interface YehoshuaFlashcardsIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function YehoshuaFlashcardsIllustration({
  width,
  height,
  primaryColor = '#0284c7',
  secondaryColor = '#7dd3fc',
  accentColor = '#fde047',
}: YehoshuaFlashcardsIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="yehoshuaFlashBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background gradient */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#yehoshuaFlashBg)" />

      {/* Sun standing still (miracle) */}
      <G transform="translate(190, 30)">
        <Circle r="20" fill={accentColor} opacity="0.3" />
        <Circle r="14" fill={accentColor} />
        {/* Sun rays */}
        <Path d="M0 -18 L0 -24" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
        <Path d="M13 -13 L17 -17" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
        <Path d="M18 0 L24 0" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
        <Path d="M13 13 L17 17" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
        <Path d="M-13 -13 L-17 -17" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
        <Path d="M-18 0 L-24 0" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
        <Path d="M-13 13 L-17 17" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
      </G>

      {/* Walls of Yericho (crumbling) */}
      <G transform="translate(25, 65)">
        {/* Wall sections */}
        <Rect x="-15" y="-20" width="12" height="35" fill="#a1887f" transform="rotate(-8)" />
        <Rect x="0" y="-25" width="10" height="40" fill="#8d6e63" transform="rotate(5)" />
        <Rect x="12" y="-18" width="11" height="32" fill="#a1887f" transform="rotate(-3)" />
        {/* Rubble */}
        <Rect x="-10" y="15" width="8" height="5" fill="#8d6e63" transform="rotate(15)" />
        <Rect x="5" y="18" width="6" height="4" fill="#a1887f" transform="rotate(-10)" />
        <Rect x="15" y="16" width="7" height="5" fill="#8d6e63" transform="rotate(20)" />
      </G>

      {/* Shofar */}
      <G transform="translate(185, 85)">
        <Path
          d="M0 0 Q15 -5, 20 -15 Q22 -20, 18 -22 L15 -18 Q12 -15, 0 -8 Z"
          fill="#d4a574"
        />
        <Circle cx="0" cy="-4" r="4" fill="#c9956c" />
      </G>

      {/* Jordan River (crossing) */}
      <Path
        d="M0 115 Q30 105, 60 115 T120 110 T180 118 T220 108 L220 140 L0 140 Z"
        fill="white"
        opacity="0.15"
      />
      <Path
        d="M0 125 Q25 118, 50 125 T100 122 T150 128 T200 120 T220 125 L220 140 L0 140 Z"
        fill="white"
        opacity="0.1"
      />

      {/* 12 Stones memorial */}
      <G transform="translate(180, 115)">
        <Circle cx="-8" cy="-2" r="4" fill="#9ca3af" />
        <Circle cx="0" cy="0" r="4" fill="#6b7280" />
        <Circle cx="8" cy="-1" r="4" fill="#9ca3af" />
        <Circle cx="-4" cy="-8" r="3" fill="#6b7280" />
        <Circle cx="4" cy="-7" r="3" fill="#9ca3af" />
      </G>

      {/* Stars */}
      <Circle cx="15" cy="18" r="2" fill="white" opacity="0.7" />
      <Circle cx="45" cy="28" r="1.5" fill="white" opacity="0.5" />
      <Circle cx="80" cy="12" r="2" fill="white" opacity="0.6" />
      <Circle cx="120" cy="22" r="1.5" fill="white" opacity="0.4" />

      {/* Vertical flashcard - Question side (front) */}
      <G transform="translate(55, 20)">
        <Rect width="58" height="72" rx="10" fill="white" />
        <SvgText x="29" y="22" fontSize="7" fill="#64748b" textAnchor="middle">Question:</SvgText>
        <SvgText x="29" y="36" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">What fell</SvgText>
        <SvgText x="29" y="48" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">when the</SvgText>
        <SvgText x="29" y="60" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">shofar blew?</SvgText>
        <Rect x="9" y="64" width="40" height="3" rx="1.5" fill="#e2e8f0" />
      </G>

      {/* Vertical flashcard - Answer side (back) */}
      <G transform="translate(118, 24) rotate(3)">
        <Rect width="52" height="65" rx="10" fill={accentColor} />
        <SvgText x="26" y="18" fontSize="7" fill={primaryColor} opacity="0.7" textAnchor="middle">Answer:</SvgText>
        <SvgText x="26" y="34" fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">The walls</SvgText>
        <SvgText x="26" y="48" fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">of Yericho</SvgText>
        <Rect x="6" y="54" width="40" height="3" rx="1.5" fill={primaryColor} opacity="0.3" />
      </G>

      {/* Checkmark badge */}
      <G transform="translate(195, 115)">
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
        <Rect x="-45" y="-12" width="90" height="24" rx="12" fill="white" opacity="0.95" />
        <SvgText x="0" y="4" fontSize="11" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Yehoshua
        </SvgText>
      </G>

      {/* Extra sparkle decorations */}
      <Circle cx="12" cy="112" r="3" fill="white" opacity="0.5" />
      <Circle cx="150" cy="8" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default YehoshuaFlashcardsIllustration;
