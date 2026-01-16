import Svg, { Rect, Circle, G, Defs, LinearGradient, Stop, Text as SvgText, Path } from 'react-native-svg';

interface TrueFalseIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function TrueFalseIllustration({
  width,
  height,
  primaryColor = '#0891b2',
  secondaryColor = '#67e8f9',
  accentColor = '#fde047',
}: TrueFalseIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="tfBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#tfBg)" />

      {/* Decorative circles */}
      <Circle cx="200" cy="20" r="12" fill="white" opacity="0.15" />
      <Circle cx="20" cy="120" r="10" fill="white" opacity="0.1" />

      {/* Question card */}
      <G transform="translate(60, 15)">
        <Rect width="100" height="55" rx="10" fill="white" />
        <SvgText
          x="50"
          y="35"
          fontSize="32"
          fontWeight="bold"
          fill={primaryColor}
          textAnchor="middle"
        >
          ?
        </SvgText>
        {/* Statement lines */}
        <Rect x="15" y="42" width="70" height="4" rx="2" fill="#e2e8f0" />
      </G>

      {/* True button (checkmark) */}
      <G transform="translate(35, 80)">
        <Rect width="65" height="45" rx="10" fill="#22c55e" />
        <Circle cx="32" cy="22" r="14" fill="white" />
        <Path
          d="M25 22 L30 27 L40 17"
          stroke="#22c55e"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <SvgText
          x="32"
          y="42"
          fontSize="8"
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
        >
          TRUE
        </SvgText>
      </G>

      {/* False button (X) */}
      <G transform="translate(120, 80)">
        <Rect width="65" height="45" rx="10" fill="#ef4444" />
        <Circle cx="32" cy="22" r="14" fill="white" />
        <Path
          d="M25 15 L40 29 M40 15 L25 29"
          stroke="#ef4444"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <SvgText
          x="32"
          y="42"
          fontSize="8"
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
        >
          FALSE
        </SvgText>
      </G>

      {/* Stars/sparkles */}
      <Circle cx="170" cy="25" r="3" fill={accentColor} opacity="0.9" />
      <Circle cx="50" cy="35" r="2" fill="white" opacity="0.7" />
      <Circle cx="185" cy="100" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default TrueFalseIllustration;
