import { FontAwesome } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

interface HeaderProps {
  onSearchPress?: () => void;
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

export function Header({ onSearchPress }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  return (
    <View
      style={{ paddingTop: isWeb ? 16 : insets.top + 8 }}
    >
      {/* Top row: Logo, badges, and Search */}
      <View className="flex-row items-center justify-between px-4 pb-4">
        {/* Logo and badges grouped together */}
        <View className="flex-row items-center">
          <LogoWordmark height={isWeb ? 44 : 36} />

          {/* Three feature badges */}
          <View className="flex-row items-center gap-2 ml-4">
            <View className="flex-row items-center bg-amber-50 px-3 py-1.5 rounded-full">
              <FontAwesome name="star" size={12} color="#d97706" />
              <Text className="text-amber-700 text-xs font-medium ml-1.5">Torah Learning Made Fun</Text>
            </View>
            <View className="flex-row items-center bg-teal-50 px-3 py-1.5 rounded-full">
              <FontAwesome name="plus-circle" size={12} color="#0d9488" />
              <Text className="text-teal-700 text-xs font-medium ml-1.5">New games weekly</Text>
            </View>
            <View className="flex-row items-center bg-sky-50 px-3 py-1.5 rounded-full">
              <FontAwesome name="book" size={12} color="#0284c7" />
              <Text className="text-sky-700 text-xs font-medium ml-1.5">100% Educational</Text>
            </View>
          </View>
        </View>

        {/* Search Button */}
        <Pressable
          onPress={onSearchPress}
          className="bg-teal-50 w-11 h-11 rounded-2xl items-center justify-center active:bg-teal-100"
        >
          <FontAwesome name="search" size={18} color="#0d9488" />
        </Pressable>
      </View>
    </View>
  );
}

export default Header;
