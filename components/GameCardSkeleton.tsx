import { View, Platform } from 'react-native';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export function GameCardSkeleton() {
  const isWeb = Platform.OS === 'web';
  const opacity = useRef(new Animated.Value(0.4)).current;

  // Card dimensions - match GameCard (rectangular on desktop, square on mobile)
  const cardWidth = isWeb ? 220 : 120;
  const cardHeight = isWeb ? 140 : 120;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        opacity,
        width: cardWidth,
        height: cardHeight,
      }}
      className="rounded-xl bg-slate-200 overflow-hidden"
    >
      {/* Simple shimmer effect */}
      <View className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200" />
    </Animated.View>
  );
}

export default GameCardSkeleton;
