import Svg, { Rect, Circle, G, Defs, LinearGradient, Stop, Text as SvgText, Path, Ellipse } from 'react-native-svg';

interface MidosMatchIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function MidosMatchIllustration({
  width,
  height,
  primaryColor = '#9333ea',
  secondaryColor = '#c084fc',
  accentColor = '#fde047',
}: MidosMatchIllustrationProps) {
  // Midos trait colors (matching the game)
  const midosColors = [
    '#ec4899', '#eab308', '#0891b2', '#8b5cf6',
    '#f97316', '#22c55e', '#0ea5e9', '#f43f5e',
    '#6366f1', '#14b8a6', '#a855f7', '#84cc16'
  ];

  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="midosBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
        <LinearGradient id="cardShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <Stop offset="100%" stopColor="white" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Background gradient */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#midosBg)" />

      {/* Decorative circles in corners */}
      <Circle cx="10" cy="10" r="20" fill="white" opacity="0.08" />
      <Circle cx="210" cy="130" r="25" fill="white" opacity="0.06" />
      <Circle cx="200" cy="15" r="8" fill="white" opacity="0.1" />

      {/* Midos indicator circles at top - arranged in arc */}
      {midosColors.map((color, i) => {
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
      {/* Card 1 - Chesed (Kindness) - face up - person giving food to another */}
      <G transform="translate(22, 35)">
        <Rect width="48" height="60" rx="6" fill="#000" opacity="0.12" transform="translate(2, 2)" />
        <Rect width="48" height="60" rx="6" fill="white" />
        <Rect x="4" y="4" width="40" height="32" rx="4" fill="#fce7f3" />
        {/* Chesed icon - person giving bowl of food to person in need */}
        <G transform="translate(6, 6) scale(0.65)">
          {/* Giver - standing person */}
          <Circle cx="14" cy="10" r="6" fill="#fcd9b6" />
          <Rect x="9" y="16" width="10" height="14" rx="2" fill="#ec4899" />
          {/* Arm extending with bowl */}
          <Path d="M19 22 L32 26" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
          <Ellipse cx="36" cy="26" rx="6" ry="3" fill="#fbbf24" />
          <Circle cx="33" cy="25" r="1.5" fill="#f97316" />
          <Circle cx="37" cy="24" r="1" fill="#22c55e" />
          {/* Receiver - seated person */}
          <Circle cx="46" cy="28" r="5" fill="#fcd9b6" />
          <Rect x="42" y="33" width="8" height="10" rx="2" fill="#94a3b8" />
          {/* Heart above */}
          <Path d="M28 4 C26 2 23 2 21 4 C19 6 19 9 21 11 L28 18 L35 11 C37 9 37 6 35 4 C33 2 30 2 28 4 Z" fill="#ec4899" transform="scale(0.5) translate(28, -4)" />
        </G>
        <SvgText x="24" y="50" fontSize="9" fontWeight="bold" fill="#ec4899" textAnchor="middle">Chesed</SvgText>
      </G>

      {/* Card 2 - Chesed - matching! with glow */}
      <G transform="translate(78, 35)">
        {/* Glow effect */}
        <Rect width="52" height="64" rx="8" fill={accentColor} opacity="0.35" transform="translate(-2, -2)" />
        <Rect width="48" height="60" rx="6" fill="#000" opacity="0.1" transform="translate(2, 2)" />
        <Rect width="48" height="60" rx="6" fill="white" stroke={accentColor} strokeWidth="2.5" />
        <Rect x="4" y="4" width="40" height="32" rx="4" fill="#fce7f3" />
        {/* Chesed icon - same as card 1 */}
        <G transform="translate(6, 6) scale(0.65)">
          {/* Giver - standing person */}
          <Circle cx="14" cy="10" r="6" fill="#fcd9b6" />
          <Rect x="9" y="16" width="10" height="14" rx="2" fill="#ec4899" />
          {/* Arm extending with bowl */}
          <Path d="M19 22 L32 26" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
          <Ellipse cx="36" cy="26" rx="6" ry="3" fill="#fbbf24" />
          <Circle cx="33" cy="25" r="1.5" fill="#f97316" />
          <Circle cx="37" cy="24" r="1" fill="#22c55e" />
          {/* Receiver - seated person */}
          <Circle cx="46" cy="28" r="5" fill="#fcd9b6" />
          <Rect x="42" y="33" width="8" height="10" rx="2" fill="#94a3b8" />
          {/* Heart above */}
          <Path d="M28 4 C26 2 23 2 21 4 C19 6 19 9 21 11 L28 18 L35 11 C37 9 37 6 35 4 C33 2 30 2 28 4 Z" fill="#ec4899" transform="scale(0.5) translate(28, -4)" />
        </G>
        <SvgText x="24" y="50" fontSize="9" fontWeight="bold" fill="#ec4899" textAnchor="middle">Chesed</SvgText>
      </G>

      {/* Sparkle/match effect between cards */}
      <Circle cx="73" cy="60" r="4" fill="#fde047" opacity="0.9" />
      <Circle cx="73" cy="60" r="7" fill="#fde047" opacity="0.4" />
      <Circle cx="68" cy="52" r="2" fill="white" opacity="0.9" />
      <Circle cx="78" cy="68" r="2.5" fill="white" opacity="0.8" />

      {/* Card 3 - Face down (purple back) */}
      <G transform="translate(134, 35)">
        <Rect width="48" height="60" rx="6" fill="#000" opacity="0.1" transform="translate(2, 2)" />
        <Rect width="48" height="60" rx="6" fill={primaryColor} />
        {/* Card pattern */}
        <Rect x="5" y="5" width="38" height="50" rx="4" fill="none" stroke="white" strokeWidth="1.5" opacity="0.25" />
        <Rect x="10" y="10" width="28" height="40" rx="3" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
        {/* Heart icon on back - representing midos/character */}
        <G transform="translate(14, 18) scale(0.4)">
          <Path d="M25 8 C22 4 17 4 14 8 C11 12 11 18 14 22 L25 34 L36 22 C39 18 39 12 36 8 C33 4 28 4 25 8 Z" fill="white" opacity="0.9" />
          {/* Small star inside heart */}
          <Path d="M25 14 L26 18 L30 18 L27 21 L28 25 L25 22 L22 25 L23 21 L20 18 L24 18 Z" fill={primaryColor} opacity="0.7" />
        </G>
      </G>

      {/* Card 4 - Small preview card (Simcha/Joy - dancing person) floating */}
      <G transform="translate(188, 45) rotate(8)">
        <Rect width="28" height="35" rx="4" fill="#000" opacity="0.1" transform="translate(1, 1)" />
        <Rect width="28" height="35" rx="4" fill="white" />
        {/* Simcha mini icon - dancing person with arms up */}
        <G transform="translate(5, 4) scale(0.28)">
          {/* Head */}
          <Circle cx="32" cy="10" r="8" fill="#fcd9b6" />
          {/* Body */}
          <Path d="M28 18 L26 36 L32 32 L38 36 L36 18 Z" fill="#f97316" />
          {/* Arms raised up in joy */}
          <Path d="M28 22 L16 10" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
          <Path d="M36 22 L48 10" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
          {/* Hands */}
          <Circle cx="14" cy="8" r="4" fill="#fcd9b6" />
          <Circle cx="50" cy="8" r="4" fill="#fcd9b6" />
          {/* Musical notes around */}
          <Path d="M8 20 L8 12 L12 14 L12 22" stroke="#f97316" strokeWidth="1.5" fill="none" />
          <Circle cx="8" cy="22" r="2" fill="#f97316" />
          <Path d="M54 18 L54 10 L58 12 L58 20" stroke="#f97316" strokeWidth="1.5" fill="none" />
          <Circle cx="54" cy="20" r="2" fill="#f97316" />
        </G>
        <SvgText x="14" y="30" fontSize="5" fontWeight="bold" fill="#f97316" textAnchor="middle">Simcha</SvgText>
      </G>

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        {/* Banner background */}
        <Rect x="-35" y="-12" width="70" height="24" rx="12" fill="white" opacity="0.95" />
        {/* Title text */}
        <SvgText x="0" y="4" fontSize="13" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Midos
        </SvgText>
      </G>

      {/* Extra sparkle decorations */}
      <Circle cx="15" cy="115" r="3" fill="white" opacity="0.5" />
      <Circle cx="175" cy="25" r="2" fill="white" opacity="0.6" />

      {/* Small floating hearts decoration */}
      <G transform="translate(10, 85) scale(0.25)">
        <Path d="M12 4 C10 2 7 2 5 4 C3 6 3 9 5 11 L12 18 L19 11 C21 9 21 6 19 4 C17 2 14 2 12 4 Z" fill="white" opacity="0.4" />
      </G>
      <G transform="translate(195, 100) scale(0.2)">
        <Path d="M12 4 C10 2 7 2 5 4 C3 6 3 9 5 11 L12 18 L19 11 C21 9 21 6 19 4 C17 2 14 2 12 4 Z" fill="white" opacity="0.3" />
      </G>

      {/* Additional star decorations */}
      <G transform="translate(8, 55) scale(0.15)">
        <Path d="M25 0 L30 18 L50 18 L34 28 L40 48 L25 36 L10 48 L16 28 L0 18 L20 18 Z" fill="white" opacity="0.35" />
      </G>
    </Svg>
  );
}

export default MidosMatchIllustration;
