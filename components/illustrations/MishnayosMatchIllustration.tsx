import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText, Ellipse } from 'react-native-svg';

interface MishnayosMatchIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function MishnayosMatchIllustration({
  width,
  height,
  primaryColor = '#0891b2',
  secondaryColor = '#22d3ee',
  accentColor = '#fde047',
}: MishnayosMatchIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="mishnaBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
        <LinearGradient id="bookCover" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#164e63" />
          <Stop offset="100%" stopColor="#0e7490" />
        </LinearGradient>
        <LinearGradient id="pageColor" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#fef3c7" />
          <Stop offset="100%" stopColor="#fde68a" />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#mishnaBg)" />

      {/* Decorative circles */}
      <Circle cx="200" cy="20" r="15" fill="white" opacity="0.15" />
      <Circle cx="15" cy="125" r="10" fill="white" opacity="0.1" />

      {/* Seder card */}
      <G transform="translate(15, 18)">
        <Rect width="55" height="68" rx="8" fill="white" />
        {/* Stack of books */}
        <Rect x="10" y="22" width="35" height="10" rx="2" fill="#7c3aed" />
        <Rect x="12" y="24" width="31" height="6" rx="1" fill="#8b5cf6" />
        <Rect x="8" y="34" width="39" height="10" rx="2" fill="url(#bookCover)" />
        <Rect x="10" y="36" width="35" height="6" rx="1" fill="#0e7490" />
        <SvgText x="27" y="18" fontSize="10" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          זרעים
        </SvgText>
        <SvgText x="27" y="58" fontSize="8" fontWeight="600" fill="#64748b" textAnchor="middle">
          Zeraim
        </SvgText>
      </G>

      {/* Masechta card */}
      <G transform="translate(80, 18)">
        <Rect width="55" height="68" rx="8" fill={accentColor} />
        {/* Open book */}
        <Rect x="8" y="20" width="18" height="28" fill="url(#pageColor)" />
        <Rect x="28" y="20" width="18" height="28" fill="url(#pageColor)" />
        <Rect x="24" y="18" width="6" height="32" fill="#0e7490" />
        {/* Text lines */}
        <Rect x="11" y="25" width="12" height="1.5" rx="0.5" fill="#92400e" opacity="0.4" />
        <Rect x="11" y="30" width="10" height="1.5" rx="0.5" fill="#92400e" opacity="0.4" />
        <Rect x="11" y="35" width="12" height="1.5" rx="0.5" fill="#92400e" opacity="0.4" />
        <Rect x="31" y="25" width="12" height="1.5" rx="0.5" fill="#92400e" opacity="0.4" />
        <Rect x="31" y="30" width="10" height="1.5" rx="0.5" fill="#92400e" opacity="0.4" />
        <Rect x="31" y="35" width="12" height="1.5" rx="0.5" fill="#92400e" opacity="0.4" />
        <SvgText x="27" y="60" fontSize="8" fontWeight="600" fill={primaryColor} textAnchor="middle">
          Brachos
        </SvgText>
      </G>

      {/* Match indicator */}
      <G transform="translate(67, 48)">
        <Circle r="8" fill="white" />
        <SvgText x="0" y="4" fontSize="10" fontWeight="bold" fill="#22c55e" textAnchor="middle">
          ✓
        </SvgText>
      </G>

      {/* Another Seder card - Moed */}
      <G transform="translate(145, 12)">
        <Rect width="55" height="55" rx="6" fill="white" />
        {/* Book stack */}
        <Rect x="10" y="18" width="35" height="8" rx="2" fill="#f59e0b" />
        <Rect x="8" y="28" width="39" height="8" rx="2" fill="#0891b2" />
        <SvgText x="27" y="15" fontSize="9" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          מועד
        </SvgText>
        <SvgText x="27" y="48" fontSize="7" fontWeight="600" fill="#64748b" textAnchor="middle">
          Moed
        </SvgText>
      </G>

      {/* Flipped masechta card */}
      <G transform="translate(145, 75)">
        <Rect width="55" height="50" rx="6" fill={accentColor} opacity="0.7" />
        <Circle cx="27" cy="25" r="12" fill={primaryColor} opacity="0.3" />
        <SvgText x="27" y="30" fontSize="14" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          ?
        </SvgText>
      </G>

      {/* Title banner */}
      <G transform="translate(10, 100)">
        <Rect x="0" y="0" width="130" height="32" rx="8" fill="white" opacity="0.95" />
        <SvgText x="65" y="15" fontSize="12" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Mishnayos Match
        </SvgText>
        <SvgText x="65" y="27" fontSize="9" fill="#64748b" textAnchor="middle">
          Sedarim & Masechtos
        </SvgText>
      </G>

      {/* Sparkles */}
      <Circle cx="125" cy="10" r="2" fill="white" opacity="0.8" />
      <Circle cx="175" cy="115" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default MishnayosMatchIllustration;
