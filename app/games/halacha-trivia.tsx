import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Halacha trivia questions
const TRIVIA_QUESTIONS = [
  {
    id: 1,
    question: 'Which direction do we light the Chanukah candles?',
    options: ['Right to left', 'Left to right', 'Any direction', 'From the middle outward'],
    correctIndex: 1,
    explanation: 'We add candles from right to left, but light them from left to right, so we light the newest candle first.',
  },
  {
    id: 2,
    question: 'How many wicks must a Havdalah candle have?',
    options: ['At least 1', 'At least 2', 'Exactly 3', 'Exactly 4'],
    correctIndex: 1,
    explanation: 'A Havdalah candle must have at least 2 wicks to create a torch-like flame (avukah), though braided candles often have more.',
  },
  {
    id: 3,
    question: 'What is the bracha on wine?',
    options: ['Shehakol', 'Ha\'adamah', 'Borei Pri Hagafen', 'Mezonos'],
    correctIndex: 2,
    explanation: 'We say Borei Pri Hagafen on wine and grape juice because of their special importance.',
  },
  {
    id: 4,
    question: 'When do we say Kiddush Levanah (blessing on the moon)?',
    options: ['Every night', 'Once a month', 'Once a year', 'Only on Shabbos'],
    correctIndex: 1,
    explanation: 'Kiddush Levanah is said once a month when the moon is visible, ideally after the first 3 days of the new month.',
  },
  {
    id: 5,
    question: 'What must a Kosher animal have to be considered Kosher?',
    options: ['Feathers and wings', 'Split hooves and chews cud', 'Fins and scales', 'Four legs'],
    correctIndex: 1,
    explanation: 'A Kosher land animal must have fully split hooves AND chew its cud (ruminant). Both signs are required.',
  },
  {
    id: 6,
    question: 'How many brachos are in Birkas Hamazon (Grace After Meals)?',
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
    explanation: 'Birkas Hamazon has 4 main brachos: thanking for food, for the Land, for Jerusalem, and for Hashem\'s goodness.',
  },
  {
    id: 7,
    question: 'What is forbidden during the Nine Days before Tisha B\'Av?',
    options: ['Eating bread', 'Eating meat and drinking wine', 'Going to work', 'Saying brachos'],
    correctIndex: 1,
    explanation: 'During the Nine Days, we refrain from eating meat and drinking wine (except on Shabbos) as a sign of mourning.',
  },
  {
    id: 8,
    question: 'How many men are needed for a minyan?',
    options: ['7', '10', '12', '13'],
    correctIndex: 1,
    explanation: 'A minyan requires 10 adult Jewish men (over Bar Mitzvah age) to recite certain prayers like Kaddish and Kedusha.',
  },
  {
    id: 9,
    question: 'What bracha do we say when seeing lightning?',
    options: ['Borei Meorei Ha\'eish', 'Oseh Maaseh Bereishis', 'Shehecheyanu', 'Hagomel'],
    correctIndex: 1,
    explanation: 'We say Oseh Maaseh Bereishis (Who makes the works of creation) when seeing lightning.',
  },
  {
    id: 10,
    question: 'What is the purpose of the Eruv around a community?',
    options: ['To mark Jewish areas', 'To allow carrying on Shabbos', 'To protect from harm', 'For decoration'],
    correctIndex: 1,
    explanation: 'An Eruv creates a symbolic private domain that permits carrying objects outdoors on Shabbos within its boundaries.',
  },
  {
    id: 11,
    question: 'When must we hear the Shofar?',
    options: ['Every Shabbos', 'On Rosh Hashanah', 'On Pesach', 'Every Monday and Thursday'],
    correctIndex: 1,
    explanation: 'We are commanded to hear the Shofar on Rosh Hashanah (unless it falls on Shabbos).',
  },
  {
    id: 12,
    question: 'What is Bitul Chametz?',
    options: ['Selling chametz', 'Nullifying chametz in our hearts', 'Burning chametz', 'Hiding chametz'],
    correctIndex: 1,
    explanation: 'Bitul Chametz is the verbal declaration nullifying any chametz we may have missed, making it ownerless in our minds.',
  },
  {
    id: 13,
    question: 'How many fasts are there in the Jewish calendar (excluding Yom Kippur)?',
    options: ['3', '4', '5', '6'],
    correctIndex: 2,
    explanation: 'There are 5 minor fasts: Tzom Gedaliah, 10 Teves, Taanis Esther, 17 Tammuz, and Tisha B\'Av (which is major).',
  },
  {
    id: 14,
    question: 'What is the bracha on smelling spices?',
    options: ['Borei Minei Besamim', 'Shehakol', 'Ha\'eitz', 'Hagafen'],
    correctIndex: 0,
    explanation: 'We say Borei Minei Besamim on fragrant spices, including during Havdalah.',
  },
  {
    id: 15,
    question: 'What must be checked before eating a vegetable for bugs?',
    options: ['The color', 'Leaves and crevices for insects', 'The weight', 'The smell'],
    correctIndex: 1,
    explanation: 'Certain vegetables like lettuce and broccoli must be carefully checked for insects, which are forbidden to eat.',
  },
];

