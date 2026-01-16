import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

interface NachTrueFalseIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function NachTrueFalseIllustration({
  width,
  height,
  primaryColor = '#0d9488',
  secondaryColor = '#14b8a6',
  accentColor = '#5eead4',
}: NachTrueFalseIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="nachTFBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="220" height="140" fill="url(#nachTFBg)" />

      <Circle cx="200" cy="120" r="14" fill="white" opacity="0.1" />
      <Circle cx="20" cy="20" r="10" fill="white" opacity="0.15" />

      {/* Scroll representing Nach */}
      <G transform="translate(30, 20)">
        <Rect x="0" y="5" width="8" height="50" rx="4" fill="#78350f" />
        <Rect x="52" y="5" width="8" height="50" rx="4" fill="#78350f" />
        <Rect x="6" y="10" width="48" height="40" fill="#fef3c7" />
        <Rect x="12" y="18" width="36" height="2" fill="#92400e" opacity="0.4" />
        <Rect x="12" y="25" width="34" height="2" fill="#92400e" opacity="0.4" />
        <Rect x="12" y="32" width="36" height="2" fill="#92400e" opacity="0.4" />
        <Rect x="12" y="39" width="30" height="2" fill="#92400e" opacity="0.4" />
      </G>

      {/* True button */}
      <G transform="translate(110, 20)">
        <Rect x="0" y="0" width="85" height="35" rx="10" fill="#22c55e" />
        <Path d="M25 17 L35 27 L55 7" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <SvgText x="42" y="32" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">TRUE</SvgText>
      </G>

      {/* False button */}
      <G transform="translate(110, 62)">
        <Rect x="0" y="0" width="85" height="35" rx="10" fill="#ef4444" />
        <Path d="M30 8 L55 28 M55 8 L30 28" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
        <SvgText x="42" y="32" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">FALSE</SvgText>
      </G>

      {/* Sparkles */}
      <Circle cx="100" cy="45" r="3" fill={accentColor} opacity="0.9" />
      <Circle cx="205" cy="40" r="2" fill="white" opacity="0.8" />

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        {/* Banner background */}
        <Rect x="-30" y="-12" width="60" height="24" rx="12" fill="white" opacity="0.95" />
        {/* Title text */}
        <SvgText x="0" y="4" fontSize="13" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Nach
        </SvgText>
      </G>
    </Svg>
  );
}

export default NachTrueFalseIllustration;
