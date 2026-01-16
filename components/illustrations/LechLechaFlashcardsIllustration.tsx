import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

interface LechLechaFlashcardsIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function LechLechaFlashcardsIllustration({
  width,
  height,
  primaryColor = '#0284c7',
  secondaryColor = '#7dd3fc',
  accentColor = '#fde047',
}: LechLechaFlashcardsIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="lechLechaFlashBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background gradient */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#lechLechaFlashBg)" />

      {/* Desert dunes */}
      <Path
        d="M0 110 Q30 95, 60 110 T120 105 T180 115 T220 100 L220 140 L0 140 Z"
        fill="#d4a574"
        opacity="0.3"
      />
      <Path
        d="M0 120 Q40 105, 80 118 T160 115 T220 120 L220 140 L0 140 Z"
        fill="#c9956c"
        opacity="0.25"
      />

      {/* Stars (Hashem's promise) */}
      <Circle cx="15" cy="15" r="2.5" fill="white" opacity="0.9" />
      <Circle cx="40" cy="25" r="1.5" fill="white" opacity="0.6" />
      <Circle cx="65" cy="10" r="2" fill="white" opacity="0.7" />
      <Circle cx="95" cy="20" r="1.5" fill="white" opacity="0.5" />
      <Circle cx="125" cy="8" r="2" fill="white" opacity="0.8" />
      <Circle cx="155" cy="18" r="1.5" fill="white" opacity="0.6" />
      <Circle cx="185" cy="12" r="2" fill="white" opacity="0.7" />
      <Circle cx="205" cy="22" r="1.5" fill="white" opacity="0.5" />
      <Circle cx="30" cy="40" r="1" fill="white" opacity="0.4" />
      <Circle cx="175" cy="35" r="1" fill="white" opacity="0.4" />

      {/* Moon (night journey) */}
      <G transform="translate(195, 35)">
        <Circle r="12" fill={accentColor} opacity="0.9" />
        <Circle cx="4" cy="-3" r="10" fill={primaryColor} />
      </G>

      {/* Tent (Avraham's home) */}
      <G transform="translate(25, 80)">
        <Path
          d="M0 0 L-18 25 L18 25 Z"
          fill="#92400e"
        />
        <Path
          d="M0 0 L-12 25 L0 20 L12 25 Z"
          fill="#78350f"
        />
        {/* Tent opening */}
        <Path
          d="M-3 25 L0 15 L3 25"
          fill="#451a03"
        />
      </G>

      {/* Camel silhouette (journey) */}
      <G transform="translate(180, 90)">
        <Path
          d="M-12 0 Q-10 -8, -5 -8 L0 -8 Q5 -10, 8 -5 Q12 -5, 15 0 L15 8 L12 8 L12 15 L10 15 L10 8 L5 8 L5 15 L3 15 L3 8 L-8 8 L-8 15 L-10 15 L-10 8 L-12 8 Z"
          fill="#78350f"
          opacity="0.6"
        />
        {/* Hump */}
        <Path
          d="M0 -8 Q2 -15, 5 -8"
          fill="#78350f"
          opacity="0.6"
        />
      </G>

      {/* Vertical flashcard - Question side (front) */}
      <G transform="translate(55, 20)">
        <Rect width="58" height="72" rx="10" fill="white" />
        <SvgText x="29" y="22" fontSize="7" fill="#64748b" textAnchor="middle">Question:</SvgText>
        <SvgText x="29" y="36" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">Where did</SvgText>
        <SvgText x="29" y="48" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">Hashem tell</SvgText>
        <SvgText x="29" y="60" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">Avram to go?</SvgText>
        <Rect x="9" y="64" width="40" height="3" rx="1.5" fill="#e2e8f0" />
      </G>

      {/* Vertical flashcard - Answer side (back) */}
      <G transform="translate(118, 24) rotate(3)">
        <Rect width="52" height="65" rx="10" fill={accentColor} />
        <SvgText x="26" y="18" fontSize="7" fill={primaryColor} opacity="0.7" textAnchor="middle">Answer:</SvgText>
        <SvgText x="26" y="34" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">To the land</SvgText>
        <SvgText x="26" y="46" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">He would</SvgText>
        <SvgText x="26" y="58" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">show him</SvgText>
      </G>

      {/* Checkmark badge */}
      <G transform="translate(195, 75)">
        <Circle r="10" fill={accentColor} />
        <Path
          d="M-4 0 L-1 3 L4 -3"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </G>

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        <Rect x="-48" y="-12" width="96" height="24" rx="12" fill="white" opacity="0.95" />
        <SvgText x="0" y="4" fontSize="11" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Lech Lecha
        </SvgText>
      </G>

      {/* Extra sparkle decorations */}
      <Circle cx="12" cy="115" r="3" fill="white" opacity="0.5" />
      <Circle cx="208" cy="55" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default LechLechaFlashcardsIllustration;
