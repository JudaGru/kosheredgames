import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

interface JewishHistoryTriviaIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function JewishHistoryTriviaIllustration({
  width,
  height,
  primaryColor = '#0891b2',
  secondaryColor = '#67e8f9',
  accentColor = '#fde047',
}: JewishHistoryTriviaIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="historyBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#historyBg)" />

      {/* Decorative circles */}
      <Circle cx="200" cy="20" r="12" fill="white" opacity="0.15" />
      <Circle cx="15" cy="125" r="10" fill="white" opacity="0.1" />

      {/* Ancient scroll on left */}
      <G transform="translate(15, 25)">
        {/* Scroll body */}
        <Rect x="8" y="5" width="50" height="70" rx="3" fill="#fef3c7" />
        {/* Top roller */}
        <Rect x="0" y="0" width="66" height="10" rx="5" fill={accentColor} />
        {/* Bottom roller */}
        <Rect x="0" y="70" width="66" height="10" rx="5" fill={accentColor} />
        {/* Text lines on scroll */}
        <Rect x="14" y="18" width="38" height="3" rx="1.5" fill="#d97706" opacity="0.5" />
        <Rect x="14" y="26" width="38" height="3" rx="1.5" fill="#d97706" opacity="0.5" />
        <Rect x="14" y="34" width="30" height="3" rx="1.5" fill="#d97706" opacity="0.5" />
        <Rect x="14" y="42" width="38" height="3" rx="1.5" fill="#d97706" opacity="0.5" />
        <Rect x="14" y="50" width="25" height="3" rx="1.5" fill="#d97706" opacity="0.5" />
        <Rect x="14" y="58" width="38" height="3" rx="1.5" fill="#d97706" opacity="0.5" />
      </G>

      {/* Kotel/Temple stones */}
      <G transform="translate(155, 70)">
        <Rect x="0" y="0" width="50" height="55" fill="#f5f5f4" rx="2" />
        {/* Stone lines */}
        <Rect x="2" y="5" width="22" height="10" rx="1" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="0.5" />
        <Rect x="26" y="5" width="22" height="10" rx="1" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="0.5" />
        <Rect x="2" y="18" width="15" height="10" rx="1" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="0.5" />
        <Rect x="19" y="18" width="15" height="10" rx="1" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="0.5" />
        <Rect x="36" y="18" width="12" height="10" rx="1" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="0.5" />
        <Rect x="2" y="31" width="22" height="10" rx="1" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="0.5" />
        <Rect x="26" y="31" width="22" height="10" rx="1" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="0.5" />
        <Rect x="2" y="44" width="15" height="8" rx="1" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="0.5" />
        <Rect x="19" y="44" width="15" height="8" rx="1" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="0.5" />
        <Rect x="36" y="44" width="12" height="8" rx="1" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="0.5" />
      </G>

      {/* Question card */}
      <G transform="translate(90, 15)">
        <Rect width="60" height="45" rx="8" fill="white" />
        <SvgText
          x="30"
          y="30"
          fontSize="28"
          fontWeight="bold"
          fill={primaryColor}
          textAnchor="middle"
        >
          ?
        </SvgText>
      </G>

      {/* Answer options */}
      <G transform="translate(90, 68)">
        {/* Option A */}
        <Rect x="0" y="0" width="28" height="22" rx="5" fill="white" />
        <Circle cx="14" cy="11" r="6" fill={primaryColor} />
        <SvgText x="14" y="14" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">
          A
        </SvgText>
      </G>

      <G transform="translate(122, 68)">
        {/* Option B - correct */}
        <Rect x="0" y="0" width="28" height="22" rx="5" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" />
        <Circle cx="14" cy="11" r="6" fill="#22c55e" />
        <SvgText x="14" y="14" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">
          B
        </SvgText>
      </G>

      <G transform="translate(90, 94)">
        {/* Option C */}
        <Rect x="0" y="0" width="28" height="22" rx="5" fill="white" />
        <Circle cx="14" cy="11" r="6" fill={primaryColor} />
        <SvgText x="14" y="14" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">
          C
        </SvgText>
      </G>

      <G transform="translate(122, 94)">
        {/* Option D */}
        <Rect x="0" y="0" width="28" height="22" rx="5" fill="white" />
        <Circle cx="14" cy="11" r="6" fill={primaryColor} />
        <SvgText x="14" y="14" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">
          D
        </SvgText>
      </G>

      {/* Star of David small icon */}
      <G transform="translate(170, 20)">
        <Path
          d="M12 0 L14.5 5 L20 5 L15.5 9 L17.5 15 L12 11 L6.5 15 L8.5 9 L4 5 L9.5 5 Z"
          fill={accentColor}
          opacity="0.9"
        />
      </G>

      {/* Sparkles */}
      <Circle cx="85" cy="50" r="2" fill="white" opacity="0.7" />
      <Circle cx="155" cy="65" r="2" fill={accentColor} opacity="0.8" />

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        {/* Banner background */}
        <Rect x="-55" y="-12" width="110" height="24" rx="12" fill="white" opacity="0.95" />
        {/* Title text */}
        <SvgText x="0" y="4" fontSize="12" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Jewish History
        </SvgText>
      </G>
    </Svg>
  );
}

export default JewishHistoryTriviaIllustration;
