import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

interface HalachaTriviaIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function HalachaTriviaIllustration({
  width,
  height,
  primaryColor = '#8b5cf6',
  secondaryColor = '#a78bfa',
  accentColor = '#c4b5fd',
}: HalachaTriviaIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="halachaTrivBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="220" height="140" fill="url(#halachaTrivBg)" />

      <Circle cx="200" cy="120" r="14" fill="white" opacity="0.1" />
      <Circle cx="20" cy="20" r="10" fill="white" opacity="0.15" />

      {/* Open Sefer */}
      <G transform="translate(25, 25)">
        <Path d="M0 10 Q30 0 60 10 L60 55 Q30 45 0 55 Z" fill="#fef3c7" />
        <Path d="M60 10 Q90 0 120 10 L120 55 Q90 45 60 55 Z" fill="#fef3c7" />
        <Rect x="60" y="8" width="2" height="48" fill="#78350f" />
        <Rect x="10" y="18" width="40" height="2" fill="#92400e" opacity="0.3" />
        <Rect x="10" y="25" width="38" height="2" fill="#92400e" opacity="0.3" />
        <Rect x="10" y="32" width="40" height="2" fill="#92400e" opacity="0.3" />
        <Rect x="10" y="39" width="35" height="2" fill="#92400e" opacity="0.3" />
        <Rect x="72" y="18" width="40" height="2" fill="#92400e" opacity="0.3" />
        <Rect x="72" y="25" width="38" height="2" fill="#92400e" opacity="0.3" />
        <Rect x="72" y="32" width="40" height="2" fill="#92400e" opacity="0.3" />
        <Rect x="72" y="39" width="36" height="2" fill="#92400e" opacity="0.3" />
      </G>

      {/* Question Mark */}
      <G transform="translate(155, 15)">
        <Circle cx="28" cy="28" r="28" fill="white" opacity="0.95" />
        <SvgText x="28" y="40" fontSize="36" fontWeight="bold" fill={primaryColor} textAnchor="middle">?</SvgText>
      </G>

      {/* Answer Options */}
      <G transform="translate(155, 75)">
        <Rect x="0" y="0" width="22" height="16" rx="4" fill="white" opacity="0.9" />
        <SvgText x="11" y="12" fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">A</SvgText>
        <Rect x="26" y="0" width="22" height="16" rx="4" fill="white" opacity="0.9" />
        <SvgText x="37" y="12" fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">B</SvgText>
        <Rect x="0" y="20" width="22" height="16" rx="4" fill="white" opacity="0.9" />
        <SvgText x="11" y="32" fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">C</SvgText>
        <Rect x="26" y="20" width="22" height="16" rx="4" fill="white" opacity="0.9" />
        <SvgText x="37" y="32" fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">D</SvgText>
      </G>

      {/* Sparkles */}
      <Circle cx="150" cy="35" r="3" fill={accentColor} opacity="0.9" />
      <Circle cx="195" cy="115" r="2" fill="white" opacity="0.8" />

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        {/* Banner background */}
        <Rect x="-40" y="-12" width="80" height="24" rx="12" fill="white" opacity="0.95" />
        {/* Title text */}
        <SvgText x="0" y="4" fontSize="13" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Halacha
        </SvgText>
      </G>
    </Svg>
  );
}

export default HalachaTriviaIllustration;
