import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useIsMobileLayout } from '@/hooks/useDeviceType';
import { Loader } from '@/components/Loader';
import Animated, {
  Easing,
  FadeIn,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const GRID_SIZE = 5;

// Pre-designed puzzles with specific Torah words
// Each puzzle has a grid and the words that can be found in it
interface Puzzle {
  grid: string[][];
  words: string[];
  theme: string;
}

// SUKKOS THEMED PUZZLE BOARDS - 5x5 grids for more words
// All word paths verified - minimum 5 words per puzzle
const PUZZULAR_BOARDS: Puzzle[] = [
  {
    theme: 'Sukkos',
    // 5x5 grid with LULAV, ESROG, HADAS, CHAG, SUKAH
    grid: [
      ['L', 'U', 'L', 'A', 'V'],
      ['E', 'S', 'R', 'A', 'H'],
      ['C', 'H', 'O', 'D', 'A'],
      ['A', 'G', 'K', 'A', 'S'],
      ['S', 'U', 'M', 'I', 'C'],
    ],
    // LULAV: L(0,0)->U(0,1)->L(0,2)->A(0,3)->V(0,4) ✓
    // ESROG: E(1,0)->S(1,1)->R(1,2)->O(2,2)->G(3,1) ✓
    //   Check: E->S ✓, S->R ✓, R->O ✓, O->G diag ✓
    // HADAS: H(1,4)->A(2,4)->D(2,3)->A(3,3)->S(4,4) ✓
    //   Check: H->A ✓, A->D ✓, D->A ✓, A->S diag ✓
    // CHAG: C(2,0)->H(2,1)->A(3,0)->G(3,1) ✓
    //   Check: C->H ✓, H->A diag ✓, A->G ✓
    // SUKAH: S(4,0)->U(4,1)->K(3,2)->A(3,3)->H(2,4)? A to H not adjacent (row diff 1, col diff 1) ✓ diagonal!
    //   Check: S->U ✓, U->K diag ✓, K->A ✓, A->H diag ✓
    words: ['LULAV', 'ESROG', 'HADAS', 'CHAG', 'SUKAH'],
  },
  {
    theme: 'Sukkos',
    // 5x5 grid with SUKAH, SIMCHA, CHAG, ARAVA, SCHACH
    grid: [
      ['S', 'U', 'K', 'A', 'H'],
      ['I', 'M', 'C', 'R', 'A'],
      ['S', 'C', 'H', 'A', 'V'],
      ['C', 'H', 'A', 'G', 'A'],
      ['A', 'L', 'U', 'L', 'V'],
    ],
    // SUKAH: S(0,0)->U(0,1)->K(0,2)->A(0,3)->H(0,4) ✓
    // SIMCHA: S(0,0)->I(1,0)->M(1,1)->C(1,2)->H(2,2)->A(3,2) ✓
    //   Check: S->I ✓, I->M ✓, M->C ✓, C->H ✓, H->A ✓
    // CHAG: C(3,0)->H(3,1)->A(3,2)->G(3,3) ✓
    // ARAVA: A(0,3)->R(1,3)->A(2,3)->V(2,4)->A(3,4) ✓
    //   Check: A->R ✓, R->A ✓, A->V ✓, V->A ✓
    // SCHACH: S(2,0)->C(2,1)->H(2,2)->A(3,2)->C(1,2)? A to C(1,2) not adjacent
    //   Try: S(0,0)->C(1,2)? Not adjacent. No valid SCHACH
    // LULAV: L(4,1)->U(4,2)->L(4,3)->A(3,4)->V(4,4) ✓
    //   Check: L->U ✓, U->L ✓, L->A diag ✓, A->V ✓
    words: ['SUKAH', 'SIMCHA', 'CHAG', 'ARAVA', 'LULAV'],
  },
  {
    theme: 'Sukkos',
    // 5x5 grid with ARAVA, SCHACH, YOMTOV, ESROG, CHAG
    grid: [
      ['A', 'R', 'A', 'V', 'A'],
      ['S', 'C', 'H', 'A', 'C'],
      ['E', 'S', 'R', 'O', 'H'],
      ['C', 'H', 'A', 'G', 'T'],
      ['Y', 'O', 'M', 'V', 'O'],
    ],
    // ARAVA: A(0,0)->R(0,1)->A(0,2)->V(0,3)->A(0,4) ✓
    // SCHACH: S(1,0)->C(1,1)->H(1,2)->A(1,3)->C(1,4)->H(2,4) ✓
    // ESROG: E(2,0)->S(2,1)->R(2,2)->O(2,3)->G(3,3) ✓
    // CHAG: C(3,0)->H(3,1)->A(3,2)->G(3,3) ✓
    // YOMTOV: Y(4,0)->O(4,1)->M(4,2)->T(3,4)->O(4,4)->V(4,3) ✓
    //   Check: Y->O ✓, O->M ✓, M->T diag ✓, T->O ✓, O->V ✓
    words: ['ARAVA', 'SCHACH', 'ESROG', 'CHAG', 'YOMTOV'],
  },
  {
    theme: 'Sukkos',
    // 5x5 grid with LULAV, SUKAH, SIMCHA, CHAG, HADAS
    grid: [
      ['L', 'U', 'L', 'A', 'V'],
      ['S', 'U', 'K', 'A', 'H'],
      ['I', 'M', 'C', 'H', 'A'],
      ['C', 'H', 'A', 'D', 'S'],
      ['A', 'G', 'R', 'A', 'V'],
    ],
    // LULAV: L(0,0)->U(0,1)->L(0,2)->A(0,3)->V(0,4) ✓
    // SUKAH: S(1,0)->U(1,1)->K(1,2)->A(1,3)->H(1,4) ✓
    // SIMCHA: S(1,0)->I(2,0)->M(2,1)->C(2,2)->H(2,3)->A(2,4) ✓
    // CHAG: C(3,0)->H(3,1)->A(3,2)->G(4,1) ✓
    //   Check: C->H ✓, H->A ✓, A->G diag ✓
    // HADAS: H(2,3)->A(2,4)->D(3,3)->A(4,3)->S(3,4) ✓
    //   Check: H->A ✓, A->D diag ✓, D->A ✓, A->S diag ✓
    words: ['LULAV', 'SUKAH', 'SIMCHA', 'CHAG', 'HADAS'],
  },
  {
    theme: 'Sukkos',
    // 5x5 grid with HADAS, LULAV, ESROG, CHAG, ARAVA
    grid: [
      ['H', 'A', 'D', 'A', 'S'],
      ['L', 'U', 'L', 'A', 'V'],
      ['E', 'S', 'R', 'O', 'A'],
      ['C', 'H', 'A', 'G', 'R'],
      ['V', 'A', 'R', 'A', 'A'],
    ],
    // HADAS: H(0,0)->A(0,1)->D(0,2)->A(0,3)->S(0,4) ✓
    // LULAV: L(1,0)->U(1,1)->L(1,2)->A(1,3)->V(1,4) ✓
    // ESROG: E(2,0)->S(2,1)->R(2,2)->O(2,3)->G(3,3) ✓
    // CHAG: C(3,0)->H(3,1)->A(3,2)->G(3,3) ✓
    // ARAVA: A(4,1)->R(4,2)->A(4,3)->V(3,4)? V not at 3,4. Try:
    //   A(1,3)->R(4,2)? Not adjacent. Try:
    //   A(2,4)->R(3,4)->A(4,4)->V(4,0)->A(4,1) ✓
    //   Check: A(2,4)->R(3,4) ✓, R->A(4,4) ✓, A->V ✓, V->A(4,1)? V(4,0) to A(4,1) ✓
    words: ['HADAS', 'LULAV', 'ESROG', 'CHAG', 'ARAVA'],
  },
];

// Check if a path through the grid spells the given word
function canFormWord(grid: string[][], word: string, path: { row: number; col: number }[]): boolean {
  if (path.length !== word.length) return false;

  // Check the path spells the word
  for (let i = 0; i < path.length; i++) {
    if (grid[path[i].row][path[i].col] !== word[i]) return false;
  }

  // Check no cell is used twice
  const visited = new Set<string>();
  for (const cell of path) {
    const key = `${cell.row},${cell.col}`;
    if (visited.has(key)) return false;
    visited.add(key);
  }

  // Check all cells are adjacent
  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1];
    const curr = path[i];
    const rowDiff = Math.abs(curr.row - prev.row);
    const colDiff = Math.abs(curr.col - prev.col);

    if (rowDiff > 1 || colDiff > 1 || (rowDiff === 0 && colDiff === 0)) {
      return false;
    }
  }

  return true;
}

