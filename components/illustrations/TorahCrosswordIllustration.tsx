import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

interface TorahCrosswordIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function TorahCrosswordIllustration({
  width,
  height,
  primaryColor = '#0d9488',
  secondaryColor = '#2dd4bf',
  accentColor = '#fde047',
}: TorahCrosswordIllustrationProps) {
  const cellSize = 16;

  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="torahCrossBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="220" height="140" fill="url(#torahCrossBg)" />

      <Circle cx="200" cy="15" r="12" fill="white" opacity="0.1" />
      <Circle cx="18" cy="125" r="10" fill="white" opacity="0.15" />

      {/* Crossword grid */}
      <G transform="translate(15, 12)">
        <Rect width={cellSize * 6 + 8} height={cellSize * 4 + 8} rx="5" fill="white" opacity="0.95" x="-4" y="-4" />

        {/* Row 1: TORAH */}
        <Rect x={0} y={0} width={cellSize} height={cellSize} fill={accentColor} opacity="0.4" stroke={primaryColor} strokeWidth="1" />
        <SvgText x={cellSize/2} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">T</SvgText>

        <Rect x={cellSize} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 1.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">O</SvgText>

        <Rect x={cellSize * 2} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">R</SvgText>

        <Rect x={cellSize * 3} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 3.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">A</SvgText>

        <Rect x={cellSize * 4} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 4.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">H</SvgText>

        <Rect x={cellSize * 5} y={0} width={cellSize} height={cellSize} fill="#1e293b" />

        {/* Row 2 */}
        <Rect x={0} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 2} y={cellSize} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 1.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">A</SvgText>
        <Rect x={cellSize * 3} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 4} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 5} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />

        {/* Row 3: MITZVAH */}
        <Rect x={0} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize/2} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">M</SvgText>

        <Rect x={cellSize} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 1.5} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">I</SvgText>

        <Rect x={cellSize * 2} y={cellSize * 2} width={cellSize} height={cellSize} fill={accentColor} opacity="0.4" stroke={primaryColor} strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">S</SvgText>

        <Rect x={cellSize * 3} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 3.5} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">H</SvgText>

        <Rect x={cellSize * 4} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 4.5} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">I</SvgText>

        <Rect x={cellSize * 5} y={cellSize * 2} width={cellSize} height={cellSize} fill="#1e293b" />

        {/* Row 4 */}
        <Rect x={0} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 2} y={cellSize * 3} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 3.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">H</SvgText>
        <Rect x={cellSize * 3} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 4} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 5} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
      </G>

      {/* Torah scroll */}
      <G transform="translate(120, 8)">
        {/* Left roller */}
        <Rect x="0" y="5" width="12" height="55" rx="6" fill="#8b4513" />
        <Rect x="2" y="0" width="8" height="8" rx="2" fill="#a0522d" />
        <Rect x="2" y="57" width="8" height="8" rx="2" fill="#a0522d" />

        {/* Right roller */}
        <Rect x="58" y="5" width="12" height="55" rx="6" fill="#8b4513" />
        <Rect x="60" y="0" width="8" height="8" rx="2" fill="#a0522d" />
        <Rect x="60" y="57" width="8" height="8" rx="2" fill="#a0522d" />

        {/* Parchment */}
        <Rect x="10" y="10" width="50" height="45" fill="#fef3c7" />

        {/* Hebrew text lines */}
        <Rect x="15" y="18" width="40" height="2" rx="1" fill="#92400e" opacity="0.6" />
        <Rect x="15" y="25" width="38" height="2" rx="1" fill="#92400e" opacity="0.6" />
        <Rect x="15" y="32" width="40" height="2" rx="1" fill="#92400e" opacity="0.6" />
        <Rect x="15" y="39" width="35" height="2" rx="1" fill="#92400e" opacity="0.6" />
        <Rect x="15" y="46" width="40" height="2" rx="1" fill="#92400e" opacity="0.6" />
      </G>

      {/* Star of David */}
      <G transform="translate(195, 35)">
        <Path d="M12 0 L24 20 L0 20 Z" fill="none" stroke={accentColor} strokeWidth="2" />
        <Path d="M12 24 L0 4 L24 4 Z" fill="none" stroke={accentColor} strokeWidth="2" />
      </G>

      {/* Tablets of the Law */}
      <G transform="translate(130, 70)">
        <Rect x="0" y="0" width="25" height="30" rx="4" fill="#94a3b8" />
        <Rect x="28" y="0" width="25" height="30" rx="4" fill="#94a3b8" />
        {/* Text lines on tablets */}
        <Rect x="5" y="6" width="15" height="2" rx="1" fill="#475569" />
        <Rect x="5" y="12" width="15" height="2" rx="1" fill="#475569" />
        <Rect x="5" y="18" width="15" height="2" rx="1" fill="#475569" />
        <Rect x="5" y="24" width="15" height="2" rx="1" fill="#475569" />
        <Rect x="33" y="6" width="15" height="2" rx="1" fill="#475569" />
        <Rect x="33" y="12" width="15" height="2" rx="1" fill="#475569" />
        <Rect x="33" y="18" width="15" height="2" rx="1" fill="#475569" />
        <Rect x="33" y="24" width="15" height="2" rx="1" fill="#475569" />
      </G>

      {/* Crown */}
      <G transform="translate(190, 75)">
        <Path d="M5 25 L5 10 L10 18 L15 5 L20 18 L25 10 L25 25 Z" fill={accentColor} />
        <Rect x="5" y="22" width="20" height="5" rx="1" fill="#d97706" />
        <Circle cx="15" cy="8" r="3" fill="#dc2626" />
      </G>

      {/* Title banner */}
      <G transform="translate(75, 100)">
        <Rect x="0" y="0" width="70" height="28" rx="8" fill="white" opacity="0.95" />
        <SvgText x="35" y="18" fontSize="13" fontWeight="bold" fill={primaryColor} textAnchor="middle">Torah</SvgText>
      </G>

      <Circle cx="195" cy="125" r="2" fill="white" opacity="0.6" />
      <Circle cx="130" cy="105" r="2" fill={accentColor} opacity="0.8" />
    </Svg>
  );
}

export default TorahCrosswordIllustration;