interface AnswerOptionProps {
  option: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean;
  isRevealed: boolean;
  onPress: () => void;
  disabled: boolean;
}

function AnswerOption({
  option,
  index,
  isSelected,
  isCorrect,
  isRevealed,
  onPress,
  disabled,
}: AnswerOptionProps) {
  const scale = useSharedValue(1);
  const isHovered = useSharedValue(0);
  const letters = ['A', 'B', 'C', 'D'];
  const isWeb = Platform.OS === 'web';

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handleHoverIn = () => {
    if (!disabled) {
      isHovered.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  const handleHoverOut = () => {
    isHovered.value = withSpring(0, { damping: 15, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: isHovered.value * -2 },
    ],
    shadowOpacity: 0.1 + isHovered.value * 0.15,
    shadowRadius: 8 + isHovered.value * 8,
  }));

  const getBgColor = () => {
    if (!isRevealed) {
      return isSelected ? '#ede9fe' : 'white';
    }
    if (isCorrect) {
      return '#dcfce7';
    }
    if (isSelected && !isCorrect) {
      return '#fee2e2';
    }
    return 'white';
  };

  const getBorderColor = () => {
    if (!isRevealed) {
      return isSelected ? '#7c3aed' : '#e2e8f0';
    }
    if (isCorrect) {
      return '#22c55e';
    }
    if (isSelected && !isCorrect) {
      return '#ef4444';
    }
    return '#e2e8f0';
  };

  const getLetterBgColor = () => {
    if (!isRevealed) {
      return isSelected ? '#7c3aed' : '#8b5cf6';
    }
    if (isCorrect) {
      return '#22c55e';
    }
    if (isSelected && !isCorrect) {
      return '#ef4444';
    }
    return '#8b5cf6';
  };

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
          marginBottom: 12,
          borderRadius: 16,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onHoverIn={isWeb ? handleHoverIn : undefined}
        onHoverOut={isWeb ? handleHoverOut : undefined}
        disabled={disabled}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: getBgColor(),
          borderWidth: 2,
          borderColor: getBorderColor(),
          borderRadius: 16,
          padding: 16,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: getLetterBgColor(),
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 14,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            {letters[index]}
          </Text>
        </View>
        <Text
          style={{
            flex: 1,
            fontSize: 16,
            color: '#1e293b',
            fontWeight: isSelected || (isRevealed && isCorrect) ? '600' : '400',
          }}
        >
          {option}
        </Text>
        {isRevealed && isCorrect && (
          <FontAwesome name="check-circle" size={24} color="#22c55e" />
        )}
        {isRevealed && isSelected && !isCorrect && (
          <FontAwesome name="times-circle" size={24} color="#ef4444" />
        )}
      </Pressable>
    </Animated.View>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const progress = (current / total) * 100;

  return (
    <View style={{ height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
      <View
        style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: '#8b5cf6',
          borderRadius: 3,
        }}
      />
    </View>
  );
}

