import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText, Ellipse } from 'react-native-svg';

interface HolidaysTrueFalseIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function HolidaysTrueFalseIllustration({
  width,
  height,
  primaryColor = '#ea580c',
  secondaryColor = '#f97316',
  accentColor = '#fdba74',
}: HolidaysTrueFalseIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="holidayTFBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="220" height="140" fill="url(#holidayTFBg)" />

      <Circle cx="200" cy="120" r="14" fill="white" opacity="0.1" />
      <Circle cx="20" cy="20" r="10" fill="white" opacity="0.15" />

      {/* Holiday symbols */}
      <G transform="translate(20, 15)">
        {/* Menorah */}
        <Rect x="25" y="45" width="30" height="4" rx="2" fill={accentColor} />
        <Rect x="38" y="20" width="4" height="25" fill={accentColor} />
        <Circle cx="40" cy="15" r="5" fill="#fde047" />
        <Rect x="20" y="30" width="3" height="15" fill={accentColor} />
        <Circle cx="21" cy="26" r="4" fill="#fde047" />
        <Rect x="57" y="30" width="3" height="15" fill={accentColor} />
        <Circle cx="58" cy="26" r="4" fill="#fde047" />

        {/* Lulav hint */}
        <Path d="M75 25 L80 50" stroke="#84cc16" strokeWidth="3" strokeLinecap="round" />
        <Ellipse cx="72" cy="52" rx="5" ry="4" fill="#fde047" />
      </G>

      {/* True button */}
      <G transform="translate(115, 15)">
        <Rect x="0" y="0" width="80" height="32" rx="8" fill="#22c55e" />
        <Path d="M22 16 L30 24 L48 6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <SvgText x="40" y="28" fontSize="7" fontWeight="bold" fill="white" textAnchor="middle">TRUE</SvgText>
      </G>

      {/* False button */}
      <G transform="translate(115, 52)">
        <Rect x="0" y="0" width="80" height="32" rx="8" fill="#ef4444" />
        <Path d="M27 6 L48 24 M48 6 L27 24" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
        <SvgText x="40" y="28" fontSize="7" fontWeight="bold" fill="white" textAnchor="middle">FALSE</SvgText>
      </G>

      {/* Sparkles */}
      <Circle cx="105" cy="40" r="3" fill={accentColor} opacity="0.9" />
      <Circle cx="205" cy="45" r="2" fill="white" opacity="0.8" />

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        {/* Banner background */}
        <Rect x="-40" y="-12" width="80" height="24" rx="12" fill="white" opacity="0.95" />
        {/* Title text */}
        <SvgText x="0" y="4" fontSize="13" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Holidays
        </SvgText>
      </G>
    </Svg>
  );
}

export default HolidaysTrueFalseIllustration;
