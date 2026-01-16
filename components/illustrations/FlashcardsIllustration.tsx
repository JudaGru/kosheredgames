import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

interface FlashcardsIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function FlashcardsIllustration({
  width,
  height,
  primaryColor = '#0284c7',
  secondaryColor = '#7dd3fc',
  accentColor = '#fde047',
}: FlashcardsIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="flashBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#flashBg)" />

      {/* Decorative elements */}
      <Circle cx="20" cy="120" r="10" fill="white" opacity="0.15" />
      <Circle cx="200" cy="20" r="14" fill="white" opacity="0.1" />

      {/* Stack of cards - back cards */}
      <G transform="translate(45, 25) rotate(-5, 55, 45)">
        <Rect width="110" height="70" rx="8" fill="white" opacity="0.5" />
      </G>
      <G transform="translate(45, 25) rotate(-2, 55, 45)">
        <Rect width="110" height="70" rx="8" fill="white" opacity="0.7" />
      </G>

      {/* Main flashcard - front */}
      <G transform="translate(45, 25)">
        <Rect width="110" height="70" rx="8" fill="white" />

        {/* Hebrew letter Alef */}
        <SvgText
          x="55"
          y="45"
          fontSize="30"
          fontWeight="bold"
          fill={primaryColor}
          textAnchor="middle"
        >
          א
        </SvgText>

        {/* Underline */}
        <Rect x="25" y="55" width="60" height="3" rx="1.5" fill="#e2e8f0" />
      </G>

      {/* Flip arrow */}
      <G transform="translate(175, 85)">
        <Circle r="14" fill="white" />
        <Path
          d="M-5 0 L0 -5 L5 0 M0 -5 L0 5"
          stroke={primaryColor}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          transform="rotate(180)"
        />
      </G>

      {/* Sparkles */}
      <Circle cx="170" cy="35" r="3" fill={accentColor} />
      <Circle cx="35" cy="20" r="2" fill="white" opacity="0.6" />

      {/* Check mark for correct */}
      <G transform="translate(145, 50)">
        <Circle r="12" fill={accentColor} />
        <Path
          d="M-4 0 L-1 3 L4 -3"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </G>
    </Svg>
  );
}

export default FlashcardsIllustration;
