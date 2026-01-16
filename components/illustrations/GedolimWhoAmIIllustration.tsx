import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

interface GedolimWhoAmIIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function GedolimWhoAmIIllustration({
  width,
  height,
  primaryColor = '#059669',
  secondaryColor = '#10b981',
  accentColor = '#6ee7b7',
}: GedolimWhoAmIIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="gedolimWhoAmIBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="220" height="140" fill="url(#gedolimWhoAmIBg)" />

      <Circle cx="200" cy="120" r="14" fill="white" opacity="0.1" />
      <Circle cx="20" cy="20" r="10" fill="white" opacity="0.15" />

      {/* Mystery Person with Hat */}
      <G transform="translate(30, 10)">
        <Circle cx="35" cy="35" r="25" fill="white" opacity="0.9" />
        {/* Hat */}
        <Rect x="15" y="8" width="40" height="8" rx="2" fill="#1e293b" />
        <Rect x="22" y="0" width="26" height="12" rx="2" fill="#1e293b" />
        {/* Face silhouette */}
        <Circle cx="35" cy="30" r="12" fill="#cbd5e1" />
        <Path d="M20 55 Q35 45 50 55" fill="#cbd5e1" />
        {/* Question mark */}
        <SvgText x="35" y="58" fontSize="25" fontWeight="bold" fill={primaryColor} textAnchor="middle">?</SvgText>
      </G>

      {/* Stack of Seforim */}
      <G transform="translate(100, 25)">
        <Rect x="0" y="0" width="50" height="12" rx="2" fill="#dc2626" />
        <Rect x="2" y="14" width="50" height="12" rx="2" fill="#2563eb" />
        <Rect x="0" y="28" width="50" height="12" rx="2" fill="#16a34a" />
        <Rect x="3" y="42" width="50" height="12" rx="2" fill="#9333ea" />
      </G>

      {/* Clue numbers */}
      <G transform="translate(165, 20)">
        <Circle cx="12" cy="12" r="10" fill="white" opacity="0.9" />
        <SvgText x="12" y="16" fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">1</SvgText>
        <Circle cx="35" cy="20" r="8" fill="white" opacity="0.8" />
        <SvgText x="35" y="24" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">2</SvgText>
        <Circle cx="20" cy="40" r="7" fill="white" opacity="0.7" />
        <SvgText x="20" y="43" fontSize="7" fontWeight="bold" fill={primaryColor} textAnchor="middle">3</SvgText>
      </G>

      {/* Answer options */}
      <G transform="translate(95, 75)">
        <Rect x="0" y="0" width="50" height="16" rx="4" fill="white" opacity="0.9" />
        <SvgText x="25" y="12" fontSize="8" fill="#64748b" textAnchor="middle">Rashi?</SvgText>
        <Rect x="55" y="0" width="55" height="16" rx="4" fill="white" opacity="0.9" />
        <SvgText x="82" y="12" fontSize="8" fill="#64748b" textAnchor="middle">Rambam?</SvgText>
      </G>

      {/* Sparkles */}
      <Circle cx="90" cy="35" r="3" fill={accentColor} opacity="0.9" />
      <Circle cx="195" cy="55" r="2" fill="white" opacity="0.8" />

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        {/* Banner background */}
        <Rect x="-40" y="-12" width="80" height="24" rx="12" fill="white" opacity="0.95" />
        {/* Title text */}
        <SvgText x="0" y="4" fontSize="13" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Gedolim
        </SvgText>
      </G>
    </Svg>
  );
}

export default GedolimWhoAmIIllustration;
