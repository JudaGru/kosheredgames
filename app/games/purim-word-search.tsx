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

// Purim words to find (English with Hebrew)
const PURIM_WORDS = [
  { english: 'PURIM', hebrew: 'פורים', found: false },
  { english: 'MEGILLAH', hebrew: 'מגילה', found: false },
  { english: 'ESTHER', hebrew: 'אסתר', found: false },
  { english: 'MORDECHAI', hebrew: 'מרדכי', found: false },
  { english: 'HAMAN', hebrew: 'המן', found: false },
  { english: 'MISHLOACH', hebrew: 'משלוח מנות', found: false },
  { english: 'COSTUME', hebrew: 'תחפושת', found: false },
  { english: 'GRAGGER', hebrew: 'רעשן', found: false },
];

const GRID_SIZE = 10;

type Direction = 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';

interface PlacedWord {
  word: string;
  hebrew: string;
  startRow: number;
  startCol: number;
  direction: Direction;
  cells: { row: number; col: number }[];
}

interface CellData {
  letter: string;
  row: number;
  col: number;
  isPartOfWord: boolean;
  wordIndices: number[];
}

function generateGrid(): { grid: CellData[][]; placedWords: PlacedWord[] } {
  const grid: CellData[][] = Array(GRID_SIZE)
    .fill(null)
    .map((_, row) =>
      Array(GRID_SIZE)
        .fill(null)
        .map((_, col) => ({
          letter: '',
          row,
          col,
          isPartOfWord: false,
          wordIndices: [],
        }))
    );

  const placedWords: PlacedWord[] = [];
  const directions: Direction[] = ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up'];

  // Sort words by length (longer first for better placement)
  const sortedWords = [...PURIM_WORDS].sort((a, b) => b.english.length - a.english.length);

  for (const wordData of sortedWords) {
    const word = wordData.english;
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      attempts++;
      const direction = directions[Math.floor(Math.random() * directions.length)];
      let maxRow = GRID_SIZE;
      let maxCol = GRID_SIZE;

      switch (direction) {
        case 'horizontal':
          maxCol = GRID_SIZE - word.length + 1;
          break;
        case 'vertical':
          maxRow = GRID_SIZE - word.length + 1;
          break;
        case 'diagonal-down':
          maxRow = GRID_SIZE - word.length + 1;
          maxCol = GRID_SIZE - word.length + 1;
          break;
        case 'diagonal-up':
          maxRow = GRID_SIZE;
          maxCol = GRID_SIZE - word.length + 1;
          break;
      }

      if (maxRow <= 0 || maxCol <= 0) continue;

      const startRow = Math.floor(Math.random() * maxRow);
      const startCol = Math.floor(Math.random() * maxCol);

      // Check if word can be placed
      let canPlace = true;
      const cells: { row: number; col: number }[] = [];

      for (let i = 0; i < word.length; i++) {
        let r = startRow;
        let c = startCol;

        switch (direction) {
          case 'horizontal':
            c = startCol + i;
            break;
          case 'vertical':
            r = startRow + i;
            break;
          case 'diagonal-down':
            r = startRow + i;
            c = startCol + i;
            break;
          case 'diagonal-up':
            r = startRow - i;
            c = startCol + i;
            break;
        }

        if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) {
          canPlace = false;
          break;
        }

        const existingLetter = grid[r][c].letter;
        if (existingLetter !== '' && existingLetter !== word[i]) {
          canPlace = false;
          break;
        }

        cells.push({ row: r, col: c });
      }

      if (canPlace) {
        // Place the word
        for (let i = 0; i < word.length; i++) {
          const { row: r, col: c } = cells[i];
          grid[r][c].letter = word[i];
          grid[r][c].isPartOfWord = true;
          grid[r][c].wordIndices.push(placedWords.length);
        }

        placedWords.push({
          word,
          hebrew: wordData.hebrew,
          startRow,
          startCol,
          direction,
          cells,
        });

        placed = true;
      }
    }
  }

  // Fill empty cells with random letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c].letter === '') {
        grid[r][c].letter = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }

  return { grid, placedWords };
}

// Header button with hover animation
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
      ? (variant === 'refresh' ? '#fce7f3' : '#e2e8f0')
      : (variant === 'refresh' ? '#fce7f3' : '#f1f5f9'),
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
          color={variant === 'refresh' ? '#db2777' : '#64748b'}
        />
      </Animated.View>
    </Pressable>
  );
}

