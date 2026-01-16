import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDeviceType } from '@/hooks/useDeviceType';

// Animals data with Hebrew names including nekudos
const ANIMALS_DATA = [
  { id: 'aryeh', name: 'אַרְיֵה', english: 'Lion', symbol: '🦁', color: '#f59e0b' },
  { id: 'kelev', name: 'כֶּלֶב', english: 'Dog', symbol: '🐕', color: '#8b5cf6' },
  { id: 'chatul', name: 'חָתוּל', english: 'Cat', symbol: '🐱', color: '#ec4899' },
  { id: 'pil', name: 'פִּיל', english: 'Elephant', symbol: '🐘', color: '#64748b' },
  { id: 'sus', name: 'סוּס', english: 'Horse', symbol: '🐴', color: '#92400e' },
  { id: 'parah', name: 'פָּרָה', english: 'Cow', symbol: '🐄', color: '#1e293b' },
  { id: 'tarnegol', name: 'תַּרְנְגוֹל', english: 'Rooster', symbol: '🐓', color: '#dc2626' },
  { id: 'dag', name: 'דָּג', english: 'Fish', symbol: '🐟', color: '#0ea5e9' },
  { id: 'tzipor', name: 'צִפּוֹר', english: 'Bird', symbol: '🐦', color: '#14b8a6' },
  { id: 'arnav', name: 'אַרְנָב', english: 'Rabbit', symbol: '🐰', color: '#f472b6' },
  { id: 'dov', name: 'דֹּב', english: 'Bear', symbol: '🐻', color: '#78716c' },
  { id: 'nachash', name: 'נָחָשׁ', english: 'Snake', symbol: '🐍', color: '#22c55e' },
];

const PLAYER_COLORS = [
  { name: 'Player 1', color: '#f59e0b', bgColor: '#fef3c7', darkColor: '#b45309' },
  { name: 'Player 2', color: '#0ea5e9', bgColor: '#e0f2fe', darkColor: '#075985' },
  { name: 'Player 3', color: '#8b5cf6', bgColor: '#ede9fe', darkColor: '#5b21b6' },
  { name: 'Player 4', color: '#10b981', bgColor: '#d1fae5', darkColor: '#047857' },
];

interface Card {
  id: string;
  animalId: string;
  symbol: string;
  hebrewName: string;
  color: string;
}

interface Player {
  id: number;
  name: string;
  color: string;
  bgColor: string;
  darkColor: string;
  matches: number;
  matchedCardIds: Set<string>;
}

interface CardComponentProps {
  card: Card;
  isFlipped: boolean;
  isMatched: boolean;
  matchedByPlayerId?: number;
  onPress: () => void;
  disabled: boolean;
  cardSize: number;
  index: number;
}

