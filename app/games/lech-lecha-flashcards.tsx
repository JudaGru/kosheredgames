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
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Parshas Lech Lecha trivia questions
const QUESTION_DATA = [
  {
    id: 1,
    question: 'What did Hashem tell Avram to leave behind?',
    answer: 'His land, his birthplace, and his father\'s house',
    source: 'Bereishis 12:1',
  },
  {
    id: 2,
    question: 'Where did Hashem tell Avram to go?',
    answer: 'To the land that Hashem would show him (Eretz Canaan)',
    source: 'Bereishis 12:1',
  },
  {
    id: 3,
    question: 'What blessing did Hashem promise Avram?',
    answer: 'To make him a great nation, bless him, and make his name great',
    source: 'Bereishis 12:2',
  },
  {
    id: 4,
    question: 'Who went with Avram when he left Charan?',
    answer: 'His wife Sarai, his nephew Lot, and the people they had gathered',
    source: 'Bereishis 12:5',
  },
  {
    id: 5,
    question: 'How old was Avram when he left Charan?',
    answer: '75 years old',
    source: 'Bereishis 12:4',
  },
  {
    id: 6,
    question: 'Why did Avram go down to Mitzrayim (Egypt)?',
    answer: 'There was a famine in the land',
    source: 'Bereishis 12:10',
  },
  {
    id: 7,
    question: 'Why did Avram and Lot separate?',
    answer: 'Their shepherds were quarreling because the land couldn\'t support both their flocks',
    source: 'Bereishis 13:6-7',
  },
  {
    id: 8,
    question: 'Which area did Lot choose to settle in?',
    answer: 'The plain of the Jordan, near Sodom',
    source: 'Bereishis 13:11',
  },
  {
    id: 9,
    question: 'What did Avram do when Lot was captured in the war of the four kings?',
    answer: 'He gathered 318 trained men and pursued the kings to rescue Lot',
    source: 'Bereishis 14:14-16',
  },
  {
    id: 10,
    question: 'Who was Malki-Tzedek and what did he bring to Avram?',
    answer: 'King of Shalem (Jerusalem), a Kohen - he brought bread and wine',
    source: 'Bereishis 14:18',
  },
  {
    id: 11,
    question: 'What did Hashem promise Avram in the Bris Bein HaBesarim (Covenant)?',
    answer: 'That his descendants would be as numerous as the stars',
    source: 'Bereishis 15:5',
  },
  {
    id: 12,
    question: 'Who was Hagar and how did she become part of Avram\'s household?',
    answer: 'An Egyptian maidservant given to Sarai by Pharaoh',
    source: 'Bereishis 16:1, Rashi',
  },
  {
    id: 13,
    question: 'What was the name of Avram and Hagar\'s son?',
    answer: 'Yishmael',
    source: 'Bereishis 16:11',
  },
  {
    id: 14,
    question: 'What mitzvah did Hashem give Avram at age 99?',
    answer: 'Bris Milah (circumcision)',
    source: 'Bereishis 17:10',
  },
  {
    id: 15,
    question: 'What new names did Hashem give to Avram and Sarai?',
    answer: 'Avraham and Sarah',
    source: 'Bereishis 17:5, 17:15',
  },
];

// Animated button component with hover effects
interface AnimatedButtonProps {
  onPress: () => void;
  disabled?: boolean;
  style?: 'primary' | 'secondary' | 'success' | 'ghost' | 'icon' | 'iconPrimary';
  children: React.ReactNode;
  className?: string;
  customStyle?: object;
}

