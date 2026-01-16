import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

interface HanukkahWordSearchIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function HanukkahWordSearchIllustration({
  width,
  height,
  primaryColor = '#0369a1',
  secondaryColor = '#38bdf8',
  accentColor = '#fde047',
}: HanukkahWordSearchIllustrationProps) {
  // Letters for CHANUKA
  const letters = ['C', 'H', 'A', 'N', 'U', 'K', 'A'];

  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="hanukkahBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
        <LinearGradient id="cardShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <Stop offset="100%" stopColor="white" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Background gradient */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#hanukkahBg)" />

      {/* Decorative circles in corners */}
      <Circle cx="10" cy="10" r="20" fill="white" opacity="0.08" />
      <Circle cx="210" cy="130" r="25" fill="white" opacity="0.06" />
      <Circle cx="200" cy="15" r="8" fill="white" opacity="0.1" />

      {/* Menorah at top */}
      <G transform="translate(85, 8)">
        {/* Base */}
        <Rect x="15" y="38" width="20" height="4" rx="2" fill={accentColor} />
        <Rect x="20" y="34" width="10" height="6" rx="2" fill={accentColor} />

        {/* Center stem */}
        <Rect x="23" y="10" width="3" height="26" fill={accentColor} />

        {/* Branches */}
        <Path d="M24.5 28 Q17 24 15 17" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <Path d="M24.5 28 Q32 24 34 17" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <Path d="M24.5 24 Q12 20 8 12" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <Path d="M24.5 24 Q37 20 41 12" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Flames */}
        <Circle cx="24.5" cy="7" r="3" fill="#f97316" />
        <Circle cx="15" cy="14" r="2.5" fill="#f97316" />
        <Circle cx="34" cy="14" r="2.5" fill="#f97316" />
        <Circle cx="8" cy="9" r="2.5" fill="#f97316" />
        <Circle cx="41" cy="9" r="2.5" fill="#f97316" />
      </G>

      {/* Word search letter tiles spelling CHANUKA */}
      <G transform="translate(22, 55)">
        {letters.map((letter, i) => {
          const isHighlighted = i === 2 || i === 4; // Highlight A and U
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
      <G transform="translate(155, 50)">
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
              fill={
                (row === 0 && col <= 2) ? accentColor : '#f1f5f9'
              }
              opacity={(row === 0 && col <= 2) ? 0.6 : 1}
            />
          ))
        )}
      </G>

      {/* Sparkle effects */}
      <Circle cx="50" cy="50" r="3" fill={accentColor} opacity="0.8" />
      <Circle cx="180" cy="45" r="2" fill="white" opacity="0.6" />
      <Circle cx="15" cy="100" r="2" fill="white" opacity="0.5" />

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        {/* Banner background */}
        <Rect x="-55" y="-12" width="110" height="24" rx="12" fill="white" opacity="0.95" />
        {/* Title text */}
        <SvgText x="0" y="4" fontSize="12" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Chanukah
        </SvgText>
      </G>

      {/* Extra sparkle decorations */}
      <Circle cx="15" cy="115" r="3" fill="white" opacity="0.5" />
      <Circle cx="205" cy="100" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default HanukkahWordSearchIllustration;
