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
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDeviceType } from '@/hooks/useDeviceType';
import { useWebSafeArea } from '@/hooks/useWebSafeArea';

// Jewish Holidays data
const HOLIDAYS_DATA = [
  { id: 'roshHashana', name: 'Rosh Hashana', symbol: '🍎', hebrew: 'ראש השנה', color: '#dc2626' },
  { id: 'yomKippur', name: 'Yom Kippur', symbol: '📖', hebrew: 'יום כיפור', color: '#f8fafc' },
  { id: 'sukkos', name: 'Sukkos', symbol: '🌿', hebrew: 'סוכות', color: '#22c55e' },
  { id: 'simchasTorah', name: 'Simchas Torah', symbol: '📜', hebrew: 'שמחת תורה', color: '#8b5cf6' },
  { id: 'chanukah', name: 'Chanukah', symbol: '🕎', hebrew: 'חנוכה', color: '#0ea5e9' },
  { id: 'purim', name: 'Purim', symbol: '🎭', hebrew: 'פורים', color: '#ec4899' },
  { id: 'pesach', name: 'Pesach', symbol: '🍷', hebrew: 'פסח', color: '#7c3aed' },
  { id: 'shavuos', name: 'Shavuos', symbol: '🌸', hebrew: 'שבועות', color: '#10b981' },
  { id: 'tishaBAv', name: "Tisha B'Av", symbol: '😢', hebrew: 'תשעה באב', color: '#64748b' },
  { id: 'tuBshvat', name: "Tu B'Shvat", symbol: '🌳', hebrew: 'ט״ו בשבט', color: '#84cc16' },
  { id: 'lagBomer', name: "Lag B'Omer", symbol: '🔥', hebrew: 'ל״ג בעומר', color: '#f97316' },
  { id: 'shabbos', name: 'Shabbos', symbol: '🕯️', hebrew: 'שבת', color: '#eab308' },
];

const PLAYER_COLORS = [
  { name: 'Player 1', color: '#7c3aed', bgColor: '#ede9fe', darkColor: '#5b21b6' },
  { name: 'Player 2', color: '#0ea5e9', bgColor: '#e0f2fe', darkColor: '#075985' },
  { name: 'Player 3', color: '#ec4899', bgColor: '#fce7f3', darkColor: '#9d174d' },
  { name: 'Player 4', color: '#10b981', bgColor: '#d1fae5', darkColor: '#047857' },
];

interface Card {
  id: string;
  holidayId: string;
  symbol: string;
  name: string;
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

  useEffect(() => { entranceAnim.value = withDelay(index * 30, withSpring(1, { damping: 12, stiffness: 100 })); }, [index]);
  useEffect(() => { flipProgress.value = withTiming(isFlipped || isMatched ? 1 : 0, { duration: 350, easing: Easing.out(Easing.cubic) }); }, [isFlipped, isMatched]);
  useEffect(() => {
    if (isMatched) {
      scale.value = withSequence(withSpring(1.15, { damping: 8, stiffness: 200 }), withSpring(1, { damping: 10, stiffness: 150 }));
      matchGlow.value = withSequence(withTiming(1, { duration: 200 }), withTiming(0.3, { duration: 400 }));
    }
  }, [isMatched]);

