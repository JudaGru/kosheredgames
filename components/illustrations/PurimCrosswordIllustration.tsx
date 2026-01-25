import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText, Ellipse } from 'react-native-svg';

interface PurimCrosswordIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function PurimCrosswordIllustration({
  width,
  height,
  primaryColor = '#db2777',
  secondaryColor = '#f472b6',
  accentColor = '#fde047',
}: PurimCrosswordIllustrationProps) {
  const cellSize = 16;

  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="purimCrossBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="220" height="140" fill="url(#purimCrossBg)" />

      <Circle cx="200" cy="15" r="12" fill="white" opacity="0.1" />
      <Circle cx="15" cy="125" r="10" fill="white" opacity="0.15" />

      {/* Crossword grid */}
      <G transform="translate(15, 12)">
        <Rect width={cellSize * 7 + 8} height={cellSize * 4 + 8} rx="5" fill="white" opacity="0.95" x="-4" y="-4" />

        {/* Row 1: MEGILLAH */}
        <Rect x={0} y={0} width={cellSize} height={cellSize} fill={accentColor} opacity="0.4" stroke={primaryColor} strokeWidth="1" />
        <SvgText x={cellSize/2} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">M</SvgText>

        <Rect x={cellSize} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 1.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">E</SvgText>

        <Rect x={cellSize * 2} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">G</SvgText>

        <Rect x={cellSize * 3} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 3.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">I</SvgText>

        <Rect x={cellSize * 4} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 4.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">L</SvgText>

        <Rect x={cellSize * 5} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 5.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">L</SvgText>

        <Rect x={cellSize * 6} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 6.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">A</SvgText>

        {/* Row 2 */}
        <Rect x={0} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize} y={cellSize} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 1.5} y={cellSize * 1.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">S</SvgText>
        <Rect x={cellSize * 2} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 3} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 4} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 5} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 6} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />

        {/* Row 3: HAMAN */}
        <Rect x={0} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize/2} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">H</SvgText>

        <Rect x={cellSize} y={cellSize * 2} width={cellSize} height={cellSize} fill={accentColor} opacity="0.4" stroke={primaryColor} strokeWidth="1" />
        <SvgText x={cellSize * 1.5} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">T</SvgText>

        <Rect x={cellSize * 2} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">H</SvgText>

        <Rect x={cellSize * 3} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 3.5} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">E</SvgText>

        <Rect x={cellSize * 4} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 4.5} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">R</SvgText>

        <Rect x={cellSize * 5} y={cellSize * 2} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 6} y={cellSize * 2} width={cellSize} height={cellSize} fill="#1e293b" />

        {/* Row 4 */}
        <Rect x={0} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize} y={cellSize * 3} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 1.5} y={cellSize * 3.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">R</SvgText>
        <Rect x={cellSize * 2} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 3} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 4} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 5} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 6} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
      </G>

      {/* Purim mask */}
      <G transform="translate(140, 10)">
        <Ellipse cx="30" cy="25" rx="28" ry="20" fill={accentColor} />
        <Ellipse cx="18" cy="22" rx="8" ry="6" fill="white" />
        <Ellipse cx="42" cy="22" rx="8" ry="6" fill="white" />
        <Circle cx="18" cy="22" r="3" fill="#1e293b" />
        <Circle cx="42" cy="22" r="3" fill="#1e293b" />
        <Path d="M30 30 L26 35 L34 35 Z" fill={primaryColor} />
        <Path d="M20 38 Q30 45 40 38" stroke={primaryColor} strokeWidth="2" fill="none" />
        {/* Feather decoration */}
        <Path d="M50 8 Q60 2 55 15 Q52 10 50 8" fill="#8b5cf6" />
        <Path d="M52 12 Q62 8 58 20 Q54 15 52 12" fill="#ec4899" />
      </G>

      {/* Hamantaschen */}
      <G transform="translate(145, 60)">
        <Path d="M25 5 L45 40 L5 40 Z" fill="#d4a574" />
        <Circle cx="25" cy="28" r="10" fill="#7c3aed" />
        <Path d="M10 38 Q25 45 40 38" stroke="#a0785c" strokeWidth="2" fill="none" />
      </G>

      {/* Gragger */}
      <G transform="translate(180, 55)">
        <Rect x="5" y="0" width="8" height="25" rx="2" fill="#a0785c" />
        <Rect x="0" y="25" width="18" height="30" rx="3" fill={accentColor} />
        <Circle cx="9" cy="40" r="4" fill={primaryColor} />
      </G>

      {/* Title banner */}
      <G transform="translate(70, 100)">
        <Rect x="0" y="0" width="80" height="28" rx="8" fill="white" opacity="0.95" />
        <SvgText x="40" y="18" fontSize="13" fontWeight="bold" fill={primaryColor} textAnchor="middle">Purim</SvgText>
      </G>

      <Circle cx="195" cy="125" r="2" fill="white" opacity="0.6" />
      <Circle cx="135" cy="95" r="2" fill={accentColor} opacity="0.8" />
    </Svg>
  );
}

export default PurimCrosswordIllustration;
