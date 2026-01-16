import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

interface ParshaTriviaIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function ParshaTriviaIllustration({
  width,
  height,
  primaryColor = '#f59e0b',
  secondaryColor = '#fbbf24',
  accentColor = '#fde047',
}: ParshaTriviaIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="parshaTrivBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="220" height="140" fill="url(#parshaTrivBg)" />

      <Circle cx="200" cy="120" r="14" fill="white" opacity="0.1" />
      <Circle cx="20" cy="20" r="10" fill="white" opacity="0.15" />

      {/* Torah Scroll */}
      <G transform="translate(30, 25)">
        <Rect x="0" y="0" width="10" height="60" rx="5" fill="#78350f" />
        <Rect x="50" y="0" width="10" height="60" rx="5" fill="#78350f" />
        <Circle cx="5" cy="0" r="6" fill={accentColor} />
        <Circle cx="5" cy="60" r="6" fill={accentColor} />
        <Circle cx="55" cy="0" r="6" fill={accentColor} />
        <Circle cx="55" cy="60" r="6" fill={accentColor} />
        <Rect x="8" y="8" width="44" height="44" fill="#fef3c7" />
        <Rect x="15" y="15" width="30" height="3" fill="#92400e" opacity="0.4" />
        <Rect x="15" y="22" width="28" height="3" fill="#92400e" opacity="0.4" />
        <Rect x="15" y="29" width="30" height="3" fill="#92400e" opacity="0.4" />
        <Rect x="15" y="36" width="26" height="3" fill="#92400e" opacity="0.4" />
        <Rect x="15" y="43" width="28" height="3" fill="#92400e" opacity="0.4" />
      </G>

      {/* Question Mark */}
      <G transform="translate(120, 20)">
        <Circle cx="35" cy="35" r="35" fill="white" opacity="0.95" />
        <SvgText x="35" y="50" fontSize="45" fontWeight="bold" fill={primaryColor} textAnchor="middle">?</SvgText>
      </G>

      {/* Answer Options */}
      <G transform="translate(100, 85)">
        <Rect x="0" y="0" width="25" height="18" rx="4" fill="white" opacity="0.9" />
        <SvgText x="12" y="13" fontSize="10" fontWeight="bold" fill={primaryColor} textAnchor="middle">A</SvgText>
        <Rect x="30" y="0" width="25" height="18" rx="4" fill="white" opacity="0.9" />
        <SvgText x="42" y="13" fontSize="10" fontWeight="bold" fill={primaryColor} textAnchor="middle">B</SvgText>
        <Rect x="60" y="0" width="25" height="18" rx="4" fill="white" opacity="0.9" />
        <SvgText x="72" y="13" fontSize="10" fontWeight="bold" fill={primaryColor} textAnchor="middle">C</SvgText>
        <Rect x="90" y="0" width="25" height="18" rx="4" fill="white" opacity="0.9" />
        <SvgText x="102" y="13" fontSize="10" fontWeight="bold" fill={primaryColor} textAnchor="middle">D</SvgText>
      </G>

      {/* Sparkles */}
      <Circle cx="95" cy="30" r="3" fill={accentColor} opacity="0.9" />
      <Circle cx="185" cy="45" r="2" fill="white" opacity="0.8" />

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        {/* Banner background */}
        <Rect x="-40" y="-12" width="80" height="24" rx="12" fill="white" opacity="0.95" />
        {/* Title text */}
        <SvgText x="0" y="4" fontSize="13" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Parsha
        </SvgText>
      </G>
    </Svg>
  );
}

export default ParshaTriviaIllustration;
