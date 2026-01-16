import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText, Ellipse } from 'react-native-svg';

interface PurimFlashcardsIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function PurimFlashcardsIllustration({
  width,
  height,
  primaryColor = '#0284c7',
  secondaryColor = '#7dd3fc',
  accentColor = '#fde047',
}: PurimFlashcardsIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="purimFlashBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>

      {/* Background gradient */}
      <Rect x="0" y="0" width="220" height="140" fill="url(#purimFlashBg)" />

      {/* Festive confetti/streamers background */}
      <Path d="M10 20 Q20 40, 15 60" stroke="#f472b6" strokeWidth="2" fill="none" opacity="0.4" />
      <Path d="M200 30 Q190 50, 205 70" stroke="#a78bfa" strokeWidth="2" fill="none" opacity="0.4" />
      <Path d="M180 10 Q170 30, 185 45" stroke={accentColor} strokeWidth="2" fill="none" opacity="0.5" />

      {/* Crown (Esther HaMalka) */}
      <G transform="translate(25, 35)">
        <Path
          d="M-15 10 L-15 0 L-8 8 L0 -5 L8 8 L15 0 L15 10 Z"
          fill={accentColor}
        />
        <Rect x="-15" y="10" width="30" height="6" fill={accentColor} />
        <Circle cx="-8" cy="2" r="2" fill="#ef4444" />
        <Circle cx="0" cy="-2" r="2.5" fill="#3b82f6" />
        <Circle cx="8" cy="2" r="2" fill="#22c55e" />
      </G>

      {/* Megillah scroll */}
      <G transform="translate(180, 70)">
        <Rect x="-20" y="-25" width="40" height="50" fill="#fef3c7" />
        <Circle cx="-20" cy="-25" r="5" fill="#92400e" />
        <Circle cx="-20" cy="25" r="5" fill="#92400e" />
        <Circle cx="20" cy="-25" r="5" fill="#92400e" />
        <Circle cx="20" cy="25" r="5" fill="#92400e" />
        {/* Text lines */}
        <Rect x="-14" y="-18" width="28" height="2" rx="1" fill="#92400e" opacity="0.4" />
        <Rect x="-14" y="-12" width="28" height="2" rx="1" fill="#92400e" opacity="0.4" />
        <Rect x="-14" y="-6" width="28" height="2" rx="1" fill="#92400e" opacity="0.4" />
        <Rect x="-14" y="0" width="28" height="2" rx="1" fill="#92400e" opacity="0.4" />
        <Rect x="-14" y="6" width="28" height="2" rx="1" fill="#92400e" opacity="0.4" />
        <Rect x="-14" y="12" width="20" height="2" rx="1" fill="#92400e" opacity="0.4" />
      </G>

      {/* Hamantasch */}
      <G transform="translate(25, 90)">
        <Path
          d="M0 -12 L12 10 L-12 10 Z"
          fill="#d97706"
        />
        <Ellipse cx="0" cy="2" rx="5" ry="4" fill="#7c2d12" />
      </G>

      {/* Gragger (noisemaker) */}
      <G transform="translate(185, 115)">
        <Rect x="-6" y="-8" width="12" height="16" rx="2" fill={accentColor} />
        <Rect x="-2" y="8" width="4" height="12" fill="#92400e" />
        <Circle cx="0" cy="0" r="3" fill={primaryColor} opacity="0.5" />
      </G>

      {/* Stars and sparkles */}
      <Circle cx="50" cy="15" r="2" fill="white" opacity="0.7" />
      <Circle cx="90" cy="25" r="1.5" fill="white" opacity="0.5" />
      <Circle cx="150" cy="12" r="2" fill="white" opacity="0.6" />
      <Circle cx="170" cy="25" r="1.5" fill="white" opacity="0.4" />

      {/* Vertical flashcard - Question side (front) */}
      <G transform="translate(55, 20)">
        <Rect width="60" height="75" rx="10" fill="white" />
        <SvgText x="30" y="22" fontSize="7" fill="#64748b" textAnchor="middle">Question:</SvgText>
        <SvgText x="30" y="36" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">Who was the</SvgText>
        <SvgText x="30" y="48" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">Jewish queen</SvgText>
        <SvgText x="30" y="60" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle">of Persia?</SvgText>
        <Rect x="10" y="66" width="40" height="4" rx="2" fill="#e2e8f0" />
      </G>

      {/* Vertical flashcard - Answer side (back) */}
      <G transform="translate(120, 25) rotate(4)">
        <Rect width="55" height="68" rx="10" fill={accentColor} />
        <SvgText x="27" y="20" fontSize="7" fill={primaryColor} opacity="0.7" textAnchor="middle">Answer:</SvgText>
        <SvgText x="27" y="38" fontSize="10" fontWeight="bold" fill={primaryColor} textAnchor="middle">Esther</SvgText>
        <SvgText x="27" y="52" fontSize="9" fill={primaryColor} textAnchor="middle">אסתר</SvgText>
        <Rect x="6" y="56" width="42" height="4" rx="2" fill={primaryColor} opacity="0.3" />
      </G>

      {/* Checkmark badge */}
      <G transform="translate(195, 45)">
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
        <Rect x="-40" y="-12" width="80" height="24" rx="12" fill="white" opacity="0.95" />
        <SvgText x="0" y="4" fontSize="12" fontWeight="bold" fill={primaryColor} textAnchor="middle">
          Purim
        </SvgText>
      </G>

      {/* Extra confetti dots */}
      <Circle cx="15" cy="115" r="4" fill="#f472b6" opacity="0.6" />
      <Circle cx="205" cy="8" r="3" fill="#a78bfa" opacity="0.5" />
      <Circle cx="45" cy="105" r="3" fill={accentColor} opacity="0.5" />
    </Svg>
  );
}

export default PurimFlashcardsIllustration;
