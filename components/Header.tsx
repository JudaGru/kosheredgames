import { useIsMobileLayout } from '@/hooks/useDeviceType';
import { FontAwesome } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

export type AgeFilter = 'all' | '3-5' | '6-8' | '9-12' | '13+';

interface HeaderProps {
  selectedAge: AgeFilter;
  onAgeChange: (age: AgeFilter) => void;
}

// Full wordmark logo that spells "AlephPlay" with play button integrated
function LogoWordmark({ height = 40 }: { height?: number }) {
  const width = height * 5.5;
  return (
    <Svg width={width} height={height} viewBox="0 0 220 40">
      <Defs>
        {/* Main gradient for text - smoother transition */}
        <LinearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#0d9488" />
          <Stop offset="40%" stopColor="#0891b2" />
          <Stop offset="100%" stopColor="#0284c7" />
        </LinearGradient>
        {/* Play button gradient */}
        <LinearGradient id="playGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#14b8a6" />
          <Stop offset="50%" stopColor="#0ea5e9" />
          <Stop offset="100%" stopColor="#0284c7" />
        </LinearGradient>
        {/* Subtle glow/shadow for depth */}
        <LinearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
          <Stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Play button - outer glow ring */}
      <Circle cx="20" cy="20" r="19" fill="none" stroke="#0ea5e9" strokeWidth="1" opacity="0.4" />

      {/* Play button circle */}
      <Circle cx="20" cy="20" r="17" fill="url(#playGrad)" />

      {/* Play triangle - slightly rounded feel */}
      <Path
        d="M15 12 L29 20 L15 28 Z"
        fill="white"
        opacity="0.95"
      />

      {/* "Aleph" text */}
      <SvgText
        x="44"
        y="28"
        fontSize="25"
        fontWeight="bold"
        fill="url(#textGrad)"
        fontFamily="System"
        letterSpacing="0.5"
      >
        Aleph
      </SvgText>

      {/* "Play" text */}
      <SvgText
        x="116"
        y="28"
        fontSize="25"
        fontWeight="bold"
        fill="url(#textGrad)"
        fontFamily="System"
        letterSpacing="0.5"
      >
      Play
      </SvgText>

    </Svg>
  );
}

const ageFilters: { value: AgeFilter; label: string }[] = [
  { value: 'all', label: 'All Ages' },
  { value: '3-5', label: '3-5' },
  { value: '6-8', label: '6-8' },
  { value: '9-12', label: '9-12' },
  { value: '13+', label: '13+' },
];

export function Header({ selectedAge, onAgeChange }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { isMobile } = useIsMobileLayout();

  return (
    <View
      style={{ paddingTop: isMobile ? insets.top + 8 : 16 }}
    >
      {/* Top row: Logo, Tagline (centered), Age Filter and Search */}
      <View className="flex-row items-center justify-between px-4 pb-2">
        {/* Logo */}
        <LogoWordmark height={isMobile ? 36 : 44} />

        {/* Centered tagline - only on desktop */}
        {!isMobile && (
          <View className="flex-row items-center bg-white/60 px-3 py-1.5 rounded-full border border-slate-200">
            <FontAwesome name="check-circle" size={12} color="#10b981" />
            <Text className="text-slate-600 text-xs font-medium ml-1.5">Educational</Text>
            <Text className="text-slate-300 mx-2">|</Text>
            <FontAwesome name="gamepad" size={12} color="#0ea5e9" />
            <Text className="text-slate-600 text-xs font-medium ml-1.5">Fun</Text>
            <Text className="text-slate-300 mx-2">|</Text>
            <FontAwesome name="heart" size={12} color="#f472b6" />
            <Text className="text-slate-600 text-xs font-medium ml-1.5">Ad Free</Text>
          </View>
        )}

        {/* Age Filter */}
        <View className="flex-row items-center bg-white/60 rounded-full border border-slate-200 p-1">
          {ageFilters.map((filter) => (
            <Pressable
              key={filter.value}
              onPress={() => onAgeChange(filter.value)}
              className={`px-3 py-1.5 rounded-full ${
                selectedAge === filter.value
                  ? 'bg-teal-500'
                  : ''
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  selectedAge === filter.value
                    ? 'text-white'
                    : 'text-slate-600'
                }`}
              >
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

export default Header;