function CardComponent({ card, isFlipped, isMatched, matchedByPlayerId, onPress, disabled, cardSize, index }: CardComponentProps) {
  const flipProgress = useSharedValue(0);
  const scale = useSharedValue(1);
  const matchGlow = useSharedValue(0);
  const entranceAnim = useSharedValue(0);

  useEffect(() => {
    entranceAnim.value = withDelay(
      index * 30,
      withSpring(1, { damping: 12, stiffness: 100 })
    );
  }, [index]);

  useEffect(() => {
    flipProgress.value = withTiming(isFlipped || isMatched ? 1 : 0, {
      duration: 350,
      easing: Easing.out(Easing.cubic),
    });
  }, [isFlipped, isMatched]);

  useEffect(() => {
    if (isMatched) {
      scale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 150 })
      );
      matchGlow.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0.3, { duration: 400 })
      );
    }
  }, [isMatched]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: entranceAnim.value }],
    opacity: entranceAnim.value,
  }));

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${interpolate(flipProgress.value, [0, 1], [0, 180])}deg` },
      { scale: scale.value },
    ],
    opacity: flipProgress.value < 0.5 ? 1 : 0,
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${interpolate(flipProgress.value, [0, 1], [180, 360])}deg` },
      { scale: scale.value },
    ],
    opacity: flipProgress.value >= 0.5 ? 1 : 0,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: matchGlow.value,
  }));

  const margin = cardSize > 60 ? 5 : 3;
  const glowColor = matchedByPlayerId !== undefined ? PLAYER_COLORS[matchedByPlayerId].color : '#f59e0b';

  return (
    <Animated.View style={[containerStyle, { margin }]}>
      <Pressable
        onPress={onPress}
        disabled={disabled || isFlipped || isMatched}
        style={{ width: cardSize, height: cardSize * 1.25 }}
      >
        {/* Match glow effect - colored by player */}
        {isMatched && (
          <Animated.View
            style={[
              glowStyle,
              {
                position: 'absolute',
                top: -4,
                left: -4,
                right: -4,
                bottom: -4,
                borderRadius: 14,
                backgroundColor: glowColor,
              },
            ]}
          />
        )}

        {/* Card Back (face down) */}
        <Animated.View
          style={[
            frontAnimatedStyle,
            {
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: '#f59e0b',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              backfaceVisibility: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
              elevation: 5,
            },
          ]}
        >
          <View
            style={{
              position: 'absolute',
              width: '80%',
              height: '85%',
              borderRadius: 6,
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.3)',
            }}
          />
          <Text style={{ fontSize: cardSize * 0.35, color: 'white' }}>🐾</Text>
        </Animated.View>

        {/* Card Front (content) */}
        <Animated.View
          style={[
            backAnimatedStyle,
            {
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: isMatched ? PLAYER_COLORS[matchedByPlayerId ?? 0].bgColor : 'white',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              backfaceVisibility: 'hidden',
              borderWidth: isMatched ? 3 : 1,
              borderColor: isMatched ? glowColor : '#e2e8f0',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              paddingVertical: 8,
            },
          ]}
        >
          <Text style={{ fontSize: cardSize * 0.45 }}>{card.symbol}</Text>
          <Text
            style={{
              fontSize: cardSize * 0.18,
              fontWeight: 'bold',
              color: card.color,
              textAlign: 'center',
              marginTop: 4,
            }}
          >
            {card.hebrewName}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

// Enhanced Confetti with sparkles and falling effect
function Confetti() {
  const particles = Array.from({ length: 50 }).map((_, i) => {
    const translateY = useSharedValue(-100);
    const translateX = useSharedValue(0);
    const rotate = useSharedValue(0);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0);

    useEffect(() => {
      const randomDelay = Math.random() * 400;
      const randomX = (Math.random() - 0.5) * 200;
      const randomRotation = 360 * (Math.random() > 0.5 ? 2 : -2);
      const fallDuration = 2000 + Math.random() * 1000;

      opacity.value = withDelay(randomDelay, withTiming(1, { duration: 200 }));
      scale.value = withDelay(randomDelay, withSpring(1, { damping: 10 }));

      translateY.value = withDelay(
        randomDelay,
        withTiming(600, { duration: fallDuration, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) })
      );
      translateX.value = withDelay(
        randomDelay,
        withTiming(randomX, { duration: fallDuration, easing: Easing.inOut(Easing.ease) })
      );
      rotate.value = withDelay(
        randomDelay,
        withTiming(randomRotation, { duration: fallDuration, easing: Easing.linear })
      );

      opacity.value = withDelay(
        randomDelay + fallDuration * 0.7,
        withTiming(0, { duration: 600 })
      );
    }, []);

    const animStyle = useAnimatedStyle(() => ({
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { rotate: `${rotate.value}deg` },
        { scale: scale.value }
      ],
      opacity: opacity.value,
    }));

    const emojis = ['✨', '🐾', '⭐', '💫', '🎊', '🦁', '🐰'];
    const emoji = emojis[i % emojis.length];
    const startLeft = 10 + Math.random() * 80;

    return (
      <Animated.View
        key={i}
        style={[
          animStyle,
          {
            position: 'absolute',
            left: `${startLeft}%`,
            top: -50,
          },
        ]}
      >
        <Text style={{ fontSize: 24 + Math.random() * 12 }}>{emoji}</Text>
      </Animated.View>
    );
  });

  return <View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 100 }} pointerEvents="none">{particles}</View>;
}

