import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

interface ShavuosFlashcardsIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function ShavuosFlashcardsIllustration({
  width,
  height,
  primaryColor = '#0284c7',
  secondaryColor = '#7dd3fc',
  accentColor = '#fde047',
}: ShavuosFlashcardsIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="shavuosFlashBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background gradient */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#shavuosFlashBg)" />

      {/* Mountain (Har Sinai) */}
      <Path
        d="M0 140 L40 70 L80 100 L110 50 L140 100 L180 75 L220 140 Z"
        fill="white"
        opacity="0.1"
      />
      <Path
        d="M0 140 L60 90 L110 70 L160 95 L220 140 Z"
        fill="white"
        opacity="0.08"
      />

      {/* Clouds around the mountain */}
      <G opacity="0.15">
        <Circle cx="30" cy="80" r="15" fill="white" />
        <Circle cx="50" cy="75" r="12" fill="white" />
        <Circle cx="180" cy="85" r="14" fill="white" />
        <Circle cx="195" cy="80" r="10" fill="white" />
      </G>

      {/* Luchos (Tablets) on the mountain */}
      <G transform="translate(175, 45)">
        <Rect x="-22" y="-20" width="20" height="28" rx="3" fill={accentColor} />
        <Rect x="2" y="-20" width="20" height="28" rx="3" fill={accentColor} />
        {/* Text lines on luchos */}
        <Rect x="-18" y="-14" width="12" height="2" rx="1" fill={primaryColor} opacity="0.6" />
        <Rect x="-18" y="-8" width="12" height="2" rx="1" fill={primaryColor} opacity="0.6" />
        <Rect x="-18" y="-2" width="12" height="2" rx="1" fill={primaryColor} opacity="0.6" />
        <Rect x="6" y="-14" width="12" height="2" rx="1" fill={primaryColor} opacity="0.6" />
        <Rect x="6" y="-8" width="12" height="2" rx="1" fill={primaryColor} opacity="0.6" />
        <Rect x="6" y="-2" width="12" height="2" rx="1" fill={primaryColor} opacity="0.6" />
      </G>

      {/* Lightning bolts (Matan Torah) */}
      <Path
        d="M25 10 L30 25 L25 25 L28 40"
        stroke={accentColor}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M195 15 L190 28 L195 28 L192 42"
        stroke={accentColor}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Flowers and greenery (Shavuos decoration) */}
      <G transform="translate(15, 95)">
        <Path d="M0 15 Q5 10, 0 5 Q-5 10, 0 15" fill="#22c55e" />
        <Circle cx="0" cy="3" r="4" fill="#f472b6" />
      </G>
      <G transform="translate(30, 100)">
        <Path d="M0 12 Q4 8, 0 4 Q-4 8, 0 12" fill="#22c55e" />
        <Circle cx="0" cy="2" r="3" fill="#fbbf24" />
      </G>
      <G transform="translate(190, 98)">
        <Path d="M0 12 Q4 8, 0 4 Q-4 8, 0 12" fill="#22c55e" />
        <Circle cx="0" cy="2" r="3" fill="#f472b6" />
      </G>

      {/* Vertical flashcard - Question side (front) */}
      <G transform="translate(45, 18)">
        <Rect width="62" height="78" rx="10" fill="white" />
        <SvgText x="31" y="24" fontSize="7" fill="#64748b" textAnchor="middle">Question:</SvgText>
        <SvgText x="31" y="38" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">What did we</SvgText>
        <SvgText x="31" y="50" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">receive at</SvgText>
        <SvgText x="31" y="62" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">Har Sinai?</SvgText>
        <Rect x="11" y="68" width="40" height="4" rx="2" fill="#e2e8f0" />
      </G>

      {/* Vertical flashcard - Answer side (back) */}
      <G transform="translate(115, 22) rotate(3)">
        <Rect width="58" height="72" rx="10" fill={accentColor} />
        <SvgText x="29" y="22" fontSize="7" fill={primaryColor} opacity="0.7" textAnchor="middle">Answer:</SvgText>
        <SvgText x="29" y="40" fontSize="10" fontWeight="bold" fill={primaryColor} textAnchor="middle">The Torah</SvgText>
        <SvgText x="29" y="54" fontSize="9" fill={primaryColor} textAnchor="middle">תורה</SvgText>
        <Rect x="7" y="60" width="44" height="4" rx="2" fill={primaryColor} opacity="0.3" />
      </G>

      {/* Stars (night of Matan Torah) */}
      <Circle cx="55" cy="8" r="2" fill="white" opacity="0.7" />
      <Circle cx="90" cy="12" r="1.5" fill="white" opacity="0.5" />
      <Circle cx="130" cy="6" r="2" fill="white" opacity="0.6" />
      <Circle cx="165" cy="10" r="1.5" fill="white" opacity="0.5" />

      {/* Checkmark badge */}
      <G transform="translate(195, 95)">
        <Circle r="11" fill={accentColor} />
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
        <Rect x="-45" y="-12" width="90" height="24" rx="12" fill="white" opacity="0.95" />
        <SvgText x="0" y="4" fontSize="12" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Shavuos
        </SvgText>
      </G>

      {/* Extra sparkle decorations */}
      <Circle cx="12" cy="118" r="3" fill="white" opacity="0.5" />
      <Circle cx="208" cy="118" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default ShavuosFlashcardsIllustration;
