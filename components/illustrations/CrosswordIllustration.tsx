import Svg, { Rect, Circle, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

interface CrosswordIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function CrosswordIllustration({
  width,
  height,
  primaryColor = '#0369a1',
  secondaryColor = '#38bdf8',
  accentColor = '#fde047',
}: CrosswordIllustrationProps) {
  const cellSize = 22;

  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="crosswordBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#crosswordBg)" />

      {/* Decorative circles */}
      <Circle cx="200" cy="20" r="12" fill="white" opacity="0.15" />
      <Circle cx="15" cy="125" r="10" fill="white" opacity="0.1" />

      {/* Crossword grid */}
      <G transform="translate(35, 20)">
        {/* White background for grid */}
        <Rect width={cellSize * 6 + 4} height={cellSize * 5 + 4} rx="6" fill="white" x="-2" y="-2" />

        {/* Row 1: S H A B B O S (horizontal) - positions 0,0 to 0,5 */}
        {/* S */}
        <Rect x={0} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize/2} y={cellSize * 0.72} fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">S</SvgText>
        <SvgText x={3} y={9} fontSize="6" fill="#94a3b8">1</SvgText>

        {/* H */}
        <Rect x={cellSize} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 1.5} y={cellSize * 0.72} fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">H</SvgText>

        {/* A */}
        <Rect x={cellSize * 2} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 0.72} fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">A</SvgText>
        <SvgText x={cellSize * 2 + 3} y={9} fontSize="6" fill="#94a3b8">2</SvgText>

        {/* B */}
        <Rect x={cellSize * 3} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 3.5} y={cellSize * 0.72} fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">B</SvgText>

        {/* B */}
        <Rect x={cellSize * 4} y={0} width={cellSize} height={cellSize} fill={accentColor} opacity="0.3" stroke={accentColor} strokeWidth="2" />
        <SvgText x={cellSize * 4.5} y={cellSize * 0.72} fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">B</SvgText>

        {/* O */}
        <Rect x={cellSize * 5} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 5.5} y={cellSize * 0.72} fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">O</SvgText>

        {/* Row 2: Black cells + V + Black cells (vertical from HAVDALAH) */}
        <Rect x={0} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 2} y={cellSize} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 1.72} fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">V</SvgText>
        <Rect x={cellSize * 3} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 4} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 5} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />

        {/* Row 3: K I D D U S H */}
        <Rect x={0} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize/2} y={cellSize * 2.72} fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">K</SvgText>
        <SvgText x={3} y={cellSize * 2 + 9} fontSize="6" fill="#94a3b8">3</SvgText>

        <Rect x={cellSize} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 1.5} y={cellSize * 2.72} fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">I</SvgText>

        <Rect x={cellSize * 2} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 2.72} fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">D</SvgText>

        <Rect x={cellSize * 3} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 3.5} y={cellSize * 2.72} fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">D</SvgText>

        <Rect x={cellSize * 4} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 4.5} y={cellSize * 2.72} fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">U</SvgText>

        <Rect x={cellSize * 5} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 5.5} y={cellSize * 2.72} fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">S</SvgText>

        {/* Row 4: Partial - L cell from HAVDALAH */}
        <Rect x={0} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 2} y={cellSize * 3} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 3.72} fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">L</SvgText>
        <Rect x={cellSize * 3} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 4} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 5} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />

        {/* Row 5: A cell + H */}
        <Rect x={0} y={cellSize * 4} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize} y={cellSize * 4} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 2} y={cellSize * 4} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 4.72} fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">A</SvgText>
        <Rect x={cellSize * 3} y={cellSize * 4} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 4} y={cellSize * 4} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 5} y={cellSize * 4} width={cellSize} height={cellSize} fill="#1e293b" />
      </G>

      {/* Clue section */}
      <G transform="translate(175, 35)">
        <Rect width="35" height="70" rx="6" fill="white" opacity="0.9" />
        <SvgText x="17" y="18" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          CLUES
        </SvgText>
        <Rect x="5" y="26" width="25" height="2" rx="1" fill="#e2e8f0" />
        <Rect x="5" y="34" width="20" height="2" rx="1" fill="#e2e8f0" />
        <Rect x="5" y="42" width="22" height="2" rx="1" fill="#e2e8f0" />
        <Rect x="5" y="50" width="18" height="2" rx="1" fill="#e2e8f0" />
        <Rect x="5" y="58" width="24" height="2" rx="1" fill="#e2e8f0" />
      </G>

      {/* Sparkles */}
      <Circle cx="170" cy="110" r="2" fill="white" opacity="0.7" />
      <Circle cx="25" cy="55" r="2" fill={accentColor} opacity="0.8" />
      <Circle cx="195" cy="125" r="3" fill={accentColor} opacity="0.6" />
    </Svg>
  );
}

export default CrosswordIllustration;
