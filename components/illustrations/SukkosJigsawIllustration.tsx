import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText, Ellipse, Line } from 'react-native-svg';

interface SukkosJigsawIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function SukkosJigsawIllustration({
  width,
  height,
  primaryColor = '#65a30d',
  secondaryColor = '#a3e635',
  accentColor = '#fde047',
}: SukkosJigsawIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="sukkosJigBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="220" height="140" fill="url(#sukkosJigBg)" />

      <Circle cx="200" cy="120" r="14" fill="white" opacity="0.1" />
      <Circle cx="20" cy="20" r="10" fill="white" opacity="0.15" />

      {/* Main puzzle preview */}
      <G transform="translate(20, 15)">
        <Rect width="100" height="75" rx="6" fill="white" opacity="0.95" />

        {/* Sky */}
        <Rect x="5" y="5" width="90" height="30" fill="#60a5fa" rx="3" />

        {/* Sun */}
        <Circle cx="80" cy="15" r="8" fill={accentColor} />

        {/* Sukkah structure */}
        <Rect x="15" y="30" width="70" height="35" fill="#d4a574" opacity="0.3" />

        {/* Schach */}
        <Path d="M10 28 Q25 22 40 28 Q55 22 70 28 Q85 22 95 28" stroke="#166534" strokeWidth="4" fill="none" />
        <Path d="M15 32 Q30 26 45 32 Q60 26 75 32 Q90 26 95 32" stroke="#22c55e" strokeWidth="3" fill="none" />

        {/* Walls/posts */}
        <Rect x="15" y="30" width="5" height="40" fill="#92400e" />
        <Rect x="80" y="30" width="5" height="40" fill="#92400e" />

        {/* Lulav and Esrog hint */}
        <Line x1="50" y1="50" x2="50" y2="35" stroke="#84cc16" strokeWidth="2" />
        <Ellipse cx="45" cy="55" rx="5" ry="4" fill={accentColor} />

        {/* Puzzle grid lines */}
        <Path d="M5 42 L95 42" stroke="#94a3b8" strokeWidth="0.5" opacity="0.3" />
        <Path d="M55 5 L55 70" stroke="#94a3b8" strokeWidth="0.5" opacity="0.3" />
      </G>

      {/* Floating puzzle piece */}
      <G transform="translate(130, 25) rotate(-10)">
        <Path
          d="M 0 0 L 40 0 L 40 20 C 40 20 45 20 45 25 C 45 30 40 30 40 30 L 40 50 L 20 50 C 20 50 20 55 15 55 C 10 55 10 50 10 50 L 0 50 L 0 30 C 0 30 -5 30 -5 25 C -5 20 0 20 0 20 Z"
          fill="white"
          stroke={accentColor}
          strokeWidth="2"
        />
        {/* Mini schach on piece */}
        <Path d="M8 15 Q15 10 22 15 Q29 10 35 15" stroke="#166534" strokeWidth="2" fill="none" />
        <Path d="M10 20 Q17 15 24 20 Q31 15 35 20" stroke="#22c55e" strokeWidth="1.5" fill="none" />
        {/* Mini lulav */}
        <Line x1="20" y1="40" x2="20" y2="28" stroke="#84cc16" strokeWidth="2" />
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
      <Circle cx="180" cy="60" r="3" fill={accentColor} opacity="0.9" />
      <Circle cx="195" cy="40" r="2" fill="white" opacity="0.8" />

      {/* Title banner */}
      <G transform="translate(10, 100)">
        <Rect x="0" y="0" width="115" height="32" rx="8" fill="white" opacity="0.95" />
        <SvgText x="57" y="15" fontSize="11" fontWeight="bold" fill={primaryColor} textAnchor="middle">Sukkos Puzzle</SvgText>
        <SvgText x="57" y="27" fontSize="9" fill="#64748b" textAnchor="middle">The Sukkah</SvgText>
      </G>

      <Circle cx="195" cy="115" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default SukkosJigsawIllustration;