// Circular progress indicator for player turns
function PlayerIndicator({
  player,
  isActive,
  matchCount,
  position
}: {
  player: Player;
  isActive: boolean;
  matchCount: number;
  position: number;
}) {
  const scale = useSharedValue(0.9);
  const glowOpacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      scale.value = withSpring(1, { damping: 8, stiffness: 150 });
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      rotation.value = withRepeat(
        withTiming(360, { duration: 3000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      scale.value = withSpring(0.9, { damping: 10, stiffness: 150 });
      glowOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isActive]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(300).delay(position * 100)}
      style={[containerStyle, { alignItems: 'center' }]}
    >
      <View style={{ position: 'relative' }}>
        {/* Animated glow ring */}
        {isActive && (
          <Animated.View
            style={[
              glowStyle,
              {
                position: 'absolute',
                width: 64,
                height: 64,
                borderRadius: 32,
                borderWidth: 3,
                borderColor: player.color,
                top: -6,
                left: -6,
              },
            ]}
          />
        )}

        {/* Player circle */}
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: isActive ? player.color : player.bgColor,
            borderWidth: 3,
            borderColor: isActive ? player.darkColor : player.color,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: player.color,
            shadowOffset: { width: 0, height: isActive ? 4 : 2 },
            shadowOpacity: isActive ? 0.4 : 0.2,
            shadowRadius: isActive ? 8 : 4,
            elevation: isActive ? 6 : 3,
          }}
        >
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: isActive ? 'white' : player.darkColor
          }}>
            {matchCount}
          </Text>
        </View>
      </View>

      {/* Player name */}
      <Text
        style={{
          fontSize: 11,
          fontWeight: isActive ? '700' : '600',
          color: isActive ? player.darkColor : '#64748b',
          marginTop: 6,
        }}
      >
        {player.name}
      </Text>
    </Animated.View>
  );
}

