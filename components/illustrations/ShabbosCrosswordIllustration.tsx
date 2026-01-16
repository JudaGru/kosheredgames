import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

interface ShabbosCrosswordIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function ShabbosCrosswordIllustration({
  width,
  height,
  primaryColor = '#7c3aed',
  secondaryColor = '#a78bfa',
  accentColor = '#fde047',
}: ShabbosCrosswordIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="shabbosCrossBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background gradient */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#shabbosCrossBg)" />

      {/* Decorative circles in corners */}
      <Circle cx="10" cy="10" r="20" fill="white" opacity="0.08" />
      <Circle cx="210" cy="130" r="25" fill="white" opacity="0.06" />
      <Circle cx="200" cy="15" r="8" fill="white" opacity="0.1" />

      {/* Shabbos candles at top center */}
      <G transform="translate(85, 8)">
        {/* Left candle */}
        <Rect x="8" y="18" width="10" height="26" rx="2" fill="white" />
        <Path d="M13 18 Q9 11 13 5 Q17 11 13 18" fill="#f97316" />
        <Circle cx="13" cy="8" r="3" fill={accentColor} />

        {/* Right candle */}
        <Rect x="32" y="18" width="10" height="26" rx="2" fill="white" />
        <Path d="M37 18 Q33 11 37 5 Q41 11 37 18" fill="#f97316" />
        <Circle cx="37" cy="8" r="3" fill={accentColor} />

        {/* Candle holder */}
        <Rect x="5" y="44" width="42" height="5" rx="2" fill="#c0c0c0" />
      </G>

      {/* Simple crossword grid preview */}
      <G transform="translate(60, 58)">
        <Rect width="100" height="50" rx="6" fill="white" opacity="0.95" />

        {/* Simple 5x3 grid cells */}
        {[0, 1, 2, 3, 4].map((col) =>
          [0, 1, 2].map((row) => {
            const isBlack = (row === 1 && col === 0) || (row === 1 && col === 4) || (row === 2 && col === 0) || (row === 2 && col === 4);
            const isHighlighted = row === 0;
            return (
              <Rect
                key={`${col}-${row}`}
                x={8 + col * 17}
                y={6 + row * 14}
                width="15"
                height="12"
                rx="2"
                fill={isBlack ? '#1e293b' : isHighlighted ? accentColor : '#f1f5f9'}
                opacity={isHighlighted && !isBlack ? 0.5 : 1}
              />
            );
          })
        )}

        {/* Letters hint */}
        <SvgText x="16" y="15" fontSize="8" fontWeight="bold" fill={primaryColor}>S</SvgText>
        <SvgText x="33" y="15" fontSize="8" fontWeight="bold" fill={primaryColor}>H</SvgText>
        <SvgText x="50" y="15" fontSize="8" fontWeight="bold" fill={primaryColor}>A</SvgText>
        <SvgText x="67" y="15" fontSize="8" fontWeight="bold" fill={primaryColor}>B</SvgText>
        <SvgText x="84" y="15" fontSize="8" fontWeight="bold" fill={primaryColor}>B</SvgText>
      </G>

      {/* Sparkle effects */}
      <Circle cx="50" cy="55" r="3" fill={accentColor} opacity="0.8" />
      <Circle cx="175" cy="60" r="2" fill="white" opacity="0.6" />
      <Circle cx="40" cy="100" r="2" fill="white" opacity="0.5" />

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        <Rect x="-40" y="-12" width="80" height="24" rx="12" fill="white" opacity="0.95" />
        <SvgText x="0" y="4" fontSize="13" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Shabbos
        </SvgText>
      </G>

      {/* Extra sparkle decorations */}
      <Circle cx="15" cy="115" r="3" fill="white" opacity="0.5" />
      <Circle cx="205" cy="100" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default ShabbosCrosswordIllustration;
