import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Who Am I characters with progressive clues
interface Character {
  name: string;
  hebrew: string;
  clues: string[];
  emoji: string;
}

const CHARACTERS: Character[] = [
  {
    name: 'Avraham',
    hebrew: 'אברהם',
    emoji: '🏕️',
    clues: [
      'I was born in Ur Kasdim.',
      'I smashed my father\'s idols.',
      'I was the first to recognize Hashem.',
      'I welcomed guests into my tent.',
      'I was willing to sacrifice my son.',
    ],
  },
  {
    name: 'Moshe',
    hebrew: 'משה',
    emoji: '📜',
    clues: [
      'I was placed in a basket on the Nile.',
      'I grew up in Pharaoh\'s palace.',
      'I saw a burning bush that was not consumed.',
      'I led the Jewish people out of Egypt.',
      'I received the Torah at Har Sinai.',
    ],
  },
  {
    name: 'Yosef',
    hebrew: 'יוסף',
    emoji: '🌈',
    clues: [
      'I had many brothers who were jealous of me.',
      'My father gave me a special colorful coat.',
      'I was sold as a slave.',
      'I could interpret dreams.',
      'I became the viceroy of Egypt.',
    ],
  },
  {
    name: 'Dovid',
    hebrew: 'דוד',
    emoji: '👑',
    clues: [
      'I was the youngest of my brothers.',
      'I was a shepherd.',
      'I defeated a giant with a slingshot.',
      'I played the harp to soothe King Shaul.',
      'I wrote most of Tehillim.',
    ],
  },
  {
    name: 'Noach',
    hebrew: 'נח',
    emoji: '🚢',
    clues: [
      'I was righteous in my generation.',
      'Hashem commanded me to build something.',
      'I brought animals in pairs.',
      'I survived a great flood.',
      'A dove brought me an olive branch.',
    ],
  },
  {
    name: 'Yaakov',
    hebrew: 'יעקב',
    emoji: '✡️',
    clues: [
      'I was a twin.',
      'I bought something from my brother for soup.',
      'I had a dream about a ladder.',
      'I worked for my uncle for many years.',
      'I had 12 sons who became the 12 tribes.',
    ],
  },
  {
    name: 'Sarah',
    hebrew: 'שרה',
    emoji: '🕯️',
    clues: [
      'I was known for my great beauty.',
      'I was originally called by a different name.',
      'I waited many years for a child.',
      'Angels visited my husband\'s tent.',
      'I gave birth at age 90.',
    ],
  },
  {
    name: 'Esther',
    hebrew: 'אסתר',
    emoji: '👸',
    clues: [
      'I was an orphan raised by my cousin.',
      'I became a queen.',
      'I kept my identity secret.',
      'I risked my life for my people.',
      'A holiday is named after a scroll about me.',
    ],
  },
  {
    name: 'Shlomo',
    hebrew: 'שלמה',
    emoji: '🏛️',
    clues: [
      'I was the son of a great king.',
      'I asked Hashem for wisdom.',
      'I judged between two women claiming a baby.',
      'I built the Beis HaMikdash.',
      'I wrote Mishlei, Koheles, and Shir HaShirim.',
    ],
  },
  {
    name: 'Rivka',
    hebrew: 'רבקה',
    emoji: '🏺',
    clues: [
      'I gave water to a stranger and his camels.',
      'I left my home to marry someone I never met.',
      'I was the mother of twins.',
      'I helped my younger son receive a blessing.',
      'I was the wife of Yitzchak.',
    ],
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Confetti particle
function ConfettiParticle({ index }: { index: number }) {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const emojis = ['✨', '⭐', '🎊', '🎉', '💫', '✡️', '📖'];
  const emoji = emojis[index % emojis.length];
  const startLeft = useRef(10 + Math.random() * 80).current;
  const fontSize = useRef(24 + Math.random() * 12).current;

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
    opacity.value = withDelay(randomDelay + fallDuration * 0.7, withTiming(0, { duration: 600 }));
  }, [opacity, scale, translateY, translateX, rotate]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animStyle, { position: 'absolute', left: `${startLeft}%`, top: -50 }]}>
      <Text style={{ fontSize }}>{emoji}</Text>
    </Animated.View>
  );
}

