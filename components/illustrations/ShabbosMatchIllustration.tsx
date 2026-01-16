import Svg, { Rect, Circle, G, Defs, LinearGradient, Stop, Text as SvgText, Path, Ellipse, Line } from 'react-native-svg';

interface ShabbosMatchIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function ShabbosMatchIllustration({
  width,
  height,
  primaryColor = '#eab308',
  secondaryColor = '#fbbf24',
  accentColor = '#fde047',
}: ShabbosMatchIllustrationProps) {
  // Shabbos item colors from the game
  const shabbosColors = [
    '#eab308', '#92400e', '#7c3aed', '#f59e0b',
    '#ec4899', '#0ea5e9', '#8b5cf6', '#14b8a6',
    '#f97316', '#64748b', '#1e3a8a', '#22c55e'
  ];

  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="shabbosBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
        <LinearGradient id="cardShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <Stop offset="100%" stopColor="white" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Background gradient */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#shabbosBg)" />

      {/* Decorative circles in corners */}
      <Circle cx="10" cy="10" r="20" fill="white" opacity="0.08" />
      <Circle cx="210" cy="130" r="25" fill="white" opacity="0.06" />
      <Circle cx="200" cy="15" r="8" fill="white" opacity="0.1" />

      {/* Shabbos indicator circles at top - arranged in arc */}
      {shabbosColors.map((color, i) => {
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
      {/* Card 1 - Candles - face up */}
      <G transform="translate(22, 35)">
        <Rect width="48" height="60" rx="6" fill="#000" opacity="0.12" transform="translate(2, 2)" />
        <Rect width="48" height="60" rx="6" fill="white" />
        <Rect x="4" y="4" width="40" height="32" rx="4" fill="#fef9c3" />
        {/* Candles SVG icon */}
        <G transform="translate(12, 6) scale(0.5)">
          <Rect x="8" y="16" width="8" height="24" rx="1" fill="#eab308" />
          <Ellipse cx="12" cy="16" rx="4" ry="1.5" fill="#eab308" />
          <Path d="M12 4 C12 4 8 10 8 13 C8 15 10 16 12 16 C14 16 16 15 16 13 C16 10 12 4 12 4Z" fill="#fbbf24" />
          <Path d="M12 7 C12 7 10 10 10 12 C10 13 11 14 12 14 C13 14 14 13 14 12 C14 10 12 7 12 7Z" fill="#fef3c7" />
          <Rect x="32" y="16" width="8" height="24" rx="1" fill="#eab308" />
          <Ellipse cx="36" cy="16" rx="4" ry="1.5" fill="#eab308" />
          <Path d="M36 4 C36 4 32 10 32 13 C32 15 34 16 36 16 C38 16 40 15 40 13 C40 10 36 4 36 4Z" fill="#fbbf24" />
          <Path d="M36 7 C36 7 34 10 34 12 C34 13 35 14 36 14 C37 14 38 13 38 12 C38 10 36 7 36 7Z" fill="#fef3c7" />
          <Rect x="4" y="40" width="40" height="3" rx="1" fill="#a16207" />
        </G>
        <SvgText x="24" y="50" fontSize="9" fontWeight="bold" fill="#eab308" textAnchor="middle">Licht</SvgText>
      </G>

      {/* Card 2 - Candles - matching! with glow */}
      <G transform="translate(78, 35)">
        {/* Glow effect */}
        <Rect width="52" height="64" rx="8" fill={accentColor} opacity="0.35" transform="translate(-2, -2)" />
        <Rect width="48" height="60" rx="6" fill="#000" opacity="0.1" transform="translate(2, 2)" />
        <Rect width="48" height="60" rx="6" fill="white" stroke={accentColor} strokeWidth="2.5" />
        <Rect x="4" y="4" width="40" height="32" rx="4" fill="#fef9c3" />
        {/* Candles SVG icon */}
        <G transform="translate(12, 6) scale(0.5)">
          <Rect x="8" y="16" width="8" height="24" rx="1" fill="#eab308" />
          <Ellipse cx="12" cy="16" rx="4" ry="1.5" fill="#eab308" />
          <Path d="M12 4 C12 4 8 10 8 13 C8 15 10 16 12 16 C14 16 16 15 16 13 C16 10 12 4 12 4Z" fill="#fbbf24" />
          <Path d="M12 7 C12 7 10 10 10 12 C10 13 11 14 12 14 C13 14 14 13 14 12 C14 10 12 7 12 7Z" fill="#fef3c7" />
          <Rect x="32" y="16" width="8" height="24" rx="1" fill="#eab308" />
          <Ellipse cx="36" cy="16" rx="4" ry="1.5" fill="#eab308" />
          <Path d="M36 4 C36 4 32 10 32 13 C32 15 34 16 36 16 C38 16 40 15 40 13 C40 10 36 4 36 4Z" fill="#fbbf24" />
          <Path d="M36 7 C36 7 34 10 34 12 C34 13 35 14 36 14 C37 14 38 13 38 12 C38 10 36 7 36 7Z" fill="#fef3c7" />
          <Rect x="4" y="40" width="40" height="3" rx="1" fill="#a16207" />
        </G>
        <SvgText x="24" y="50" fontSize="9" fontWeight="bold" fill="#eab308" textAnchor="middle">Licht</SvgText>
      </G>

      {/* Sparkle/match effect between cards */}
      <Circle cx="73" cy="60" r="4" fill="#fde047" opacity="0.9" />
      <Circle cx="73" cy="60" r="7" fill="#fde047" opacity="0.4" />
      <Circle cx="68" cy="52" r="2" fill="white" opacity="0.9" />
      <Circle cx="78" cy="68" r="2.5" fill="white" opacity="0.8" />

      {/* Card 3 - Face down (yellow back) */}
      <G transform="translate(134, 35)">
        <Rect width="48" height="60" rx="6" fill="#000" opacity="0.1" transform="translate(2, 2)" />
        <Rect width="48" height="60" rx="6" fill={primaryColor} />
        {/* Card pattern */}
        <Rect x="5" y="5" width="38" height="50" rx="4" fill="none" stroke="white" strokeWidth="1.5" opacity="0.25" />
        <Rect x="10" y="10" width="28" height="40" rx="3" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
        {/* Small candle icon on back */}
        <G transform="translate(16, 22) scale(0.3)">
          <Rect x="8" y="16" width="8" height="24" rx="1" fill="white" opacity="0.9" />
          <Path d="M12 4 C12 4 8 10 8 13 C8 15 10 16 12 16 C14 16 16 15 16 13 C16 10 12 4 12 4Z" fill="white" opacity="0.9" />
          <Rect x="32" y="16" width="8" height="24" rx="1" fill="white" opacity="0.9" />
          <Path d="M36 4 C36 4 32 10 32 13 C32 15 34 16 36 16 C38 16 40 15 40 13 C40 10 36 4 36 4Z" fill="white" opacity="0.9" />
        </G>
      </G>

      {/* Card 4 - Small preview card (Challah) floating */}
      <G transform="translate(188, 45) rotate(8)">
        <Rect width="28" height="35" rx="4" fill="#000" opacity="0.1" transform="translate(1, 1)" />
        <Rect width="28" height="35" rx="4" fill="white" />
        {/* Challah mini icon */}
        <G transform="translate(4, 4) scale(0.3)">
          <Path d="M8 32 Q8 24 16 22 Q32 20 48 22 Q56 24 56 32 Q56 40 48 42 Q32 44 16 42 Q8 40 8 32Z" fill="#92400e" />
          <Path d="M14 26 Q24 22 32 26 Q40 30 50 26" stroke="#fef3c7" strokeWidth="2" fill="none" />
          <Path d="M12 32 Q24 28 32 32 Q40 36 52 32" stroke="#fef3c7" strokeWidth="2" fill="none" />
        </G>
        <SvgText x="14" y="30" fontSize="6" fontWeight="bold" fill="#92400e" textAnchor="middle">Challah</SvgText>
      </G>

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        {/* Banner background */}
        <Rect x="-40" y="-12" width="80" height="24" rx="12" fill="white" opacity="0.95" />
        {/* Title text */}
        <SvgText x="0" y="4" fontSize="13" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Shabbos
        </SvgText>
      </G>

      {/* Extra sparkle decorations */}
      <Circle cx="15" cy="115" r="3" fill="white" opacity="0.5" />
      <Circle cx="175" cy="25" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default ShabbosMatchIllustration;