function AnimatedButton({
  onPress,
  disabled = false,
  style = 'primary',
  children,
  className = '',
  customStyle = {},
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const isHovered = useSharedValue(0);

  const handleHoverIn = () => {
    if (disabled) return;
    isHovered.value = 1;
    scale.value = withSpring(1.03, { damping: 15, stiffness: 400 });
    translateY.value = withSpring(-2, { damping: 15, stiffness: 400 });
  };

  const handleHoverOut = () => {
    isHovered.value = 0;
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    translateY.value = withSpring(0, { damping: 12, stiffness: 300 });
  };

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
    opacity.value = withTiming(0.85, { duration: 100 });
    translateY.value = withSpring(2, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    if (isHovered.value === 1) {
      scale.value = withSpring(1.03, { damping: 12, stiffness: 300 });
      translateY.value = withSpring(-2, { damping: 12, stiffness: 300 });
    } else {
      scale.value = withSpring(1, { damping: 12, stiffness: 300 });
      translateY.value = withSpring(0, { damping: 12, stiffness: 300 });
    }
    opacity.value = withTiming(1, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: disabled ? 0.5 : opacity.value,
  }));

  const getStyleConfig = () => {
    switch (style) {
      case 'primary':
        return {
          backgroundColor: '#6366f1',
          shadowColor: '#6366f1',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        };
      case 'secondary':
        return {
          backgroundColor: '#f1f5f9',
        };
      case 'success':
        return {
          backgroundColor: '#10b981',
          shadowColor: '#10b981',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      case 'icon':
        return {
          backgroundColor: '#f1f5f9',
        };
      case 'iconPrimary':
        return {
          backgroundColor: '#eef2ff',
        };
      default:
        return {};
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      disabled={disabled}
      style={{ cursor: disabled ? 'default' : 'pointer' } as any}
    >
      <Animated.View style={[animatedStyle, getStyleConfig(), customStyle]} className={className}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

// Animated refresh button with spin effect
interface RefreshButtonProps {
  onPress: () => void;
}

function RefreshButton({ onPress }: RefreshButtonProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const isHovered = useSharedValue(0);

  const handleHoverIn = () => {
    isHovered.value = 1;
    scale.value = withSpring(1.08, { damping: 15, stiffness: 400 });
    translateY.value = withSpring(-2, { damping: 15, stiffness: 400 });
  };

  const handleHoverOut = () => {
    isHovered.value = 0;
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    translateY.value = withSpring(0, { damping: 12, stiffness: 300 });
  };

  const handlePress = () => {
    rotation.value = withTiming(rotation.value + 360, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(isHovered.value === 1 ? 1.08 : 1, { damping: 12, stiffness: 300 })
    );
    onPress();
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
    translateY.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    if (isHovered.value === 1) {
      scale.value = withSpring(1.08, { damping: 12, stiffness: 300 });
      translateY.value = withSpring(-2, { damping: 12, stiffness: 300 });
    } else {
      scale.value = withSpring(1, { damping: 12, stiffness: 300 });
      translateY.value = withSpring(0, { damping: 12, stiffness: 300 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }, { rotate: `${rotation.value}deg` }],
  }));

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={{ cursor: 'pointer' } as any}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#eef2ff',
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <FontAwesome name="refresh" size={18} color="#6366f1" />
      </Animated.View>
    </Pressable>
  );
}

interface FlashcardProps {
  card: (typeof QUESTION_DATA)[0];
  isFlipped: boolean;
  onFlip: () => void;
  cardWidth: number;
  cardHeight: number;
}

function Flashcard({ card, isFlipped, onFlip, cardWidth, cardHeight }: FlashcardProps) {
  const flipProgress = useSharedValue(0);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    flipProgress.value = withTiming(isFlipped ? 1 : 0, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  }, [isFlipped, flipProgress]);

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${interpolate(flipProgress.value, [0, 1], [0, 180])}deg` },
      { scale: pressScale.value },
    ],
    opacity: flipProgress.value < 0.5 ? 1 : 0,
    backfaceVisibility: 'hidden' as const,
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${interpolate(flipProgress.value, [0, 1], [180, 360])}deg` },
      { scale: pressScale.value },
    ],
    opacity: flipProgress.value >= 0.5 ? 1 : 0,
    backfaceVisibility: 'hidden' as const,
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Pressable
      onPress={onFlip}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ width: cardWidth, height: cardHeight }}
    >
      {/* Front of card - Question */}
      <Animated.View
        style={[
          frontAnimatedStyle,
          {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 28,
            shadowColor: '#6366f1',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 8,
            borderWidth: 1,
            borderColor: '#e2e8f0',
          },
        ]}
      >
        <View
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            backgroundColor: '#f0fdf4',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
          }}
        >
          <Text style={{ fontSize: 12, color: '#16a34a', fontWeight: '600' }}>Question</Text>
        </View>

        <Text
          style={{
            fontSize: Math.min(cardWidth * 0.065, 24),
            fontWeight: '600',
            color: '#1e293b',
            textAlign: 'center',
            lineHeight: Math.min(cardWidth * 0.065, 24) * 1.5,
          }}
        >
          {card.question}
        </Text>

        <View
          style={{
            position: 'absolute',
            bottom: 24,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#f8fafc',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 20,
          }}
        >
          <FontAwesome name="hand-pointer-o" size={14} color="#94a3b8" />
          <Text style={{ fontSize: 13, color: '#64748b', fontWeight: '500' }}>
            Tap to reveal answer
          </Text>
        </View>
      </Animated.View>

      {/* Back of card - Answer */}
      <Animated.View
        style={[
          backAnimatedStyle,
          {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#6366f1',
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 28,
            shadowColor: '#6366f1',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.3,
            shadowRadius: 24,
            elevation: 8,
          },
        ]}
      >
        <View
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            backgroundColor: 'rgba(255,255,255,0.2)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
          }}
        >
          <Text style={{ fontSize: 12, color: 'white', fontWeight: '600' }}>Answer</Text>
        </View>

        <Text
          style={{
            fontSize: Math.min(cardWidth * 0.06, 22),
            fontWeight: '700',
            color: 'white',
            textAlign: 'center',
            lineHeight: Math.min(cardWidth * 0.06, 22) * 1.5,
            marginBottom: 20,
          }}
        >
          {card.answer}
        </Text>

        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 16,
            paddingVertical: 12,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.9)',
              textAlign: 'center',
              fontWeight: '500',
            }}
          >
            {card.source}
          </Text>
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: 24,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <FontAwesome name="hand-pointer-o" size={14} color="rgba(255,255,255,0.5)" />
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>
            Tap to see question
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// Progress bar component
function ProgressBar({
  total,
  current,
  knownCards,
}: {
  total: number;
  current: number;
  knownCards: Set<number>;
}) {
  const progress = ((current + 1) / total) * 100;

  return (
    <View style={{ width: '100%' }}>
      <View
        style={{
          height: 6,
          backgroundColor: '#e2e8f0',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#6366f1',
            borderRadius: 3,
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', marginTop: 12, gap: 4, flexWrap: 'wrap' }}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor:
                i === current ? '#6366f1' : knownCards.has(i) ? '#10b981' : '#e2e8f0',
            }}
          />
        ))}
      </View>
    </View>
  );
}