function Confetti() {
  return (
    <View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 100 }} pointerEvents="none">
      {Array.from({ length: 40 }).map((_, i) => (
        <ConfettiParticle key={i} index={i} />
      ))}
    </View>
  );
}

// Victory screen
function VictoryScreen({
  score,
  total,
  onPlayAgain,
  onBackToHome,
}: {
  score: number;
  total: number;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}) {
  const isWeb = Platform.OS === 'web';
  const trophyScale = useSharedValue(0);
  const trophyRotate = useSharedValue(-180);

  useEffect(() => {
    trophyScale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 100 }));
    trophyRotate.value = withDelay(300, withSpring(0, { damping: 10, stiffness: 80 }));
  }, [trophyScale, trophyRotate]);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }, { rotate: `${trophyRotate.value}deg` }],
  }));

  const percentage = Math.round((score / total) * 100);

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
      {percentage >= 50 && <Confetti />}

      <Animated.View
        entering={FadeIn.duration(400).delay(200)}
        className="bg-white rounded-3xl items-center w-full"
        style={{
          maxWidth: 400,
          paddingTop: isWeb ? 48 : 40,
          paddingBottom: isWeb ? 40 : 32,
          paddingHorizontal: isWeb ? 40 : 28,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 20 },
          shadowOpacity: 0.4,
          shadowRadius: 30,
          elevation: 15,
        }}
      >
        <Animated.View style={trophyStyle}>
          <Text style={{ fontSize: 72 }}>{percentage >= 60 ? '🏆' : '📚'}</Text>
        </Animated.View>

        <Text
          style={{
            fontWeight: 'bold',
            color: '#1e293b',
            marginTop: 24,
            fontSize: isWeb ? 36 : 28,
            textAlign: 'center',
            paddingHorizontal: 8,
          }}
        >
          {percentage >= 60 ? 'Mazal Tov!' : 'Good Try!'}
        </Text>
        <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 12, fontSize: 16 }}>
          You identified Torah personalities!
        </Text>

        <Animated.View entering={FadeIn.duration(400).delay(500)} style={{ marginTop: 28, width: '100%' }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#ecfeff',
              borderRadius: 20,
              paddingVertical: 24,
              paddingHorizontal: 24,
            }}
          >
            <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#0891b2' }}>
              {score}/{total}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: '#0e7490',
                marginTop: 8,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                fontWeight: '600',
              }}
            >
              Points
            </Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#06b6d4', marginTop: 8 }}>
              {percentage}%
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(800)} style={{ width: '100%', marginTop: 28 }}>
          <Pressable
            onPress={onPlayAgain}
            style={{
              backgroundColor: '#0891b2',
              borderRadius: 16,
              paddingVertical: 18,
              paddingHorizontal: 32,
              shadowColor: '#0891b2',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17, textAlign: 'center' }}>
              Play Again
            </Text>
          </Pressable>

          <Pressable onPress={onBackToHome} style={{ marginTop: 16, paddingVertical: 14 }}>
            <Text style={{ color: '#64748b', fontWeight: '600', fontSize: 16, textAlign: 'center' }}>
              Back to Home
            </Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

