import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

interface NachWhoAmIIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function NachWhoAmIIllustration({
  width,
  height,
  primaryColor = '#4f46e5',
  secondaryColor = '#6366f1',
  accentColor = '#a5b4fc',
}: NachWhoAmIIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="nachWhoAmIBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="220" height="140" fill="url(#nachWhoAmIBg)" />

      <Circle cx="200" cy="120" r="14" fill="white" opacity="0.1" />
      <Circle cx="20" cy="20" r="10" fill="white" opacity="0.15" />

      {/* Mystery Person Silhouette */}
      <G transform="translate(30, 15)">
        <Circle cx="35" cy="25" r="22" fill="white" opacity="0.9" />
        <Circle cx="35" cy="20" r="12" fill="#cbd5e1" />
        <Path d="M20 50 Q35 40 50 50 L50 60 L20 60 Z" fill="#cbd5e1" />
        <SvgText x="35" y="55" fontSize="30" fontWeight="bold" fill={primaryColor} textAnchor="middle">?</SvgText>
      </G>

      {/* Scroll */}
      <G transform="translate(100, 20)">
        <Rect x="0" y="5" width="6" height="45" rx="3" fill="#78350f" />
        <Rect x="44" y="5" width="6" height="45" rx="3" fill="#78350f" />
        <Rect x="5" y="10" width="40" height="35" fill="#fef3c7" />
        <Rect x="10" y="16" width="30" height="2" fill="#92400e" opacity="0.4" />
        <Rect x="10" y="22" width="28" height="2" fill="#92400e" opacity="0.4" />
        <Rect x="10" y="28" width="30" height="2" fill="#92400e" opacity="0.4" />
        <Rect x="10" y="34" width="25" height="2" fill="#92400e" opacity="0.4" />
      </G>

      {/* Clue bubbles */}
      <G transform="translate(160, 15)">
        <Circle cx="15" cy="15" r="12" fill="white" opacity="0.9" />
        <SvgText x="15" y="19" fontSize="10" fontWeight="bold" fill={primaryColor} textAnchor="middle">1</SvgText>
        <Circle cx="40" cy="25" r="10" fill="white" opacity="0.8" />
        <SvgText x="40" y="29" fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">2</SvgText>
        <Circle cx="25" cy="45" r="8" fill="white" opacity="0.7" />
        <SvgText x="25" y="48" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">3</SvgText>
      </G>

      {/* Answer options */}
      <G transform="translate(95, 75)">
        <Rect x="0" y="0" width="55" height="18" rx="4" fill="white" opacity="0.9" />
        <SvgText x="27" y="13" fontSize="9" fill="#64748b" textAnchor="middle">Yehoshua?</SvgText>
        <Rect x="60" y="0" width="55" height="18" rx="4" fill="white" opacity="0.9" />
        <SvgText x="87" y="13" fontSize="9" fill="#64748b" textAnchor="middle">Devorah?</SvgText>
      </G>

      {/* Sparkles */}
      <Circle cx="85" cy="30" r="3" fill={accentColor} opacity="0.9" />
      <Circle cx="195" cy="50" r="2" fill="white" opacity="0.8" />

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        {/* Banner background */}
        <Rect x="-30" y="-12" width="60" height="24" rx="12" fill="white" opacity="0.95" />
        {/* Title text */}
        <SvgText x="0" y="4" fontSize="13" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Nach
        </SvgText>
      </G>
    </Svg>
  );
}

export default NachWhoAmIIllustration;
