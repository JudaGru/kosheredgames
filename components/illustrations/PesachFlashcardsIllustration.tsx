import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

interface PesachFlashcardsIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function PesachFlashcardsIllustration({
  width,
  height,
  primaryColor = '#0284c7',
  secondaryColor = '#7dd3fc',
  accentColor = '#fde047',
}: PesachFlashcardsIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="pesachFlashBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background gradient */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#pesachFlashBg)" />

      {/* Decorative waves (Red Sea theme) */}
      <Path
        d="M0 100 Q30 90, 60 100 T120 100 T180 100 T220 100 L220 140 L0 140 Z"
        fill="white"
        opacity="0.08"
      />
      <Path
        d="M0 110 Q25 100, 50 110 T100 110 T150 110 T200 110 T220 110 L220 140 L0 140 Z"
        fill="white"
        opacity="0.05"
      />

      {/* Stars in the night sky (leaving Egypt at night) */}
      <Circle cx="15" cy="18" r="2" fill="white" opacity="0.7" />
      <Circle cx="40" cy="30" r="1.5" fill="white" opacity="0.5" />
      <Circle cx="65" cy="12" r="2" fill="white" opacity="0.6" />
      <Circle cx="95" cy="22" r="1.5" fill="white" opacity="0.4" />
      <Circle cx="180" cy="15" r="2" fill="white" opacity="0.5" />

      {/* Moon (Pesach is on 15th of Nissan - full moon) */}
      <G transform="translate(195, 30)">
        <Circle r="14" fill={accentColor} opacity="0.3" />
        <Circle r="10" fill={accentColor} />
      </G>

      {/* Matzah illustration */}
      <G transform="translate(165, 65)">
        <Rect x="-18" y="-12" width="36" height="24" rx="3" fill="#f5e6c8" />
        <Circle cx="-10" cy="-4" r="2" fill="#d4c4a8" />
        <Circle cx="0" cy="2" r="2" fill="#d4c4a8" />
        <Circle cx="10" cy="-2" r="2" fill="#d4c4a8" />
        <Circle cx="-5" cy="6" r="2" fill="#d4c4a8" />
        <Circle cx="8" cy="5" r="2" fill="#d4c4a8" />
      </G>

      {/* Wine cup (Kos) */}
      <G transform="translate(25, 70)">
        <Path
          d="M-8 -15 L-6 5 Q-6 10, 0 10 Q6 10, 6 5 L8 -15 Z"
          fill="#7c2d12"
        />
        <Rect x="-3" y="10" width="6" height="8" fill="#d4af37" />
        <Rect x="-8" y="18" width="16" height="3" rx="1" fill="#d4af37" />
        <Path
          d="M-6 -12 L-4 2 Q-4 6, 0 6 Q4 6, 4 2 L6 -12 Z"
          fill="#991b1b"
        />
      </G>

      {/* Vertical flashcard - Question side (front) */}
      <G transform="translate(55, 15)">
        <Rect width="65" height="82" rx="10" fill="white" />
        <SvgText x="32" y="26" fontSize="7" fill="#64748b" textAnchor="middle">Question:</SvgText>
        <SvgText x="32" y="40" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">How many</SvgText>
        <SvgText x="32" y="52" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">cups of wine</SvgText>
        <SvgText x="32" y="64" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">at the Seder?</SvgText>
        <Rect x="12" y="72" width="40" height="4" rx="2" fill="#e2e8f0" />
      </G>

      {/* Vertical flashcard - Answer side (back) */}
      <G transform="translate(125, 20) rotate(4)">
        <Rect width="60" height="75" rx="10" fill={accentColor} />
        <SvgText x="30" y="24" fontSize="7" fill={primaryColor} opacity="0.7" textAnchor="middle">Answer:</SvgText>
        <SvgText x="30" y="42" fontSize="11" fontWeight="bold" fill={primaryColor} textAnchor="middle">Four</SvgText>
        <SvgText x="30" y="56" fontSize="9" fill={primaryColor} textAnchor="middle">ארבע כוסות</SvgText>
        <Rect x="8" y="62" width="44" height="4" rx="2" fill={primaryColor} opacity="0.3" />
      </G>

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

      {/* Sparkle effects */}
      <Circle cx="50" cy="105" r="3" fill="white" opacity="0.5" />
      <Circle cx="145" cy="8" r="2" fill="white" opacity="0.6" />

      {/* Title banner at bottom */}
      <G transform="translate(110, 118)">
        <Rect x="-45" y="-12" width="90" height="24" rx="12" fill="white" opacity="0.95" />
        <SvgText x="0" y="4" fontSize="12" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Pesach
        </SvgText>
      </G>

      {/* Extra decorations */}
      <Circle cx="12" cy="118" r="3" fill="white" opacity="0.5" />
      <Circle cx="208" cy="115" r="2" fill="white" opacity="0.6" />
    </Svg>
  );
}

export default PesachFlashcardsIllustration;
