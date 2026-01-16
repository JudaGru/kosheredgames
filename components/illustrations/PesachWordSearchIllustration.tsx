import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText, Ellipse } from 'react-native-svg';

interface PesachWordSearchIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function PesachWordSearchIllustration({
  width,
  height,
  primaryColor = '#dc2626',
  secondaryColor = '#f87171',
  accentColor = '#fde047',
}: PesachWordSearchIllustrationProps) {
  // Letters for PESACH
  const letters = ['P', 'E', 'S', 'A', 'C', 'H'];

  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="pesachBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background gradient */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#pesachBg)" />

      {/* Decorative circles in corners */}
      <Circle cx="10" cy="10" r="20" fill="white" opacity="0.08" />
      <Circle cx="210" cy="130" r="25" fill="white" opacity="0.06" />
      <Circle cx="200" cy="15" r="8" fill="white" opacity="0.1" />

      {/* Pesach icons at top - Matzah and Wine Cup */}
      <G transform="translate(70, 5)">
        {/* Matzah */}
        <Rect x="0" y="15" width="35" height="30" rx="3" fill="#f5e6d3" />
        <Rect x="5" y="22" width="25" height="2" rx="1" fill="#d4a574" />
        <Rect x="5" y="28" width="25" height="2" rx="1" fill="#d4a574" />
        <Rect x="5" y="34" width="25" height="2" rx="1" fill="#d4a574" />
        {/* Dots for matzah texture */}
        <Circle cx="10" cy="20" r="1.5" fill="#c49a6c" />
        <Circle cx="20" cy="20" r="1.5" fill="#c49a6c" />
        <Circle cx="25" cy="26" r="1.5" fill="#c49a6c" />
        <Circle cx="15" cy="32" r="1.5" fill="#c49a6c" />

        {/* Wine cup (Kiddush cup) */}
        <G transform="translate(45, 8)">
          <Ellipse cx="15" cy="8" rx="12" ry="5" fill={accentColor} />
          <Path d="M5 8 L8 35 L22 35 L25 8" fill={accentColor} />
          <Rect x="10" y="35" width="10" height="4" fill={accentColor} />
          <Ellipse cx="15" cy="40" rx="10" ry="3" fill={accentColor} />
          {/* Wine inside */}
          <Ellipse cx="15" cy="10" rx="9" ry="3" fill="#7f1d1d" />
        </G>
      </G>

      {/* Word search letter tiles spelling PESACH */}
      <G transform="translate(32, 58)">
        {letters.map((letter, i) => {
          const isHighlighted = i === 1 || i === 4; // Highlight E and C
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
          Pesach
        </SvgText>
      </G>

      {/* Extra sparkle decorations */}
      <Circle cx="15" cy="115" r="3" fill="white" opacity="0.5" />
      <Circle cx="205" cy="100" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default PesachWordSearchIllustration;
