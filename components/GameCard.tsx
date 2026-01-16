import { Pressable, View, Text, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { GameIllustration } from './illustrations';
import type { Game } from '@/types/game';

interface GameCardProps {
  game: Game;
  onPress?: () => void;
}

export function GameCard({ game, onPress }: GameCardProps) {
  const isWeb = Platform.OS === 'web';

  // Card dimensions - rectangular on desktop (16:10 ratio), square on mobile
  const cardWidth = isWeb ? 220 : 120;
  const cardHeight = isWeb ? 140 : 120;

  // Animation values
  const playButtonOpacity = useSharedValue(0);

  const handleHoverIn = () => {
    if (!isWeb) return;
    playButtonOpacity.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.cubic) });
  };

  const handleHoverOut = () => {
    if (!isWeb) return;
    playButtonOpacity.value = withTiming(0, { duration: 150 });
  };

  const playButtonStyle = useAnimatedStyle(() => ({
    opacity: playButtonOpacity.value,
  }));

  return (
    <View
      style={{
        width: cardWidth,
        height: cardHeight,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
      }}
    >
      <Pressable
        onPress={onPress}
        {...(isWeb
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

        {/* Age Badge */}
        <View
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.6)',
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: 'white', fontSize: 10, fontWeight: '500' }}>
            {game.ageRange}
          </Text>
        </View>

        {/* Play button overlay on hover */}
        {isWeb && (
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
    </View>
  );
}

export default GameCard;
