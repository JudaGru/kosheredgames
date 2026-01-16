import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText, Ellipse } from 'react-native-svg';

interface BrachosMatchIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function BrachosMatchIllustration({
  width,
  height,
  primaryColor = '#16a34a',
  secondaryColor = '#22c55e',
  accentColor = '#fde047',
}: BrachosMatchIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="brachosBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
        <LinearGradient id="breadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#fbbf24" />
          <Stop offset="100%" stopColor="#d97706" />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#brachosBg)" />

      {/* Decorative circles */}
      <Circle cx="200" cy="20" r="15" fill="white" opacity="0.15" />
      <Circle cx="15" cy="125" r="10" fill="white" opacity="0.1" />

      {/* Food card - Challah/Bread */}
      <G transform="translate(20, 20)">
        <Rect width="55" height="70" rx="8" fill="white" />
        {/* Challah bread */}
        <Ellipse cx="27" cy="35" rx="20" ry="12" fill="url(#breadGrad)" />
        <Path d="M12 35 Q27 28 42 35" stroke="#92400e" strokeWidth="1.5" fill="none" />
        <Path d="M15 35 Q27 30 39 35" stroke="#92400e" strokeWidth="1.5" fill="none" />
        <SvgText x="27" y="62" fontSize="9" fontWeight="600" fill="#64748b" textAnchor="middle">
          Challah
        </SvgText>
      </G>

      {/* Bracha card - Hamotzi */}
      <G transform="translate(85, 20)">
        <Rect width="55" height="70" rx="8" fill={accentColor} />
        <SvgText x="27" y="32" fontSize="12" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          המוציא
        </SvgText>
        <SvgText x="27" y="50" fontSize="8" fontWeight="500" fill="#64748b" textAnchor="middle">
          Hamotzi
        </SvgText>
        <SvgText x="27" y="62" fontSize="7" fill="#64748b" textAnchor="middle">
          (Bread)
        </SvgText>
      </G>

      {/* Match line connecting them */}
      <Path
        d="M75 55 L85 55"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Circle cx="80" cy="55" r="5" fill="white" opacity="0.8" />
      <SvgText x="80" y="58" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">
        ✓
      </SvgText>

      {/* Apple card */}
      <G transform="translate(150, 15)">
        <Rect width="50" height="60" rx="6" fill="white" />
        {/* Apple */}
        <Circle cx="25" cy="28" r="14" fill="#ef4444" />
        <Path d="M25 14 Q28 10 30 14" stroke="#22c55e" strokeWidth="2" fill="none" />
        <Ellipse cx="22" cy="25" rx="3" ry="4" fill="#fca5a5" opacity="0.5" />
        <SvgText x="25" y="55" fontSize="8" fontWeight="600" fill="#64748b" textAnchor="middle">
          Apple
        </SvgText>
      </G>

      {/* Flipped bracha card */}
      <G transform="translate(150, 80)">
        <Rect width="50" height="50" rx="6" fill={accentColor} opacity="0.7" />
        <Circle cx="25" cy="25" r="12" fill={primaryColor} opacity="0.3" />
        <SvgText x="25" y="30" fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          ?
        </SvgText>
      </G>

      {/* Question mark hint */}
      <G transform="translate(165, 60)">
        <Path
          d="M0 10 Q5 0 10 10"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="3 2"
          fill="none"
        />
      </G>

      {/* Wine glass decoration */}
      <G transform="translate(25, 95)">
        <Path d="M10 0 L15 20 L5 20 Z" fill="#7c3aed" />
        <Rect x="8" y="20" width="4" height="8" fill="#64748b" />
        <Rect x="4" y="28" width="12" height="3" rx="1" fill="#64748b" />
      </G>

      {/* Title banner */}
      <G transform="translate(10, 100)">
        <Rect x="0" y="0" width="130" height="32" rx="8" fill="white" opacity="0.95" />
        <SvgText x="65" y="15" fontSize="12" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Brachos Match
        </SvgText>
        <SvgText x="65" y="27" fontSize="9" fill="#64748b" textAnchor="middle">
          Foods & Blessings
        </SvgText>
      </G>

      {/* Sparkles */}
      <Circle cx="120" cy="12" r="2" fill="white" opacity="0.8" />
    </Svg>
  );
}

export default BrachosMatchIllustration;
