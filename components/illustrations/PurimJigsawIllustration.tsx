import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText, Ellipse } from 'react-native-svg';

interface PurimJigsawIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function PurimJigsawIllustration({
  width,
  height,
  primaryColor = '#db2777',
  secondaryColor = '#f472b6',
  accentColor = '#fde047',
}: PurimJigsawIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="purimJigBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="220" height="140" fill="url(#purimJigBg)" />

      {/* Confetti */}
      <Circle cx="30" cy="25" r="4" fill={accentColor} opacity="0.7" />
      <Circle cx="190" cy="30" r="3" fill="#3b82f6" opacity="0.6" />
      <Circle cx="200" cy="120" r="14" fill="white" opacity="0.1" />
      <Rect x="150" y="20" width="10" height="3" rx="1" fill="#22c55e" transform="rotate(20 155 21)" opacity="0.6" />

      {/* Main puzzle preview */}
      <G transform="translate(20, 15)">
        <Rect width="100" height="75" rx="6" fill="white" opacity="0.95" />

        {/* Background */}
        <Rect x="5" y="5" width="90" height="65" fill="#fdf4ff" rx="3" />

        {/* Megillah scroll */}
        <G transform="translate(10, 15)">
          <Rect x="0" y="0" width="8" height="45" rx="4" fill="#8b4513" />
          <Rect x="52" y="0" width="8" height="45" rx="4" fill="#8b4513" />
          <Rect x="6" y="5" width="48" height="35" fill="#fef3c7" />
          {/* Text lines */}
          <Rect x="10" y="12" width="40" height="2" fill="#92400e" opacity="0.4" />
          <Rect x="10" y="18" width="38" height="2" fill="#92400e" opacity="0.4" />
          <Rect x="10" y="24" width="40" height="2" fill="#92400e" opacity="0.4" />
          <Rect x="10" y="30" width="35" height="2" fill="#92400e" opacity="0.4" />
        </G>

        {/* Crown */}
        <Path d="M70 20 L68 30 L72 25 L76 32 L80 25 L84 30 L82 20 Z" fill={accentColor} />
        <Circle cx="76" cy="22" r="2" fill="#dc2626" />

        {/* Hamantasch */}
        <Path d="M75 50 L85 65 L65 65 Z" fill="#d4a574" />
        <Circle cx="75" cy="58" r="5" fill="#7c3aed" />

        {/* Puzzle grid lines */}
        <Path d="M5 42 L95 42" stroke="#94a3b8" strokeWidth="0.5" opacity="0.3" />
        <Path d="M55 5 L55 70" stroke="#94a3b8" strokeWidth="0.5" opacity="0.3" />
      </G>

      {/* Floating puzzle piece */}
      <G transform="translate(130, 25) rotate(15)">
        <Path
          d="M 0 0 L 40 0 L 40 20 C 40 20 45 20 45 25 C 45 30 40 30 40 30 L 40 50 L 20 50 C 20 50 20 55 15 55 C 10 55 10 50 10 50 L 0 50 L 0 30 C 0 30 -5 30 -5 25 C -5 20 0 20 0 20 Z"
          fill="white"
          stroke={accentColor}
          strokeWidth="2"
        />
        {/* Mask on piece */}
        <Ellipse cx="20" cy="22" rx="12" ry="10" fill={accentColor} />
        <Ellipse cx="15" cy="20" rx="4" ry="3" fill="white" />
        <Ellipse cx="25" cy="20" rx="4" ry="3" fill="white" />
        <Circle cx="15" cy="20" r="2" fill="#1e293b" />
        <Circle cx="25" cy="20" r="2" fill="#1e293b" />
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
      <Circle cx="180" cy="65" r="3" fill={accentColor} opacity="0.9" />
      <Circle cx="195" cy="45" r="2" fill="white" opacity="0.8" />

      {/* Title banner */}
      <G transform="translate(110, 115)">
        <Rect
          x="-35"
          y="-12"
          width="70"
          height="24"
          rx="12"
          fill="white"
          opacity="0.95"
        />
        <SvgText
          x="0"
          y="4"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
          fill={primaryColor}
        >
          Purim
        </SvgText>
      </G>

      <Circle cx="195" cy="115" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default PurimJigsawIllustration;
