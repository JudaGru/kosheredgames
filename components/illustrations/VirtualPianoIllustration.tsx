import Svg, { Rect, Circle, G, Defs, LinearGradient, Stop, Text as SvgText, Path, Ellipse } from 'react-native-svg';

interface VirtualPianoIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  title?: string;
}

export function VirtualPianoIllustration({
  width,
  height,
  primaryColor = '#7c3aed',
  secondaryColor = '#a78bfa',
  accentColor = '#fde047',
}: VirtualPianoIllustrationProps) {
  // Piano key colors
  const whiteKeyColor = '#ffffff';
  const blackKeyColor = '#1e1b4b';
  const pressedKeyColor = '#c4b5fd';

  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="pianoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
        <LinearGradient id="pianoBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#292524" />
          <Stop offset="100%" stopColor="#1c1917" />
        </LinearGradient>
        <LinearGradient id="whiteKey" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#ffffff" />
          <Stop offset="100%" stopColor="#e5e7eb" />
        </LinearGradient>
        <LinearGradient id="blackKey" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#374151" />
          <Stop offset="100%" stopColor="#111827" />
        </LinearGradient>
        <LinearGradient id="pressedKey" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#ddd6fe" />
          <Stop offset="100%" stopColor="#c4b5fd" />
        </LinearGradient>
      </Defs>

      {/* Background gradient */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#pianoBg)" />

      {/* Decorative circles */}
      <Circle cx="20" cy="20" r="30" fill="white" opacity="0.08" />
      <Circle cx="200" cy="120" r="25" fill="white" opacity="0.06" />
      <Circle cx="180" cy="25" r="12" fill="white" opacity="0.1" />

      {/* Musical notes floating above piano */}
      {/* Note 1 - eighth note */}
      <G transform="translate(35, 22)">
        <Ellipse cx="0" cy="8" rx="5" ry="4" fill="white" opacity="0.9" />
        <Rect x="4" y="-12" width="2" height="20" fill="white" opacity="0.9" />
        <Path d="M6,-12 Q12,-8 6,-4" stroke="white" strokeWidth="2" fill="none" opacity="0.9" />
      </G>

      {/* Note 2 - quarter note */}
      <G transform="translate(175, 18)">
        <Ellipse cx="0" cy="6" rx="4.5" ry="3.5" fill={accentColor} opacity="0.95" />
        <Rect x="4" y="-10" width="2" height="16" fill={accentColor} opacity="0.95" />
      </G>

      {/* Note 3 - small floating note */}
      <G transform="translate(60, 8)">
        <Ellipse cx="0" cy="5" rx="3.5" ry="2.5" fill="white" opacity="0.7" />
        <Rect x="3" y="-6" width="1.5" height="11" fill="white" opacity="0.7" />
      </G>

      {/* Note 4 - double eighth note */}
      <G transform="translate(140, 12)">
        <Ellipse cx="0" cy="8" rx="4" ry="3" fill="white" opacity="0.8" />
        <Ellipse cx="12" cy="8" rx="4" ry="3" fill="white" opacity="0.8" />
        <Rect x="3.5" y="-8" width="1.5" height="16" fill="white" opacity="0.8" />
        <Rect x="11.5" y="-8" width="1.5" height="16" fill="white" opacity="0.8" />
        <Rect x="3.5" y="-8" width="10" height="2" fill="white" opacity="0.8" />
      </G>

      {/* Sparkle effects near notes */}
      <Circle cx="48" cy="15" r="2" fill={accentColor} opacity="0.9" />
      <Circle cx="168" cy="30" r="1.5" fill="white" opacity="0.8" />
      <Circle cx="95" cy="20" r="1.5" fill={accentColor} opacity="0.7" />

      {/* Piano body shadow */}
      <Rect x="18" y="48" width="184" height="75" rx="4" fill="#000" opacity="0.2" />

      {/* Piano body */}
      <Rect x="15" y="45" width="190" height="75" rx="4" fill="url(#pianoBody)" />

      {/* Piano inner frame */}
      <Rect x="20" y="50" width="180" height="65" rx="2" fill="#292524" stroke="#404040" strokeWidth="1" />

      {/* White keys - 10 keys */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
        const keyX = 22 + i * 17.6;
        const isPressed = i === 3 || i === 7; // Two keys appear pressed
        return (
          <G key={`white-${i}`}>
            {/* Key shadow */}
            <Rect
              x={keyX + 1}
              y={53}
              width="16"
              height={isPressed ? "58" : "60"}
              rx="2"
              fill="#000"
              opacity="0.15"
            />
            {/* Key */}
            <Rect
              x={keyX}
              y={52}
              width="16"
              height={isPressed ? "58" : "60"}
              rx="2"
              fill={isPressed ? "url(#pressedKey)" : "url(#whiteKey)"}
              stroke="#d1d5db"
              strokeWidth="0.5"
            />
            {/* Key highlight */}
            <Rect
              x={keyX + 1}
              y={53}
              width="4"
              height="20"
              rx="1"
              fill="white"
              opacity={isPressed ? "0.1" : "0.3"}
            />
          </G>
        );
      })}

      {/* Black keys - positioned between white keys */}
      {[0, 1, 3, 4, 5, 7, 8].map((i, idx) => {
        // Black keys appear after white key indices: 0,1,3,4,5,7,8 (skip 2,6 for the natural note gaps)
        const positions = [0, 1, 3, 4, 5, 7, 8];
        const keyX = 32 + positions[idx] * 17.6;
        const isPressed = idx === 2; // One black key pressed
        return (
          <G key={`black-${idx}`}>
            {/* Key shadow */}
            <Rect
              x={keyX + 1}
              y={52}
              width="11"
              height={isPressed ? "34" : "36"}
              rx="2"
              fill="#000"
              opacity="0.3"
            />
            {/* Key */}
            <Rect
              x={keyX}
              y={51}
              width="11"
              height={isPressed ? "34" : "36"}
              rx="2"
              fill={isPressed ? "#4c1d95" : "url(#blackKey)"}
            />
            {/* Key shine */}
            <Rect
              x={keyX + 1}
              y={52}
              width="3"
              height="15"
              rx="1"
              fill="white"
              opacity="0.15"
            />
          </G>
        );
      })}

      {/* Glow effect on pressed keys */}
      <Circle cx="77" cy="85" r="12" fill={secondaryColor} opacity="0.3" />
      <Circle cx="148" cy="85" r="10" fill={secondaryColor} opacity="0.25" />

      {/* Sound wave visualization at top of piano */}
      <G transform="translate(110, 42)">
        <Path
          d="M-25,0 Q-20,-3 -15,0 Q-10,3 -5,0 Q0,-3 5,0 Q10,3 15,0 Q20,-3 25,0"
          stroke={accentColor}
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />
      </G>

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        <Rect x="-52" y="-12" width="104" height="24" rx="12" fill="white" opacity="0.95" />
        <SvgText x="0" y="4" fontSize="12" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Virtual Piano
        </SvgText>
      </G>

      {/* Extra sparkles */}
      <Circle cx="12" cy="100" r="2.5" fill="white" opacity="0.5" />
      <Circle cx="208" cy="55" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default VirtualPianoIllustration;
