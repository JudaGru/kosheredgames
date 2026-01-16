import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

interface HanukkahCrosswordIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function HanukkahCrosswordIllustration({
  width,
  height,
  primaryColor = '#2563eb',
  secondaryColor = '#60a5fa',
  accentColor = '#fde047',
}: HanukkahCrosswordIllustrationProps) {
  const cellSize = 14;

  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="hanukkahCrossBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="220" height="140" fill="url(#hanukkahCrossBg)" />

      <Circle cx="200" cy="15" r="12" fill="white" opacity="0.1" />
      <Circle cx="15" cy="125" r="10" fill="white" opacity="0.15" />

      {/* Crossword grid */}
      <G transform="translate(12, 15)">
        <Rect width={cellSize * 8 + 8} height={cellSize * 4 + 8} rx="5" fill="white" opacity="0.95" x="-4" y="-4" />

        {/* Row 1: HANUKKAH */}
        <Rect x={0} y={0} width={cellSize} height={cellSize} fill={accentColor} opacity="0.4" stroke={primaryColor} strokeWidth="1" />
        <SvgText x={cellSize/2} y={cellSize * 0.75} fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">H</SvgText>

        <Rect x={cellSize} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 1.5} y={cellSize * 0.75} fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">A</SvgText>

        <Rect x={cellSize * 2} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 0.75} fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">N</SvgText>

        <Rect x={cellSize * 3} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 3.5} y={cellSize * 0.75} fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">U</SvgText>

        <Rect x={cellSize * 4} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 4.5} y={cellSize * 0.75} fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">K</SvgText>

        <Rect x={cellSize * 5} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 5.5} y={cellSize * 0.75} fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">K</SvgText>

        <Rect x={cellSize * 6} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 6.5} y={cellSize * 0.75} fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">A</SvgText>

        <Rect x={cellSize * 7} y={0} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 7.5} y={cellSize * 0.75} fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">H</SvgText>

        {/* Row 2 */}
        <Rect x={0} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 2} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 3} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 4} y={cellSize} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 4.5} y={cellSize * 1.75} fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">E</SvgText>
        <Rect x={cellSize * 5} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 6} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 7} y={cellSize} width={cellSize} height={cellSize} fill="#1e293b" />

        {/* Row 3: CANDLES */}
        <Rect x={0} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize/2} y={cellSize * 2.75} fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">C</SvgText>

        <Rect x={cellSize} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 1.5} y={cellSize * 2.75} fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">A</SvgText>

        <Rect x={cellSize * 2} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 2.5} y={cellSize * 2.75} fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">N</SvgText>

        <Rect x={cellSize * 3} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 3.5} y={cellSize * 2.75} fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">D</SvgText>

        <Rect x={cellSize * 4} y={cellSize * 2} width={cellSize} height={cellSize} fill={accentColor} opacity="0.4" stroke={primaryColor} strokeWidth="1" />
        <SvgText x={cellSize * 4.5} y={cellSize * 2.75} fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">L</SvgText>

        <Rect x={cellSize * 5} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 5.5} y={cellSize * 2.75} fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">E</SvgText>

        <Rect x={cellSize * 6} y={cellSize * 2} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 6.5} y={cellSize * 2.75} fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">S</SvgText>

        <Rect x={cellSize * 7} y={cellSize * 2} width={cellSize} height={cellSize} fill="#1e293b" />

        {/* Row 4 */}
        <Rect x={0} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 2} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 3} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 4} y={cellSize * 3} width={cellSize} height={cellSize} fill="white" stroke="#cbd5e1" strokeWidth="1" />
        <SvgText x={cellSize * 4.5} y={cellSize * 3.75} fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">T</SvgText>
        <Rect x={cellSize * 5} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 6} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
        <Rect x={cellSize * 7} y={cellSize * 3} width={cellSize} height={cellSize} fill="#1e293b" />
      </G>

      {/* Menorah */}
      <G transform="translate(130, 8)">
        {/* Base and stem */}
        <Rect x="35" y="60" width="15" height="8" rx="2" fill="#c0c0c0" />
        <Rect x="40" y="30" width="5" height="30" fill="#c0c0c0" />

        {/* Branches */}
        <Rect x="10" y="20" width="65" height="3" rx="1" fill="#c0c0c0" />

        {/* Candles - 9 total */}
        {[10, 20, 30, 40, 50, 60, 70].map((x, i) => (
          <G key={i}>
            <Rect x={x} y="5" width="5" height="15" rx="1" fill={primaryColor} />
            <Path d={`M${x + 2.5} 5 Q${x} 0 ${x + 2.5} -5 Q${x + 5} 0 ${x + 2.5} 5`} fill="#f97316" />
            <Circle cx={x + 2.5} cy={-2} r="2" fill={accentColor} />
          </G>
        ))}

        {/* Shamash (center, elevated) */}
        <Rect x="40" y="-5" width="5" height="20" rx="1" fill={primaryColor} />
        <Path d="M42.5 -5 Q38 -12 42.5 -18 Q47 -12 42.5 -5" fill="#f97316" />
        <Circle cx="42.5" cy="-14" r="2.5" fill={accentColor} />
      </G>

      {/* Dreidel */}
      <G transform="translate(175, 65)">
        <Rect x="5" y="0" width="20" height="25" rx="3" fill={accentColor} />
        <Path d="M15 25 L10 35 L20 35 Z" fill={accentColor} />
        <Rect x="12" y="-8" width="6" height="10" rx="2" fill={accentColor} />
        <SvgText x="15" y="18" fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">נ</SvgText>
      </G>

      {/* Gelt */}
      <G transform="translate(200, 85)">
        <Circle cx="8" cy="8" r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        <SvgText x="8" y="12" fontSize="10" fontWeight="bold" fill="#92400e" textAnchor="middle">$</SvgText>
      </G>

      {/* Title banner */}
      <G transform="translate(10, 100)">
        <Rect x="0" y="0" width="125" height="32" rx="8" fill="white" opacity="0.95" />
        <SvgText x="62" y="15" fontSize="11" fontWeight="bold" fill={primaryColor} textAnchor="middle">Hanukkah Crossword</SvgText>
        <SvgText x="62" y="27" fontSize="9" fill="#64748b" textAnchor="middle">Solve the Clues</SvgText>
      </G>

      <Circle cx="195" cy="125" r="2" fill="white" opacity="0.6" />
      <Circle cx="140" cy="100" r="2" fill={accentColor} opacity="0.8" />
    </Svg>
  );
}

export default HanukkahCrosswordIllustration;
