import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
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
  runOnJS,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Jewish Holidays True/False questions
const QUESTIONS = [
  { statement: 'Chanukah is celebrated for 8 days.', answer: true, explanation: 'Chanukah is celebrated for 8 days, commemorating the miracle of the oil lasting 8 days.' },
  { statement: 'We eat matzah on Sukkos.', answer: false, explanation: 'We eat matzah on Pesach. On Sukkos, we dwell in the sukkah and shake the lulav and esrog.' },
  { statement: 'Purim celebrates the miracle of the oil.', answer: false, explanation: 'Purim celebrates the salvation of the Jewish people from Haman. The oil miracle is celebrated on Chanukah.' },
  { statement: 'Shavuos celebrates the giving of the Torah.', answer: true, explanation: 'Shavuos commemorates Matan Torah - when Hashem gave the Torah to the Jewish people at Har Sinai.' },
  { statement: 'We blow the shofar on Yom Kippur.', answer: true, explanation: 'We blow the shofar at the end of Yom Kippur (Ne\'ilah), signaling the end of the fast.' },
  { statement: 'Tu B\'Shvat is the New Year for animals.', answer: false, explanation: 'Tu B\'Shvat is the New Year for trees. There is no separate New Year for animals.' },
  { statement: 'On Pesach, we have a Seder on the first two nights (outside Israel).', answer: true, explanation: 'Outside of Israel, we conduct the Pesach Seder on both the first and second nights.' },
  { statement: 'Tisha B\'Av is a day of celebration.', answer: false, explanation: 'Tisha B\'Av is a day of mourning, commemorating the destruction of both Batei Mikdash.' },
  { statement: 'We read Megillas Esther on Purim.', answer: true, explanation: 'Reading Megillas Esther is one of the main mitzvos of Purim, done both at night and during the day.' },
  { statement: 'Rosh Hashanah is one day in Israel and two days outside.', answer: false, explanation: 'Rosh Hashanah is two days both in Israel and outside of Israel.' },
  { statement: 'We fast on Purim.', answer: false, explanation: 'We do not fast on Purim. We fast on Taanis Esther (the day before Purim).' },
  { statement: 'Simchas Torah celebrates completing the Torah reading cycle.', answer: true, explanation: 'Simchas Torah marks the completion of the annual Torah reading cycle and immediately beginning again.' },
  { statement: 'Lag B\'Omer is the 33rd day of the Omer.', answer: true, explanation: 'Lag B\'Omer (ל"ג = 33) is the 33rd day of counting the Omer, between Pesach and Shavuos.' },
  { statement: 'We light candles for 7 days on Chanukah.', answer: false, explanation: 'We light Chanukah candles for 8 nights, adding one candle each night.' },
  { statement: 'The Four Species are used on Sukkos.', answer: true, explanation: 'The Arba Minim (lulav, esrog, hadasim, and aravos) are waved on Sukkos.' },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function ConfettiParticle({ index }: { index: number }) {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const emojis = ['✨', '🕎', '🎊', '🎉', '🍎', '📜', '🌿'];
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

// Inline Results Display
function InlineResults({
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
  const cardScale = useSharedValue(0.9);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 400 });
    cardScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    trophyScale.value = withDelay(200, withSpring(1, { damping: 8, stiffness: 100 }));
  }, [trophyScale, cardScale, cardOpacity]);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const percentage = Math.round((score / total) * 100);
  const getMessage = () => {
    if (percentage === 100) return 'Perfect! You know your Yomim Tovim!';
    if (percentage >= 80) return 'Excellent work!';
    if (percentage >= 60) return 'Good job! Keep learning!';
    return 'Keep practicing!';
  };

  const getEmoji = () => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 70) return '🌟';
    if (percentage >= 50) return '👍';
    return '📚';
  };

  return (
    <Animated.View style={cardStyle}>
      {percentage >= 70 && <Confetti />}

      {/* Results Card */}
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 24,
          padding: 28,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 8,
          alignItems: 'center',
        }}
      >
        <Animated.View style={trophyStyle}>
          <Text style={{ fontSize: 64 }}>{getEmoji()}</Text>
        </Animated.View>

        <Text
          style={{
            fontWeight: 'bold',
            color: '#1e293b',
            marginTop: 16,
            fontSize: isWeb ? 28 : 24,
            textAlign: 'center',
          }}
        >
          {percentage >= 60 ? 'Mazal Tov!' : 'Game Over'}
        </Text>
        <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 8, fontSize: 15 }}>
          {getMessage()}
        </Text>

        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#fff7ed',
            borderRadius: 16,
            paddingVertical: 20,
            paddingHorizontal: 32,
            marginTop: 20,
            width: '100%',
          }}
        >
          <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#ea580c' }}>
            {score}/{total}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#c2410c',
              marginTop: 6,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              fontWeight: '600',
            }}
          >
            Correct
          </Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#f97316', marginTop: 6 }}>
            {percentage}%
          </Text>
        </View>

        <View style={{ width: '100%', marginTop: 20 }}>
          <Pressable
            onPress={onPlayAgain}
            style={{
              backgroundColor: '#ea580c',
              borderRadius: 14,
              paddingVertical: 16,
              shadowColor: '#ea580c',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
              Play Again
            </Text>
          </Pressable>

          <Pressable onPress={onBackToHome} style={{ marginTop: 12, paddingVertical: 12 }}>
            <Text style={{ color: '#64748b', fontWeight: '600', fontSize: 15, textAlign: 'center' }}>
              Back to Home
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

export default function HolidaysTrueFalseGame() {
  const isWeb = Platform.OS === 'web';
  const [questions, setQuestions] = useState<typeof QUESTIONS>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const cardScale = useSharedValue(1);
  const cardOpacity = useSharedValue(1);
  const trueHover = useSharedValue(0);
  const falseHover = useSharedValue(0);
  const refreshRotation = useSharedValue(0);
  const backButtonHover = useSharedValue(0);
  const refreshButtonHover = useSharedValue(0);
  const contentTransition = useSharedValue(1);

  const initializeGame = useCallback(() => {
    const shuffled = shuffleArray(QUESTIONS).slice(0, 10);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setShowFeedback(false);
    setGameComplete(false);
    setAnswered(false);
    cardScale.value = 1;
    cardOpacity.value = 1;
    contentTransition.value = 1;
  }, [cardScale, cardOpacity, contentTransition]);

  const handleRefresh = useCallback(() => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    // Spin the refresh button
    refreshRotation.value = withSequence(
      withTiming(360, { duration: 500, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 0 })
    );

    // Animate content out and back in
    contentTransition.value = withSequence(
      withTiming(0, { duration: 200, easing: Easing.in(Easing.cubic) }),
      withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) })
    );

    setTimeout(() => {
      initializeGame();
      setIsRefreshing(false);
    }, 200);
  }, [initializeGame, isRefreshing, refreshRotation, contentTransition]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const trueButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: trueHover.value * -3 }],
    shadowOpacity: 0.3 + trueHover.value * 0.2,
  }));

  const falseButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: falseHover.value * -3 }],
    shadowOpacity: 0.3 + falseHover.value * 0.2,
  }));

  const refreshButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${refreshRotation.value}deg` },
      { scale: 1 + refreshButtonHover.value * 0.1 },
    ],
  }));

  const backButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + backButtonHover.value * 0.1 }],
  }));

  const contentContainerStyle = useAnimatedStyle(() => ({
    opacity: contentTransition.value,
    transform: [{ scale: 0.95 + contentTransition.value * 0.05 }],
  }));

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (userAnswer: boolean) => {
    if (answered || !currentQuestion) return;
    setAnswered(true);

    const isCorrect = userAnswer === currentQuestion.answer;
    setLastAnswerCorrect(isCorrect);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setShowFeedback(true);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        cardOpacity.value = withTiming(0, { duration: 200 }, () => {
          runOnJS(moveToNext)();
        });
      } else {
        setGameComplete(true);
      }
    }, 2000);
  };

  const moveToNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setShowFeedback(false);
    setAnswered(false);
    cardOpacity.value = withTiming(1, { duration: 300 });
  };

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  if (questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="bg-white border-b border-slate-200">
        <View className="flex-row items-center justify-between px-4 py-3">
          <Animated.View style={backButtonStyle}>
            <Pressable
              onPress={() => router.back()}
              onHoverIn={isWeb ? () => { backButtonHover.value = withSpring(1, { damping: 15, stiffness: 400 }); } : undefined}
              onHoverOut={isWeb ? () => { backButtonHover.value = withSpring(0, { damping: 15, stiffness: 400 }); } : undefined}
              className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center active:bg-slate-200"
            >
              <FontAwesome name="arrow-left" size={18} color="#64748b" />
            </Pressable>
          </Animated.View>

          <View className="items-center flex-1 mx-4">
            <Text className={`font-bold text-slate-800 ${isWeb ? 'text-xl' : 'text-lg'}`}>
              Holidays True or False
            </Text>
          </View>

          <Pressable
            onPress={handleRefresh}
            onHoverIn={isWeb ? () => { refreshButtonHover.value = withSpring(1, { damping: 15, stiffness: 400 }); } : undefined}
            onHoverOut={isWeb ? () => { refreshButtonHover.value = withSpring(0, { damping: 15, stiffness: 400 }); } : undefined}
            className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center active:bg-orange-100"
          >
            <Animated.View style={refreshButtonStyle}>
              <FontAwesome name="refresh" size={18} color="#ea580c" />
            </Animated.View>
          </Pressable>
        </View>

        {/* Progress Bar */}
        <View className="px-4 pb-3">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-slate-500">
              Question {currentIndex + 1} of {questions.length}
            </Text>
            <Text className="text-sm font-semibold text-orange-600">Score: {score}</Text>
          </View>
          <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-orange-500 rounded-full"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </View>
        </View>
      </View>

      {/* Game Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
      >
        <Animated.View style={contentContainerStyle}>
          {!gameComplete ? (
            <Animated.View style={cardStyle}>
              {/* Question Card */}
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 20,
                  padding: 24,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 5,
                  minHeight: 200,
                }}
              >
                <Text
                  className="text-center text-slate-800 font-semibold"
                  style={{ fontSize: isWeb ? 22 : 20, lineHeight: isWeb ? 32 : 28 }}
                >
                  {currentQuestion?.statement}
                </Text>

                {/* Feedback */}
                {showFeedback && (
                  <Animated.View entering={FadeInDown.duration(300)} className="mt-6">
                    <View
                      className={`rounded-xl p-4 ${
                        lastAnswerCorrect ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <View className="flex-row items-center mb-2">
                        <FontAwesome
                          name={lastAnswerCorrect ? 'check-circle' : 'times-circle'}
                          size={20}
                          color={lastAnswerCorrect ? '#22c55e' : '#ef4444'}
                        />
                        <Text
                          className={`font-bold ml-2 ${
                            lastAnswerCorrect ? 'text-green-700' : 'text-red-700'
                          }`}
                        >
                          {lastAnswerCorrect ? 'Correct!' : 'Incorrect'}
                        </Text>
                      </View>
                      <Text
                        className={lastAnswerCorrect ? 'text-green-600' : 'text-red-600'}
                        style={{ fontSize: 14 }}
                      >
                        {currentQuestion?.explanation}
                      </Text>
                    </View>
                  </Animated.View>
                )}
              </View>

              {/* Answer Buttons */}
              {!showFeedback && (
                <View className="flex-row mt-8" style={{ gap: 16 }}>
                  <Animated.View style={[trueButtonStyle, { flex: 1 }]}>
                    <Pressable
                      onPress={() => handleAnswer(true)}
                      onHoverIn={isWeb ? () => { trueHover.value = withSpring(1, { damping: 15, stiffness: 400 }); } : undefined}
                      onHoverOut={isWeb ? () => { trueHover.value = withSpring(0, { damping: 15, stiffness: 400 }); } : undefined}
                      disabled={answered}
                      style={{
                        backgroundColor: '#22c55e',
                        borderRadius: 16,
                        paddingVertical: 20,
                        alignItems: 'center',
                        shadowColor: '#22c55e',
                        shadowOffset: { width: 0, height: 4 },
                        shadowRadius: 8,
                        elevation: 5,
                        opacity: answered ? 0.6 : 1,
                      }}
                    >
                      <FontAwesome name="check" size={28} color="white" />
                      <Text className="text-white font-bold text-lg mt-2">TRUE</Text>
                    </Pressable>
                  </Animated.View>

                  <Animated.View style={[falseButtonStyle, { flex: 1 }]}>
                    <Pressable
                      onPress={() => handleAnswer(false)}
                      onHoverIn={isWeb ? () => { falseHover.value = withSpring(1, { damping: 15, stiffness: 400 }); } : undefined}
                      onHoverOut={isWeb ? () => { falseHover.value = withSpring(0, { damping: 15, stiffness: 400 }); } : undefined}
                      disabled={answered}
                      style={{
                        backgroundColor: '#ef4444',
                        borderRadius: 16,
                        paddingVertical: 20,
                        alignItems: 'center',
                        shadowColor: '#ef4444',
                        shadowOffset: { width: 0, height: 4 },
                        shadowRadius: 8,
                        elevation: 5,
                        opacity: answered ? 0.6 : 1,
                      }}
                    >
                      <FontAwesome name="times" size={28} color="white" />
                      <Text className="text-white font-bold text-lg mt-2">FALSE</Text>
                    </Pressable>
                  </Animated.View>
                </View>
              )}
            </Animated.View>
          ) : (
            <InlineResults
              score={score}
              total={questions.length}
              onPlayAgain={handleRefresh}
              onBackToHome={() => router.back()}
            />
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
