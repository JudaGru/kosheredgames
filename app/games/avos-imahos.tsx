import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Avos and Imahos in chronological order
const AVOS_IMAHOS = [
  { id: 1, english: 'Avraham', hebrew: 'אברהם', emoji: '👴', description: 'First of the Avos' },
  { id: 2, english: 'Sarah', hebrew: 'שרה', emoji: '👵', description: 'Wife of Avraham' },
  { id: 3, english: 'Yitzchak', hebrew: 'יצחק', emoji: '👴', description: 'Second of the Avos' },
  { id: 4, english: 'Rivka', hebrew: 'רבקה', emoji: '👵', description: 'Wife of Yitzchak' },
  { id: 5, english: 'Yaakov', hebrew: 'יעקב', emoji: '👴', description: 'Third of the Avos' },
  { id: 6, english: 'Leah', hebrew: 'לאה', emoji: '👵', description: 'First wife of Yaakov' },
  { id: 7, english: 'Rachel', hebrew: 'רחל', emoji: '👵', description: 'Second wife of Yaakov' },
];

interface Person {
  id: number;
  english: string;
  hebrew: string;
  emoji: string;
  description: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function PersonCard({
  item,
  index,
  isSelected,
  isCorrectPosition,
  onPress,
  disabled,
}: {
  item: Person;
  index: number;
  isSelected: boolean;
  isCorrectPosition: boolean;
  onPress: () => void;
  disabled: boolean;
}) {
  const scale = useSharedValue(0);
  const pressScale = useSharedValue(1);
  const entranceDelay = index * 60;

  useEffect(() => {
    scale.value = withDelay(
      entranceDelay,
      withSpring(1, { damping: 12, stiffness: 100 })
    );
  }, [entranceDelay, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pressScale.value }],
    opacity: scale.value,
  }));

  const getBorderColor = () => {
    if (isCorrectPosition) return '#22c55e';
    if (isSelected) return '#0d9488';
    return '#e2e8f0';
  };

  const getBgColor = () => {
    if (isCorrectPosition) return '#dcfce7';
    if (isSelected) return '#f0fdfa';
    return 'white';
  };

  const handlePressIn = () => {
    pressScale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || isCorrectPosition}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          marginVertical: 6,
          marginHorizontal: 16,
          backgroundColor: getBgColor(),
          borderRadius: 12,
          borderWidth: 2,
          borderColor: getBorderColor(),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          opacity: disabled && !isCorrectPosition ? 0.5 : 1,
        }}
      >
        <Text style={{ fontSize: 32, marginRight: 12 }}>{item.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1e293b' }}>
            {item.english}
          </Text>
          <Text style={{ fontSize: 14, color: '#64748b', marginTop: 2 }}>
            {item.hebrew}
          </Text>
        </View>
        {isCorrectPosition && (
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: '#22c55e',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FontAwesome name="check" size={14} color="white" />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

function DropZone({
  position,
  placedItem,
  isActive,
  isCorrect,
  onPress,
}: {
  position: number;
  placedItem: Person | null;
  isActive: boolean;
  isCorrect: boolean;
  onPress: () => void;
}) {
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      pulseAnim.value = withSequence(
        withTiming(1.02, { duration: 300 }),
        withTiming(0.98, { duration: 300 }),
        withTiming(1, { duration: 300 })
      );
    }
  }, [isActive, pulseAnim]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          marginVertical: 4,
          marginHorizontal: 16,
          backgroundColor: placedItem
            ? isCorrect
              ? '#dcfce7'
              : '#f8fafc'
            : isActive
            ? '#f0fdfa'
            : '#f8fafc',
          borderRadius: 12,
          borderWidth: 2,
          borderStyle: placedItem ? 'solid' : 'dashed',
          borderColor: placedItem
            ? isCorrect
              ? '#22c55e'
              : '#94a3b8'
            : isActive
            ? '#0d9488'
            : '#cbd5e1',
          minHeight: 64,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: placedItem
              ? isCorrect
                ? '#22c55e'
                : '#0d9488'
              : '#e2e8f0',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: placedItem ? 'white' : '#64748b',
            }}
          >
            {position}
          </Text>
        </View>
        {placedItem ? (
          <>
            <Text style={{ fontSize: 28, marginRight: 10 }}>{placedItem.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b' }}>
                {placedItem.english}
              </Text>
              <Text style={{ fontSize: 13, color: '#64748b' }}>{placedItem.hebrew}</Text>
            </View>
            {isCorrect && (
              <FontAwesome name="check-circle" size={20} color="#22c55e" />
            )}
          </>
        ) : (
          <Text style={{ fontSize: 14, color: '#94a3b8', fontStyle: 'italic' }}>
            Position #{position}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

function ConfettiParticle({ index }: { index: number }) {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const emojis = ['✨', '👴', '👵', '🌟', '💫', '⭐', '🙏'];
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

    opacity.value = withDelay(
      randomDelay + fallDuration * 0.7,
      withTiming(0, { duration: 600 })
    );
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
    <View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 100 }} pointerEvents="none">
      {Array.from({ length: 40 }).map((_, i) => (
        <ConfettiParticle key={i} index={i} />
      ))}
    </View>
  );
}

