import Svg, { Rect, Circle, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

interface AlefBeisMatchIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function AlefBeisMatchIllustration({
  width,
  height,
  primaryColor = '#f59e0b',
  secondaryColor = '#fbbf24',
  accentColor = '#fde047',
}: AlefBeisMatchIllustrationProps) {
  // Letter colors from the game
  const letterColors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#14b8a6', '#0ea5e9', '#8b5cf6', '#ec4899',
    '#06b6d4', '#6366f1', '#84cc16', '#f43f5e'
  ];

  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="alefBeisBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
        <LinearGradient id="cardShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <Stop offset="100%" stopColor="white" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Background gradient */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#alefBeisBg)" />

      {/* Decorative circles in corners */}
      <Circle cx="10" cy="10" r="20" fill="white" opacity="0.08" />
      <Circle cx="210" cy="130" r="25" fill="white" opacity="0.06" />
      <Circle cx="200" cy="15" r="8" fill="white" opacity="0.1" />

      {/* Letter indicator circles at top - arranged in arc */}
      {letterColors.map((color, i) => {
        const angle = (i - 5.5) * 12 * (Math.PI / 180);
        const radius = 85;
        const cx = 110 + Math.sin(angle) * radius;
        const cy = -20 + Math.cos(angle) * radius;
        return (
          <Circle
            key={i}
            cx={cx}
            cy={cy}
            r="5"
            fill={color}
            opacity="0.85"
          />
        );
      })}

      {/* Main matching cards display */}
      {/* Card 1 - Alef - face up */}
      <G transform="translate(22, 35)">
        <Rect width="48" height="60" rx="6" fill="#000" opacity="0.12" transform="translate(2, 2)" />
        <Rect width="48" height="60" rx="6" fill="white" />
        <Rect x="4" y="4" width="40" height="32" rx="4" fill="#fef3c7" />
        <SvgText x="24" y="30" fontSize="24" fontWeight="bold" fill="#ef4444" textAnchor="middle">א</SvgText>
        <SvgText x="24" y="50" fontSize="9" fontWeight="bold" fill="#b45309" textAnchor="middle">Alef</SvgText>
      </G>

      {/* Card 2 - Alef - matching! with glow */}
      <G transform="translate(78, 35)">
        {/* Glow effect */}
        <Rect width="52" height="64" rx="8" fill={accentColor} opacity="0.35" transform="translate(-2, -2)" />
        <Rect width="48" height="60" rx="6" fill="#000" opacity="0.1" transform="translate(2, 2)" />
        <Rect width="48" height="60" rx="6" fill="white" stroke={accentColor} strokeWidth="2.5" />
        <Rect x="4" y="4" width="40" height="32" rx="4" fill="#fef3c7" />
        <SvgText x="24" y="30" fontSize="24" fontWeight="bold" fill="#ef4444" textAnchor="middle">א</SvgText>
        <SvgText x="24" y="50" fontSize="9" fontWeight="bold" fill="#b45309" textAnchor="middle">Alef</SvgText>
      </G>

      {/* Sparkle/match effect between cards */}
      <Circle cx="73" cy="60" r="4" fill="#fde047" opacity="0.9" />
      <Circle cx="73" cy="60" r="7" fill="#fde047" opacity="0.4" />
      <Circle cx="68" cy="52" r="2" fill="white" opacity="0.9" />
      <Circle cx="78" cy="68" r="2.5" fill="white" opacity="0.8" />

      {/* Card 3 - Face down (amber back) */}
      <G transform="translate(134, 35)">
        <Rect width="48" height="60" rx="6" fill="#000" opacity="0.1" transform="translate(2, 2)" />
        <Rect width="48" height="60" rx="6" fill={primaryColor} />
        {/* Card pattern */}
        <Rect x="5" y="5" width="38" height="50" rx="4" fill="none" stroke="white" strokeWidth="1.5" opacity="0.25" />
        <Rect x="10" y="10" width="28" height="40" rx="3" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
        <SvgText x="24" y="38" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle" opacity="0.9">?</SvgText>
      </G>

      {/* Card 4 - Small preview card (Beis) floating */}
      <G transform="translate(188, 45) rotate(8)">
        <Rect width="28" height="35" rx="4" fill="#000" opacity="0.1" transform="translate(1, 1)" />
        <Rect width="28" height="35" rx="4" fill="white" />
        <SvgText x="14" y="20" fontSize="16" fontWeight="bold" fill="#f97316" textAnchor="middle">ב</SvgText>
        <Rect x="5" y="26" width="18" height="4" rx="2" fill="#f97316" opacity="0.6" />
      </G>

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        {/* Banner background */}
        <Rect x="-45" y="-12" width="90" height="24" rx="12" fill="white" opacity="0.95" />
        {/* Title text */}
        <SvgText x="0" y="4" fontSize="13" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Alef-Beis
        </SvgText>
      </G>

      {/* Extra sparkle decorations */}
      <Circle cx="15" cy="115" r="3" fill="white" opacity="0.5" />
      <Circle cx="175" cy="25" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default AlefBeisMatchIllustration;
