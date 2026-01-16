import Svg, { Rect, Circle, G, Defs, LinearGradient, Stop, Text as SvgText, Path, Ellipse } from 'react-native-svg';

interface WhoAmIIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function WhoAmIIllustration({
  width,
  height,
  primaryColor = '#0891b2',
  secondaryColor = '#67e8f9',
  accentColor = '#fde047',
}: WhoAmIIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="whoAmIBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#whoAmIBg)" />

      {/* Decorative circles */}
      <Circle cx="200" cy="20" r="12" fill="white" opacity="0.15" />
      <Circle cx="15" cy="125" r="10" fill="white" opacity="0.1" />

      {/* Mystery person silhouette */}
      <G transform="translate(75, 15)">
        {/* Card background */}
        <Rect width="70" height="90" rx="10" fill="white" />

        {/* Silhouette head */}
        <Circle cx="35" cy="30" r="18" fill="#cbd5e1" />

        {/* Silhouette body */}
        <Ellipse cx="35" cy="65" rx="22" ry="18" fill="#cbd5e1" />

        {/* Question mark overlay */}
        <Circle cx="35" cy="45" r="25" fill="white" opacity="0.8" />
        <SvgText
          x="35"
          y="55"
          fontSize="36"
          fontWeight="bold"
          fill={primaryColor}
          textAnchor="middle"
        >
          ?
        </SvgText>
      </G>

      {/* Clue cards */}
      <G transform="translate(15, 40)">
        <Rect width="50" height="30" rx="6" fill="white" opacity="0.95" />
        <Rect x="5" y="8" width="30" height="3" rx="1.5" fill="#94a3b8" />
        <Rect x="5" y="15" width="40" height="3" rx="1.5" fill="#94a3b8" />
        <Rect x="5" y="22" width="25" height="3" rx="1.5" fill="#94a3b8" />
        <SvgText x="45" y="10" fontSize="10" fontWeight="bold" fill={accentColor}>1</SvgText>
      </G>

      <G transform="translate(155, 40)">
        <Rect width="50" height="30" rx="6" fill="white" opacity="0.95" />
        <Rect x="5" y="8" width="35" height="3" rx="1.5" fill="#94a3b8" />
        <Rect x="5" y="15" width="40" height="3" rx="1.5" fill="#94a3b8" />
        <Rect x="5" y="22" width="28" height="3" rx="1.5" fill="#94a3b8" />
        <SvgText x="45" y="10" fontSize="10" fontWeight="bold" fill={accentColor}>2</SvgText>
      </G>

      <G transform="translate(15, 85)">
        <Rect width="50" height="30" rx="6" fill="white" opacity="0.95" />
        <Rect x="5" y="8" width="38" height="3" rx="1.5" fill="#94a3b8" />
        <Rect x="5" y="15" width="32" height="3" rx="1.5" fill="#94a3b8" />
        <Rect x="5" y="22" width="40" height="3" rx="1.5" fill="#94a3b8" />
        <SvgText x="45" y="10" fontSize="10" fontWeight="bold" fill={accentColor}>3</SvgText>
      </G>

      <G transform="translate(155, 85)">
        <Rect width="50" height="30" rx="6" fill="white" opacity="0.95" />
        <Rect x="5" y="8" width="28" height="3" rx="1.5" fill="#94a3b8" />
        <Rect x="5" y="15" width="40" height="3" rx="1.5" fill="#94a3b8" />
        <Rect x="5" y="22" width="35" height="3" rx="1.5" fill="#94a3b8" />
        <SvgText x="45" y="10" fontSize="10" fontWeight="bold" fill={accentColor}>4</SvgText>
      </G>

      {/* Sparkles */}
      <Circle cx="85" cy="115" r="2" fill="white" opacity="0.7" />
      <Circle cx="135" cy="115" r="2" fill={accentColor} opacity="0.8" />
    </Svg>
  );
}

export default WhoAmIIllustration;