// Initial animation
function InitialAnimation({ onComplete }: { onComplete: () => void }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const iconRotate = useSharedValue(-15);
  const sparkles = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
    iconRotate.value = withSequence(
      withTiming(10, { duration: 300 }),
      withTiming(-5, { duration: 200 }),
      withTiming(0, { duration: 150 })
    );
    sparkles.value = withDelay(300, withTiming(1, { duration: 500 }));

    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 300 });
      scale.value = withTiming(0.8, { duration: 300 });
      setTimeout(onComplete, 300);
    }, 1500);

    return () => clearTimeout(timer);
  }, [opacity, scale, iconRotate, sparkles, onComplete]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotate.value}deg` }],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkles.value,
    transform: [{ scale: sparkles.value }],
  }));

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(8, 145, 178, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <Animated.View style={containerStyle}>
        <View style={{ alignItems: 'center' }}>
          <Animated.View style={iconStyle}>
            <Text style={{ fontSize: 80 }}>❓</Text>
          </Animated.View>
          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: 'white',
              marginTop: 20,
              textShadowColor: 'rgba(0,0,0,0.2)',
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
            }}
          >
            Who Am I?
          </Text>
          <Animated.View style={[sparkleStyle, { flexDirection: 'row', marginTop: 16 }]}>
            <Text style={{ fontSize: 24, marginHorizontal: 8 }}>✨</Text>
            <Text style={{ fontSize: 24, marginHorizontal: 8 }}>👤</Text>
            <Text style={{ fontSize: 24, marginHorizontal: 8 }}>✨</Text>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

// Answer option button
function AnswerOption({
  name,
  hebrew,
  onPress,
  disabled,
  isCorrect,
  isWrong,
  index,
}: {
  name: string;
  hebrew: string;
  onPress: () => void;
  disabled: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  index: number;
}) {
  const isWeb = Platform.OS === 'web';
  const isHovered = useSharedValue(0);

  const handleHoverIn = () => {
    if (!disabled) {
      isHovered.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  const handleHoverOut = () => {
    isHovered.value = withSpring(0, { damping: 15, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: isHovered.value * -2 }],
    shadowOpacity: 0.1 + isHovered.value * 0.15,
    shadowRadius: 8 + isHovered.value * 8,
  }));

  return (
    <Animated.View entering={FadeInDown.duration(300).delay(index * 100)} style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onHoverIn={isWeb ? handleHoverIn : undefined}
        onHoverOut={isWeb ? handleHoverOut : undefined}
        disabled={disabled}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isCorrect ? '#dcfce7' : isWrong ? '#fee2e2' : 'white',
          borderWidth: 2,
          borderColor: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : '#e2e8f0',
          borderRadius: 12,
          padding: 16,
          marginBottom: 10,
          opacity: disabled && !isCorrect && !isWrong ? 0.5 : 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: isCorrect ? '#166534' : isWrong ? '#991b1b' : '#1e293b',
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: isCorrect ? '#166534' : isWrong ? '#991b1b' : '#64748b',
              marginTop: 2,
            }}
          >
            {hebrew}
          </Text>
        </View>
        {isCorrect && <FontAwesome name="check-circle" size={24} color="#22c55e" />}
        {isWrong && <FontAwesome name="times-circle" size={24} color="#ef4444" />}
      </Pressable>
    </Animated.View>
  );
}

export default function WhoAmIGame() {
  const isWeb = Platform.OS === 'web';
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedClues, setRevealedClues] = useState(1);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [options, setOptions] = useState<Character[]>([]);
  const [showInitialAnimation, setShowInitialAnimation] = useState(true);

  const initializeGame = useCallback((showAnimation = true) => {
    const shuffled = shuffleArray(CHARACTERS).slice(0, 5);
    setCharacters(shuffled);
    setCurrentIndex(0);
    setRevealedClues(1);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setGameComplete(false);
    if (showAnimation) {
      setShowInitialAnimation(true);
    }
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Generate options when character changes
  useEffect(() => {
    if (characters.length === 0) return;
    const current = characters[currentIndex];
    if (!current) return;

    // Get 3 wrong answers
    const wrongAnswers = CHARACTERS.filter((c) => c.name !== current.name);
    const shuffledWrong = shuffleArray(wrongAnswers).slice(0, 3);

    // Combine with correct answer and shuffle
    const allOptions = shuffleArray([current, ...shuffledWrong]);
    setOptions(allOptions);
  }, [currentIndex, characters]);

  const currentCharacter = characters[currentIndex];

  const handleRevealClue = () => {
    if (revealedClues < 5) {
      setRevealedClues((prev) => prev + 1);
    }
  };

  const handleAnswer = (name: string) => {
    if (answered) return;
    setAnswered(true);
    setSelectedAnswer(name);

    const isCorrect = name === currentCharacter?.name;
    if (isCorrect) {
      // Award points based on how few clues were used
      const points = 6 - revealedClues; // 5 points for 1 clue, 1 point for 5 clues
      setScore((prev) => prev + points);
    }

    // Move to next after delay
    setTimeout(() => {
      if (currentIndex < characters.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setRevealedClues(1);
        setAnswered(false);
        setSelectedAnswer(null);
      } else {
        setGameComplete(true);
      }
    }, 2000);
  };

  if (characters.length === 0 || !currentCharacter) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const maxScore = characters.length * 5; // Max 5 points per character

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar style="dark" />

      {/* Initial Animation */}
      {showInitialAnimation && (
        <InitialAnimation onComplete={() => setShowInitialAnimation(false)} />
      )}

      {/* Header */}
      <View className="bg-white border-b border-slate-200">
        <View className="flex-row items-center justify-between px-4 py-3">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center active:bg-slate-200"
          >
            <FontAwesome name="arrow-left" size={18} color="#64748b" />
          </Pressable>

          <View className="items-center flex-1 mx-4">
            <Text className={`font-bold text-slate-800 ${isWeb ? 'text-xl' : 'text-lg'}`}>
              Who Am I?
            </Text>
          </View>

          <Pressable
            onPress={() => initializeGame(true)}
            className="w-10 h-10 rounded-full bg-cyan-50 items-center justify-center active:bg-cyan-100"
          >
            <FontAwesome name="refresh" size={18} color="#0891b2" />
          </Pressable>
        </View>

        {/* Progress */}
        <View className="px-4 pb-3">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-slate-500">
              Character {currentIndex + 1} of {characters.length}
            </Text>
            <Text className="text-sm font-semibold text-cyan-600">
              Score: {score}/{maxScore}
            </Text>
          </View>
          <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-cyan-500 rounded-full"
              style={{ width: `${((currentIndex + 1) / characters.length) * 100}%` }}
            />
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Mystery Card */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
            marginBottom: 20,
          }}
        >
          {/* Mystery icon */}
          <View className="items-center mb-4">
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#f1f5f9',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: answered ? 40 : 48 }}>
                {answered ? currentCharacter.emoji : '❓'}
              </Text>
            </View>
            {answered && (
              <Animated.View entering={FadeIn.duration(300)}>
                <Text className="text-xl font-bold text-slate-800 mt-2">
                  {currentCharacter.name}
                </Text>
                <Text className="text-base text-slate-500">{currentCharacter.hebrew}</Text>
              </Animated.View>
            )}
          </View>

          {/* Clues */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">
              Clues ({revealedClues}/5)
            </Text>
            {currentCharacter.clues.slice(0, revealedClues).map((clue, index) => (
              <Animated.View
                key={index}
                entering={SlideInRight.duration(300).delay(index * 100)}
                style={{
                  flexDirection: 'row',
                  marginBottom: 8,
                  backgroundColor: '#f8fafc',
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: '#0891b2',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: '700', fontSize: 12 }}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={{ flex: 1, color: '#334155', fontSize: 15, lineHeight: 22 }}>
                  {clue}
                </Text>
              </Animated.View>
            ))}
          </View>

          {/* Reveal More Button */}
          {!answered && revealedClues < 5 && (
            <Pressable
              onPress={handleRevealClue}
              style={{
                backgroundColor: '#f1f5f9',
                borderRadius: 10,
                padding: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#0891b2', fontWeight: '600' }}>
                Reveal Another Clue (-1 point)
              </Text>
            </Pressable>
          )}
        </View>

        {/* Answer Options */}
        <View>
          <Text className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">
            Who Am I?
          </Text>
          {options.map((option, index) => (
            <AnswerOption
              key={option.name}
              name={option.name}
              hebrew={option.hebrew}
              onPress={() => handleAnswer(option.name)}
              disabled={answered}
              isCorrect={answered && option.name === currentCharacter.name}
              isWrong={answered && selectedAnswer === option.name && option.name !== currentCharacter.name}
              index={index}
            />
          ))}
        </View>
      </ScrollView>

      {/* Victory Modal */}
      {gameComplete && (
        <VictoryScreen
          score={score}
          total={maxScore}
          onPlayAgain={initializeGame}
          onBackToHome={() => router.back()}
        />
      )}
    </SafeAreaView>
  );
}
