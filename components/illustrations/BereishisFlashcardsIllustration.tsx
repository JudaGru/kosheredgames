import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

interface BereishisFlashcardsIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function BereishisFlashcardsIllustration({
  width,
  height,
  primaryColor = '#0284c7',
  secondaryColor = '#7dd3fc',
  accentColor = '#fde047',
}: BereishisFlashcardsIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="bereishisFlashBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background gradient */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#bereishisFlashBg)" />

      {/* Subtle wave pattern for sky/water separation (creation theme) */}
      <Path
        d="M0 95 Q30 85, 60 95 T120 95 T180 95 T220 95 L220 140 L0 140 Z"
        fill="white"
        opacity="0.08"
      />
      <Path
        d="M0 105 Q25 95, 50 105 T100 105 T150 105 T200 105 T220 105 L220 140 L0 140 Z"
        fill="white"
        opacity="0.05"
      />

      {/* Soft radial glow from top-right (light/creation) */}
      <Circle cx="200" cy="20" r="60" fill="white" opacity="0.1" />
      <Circle cx="200" cy="20" r="40" fill="white" opacity="0.08" />

      {/* Scattered stars across sky */}
      <Circle cx="15" cy="20" r="2" fill="white" opacity="0.7" />
      <Circle cx="35" cy="35" r="1.5" fill="white" opacity="0.5" />
      <Circle cx="55" cy="15" r="2" fill="white" opacity="0.6" />
      <Circle cx="90" cy="25" r="1.5" fill="white" opacity="0.4" />
      <Circle cx="130" cy="12" r="2" fill="white" opacity="0.5" />
      <Circle cx="160" cy="30" r="1.5" fill="white" opacity="0.6" />

      {/* Sun with glow */}
      <G transform="translate(185, 35)">
        <Circle r="18" fill={accentColor} opacity="0.3" />
        <Circle r="12" fill={accentColor} />
        {/* Sun rays */}
        <Path d="M0 -16 L0 -20" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
        <Path d="M11 -11 L14 -14" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
        <Path d="M16 0 L20 0" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
        <Path d="M11 11 L14 14" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
        <Path d="M-11 -11 L-14 -14" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
        <Path d="M-16 0 L-20 0" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
      </G>

      {/* Crescent moon */}
      <G transform="translate(25, 30)">
        <Circle r="10" fill="white" opacity="0.9" />
        <Circle cx="4" cy="-3" r="8" fill={primaryColor} />
      </G>

      {/* Vertical flashcard - Question side (front) */}
      <G transform="translate(15, 12)">
        <Rect width="70" height="88" rx="10" fill="white" />
        <SvgText x="35" y="28" fontSize="8" fill="#64748b" textAnchor="middle">Question:</SvgText>
        <SvgText x="35" y="44" fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">What was</SvgText>
        <SvgText x="35" y="56" fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">created on</SvgText>
        <SvgText x="35" y="68" fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">Day 1?</SvgText>
        <Rect x="15" y="76" width="40" height="4" rx="2" fill="#e2e8f0" />
      </G>

      {/* Vertical flashcard - Answer side (back) */}
      <G transform="translate(95, 17) rotate(3)">
        <Rect width="65" height="82" rx="10" fill={accentColor} />
        <SvgText x="32" y="28" fontSize="8" fill={primaryColor} opacity="0.7" textAnchor="middle">Answer:</SvgText>
        <SvgText x="32" y="46" fontSize="10" fontWeight="bold" fill={primaryColor} textAnchor="middle">Light</SvgText>
        <SvgText x="32" y="60" fontSize="14" fill={primaryColor} textAnchor="middle">אוֹר</SvgText>
        <Rect x="10" y="68" width="44" height="4" rx="2" fill={primaryColor} opacity="0.3" />
      </G>

      {/* Checkmark badge */}
      <G transform="translate(195, 80)">
        <Circle r="12" fill={accentColor} />
        <Path
          d="M-5 0 L-1 4 L5 -4"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </G>

      {/* Sparkle effects */}
      <Circle cx="160" cy="55" r="3" fill="white" opacity="0.6" />

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        {/* Banner background */}
        <Rect x="-55" y="-12" width="110" height="24" rx="12" fill="white" opacity="0.95" />
        {/* Title text */}
        <SvgText x="0" y="4" fontSize="12" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Bereishis
        </SvgText>
      </G>

      {/* Extra sparkle decorations */}
      <Circle cx="15" cy="115" r="3" fill="white" opacity="0.5" />
      <Circle cx="205" cy="100" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default BereishisFlashcardsIllustration;