  const containerStyle = useAnimatedStyle(() => ({ transform: [{ scale: entranceAnim.value }], opacity: entranceAnim.value }));
  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${interpolate(flipProgress.value, [0, 1], [0, 180])}deg` }, { scale: scale.value }],
    opacity: flipProgress.value < 0.5 ? 1 : 0,
  }));
  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${interpolate(flipProgress.value, [0, 1], [180, 360])}deg` }, { scale: scale.value }],
    opacity: flipProgress.value >= 0.5 ? 1 : 0,
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: matchGlow.value }));

  const margin = cardSize > 60 ? 5 : 3;
  const glowColor = matchedByPlayerId !== undefined ? PLAYER_COLORS[matchedByPlayerId].color : '#7c3aed';

  return (
    <Animated.View style={[containerStyle, { margin }]}>
      <Pressable onPress={onPress} disabled={disabled || isFlipped || isMatched} style={{ width: cardSize, height: cardSize * 1.25 }}>
        {isMatched && <Animated.View style={[glowStyle, { position: 'absolute', top: -4, left: -4, right: -4, bottom: -4, borderRadius: 14, backgroundColor: glowColor }]} />}

        <Animated.View
          style={[frontAnimatedStyle, {
            position: 'absolute', width: '100%', height: '100%', backgroundColor: '#7c3aed', borderRadius: 10,
            justifyContent: 'center', alignItems: 'center', backfaceVisibility: 'hidden',
            shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5,
          }]}
        >
          <View style={{ position: 'absolute', width: '80%', height: '85%', borderRadius: 6, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' }} />
          <Text style={{ fontSize: cardSize * 0.35, color: 'white' }}>✡️</Text>
        </Animated.View>

        <Animated.View
          style={[backAnimatedStyle, {
            position: 'absolute', width: '100%', height: '100%',
            backgroundColor: isMatched ? PLAYER_COLORS[matchedByPlayerId ?? 0].bgColor : 'white',
            borderRadius: 10, justifyContent: 'center', alignItems: 'center', backfaceVisibility: 'hidden',
            borderWidth: isMatched ? 3 : 1, borderColor: isMatched ? glowColor : '#e2e8f0',
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, paddingVertical: 8,
          }]}
        >
          <Text style={{ fontSize: cardSize * 0.45 }}>{card.symbol}</Text>
          <Text style={{ fontSize: cardSize * 0.12, fontWeight: '600', color: '#64748b', textAlign: 'center', marginTop: 4 }}>{card.name}</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

function Confetti() {
  return (
    <View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 100 }} pointerEvents="none">
      {Array.from({ length: 50 }).map((_, i) => <ConfettiParticle key={i} index={i} />)}
    </View>
  );
}

function ConfettiParticle({ index }: { index: number }) {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const emojis = ['✨', '🕎', '🍎', '🎭', '💫', '🕯️', '📜'];
  const emoji = emojis[index % emojis.length];
  const startLeft = useRef(10 + Math.random() * 80).current;
  const fontSize = useRef(20 + Math.random() * 12).current;

  useEffect(() => {
    const randomDelay = Math.random() * 400;
    const randomX = (Math.random() - 0.5) * 200;
    const fallDuration = 2000 + Math.random() * 1000;

    opacity.value = withDelay(randomDelay, withTiming(1, { duration: 200 }));
    scale.value = withDelay(randomDelay, withSpring(1, { damping: 10 }));
    translateY.value = withDelay(randomDelay, withTiming(600, { duration: fallDuration, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) }));
    translateX.value = withDelay(randomDelay, withTiming(randomX, { duration: fallDuration }));
    rotate.value = withDelay(randomDelay, withTiming(360 * (Math.random() > 0.5 ? 2 : -2), { duration: fallDuration }));
    opacity.value = withDelay(randomDelay + fallDuration * 0.7, withTiming(0, { duration: 600 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }, { rotate: `${rotate.value}deg` }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[animStyle, { position: 'absolute', left: `${startLeft}%`, top: -50 }]}><Text style={{ fontSize }}>{emoji}</Text></Animated.View>;
}

function PlayerIndicator({ player, isActive, matchCount, position }: { player: Player; isActive: boolean; matchCount: number; position: number }) {
  const scale = useSharedValue(0.9);
  useEffect(() => { scale.value = withSpring(isActive ? 1 : 0.9, { damping: 8, stiffness: 150 }); }, [isActive]);
  const containerStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeIn.duration(300).delay(position * 100)} style={[containerStyle, { alignItems: 'center' }]}>
      <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: isActive ? player.color : player.bgColor, borderWidth: 3, borderColor: isActive ? player.darkColor : player.color, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: isActive ? 'white' : player.darkColor }}>{matchCount}</Text>
      </View>
      <Text style={{ fontSize: 11, fontWeight: isActive ? '700' : '600', color: isActive ? player.darkColor : '#64748b', marginTop: 6 }}>{player.name}</Text>
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
    borderColor: borderColor.value === 1 ? '#7c3aed' : '#c4b5fd',
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
              shadowColor: '#7c3aed',
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 8,
              elevation: 3,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#5b21b6' }}>
              {playerCount === 1 ? 'Solo' : `${playerCount} Players`}
            </Text>
            <Text style={{ fontSize: 14, color: '#7c3aed', marginTop: 4 }}>
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

// Header button with hover effect
function HeaderButton({ onPress, icon }: { onPress: () => void; icon: string }) {
  const isWeb = Platform.OS === 'web';
  const scale = useSharedValue(1);
  const bgColor = useSharedValue(0);

  const handleHoverIn = () => {
    if (isWeb) {
      scale.value = withSpring(1.1, { damping: 15, stiffness: 300 });
      bgColor.value = withTiming(1, { duration: 150 });
    }
  };

  const handleHoverOut = () => {
    if (isWeb) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      bgColor.value = withTiming(0, { duration: 150 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: bgColor.value === 1 ? '#ddd6fe' : '#ede9fe',
  }));

  return (
    <Pressable onPress={onPress} onHoverIn={handleHoverIn} onHoverOut={handleHoverOut}>
      <Animated.View style={[animatedStyle, {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
      }]}>
        <FontAwesome name={icon as any} size={18} color="#5b21b6" />
      </Animated.View>
    </Pressable>
  );
}

function PlayerSetupScreen({ onStartGame }: { onStartGame: (playerCount: number) => void }) {
  const isWeb = Platform.OS === 'web';
  const [backHovered, setBackHovered] = useState(false);
  const nativeInsets = useSafeAreaInsets();
  const webInsets = useWebSafeArea();
  const safeInsets = isWeb ? webInsets : nativeInsets;

  // Display holiday symbols for the header
  const displayHolidays = [
    { symbol: '🕎', color: '#0ea5e9' },
    { symbol: '🍎', color: '#dc2626' },
    { symbol: '🎭', color: '#ec4899' },
    { symbol: '📜', color: '#8b5cf6' },
    { symbol: '🕯️', color: '#eab308' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f3ff', paddingTop: safeInsets.top, paddingBottom: safeInsets.bottom }}>
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
          {/* Holiday symbols row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: isWeb ? 20 : 12,
              gap: isWeb ? 12 : 4,
            }}
          >
            {displayHolidays.map((holiday, index) => (
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
                  shadowColor: holiday.color,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  elevation: 3,
                  borderWidth: 2,
                  borderColor: holiday.color + '30',
                }}
              >
                <Text style={{ fontSize: isWeb ? 24 : 18 }}>{holiday.symbol}</Text>
              </Animated.View>
            ))}
          </View>

          {/* Title with styled effect */}
          <View className="items-center">
            <Text
              style={{
                fontSize: isWeb ? 42 : 34,
                fontWeight: '800',
                color: '#5b21b6',
                letterSpacing: -1,
              }}
            >
              Yomim Tovim
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
              <View style={{ height: 1, width: 40, backgroundColor: '#c4b5fd' }} />
              <Text
                style={{
                  fontSize: 14,
                  color: '#7c3aed',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: 2
                }}
              >
                Memory Match
              </Text>
              <View style={{ height: 1, width: 40, backgroundColor: '#c4b5fd' }} />
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
              backgroundColor: backHovered ? '#ede9fe' : 'transparent',
              borderRadius: 8,
            }}
          >
            <FontAwesome name="arrow-left" size={14} color={backHovered ? '#5b21b6' : '#7c3aed'} />
            <Text style={{ color: backHovered ? '#5b21b6' : '#7c3aed', fontWeight: '600', fontSize: 15 }}>Back</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

function VictoryScreen({ playerCount, players, playerMatches, elapsedTime, onPlayAgain, onBackToHome }: { playerCount: number; players: Player[]; playerMatches: Map<number, Set<string>>; elapsedTime: number; onPlayAgain: () => void; onBackToHome: () => void }) {
  const isWeb = Platform.OS === 'web';
  const trophyScale = useSharedValue(0);
  const trophyRotate = useSharedValue(0);

  useEffect(() => {
    trophyScale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 100 }));
    trophyRotate.value = withDelay(300, withSequence(
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 200 }),
      withTiming(-5, { duration: 150 }),
      withTiming(5, { duration: 150 }),
      withTiming(0, { duration: 100 })
    ));
  }, []);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }, { rotate: `${trophyRotate.value}deg` }],
  }));

  // Button hover states
  const playAgainScale = useSharedValue(1);
  const backScale = useSharedValue(1);

  const handlePlayAgainHoverIn = () => {
    if (Platform.OS === 'web') {
      playAgainScale.value = withSpring(1.05, { damping: 15, stiffness: 300 });
    }
  };

  const handlePlayAgainHoverOut = () => {
    if (Platform.OS === 'web') {
      playAgainScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const handleBackHoverIn = () => {
    if (Platform.OS === 'web') {
      backScale.value = withSpring(1.05, { damping: 15, stiffness: 300 });
    }
  };

  const handleBackHoverOut = () => {
    if (Platform.OS === 'web') {
      backScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const playAgainStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playAgainScale.value }],
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(91, 33, 182, 0.9)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Confetti />
      <Animated.View entering={FadeIn.duration(400).delay(200)} style={{
        backgroundColor: 'white',
        borderRadius: 24,
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
        padding: isWeb ? 48 : 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
      }}>
        <Animated.View style={trophyStyle}>
          <Text style={{ fontSize: 80 }}>🏆</Text>
        </Animated.View>

        <Text style={{
          fontSize: isWeb ? 36 : 32,
          fontWeight: 'bold',
          color: '#5b21b6',
          marginTop: 20,
          textAlign: 'center',
        }}>
          Mazal Tov!
        </Text>

        <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 8, fontSize: 16 }}>
          {playerCount === 1 ? 'All holidays matched!' : 'Game Complete!'}
        </Text>

        {playerCount > 1 ? (
          <View style={{ marginTop: 24, width: '100%' }}>
            {players.sort((a, b) => (playerMatches.get(b.id)?.size ?? 0) - (playerMatches.get(a.id)?.size ?? 0)).map((player, idx) => (
              <Animated.View
                key={player.id}
                entering={FadeIn.duration(300).delay(400 + idx * 100)}
                style={{
                  backgroundColor: player.bgColor,
                  borderLeftWidth: 5,
                  borderLeftColor: player.color,
                  padding: 16,
                  marginBottom: 8,
                  borderRadius: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontWeight: 'bold', color: player.darkColor, fontSize: 16 }}>
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : ''} {player.name}
                </Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: player.color }}>
                  {Math.floor((playerMatches.get(player.id)?.size ?? 0) / 2)}
                </Text>
              </Animated.View>
            ))}
          </View>
        ) : (
          <View style={{ marginTop: 24, backgroundColor: '#ede9fe', borderRadius: 16, padding: 24, width: '100%' }}>
            <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#5b21b6', textAlign: 'center' }}>{elapsedTime}</Text>
            <Text style={{ color: '#7c3aed', textAlign: 'center', marginTop: 4, fontWeight: '600', letterSpacing: 2 }}>SECONDS</Text>
          </View>
        )}

        <Pressable
          onPress={onPlayAgain}
          onHoverIn={handlePlayAgainHoverIn}
          onHoverOut={handlePlayAgainHoverOut}
          style={{ width: '100%', marginTop: 32 }}
        >
          <Animated.View style={[playAgainStyle, {
            backgroundColor: '#7c3aed',
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 32,
          }]}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>Play Again</Text>
          </Animated.View>
        </Pressable>

        <Pressable
          onPress={onBackToHome}
          onHoverIn={handleBackHoverIn}
          onHoverOut={handleBackHoverOut}
          style={{ marginTop: 16, padding: 12 }}
        >
          <Animated.View style={backStyle}>
            <Text style={{ color: '#64748b', fontWeight: '600' }}>Back to Home</Text>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default function HolidayMatchGame() {
  const { isMobile, isLoading: isDetectingDevice } = useDeviceType();
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
  const isProcessing = useRef(false);

  const calculateCardSize = useCallback(() => {
    const padding = 16;
    const headerHeight = isMobile ? 200 : 160;
    const availableWidth = screenWidth - padding;
    const availableHeight = screenHeight - headerHeight - padding;
    if (isMobile) {
      // Mobile layout: 4 columns, 6 rows
      const maxCardWidth = (availableWidth - 30) / 4;
      const maxCardHeight = (availableHeight - 50) / 6 / 1.25;
      return Math.min(maxCardWidth, maxCardHeight, 65);
    } else {
      // Desktop layout: 6 columns, 4 rows
      const maxCardWidth = (availableWidth - 60) / 6;
      const maxCardHeight = (availableHeight - 40) / 4 / 1.25;
      return Math.min(maxCardWidth, maxCardHeight, 80);
    }
  }, [screenWidth, screenHeight, isMobile]);

  const cardSize = calculateCardSize();

  const initializeGame = useCallback((newPlayers?: Player[]) => {
    const gameCards: Card[] = [];
    HOLIDAYS_DATA.forEach((holiday) => {
      gameCards.push({ id: `${holiday.id}-1`, holidayId: holiday.id, symbol: holiday.symbol, name: holiday.name, color: holiday.color });
      gameCards.push({ id: `${holiday.id}-2`, holidayId: holiday.id, symbol: holiday.symbol, name: holiday.name, color: holiday.color });
    });
    for (let i = gameCards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]]; }

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
      id: i, name: PLAYER_COLORS[i].name, color: PLAYER_COLORS[i].color, bgColor: PLAYER_COLORS[i].bgColor, darkColor: PLAYER_COLORS[i].darkColor, matches: 0, matchedCardIds: new Set<string>(),
    }));
    setPlayers(newPlayers);
    initializeGame(newPlayers);
  }, [initializeGame]);

  useEffect(() => {
    if (!startTime || gameComplete) return;
    const interval = setInterval(() => { setElapsedTime(Math.floor((Date.now() - startTime) / 1000)); }, 1000);
    return () => clearInterval(interval);
  }, [startTime, gameComplete]);

  // Show loader while detecting device type - MUST be after all hooks
  if (isDetectingDevice) {
    return (
      <SafeAreaView className="flex-1 bg-violet-50 items-center justify-center">
        <StatusBar style="dark" />
        <Text style={{ color: '#7c3aed', fontSize: 16 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const handleCardPress = (index: number) => {
    if (isProcessing.current || flippedIndices.length === 2 || flippedIndices.includes(index)) return;
    const allMatched = Array.from(playerMatches.values()).reduce((acc, set) => new Set([...acc, ...set]), new Set<string>());
    if (allMatched.has(cards[index].id)) return;
    if (!firstCardFlipped) { setFirstCardFlipped(true); setStartTime(Date.now()); }

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      isProcessing.current = true;
      const [first, second] = newFlipped;
      const card1 = cards[first];
      const card2 = cards[second];

      if (card1.holidayId === card2.holidayId && card1.id !== card2.id) {
        setTimeout(() => {
          setPlayerMatches((prev) => {
            const newMatches = new Map(prev);
            const current = newMatches.get(currentPlayerIndex) || new Set();
            current.add(card1.id);
            current.add(card2.id);
            newMatches.set(currentPlayerIndex, current);
            if (Array.from(newMatches.values()).reduce((acc, set) => new Set([...acc, ...set]), new Set<string>()).size === 24) setGameComplete(true);
            return newMatches;
          });
          setFlippedIndices([]);
          isProcessing.current = false;
        }, 600);
      } else {
        setTimeout(() => { setFlippedIndices([]); isProcessing.current = false; if (playerCount > 1) setCurrentPlayerIndex((prev) => (prev + 1) % playerCount); }, 1200);
      }
    }
  };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  const columns = isMobile ? 4 : 6;
  const gridWidth = columns * (cardSize + (cardSize > 60 ? 10 : 6));
  const allMatched = Array.from(playerMatches.values()).reduce((acc, set) => new Set([...acc, ...set]), new Set<string>());

  if (!gameStarted) return <PlayerSetupScreen onStartGame={handleStartGame} />;

  return (
    <SafeAreaView className="flex-1 bg-violet-50">
      <StatusBar style="dark" />

      <View className="bg-white border-b border-violet-200">
        <View className="flex-row items-center justify-between px-4 py-3">
          <HeaderButton onPress={() => setGameStarted(false)} icon="arrow-left" />
          <View className="items-center flex-1 mx-4">
            <Text className={`font-bold text-violet-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>Yomim Tovim</Text>
          </View>
          <HeaderButton onPress={() => initializeGame()} icon="refresh" />
        </View>

        {playerCount > 1 && (
          <View className="px-4 py-4 bg-white border-t border-violet-100">
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              {players.map((player, idx) => <PlayerIndicator key={player.id} player={player} isActive={currentPlayerIndex === player.id} matchCount={Math.floor((playerMatches.get(player.id)?.size ?? 0) / 2)} position={idx} />)}
            </View>
          </View>
        )}

        <View className="flex-row justify-center py-3 bg-violet-50 border-t border-violet-100" style={{ gap: isMobile ? 32 : 48 }}>
          <View className="items-center">
            <Text className="text-xs text-violet-600 uppercase tracking-wide font-semibold">Time</Text>
            <Text className={`font-bold text-violet-900 ${isMobile ? 'text-xl' : 'text-2xl'} mt-1`}>{formatTime(elapsedTime)}</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-violet-600 uppercase tracking-wide font-semibold">Matched</Text>
            <Text className={`font-bold text-violet-600 ${isMobile ? 'text-xl' : 'text-2xl'} mt-1`}>{Math.floor(allMatched.size / 2)}/12</Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: gridWidth }}>
          {cards.map((card, index) => {
            let matchedByPlayerId: number | undefined;
            for (const [playerId, cardIds] of playerMatches) { if (cardIds.has(card.id)) { matchedByPlayerId = playerId; break; } }
            return <CardComponent key={`${gameKey}-${card.id}`} card={card} isFlipped={flippedIndices.includes(index)} isMatched={allMatched.has(card.id)} matchedByPlayerId={matchedByPlayerId} onPress={() => handleCardPress(index)} disabled={isProcessing.current} cardSize={cardSize} index={index} />;
          })}
        </View>
      </View>

      {gameComplete && <VictoryScreen playerCount={playerCount} players={players} playerMatches={playerMatches} elapsedTime={elapsedTime} onPlayAgain={() => initializeGame()} onBackToHome={() => setGameStarted(false)} />}
    </SafeAreaView>
  );
}
