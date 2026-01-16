import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

interface PurimWordSearchIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function PurimWordSearchIllustration({
  width,
  height,
  primaryColor = '#db2777',
  secondaryColor = '#f472b6',
  accentColor = '#fde047',
}: PurimWordSearchIllustrationProps) {
  // Letters for PURIM
  const letters = ['P', 'U', 'R', 'I', 'M'];

  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="purimBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background gradient */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#purimBg)" />

      {/* Decorative circles in corners */}
      <Circle cx="10" cy="10" r="20" fill="white" opacity="0.08" />
      <Circle cx="210" cy="130" r="25" fill="white" opacity="0.06" />
      <Circle cx="200" cy="15" r="8" fill="white" opacity="0.1" />

      {/* Purim icons at top - Mask and Crown */}
      <G transform="translate(75, 5)">
        {/* Theater mask */}
        <Path
          d="M25 12 Q15 12 12 22 Q12 35 20 40 Q25 42 30 40 Q38 35 38 22 Q35 12 25 12"
          fill={accentColor}
        />
        <Circle cx="20" cy="24" r="4" fill={primaryColor} />
        <Circle cx="30" cy="24" r="4" fill={primaryColor} />
        <Path d="M20 32 Q25 36 30 32" stroke={primaryColor} strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Crown */}
        <G transform="translate(40, 5)">
          <Path d="M0 25 L5 10 L12 20 L20 5 L28 20 L35 10 L40 25 Z" fill={accentColor} />
          <Rect x="0" y="25" width="40" height="8" rx="2" fill={accentColor} />
          <Circle cx="20" cy="12" r="3" fill="#f97316" />
          <Circle cx="8" cy="18" r="2" fill="#f97316" />
          <Circle cx="32" cy="18" r="2" fill="#f97316" />
        </G>
      </G>

      {/* Word search letter tiles spelling PURIM */}
      <G transform="translate(45, 58)">
        {letters.map((letter, i) => {
          const isHighlighted = i === 1 || i === 3; // Highlight U and I
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
          Purim
        </SvgText>
      </G>

      {/* Extra sparkle decorations */}
      <Circle cx="15" cy="115" r="3" fill="white" opacity="0.5" />
      <Circle cx="205" cy="100" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default PurimWordSearchIllustration;
