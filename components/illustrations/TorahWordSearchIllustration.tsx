import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

interface TorahWordSearchIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function TorahWordSearchIllustration({
  width,
  height,
  primaryColor = '#0d9488',
  secondaryColor = '#5eead4',
  accentColor = '#fde047',
}: TorahWordSearchIllustrationProps) {
  // Letters for TORAH
  const letters = ['T', 'O', 'R', 'A', 'H'];

  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="torahSearchBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background gradient */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#torahSearchBg)" />

      {/* Decorative circles in corners */}
      <Circle cx="10" cy="10" r="20" fill="white" opacity="0.08" />
      <Circle cx="210" cy="130" r="25" fill="white" opacity="0.06" />
      <Circle cx="200" cy="15" r="8" fill="white" opacity="0.1" />

      {/* Torah icons at top - Torah Scroll and Star of David */}
      <G transform="translate(65, 3)">
        {/* Torah scroll */}
        <G transform="translate(0, 5)">
          {/* Parchment */}
          <Rect x="10" y="5" width="30" height="40" fill="#f5f0e6" />
          {/* Left etz chaim */}
          <Rect x="5" y="0" width="8" height="50" rx="4" fill="#8b4513" />
          <Rect x="3" y="0" width="12" height="6" rx="2" fill={accentColor} />
          <Rect x="3" y="44" width="12" height="6" rx="2" fill={accentColor} />
          {/* Right etz chaim */}
          <Rect x="37" y="0" width="8" height="50" rx="4" fill="#8b4513" />
          <Rect x="35" y="0" width="12" height="6" rx="2" fill={accentColor} />
          <Rect x="35" y="44" width="12" height="6" rx="2" fill={accentColor} />
          {/* Text lines */}
          <Rect x="14" y="12" width="22" height="2" rx="1" fill="#94a3b8" opacity="0.6" />
          <Rect x="14" y="18" width="22" height="2" rx="1" fill="#94a3b8" opacity="0.6" />
          <Rect x="14" y="24" width="22" height="2" rx="1" fill="#94a3b8" opacity="0.6" />
          <Rect x="14" y="30" width="22" height="2" rx="1" fill="#94a3b8" opacity="0.6" />
          <Rect x="14" y="36" width="22" height="2" rx="1" fill="#94a3b8" opacity="0.6" />
        </G>

        {/* Star of David */}
        <G transform="translate(55, 12)">
          <Path d="M18 3 L28 18 L8 18 Z" fill="none" stroke={accentColor} strokeWidth="2.5" />
          <Path d="M18 23 L8 8 L28 8 Z" fill="none" stroke={accentColor} strokeWidth="2.5" />
        </G>
      </G>

      {/* Word search letter tiles spelling TORAH */}
      <G transform="translate(45, 58)">
        {letters.map((letter, i) => {
          const isHighlighted = i === 1 || i === 3; // Highlight O and A
          return (
            <G key={i} transform={`translate(${i * 26}, 0)`}>
              {/* Card shadow */}
              <Rect width="22" height="28" rx="4" fill="#000" opacity="0.12" transform="translate(2, 2)" />
              {/* Card background */}
              <Rect
                width="22"
                height="28"
                rx="4"
                fill={isHighlighted ? accentColor : 'white'}
                stroke={isHighlighted ? '#eab308' : '#e2e8f0'}
                strokeWidth={isHighlighted ? 2 : 1}
              />
              {/* Letter */}
              <SvgText
                x="11"
                y="19"
                fontSize="14"
                fontWeight="bold"
                fill={isHighlighted ? primaryColor : '#334155'}
                textAnchor="middle"
              >
                {letter}
              </SvgText>
            </G>
          );
        })}
      </G>

      {/* Small grid preview on the right */}
      <G transform="translate(160, 55)">
        <Rect width="50" height="40" rx="6" fill="white" opacity="0.95" />
        {/* Mini grid cells */}
        {[0, 1, 2, 3].map((col) =>
          [0, 1, 2].map((row) => (
            <Rect
              key={`${col}-${row}`}
              x={5 + col * 11}
              y={5 + row * 11}
              width="9"
              height="9"
              rx="2"
              fill={(row === 0 && col <= 2) ? accentColor : '#f1f5f9'}
              opacity={(row === 0 && col <= 2) ? 0.6 : 1}
            />
          ))
        )}
      </G>

      {/* Sparkle effects */}
      <Circle cx="50" cy="55" r="3" fill={accentColor} opacity="0.8" />
      <Circle cx="180" cy="50" r="2" fill="white" opacity="0.6" />
      <Circle cx="15" cy="100" r="2" fill="white" opacity="0.5" />

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        {/* Banner background */}
        <Rect x="-55" y="-12" width="110" height="24" rx="12" fill="white" opacity="0.95" />
        {/* Title text */}
        <SvgText x="0" y="4" fontSize="12" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Torah
        </SvgText>
      </G>

      {/* Extra sparkle decorations */}
      <Circle cx="15" cy="115" r="3" fill="white" opacity="0.5" />
      <Circle cx="205" cy="100" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default TorahWordSearchIllustration;
