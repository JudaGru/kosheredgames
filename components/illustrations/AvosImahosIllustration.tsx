import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText, Ellipse } from 'react-native-svg';

interface AvosImahosIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function AvosImahosIllustration({
  width,
  height,
  primaryColor = '#0d9488',
  secondaryColor = '#14b8a6',
  accentColor = '#fde047',
}: AvosImahosIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="avosBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="220" height="140" fill="url(#avosBg)" />

      <Circle cx="200" cy="120" r="14" fill="white" opacity="0.1" />
      <Circle cx="20" cy="20" r="10" fill="white" opacity="0.15" />

      {/* Avos - Male figures */}
      <G transform="translate(25, 20)">
        {/* Avraham */}
        <Circle cx="15" cy="12" r="10" fill="#f8d7b5" />
        <Ellipse cx="15" cy="20" rx="2" ry="3" fill="#a3a3a3" />
        <Rect x="8" y="22" width="14" height="18" rx="3" fill="#3b82f6" />
      </G>

      <G transform="translate(70, 20)">
        {/* Yitzchak */}
        <Circle cx="15" cy="12" r="10" fill="#f8d7b5" />
        <Ellipse cx="15" cy="20" rx="2" ry="3" fill="#a3a3a3" />
        <Rect x="8" y="22" width="14" height="18" rx="3" fill="#8b5cf6" />
      </G>

      <G transform="translate(115, 20)">
        {/* Yaakov */}
        <Circle cx="15" cy="12" r="10" fill="#f8d7b5" />
        <Ellipse cx="15" cy="20" rx="2" ry="3" fill="#a3a3a3" />
        <Rect x="8" y="22" width="14" height="18" rx="3" fill="#22c55e" />
      </G>

      {/* Imahos - Female figures */}
      <G transform="translate(160, 15)">
        {/* Sarah */}
        <Circle cx="15" cy="12" r="10" fill="#f8d7b5" />
        <Path d="M5 10 Q10 5 15 8 Q20 5 25 10" fill="#a3a3a3" />
        <Rect x="8" y="22" width="14" height="18" rx="3" fill="#ec4899" />
      </G>

      {/* Arrows showing sequence */}
      <Path d="M55 35 L62 35 M59 31 L64 35 L59 39" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <Path d="M100 35 L107 35 M104 31 L109 35 L104 39" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <Path d="M145 35 L152 35 M149 31 L154 35 L149 39" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Numbered sequence cards */}
      <G transform="translate(15, 65)">
        <Rect width="40" height="35" rx="6" fill="white" />
        <Circle cx="20" cy="12" r="8" fill={primaryColor} />
        <SvgText x="20" y="16" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">1</SvgText>
        <SvgText x="20" y="28" fontSize="7" fontWeight="600" fill="#64748b" textAnchor="middle">Avraham</SvgText>
      </G>

      <Path d="M58 82 L65 82 M62 78 L67 82 L62 86" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      <G transform="translate(70, 65)">
        <Rect width="40" height="35" rx="6" fill="white" />
        <Circle cx="20" cy="12" r="8" fill={primaryColor} />
        <SvgText x="20" y="16" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">2</SvgText>
        <SvgText x="20" y="28" fontSize="7" fontWeight="600" fill="#64748b" textAnchor="middle">Sarah</SvgText>
      </G>

      <Path d="M113 82 L120 82 M117 78 L122 82 L117 86" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      <G transform="translate(125, 65)">
        <Rect width="40" height="35" rx="6" fill="white" opacity="0.7" stroke="white" strokeWidth="2" strokeDasharray="4 2" />
        <Circle cx="20" cy="12" r="8" fill={primaryColor} opacity="0.5" />
        <SvgText x="20" y="16" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">?</SvgText>
      </G>

      {/* Floating card being dragged */}
      <G transform="translate(172, 60) rotate(-5)">
        <Rect width="40" height="35" rx="6" fill={accentColor} />
        <Circle cx="20" cy="12" r="8" fill={primaryColor} />
        <SvgText x="20" y="16" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">3</SvgText>
        <SvgText x="20" y="28" fontSize="7" fontWeight="600" fill={primaryColor} textAnchor="middle">Yitzchak</SvgText>
      </G>

      {/* Title banner - centered */}
      <G transform="translate(50, 108)">
        <Rect x="0" y="0" width="120" height="24" rx="6" fill="white" opacity="0.95" />
        <SvgText x="60" y="16" fontSize="11" fontWeight="bold" fill={primaryColor} textAnchor="middle">Avos & Imahos</SvgText>
      </G>
    </Svg>
  );
}

export default AvosImahosIllustration;
