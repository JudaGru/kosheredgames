import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText, Ellipse } from 'react-native-svg';

interface PesachCrosswordIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function PesachCrosswordIllustration({
  width,
  height,
  primaryColor = '#dc2626',
  secondaryColor = '#f87171',
  accentColor = '#fde047',
}: PesachCrosswordIllustrationProps) {
  const cellSize = 16;

  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="pesachCrossBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="220" height="140" fill="url(#pesachCrossBg)" />

      <Circle cx="200" cy="20" r="12" fill="white" opacity="0.1" />
      <Circle cx="20" cy="120" r="10" fill="white" opacity="0.15" />

      {/* Crossword grid */}
      <G transform="translate(15, 12)">
        <Rect width={cellSize * 6 + 8} height={cellSize * 4 + 8} rx="5" fill="white" opacity="0.95" x="-4" y="-4" />

        {/* Row 1: PESACH */}
        <Rect x={0} y={0} width={cellSize} height={cellSize} fill={accentColor} opacity="0.4" stroke={primaryColor} strokeWidth="1" />
        <SvgText x={cellSize/2} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">P</SvgText>

        <Rect x={cellSize} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 1.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">E</SvgText>

        <Rect x={cellSize * 2} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">S</SvgText>

        <Rect x={cellSize * 3} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 3.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">A</SvgText>

        <Rect x={cellSize * 4} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 4.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">C</SvgText>

        <Rect x={cellSize * 5} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 5.5} y={cellSize * 0.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">H</SvgText>

        {/* Row 2 */}
        <Rect x={0} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 2} y={cellSize} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 1.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">E</SvgText>
        <Rect x={cellSize * 3} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 4} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 5} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />

        {/* Row 3: MATZAH */}
        <Rect x={0} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize/2} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">M</SvgText>

        <Rect x={cellSize} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 1.5} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">A</SvgText>

        <Rect x={cellSize * 2} y={cellSize * 2} width={cellSize} height={cellSize} fill={accentColor} opacity="0.4" stroke={primaryColor} strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">D</SvgText>

        <Rect x={cellSize * 3} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 3.5} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">E</SvgText>

        <Rect x={cellSize * 4} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 4.5} y={cellSize * 2.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">R</SvgText>

        <Rect x={cellSize * 5} y={cellSize * 2} width={cellSize} height={cellSize} fill="#1e293b" />

        {/* Row 4 */}
        <Rect x={0} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 2} y={cellSize * 3} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 3.72} fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">R</SvgText>
        <Rect x={cellSize * 3} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 4} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 5} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
      </G>

      {/* Seder plate */}
      <G transform="translate(125, 5)">
        <Ellipse cx="42" cy="42" rx="40" ry="35" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
        <Ellipse cx="42" cy="42" rx="32" ry="28" fill="#f3f4f6" />
        {/* Items on plate */}
        <Circle cx="42" cy="25" r="8" fill="#a0785c" /> {/* Shank bone */}
        <Circle cx="25" cy="35" r="7" fill="#65a30d" /> {/* Karpas */}
        <Circle cx="59" cy="35" r="7" fill="#dc2626" /> {/* Charoset */}
        <Circle cx="30" cy="52" r="6" fill="#84cc16" /> {/* Maror */}
        <Circle cx="54" cy="52" r="6" fill={accentColor} /> {/* Egg */}
        <Circle cx="42" cy="60" r="5" fill="#22c55e" /> {/* Chazeret */}
      </G>

      {/* Matzah stack */}
      <G transform="translate(135, 70)">
        <Rect x="0" y="0" width="55" height="8" rx="2" fill="#f5deb3" />
        <Rect x="2" y="8" width="55" height="8" rx="2" fill="#deb887" />
        <Rect x="4" y="16" width="55" height="8" rx="2" fill="#f5deb3" />
        {/* Matzah dots */}
        <Circle cx="15" cy="4" r="1.5" fill="#c4a574" />
        <Circle cx="30" cy="4" r="1.5" fill="#c4a574" />
        <Circle cx="45" cy="4" r="1.5" fill="#c4a574" />
        <Circle cx="20" cy="12" r="1.5" fill="#a08060" />
        <Circle cx="35" cy="12" r="1.5" fill="#a08060" />
        <Circle cx="50" cy="12" r="1.5" fill="#a08060" />
      </G>

      {/* Wine cup */}
      <G transform="translate(195, 50)">
        <Path d="M5 0 L20 0 L18 25 L7 25 Z" fill={primaryColor} opacity="0.8" />
        <Rect x="9" y="25" width="7" height="8" fill="#c0c0c0" />
        <Ellipse cx="12.5" cy="33" rx="10" ry="3" fill="#c0c0c0" />
      </G>

      {/* Title banner */}
      <G transform="translate(70, 100)">
        <Rect x="0" y="0" width="80" height="28" rx="8" fill="white" opacity="0.95" />
        <SvgText x="40" y="18" fontSize="13" fontWeight="bold" fill={primaryColor} textAnchor="middle">Pesach</SvgText>
      </G>

      <Circle cx="195" cy="125" r="2" fill="white" opacity="0.6" />
      <Circle cx="130" cy="95" r="2" fill={accentColor} opacity="0.8" />
    </Svg>
  );
}

export default PesachCrosswordIllustration;