function ConfettiParticle({ index }: { index: number }) {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const emojis = ['✨', '📖', '⭐', '🌟', '✡️', '🎉', '💜'];
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
    <Animated.View
      style={[
        animStyle,
        {
          position: 'absolute',
          left: `${startLeft}%`,
          top: -50,
        },
      ]}
    >
      <Text style={{ fontSize }}>{emoji}</Text>
    </Animated.View>
  );
}

function Confetti() {
  return (
    <View
      style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 100 }}
      pointerEvents="none"
    >
      {Array.from({ length: 40 }).map((_, i) => (
        <ConfettiParticle key={i} index={i} />
      ))}
    </View>
  );
}

function ResultsScreen({
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
  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    trophyScale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 100 }));
  }, [trophyScale]);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }],
  }));

  const getEmoji = () => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 70) return '🌟';
    if (percentage >= 50) return '👍';
    return '📚';
  };

  const getMessage = () => {
    if (percentage >= 90) return 'Outstanding!';
    if (percentage >= 70) return 'Great Job!';
    if (percentage >= 50) return 'Good Effort!';
    return 'Keep Learning!';
  };

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
      {percentage >= 70 && <Confetti />}

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
          <Text style={{ fontSize: 72 }}>{getEmoji()}</Text>
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
          {getMessage()}
        </Text>

        <Animated.View entering={FadeIn.duration(400).delay(500)} style={{ marginTop: 28, width: '100%' }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#f5f3ff',
              borderRadius: 20,
              paddingVertical: 24,
              paddingHorizontal: 24,
            }}
          >
            <Text
              style={{
                fontSize: 48,
                fontWeight: 'bold',
                color: '#7c3aed',
              }}
            >
              {score}/{total}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: '#6d28d9',
                marginTop: 8,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                fontWeight: '600',
              }}
            >
              Correct Answers
            </Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: '#8b5cf6',
                marginTop: 8,
              }}
            >
              {percentage}%
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(800)} style={{ width: '100%', marginTop: 28 }}>
          <Pressable
            onPress={onPlayAgain}
            style={{
              backgroundColor: '#8b5cf6',
              borderRadius: 16,
              paddingVertical: 18,
              paddingHorizontal: 32,
              shadowColor: '#8b5cf6',
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

          <Pressable
            onPress={onBackToHome}
            style={{
              marginTop: 16,
              paddingVertical: 14,
            }}
          >
            <Text style={{ color: '#64748b', fontWeight: '600', fontSize: 16, textAlign: 'center' }}>
              Back to Home
            </Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}


export default function HalachaTriviaGame() {
  const isWeb = Platform.OS === 'web';
  const { width: screenWidth } = useWindowDimensions();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<typeof TRIVIA_QUESTIONS>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const questionTransition = useSharedValue(1);
  const refreshRotation = useSharedValue(0);

  const initializeGame = useCallback(() => {
    const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsRevealed(false);
    setScore(0);
    setIsComplete(false);
    questionTransition.value = 1;
  }, [questionTransition]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleAnswerSelect = (index: number) => {
    if (isRevealed) return;
    setSelectedAnswer(index);

    // Auto-submit the answer
    setIsRevealed(true);
    if (index === shuffledQuestions[currentQuestionIndex].correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      questionTransition.value = withSequence(
        withTiming(0, { duration: 150, easing: Easing.in(Easing.cubic) }),
        withTiming(1, { duration: 150, easing: Easing.out(Easing.cubic) })
      );
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsRevealed(false);
      }, 150);
    } else {
      setIsComplete(true);
    }
  };

  const questionContainerStyle = useAnimatedStyle(() => ({
    opacity: questionTransition.value,
    transform: [{ scale: 0.95 + questionTransition.value * 0.05 }],
  }));

  const handleRefresh = useCallback(() => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    refreshRotation.value = withSequence(
      withTiming(360, { duration: 500, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 0 })
    );
    setTimeout(() => {
      initializeGame();
      setIsRefreshing(false);
    }, 300);
  }, [initializeGame, isRefreshing, refreshRotation]);

  const refreshButtonStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${refreshRotation.value}deg` }],
  }));

  if (shuffledQuestions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const maxWidth = Math.min(screenWidth - 32, 600);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar style="dark" />

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
              Halacha Trivia
            </Text>
          </View>

          <Pressable
            onPress={handleRefresh}
            className="w-10 h-10 rounded-full bg-violet-50 items-center justify-center active:bg-violet-100"
          >
            <Animated.View style={refreshButtonStyle}>
              <FontAwesome name="refresh" size={18} color="#8b5cf6" />
            </Animated.View>
          </Pressable>
        </View>

        {/* Progress */}
        <View className="px-4 py-3 bg-slate-50 border-t border-slate-100">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-slate-500">
              Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
            </Text>
            <Text className="text-sm text-violet-600 font-semibold">Score: {score}</Text>
          </View>
          <ProgressBar current={currentQuestionIndex + 1} total={shuffledQuestions.length} />
        </View>
      </View>

      {/* Question Area */}
      <View className="flex-1 items-center px-4 py-6">
        <Animated.View style={[questionContainerStyle, { width: '100%', maxWidth }]}>
          {/* Question Card */}
          <Animated.View
            entering={FadeInDown.duration(400)}
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 24,
              marginBottom: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: isWeb ? 20 : 18,
                fontWeight: '600',
                color: '#1e293b',
                lineHeight: isWeb ? 28 : 26,
                textAlign: 'center',
              }}
            >
              {currentQuestion.question}
            </Text>
          </Animated.View>

          {/* Answer Options */}
          <View>
            {currentQuestion.options.map((option, index) => (
              <AnswerOption
                key={index}
                option={option}
                index={index}
                isSelected={selectedAnswer === index}
                isCorrect={index === currentQuestion.correctIndex}
                isRevealed={isRevealed}
                onPress={() => handleAnswerSelect(index)}
                disabled={isRevealed}
              />
            ))}
          </View>

          {/* Explanation (shown after reveal) */}
          {isRevealed && (
            <Animated.View
              entering={FadeIn.duration(300)}
              style={{
                backgroundColor: '#f5f3ff',
                borderRadius: 12,
                padding: 16,
                marginTop: 8,
                borderLeftWidth: 4,
                borderLeftColor: '#8b5cf6',
              }}
            >
              <Text style={{ fontSize: 14, color: '#5b21b6', lineHeight: 20 }}>
                {currentQuestion.explanation}
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      </View>

      {/* Bottom Button - only show after answer is revealed */}
      {isRevealed && (
        <Animated.View
          entering={FadeIn.duration(300)}
          className="bg-white border-t border-slate-200 px-4 py-4"
        >
          <View style={{ maxWidth, width: '100%', alignSelf: 'center' }}>
            <Pressable
              onPress={handleNext}
              style={{
                backgroundColor: '#8b5cf6',
                borderRadius: 16,
                paddingVertical: 16,
                shadowColor: '#8b5cf6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 16,
                  textAlign: 'center',
                }}
              >
                {currentQuestionIndex < shuffledQuestions.length - 1 ? 'Next Question' : 'See Results'}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      )}

      {/* Results Modal */}
      {isComplete && (
        <ResultsScreen
          score={score}
          total={shuffledQuestions.length}
          onPlayAgain={initializeGame}
          onBackToHome={() => router.back()}
        />
      )}
    </SafeAreaView>
  );
}