interface CellProps {
  cell: CellData;
  isSelected: boolean;
  isFoundWord: boolean;
  foundWordColor?: string;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onPress: () => void;
  cellSize: number;
  index: number;
  gameKey: number;
}

function Cell({ cell, isSelected, isFoundWord, foundWordColor, onMouseDown, onMouseEnter, onPress, cellSize, index, gameKey }: CellProps) {
  const isWeb = Platform.OS === 'web';
  const entranceAnim = useSharedValue(0);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    // Reset and replay animation when gameKey changes
    entranceAnim.value = 0;
    entranceAnim.value = withDelay(
      index * 8,
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

  const fontSize = cellSize * 0.5;

  // For web, we use native mouse events for drag selection
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
        onPress={isWeb ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          width: cellSize,
          height: cellSize,
          margin: 2,
          borderRadius: 6,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isFoundWord
            ? foundWordColor || '#fde047'
            : isSelected
            ? '#f472b6'
            : 'white',
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? '#db2777' : '#e2e8f0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
          // @ts-ignore - cursor style for web
          cursor: isWeb ? 'pointer' : undefined,
          // @ts-ignore - prevent text selection on web
          userSelect: isWeb ? 'none' : undefined,
        }}
        {...webProps}
      >
        <Text
          style={{
            fontSize,
            fontWeight: 'bold',
            color: isFoundWord ? '#1e293b' : isSelected ? 'white' : '#334155',
            // @ts-ignore - prevent text selection on web
            userSelect: isWeb ? 'none' : undefined,
          }}
        >
          {cell.letter}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// Word list item component
function WordListItem({
  word,
  hebrew,
  isFound,
  index,
}: {
  word: string;
  hebrew: string;
  isFound: boolean;
  index: number;
}) {
  const strikethrough = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isFound) {
      scale.value = withSequence(
        withSpring(1.1, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 150 })
      );
      strikethrough.value = withTiming(1, { duration: 300 });
    }
  }, [isFound]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: isFound ? 0.6 : 1,
  }));

  const lineStyle = useAnimatedStyle(() => ({
    width: `${strikethrough.value * 100}%`,
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(300).delay(index * 50)}
      style={[animatedStyle]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 12,
          backgroundColor: isFound ? '#dcfce7' : 'white',
          borderRadius: 8,
          marginBottom: 6,
          borderWidth: 1,
          borderColor: isFound ? '#86efac' : '#e2e8f0',
        }}
      >
        <View style={{ flex: 1, position: 'relative' }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: isFound ? '#166534' : '#334155',
            }}
          >
            {word}
          </Text>
          {isFound && (
            <Animated.View
              style={[
                lineStyle,
                {
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  height: 2,
                  backgroundColor: '#166534',
                },
              ]}
            />
          )}
        </View>
        <Text
          style={{
            fontSize: 14,
            color: isFound ? '#166534' : '#64748b',
            marginLeft: 8,
          }}
        >
          {hebrew}
        </Text>
        {isFound && (
          <Text style={{ marginLeft: 8, fontSize: 16 }}>✓</Text>
        )}
      </View>
    </Animated.View>
  );
}

