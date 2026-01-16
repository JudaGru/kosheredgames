import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText, Ellipse } from 'react-native-svg';

interface JewishHolidaysOrderIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function JewishHolidaysOrderIllustration({
  width,
  height,
  primaryColor = '#ec4899',
  secondaryColor = '#f472b6',
  accentColor = '#fde047',
}: JewishHolidaysOrderIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="holidaysOrderBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="220" height="140" fill="url(#holidaysOrderBg)" />

      <Circle cx="200" cy="120" r="14" fill="white" opacity="0.1" />
      <Circle cx="20" cy="20" r="10" fill="white" opacity="0.15" />

      {/* Holiday Icons Row 1 */}
      <G transform="translate(20, 15)">
        {/* Apple (Rosh Hashanah) */}
        <Circle cx="20" cy="20" r="15" fill="#dc2626" />
        <Path d="M20 5 L20 10" stroke="#22c55e" strokeWidth="2" />

        {/* Book (Yom Kippur) */}
        <Rect x="50" y="8" width="22" height="26" rx="2" fill="white" />
        <Rect x="53" y="12" width="16" height="2" fill="#94a3b8" />
        <Rect x="53" y="17" width="14" height="2" fill="#94a3b8" />
        <Rect x="53" y="22" width="16" height="2" fill="#94a3b8" />

        {/* Lulav (Sukkos) */}
        <Path d="M100 35 L100 10" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
        <Ellipse cx="95" cy="30" rx="6" ry="5" fill={accentColor} />

        {/* Menorah (Chanukah) */}
        <Rect x="130" y="25" width="20" height="3" rx="1" fill={accentColor} />
        <Rect x="138" y="12" width="3" height="13" fill={accentColor} />
        <Circle cx="140" cy="10" r="4" fill={accentColor} />
      </G>

      {/* Holiday Icons Row 2 */}
      <G transform="translate(20, 55)">
        {/* Mask (Purim) */}
        <Ellipse cx="20" cy="15" rx="15" ry="12" fill="#a855f7" />
        <Circle cx="13" cy="12" r="4" fill="white" />
        <Circle cx="27" cy="12" r="4" fill="white" />
        <Circle cx="13" cy="12" r="2" fill="#1e293b" />
        <Circle cx="27" cy="12" r="2" fill="#1e293b" />

        {/* Wine cup (Pesach) */}
        <Path d="M55 5 L50 30 L70 30 L65 5 Z" fill="#7c3aed" />
        <Ellipse cx="60" cy="5" rx="7" ry="3" fill="#7c3aed" />

        {/* Fire (Lag B'Omer) */}
        <Path d="M100 30 Q95 15 100 10 Q105 15 100 30" fill="#f97316" />
        <Path d="M100 30 Q97 20 100 15 Q103 20 100 30" fill={accentColor} />

        {/* Mountain (Shavuos) */}
        <Path d="M125 30 L140 8 L155 30 Z" fill="#6b7280" />
        <Path d="M140 8 L140 0" stroke={accentColor} strokeWidth="2" />
      </G>

      {/* Arrow showing order */}
      <Path d="M175 45 L195 45 M190 40 L195 45 L190 50" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Title banner */}
      <G transform="translate(10, 105)">
        <Rect x="0" y="0" width="120" height="28" rx="6" fill="white" opacity="0.95" />
        <SvgText x="60" y="12" fontSize="10" fontWeight="bold" fill={primaryColor} textAnchor="middle">Jewish Holidays</SvgText>
        <SvgText x="60" y="23" fontSize="8" fill="#64748b" textAnchor="middle">Put in Order</SvgText>
      </G>
    </Svg>
  );
}

export default JewishHolidaysOrderIllustration;
