import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsMobileLayout } from '../../hooks/useDeviceType';

// Crossword puzzle data
interface ClueData {
  number: number;
  clue: string;
  answer: string;
  row: number;
  col: number;
  direction: 'across' | 'down';
}

// Shabbos Crossword - 10x10 grid with 7 words
const GRID_SIZE = 10;

// VERIFIED LAYOUT:
//     0 1 2 3 4 5 6 7 8 9
//  0  S H A B B O S . K .    1-Across: SHABBOS
//  1  E . . . . N . . I .
//  2  U . . . . E . . D .
//  3  D . . . . G . . D .
//  4  A . . . . . B . U .
//  5  H A V D A L A . S .    5-Across: HAVDALA
//  6  . . . . . . T . H .
//  7  C H A L L A H . . .    7-Across: CHALLAH
//  8  . . . . . . . . . .
//  9  . . . . . . . . . .
//
// Verified words and intersections:
// 1. SHABBOS (0,0)→(0,6): S H A B B O S
// 2. SEUDAH (0,0)→(5,0): S E U D A H
//    - (0,0) SHABBOS[0]=S, SEUDAH[0]=S ✓
//    - (5,0) HAVDALA[0]=H, SEUDAH[5]=H ✓
// 3. ONEG (0,5)→(3,5): O N E G
//    - (0,5) SHABBOS[5]=O, ONEG[0]=O ✓
// 4. KIDDUSH (0,8)→(6,8): K I D D U S H (no intersections)
// 5. HAVDALA (5,0)→(5,6): H A V D A L A
//    - (5,0) SEUDAH[5]=H ✓
//    - (5,6) BATH[1]=A ✓
// 6. BATH (4,6)→(7,6): B A T H
//    - (5,6) HAVDALA[6]=A, BATH[1]=A ✓
//    - (7,6) CHALLAH[6]=H, BATH[3]=H ✓
// 7. CHALLAH (7,0)→(7,6): C H A L L A H
//    - (7,6) BATH[3]=H ✓

const CLUES: ClueData[] = [
  // Across clues
  { number: 1, clue: 'The holy day of rest', answer: 'SHABBOS', row: 0, col: 0, direction: 'across' },
  { number: 5, clue: 'End of Shabbos ceremony', answer: 'HAVDALA', row: 5, col: 0, direction: 'across' },
  { number: 7, clue: 'Braided bread we eat on Shabbos', answer: 'CHALLAH', row: 7, col: 0, direction: 'across' },
  // Down clues
  { number: 2, clue: 'A Shabbos meal', answer: 'SEUDAH', row: 0, col: 0, direction: 'down' },
  { number: 3, clue: 'Shabbos joy and delight', answer: 'ONEG', row: 0, col: 5, direction: 'down' },
  { number: 4, clue: 'Friday night blessing over wine', answer: 'KIDDUSH', row: 0, col: 8, direction: 'down' },
  { number: 6, clue: 'Shabbos mikvah (ritual _____)', answer: 'BATH', row: 4, col: 6, direction: 'down' },
];

// Build the grid layout
function buildGrid(): (string | null)[][] {
  const grid: (string | null)[][] = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));

  for (const clue of CLUES) {
    const { answer, row, col, direction } = clue;
    for (let i = 0; i < answer.length; i++) {
      const r = direction === 'across' ? row : row + i;
      const c = direction === 'across' ? col + i : col;
      if (r < GRID_SIZE && c < GRID_SIZE) {
        grid[r][c] = answer[i];
      }
    }
  }

  return grid;
}

// Get the clue number for a cell if it starts a word
function getCellNumber(row: number, col: number): number | null {
  for (const clue of CLUES) {
    if (clue.row === row && clue.col === col) {
      return clue.number;
    }
  }
  return null;
}

// Check if a cell is part of the puzzle
function isCellActive(grid: (string | null)[][], row: number, col: number): boolean {
  return grid[row]?.[col] !== null;
}

