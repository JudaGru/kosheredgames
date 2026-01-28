import { Pressable, View, Text } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { GameIllustration } from './illustrations';
import { useDeviceType } from '@/hooks/useDeviceType';
import type { Game } from '@/types/game';

interface GameCardProps {
  game: Game;
  onPress?: () => void;
  animationIndex?: number;
  animationKey?: number;
}

export function GameCard({ game, onPress, animationIndex = 0, animationKey = 0 }: GameCardProps) {
  const { isWeb, isMobile } = useDeviceType();
  const isComingSoon = game.comingSoon === true;

  // Card dimensions - rectangular on desktop (16:10 ratio), square on mobile
  const cardWidth = isMobile ? 120 : 220;
  const cardHeight = isMobile ? 120 : 140;

  // Animation values
  const playButtonOpacity = useSharedValue(0);

  // Entrance animation values
  const entranceProgress = useSharedValue(0);

  // Staggered entrance animation - re-triggers when animationKey changes
  useEffect(() => {
    // Reset to 0 first, then animate to 1
    entranceProgress.value = 0;

    // Calculate delay with a cap so bottom cards don't take forever
    // First 12 cards (roughly 2 rows) get staggered delays
    // After that, all cards animate together with max delay
    const MAX_DELAY = 400; // Maximum delay in ms
    const STAGGER = 30; // 30ms between cards (faster stagger)
    const delay = Math.min(animationIndex * STAGGER, MAX_DELAY);

    entranceProgress.value = withDelay(
      delay,
      withSpring(1, {
        damping: 14,
        stiffness: 120,
        mass: 0.7,
      })
    );
  }, [animationIndex, animationKey]);

  const entranceStyle = useAnimatedStyle(() => {
    const scale = interpolate(entranceProgress.value, [0, 1], [0.8, 1]);
    const opacity = interpolate(entranceProgress.value, [0, 0.5, 1], [0, 0.8, 1]);
    const translateY = interpolate(entranceProgress.value, [0, 1], [20, 0]);

    return {
      opacity,
      transform: [
        { scale },
        { translateY },
      ],
    };
  });

  // Only show hover effects on desktop web (not mobile web)
  const showHoverEffects = isWeb && !isMobile;

  const handleHoverIn = () => {
    if (!showHoverEffects) return;
    playButtonOpacity.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.cubic) });
  };

  const handleHoverOut = () => {
    if (!showHoverEffects) return;
    playButtonOpacity.value = withTiming(0, { duration: 150 });
  };

  const playButtonStyle = useAnimatedStyle(() => ({
    opacity: playButtonOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        entranceStyle,
        {
          width: cardWidth,
          height: cardHeight,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
        },
      ]}
    >
      <Pressable
        onPress={isComingSoon ? undefined : onPress}
        {...(showHoverEffects && !isComingSoon
          ? {
              onMouseEnter: handleHoverIn,
              onMouseLeave: handleHoverOut,
            }
          : {})}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 12,
          overflow: 'hidden',
          opacity: isComingSoon ? 0.7 : 1,
        }}
      >
        {/* SVG Illustration - full card */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <GameIllustration
            gameType={game.gameType}
            topic={game.topic}
            title={game.title}
            gameId={game.id}
            width={cardWidth}
            height={cardHeight}
          />
        </View>

        {/* Coming Soon or Age Badge */}
        <View
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: isComingSoon ? '#f59e0b' : 'rgba(0,0,0,0.6)',
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
            {isComingSoon ? 'Coming Soon' : game.ageRange}
          </Text>
        </View>

        {/* Play button overlay on hover - desktop only */}
        {showHoverEffects && (
          <Animated.View
            style={[
              playButtonStyle,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.35)',
                borderRadius: 12,
              },
            ]}
            pointerEvents="none"
          >
            <View
              style={{
                backgroundColor: 'white',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Text style={{ fontSize: 16 }}>▶</Text>
              <Text style={{ color: '#1e293b', fontWeight: '600', fontSize: 13 }}>
                Play
              </Text>
            </View>
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
}

export default GameCard;
