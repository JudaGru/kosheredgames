import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText, Ellipse } from 'react-native-svg';

interface TenMakkosIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function TenMakkosIllustration({
  width,
  height,
  primaryColor = '#7c3aed',
  secondaryColor = '#a78bfa',
  accentColor = '#fde047',
}: TenMakkosIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="makkosBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#makkosBg)" />

      {/* Decorative circles */}
      <Circle cx="200" cy="20" r="12" fill="white" opacity="0.15" />
      <Circle cx="15" cy="125" r="10" fill="white" opacity="0.1" />

      {/* Blood drop (Dam) */}
      <G transform="translate(20, 25)">
        <Path
          d="M10 0 Q0 15 10 22 Q20 15 10 0"
          fill="#ef4444"
        />
      </G>

      {/* Frog (Tzfardea) */}
      <G transform="translate(50, 20)">
        <Ellipse cx="10" cy="12" rx="10" ry="8" fill="#22c55e" />
        <Circle cx="5" cy="8" r="3" fill="white" />
        <Circle cx="15" cy="8" r="3" fill="white" />
        <Circle cx="5" cy="8" r="1.5" fill="#1e293b" />
        <Circle cx="15" cy="8" r="1.5" fill="#1e293b" />
      </G>

      {/* Lice dots (Kinim) */}
      <G transform="translate(85, 28)">
        <Circle cx="0" cy="0" r="2" fill="#854d0e" />
        <Circle cx="6" cy="4" r="2" fill="#854d0e" />
        <Circle cx="12" cy="0" r="2" fill="#854d0e" />
        <Circle cx="3" cy="10" r="2" fill="#854d0e" />
        <Circle cx="9" cy="8" r="2" fill="#854d0e" />
      </G>

      {/* Wild animal (Arov) - simplified lion face */}
      <G transform="translate(110, 20)">
        <Circle cx="12" cy="12" r="12" fill="#f59e0b" />
        <Circle cx="8" cy="10" r="2" fill="#1e293b" />
        <Circle cx="16" cy="10" r="2" fill="#1e293b" />
        <Ellipse cx="12" cy="16" rx="3" ry="2" fill="#1e293b" />
      </G>

      {/* Numbered sequence cards */}
      <G transform="translate(25, 60)">
        <Rect width="35" height="45" rx="6" fill="white" />
        <Circle cx="17.5" cy="15" r="10" fill={primaryColor} />
        <SvgText x="17.5" y="19" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">
          1
        </SvgText>
        <SvgText x="17.5" y="36" fontSize="8" fontWeight="600" fill="#64748b" textAnchor="middle">
          דם
        </SvgText>
      </G>

      {/* Arrow */}
      <Path d="M65 82 L72 82 M69 78 L74 82 L69 86" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      <G transform="translate(78, 60)">
        <Rect width="35" height="45" rx="6" fill="white" />
        <Circle cx="17.5" cy="15" r="10" fill={primaryColor} />
        <SvgText x="17.5" y="19" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">
          2
        </SvgText>
        <SvgText x="17.5" y="36" fontSize="8" fontWeight="600" fill="#64748b" textAnchor="middle">
          צפרדע
        </SvgText>
      </G>

      {/* Arrow */}
      <Path d="M118 82 L125 82 M122 78 L127 82 L122 86" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      <G transform="translate(131, 60)">
        <Rect width="35" height="45" rx="6" fill="white" opacity="0.7" stroke="white" strokeWidth="2" strokeDasharray="4 2" />
        <Circle cx="17.5" cy="15" r="10" fill={primaryColor} opacity="0.5" />
        <SvgText x="17.5" y="19" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">
          ?
        </SvgText>
      </G>

      {/* Floating card being dragged */}
      <G transform="translate(170, 70) rotate(-5)">
        <Rect width="35" height="45" rx="6" fill={accentColor} />
        <Circle cx="17.5" cy="15" r="10" fill={primaryColor} />
        <SvgText x="17.5" y="19" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">
          3
        </SvgText>
        <SvgText x="17.5" y="36" fontSize="8" fontWeight="600" fill={primaryColor} textAnchor="middle">
          כנים
        </SvgText>
      </G>

      {/* 10 indicator */}
      <G transform="translate(175, 15)">
        <Circle r="14" fill="white" opacity="0.9" />
        <SvgText x="0" y="5" fontSize="12" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          10
        </SvgText>
      </G>

      {/* Sparkles */}
      <Circle cx="145" cy="25" r="2" fill="white" opacity="0.7" />
    </Svg>
  );
}

export default TenMakkosIllustration;
