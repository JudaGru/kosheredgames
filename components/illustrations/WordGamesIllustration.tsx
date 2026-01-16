import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

interface WordGamesIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function WordGamesIllustration({
  width,
  height,
  primaryColor = '#0369a1',
  secondaryColor = '#38bdf8',
  accentColor = '#fde047',
}: WordGamesIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="wordBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#wordBg)" />

      {/* Decorative elements */}
      <Circle cx="200" cy="120" r="14" fill="white" opacity="0.1" />
      <Circle cx="20" cy="20" r="10" fill="white" opacity="0.15" />

      {/* Letter tiles - horizontal row */}
      {/* Letter ש */}
      <G transform="translate(20, 35)">
        <Rect width="38" height="45" rx="5" fill="white" />
        <SvgText x="19" y="32" fontSize="24" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          ש
        </SvgText>
        <Circle cx="30" cy="39" r="4" fill={accentColor} />
        <SvgText x="30" y="42" fontSize="6" fontWeight="bold" fill="white" textAnchor="middle">
          3
        </SvgText>
      </G>

      {/* Letter ל */}
      <G transform="translate(62, 35)">
        <Rect width="38" height="45" rx="5" fill="white" />
        <SvgText x="19" y="32" fontSize="24" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          ל
        </SvgText>
        <Circle cx="30" cy="39" r="4" fill={accentColor} />
        <SvgText x="30" y="42" fontSize="6" fontWeight="bold" fill="white" textAnchor="middle">
          2
        </SvgText>
      </G>

      {/* Letter ו */}
      <G transform="translate(104, 35)">
        <Rect width="38" height="45" rx="5" fill="white" />
        <SvgText x="19" y="32" fontSize="24" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          ו
        </SvgText>
        <Circle cx="30" cy="39" r="4" fill={accentColor} />
        <SvgText x="30" y="42" fontSize="6" fontWeight="bold" fill="white" textAnchor="middle">
          1
        </SvgText>
      </G>

      {/* Letter ם - highlighted as current */}
      <G transform="translate(146, 35)">
        <Rect width="38" height="45" rx="5" fill="#fef9c3" stroke={accentColor} strokeWidth="2" />
        <SvgText x="19" y="32" fontSize="24" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          ם
        </SvgText>
        <Circle cx="30" cy="39" r="4" fill={accentColor} />
        <SvgText x="30" y="42" fontSize="6" fontWeight="bold" fill="white" textAnchor="middle">
          4
        </SvgText>
      </G>

      {/* Word search grid hint - bottom row */}
      <G transform="translate(20, 90)">
        <Rect width="165" height="35" rx="6" fill="white" opacity="0.9" />
        {/* Grid cells */}
        <Rect x="8" y="6" width="24" height="24" rx="3" fill={secondaryColor} opacity="0.4" />
        <Rect x="36" y="6" width="24" height="24" rx="3" fill={secondaryColor} opacity="0.4" />
        <Rect x="64" y="6" width="24" height="24" rx="3" fill={secondaryColor} opacity="0.4" />
        <Rect x="92" y="6" width="24" height="24" rx="3" fill="#f1f5f9" />
        <Rect x="120" y="6" width="24" height="24" rx="3" fill="#f1f5f9" />
      </G>

      {/* Pencil icon */}
      <G transform="translate(195, 95)">
        <Path
          d="M0 18 L3 0 L12 0 L15 18 Z"
          fill={accentColor}
        />
        <Path
          d="M6 0 L9 0 L7.5 -8 Z"
          fill="#fef9c3"
        />
      </G>

      {/* Sparkles */}
      <Circle cx="12" cy="70" r="2" fill="white" opacity="0.6" />
      <Circle cx="208" cy="45" r="3" fill={accentColor} opacity="0.8" />
    </Svg>
  );
}

export default WordGamesIllustration;