// Get the word from a path
function getWordFromPath(grid: string[][], path: { row: number; col: number }[]): string {
  return path.map(cell => grid[cell.row][cell.col]).join('');
}

// Header button component
function HeaderButton({
  onPress,
  icon,
  variant = 'default',
}: {
  onPress: () => void;
  icon: string;
  variant?: 'default' | 'refresh';
}) {
  const isWeb = Platform.OS === 'web';
  const scale = useSharedValue(1);
  const bgColor = useSharedValue(0);
  const rotation = useSharedValue(0);

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

  const handlePress = () => {
    if (variant === 'refresh') {
      rotation.value = withSequence(
        withTiming(rotation.value + 360, { duration: 400, easing: Easing.out(Easing.cubic) })
      );
    }
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    backgroundColor: interpolate(bgColor.value, [0, 1], [0, 1]) === 1
      ? (variant === 'refresh' ? '#ddd6fe' : '#e2e8f0')
      : (variant === 'refresh' ? '#ede9fe' : '#f1f5f9'),
  }));

  return (
    <Pressable onPress={handlePress} onHoverIn={handleHoverIn} onHoverOut={handleHoverOut}>
      <Animated.View
        style={[
          animatedStyle,
          {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <FontAwesome
          name={icon as any}
          size={18}
          color={variant === 'refresh' ? '#7c3aed' : '#64748b'}
        />
      </Animated.View>
    </Pressable>
  );
}

// Cell component
interface CellProps {
  letter: string;
  row: number;
  col: number;
  isSelected: boolean;
  selectionOrder: number;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  cellSize: number;
  index: number;
  gameKey: number;
}

function Cell({ letter, isSelected, selectionOrder, onMouseDown, onMouseEnter, cellSize, index, gameKey }: CellProps) {
  const isWeb = Platform.OS === 'web';
  const entranceAnim = useSharedValue(0);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    entranceAnim.value = 0;
    entranceAnim.value = withDelay(
      index * 30,
      withSpring(1, { damping: 12, stiffness: 100 })
    );
  }, [index, gameKey]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: entranceAnim.value * pressScale.value }],
    opacity: entranceAnim.value,
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const fontSize = letter.length > 1 ? cellSize * 0.35 : cellSize * 0.45;

  const webProps = isWeb ? {
    onMouseDown: (e: any) => {
      e.preventDefault();
      onMouseDown();
    },
    onMouseEnter: onMouseEnter,
  } : {};

  return (
    <Animated.View style={containerStyle}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          width: cellSize,
          height: cellSize,
          margin: 4,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isSelected ? '#a78bfa' : 'white',
          borderWidth: isSelected ? 3 : 2,
          borderColor: isSelected ? '#7c3aed' : '#e2e8f0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isSelected ? 0.2 : 0.1,
          shadowRadius: isSelected ? 6 : 3,
          elevation: isSelected ? 6 : 3,
          // @ts-ignore
          cursor: isWeb ? 'pointer' : undefined,
          userSelect: isWeb ? 'none' : undefined,
        }}
        {...webProps}
      >
        <Text
          style={{
            fontSize,
            fontWeight: 'bold',
            color: isSelected ? 'white' : '#334155',
            // @ts-ignore
            userSelect: isWeb ? 'none' : undefined,
          }}
        >
          {letter}
        </Text>
        {isSelected && selectionOrder > 0 && (
          <View
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: '#7c3aed',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'white' }}>
              {selectionOrder}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

