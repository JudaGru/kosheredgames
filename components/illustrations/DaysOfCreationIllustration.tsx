import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

interface DaysOfCreationIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function DaysOfCreationIllustration({
  width,
  height,
  primaryColor = '#3b82f6',
  secondaryColor = '#60a5fa',
  accentColor = '#fde047',
}: DaysOfCreationIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="creationBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="220" height="140" fill="url(#creationBg)" />

      <Circle cx="200" cy="120" r="14" fill="white" opacity="0.1" />
      <Circle cx="20" cy="20" r="10" fill="white" opacity="0.15" />

      {/* Sun and Moon */}
      <Circle cx="50" cy="35" r="20" fill={accentColor} />
      <Circle cx="90" cy="35" r="15" fill="#e2e8f0" />
      <Circle cx="85" cy="32" r="12" fill={secondaryColor} />

      {/* Stars */}
      <Circle cx="115" cy="25" r="3" fill="white" />
      <Circle cx="130" cy="40" r="2" fill="white" />
      <Circle cx="105" cy="45" r="2" fill="white" />

      {/* Earth/Land */}
      <Path d="M20 85 Q60 70 100 85 Q140 70 180 85 L180 95 L20 95 Z" fill="#22c55e" />

      {/* Water */}
      <Path d="M20 95 Q60 90 100 95 Q140 90 180 95 L200 95 L200 100 L20 100 Z" fill="#0ea5e9" />

      {/* Tree */}
      <Rect x="145" y="60" width="8" height="25" fill="#78350f" />
      <Circle cx="149" cy="50" r="15" fill="#16a34a" />

      {/* Animals hint */}
      <Circle cx="170" cy="75" r="8" fill="#fbbf24" />
      <Circle cx="167" cy="73" r="2" fill="#1e293b" />

      {/* Day numbers */}
      <G transform="translate(15, 55)">
        {[1, 2, 3, 4, 5, 6, 7].map((num, i) => (
          <G key={num} transform={`translate(${i * 27}, 0)`}>
            <Circle cx="10" cy="10" r="10" fill="white" opacity="0.9" />
            <SvgText x="10" y="14" fontSize="10" fontWeight="bold" fill={primaryColor} textAnchor="middle">{num}</SvgText>
          </G>
        ))}
      </G>

      {/* Title banner */}
      <G transform="translate(10, 105)">
        <Rect x="0" y="0" width="115" height="28" rx="6" fill="white" opacity="0.95" />
        <SvgText x="57" y="12" fontSize="10" fontWeight="bold" fill={primaryColor} textAnchor="middle">Days of Creation</SvgText>
        <SvgText x="57" y="23" fontSize="8" fill="#64748b" textAnchor="middle">Put in Order</SvgText>
      </G>
    </Svg>
  );
}

export default DaysOfCreationIllustration;
