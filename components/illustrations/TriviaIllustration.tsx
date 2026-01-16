import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

interface TriviaIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function TriviaIllustration({
  width,
  height,
  primaryColor = '#0891b2',
  secondaryColor = '#67e8f9',
  accentColor = '#fde047',
}: TriviaIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="triviaBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#triviaBg)" />

      {/* Decorative circles */}
      <Circle cx="200" cy="20" r="12" fill="white" opacity="0.15" />
      <Circle cx="20" cy="120" r="16" fill="white" opacity="0.1" />

      {/* Question mark bubble */}
      <G transform="translate(20, 20)">
        <Circle cx="35" cy="35" r="32" fill="white" />
        <SvgText
          x="35"
          y="48"
          fontSize="38"
          fontWeight="bold"
          fill={primaryColor}
          textAnchor="middle"
        >
          ?
        </SvgText>
      </G>

      {/* Answer options - 2x2 grid */}
      {/* Option A */}
      <G transform="translate(95, 15)">
        <Rect width="55" height="26" rx="6" fill="white" />
        <Circle cx="14" cy="13" r="7" fill={primaryColor} />
        <SvgText x="14" y="17" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle">
          A
        </SvgText>
        <Rect x="26" y="9" width="22" height="4" rx="2" fill="#e2e8f0" />
        <Rect x="26" y="15" width="15" height="3" rx="1.5" fill="#e2e8f0" />
      </G>

      {/* Option B - correct */}
      <G transform="translate(158, 15)">
        <Rect width="55" height="26" rx="6" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" />
        <Circle cx="14" cy="13" r="7" fill="#22c55e" />
        <SvgText x="14" y="17" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle">
          B
        </SvgText>
        <Rect x="26" y="9" width="22" height="4" rx="2" fill="#86efac" />
        <Rect x="26" y="15" width="15" height="3" rx="1.5" fill="#86efac" />
      </G>

      {/* Option C */}
      <G transform="translate(95, 48)">
        <Rect width="55" height="26" rx="6" fill="white" />
        <Circle cx="14" cy="13" r="7" fill={primaryColor} />
        <SvgText x="14" y="17" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle">
          C
        </SvgText>
        <Rect x="26" y="9" width="22" height="4" rx="2" fill="#e2e8f0" />
        <Rect x="26" y="15" width="15" height="3" rx="1.5" fill="#e2e8f0" />
      </G>

      {/* Option D */}
      <G transform="translate(158, 48)">
        <Rect width="55" height="26" rx="6" fill="white" />
        <Circle cx="14" cy="13" r="7" fill={primaryColor} />
        <SvgText x="14" y="17" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle">
          D
        </SvgText>
        <Rect x="26" y="9" width="22" height="4" rx="2" fill="#e2e8f0" />
        <Rect x="26" y="15" width="15" height="3" rx="1.5" fill="#e2e8f0" />
      </G>

      {/* Progress bar at bottom */}
      <G transform="translate(95, 90)">
        <Rect width="118" height="8" rx="4" fill="white" opacity="0.3" />
        <Rect width="70" height="8" rx="4" fill="white" />
      </G>

      {/* Score indicator */}
      <G transform="translate(95, 108)">
        <Rect width="45" height="20" rx="10" fill={accentColor} />
        <SvgText x="22" y="14" fontSize="10" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          3/5
        </SvgText>
      </G>

      {/* Sparkles */}
      <Circle cx="205" cy="85" r="3" fill={accentColor} />
      <Circle cx="85" cy="25" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default TriviaIllustration;
