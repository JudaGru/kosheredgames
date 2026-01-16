import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

interface MatchingIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function MatchingIllustration({
  width,
  height,
  primaryColor = '#0d9488',
  secondaryColor = '#5eead4',
  accentColor = '#22c55e',
}: MatchingIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="matchBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#f0fdfa" />
          <Stop offset="100%" stopColor="#ccfbf1" />
        </LinearGradient>
        <LinearGradient id="cardGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#matchBg)" />

      {/* Decorative elements - representing the 12 tribes */}
      <Circle cx="15" cy="15" r="8" fill={primaryColor} opacity="0.12" />
      <Circle cx="205" cy="125" r="12" fill={primaryColor} opacity="0.1" />
      <Circle cx="200" cy="20" r="5" fill={accentColor} opacity="0.2" />
      <Circle cx="25" cy="125" r="6" fill="#0ea5e9" opacity="0.15" />

      {/* Card 1 - Left (Lion/Yehuda) */}
      <G transform="translate(20, 25)">
        {/* Card shadow */}
        <Rect width="52" height="65" rx="7" fill="#000" opacity="0.08" transform="translate(2, 2)" />
        {/* Card background */}
        <Rect width="52" height="65" rx="7" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
        {/* Symbol background */}
        <Rect x="6" y="6" width="40" height="36" rx="4" fill="#d1fae5" opacity="0.6" />
        {/* Lion emoji representation */}
        <SvgText
          x="26"
          y="32"
          fontSize="24"
          textAnchor="middle"
          fill={accentColor}
        >
          🦁
        </SvgText>
        {/* Hebrew text bar */}
        <Rect x="10" y="48" width="32" height="5" rx="2.5" fill="#22c55e" opacity="0.7" />
        <Rect x="14" y="56" width="24" height="3" rx="1.5" fill="#e2e8f0" />
      </G>

      {/* Card 2 - Center (Lion/Yehuda - matching) */}
      <G transform="translate(84, 25)">
        {/* Glow effect for matched card */}
        <Rect 
          width="56" 
          height="69" 
          rx="8" 
          fill={accentColor} 
          opacity="0.2" 
          transform="translate(-2, -2)" 
        />
        {/* Card shadow */}
        <Rect width="52" height="65" rx="7" fill="#000" opacity="0.08" transform="translate(2, 2)" />
        {/* Card background with glow */}
        <Rect width="52" height="65" rx="7" fill="white" stroke={accentColor} strokeWidth="2.5" />
        {/* Symbol background */}
        <Rect x="6" y="6" width="40" height="36" rx="4" fill="#d1fae5" opacity="0.8" />
        {/* Lion emoji - same as card 1 */}
        <SvgText
          x="26"
          y="32"
          fontSize="24"
          textAnchor="middle"
          fill={accentColor}
        >
          🦁
        </SvgText>
        {/* Hebrew text bar */}
        <Rect x="10" y="48" width="32" height="5" rx="2.5" fill="#22c55e" opacity="0.7" />
        <Rect x="14" y="56" width="24" height="3" rx="1.5" fill="#e2e8f0" />
      </G>

      {/* Card 3 - Right (Face down) */}
      <G transform="translate(148, 35)">
        {/* Card shadow */}
        <Rect width="50" height="50" rx="7" fill="#000" opacity="0.08" transform="translate(2, 2)" />
        {/* Card background */}
        <Rect width="50" height="50" rx="7" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
        {/* Teal pattern background */}
        <Rect x="5" y="5" width="40" height="40" rx="4" fill="url(#cardGlow)" />
        {/* Decorative border */}
        <Rect x="8" y="8" width="34" height="34" rx="3" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
        {/* Question mark */}
        <SvgText
          x="25"
          y="32"
          fontSize="20"
          fontWeight="900"
          textAnchor="middle"
          fill="white"
        >
          ?
        </SvgText>
      </G>

      {/* Match sparkles and connection */}
      <Circle cx="73" cy="55" r="3" fill={accentColor} opacity="0.8" />
      <Circle cx="73" cy="55" r="6" fill={accentColor} opacity="0.3" />
      <Circle cx="83" cy="48" r="2.5" fill="#fde047" opacity="0.9" />
      <Circle cx="63" cy="62" r="2" fill="#fde047" opacity="0.8" />
      
      {/* Connection line between matching cards */}
      <Path
        d="M 72 57 Q 78 57 84 57"
        stroke={accentColor}
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />

      {/* Small tribal symbols scattered */}
      <Circle cx="110" cy="105" r="4" fill="#0ea5e9" opacity="0.2" />
      <Circle cx="170" cy="95" r="3" fill="#8b5cf6" opacity="0.2" />
      <Circle cx="45" cy="105" r="3.5" fill="#f59e0b" opacity="0.2" />

      {/* Title - 12 Shevatim */}
      <G transform="translate(110, 115)">
        {/* Title background/shadow */}
        <Rect 
          x="-50" 
          y="-12" 
          width="100" 
          height="24" 
          rx="12" 
          fill="white" 
          opacity="0.9"
        />
        <SvgText
          x="0"
          y="5"
          fontSize="16"
          fontWeight="bold"
          textAnchor="middle"
          fill={primaryColor}
        >
          12 Shevatim
        </SvgText>
      </G>
    </Svg>
  );
}

export default MatchingIllustration;