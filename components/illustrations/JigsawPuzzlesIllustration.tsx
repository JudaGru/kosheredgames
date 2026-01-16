import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

interface JigsawPuzzlesIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function JigsawPuzzlesIllustration({
  width,
  height,
  primaryColor = '#059669',
  secondaryColor = '#6ee7b7',
  accentColor = '#fde047',
  title,
}: JigsawPuzzlesIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="jigsawBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#ecfdf5" />
          <Stop offset="100%" stopColor="#d1fae5" />
        </LinearGradient>
        <LinearGradient id="pieceGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#jigsawBg)" />

      {/* Decorative elements */}
      <Circle cx="15" cy="15" r="8" fill={primaryColor} opacity="0.12" />
      <Circle cx="205" cy="125" r="12" fill={primaryColor} opacity="0.1" />
      <Circle cx="200" cy="20" r="5" fill={accentColor} opacity="0.25" />
      <Circle cx="25" cy="125" r="6" fill="#0ea5e9" opacity="0.15" />

      {/* Puzzle piece 1 - Top Left (connected) */}
      <G transform="translate(35, 20)">
        {/* Shadow */}
        <Path
          d="M 2 2 L 42 2 L 42 22 C 42 22 47 22 47 27 C 47 32 42 32 42 32 L 42 52 L 22 52 C 22 52 22 57 17 57 C 12 57 12 52 12 52 L 2 52 L 2 32 C 2 32 -3 32 -3 27 C -3 22 2 22 2 22 Z"
          fill="#000"
          opacity="0.08"
        />
        {/* Piece */}
        <Path
          d="M 0 0 L 40 0 L 40 20 C 40 20 45 20 45 25 C 45 30 40 30 40 30 L 40 50 L 20 50 C 20 50 20 55 15 55 C 10 55 10 50 10 50 L 0 50 L 0 30 C 0 30 -5 30 -5 25 C -5 20 0 20 0 20 Z"
          fill="white"
          stroke={primaryColor}
          strokeWidth="2"
        />
        {/* Inner design */}
        <Rect x="8" y="8" width="24" height="20" rx="3" fill={secondaryColor} opacity="0.4" />
        <SvgText x="20" y="22" fontSize="14" textAnchor="middle" fill={primaryColor}>
          🏛️
        </SvgText>
      </G>

      {/* Puzzle piece 2 - Top Right (connected) */}
      <G transform="translate(80, 20)">
        {/* Shadow */}
        <Path
          d="M 2 2 L 42 2 L 42 52 L 22 52 C 22 52 22 57 17 57 C 12 57 12 52 12 52 L 2 52 L 2 32 C 2 32 7 32 7 27 C 7 22 2 22 2 22 Z"
          fill="#000"
          opacity="0.08"
        />
        {/* Piece */}
        <Path
          d="M 0 0 L 40 0 L 40 50 L 20 50 C 20 50 20 55 15 55 C 10 55 10 50 10 50 L 0 50 L 0 30 C 0 30 5 30 5 25 C 5 20 0 20 0 20 Z"
          fill="white"
          stroke={primaryColor}
          strokeWidth="2"
        />
        {/* Inner design */}
        <Rect x="8" y="8" width="24" height="20" rx="3" fill={secondaryColor} opacity="0.4" />
        <SvgText x="20" y="22" fontSize="14" textAnchor="middle" fill={primaryColor}>
          ⭐
        </SvgText>
      </G>

      {/* Puzzle piece 3 - Bottom Left (connected) */}
      <G transform="translate(35, 70)">
        {/* Shadow */}
        <Path
          d="M 2 2 L 12 2 C 12 2 12 -3 17 -3 C 22 -3 22 2 22 2 L 42 2 L 42 22 C 42 22 47 22 47 27 C 47 32 42 32 42 32 L 42 52 L 2 52 L 2 32 C 2 32 -3 32 -3 27 C -3 22 2 22 2 22 Z"
          fill="#000"
          opacity="0.08"
        />
        {/* Piece */}
        <Path
          d="M 0 0 L 10 0 C 10 0 10 -5 15 -5 C 20 -5 20 0 20 0 L 40 0 L 40 20 C 40 20 45 20 45 25 C 45 30 40 30 40 30 L 40 50 L 0 50 L 0 30 C 0 30 -5 30 -5 25 C -5 20 0 20 0 20 Z"
          fill="white"
          stroke={primaryColor}
          strokeWidth="2"
        />
        {/* Inner design */}
        <Rect x="8" y="8" width="24" height="20" rx="3" fill={secondaryColor} opacity="0.4" />
        <SvgText x="20" y="22" fontSize="14" textAnchor="middle" fill={primaryColor}>
          🕎
        </SvgText>
      </G>

      {/* Puzzle piece 4 - Floating/dragging piece */}
      <G transform="translate(140, 55) rotate(15)">
        {/* Glow effect */}
        <Path
          d="M -3 -3 L 47 -3 L 47 57 L -3 57 Z"
          fill={accentColor}
          opacity="0.2"
        />
        {/* Shadow */}
        <Path
          d="M 4 4 L 14 4 C 14 4 14 -1 19 -1 C 24 -1 24 4 24 4 L 44 4 L 44 54 L 4 54 L 4 34 C 4 34 9 34 9 29 C 9 24 4 24 4 24 Z"
          fill="#000"
          opacity="0.15"
        />
        {/* Piece */}
        <Path
          d="M 0 0 L 10 0 C 10 0 10 -5 15 -5 C 20 -5 20 0 20 0 L 40 0 L 40 50 L 0 50 L 0 30 C 0 30 5 30 5 25 C 5 20 0 20 0 20 Z"
          fill="white"
          stroke={accentColor}
          strokeWidth="2.5"
        />
        {/* Inner design */}
        <Rect x="8" y="8" width="24" height="20" rx="3" fill={accentColor} opacity="0.3" />
        <SvgText x="20" y="22" fontSize="14" textAnchor="middle" fill="#d97706">
          ✡️
        </SvgText>
      </G>

      {/* Movement indicator lines */}
      <Path
        d="M 132 75 Q 138 70 145 68"
        stroke={accentColor}
        strokeWidth="2"
        strokeDasharray="4,3"
        fill="none"
        opacity="0.6"
      />
      <Circle cx="128" cy="78" r="2" fill={accentColor} opacity="0.8" />

      {/* Sparkles around floating piece */}
      <Circle cx="180" cy="45" r="3" fill={accentColor} opacity="0.9" />
      <Circle cx="195" cy="65" r="2" fill="#fff" opacity="0.9" />
      <Circle cx="175" cy="100" r="2.5" fill={secondaryColor} opacity="0.8" />

      {/* Small decorative pieces scattered */}
      <Circle cx="15" cy="70" r="4" fill={primaryColor} opacity="0.15" />
      <Circle cx="205" cy="75" r="3" fill="#8b5cf6" opacity="0.2" />

      {/* Title */}
      {title && (
        <G transform="translate(110, 115)">
          <Rect
            x="-35"
            y="-12"
            width="70"
            height="24"
            rx="12"
            fill="white"
            opacity="0.95"
          />
          <SvgText
            x="0"
            y="4"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            fill={primaryColor}
          >
            {title}
          </SvgText>
        </G>
      )}
    </Svg>
  );
}

export default JigsawPuzzlesIllustration;