// Single confetti particle component
function ConfettiParticle({ index }: { index: number }) {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const emojis = ['✨', '🎭', '👑', '🍪', '📜', '🎊', '💫', '🎉'];
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

// Confetti animation
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
  elapsedTime,
  wordsFound,
  totalWords,
  onPlayAgain,
  onBackToHome,
}: {
  elapsedTime: number;
  wordsFound: number;
  totalWords: number;
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <Text style={{ fontSize: 72 }}>🎭</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(400)}>
          <Text style={{ fontWeight: 'bold', color: '#1e293b', marginTop: 24, fontSize: isWeb ? 36 : 28, textAlign: 'center' }}>
            Purim Sameach!
          </Text>
          <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 8, fontSize: 16 }}>
            You found all {totalWords} Purim words!
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(500)} className="mt-8">
          <View className="items-center bg-pink-50 rounded-2xl py-6 px-8">
            <Text className="text-5xl font-bold text-pink-600">{formatTime(elapsedTime)}</Text>
            <Text className="text-sm text-pink-700 mt-2 uppercase tracking-wide font-semibold">
              Time
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(800)} style={{ width: '100%' }}>
          <Pressable
            onPress={onPlayAgain}
            style={{
              backgroundColor: '#db2777',
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 32,
              marginTop: 32,
              shadowColor: '#db2777',
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

export default function PurimWordSearchGame() {
  const isWeb = Platform.OS === 'web';
  const { isMobile, isLoading: isDetectingDevice } = useIsMobileLayout();
  const useMobileLayout = isMobile;
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [grid, setGrid] = useState<CellData[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [firstCellSelected, setFirstCellSelected] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const isProcessing = useRef(false);
  const gridRef = useRef<View>(null);
  const gridPosition = useRef({ x: 0, y: 0 });
  const lastTouchPosition = useRef<{ x: number; y: number } | null>(null);
  const currentSelectionRef = useRef<{ row: number; col: number }[]>([]);
  const isDraggingRef = useRef(false);

  // Word colors for found words (pink-themed for Purim)
  const wordColors = [
    '#f9a8d4', // Pink
    '#86efac', // Green
    '#fde047', // Yellow
    '#fda4af', // Rose
    '#7dd3fc', // Sky
    '#fdba74', // Orange
    '#67e8f9', // Cyan
    '#c4b5fd', // Violet
  ];

  const [wordColorMap, setWordColorMap] = useState<Map<string, string>>(new Map());

  const calculateCellSize = useCallback(() => {
    const padding = 32;
    const wordListWidth = useMobileLayout ? 0 : 200;
    const headerHeight = useMobileLayout ? 150 : 120;
    const wordListHeightMobile = useMobileLayout ? 90 : 0; // Reduced since words are now compact

    const availableWidth = screenWidth - padding - wordListWidth;
    const availableHeight = screenHeight - headerHeight - padding - wordListHeightMobile;

    const maxCellWidth = (availableWidth - GRID_SIZE * 4) / GRID_SIZE;
    const maxCellHeight = (availableHeight - GRID_SIZE * 4) / GRID_SIZE;

    return Math.min(maxCellWidth, maxCellHeight, useMobileLayout ? 34 : 45);
  }, [screenWidth, screenHeight, useMobileLayout]);

  const cellSize = calculateCellSize();

  const initializeGame = useCallback(() => {
    const { grid: newGrid, placedWords: newPlacedWords } = generateGrid();
    setGrid(newGrid);
    setPlacedWords(newPlacedWords);
    setSelectedCells([]);
    setFoundWords(new Set());
    setWordColorMap(new Map());
    setGameComplete(false);
    setStartTime(null);
    setElapsedTime(0);
    setFirstCellSelected(false);
    setGameKey(prev => prev + 1);
    isProcessing.current = false;
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (!startTime || gameComplete) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, gameComplete]);

  const checkForWord = useCallback(
    (cells: { row: number; col: number }[]) => {
      if (cells.length < 3) return null;

      // Get the letters from selected cells
      const selectedLetters = cells.map((c) => grid[c.row][c.col].letter).join('');
      const reversedLetters = selectedLetters.split('').reverse().join('');

      // Check if this matches any placed word
      for (const placedWord of placedWords) {
        if (foundWords.has(placedWord.word)) continue;

        if (selectedLetters === placedWord.word || reversedLetters === placedWord.word) {
          // Verify the cells match the word's position
          const wordCells = placedWord.cells;
          const cellsMatch =
            cells.length === wordCells.length &&
            (cells.every((c, i) => c.row === wordCells[i].row && c.col === wordCells[i].col) ||
              cells.every(
                (c, i) =>
                  c.row === wordCells[wordCells.length - 1 - i].row &&
                  c.col === wordCells[wordCells.length - 1 - i].col
              ));

          if (cellsMatch) {
            return placedWord.word;
          }
        }
      }

      return null;
    },
    [grid, placedWords, foundWords]
  );

  const handleCellPress = (row: number, col: number) => {
    if (isProcessing.current || gameComplete) return;

    if (!firstCellSelected) {
      setFirstCellSelected(true);
      setStartTime(Date.now());
    }

    // Check if cell is already selected
    const existingIndex = selectedCells.findIndex((c) => c.row === row && c.col === col);

    if (existingIndex !== -1) {
      // If it's the last cell, deselect it
      if (existingIndex === selectedCells.length - 1) {
        setSelectedCells(selectedCells.slice(0, -1));
      }
      return;
    }

    // Check if this cell is adjacent to the last selected cell (if any)
    if (selectedCells.length > 0) {
      const lastCell = selectedCells[selectedCells.length - 1];
      const rowDiff = Math.abs(row - lastCell.row);
      const colDiff = Math.abs(col - lastCell.col);

      // Must be adjacent (including diagonal)
      if (rowDiff > 1 || colDiff > 1) {
        // Start a new selection
        setSelectedCells([{ row, col }]);
        return;
      }

      // Check if selection maintains a straight line
      if (selectedCells.length >= 2) {
        const firstCell = selectedCells[0];
        const secondCell = selectedCells[1];
        const dirRow = secondCell.row - firstCell.row;
        const dirCol = secondCell.col - firstCell.col;

        const expectedRow = lastCell.row + dirRow;
        const expectedCol = lastCell.col + dirCol;

        if (row !== expectedRow || col !== expectedCol) {
          // Start a new selection
          setSelectedCells([{ row, col }]);
          return;
        }
      }
    }

    const newSelection = [...selectedCells, { row, col }];
    setSelectedCells(newSelection);

    // Check if we found a word
    const foundWord = checkForWord(newSelection);
    if (foundWord) {
      isProcessing.current = true;

      // Assign a color to the found word
      const colorIndex = foundWords.size % wordColors.length;
      const newColorMap = new Map(wordColorMap);
      newColorMap.set(foundWord, wordColors[colorIndex]);
      setWordColorMap(newColorMap);

      const newFoundWords = new Set(foundWords);
      newFoundWords.add(foundWord);
      setFoundWords(newFoundWords);

      // Clear selection after a short delay
      setTimeout(() => {
        setSelectedCells([]);
        setIsDragging(false);
        isProcessing.current = false;

        // Check if all words are found
        if (newFoundWords.size === placedWords.length) {
          setGameComplete(true);
        }
      }, 300);
    }
  };

  // Handle mouse down on a cell (start drag on web)
  const handleCellMouseDown = (row: number, col: number) => {
    if (isProcessing.current || gameComplete) return;

    if (!firstCellSelected) {
      setFirstCellSelected(true);
      setStartTime(Date.now());
    }

    setIsDragging(true);
    setSelectedCells([{ row, col }]);
  };

  // Handle mouse enter on a cell (continue drag on web)
  const handleCellMouseEnter = (row: number, col: number) => {
    if (!isDragging || isProcessing.current || gameComplete) return;
    if (selectedCells.length === 0) return;

    // Check if cell is already selected
    if (selectedCells.some((c) => c.row === row && c.col === col)) return;

    const lastCell = selectedCells[selectedCells.length - 1];
    const rowDiff = Math.abs(row - lastCell.row);
    const colDiff = Math.abs(col - lastCell.col);

    // Must be adjacent (including diagonal)
    if (rowDiff > 1 || colDiff > 1) return;

    // Check if selection maintains a straight line
    if (selectedCells.length >= 2) {
      const firstCell = selectedCells[0];
      const secondCell = selectedCells[1];
      const dirRow = secondCell.row - firstCell.row;
      const dirCol = secondCell.col - firstCell.col;

      const expectedRow = lastCell.row + dirRow;
      const expectedCol = lastCell.col + dirCol;

      if (row !== expectedRow || col !== expectedCol) return;
    }

    const newSelection = [...selectedCells, { row, col }];
    setSelectedCells(newSelection);

    // Check if we found a word
    const foundWord = checkForWord(newSelection);
    if (foundWord) {
      isProcessing.current = true;

      // Assign a color to the found word
      const colorIndex = foundWords.size % wordColors.length;
      const newColorMap = new Map(wordColorMap);
      newColorMap.set(foundWord, wordColors[colorIndex]);
      setWordColorMap(newColorMap);

      const newFoundWords = new Set(foundWords);
      newFoundWords.add(foundWord);
      setFoundWords(newFoundWords);

      // Clear selection after a short delay
      setTimeout(() => {
        setSelectedCells([]);
        setIsDragging(false);
        isProcessing.current = false;

        // Check if all words are found
        if (newFoundWords.size === placedWords.length) {
          setGameComplete(true);
        }
      }, 300);
    }
  };

  // Handle mouse up (end drag on web)
  const handleMouseUp = () => {
    if (isDragging && !isProcessing.current) {
      // If we didn't find a word, clear the selection
      const foundWord = checkForWord(selectedCells);
      if (!foundWord) {
        setSelectedCells([]);
      }
      setIsDragging(false);
    }
  };

  // Add global mouse up listener for web
  useEffect(() => {
    if (Platform.OS === 'web') {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging, selectedCells]);

  // Calculate cell size including margin (2px on each side)
  const cellWithMargin = cellSize + 4;

  // Get cell coordinates from touch position relative to grid
  const getCellFromPosition = (x: number, y: number): { row: number; col: number } | null => {
    // Account for grid padding (12px)
    const gridPadding = 12;
    const adjustedX = x - gridPadding;
    const adjustedY = y - gridPadding;

    const col = Math.floor(adjustedX / cellWithMargin);
    const row = Math.floor(adjustedY / cellWithMargin);

    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      return { row, col };
    }
    return null;
  };

  // Handle touch/pan gesture for mobile - using refs to avoid stale closures
  const handlePanStart = (x: number, y: number) => {
    if (isProcessing.current || gameComplete) return;

    const cell = getCellFromPosition(x, y);
    if (!cell) return;

    if (!firstCellSelected) {
      setFirstCellSelected(true);
      setStartTime(Date.now());
    }

    setShowHint(false);
    isDraggingRef.current = true;
    setIsDragging(true);
    currentSelectionRef.current = [cell];
    setSelectedCells([cell]);
    lastTouchPosition.current = { x, y };
  };

  const handlePanUpdate = (x: number, y: number) => {
    if (!isDraggingRef.current || isProcessing.current || gameComplete) return;
    if (currentSelectionRef.current.length === 0) return;

    // Update last touch position
    lastTouchPosition.current = { x, y };

    // Get the cell at current touch position
    const currentCell = getCellFromPosition(x, y);
    if (!currentCell) return;

    const { row, col } = currentCell;
    let currentSelection = [...currentSelectionRef.current];

    // Check if cell is already selected
    if (currentSelection.some((c) => c.row === row && c.col === col)) return;

    const lastCell = currentSelection[currentSelection.length - 1];
    const firstCell = currentSelection[0];

    // For the second cell, determine the direction
    if (currentSelection.length === 1) {
      const rowDiff = Math.abs(row - lastCell.row);
      const colDiff = Math.abs(col - lastCell.col);

      // Must be adjacent (including diagonal)
      if (rowDiff > 1 || colDiff > 1) return;

      currentSelection = [...currentSelection, { row, col }];
    } else if (currentSelection.length === 2) {
      // Special case: we only have 2 cells selected, check if user is trying to go diagonal
      // but we accidentally picked horizontal/vertical
      const secondCell = currentSelection[1];
      const currentDirRow = Math.sign(secondCell.row - firstCell.row);
      const currentDirCol = Math.sign(secondCell.col - firstCell.col);

      // Check if the touch is diagonal from the first cell
      const diagonalRowDiff = row - firstCell.row;
      const diagonalColDiff = col - firstCell.col;
      const isDiagonalFromFirst = Math.abs(diagonalRowDiff) === Math.abs(diagonalColDiff) &&
                                   Math.abs(diagonalRowDiff) >= 2;

      // If current direction is horizontal/vertical but user is clearly swiping diagonal
      if (isDiagonalFromFirst && (currentDirRow === 0 || currentDirCol === 0)) {
        // The user wanted diagonal! Reset to just first cell and recalculate
        const newDirRow = Math.sign(diagonalRowDiff);
        const newDirCol = Math.sign(diagonalColDiff);
        const steps = Math.abs(diagonalRowDiff);

        currentSelection = [firstCell];
        for (let i = 1; i <= steps; i++) {
          const newRow = firstCell.row + newDirRow * i;
          const newCol = firstCell.col + newDirCol * i;
          if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) break;
          currentSelection.push({ row: newRow, col: newCol });
        }
      } else {
        // Continue with normal direction logic
        let stepsRow = currentDirRow !== 0 ? (row - lastCell.row) / currentDirRow : 0;
        let stepsCol = currentDirCol !== 0 ? (col - lastCell.col) / currentDirCol : 0;

        let steps = 0;
        if (currentDirRow === 0 && currentDirCol !== 0) {
          if (row === lastCell.row && stepsCol > 0) steps = stepsCol;
        } else if (currentDirCol === 0 && currentDirRow !== 0) {
          if (col === lastCell.col && stepsRow > 0) steps = stepsRow;
        } else {
          if (stepsRow > 0 && stepsRow === stepsCol) steps = stepsRow;
        }

        if (steps > 0) {
          for (let i = 1; i <= steps; i++) {
            const newRow = lastCell.row + currentDirRow * i;
            const newCol = lastCell.col + currentDirCol * i;
            if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) break;
            if (currentSelection.some(c => c.row === newRow && c.col === newCol)) continue;
            currentSelection = [...currentSelection, { row: newRow, col: newCol }];
          }
        }
      }
    } else {
      // We have a direction established - find all cells from current end to touch position
      const secondCell = currentSelection[1];
      const dirRow = Math.sign(secondCell.row - firstCell.row);
      const dirCol = Math.sign(secondCell.col - firstCell.col);

      // Calculate how many steps to get from last cell to current touch cell
      let stepsRow = dirRow !== 0 ? (row - lastCell.row) / dirRow : 0;
      let stepsCol = dirCol !== 0 ? (col - lastCell.col) / dirCol : 0;

      // For diagonal, both steps should be equal and positive
      // For horizontal/vertical, one will be 0
      let steps = 0;
      if (dirRow === 0 && dirCol !== 0) {
        // Horizontal
        if (row === lastCell.row && stepsCol > 0) steps = stepsCol;
      } else if (dirCol === 0 && dirRow !== 0) {
        // Vertical
        if (col === lastCell.col && stepsRow > 0) steps = stepsRow;
      } else {
        // Diagonal - both must match and be positive
        if (stepsRow > 0 && stepsRow === stepsCol) steps = stepsRow;
      }

      if (steps <= 0) return;

      // Add all cells along the path
      for (let i = 1; i <= steps; i++) {
        const newRow = lastCell.row + dirRow * i;
        const newCol = lastCell.col + dirCol * i;

        if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) break;
        if (currentSelection.some(c => c.row === newRow && c.col === newCol)) continue;

        currentSelection = [...currentSelection, { row: newRow, col: newCol }];
      }
    }

    // Only update if selection changed
    if (currentSelection.length > currentSelectionRef.current.length) {
      currentSelectionRef.current = currentSelection;
      setSelectedCells(currentSelection);

      // Check if we found a word
      const foundWord = checkForWord(currentSelection);
      if (foundWord) {
        isProcessing.current = true;

        const colorIndex = foundWords.size % wordColors.length;
        const newColorMap = new Map(wordColorMap);
        newColorMap.set(foundWord, wordColors[colorIndex]);
        setWordColorMap(newColorMap);

        const newFoundWords = new Set(foundWords);
        newFoundWords.add(foundWord);
        setFoundWords(newFoundWords);

        setTimeout(() => {
          currentSelectionRef.current = [];
          setSelectedCells([]);
          isDraggingRef.current = false;
          setIsDragging(false);
          isProcessing.current = false;

          if (newFoundWords.size === placedWords.length) {
            setGameComplete(true);
          }
        }, 300);
      }
    }
  };

  const handlePanEnd = () => {
    lastTouchPosition.current = null;
    if (isDraggingRef.current && !isProcessing.current) {
      const foundWord = checkForWord(currentSelectionRef.current);
      if (!foundWord) {
        currentSelectionRef.current = [];
        setSelectedCells([]);
      }
      isDraggingRef.current = false;
      setIsDragging(false);
    }
  };

  // Pan gesture for mobile swipe selection
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
    .shouldCancelWhenOutside(false)
    .hitSlop({ left: 0, right: 0, top: 0, bottom: 0 });

  const getCellFoundColor = (row: number, col: number): string | undefined => {
    for (const placedWord of placedWords) {
      if (!foundWords.has(placedWord.word)) continue;

      const isPartOfWord = placedWord.cells.some((c) => c.row === row && c.col === col);
      if (isPartOfWord) {
        return wordColorMap.get(placedWord.word);
      }
    }
    return undefined;
  };

  const isCellFound = (row: number, col: number): boolean => {
    return getCellFoundColor(row, col) !== undefined;
  };

  const isCellSelected = (row: number, col: number): boolean => {
    return selectedCells.some((c) => c.row === row && c.col === col);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show loader while detecting device type on web
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
            <Text className={`font-bold text-slate-800 ${isWeb ? 'text-xl' : 'text-lg'}`}>
              Purim Word Search
            </Text>
          </View>

          <HeaderButton onPress={initializeGame} icon="refresh" variant="refresh" />
        </View>

        {/* Stats Bar */}
        <View
          className="flex-row justify-center py-3 bg-slate-50 border-t border-slate-100"
          style={{ gap: useMobileLayout ? 32 : 48 }}
        >
          <View className="items-center">
            <Text className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Time</Text>
            <Text className={`font-bold text-slate-800 ${isWeb ? 'text-2xl' : 'text-xl'} mt-1`}>
              {formatTime(elapsedTime)}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Found</Text>
            <Text className={`font-bold text-pink-600 ${isWeb ? 'text-2xl' : 'text-xl'} mt-1`}>
              {foundWords.size}/{placedWords.length}
            </Text>
          </View>
        </View>

        {/* Hint - shows briefly then fades */}
        {showHint && (
          <Animated.View
            entering={FadeIn.duration(300).delay(500)}
            style={{ paddingVertical: 6, alignItems: 'center' }}
          >
            <Text style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
              {useMobileLayout ? 'Swipe across letters to select words' : 'Click and drag to select words'}
            </Text>
          </Animated.View>
        )}
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
              ref={gridRef}
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 5,
              }}
            >
              {grid.map((row, rowIndex) => (
                <View key={rowIndex} style={{ flexDirection: 'row' }}>
                  {row.map((cell, colIndex) => (
                    <Cell
                      key={`${gameKey}-${rowIndex}-${colIndex}`}
                      cell={cell}
                      isSelected={isCellSelected(rowIndex, colIndex)}
                      isFoundWord={isCellFound(rowIndex, colIndex)}
                      foundWordColor={getCellFoundColor(rowIndex, colIndex)}
                      onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                      onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                      onPress={() => handleCellPress(rowIndex, colIndex)}
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
                ref={gridRef}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 5,
                }}
              >
                {grid.map((row, rowIndex) => (
                  <View key={rowIndex} style={{ flexDirection: 'row' }}>
                    {row.map((cell, colIndex) => (
                      <Cell
                        key={`${gameKey}-${rowIndex}-${colIndex}`}
                        cell={cell}
                        isSelected={isCellSelected(rowIndex, colIndex)}
                        isFoundWord={isCellFound(rowIndex, colIndex)}
                        foundWordColor={getCellFoundColor(rowIndex, colIndex)}
                        onMouseDown={() => {}}
                        onMouseEnter={() => {}}
                        onPress={() => {}}
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
        </ScrollView>

        {/* Word List */}
        <View
          style={{
            width: useMobileLayout ? '100%' : 220,
            padding: useMobileLayout ? 12 : 16,
            paddingTop: useMobileLayout ? 8 : 16,
            backgroundColor: useMobileLayout ? 'transparent' : 'white',
            borderLeftWidth: useMobileLayout ? 0 : 1,
            borderLeftColor: '#e2e8f0',
          }}
        >
          <Text
            className="font-bold text-slate-700"
            style={{ fontSize: useMobileLayout ? 13 : 16, textAlign: useMobileLayout ? 'center' : 'left', marginBottom: useMobileLayout ? 8 : 12 }}
          >
            Words to Find
          </Text>
          {!useMobileLayout ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {placedWords.map((word, index) => (
                <WordListItem
                  key={word.word}
                  word={word.word}
                  hebrew={word.hebrew}
                  isFound={foundWords.has(word.word)}
                  index={index}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 }}>
              {placedWords.map((word) => (
                <View
                  key={word.word}
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 8,
                    backgroundColor: foundWords.has(word.word) ? '#dcfce7' : 'white',
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: foundWords.has(word.word) ? '#86efac' : '#e2e8f0',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: foundWords.has(word.word) ? '#166534' : '#334155',
                      textDecorationLine: foundWords.has(word.word) ? 'line-through' : 'none',
                    }}
                  >
                    {word.word}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Victory Modal */}
      {gameComplete && (
        <VictoryScreen
          elapsedTime={elapsedTime}
          wordsFound={foundWords.size}
          totalWords={placedWords.length}
          onPlayAgain={initializeGame}
          onBackToHome={() => router.back()}
        />
      )}
    </SafeAreaView>
    </GestureHandlerRootView>
  );
}