// Header button with hover and spin animations
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
    // Scale animation on press for all buttons
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1, { damping: 15 })
    );

    if (variant === 'refresh') {
      // Spin animation on press
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
      ? (variant === 'refresh' ? '#ede9fe' : '#e2e8f0')
      : (variant === 'refresh' ? '#f3e8ff' : '#f1f5f9'),
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

interface CellProps {
  row: number;
  col: number;
  correctLetter: string | null;
  userLetter: string;
  isSelected: boolean;
  isHighlighted: boolean;
  cellNumber: number | null;
  onPress: () => void;
  cellSize: number;
  isCorrect: boolean;
}

function Cell({
  correctLetter,
  userLetter,
  isSelected,
  isHighlighted,
  cellNumber,
  onPress,
  cellSize,
  isCorrect,
}: CellProps) {
  if (correctLetter === null) {
    return (
      <View
        style={{
          width: cellSize,
          height: cellSize,
          backgroundColor: '#1e293b',
        }}
      />
    );
  }

  const getBgColor = () => {
    if (isCorrect && userLetter) return '#dcfce7';
    if (isSelected) return '#ddd6fe';
    if (isHighlighted) return '#ede9fe';
    return 'white';
  };

  const getBorderColor = () => {
    if (isSelected) return '#7c3aed';
    if (isHighlighted) return '#a78bfa';
    return '#cbd5e1';
  };

  const displayLetter = userLetter;

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: cellSize,
        height: cellSize,
        backgroundColor: getBgColor(),
        borderWidth: isSelected ? 2 : 1,
        borderColor: getBorderColor(),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {cellNumber && (
        <Text
          style={{
            position: 'absolute',
            top: 2,
            left: 3,
            fontSize: cellSize * 0.22,
            color: '#64748b',
            fontWeight: '600',
          }}
        >
          {cellNumber}
        </Text>
      )}
      <Text
        style={{
          fontSize: cellSize * 0.55,
          fontWeight: '700',
          color: isCorrect ? '#166534' : '#1e293b',
        }}
      >
        {displayLetter}
      </Text>
    </Pressable>
  );
}

// Clue item component
function ClueItem({
  clue,
  isSelected,
  isCompleted,
  onPress,
}: {
  clue: ClueData;
  isSelected: boolean;
  isCompleted: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: isSelected ? '#ede9fe' : isCompleted ? '#dcfce7' : 'white',
        borderRadius: 8,
        marginBottom: 6,
        borderWidth: isSelected ? 2 : 1,
        borderColor: isSelected ? '#7c3aed' : isCompleted ? '#86efac' : '#e2e8f0',
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: '700',
          color: '#7c3aed',
          width: 24,
        }}
      >
        {clue.number}.
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: isCompleted ? '#166534' : '#334155',
          flex: 1,
          textDecorationLine: isCompleted ? 'line-through' : 'none',
        }}
      >
        {clue.clue}
      </Text>
      {isCompleted && (
        <FontAwesome name="check" size={14} color="#22c55e" style={{ marginLeft: 8 }} />
      )}
    </Pressable>
  );
}

