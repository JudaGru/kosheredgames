import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText, Ellipse } from 'react-native-svg';

interface RoshHashanahCrosswordIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function RoshHashanahCrosswordIllustration({
  width,
  height,
  primaryColor = '#d97706',
  secondaryColor = '#fbbf24',
  accentColor = '#fde047',
}: RoshHashanahCrosswordIllustrationProps) {
  const cellSize = 16;

  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="roshCrossBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="220" height="140" fill="url(#roshCrossBg)" />

      <Circle cx="200" cy="20" r="12" fill="white" opacity="0.15" />
      <Circle cx="15" cy="120" r="10" fill="white" opacity="0.1" />

      {/* Crossword grid */}
      <G transform="translate(15, 12)">
        <Rect width={cellSize * 6 + 8} height={cellSize * 4 + 8} rx="5" fill="white" opacity="0.95" x="-4" y="-4" />

        {/* Row 1: SHOFAR */}
        <Rect x={0} y={0} width={cellSize} height={cellSize} fill={accentColor} opacity="0.4" stroke={primaryColor} strokeWidth="1" />
        <SvgText x={cellSize/2} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">S</SvgText>

        <Rect x={cellSize} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 1.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">H</SvgText>

        <Rect x={cellSize * 2} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">O</SvgText>

        <Rect x={cellSize * 3} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 3.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">F</SvgText>

        <Rect x={cellSize * 4} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 4.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">A</SvgText>

        <Rect x={cellSize * 5} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 5.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">R</SvgText>

        {/* Row 2 */}
        <Rect x={0} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize} y={cellSize} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 1.5} y={cellSize * 1.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">O</SvgText>
        <Rect x={cellSize * 2} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 3} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 4} y={cellSize} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 4.5} y={cellSize * 1.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">P</SvgText>
        <Rect x={cellSize * 5} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />

        {/* Row 3: HONEY */}
        <Rect x={0} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize/2} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">H</SvgText>

        <Rect x={cellSize} y={cellSize * 2} width={cellSize} height={cellSize} fill={accentColor} opacity="0.4" stroke={primaryColor} strokeWidth="1" />
        <SvgText x={cellSize * 1.5} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">N</SvgText>

        <Rect x={cellSize * 2} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">E</SvgText>

        <Rect x={cellSize * 3} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 3.5} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">Y</SvgText>

        <Rect x={cellSize * 4} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 4.5} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">P</SvgText>

        <Rect x={cellSize * 5} y={cellSize * 2} width={cellSize} height={cellSize} fill="#1e293b" />

        {/* Row 4 */}
        <Rect x={0} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize} y={cellSize * 3} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 1.5} y={cellSize * 3.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">E</SvgText>
        <Rect x={cellSize * 2} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 3} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 4} y={cellSize * 3} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 4.5} y={cellSize * 3.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">L</SvgText>
        <Rect x={cellSize * 5} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
      </G>

      {/* Shofar */}
      <G transform="translate(120, 8)">
        <Path
          d="M10 35 Q5 30 8 20 Q12 10 25 8 Q40 5 55 15 Q65 22 70 25 Q75 30 72 35 Q68 38 60 35 Q50 30 35 28 Q20 27 15 32 Q12 36 10 35"
          fill="#a0785c"
          stroke="#8b6914"
          strokeWidth="1"
        />
        <Path d="M8 25 Q15 20 25 18" stroke="#8b6914" strokeWidth="1" fill="none" />
        {/* Sound waves */}
        <Path d="M75 25 Q82 20 85 25 Q82 30 75 25" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6" />
        <Path d="M82 22 Q90 15 95 22 Q90 29 82 22" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4" />
      </G>

      {/* Apple with honey */}
      <G transform="translate(130, 55)">
        {/* Apple */}
        <Circle cx="20" cy="25" r="18" fill="#dc2626" />
        <Path d="M20 8 Q18 2 22 0 Q26 2 24 8" fill="#65a30d" />
        <Ellipse cx="20" cy="10" rx="4" ry="2" fill="#166534" />
        {/* Honey pot */}
        <Rect x="42" y="15" width="25" height="28" rx="4" fill={accentColor} />
        <Ellipse cx="54.5" cy="15" rx="12.5" ry="4" fill="#fbbf24" />
        <Rect x="48" y="8" width="13" height="8" rx="2" fill="#a16207" />
        {/* Honey drip */}
        <Path d="M52 43 Q52 50 55 55 Q58 50 58 43" fill={accentColor} />
      </G>

      {/* Pomegranate */}
      <G transform="translate(190, 55)">
        <Circle cx="15" cy="20" r="14" fill="#be123c" />
        <Path d="M15 6 L12 2 L18 2 Z" fill="#be123c" />
        <Path d="M8 10 Q15 8 22 10" stroke="#881337" strokeWidth="1" fill="none" />
        {/* Seeds hint */}
        <Circle cx="12" cy="18" r="2" fill="#fecdd3" opacity="0.5" />
        <Circle cx="18" cy="22" r="2" fill="#fecdd3" opacity="0.5" />
        <Circle cx="14" cy="25" r="2" fill="#fecdd3" opacity="0.5" />
      </G>

      {/* Title banner */}
      <G transform="translate(10, 100)">
        <Rect x="0" y="0" width="140" height="32" rx="8" fill="white" opacity="0.95" />
        <SvgText x="70" y="15" fontSize="11" fontWeight="bold" fill={primaryColor} textAnchor="middle">Rosh Hashanah Crossword</SvgText>
        <SvgText x="70" y="27" fontSize="9" fill="#64748b" textAnchor="middle">Solve the Clues</SvgText>
      </G>

      <Circle cx="195" cy="125" r="2" fill="white" opacity="0.6" />
      <Circle cx="165" cy="100" r="2" fill="white" opacity="0.8" />
    </Svg>
  );
}

export default RoshHashanahCrosswordIllustration;