// Player option button with hover effect
function PlayerOptionButton({
  playerCount,
  index,
  onPress
}: {
  playerCount: number;
  index: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const shadowIntensity = useSharedValue(0.08);
  const borderColor = useSharedValue(0);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handleHoverIn = () => {
    scale.value = withSpring(1.02, { damping: 12, stiffness: 200 });
    shadowIntensity.value = withTiming(0.18, { duration: 200 });
    borderColor.value = withTiming(1, { duration: 200 });
  };

  const handleHoverOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    shadowIntensity.value = withTiming(0.08, { duration: 200 });
    borderColor.value = withTiming(0, { duration: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    shadowOpacity: shadowIntensity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value === 1 ? '#f59e0b' : '#fde68a',
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(400).delay(index * 120)}
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
      >
        <Animated.View
          style={[
            containerStyle,
            shadowStyle,
            {
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 20,
              borderWidth: 2,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              shadowColor: '#f59e0b',
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 8,
              elevation: 3,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#92400e' }}>
              {playerCount === 1 ? 'Solo' : `${playerCount} Players`}
            </Text>
            <Text style={{ fontSize: 14, color: '#b45309', marginTop: 4 }}>
              {playerCount === 1 ? 'Play by yourself' : `Compete with ${playerCount} players`}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 6 }}>
            {Array(playerCount)
              .fill(0)
              .map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: PLAYER_COLORS[i].color,
                    borderWidth: 2.5,
                    borderColor: 'white',
                    shadowColor: PLAYER_COLORS[i].color,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                />
              ))}
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

// Refined PlayerSetupScreen
function PlayerSetupScreen({ onStartGame }: { onStartGame: (playerCount: number) => void }) {
  const isWeb = Platform.OS === 'web';
  const [backHovered, setBackHovered] = useState(false);

  // Sample animal symbols for the header display
  const displayAnimals = [
    { symbol: '🦁', color: '#f59e0b' },
    { symbol: '🐰', color: '#f472b6' },
    { symbol: '🐘', color: '#64748b' },
    { symbol: '🐍', color: '#22c55e' },
    { symbol: '🐟', color: '#0ea5e9' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: isWeb ? 24 : 16,
          paddingHorizontal: 24,
        }}
      >
        {/* Header Section */}
        <Animated.View
          entering={FadeIn.duration(500)}
          className="items-center"
          style={{ width: '100%', maxWidth: 380, marginBottom: isWeb ? 40 : 24 }}
        >
          {/* Animal symbols row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: isWeb ? 20 : 12,
              gap: isWeb ? 12 : 4,
            }}
          >
            {displayAnimals.map((animal, index) => (
              <Animated.View
                key={index}
                entering={FadeIn.duration(400).delay(100 + index * 80)}
                style={{
                  width: isWeb ? 52 : 40,
                  height: isWeb ? 52 : 40,
                  borderRadius: isWeb ? 26 : 20,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: animal.color,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  elevation: 3,
                  borderWidth: 2,
                  borderColor: animal.color + '30',
                }}
              >
                <Text style={{ fontSize: isWeb ? 24 : 18 }}>{animal.symbol}</Text>
              </Animated.View>
            ))}
          </View>

          {/* Title with styled effect */}
          <View className="items-center">
            <Text
              style={{
                fontSize: isWeb ? 42 : 34,
                fontWeight: '800',
                color: '#b45309',
                letterSpacing: -1,
              }}
            >
              Animals
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 8,
                marginBottom: isWeb ? 16 : 8,
                gap: 8,
              }}
            >
              <View style={{ height: 1, width: 40, backgroundColor: '#fcd34d' }} />
              <Text
                style={{
                  fontSize: 14,
                  color: '#92400e',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: 2
                }}
              >
                Memory Match
              </Text>
              <View style={{ height: 1, width: 40, backgroundColor: '#fcd34d' }} />
            </View>
          </View>
        </Animated.View>

        {/* Player selection section */}
        <Animated.View
          entering={FadeIn.duration(500).delay(300)}
          style={{ width: '100%', maxWidth: 340, gap: 14 }}
        >
          {[1, 2, 3, 4].map((playerCount, index) => (
            <PlayerOptionButton
              key={playerCount}
              playerCount={playerCount}
              index={index}
              onPress={() => onStartGame(playerCount)}
            />
          ))}
        </Animated.View>

        {/* Back button */}
        <Animated.View entering={FadeIn.duration(400).delay(600)}>
          <Pressable
            onPress={() => router.back()}
            onHoverIn={isWeb ? () => setBackHovered(true) : undefined}
            onHoverOut={isWeb ? () => setBackHovered(false) : undefined}
            style={{
              marginTop: isWeb ? 32 : 16,
              paddingVertical: 10,
              paddingHorizontal: 24,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: backHovered ? '#fef3c7' : 'transparent',
              borderRadius: 8,
            }}
          >
            <FontAwesome name="arrow-left" size={14} color={backHovered ? '#92400e' : '#b45309'} />
            <Text style={{ color: backHovered ? '#92400e' : '#b45309', fontWeight: '600', fontSize: 15 }}>Back</Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

// Beautiful victory screen with trophy animation
function VictoryScreen({
  playerCount,
  players,
  playerMatches,
  elapsedTime,
  onPlayAgain,
  onBackToHome
}: {
  playerCount: number;
  players: Player[];
  playerMatches: Map<number, Set<string>>;
  elapsedTime: number;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}) {
  const isWeb = Platform.OS === 'web';
  const trophyScale = useSharedValue(0);
  const trophyRotate = useSharedValue(-180);

  useEffect(() => {
    trophyScale.value = withDelay(
      300,
      withSpring(1, { damping: 8, stiffness: 100 })
    );
    trophyRotate.value = withDelay(
      300,
      withSpring(0, { damping: 10, stiffness: 80 })
    );
  }, []);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: trophyScale.value },
      { rotate: `${trophyRotate.value}deg` }
    ],
  }));

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Confetti />

      <Animated.View
        entering={FadeIn.duration(400).delay(200)}
        className="bg-white rounded-3xl items-center w-full"
        style={{
          maxWidth: 400,
          padding: isWeb ? 48 : 40,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 20 },
          shadowOpacity: 0.4,
          shadowRadius: 30,
          elevation: 15,
        }}
      >
        <Animated.View style={trophyStyle}>
          <Text style={{ fontSize: 72 }}>🏆</Text>
        </Animated.View>

        {playerCount > 1 ? (
          <View className="mt-8 w-full">
            {players
              .sort((a, b) => (playerMatches.get(b.id)?.size ?? 0) - (playerMatches.get(a.id)?.size ?? 0))
              .map((player, idx) => {
                const matchCount = Math.floor((playerMatches.get(player.id)?.size ?? 0) / 2);
                return (
                  <Animated.View
                    key={player.id}
                    entering={FadeIn.duration(400).delay(500 + idx * 150)}
                  >
                    <View
                      style={{
                        backgroundColor: player.bgColor,
                        borderLeftWidth: 5,
                        borderLeftColor: player.color,
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        marginBottom: 12,
                        borderRadius: 12,
                        shadowColor: player.color,
                        shadowOffset: { width: 0, height: idx === 0 ? 4 : 2 },
                        shadowOpacity: idx === 0 ? 0.35 : 0.15,
                        shadowRadius: idx === 0 ? 8 : 4,
                        elevation: idx === 0 ? 6 : 3,
                      }}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                          </Text>
                          <Text style={{ fontWeight: 'bold', color: player.darkColor, fontSize: 17 }}>
                            {player.name}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: player.color }}>
                          {matchCount}
                        </Text>
                      </View>
                    </View>
                  </Animated.View>
                );
              })}
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(400).delay(500)} className="mt-8">
            <View className="items-center bg-amber-50 rounded-2xl py-6 px-8">
              <Text className="text-5xl font-bold text-amber-600">{elapsedTime}</Text>
              <Text className="text-sm text-amber-700 mt-2 uppercase tracking-wide font-semibold">Seconds</Text>
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeIn.duration(400).delay(playerCount > 1 ? 1200 : 800)} style={{ width: '100%' }}>
          <Pressable
            onPress={onPlayAgain}
            style={{
              backgroundColor: '#f59e0b',
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 32,
              marginTop: 32,
              shadowColor: '#f59e0b',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Text className="text-white font-bold text-lg text-center">Play Again</Text>
          </Pressable>

          <Pressable onPress={onBackToHome} className="mt-4 py-3">
            <Text className="text-slate-500 font-semibold text-base text-center">Back to Home</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export default function AnimalMatchGame() {
  const { isMobile } = useDeviceType();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [gameStarted, setGameStarted] = useState(false);
  const [playerCount, setPlayerCount] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [playerMatches, setPlayerMatches] = useState<Map<number, Set<string>>>(new Map());
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [firstCardFlipped, setFirstCardFlipped] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [backButtonHovered, setBackButtonHovered] = useState(false);
  const [refreshButtonHovered, setRefreshButtonHovered] = useState(false);
  const isProcessing = useRef(false);

  const calculateCardSize = useCallback(() => {
    const padding = 32;
    const headerHeight = isMobile ? 200 : 160;
    const availableWidth = screenWidth - padding;
    const availableHeight = screenHeight - headerHeight - padding;

    if (isMobile) {
      const maxCardWidth = (availableWidth - 30) / 4;
      const maxCardHeight = (availableHeight - 50) / 6 / 1.25;
      return Math.min(maxCardWidth, maxCardHeight, 65);
    } else {
      const maxCardWidth = (availableWidth - 60) / 6;
      const maxCardHeight = (availableHeight - 40) / 4 / 1.25;
      return Math.min(maxCardWidth, maxCardHeight, 80);
    }
  }, [screenWidth, screenHeight, isMobile]);

  const cardSize = calculateCardSize();

  const initializeGame = useCallback((newPlayers?: Player[]) => {
    const gameCards: Card[] = [];

    ANIMALS_DATA.forEach((animal) => {
      gameCards.push({
        id: `${animal.id}-1`,
        animalId: animal.id,
        symbol: animal.symbol,
        hebrewName: animal.name,
        color: animal.color,
      });
      gameCards.push({
        id: `${animal.id}-2`,
        animalId: animal.id,
        symbol: animal.symbol,
        hebrewName: animal.name,
        color: animal.color,
      });
    });

    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    const playersToUse = newPlayers || players;
    setCards(gameCards);
    setFlippedIndices([]);
    setPlayerMatches(new Map(playersToUse.map((p) => [p.id, new Set<string>()])));
    setGameComplete(false);
    setStartTime(null);
    setElapsedTime(0);
    setFirstCardFlipped(false);
    setCurrentPlayerIndex(0);
    setGameStarted(true);
    setGameKey(prev => prev + 1);
    isProcessing.current = false;
  }, [players]);

  const handleStartGame = useCallback((count: number) => {
    setPlayerCount(count);
    const newPlayers = Array.from({ length: count }).map((_, i) => ({
      id: i,
      name: PLAYER_COLORS[i].name,
      color: PLAYER_COLORS[i].color,
      bgColor: PLAYER_COLORS[i].bgColor,
      darkColor: PLAYER_COLORS[i].darkColor,
      matches: 0,
      matchedCardIds: new Set<string>(),
    }));
    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    initializeGame(newPlayers);
  }, [initializeGame]);

  useEffect(() => {
    if (!startTime || gameComplete) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, gameComplete]);

  const handleCardPress = (index: number) => {
    if (isProcessing.current) return;
    if (flippedIndices.length === 2) return;
    if (flippedIndices.includes(index)) return;

    const allMatched = Array.from(playerMatches.values()).reduce(
      (acc, set) => new Set([...acc, ...set]),
      new Set<string>()
    );
    if (allMatched.has(cards[index].id)) return;

    if (!firstCardFlipped) {
      setFirstCardFlipped(true);
      setStartTime(Date.now());
    }

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      isProcessing.current = true;

      const [first, second] = newFlipped;
      const card1 = cards[first];
      const card2 = cards[second];

      if (card1.animalId === card2.animalId && card1.id !== card2.id) {
        setTimeout(() => {
          setPlayerMatches((prev) => {
            const newMatches = new Map(prev);
            const currentPlayerMatches = newMatches.get(currentPlayerIndex) || new Set();
            currentPlayerMatches.add(card1.id);
            currentPlayerMatches.add(card2.id);
            newMatches.set(currentPlayerIndex, currentPlayerMatches);

            const allMatched = Array.from(newMatches.values()).reduce(
              (acc, set) => new Set([...acc, ...set]),
              new Set<string>()
            );

            if (allMatched.size === 24) {
              setGameComplete(true);
            }

            return newMatches;
          });

          setFlippedIndices([]);
          isProcessing.current = false;
        }, 600);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
          isProcessing.current = false;
          if (playerCount > 1) {
            setCurrentPlayerIndex((prev) => (prev + 1) % playerCount);
          }
        }, 1200);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const columns = isMobile ? 4 : 6;
  const gridWidth = columns * (cardSize + (cardSize > 60 ? 10 : 6));
  const allMatched = Array.from(playerMatches.values()).reduce(
    (acc, set) => new Set([...acc, ...set]),
    new Set<string>()
  );

  const turnTransition = useSharedValue(0);

  useEffect(() => {
    if (playerCount > 1 && gameStarted) {
      turnTransition.value = withSequence(
        withTiming(1, { duration: 250, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 400, easing: Easing.in(Easing.cubic) })
      );
    }
  }, [currentPlayerIndex, playerCount, gameStarted]);

  const turnTransitionStyle = useAnimatedStyle(() => ({
    opacity: turnTransition.value * 0.12,
  }));

  if (!gameStarted) {
    return <PlayerSetupScreen onStartGame={handleStartGame} />;
  }

  const currentPlayer = players[currentPlayerIndex];

  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="bg-white border-b border-amber-200">
        <View className="flex-row items-center justify-between px-4 py-3">
          <Pressable
            onPress={() => {
              setGameStarted(false);
              setPlayerCount(1);
            }}
            onHoverIn={!isMobile ? () => setBackButtonHovered(true) : undefined}
            onHoverOut={!isMobile ? () => setBackButtonHovered(false) : undefined}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: backButtonHovered ? '#fde68a' : '#fef3c7',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FontAwesome name="arrow-left" size={18} color={backButtonHovered ? '#92400e' : '#b45309'} />
          </Pressable>

          <View className="items-center flex-1 mx-4">
            <Text className={`font-bold text-amber-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>
              Animals
            </Text>
          </View>

          <Pressable
            onPress={() => initializeGame()}
            onHoverIn={!isMobile ? () => setRefreshButtonHovered(true) : undefined}
            onHoverOut={!isMobile ? () => setRefreshButtonHovered(false) : undefined}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: refreshButtonHovered ? '#fde68a' : '#fef3c7',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FontAwesome name="refresh" size={18} color={refreshButtonHovered ? '#92400e' : '#b45309'} />
          </Pressable>
        </View>

        {/* Player indicators in a row */}
        {playerCount > 1 && (
          <View className="px-4 py-4 bg-white border-t border-amber-100">
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              {players.map((player, idx) => (
                <PlayerIndicator
                  key={player.id}
                  player={player}
                  isActive={currentPlayerIndex === player.id}
                  matchCount={Math.floor((playerMatches.get(player.id)?.size ?? 0) / 2)}
                  position={idx}
                />
              ))}
            </View>
          </View>
        )}

        {/* Stats Bar */}
        <View
          className="flex-row justify-center py-3 bg-amber-50 border-t border-amber-100"
          style={{ gap: isMobile ? 32 : 48 }}
        >
          <View className="items-center">
            <Text className="text-xs text-amber-600 uppercase tracking-wide font-semibold">Time</Text>
            <Text className={`font-bold text-amber-900 ${isMobile ? 'text-xl' : 'text-2xl'} mt-1`}>
              {formatTime(elapsedTime)}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-amber-600 uppercase tracking-wide font-semibold">Matched</Text>
            <Text className={`font-bold text-amber-600 ${isMobile ? 'text-xl' : 'text-2xl'} mt-1`}>
              {Math.floor(allMatched.size / 2)}/12
            </Text>
          </View>
        </View>
      </View>

      {/* Turn Transition Overlay */}
      {playerCount > 1 && (
        <Animated.View
          style={[
            turnTransitionStyle,
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: currentPlayer.color,
              pointerEvents: 'none',
              zIndex: 10,
            },
          ]}
        />
      )}

      {/* Game Board */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            width: gridWidth,
          }}
        >
          {cards.map((card, index) => {
            let matchedByPlayerId: number | undefined;
            for (const [playerId, cardIds] of playerMatches) {
              if (cardIds.has(card.id)) {
                matchedByPlayerId = playerId;
                break;
              }
            }

            return (
              <CardComponent
                key={`${gameKey}-${card.id}`}
                card={card}
                isFlipped={flippedIndices.includes(index)}
                isMatched={allMatched.has(card.id)}
                matchedByPlayerId={matchedByPlayerId}
                onPress={() => handleCardPress(index)}
                disabled={isProcessing.current}
                cardSize={cardSize}
                index={index}
              />
            );
          })}
        </View>
      </View>

      {/* Victory Modal */}
      {gameComplete && (
        <VictoryScreen
          playerCount={playerCount}
          players={players}
          playerMatches={playerMatches}
          elapsedTime={elapsedTime}
          onPlayAgain={() => initializeGame()}
          onBackToHome={() => {
            setGameStarted(false);
            setPlayerCount(1);
          }}
        />
      )}
    </SafeAreaView>
  );
}
