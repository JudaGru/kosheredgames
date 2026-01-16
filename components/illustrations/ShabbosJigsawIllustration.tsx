import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText, Ellipse } from 'react-native-svg';

interface ShabbosJigsawIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function ShabbosJigsawIllustration({
  width,
  height,
  primaryColor = '#7c3aed',
  secondaryColor = '#a78bfa',
  accentColor = '#fde047',
}: ShabbosJigsawIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="shabbosJigBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="220" height="140" fill="url(#shabbosJigBg)" />

      <Circle cx="200" cy="120" r="14" fill="white" opacity="0.1" />
      <Circle cx="20" cy="20" r="10" fill="white" opacity="0.15" />

      {/* Main puzzle preview */}
      <G transform="translate(20, 15)">
        <Rect width="100" height="75" rx="6" fill="white" opacity="0.95" />

        {/* Night sky mini scene */}
        <Rect x="5" y="5" width="90" height="40" fill="#1e1b4b" rx="3" />

        {/* Stars */}
        <Circle cx="20" cy="15" r="1" fill="white" opacity="0.8" />
        <Circle cx="50" cy="12" r="1" fill="white" opacity="0.6" />
        <Circle cx="80" cy="18" r="1" fill="white" opacity="0.7" />

        {/* Mini candles */}
        <Rect x="35" y="25" width="6" height="15" rx="1" fill="white" />
        <Path d="M38 25 Q36 20 38 15 Q40 20 38 25" fill="#f97316" />
        <Circle cx="38" cy="18" r="2" fill={accentColor} />

        <Rect x="55" y="25" width="6" height="15" rx="1" fill="white" />
        <Path d="M58 25 Q56 20 58 15 Q60 20 58 25" fill="#f97316" />
        <Circle cx="58" cy="18" r="2" fill={accentColor} />

        {/* Table */}
        <Rect x="5" y="45" width="90" height="25" fill="#f5f5f4" rx="2" />

        {/* Challah */}
        <Ellipse cx="50" cy="58" rx="20" ry="8" fill="#d4a574" />
        <Path d="M35 56 Q50 52 65 56" stroke="#a0785c" strokeWidth="1.5" fill="none" />

        {/* Puzzle grid lines */}
        <Path d="M5 30 L95 30" stroke="#94a3b8" strokeWidth="0.5" opacity="0.3" />
        <Path d="M55 5 L55 70" stroke="#94a3b8" strokeWidth="0.5" opacity="0.3" />
      </G>

      {/* Floating puzzle piece */}
      <G transform="translate(130, 25) rotate(12)">
        <Path
          d="M 0 0 L 40 0 L 40 20 C 40 20 45 20 45 25 C 45 30 40 30 40 30 L 40 50 L 20 50 C 20 50 20 55 15 55 C 10 55 10 50 10 50 L 0 50 L 0 30 C 0 30 -5 30 -5 25 C -5 20 0 20 0 20 Z"
          fill="white"
          stroke={accentColor}
          strokeWidth="2"
        />
        {/* Mini candle on piece */}
        <Rect x="15" y="15" width="4" height="12" fill="white" stroke="#e2e8f0" strokeWidth="0.5" />
        <Path d="M17 15 Q15 10 17 6 Q19 10 17 15" fill="#f97316" />
        <Circle cx="17" cy="9" r="2" fill={accentColor} />
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
      <Circle cx="175" cy="65" r="3" fill={accentColor} opacity="0.9" />
      <Circle cx="190" cy="45" r="2" fill="white" opacity="0.8" />

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
          Shabbos
        </SvgText>
      </G>

      <Circle cx="195" cy="115" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default ShabbosJigsawIllustration;
