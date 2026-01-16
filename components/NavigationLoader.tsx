import { View, Platform } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

interface NavigationLoaderProps {
  visible: boolean;
  gameTitle?: string;
}

export function NavigationLoader({ visible }: NavigationLoaderProps) {
  const isWeb = Platform.OS === 'web';

  // Ring pulse animation
  const ring1Scale = useSharedValue(0.8);
  const ring1Opacity = useSharedValue(0.6);
  const ring2Scale = useSharedValue(0.8);
  const ring2Opacity = useSharedValue(0.4);

  // Center dot animation
  const dotScale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      // Pulsing rings
      ring1Scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1000, easing: Easing.out(Easing.ease) }),
          withTiming(0.8, { duration: 1000, easing: Easing.in(Easing.ease) })
        ),
        -1,
        true
      );

      ring1Opacity.value = withRepeat(
        withSequence(
          withTiming(0.2, { duration: 1000, easing: Easing.out(Easing.ease) }),
          withTiming(0.6, { duration: 1000, easing: Easing.in(Easing.ease) })
        ),
        -1,
        true
      );

      ring2Scale.value = withDelay(
        500,
        withRepeat(
          withSequence(
            withTiming(1.4, { duration: 1000, easing: Easing.out(Easing.ease) }),
            withTiming(0.9, { duration: 1000, easing: Easing.in(Easing.ease) })
          ),
          -1,
          true
        )
      );

      ring2Opacity.value = withDelay(
        500,
        withRepeat(
          withSequence(
            withTiming(0.1, { duration: 1000, easing: Easing.out(Easing.ease) }),
            withTiming(0.3, { duration: 1000, easing: Easing.in(Easing.ease) })
          ),
          -1,
          true
        )
      );

      // Subtle dot pulse
      dotScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.95, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [visible]);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring1Scale.value }],
    opacity: ring1Opacity.value,
  }));

  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring2Scale.value }],
    opacity: ring2Opacity.value,
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  if (!visible) return null;

  const size = isWeb ? 60 : 48;

  return (
    <Animated.View
      entering={FadeIn.duration(50)}
      exiting={FadeOut.duration(80)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(248, 250, 252, 0.97)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Outer ring */}
      <Animated.View
        style={[
          ring2Style,
          {
            position: 'absolute',
            width: size * 1.8,
            height: size * 1.8,
            borderRadius: size * 0.9,
            borderWidth: 2,
            borderColor: '#0d9488',
          },
        ]}
      />

      {/* Inner ring */}
      <Animated.View
        style={[
          ring1Style,
          {
            position: 'absolute',
            width: size * 1.3,
            height: size * 1.3,
            borderRadius: size * 0.65,
            borderWidth: 2,
            borderColor: '#0d9488',
          },
        ]}
      />

      {/* Center dot */}
      <Animated.View
        style={[
          dotStyle,
          {
            width: size * 0.35,
            height: size * 0.35,
            borderRadius: size * 0.175,
            backgroundColor: '#0d9488',
          },
        ]}
      />
    </Animated.View>
  );
}

export default NavigationLoader;