function VictoryScreen({
  attempts,
  onPlayAgain,
  onBackToHome,
}: {
  attempts: number;
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

  const getPerformanceMessage = () => {
    if (attempts === 7) return 'Perfect! You got them all on the first try!';
    if (attempts <= 10) return 'Great job! You know the Avos and Imahos!';
    if (attempts <= 14) return 'Well done! Keep practicing!';
    return 'Good effort! Try again to improve!';
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

        <Text className={`font-bold text-slate-800 mt-6 ${isWeb ? 'text-4xl' : 'text-3xl'}`}>
          Mazal Tov!
        </Text>
        <Text className="text-slate-500 text-center mt-3 text-base">
          You arranged all the Avos and Imahos in order!
        </Text>
        <Text className="text-slate-600 text-center mt-2 text-sm">
          {getPerformanceMessage()}
        </Text>

        <Animated.View entering={FadeIn.duration(400).delay(500)} className="mt-8">
          <View className="items-center bg-teal-50 rounded-2xl py-6 px-8">
            <Text className="text-5xl font-bold text-teal-600">{attempts}</Text>
            <Text className="text-sm text-teal-700 mt-2 uppercase tracking-wide font-semibold">
              Attempts
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(800)} style={{ width: '100%' }}>
          <Pressable
            onPress={onPlayAgain}
            style={{
              backgroundColor: '#0d9488',
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 32,
              marginTop: 32,
              shadowColor: '#0d9488',
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

export default function AvosImahosGame() {
  const isWeb = Platform.OS === 'web';
  const [availablePeople, setAvailablePeople] = useState<Person[]>([]);
  const [placedPeople, setPlacedPeople] = useState<(Person | null)[]>(Array(7).fill(null));
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const initializeGame = useCallback(() => {
    setAvailablePeople(shuffleArray([...AVOS_IMAHOS]));
    setPlacedPeople(Array(7).fill(null));
    setSelectedPerson(null);
    setAttempts(0);
    setGameComplete(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handlePersonPress = (person: Person) => {
    if (selectedPerson?.id === person.id) {
      setSelectedPerson(null);
    } else {
      setSelectedPerson(person);
    }
  };

  const handleDropZonePress = (position: number) => {
    if (!selectedPerson) return;

    setAttempts((prev) => prev + 1);

    const isCorrect = selectedPerson.id === position;

    if (isCorrect) {
      const newPlaced = [...placedPeople];
      newPlaced[position - 1] = selectedPerson;
      setPlacedPeople(newPlaced);

      setAvailablePeople((prev) => prev.filter((p) => p.id !== selectedPerson.id));
      setSelectedPerson(null);

      const allPlaced = newPlaced.every((p) => p !== null);
      if (allPlaced) {
        setGameComplete(true);
      }
    }
  };

  const correctCount = placedPeople.filter((p, i) => p && p.id === i + 1).length;

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
              Avos & Imahos
            </Text>
            <Text className="text-slate-500 text-sm">Put them in order</Text>
          </View>

          <Pressable
            onPress={initializeGame}
            className="w-10 h-10 rounded-full bg-teal-50 items-center justify-center active:bg-teal-100"
          >
            <FontAwesome name="refresh" size={18} color="#0d9488" />
          </Pressable>
        </View>

        {/* Stats Bar */}
        <View
          className="flex-row justify-center py-3 bg-slate-50 border-t border-slate-100"
          style={{ gap: isWeb ? 48 : 32 }}
        >
          <View className="items-center">
            <Text className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
              Correct
            </Text>
            <Text className={`font-bold text-teal-600 ${isWeb ? 'text-2xl' : 'text-xl'} mt-1`}>
              {correctCount}/7
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
              Attempts
            </Text>
            <Text className={`font-bold text-slate-800 ${isWeb ? 'text-2xl' : 'text-xl'} mt-1`}>
              {attempts}
            </Text>
          </View>
        </View>
      </View>

      {/* Game Content */}
      <View className="flex-1" style={{ flexDirection: isWeb ? 'row' : 'column' }}>
        {/* Drop Zones (Sequence) */}
        <View style={{ flex: 1 }}>
          <Text
            className="font-semibold text-slate-600 px-4 py-3"
            style={{ fontSize: isWeb ? 16 : 14 }}
          >
            Order (First to Last)
          </Text>
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {Array.from({ length: 7 }).map((_, index) => {
              const position = index + 1;
              const placedItem = placedPeople[index];
              const isCorrect = placedItem !== null && placedItem.id === position;
              return (
                <DropZone
                  key={position}
                  position={position}
                  placedItem={placedItem}
                  isActive={selectedPerson !== null && !placedItem}
                  isCorrect={isCorrect}
                  onPress={() => handleDropZonePress(position)}
                />
              );
            })}
          </ScrollView>
        </View>

        {/* Available People */}
        <View
          style={{
            flex: isWeb ? 0.8 : undefined,
            height: isWeb ? undefined : 280,
            backgroundColor: 'white',
            borderTopWidth: isWeb ? 0 : 1,
            borderLeftWidth: isWeb ? 1 : 0,
            borderColor: '#e2e8f0',
          }}
        >
          <Text
            className="font-semibold text-slate-600 px-4 py-3 bg-slate-50"
            style={{ fontSize: isWeb ? 16 : 14 }}
          >
            Avos & Imahos ({availablePeople.length})
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {availablePeople.length === 0 ? (
              <View className="items-center py-8">
                <Text className="text-slate-400 text-center">All have been placed!</Text>
              </View>
            ) : (
              availablePeople.map((person, index) => {
                const isPlacedCorrectly = placedPeople[person.id - 1]?.id === person.id;
                return (
                  <PersonCard
                    key={person.id}
                    item={person}
                    index={index}
                    isSelected={selectedPerson?.id === person.id}
                    isCorrectPosition={isPlacedCorrectly}
                    onPress={() => handlePersonPress(person)}
                    disabled={false}
                  />
                );
              })
            )}
          </ScrollView>
        </View>
      </View>

      {/* Instruction hint */}
      {selectedPerson && (
        <Animated.View
          entering={FadeIn.duration(200)}
          className="absolute bottom-24 left-4 right-4 bg-teal-600 rounded-xl p-4"
          style={{
            shadowColor: '#0d9488',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text className="text-white text-center font-semibold">
            Tap the correct slot to place "{selectedPerson.english}"
          </Text>
        </Animated.View>
      )}

      {/* Victory Modal */}
      {gameComplete && (
        <VictoryScreen
          attempts={attempts}
          onPlayAgain={initializeGame}
          onBackToHome={() => router.back()}
        />
      )}
    </SafeAreaView>
  );
}
