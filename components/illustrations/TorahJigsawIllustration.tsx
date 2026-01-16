import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText, Ellipse } from 'react-native-svg';

interface TorahJigsawIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function TorahJigsawIllustration({
  width,
  height,
  primaryColor = '#0d9488',
  secondaryColor = '#2dd4bf',
  accentColor = '#fde047',
}: TorahJigsawIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="torahJigBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
        <LinearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#fcd34d" />
          <Stop offset="100%" stopColor="#b45309" />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="220" height="140" fill="url(#torahJigBg)" />

      <Circle cx="200" cy="120" r="14" fill="white" opacity="0.1" />
      <Circle cx="20" cy="20" r="10" fill="white" opacity="0.15" />

      {/* Main puzzle preview */}
      <G transform="translate(20, 15)">
        <Rect width="100" height="75" rx="6" fill="white" opacity="0.95" />

        {/* Background */}
        <Rect x="5" y="5" width="90" height="65" fill="#f0fdfa" rx="3" />

        {/* Torah scroll mini */}
        <G transform="translate(25, 15)">
          {/* Left Etz Chaim */}
          <Rect x="0" y="5" width="8" height="45" rx="4" fill="#78350f" />
          <Circle cx="4" cy="5" r="5" fill="url(#goldGrad)" />
          <Circle cx="4" cy="50" r="5" fill="url(#goldGrad)" />

          {/* Right Etz Chaim */}
          <Rect x="42" y="5" width="8" height="45" rx="4" fill="#78350f" />
          <Circle cx="46" cy="5" r="5" fill="url(#goldGrad)" />
          <Circle cx="46" cy="50" r="5" fill="url(#goldGrad)" />

          {/* Parchment */}
          <Rect x="6" y="10" width="38" height="35" fill="#fef3c7" />

          {/* Text lines */}
          <Rect x="10" y="16" width="30" height="2" fill="#92400e" opacity="0.4" />
          <Rect x="10" y="22" width="28" height="2" fill="#92400e" opacity="0.4" />
          <Rect x="10" y="28" width="30" height="2" fill="#92400e" opacity="0.4" />
          <Rect x="10" y="34" width="26" height="2" fill="#92400e" opacity="0.4" />

          {/* Crown */}
          <Path d="M15 -8 L13 2 L18 -3 L25 3 L32 -3 L37 2 L35 -8 Z" fill="url(#goldGrad)" />
          <Circle cx="25" cy="-5" r="3" fill="#dc2626" />
        </G>

        {/* Puzzle grid lines */}
        <Path d="M5 42 L95 42" stroke="#94a3b8" strokeWidth="0.5" opacity="0.3" />
        <Path d="M55 5 L55 70" stroke="#94a3b8" strokeWidth="0.5" opacity="0.3" />
      </G>

      {/* Floating puzzle piece */}
      <G transform="translate(130, 25) rotate(-8)">
        <Path
          d="M 0 0 L 40 0 L 40 20 C 40 20 45 20 45 25 C 45 30 40 30 40 30 L 40 50 L 20 50 C 20 50 20 55 15 55 C 10 55 10 50 10 50 L 0 50 L 0 30 C 0 30 -5 30 -5 25 C -5 20 0 20 0 20 Z"
          fill="white"
          stroke={accentColor}
          strokeWidth="2"
        />
        {/* Star of David on piece */}
        <Path d="M20 12 L28 25 L12 25 Z" fill="none" stroke={primaryColor} strokeWidth="1.5" />
        <Path d="M20 28 L12 15 L28 15 Z" fill="none" stroke={primaryColor} strokeWidth="1.5" />
      </G>

      {/* Movement lines */}
      <Path
        d="M125 55 Q 130 50 135 48"
        stroke={accentColor}
        strokeWidth="2"
        strokeDasharray="4,3"
        fill="none"
        opacity="0.6"
      />
      <Circle cx="122" cy="58" r="2" fill={accentColor} opacity="0.8" />

      {/* Sparkles */}
      <Circle cx="178" cy="62" r="3" fill={accentColor} opacity="0.9" />
      <Circle cx="192" cy="42" r="2" fill="white" opacity="0.8" />

      {/* Title banner */}
      <G transform="translate(10, 100)">
        <Rect x="0" y="0" width="110" height="32" rx="8" fill="white" opacity="0.95" />
        <SvgText x="55" y="15" fontSize="11" fontWeight="bold" fill={primaryColor} textAnchor="middle">Torah Puzzle</SvgText>
        <SvgText x="55" y="27" fontSize="9" fill="#64748b" textAnchor="middle">Sefer Torah</SvgText>
      </G>

      <Circle cx="195" cy="115" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default TorahJigsawIllustration;