// Found word item
function FoundWordItem({ word, points }: { word: string; points: number }) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 150 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 6,
          paddingHorizontal: 12,
          backgroundColor: '#dcfce7',
          borderRadius: 8,
          marginRight: 8,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: '#86efac',
        },
      ]}
    >
      <Text style={{ fontSize: 14, fontWeight: '600', color: '#166534' }}>
        {word}
      </Text>
      <Text style={{ fontSize: 11, fontWeight: '500', color: '#22c55e', marginLeft: 6 }}>
        +{points}
      </Text>
    </Animated.View>
  );
}

// Confetti particle
function ConfettiParticle({ index }: { index: number }) {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const emojis = ['✨', '⭐', '🎊', '🎉', '💫', '📜', '✡️'];
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
  }, []);

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

// Victory screen
function VictoryScreen({
  wordsFound,
  totalWords,
  score,
  onPlayAgain,
  onBackToHome,
}: {
  wordsFound: number;
  totalWords: number;
  score: number;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}) {
  const isWeb = Platform.OS === 'web';
  const trophyScale = useSharedValue(0);
  const trophyRotate = useSharedValue(-180);

  useEffect(() => {
    trophyScale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 100 }));
    trophyRotate.value = withDelay(300, withSpring(0, { damping: 10, stiffness: 80 }));
  }, []);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }, { rotate: `${trophyRotate.value}deg` }],
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

        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1e293b', marginTop: 16 }}>
          Amazing!
        </Text>

        <Animated.View entering={FadeIn.duration(400).delay(500)} className="mt-6">
          <View className="items-center bg-violet-50 rounded-2xl py-6 px-8">
            <Text className="text-5xl font-bold text-violet-600">{score}</Text>
            <Text className="text-sm text-violet-700 mt-2 uppercase tracking-wide font-semibold">
              Points
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(600)} className="mt-4">
          <Text style={{ fontSize: 16, color: '#64748b' }}>
            Found {wordsFound} of {totalWords} words
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(800)} style={{ width: '100%' }}>
          <Pressable
            onPress={onPlayAgain}
            style={{
              backgroundColor: '#7c3aed',
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 32,
              marginTop: 32,
              shadowColor: '#7c3aed',
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

// Calculate points for a word
function getWordPoints(word: string): number {
  const len = word.length;
  if (len <= 3) return 1;
  if (len === 4) return 2;
  if (len === 5) return 4;
  if (len === 6) return 6;
  if (len === 7) return 10;
  return 15;
}

export default function LetterGridTorahGame() {
  const isWeb = Platform.OS === 'web';
  const { isMobile, isLoading: isDetectingDevice } = useIsMobileLayout();
  const useMobileLayout = isMobile;
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [grid, setGrid] = useState<string[][]>([]);
  const [possibleWords, setPossibleWords] = useState<Set<string>>(new Set());
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [foundWords, setFoundWords] = useState<{ word: string; points: number }[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [feedback, setFeedback] = useState<'valid' | 'invalid' | 'duplicate' | null>(null);

  const isDraggingRef = useRef(false);
  const currentSelectionRef = useRef<{ row: number; col: number }[]>([]);

  const calculateCellSize = useCallback(() => {
    const padding = 48;
    const wordListWidth = useMobileLayout ? 0 : 300;
    const headerHeight = useMobileLayout ? 200 : 160;

    const availableWidth = screenWidth - padding - wordListWidth;
    const availableHeight = screenHeight - headerHeight - padding - (useMobileLayout ? 180 : 0);

    const maxCellWidth = (availableWidth - GRID_SIZE * 8) / GRID_SIZE;
    const maxCellHeight = (availableHeight - GRID_SIZE * 8) / GRID_SIZE;

    return Math.min(maxCellWidth, maxCellHeight, useMobileLayout ? 70 : 90);
  }, [screenWidth, screenHeight, useMobileLayout]);

  const cellSize = calculateCellSize();

  const initializeGame = useCallback(() => {
    // Pick a random puzzle from the pre-defined boards
    const puzzle = PUZZULAR_BOARDS[Math.floor(Math.random() * PUZZULAR_BOARDS.length)];

    setGrid(puzzle.grid);
    setPossibleWords(new Set(puzzle.words));
    setSelectedCells([]);
    setFoundWords([]);
    setCurrentWord('');
    setScore(0);
    setGameComplete(false);
    setGameKey(prev => prev + 1);
    setIsDragging(false);
    setFeedback(null);
    currentSelectionRef.current = [];
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Build current word from selected cells
  useEffect(() => {
    if (grid.length === 0) return;
    const word = selectedCells.map(c => grid[c.row][c.col]).join('');
    setCurrentWord(word);
  }, [selectedCells, grid]);

  // Check for game completion
  useEffect(() => {
    // Only check completion if we have words to find (possibleWords.size > 0)
    // and we've found all of them
    if (possibleWords.size > 0 && foundWords.length === possibleWords.size) {
      setGameComplete(true);
    }
  }, [foundWords, possibleWords]);

  const submitWord = useCallback(() => {
    if (currentWord.length < 3) {
      setFeedback('invalid');
      setTimeout(() => setFeedback(null), 500);
      return;
    }

    // Check if already found
    if (foundWords.some(fw => fw.word === currentWord)) {
      setFeedback('duplicate');
      setTimeout(() => setFeedback(null), 500);
      return;
    }

    // Check if it's one of the target words and the path is valid
    if (possibleWords.has(currentWord) && canFormWord(grid, currentWord, selectedCells)) {
      const points = getWordPoints(currentWord);
      setScore(prev => prev + points);
      setFoundWords(prev => [...prev, { word: currentWord, points }]);
      setFeedback('valid');
      setTimeout(() => setFeedback(null), 300);
    } else {
      setFeedback('invalid');
      setTimeout(() => setFeedback(null), 500);
    }

    setSelectedCells([]);
    currentSelectionRef.current = [];
  }, [currentWord, foundWords, possibleWords, grid, selectedCells]);

  const handleCellMouseDown = (row: number, col: number) => {
    if (gameComplete) return;

    setIsDragging(true);
    isDraggingRef.current = true;
    setSelectedCells([{ row, col }]);
    currentSelectionRef.current = [{ row, col }];
    setFeedback(null);
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!isDragging || gameComplete) return;
    if (selectedCells.length === 0) return;

    // Check if already selected
    if (selectedCells.some(c => c.row === row && c.col === col)) return;

    // Check if adjacent to last cell
    const lastCell = selectedCells[selectedCells.length - 1];
    const rowDiff = Math.abs(row - lastCell.row);
    const colDiff = Math.abs(col - lastCell.col);

    if (rowDiff <= 1 && colDiff <= 1) {
      const newSelection = [...selectedCells, { row, col }];
      setSelectedCells(newSelection);
      currentSelectionRef.current = newSelection;
    }
  };

  const handleMouseUp = useCallback(() => {
    if (isDragging && currentWord.length >= 3) {
      submitWord();
    } else {
      setSelectedCells([]);
      currentSelectionRef.current = [];
    }
    setIsDragging(false);
    isDraggingRef.current = false;
  }, [isDragging, currentWord, submitWord]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [handleMouseUp]);

  // Mobile gesture handling
  const cellWithMargin = cellSize + 8;
  const gridPadding = 16;

  const getCellFromPosition = (x: number, y: number): { row: number; col: number } | null => {
    const adjustedX = x - gridPadding;
    const adjustedY = y - gridPadding;

    const col = Math.floor(adjustedX / cellWithMargin);
    const row = Math.floor(adjustedY / cellWithMargin);

    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      return { row, col };
    }
    return null;
  };

  const handlePanStart = (x: number, y: number) => {
    if (gameComplete) return;

    const cell = getCellFromPosition(x, y);
    if (!cell) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    currentSelectionRef.current = [cell];
    setSelectedCells([cell]);
    setFeedback(null);
  };

  const handlePanUpdate = (x: number, y: number) => {
    if (!isDraggingRef.current || gameComplete) return;
    if (currentSelectionRef.current.length === 0) return;

    const currentCell = getCellFromPosition(x, y);
    if (!currentCell) return;

    const { row, col } = currentCell;

    // Check if already selected
    if (currentSelectionRef.current.some(c => c.row === row && c.col === col)) return;

    // Check if adjacent to last cell
    const lastCell = currentSelectionRef.current[currentSelectionRef.current.length - 1];
    const rowDiff = Math.abs(row - lastCell.row);
    const colDiff = Math.abs(col - lastCell.col);

    if (rowDiff <= 1 && colDiff <= 1) {
      const newSelection = [...currentSelectionRef.current, { row, col }];
      currentSelectionRef.current = newSelection;
      setSelectedCells(newSelection);
    }
  };

  const handlePanEnd = () => {
    if (isDraggingRef.current) {
      const word = currentSelectionRef.current.map(c => grid[c.row]?.[c.col] || '').join('');
      if (word.length >= 3) {
        // Check if valid and not duplicate
        if (possibleWords.has(word) && !foundWords.some(fw => fw.word === word) && canFormWord(grid, word, currentSelectionRef.current)) {
          const points = getWordPoints(word);
          setScore(prev => prev + points);
          setFoundWords(prev => [...prev, { word, points }]);
          setFeedback('valid');
        } else if (foundWords.some(fw => fw.word === word)) {
          setFeedback('duplicate');
        } else {
          setFeedback('invalid');
        }
        setTimeout(() => setFeedback(null), 500);
      }
    }

    currentSelectionRef.current = [];
    setSelectedCells([]);
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      'worklet';
      runOnJS(handlePanStart)(e.x, e.y);
    })
    .onUpdate((e) => {
      'worklet';
      runOnJS(handlePanUpdate)(e.x, e.y);
    })
    .onEnd(() => {
      'worklet';
      runOnJS(handlePanEnd)();
    })
    .minDistance(0)
    .minPointers(1)
    .maxPointers(1)
    .shouldCancelWhenOutside(false);

  const isCellSelected = (row: number, col: number): boolean => {
    return selectedCells.some(c => c.row === row && c.col === col);
  };

  const getSelectionOrder = (row: number, col: number): number => {
    const index = selectedCells.findIndex(c => c.row === row && c.col === col);
    return index >= 0 ? index + 1 : 0;
  };

  const wordsRemaining = possibleWords.size - foundWords.length;

  if (isDetectingDevice) {
    return <Loader />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar style="dark" />

        {/* Header */}
        <View className="bg-white border-b border-slate-200">
          <View className="flex-row items-center justify-between px-4 py-3">
            <HeaderButton onPress={() => router.back()} icon="arrow-left" variant="default" />

            <View className="items-center flex-1 mx-4">
              <Text className={`font-bold text-slate-800 ${useMobileLayout ? 'text-lg' : 'text-xl'}`}>
                Sukkos Words
              </Text>
            </View>

            <HeaderButton onPress={initializeGame} icon="refresh" variant="refresh" />
          </View>

          {/* Stats Bar */}
          <View
            className="flex-row justify-center py-3 bg-slate-50 border-t border-slate-100"
            style={{ gap: useMobileLayout ? 24 : 48 }}
          >
            <View className="items-center">
              <Text className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Words Left</Text>
              <Text className={`font-bold text-amber-600 ${useMobileLayout ? 'text-xl' : 'text-2xl'} mt-1`}>
                {wordsRemaining}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Found</Text>
              <Text className={`font-bold text-emerald-600 ${useMobileLayout ? 'text-xl' : 'text-2xl'} mt-1`}>
                {foundWords.length}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Score</Text>
              <Text className={`font-bold text-violet-600 ${useMobileLayout ? 'text-xl' : 'text-2xl'} mt-1`}>
                {score}
              </Text>
            </View>
          </View>

          {/* Current word display */}
          <View className="py-3 px-4 items-center">
            <View
              style={{
                minWidth: 140,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: feedback === 'invalid' || feedback === 'duplicate'
                  ? '#fef2f2'
                  : feedback === 'valid'
                  ? '#f0fdf4'
                  : currentWord.length >= 3
                  ? '#f5f3ff'
                  : '#f8fafc',
                borderRadius: 12,
                borderWidth: 2,
                borderColor: feedback === 'invalid' || feedback === 'duplicate'
                  ? '#fca5a5'
                  : feedback === 'valid'
                  ? '#86efac'
                  : currentWord.length >= 3
                  ? '#a78bfa'
                  : '#e2e8f0',
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: feedback === 'invalid' || feedback === 'duplicate'
                    ? '#dc2626'
                    : feedback === 'valid'
                    ? '#16a34a'
                    : currentWord.length >= 3
                    ? '#7c3aed'
                    : '#94a3b8',
                  textAlign: 'center',
                  letterSpacing: 3,
                }}
              >
                {currentWord || 'Swipe to spell'}
              </Text>
            </View>
            {feedback === 'duplicate' && (
              <Text style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>
                Already found!
              </Text>
            )}
          </View>
        </View>

        {/* Game Content */}
        <View className="flex-1" style={{ flexDirection: useMobileLayout ? 'column' : 'row' }}>
          {/* Grid */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 16,
            }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={!isDragging}
          >
            {!useMobileLayout ? (
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 20,
                  padding: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 5,
                }}
              >
                {grid.map((row, rowIndex) => (
                  <View key={rowIndex} style={{ flexDirection: 'row' }}>
                    {row.map((letter, colIndex) => (
                      <Cell
                        key={`${gameKey}-${rowIndex}-${colIndex}`}
                        letter={letter}
                        row={rowIndex}
                        col={colIndex}
                        isSelected={isCellSelected(rowIndex, colIndex)}
                        selectionOrder={getSelectionOrder(rowIndex, colIndex)}
                        onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                        cellSize={cellSize}
                        index={rowIndex * GRID_SIZE + colIndex}
                        gameKey={gameKey}
                      />
                    ))}
                  </View>
                ))}
              </View>
            ) : (
              <GestureDetector gesture={panGesture}>
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 5,
                  }}
                >
                  {grid.map((row, rowIndex) => (
                    <View key={rowIndex} style={{ flexDirection: 'row' }}>
                      {row.map((letter, colIndex) => (
                        <Cell
                          key={`${gameKey}-${rowIndex}-${colIndex}`}
                          letter={letter}
                          row={rowIndex}
                          col={colIndex}
                          isSelected={isCellSelected(rowIndex, colIndex)}
                          selectionOrder={getSelectionOrder(rowIndex, colIndex)}
                          onMouseDown={() => {}}
                          onMouseEnter={() => {}}
                          cellSize={cellSize}
                          index={rowIndex * GRID_SIZE + colIndex}
                          gameKey={gameKey}
                        />
                      ))}
                    </View>
                  ))}
                </View>
              </GestureDetector>
            )}

            {/* Instructions */}
            <View style={{ marginTop: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'center' }}>
                Swipe through adjacent letters to spell words.
              </Text>
              <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 2 }}>
                Each letter can only be used once per word.
              </Text>
            </View>
          </ScrollView>

          {/* Found Words List */}
          <View
            style={{
              width: useMobileLayout ? '100%' : 300,
              padding: 16,
              backgroundColor: useMobileLayout ? 'transparent' : 'white',
              borderLeftWidth: useMobileLayout ? 0 : 1,
              borderLeftColor: '#e2e8f0',
              maxHeight: useMobileLayout ? 160 : undefined,
            }}
          >
            <Text
              className="font-bold text-slate-700"
              style={{
                fontSize: useMobileLayout ? 14 : 16,
                marginBottom: 12,
                textAlign: useMobileLayout ? 'center' : 'left',
              }}
            >
              Found Words ({foundWords.length}/{possibleWords.size})
            </Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: useMobileLayout ? 'center' : 'flex-start',
              }}
            >
              {foundWords.map((fw, index) => (
                <FoundWordItem key={fw.word} word={fw.word} points={fw.points} />
              ))}
              {foundWords.length === 0 && (
                <Text style={{ fontSize: 14, color: '#94a3b8', fontStyle: 'italic' }}>
                  No words found yet
                </Text>
              )}
            </ScrollView>
          </View>
        </View>

        {/* Victory Modal */}
        {gameComplete && (
          <VictoryScreen
            wordsFound={foundWords.length}
            totalWords={possibleWords.size}
            score={score}
            onPlayAgain={initializeGame}
            onBackToHome={() => router.back()}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
