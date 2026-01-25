import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

interface LetterGridIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function LetterGridIllustration({
  width,
  height,
  primaryColor = '#7c3aed',
  secondaryColor = '#a78bfa',
  accentColor = '#fde047',
  title = 'Torah Words',
}: LetterGridIllustrationProps) {
  // Letters for a 4x4 grid
  const gridLetters = [
    ['T', 'O', 'R', 'A'],
    ['S', 'H', 'A', 'B'],
    ['M', 'I', 'T', 'Z'],
    ['V', 'A', 'H', 'S'],
  ];

  // Connected path for "TORAH" (T-O-R-A-H going through the grid)
  const connectedCells = [
    { row: 0, col: 0 }, // T
    { row: 0, col: 1 }, // O
    { row: 0, col: 2 }, // R
    { row: 0, col: 3 }, // A
    { row: 1, col: 1 }, // H
  ];

  const cellSize = 20;
  const cellGap = 3;
  const gridStartX = 35;
  const gridStartY = 45;

  const getCellCenter = (row: number, col: number) => ({
    x: gridStartX + col * (cellSize + cellGap) + cellSize / 2,
    y: gridStartY + row * (cellSize + cellGap) + cellSize / 2,
  });

  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="letterGridBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
        <LinearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={accentColor} stopOpacity="0.6" />
          <Stop offset="100%" stopColor={accentColor} stopOpacity="0.2" />
        </LinearGradient>
      </Defs>

      {/* Background gradient */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#letterGridBg)" />

      {/* Decorative circles in corners */}
      <Circle cx="10" cy="10" r="20" fill="white" opacity="0.08" />
      <Circle cx="210" cy="130" r="25" fill="white" opacity="0.06" />
      <Circle cx="200" cy="15" r="8" fill="white" opacity="0.1" />

      {/* Torah scroll icon at top right */}
      <G transform="translate(165, 20)">
        <Rect x="0" y="5" width="35" height="25" rx="3" fill="white" opacity="0.9" />
        <Rect x="-3" y="3" width="6" height="29" rx="3" fill={accentColor} />
        <Rect x="32" y="3" width="6" height="29" rx="3" fill={accentColor} />
        <Line x1="5" y1="12" x2="30" y2="12" stroke="#94a3b8" strokeWidth="1.5" />
        <Line x1="5" y1="17" x2="30" y2="17" stroke="#94a3b8" strokeWidth="1.5" />
        <Line x1="5" y1="22" x2="25" y2="22" stroke="#94a3b8" strokeWidth="1.5" />
      </G>

      {/* Connection lines between cells (drawn first, behind cells) */}
      {connectedCells.map((cell, i) => {
        if (i === 0) return null;
        const prev = connectedCells[i - 1];
        const from = getCellCenter(prev.row, prev.col);
        const to = getCellCenter(cell.row, cell.col);
        return (
          <Line
            key={`line-${i}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={accentColor}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />
        );
      })}

      {/* Letter grid */}
      <G>
        {gridLetters.map((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const isHighlighted = connectedCells.some(
              (c) => c.row === rowIndex && c.col === colIndex
            );
            const x = gridStartX + colIndex * (cellSize + cellGap);
            const y = gridStartY + rowIndex * (cellSize + cellGap);

            return (
              <G key={`${rowIndex}-${colIndex}`}>
                {/* Cell shadow */}
                <Rect
                  x={x + 1}
                  y={y + 1}
                  width={cellSize}
                  height={cellSize}
                  rx="4"
                  fill="#000"
                  opacity="0.15"
                />
                {/* Cell background */}
                <Rect
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  rx="4"
                  fill={isHighlighted ? accentColor : 'white'}
                  stroke={isHighlighted ? '#eab308' : '#e2e8f0'}
                  strokeWidth={isHighlighted ? 2 : 1}
                />
                {/* Letter */}
                <SvgText
                  x={x + cellSize / 2}
                  y={y + cellSize / 2 + 5}
                  fontSize="11"
                  fontWeight="bold"
                  fill={isHighlighted ? primaryColor : '#334155'}
                  textAnchor="middle"
                >
                  {letter}
                </SvgText>
              </G>
            );
          })
        )}
      </G>

      {/* Found words list on the right */}
      <G transform="translate(140, 55)">
        <Rect x="0" y="-5" width="65" height="55" rx="8" fill="white" opacity="0.95" />
        <SvgText x="8" y="8" fontSize="8" fontWeight="bold" fill="#64748b">
          Found:
        </SvgText>
        <G transform="translate(8, 18)">
          <Rect x="0" y="0" width="50" height="12" rx="3" fill="#dcfce7" />
          <SvgText x="25" y="9" fontSize="8" fontWeight="600" fill="#166534" textAnchor="middle">
            TORAH
          </SvgText>
        </G>
        <G transform="translate(8, 33)">
          <Rect x="0" y="0" width="50" height="12" rx="3" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
          <SvgText x="25" y="9" fontSize="8" fill="#94a3b8" textAnchor="middle">
            ?????
          </SvgText>
        </G>
      </G>

      {/* Sparkle effects */}
      <Circle cx="25" cy="35" r="3" fill={accentColor} opacity="0.8" />
      <Circle cx="130" cy="45" r="2" fill="white" opacity="0.6" />
      <Circle cx="15" cy="110" r="2" fill="white" opacity="0.5" />

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        <Rect x="-55" y="-12" width="110" height="24" rx="12" fill="white" opacity="0.95" />
        <SvgText x="0" y="4" fontSize="12" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          {title}
        </SvgText>
      </G>

      {/* Extra sparkle decorations */}
      <Circle cx="15" cy="125" r="3" fill="white" opacity="0.5" />
      <Circle cx="205" cy="110" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default LetterGridIllustration;