// Confetti particle
function ConfettiParticle({ index }: { index: number }) {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const emojis = ['✨', '⭐', '🎊', '🎉', '💫', '✡️', '🕯️'];
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

// Victory screen
function VictoryScreen({
  wordsCompleted,
  totalWords,
  onPlayAgain,
  onBackToHome,
  isMobile,
}: {
  wordsCompleted: number;
  totalWords: number;
  onPlayAgain: () => void;
  onBackToHome: () => void;
  isMobile: boolean;
}) {
  const isDesktop = !isMobile;
  const trophyScale = useSharedValue(0);
  const trophyRotate = useSharedValue(-180);
  const candleGlow = useSharedValue(0);

  useEffect(() => {
    trophyScale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 100 }));
    trophyRotate.value = withDelay(300, withSpring(0, { damping: 10, stiffness: 80 }));
    // Pulsing glow effect
    candleGlow.value = withDelay(
      600,
      withTiming(1, { duration: 1000 }, () => {
        candleGlow.value = withTiming(0.5, { duration: 1000 });
      })
    );
  }, [trophyScale, trophyRotate, candleGlow]);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }, { rotate: `${trophyRotate.value}deg` }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: candleGlow.value,
    transform: [{ scale: 1 + candleGlow.value * 0.1 }],
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
        style={{
          backgroundColor: 'white',
          borderRadius: 24,
          alignItems: 'center',
          width: '100%',
          maxWidth: 400,
          padding: isDesktop ? 48 : 40,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 20 },
          shadowOpacity: 0.4,
          shadowRadius: 30,
          elevation: 15,
        }}
      >
        {/* Candle icon with glow */}
        <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View
            style={[
              glowStyle,
              {
                position: 'absolute',
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: '#fef3c7',
              },
            ]}
          />
          <Animated.View style={trophyStyle}>
            <Text style={{ fontSize: 72 }}>🕯️</Text>
          </Animated.View>
        </View>

        <Animated.View entering={FadeIn.duration(400).delay(400)}>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#1e293b',
              marginTop: 24,
              fontSize: isDesktop ? 36 : 28,
              textAlign: 'center',
            }}
          >
            Good Shabbos!
          </Text>
          <Text
            style={{
              color: '#64748b',
              textAlign: 'center',
              marginTop: 8,
              fontSize: 16,
            }}
          >
            You solved all {totalWords} clues!
          </Text>
        </Animated.View>

        {/* Stats */}
        <Animated.View
          entering={FadeIn.duration(400).delay(500)}
          style={{ marginTop: 24, width: '100%' }}
        >
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#f3e8ff',
              borderRadius: 16,
              paddingVertical: 20,
              paddingHorizontal: 24,
            }}
          >
            <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#7c3aed' }}>
              {wordsCompleted}/{totalWords}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: '#7c3aed',
                marginTop: 4,
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontWeight: '600',
              }}
            >
              Words Completed
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(800)} style={{ width: '100%' }}>
          <Pressable
            onPress={onPlayAgain}
            style={{
              backgroundColor: '#7c3aed',
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 32,
              marginTop: 24,
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

export default function ShabbosCrosswordGame() {
  const { isMobile } = useIsMobileLayout();
  const [grid] = useState(() => buildGrid());
  const [userInputs, setUserInputs] = useState<string[][]>(() =>
    Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(''))
  );
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedClue, setSelectedClue] = useState<ClueData | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameKey, setGameKey] = useState(0); // Key for re-mounting animations
  const inputRef = useRef<TextInput>(null);

  const cellSize = isMobile ? 38 : 42;

  // Check if a word is completed correctly
  const isWordComplete = useCallback(
    (clue: ClueData): boolean => {
      const { answer, row, col, direction } = clue;
      for (let i = 0; i < answer.length; i++) {
        const r = direction === 'across' ? row : row + i;
        const c = direction === 'across' ? col + i : col;
        if (userInputs[r]?.[c]?.toUpperCase() !== answer[i]) {
          return false;
        }
      }
      return true;
    },
    [userInputs]
  );

  // Check if the entire puzzle is complete
  useEffect(() => {
    const allComplete = CLUES.every((clue) => isWordComplete(clue));
    if (allComplete && !gameComplete) {
      setGameComplete(true);
    }
  }, [userInputs, isWordComplete, gameComplete]);

  // Get cells that should be highlighted for the selected clue
  const getHighlightedCells = useCallback((): Set<string> => {
    if (!selectedClue) return new Set();
    const cells = new Set<string>();
    const { answer, row, col, direction } = selectedClue;
    for (let i = 0; i < answer.length; i++) {
      const r = direction === 'across' ? row : row + i;
      const c = direction === 'across' ? col + i : col;
      cells.add(`${r}-${c}`);
    }
    return cells;
  }, [selectedClue]);

  const highlightedCells = getHighlightedCells();

  const handleCellPress = (row: number, col: number) => {
    if (!isCellActive(grid, row, col)) return;

    setSelectedCell({ row, col });

    // Find clues that include this cell
    const cluesForCell = CLUES.filter((clue) => {
      const { answer, row: clueRow, col: clueCol, direction } = clue;
      for (let i = 0; i < answer.length; i++) {
        const r = direction === 'across' ? clueRow : clueRow + i;
        const c = direction === 'across' ? clueCol + i : clueCol;
        if (r === row && c === col) return true;
      }
      return false;
    });

    // If clicking same cell, toggle between across/down clues
    if (selectedCell?.row === row && selectedCell?.col === col && cluesForCell.length > 1) {
      const currentIndex = cluesForCell.findIndex((c) => c.number === selectedClue?.number);
      const nextClue = cluesForCell[(currentIndex + 1) % cluesForCell.length];
      setSelectedClue(nextClue);
    } else {
      // Prefer across clue by default
      const acrossClue = cluesForCell.find((c) => c.direction === 'across');
      setSelectedClue(acrossClue || cluesForCell[0] || null);
    }

    // Focus the hidden input
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleCluePress = (clue: ClueData) => {
    setSelectedClue(clue);
    setSelectedCell({ row: clue.row, col: clue.col });
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyInput = (text: string) => {
    if (!selectedCell || !selectedClue) return;

    const letter = text.toUpperCase().slice(-1);
    if (!/^[A-Z]$/.test(letter) && letter !== '') return;

    const { row, col } = selectedCell;

    // Bounds check
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return;
    if (!userInputs[row]) return;

    const newInputs = [...userInputs];
    newInputs[row] = [...newInputs[row]];
    newInputs[row][col] = letter;
    setUserInputs(newInputs);

    // Move to next cell in the word
    if (letter) {
      const { direction, answer } = selectedClue;
      const startRow = selectedClue.row;
      const startCol = selectedClue.col;

      // Find current position in word
      const currentPos = direction === 'across' ? col - startCol : row - startRow;

      // Move to next empty cell or just next cell
      for (let i = currentPos + 1; i < answer.length; i++) {
        const nextRow = direction === 'across' ? startRow : startRow + i;
        const nextCol = direction === 'across' ? startCol + i : startCol;

        // Bounds check for next cell
        if (nextRow >= 0 && nextRow < GRID_SIZE && nextCol >= 0 && nextCol < GRID_SIZE) {
          if (!newInputs[nextRow]?.[nextCol]) {
            setSelectedCell({ row: nextRow, col: nextCol });
            return;
          }
        }
      }

      // If no empty cell, just move to next (if within bounds)
      if (currentPos + 1 < answer.length) {
        const nextRow = direction === 'across' ? startRow : startRow + currentPos + 1;
        const nextCol = direction === 'across' ? startCol + currentPos + 1 : startCol;

        if (nextRow >= 0 && nextRow < GRID_SIZE && nextCol >= 0 && nextCol < GRID_SIZE) {
          setSelectedCell({ row: nextRow, col: nextCol });
        }
      }
      // If at end of word, just stay on current cell (don't crash)
    }
  };

  const handleBackspace = () => {
    if (!selectedCell || !selectedClue) return;

    const { row, col } = selectedCell;

    // Bounds check
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return;
    if (!userInputs[row]) return;

    // If current cell is empty, move back first
    if (!userInputs[row][col]) {
      const { direction } = selectedClue;
      const startRow = selectedClue.row;
      const startCol = selectedClue.col;
      const currentPos = direction === 'across' ? col - startCol : row - startRow;

      if (currentPos > 0) {
        const prevRow = direction === 'across' ? startRow : startRow + currentPos - 1;
        const prevCol = direction === 'across' ? startCol + currentPos - 1 : startCol;

        // Bounds check for previous cell
        if (prevRow >= 0 && prevRow < GRID_SIZE && prevCol >= 0 && prevCol < GRID_SIZE) {
          setSelectedCell({ row: prevRow, col: prevCol });

          // Clear that cell
          const newInputs = [...userInputs];
          newInputs[prevRow] = [...newInputs[prevRow]];
          newInputs[prevRow][prevCol] = '';
          setUserInputs(newInputs);
        }
      }
    } else {
      // Clear current cell
      const newInputs = [...userInputs];
      newInputs[row] = [...newInputs[row]];
      newInputs[row][col] = '';
      setUserInputs(newInputs);
    }
  };

  const initializeGame = useCallback(() => {
    setUserInputs(
      Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill(''))
    );
    setSelectedCell(null);
    setSelectedClue(null);
    setGameComplete(false);
    setGameKey((k) => k + 1); // Bump key to trigger re-mount animations
  }, []);

  const acrossClues = CLUES.filter((c) => c.direction === 'across');
  const downClues = CLUES.filter((c) => c.direction === 'down');

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar style="dark" />

      {/* Hidden input for keyboard */}
      <TextInput
        ref={inputRef}
        value=""
        onChangeText={handleKeyInput}
        onKeyPress={(e) => {
          if (e.nativeEvent.key === 'Backspace') {
            handleBackspace();
          }
        }}
        autoCapitalize="characters"
        autoCorrect={false}
        style={{ position: 'absolute', opacity: 0, height: 0 }}
      />

      {/* Header */}
      <View className="bg-white border-b border-slate-200">
        <View className="flex-row items-center justify-between px-4 py-3">
          <HeaderButton
            icon="arrow-left"
            onPress={() => {
              Keyboard.dismiss();
              router.back();
            }}
          />

          <View className="items-center flex-1 mx-4">
            <Text className={`font-bold text-slate-800 ${!isMobile ? 'text-xl' : 'text-lg'}`}>
              Shabbos Crossword
            </Text>
          </View>

          <HeaderButton icon="refresh" variant="refresh" onPress={initializeGame} />
        </View>
      </View>

      {/* Game Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 16,
          flexDirection: !isMobile ? 'row' : 'column',
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Grid */}
        <Animated.View
          key={`grid-${gameKey}`}
          entering={FadeInDown.duration(400).springify()}
          style={{
            alignSelf: !isMobile ? 'flex-start' : 'center',
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          {grid.map((row, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: 'row' }}>
              {row.map((cell, colIndex) => {
                const cellKey = `${rowIndex}-${colIndex}`;
                const isSelected =
                  selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                const isHighlighted = highlightedCells.has(cellKey);
                const userLetter = userInputs[rowIndex][colIndex];
                const isCorrect =
                  cell !== null && userLetter.toUpperCase() === cell.toUpperCase();

                return (
                  <Cell
                    key={cellKey}
                    row={rowIndex}
                    col={colIndex}
                    correctLetter={cell}
                    userLetter={userLetter}
                    isSelected={isSelected}
                    isHighlighted={isHighlighted}
                    cellNumber={getCellNumber(rowIndex, colIndex)}
                    onPress={() => handleCellPress(rowIndex, colIndex)}
                    cellSize={cellSize}
                    isCorrect={isCorrect}
                  />
                );
              })}
            </View>
          ))}
        </Animated.View>

        {/* Clues */}
        <View style={{ flex: !isMobile ? 1 : undefined }} key={`clues-${gameKey}`}>
          {/* Across */}
          <Animated.View
            entering={FadeIn.duration(300).delay(100)}
            style={{ marginBottom: 16 }}
          >
            <Text
              className="font-bold text-slate-700 mb-2"
              style={{ fontSize: !isMobile ? 16 : 14 }}
            >
              Across
            </Text>
            {acrossClues.map((clue, index) => (
              <Animated.View
                key={`across-${clue.number}`}
                entering={FadeIn.duration(200).delay(150 + index * 50)}
              >
                <ClueItem
                  clue={clue}
                  isSelected={selectedClue?.number === clue.number && selectedClue?.direction === 'across'}
                  isCompleted={isWordComplete(clue)}
                  onPress={() => handleCluePress(clue)}
                />
              </Animated.View>
            ))}
          </Animated.View>

          {/* Down */}
          <Animated.View entering={FadeIn.duration(300).delay(300)}>
            <Text
              className="font-bold text-slate-700 mb-2"
              style={{ fontSize: !isMobile ? 16 : 14 }}
            >
              Down
            </Text>
            {downClues.map((clue, index) => (
              <Animated.View
                key={`down-${clue.number}`}
                entering={FadeIn.duration(200).delay(350 + index * 50)}
              >
                <ClueItem
                  clue={clue}
                  isSelected={selectedClue?.number === clue.number && selectedClue?.direction === 'down'}
                  isCompleted={isWordComplete(clue)}
                  onPress={() => handleCluePress(clue)}
                />
              </Animated.View>
            ))}
          </Animated.View>
        </View>
      </ScrollView>

      {/* Victory Modal */}
      {gameComplete && (
        <VictoryScreen
          wordsCompleted={CLUES.length}
          totalWords={CLUES.length}
          onPlayAgain={initializeGame}
          onBackToHome={() => router.back()}
          isMobile={isMobile}
        />
      )}
    </SafeAreaView>
  );
}
