import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

interface SequencingIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function SequencingIllustration({
  width,
  height,
  primaryColor = '#7c3aed',
  secondaryColor = '#a78bfa',
  accentColor = '#fde047',
}: SequencingIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="seqBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#seqBg)" />

      {/* Decorative circles */}
      <Circle cx="200" cy="20" r="12" fill="white" opacity="0.15" />
      <Circle cx="20" cy="120" r="16" fill="white" opacity="0.1" />

      {/* Numbered cards in sequence */}
      {/* Card 1 */}
      <G transform="translate(20, 35)">
        <Rect width="40" height="50" rx="8" fill="white" />
        <Circle cx="20" cy="18" r="12" fill={primaryColor} />
        <SvgText x="20" y="23" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
          1
        </SvgText>
        <Rect x="8" y="36" width="24" height="4" rx="2" fill="#e2e8f0" />
      </G>

      {/* Arrow */}
      <Path d="M65 60 L75 60 M72 55 L78 60 L72 65" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Card 2 */}
      <G transform="translate(85, 35)">
        <Rect width="40" height="50" rx="8" fill="white" />
        <Circle cx="20" cy="18" r="12" fill={primaryColor} />
        <SvgText x="20" y="23" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
          2
        </SvgText>
        <Rect x="8" y="36" width="24" height="4" rx="2" fill="#e2e8f0" />
      </G>

      {/* Arrow */}
      <Path d="M130 60 L140 60 M137 55 L143 60 L137 65" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Card 3 */}
      <G transform="translate(150, 35)">
        <Rect width="40" height="50" rx="8" fill="white" />
        <Circle cx="20" cy="18" r="12" fill={primaryColor} />
        <SvgText x="20" y="23" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
          3
        </SvgText>
        <Rect x="8" y="36" width="24" height="4" rx="2" fill="#e2e8f0" />
      </G>

      {/* Dragging indicator - card being moved */}
      <G transform="translate(160, 95) rotate(-8)">
        <Rect width="35" height="30" rx="6" fill={accentColor} opacity="0.9" />
        <Circle cx="17.5" cy="10" r="8" fill={primaryColor} />
        <SvgText x="17.5" y="14" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">
          ?
        </SvgText>
      </G>

      {/* Hand cursor icon */}
      <G transform="translate(185, 110)">
        <Path
          d="M8 0 L8 12 M8 12 L4 16 M8 12 L12 16"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx="8" cy="0" r="3" fill="white" />
      </G>

      {/* Sparkles */}
      <Circle cx="205" cy="75" r="3" fill={accentColor} />
      <Circle cx="15" cy="25" r="2" fill="white" opacity="0.7" />
    </Svg>
  );
}

export default SequencingIllustration;
