import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText, Ellipse, Line } from 'react-native-svg';

interface ParshaMatchIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function ParshaMatchIllustration({
  width,
  height,
  primaryColor = '#059669',
  secondaryColor = '#10b981',
  accentColor = '#fde047',
}: ParshaMatchIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="parshaBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
        <LinearGradient id="ladderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#fbbf24" />
          <Stop offset="100%" stopColor="#f59e0b" />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#parshaBg)" />

      {/* Decorative circles */}
      <Circle cx="200" cy="20" r="15" fill="white" opacity="0.15" />
      <Circle cx="15" cy="125" r="10" fill="white" opacity="0.1" />

      {/* Character card - Yaakov */}
      <G transform="translate(15, 15)">
        <Rect width="55" height="70" rx="8" fill="white" />
        {/* Simple person silhouette */}
        <Circle cx="27" cy="25" r="10" fill={primaryColor} />
        <Path d="M17 55 L27 38 L37 55" fill={primaryColor} />
        {/* Staff */}
        <Line x1="38" y1="28" x2="45" y2="55" stroke="#92400e" strokeWidth="2" />
        <SvgText x="27" y="65" fontSize="8" fontWeight="600" fill="#64748b" textAnchor="middle">
          Yaakov
        </SvgText>
      </G>

      {/* Story card - Ladder */}
      <G transform="translate(80, 15)">
        <Rect width="55" height="70" rx="8" fill={accentColor} />
        {/* Ladder (Sulam) */}
        <Rect x="20" y="15" width="4" height="45" fill="url(#ladderGrad)" />
        <Rect x="31" y="15" width="4" height="45" fill="url(#ladderGrad)" />
        {/* Rungs */}
        <Rect x="20" y="20" width="15" height="3" fill="#d97706" />
        <Rect x="20" y="30" width="15" height="3" fill="#d97706" />
        <Rect x="20" y="40" width="15" height="3" fill="#d97706" />
        <Rect x="20" y="50" width="15" height="3" fill="#d97706" />
        {/* Angels - small circles going up */}
        <Circle cx="15" cy="25" r="4" fill="white" opacity="0.8" />
        <Circle cx="40" cy="35" r="4" fill="white" opacity="0.8" />
        <Circle cx="12" cy="45" r="4" fill="white" opacity="0.8" />
        <SvgText x="27" y="65" fontSize="8" fontWeight="600" fill={primaryColor} textAnchor="middle">
          Ladder
        </SvgText>
      </G>

      {/* Match indicator */}
      <G transform="translate(67, 45)">
        <Circle r="8" fill="white" />
        <SvgText x="0" y="4" fontSize="10" fontWeight="bold" fill="#22c55e" textAnchor="middle">
          ✓
        </SvgText>
      </G>

      {/* Noach card */}
      <G transform="translate(145, 10)">
        <Rect width="55" height="60" rx="6" fill="white" />
        {/* Ark (Teivah) */}
        <Path
          d="M12 40 L27 25 L42 40 L42 50 L12 50 Z"
          fill="#92400e"
        />
        <Rect x="22" y="30" width="10" height="12" fill="#fef3c7" />
        {/* Rainbow hint */}
        <Path
          d="M10 22 Q27 8 44 22"
          stroke="#ef4444"
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M12 25 Q27 12 42 25"
          stroke="#f59e0b"
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M14 28 Q27 16 40 28"
          stroke="#22c55e"
          strokeWidth="2"
          fill="none"
        />
        <SvgText x="27" y="56" fontSize="7" fontWeight="600" fill="#64748b" textAnchor="middle">
          Noach
        </SvgText>
      </G>

      {/* Flipped card */}
      <G transform="translate(145, 78)">
        <Rect width="55" height="50" rx="6" fill={accentColor} opacity="0.7" />
        <Circle cx="27" cy="25" r="12" fill={primaryColor} opacity="0.3" />
        <SvgText x="27" y="30" fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          ?
        </SvgText>
      </G>

      {/* Title banner */}
      <G transform="translate(10, 100)">
        <Rect x="0" y="0" width="130" height="32" rx="8" fill="white" opacity="0.95" />
        <SvgText x="65" y="15" fontSize="12" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Parsha Match
        </SvgText>
        <SvgText x="65" y="27" fontSize="9" fill="#64748b" textAnchor="middle">
          Torah Characters
        </SvgText>
      </G>

      {/* Sparkles */}
      <Circle cx="120" cy="8" r="2" fill="white" opacity="0.8" />
      <Circle cx="175" cy="120" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default ParshaMatchIllustration;