// Confetti particle component
function ConfettiParticle({ index }: { index: number }) {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const emojis = ['✨', '⭐', '🌟', '🎊', '🎉', '💫', '🏕️', '🐪', '🌙'];
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

// Completion screen
function CompletionScreen({
  knownCount,
  totalCount,
  onStudyAgain,
  onBackToHome,
}: {
  knownCount: number;
  totalCount: number;
  onStudyAgain: () => void;
  onBackToHome: () => void;
}) {
  const isWeb = Platform.OS === 'web';
  const trophyScale = useSharedValue(0);

  useEffect(() => {
    trophyScale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 100 }));
  }, [trophyScale]);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }],
  }));

  const percentage = Math.round((knownCount / totalCount) * 100);

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Confetti />

      <Animated.View
        entering={FadeIn.duration(400).delay(200)}
        style={{
          backgroundColor: 'white',
          borderRadius: 32,
          alignItems: 'center',
          width: '100%',
          maxWidth: 400,
          padding: isWeb ? 48 : 40,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 25 },
          shadowOpacity: 0.3,
          shadowRadius: 50,
          elevation: 15,
        }}
      >
        <Animated.View style={trophyStyle}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#fef3c7',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 48 }}>🏆</Text>
          </View>
        </Animated.View>

        <Text
          style={{
            fontWeight: '700',
            color: '#1e293b',
            marginTop: 24,
            fontSize: isWeb ? 32 : 28,
          }}
        >
          Excellent Work!
        </Text>
        <Text
          style={{
            color: '#64748b',
            textAlign: 'center',
            marginTop: 8,
            fontSize: 16,
          }}
        >
          You completed all the Parshas Lech Lecha questions!
        </Text>

        <Animated.View entering={FadeIn.duration(400).delay(500)} style={{ marginTop: 32 }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#f0fdf4',
              borderRadius: 20,
              paddingVertical: 24,
              paddingHorizontal: 32,
              borderWidth: 1,
              borderColor: '#dcfce7',
            }}
          >
            <Text style={{ fontSize: 48, fontWeight: '700', color: '#10b981' }}>{percentage}%</Text>
            <Text
              style={{
                fontSize: 13,
                color: '#16a34a',
                marginTop: 4,
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontWeight: '600',
              }}
            >
              Questions Mastered
            </Text>
            <Text style={{ color: '#64748b', marginTop: 4 }}>
              {knownCount} of {totalCount} questions
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(800)} style={{ width: '100%' }}>
          <AnimatedButton
            onPress={onStudyAgain}
            style="primary"
            customStyle={{
              borderRadius: 16,
              paddingVertical: 18,
              paddingHorizontal: 32,
              marginTop: 32,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 17, textAlign: 'center' }}>
              Study Again
            </Text>
          </AnimatedButton>

          <AnimatedButton onPress={onBackToHome} style="ghost" customStyle={{ marginTop: 12, paddingVertical: 12 }}>
            <Text
              style={{ color: '#64748b', fontWeight: '600', fontSize: 15, textAlign: 'center' }}
            >
              Back to Home
            </Text>
          </AnimatedButton>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export default function LechLechaFlashcardsGame() {
  const isWeb = Platform.OS === 'web';
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<typeof QUESTION_DATA>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const cardTransition = useSharedValue(1);
  const screenOpacity = useSharedValue(0);
  const screenScale = useSharedValue(0.95);

  // Calculate card dimensions
  const maxCardWidth = Math.min(screenWidth - 48, 420);
  const cardWidth = maxCardWidth;
  const cardHeight = Math.min(cardWidth * 1.25, screenHeight - 340);

  const initializeGame = useCallback(() => {
    // Animate out
    screenOpacity.value = withTiming(0, { duration: 150 });
    screenScale.value = withTiming(0.95, { duration: 150 });

    setTimeout(() => {
      // Shuffle cards
      const shuffled = [...QUESTION_DATA].sort(() => Math.random() - 0.5);
      setShuffledCards(shuffled);
      setCurrentIndex(0);
      setIsFlipped(false);
      setKnownCards(new Set());
      setIsComplete(false);
      setRefreshKey((k) => k + 1);
      cardTransition.value = 1;

      // Animate in
      screenOpacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
      screenScale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }, 150);
  }, [cardTransition, screenOpacity, screenScale]);

  useEffect(() => {
    // Initial load animation
    const shuffled = [...QUESTION_DATA].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    screenOpacity.value = withDelay(100, withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) }));
    screenScale.value = withDelay(100, withSpring(1, { damping: 12, stiffness: 150 }));
  }, [screenOpacity, screenScale]);

  const screenAnimatedStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
    transform: [{ scale: screenScale.value }],
  }));

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const animateCardTransition = (callback: () => void) => {
    cardTransition.value = withSequence(
      withTiming(0, { duration: 150, easing: Easing.in(Easing.cubic) }),
      withTiming(1, { duration: 150, easing: Easing.out(Easing.cubic) })
    );
    setTimeout(callback, 150);
  };

  const handleKnewIt = () => {
    const newKnown = new Set(knownCards);
    newKnown.add(currentIndex);
    setKnownCards(newKnown);

    if (currentIndex < shuffledCards.length - 1) {
      animateCardTransition(() => {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      });
    } else {
      setIsComplete(true);
    }
  };

  const handleStillLearning = () => {
    if (currentIndex < shuffledCards.length - 1) {
      animateCardTransition(() => {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      });
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      animateCardTransition(() => {
        setCurrentIndex(currentIndex - 1);
        setIsFlipped(false);
      });
    }
  };

  const cardContainerStyle = useAnimatedStyle(() => ({
    opacity: cardTransition.value,
    transform: [{ scale: 0.95 + cardTransition.value * 0.05 }],
  }));

  if (shuffledCards.length === 0) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ color: '#64748b' }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const currentCard = shuffledCards[currentIndex];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#e2e8f0',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <AnimatedButton
            onPress={() => router.back()}
            style="icon"
            customStyle={{
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FontAwesome name="arrow-left" size={18} color="#64748b" />
          </AnimatedButton>

          <View style={{ alignItems: 'center', flex: 1, marginHorizontal: 16 }}>
            <Text
              style={{
                fontWeight: '700',
                color: '#1e293b',
                fontSize: isWeb ? 20 : 18,
              }}
            >
              Parshas Lech Lecha
            </Text>
            <Text style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Quiz Mode</Text>
          </View>

          <RefreshButton onPress={initializeGame} />
        </View>

        {/* Progress */}
        <Animated.View
          key={refreshKey}
          style={[
            screenAnimatedStyle,
            {
              paddingHorizontal: 16,
              paddingVertical: 16,
              backgroundColor: '#fafafa',
              borderTopWidth: 1,
              borderTopColor: '#f1f5f9',
            },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 14, color: '#64748b', fontWeight: '500' }}>
              Question {currentIndex + 1} of {shuffledCards.length}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f0fdf4',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <FontAwesome name="check-circle" size={14} color="#10b981" />
              <Text style={{ fontSize: 14, color: '#10b981', fontWeight: '600', marginLeft: 6 }}>
                {knownCards.size} mastered
              </Text>
            </View>
          </View>
          <ProgressBar total={shuffledCards.length} current={currentIndex} knownCards={knownCards} />
        </Animated.View>
      </View>

      {/* Card Area */}
      <Animated.View
        style={[screenAnimatedStyle, { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }]}
      >
        <Animated.View style={cardContainerStyle}>
          <Flashcard
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
          />
        </Animated.View>
      </Animated.View>

      {/* Bottom Controls */}
      <View
        style={{
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        {/* Navigation */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <AnimatedButton
            onPress={handlePrevious}
            disabled={currentIndex === 0}
            style="icon"
            customStyle={{
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FontAwesome name="chevron-left" size={18} color={currentIndex === 0 ? '#cbd5e1' : '#64748b'} />
          </AnimatedButton>

          <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '500' }}>Tap card to flip</Text>

          <View style={{ width: 48, height: 48 }} />
        </View>

        {/* Action buttons */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <AnimatedButton
              onPress={handleStillLearning}
              style="secondary"
              customStyle={{
                width: '100%',
                paddingVertical: 16,
                borderRadius: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ textAlign: 'center', fontWeight: '600', color: '#64748b', fontSize: 15 }}>
                Still Learning
              </Text>
            </AnimatedButton>
          </View>

          <View style={{ flex: 1 }}>
            <AnimatedButton
              onPress={handleKnewIt}
              style="success"
              customStyle={{
                width: '100%',
                paddingVertical: 16,
                borderRadius: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ textAlign: 'center', fontWeight: '700', color: 'white', fontSize: 15 }}>
                Got It! ✓
              </Text>
            </AnimatedButton>
          </View>
        </View>
      </View>

      {/* Completion Modal */}
      {isComplete && (
        <CompletionScreen
          knownCount={knownCards.size}
          totalCount={shuffledCards.length}
          onStudyAgain={initializeGame}
          onBackToHome={() => router.back()}
        />
      )}
    </SafeAreaView>
  );
}
