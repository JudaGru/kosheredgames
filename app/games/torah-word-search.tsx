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
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const WORDS = [
  { english: 'TORAH', hebrew: 'תורה', found: false },
  { english: 'MITZVAH', hebrew: 'מצוה', found: false },
  { english: 'HASHEM', hebrew: 'השם', found: false },
  { english: 'BRACHA', hebrew: 'ברכה', found: false },
  { english: 'TEFILLAH', hebrew: 'תפילה', found: false },
  { english: 'SHEMA', hebrew: 'שמע', found: false },
  { english: 'TZEDAKAH', hebrew: 'צדקה', found: false },
  { english: 'EMUNAH', hebrew: 'אמונה', found: false },
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
  const sortedWords = [...WORDS].sort((a, b) => b.english.length - a.english.length);

  for (const wordData of sortedWords) {
    const word = wordData.english;
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      attempts++;
      const direction = directions[Math.floor(Math.random() * directions.length)];
      let maxRow = GRID_SIZE;
      let maxCol = GRID_SIZE;

      if (direction === 'horizontal') {
        maxCol = GRID_SIZE - word.length + 1;
      } else if (direction === 'vertical') {
        maxRow = GRID_SIZE - word.length + 1;
      } else if (direction === 'diagonal-down') {
        maxRow = GRID_SIZE - word.length + 1;
        maxCol = GRID_SIZE - word.length + 1;
      } else {
        maxRow = GRID_SIZE;
        maxCol = GRID_SIZE - word.length + 1;
      }

      if (maxRow <= 0 || maxCol <= 0) continue;

      const startRow = Math.floor(Math.random() * maxRow);
      const startCol = Math.floor(Math.random() * maxCol);
      let canPlace = true;
      const cells: { row: number; col: number }[] = [];

      for (let i = 0; i < word.length; i++) {
        let r = startRow;
        let c = startCol;

        if (direction === 'horizontal') {
          c = startCol + i;
        } else if (direction === 'vertical') {
          r = startRow + i;
        } else if (direction === 'diagonal-down') {
          r = startRow + i;
          c = startCol + i;
        } else {
          r = startRow - i;
          c = startCol + i;
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

function Cell({
  cell,
  isSelected,
  isFoundWord,
  foundWordColor,
  onPressIn,
  onHover,
  cellSize,
  index,
  gameKey,
}: {
  cell: CellData;
  isSelected: boolean;
  isFoundWord: boolean;
  foundWordColor?: string;
  onPressIn: () => void;
  onHover: () => void;
  cellSize: number;
  index: number;
  gameKey: number;
}) {
  const isWeb = Platform.OS === 'web';
  const entranceAnim = useSharedValue(0);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    entranceAnim.value = 0;
    entranceAnim.value = withDelay(
      index * 8,
      withSpring(1, { damping: 12, stiffness: 100 })
    );
  }, [gameKey, index]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: entranceAnim.value * pressScale.value }],
    opacity: entranceAnim.value,
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.92);
    onPressIn();
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1);
  };

  return (
    <Animated.View style={containerStyle}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...(isWeb
          ? {
              onMouseDown: (e: React.MouseEvent) => {
                e.preventDefault();
                onPressIn();
              },
              onMouseEnter: (e: React.MouseEvent) => {
                if (e.buttons === 1) {
                  onHover();
                }
              },
            }
          : {})}
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
              ? '#0d9488'
              : 'white',
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? '#0f766e' : '#e2e8f0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontSize: cellSize * 0.5,
            fontWeight: 'bold',
            color: isFoundWord ? '#1e293b' : isSelected ? 'white' : '#334155',
          }}
        >
          {cell.letter}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function HeaderButton({
  onPress,
  icon,
  bgColor,
  iconColor,
  rotate = false,
}: {
  onPress: () => void;
  icon: string;
  bgColor: string;
  iconColor: string;
  rotate?: boolean;
}) {
  const isWeb = Platform.OS === 'web';
  const hoverScale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const handlePress = () => {
    if (rotate) {
      rotation.value = withSequence(
        withTiming(360, { duration: 500, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 0 })
      );
    }
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: hoverScale.value }, { rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={() => {
          hoverScale.value = withSpring(0.9);
        }}
        onPressOut={() => {
          hoverScale.value = withSpring(1);
        }}
        {...(isWeb
          ? {
              onMouseEnter: () => {
                hoverScale.value = withSpring(1.1);
              },
              onMouseLeave: () => {
                hoverScale.value = withSpring(1);
              },
            }
          : {})}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: bgColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FontAwesome name={icon as 'arrow-left' | 'refresh'} size={18} color={iconColor} />
      </Pressable>
    </Animated.View>
  );
}

function WordListItem({
  word,
  isFound,
  isWeb,
}: {
  word: string;
  isFound: boolean;
  isWeb: boolean;
}) {
  const strikeWidth = useSharedValue(isFound ? 100 : 0);
  const bgOpacity = useSharedValue(isFound ? 1 : 0);

  useEffect(() => {
    if (isFound) {
      strikeWidth.value = withTiming(100, { duration: 300, easing: Easing.out(Easing.cubic) });
      bgOpacity.value = withTiming(1, { duration: 200 });
    }
  }, [isFound]);

  const strikeStyle = useAnimatedStyle(() => ({
    width: `${strikeWidth.value}%`,
    position: 'absolute',
    height: 2,
    backgroundColor: '#166534',
    top: '50%',
    left: 0,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolate(bgOpacity.value, [0, 1], [0, 1]) > 0.5 ? '#dcfce7' : 'white',
  }));

  if (isWeb) {
    return (
      <Animated.View
        style={[
          containerStyle,
          {
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: isFound ? '#86efac' : '#e2e8f0',
            marginBottom: 6,
          },
        ]}
      >
        <View style={{ position: 'relative' }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: isFound ? '#166534' : '#334155',
            }}
          >
            {word}
          </Text>
          {isFound && <Animated.View style={strikeStyle} />}
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        containerStyle,
        {
          paddingVertical: 5,
          paddingHorizontal: 8,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: isFound ? '#86efac' : '#e2e8f0',
        },
      ]}
    >
      <View style={{ position: 'relative' }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: '600',
            color: isFound ? '#166534' : '#334155',
          }}
        >
          {word}
        </Text>
        {isFound && <Animated.View style={strikeStyle} />}
      </View>
    </Animated.View>
  );
}

function ConfettiParticle({ index }: { index: number }) {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const emojis = ['✨', '📜', '⭐', '✡️', '🎊', '📖', '💫', '🕊️'];
  const emoji = emojis[index % emojis.length];
  const startLeft = useRef(10 + Math.random() * 80).current;
  const fontSize = useRef(24 + Math.random() * 12).current;

  useEffect(() => {
    const delay = Math.random() * 400;
    const randomX = (Math.random() - 0.5) * 200;
    const dur = 2000 + Math.random() * 1000;

    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 10 }));
    translateY.value = withDelay(
      delay,
      withTiming(600, { duration: dur, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) })
    );
    translateX.value = withDelay(delay, withTiming(randomX, { duration: dur }));
    rotate.value = withDelay(delay, withTiming(720, { duration: dur }));
    opacity.value = withDelay(delay + dur * 0.7, withTiming(0, { duration: 600 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[style, { position: 'absolute', left: `${startLeft}%`, top: -50 }]}>
      <Text style={{ fontSize }}>{emoji}</Text>
    </Animated.View>
  );
}

function VictoryScreen({
  elapsedTime,
  totalWords,
  onPlayAgain,
  onBackToHome,
}: {
  elapsedTime: number;
  totalWords: number;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}) {
  const isWeb = Platform.OS === 'web';
  const trophyScale = useSharedValue(0);
  const trophyRotate = useSharedValue(0);

  useEffect(() => {
    trophyScale.value = withDelay(300, withSpring(1, { damping: 8 }));
    trophyRotate.value = withDelay(
      400,
      withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      )
    );
  }, []);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }, { rotate: `${trophyRotate.value}deg` }],
  }));

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

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
      <View
        style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 100 }}
        pointerEvents="none"
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <ConfettiParticle key={i} index={i} />
        ))}
      </View>
      <Animated.View
        entering={FadeIn.duration(400).delay(200)}
        style={{
          backgroundColor: 'white',
          borderRadius: 24,
          alignItems: 'center',
          width: '100%',
          maxWidth: 400,
          padding: isWeb ? 48 : 40,
        }}
      >
        <Animated.View style={trophyStyle}>
          <Text style={{ fontSize: 72 }}>📜</Text>
        </Animated.View>
        <Text
          style={{ fontWeight: 'bold', color: '#1e293b', marginTop: 24, fontSize: isWeb ? 36 : 28 }}
        >
          Kol HaKavod!
        </Text>
        <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 12, fontSize: 16 }}>
          You found all {totalWords} Torah words!
        </Text>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#ccfbf1',
            borderRadius: 16,
            paddingVertical: 24,
            paddingHorizontal: 32,
            marginTop: 32,
          }}
        >
          <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#0d9488' }}>
            {formatTime(elapsedTime)}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#0d9488',
              marginTop: 8,
              textTransform: 'uppercase',
              fontWeight: '600',
            }}
          >
            Time
          </Text>
        </View>
        <Pressable
          onPress={onPlayAgain}
          style={{
            backgroundColor: '#0d9488',
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 32,
            marginTop: 32,
            width: '100%',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
            Play Again
          </Text>
        </Pressable>
        <Pressable onPress={onBackToHome} style={{ marginTop: 16, paddingVertical: 12 }}>
          <Text style={{ color: '#64748b', fontWeight: '600', fontSize: 16, textAlign: 'center' }}>
            Back to Home
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default function TorahWordSearchGame() {
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
  const [showHint, setShowHint] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const isProcessing = useRef(false);
  const currentSelectionRef = useRef<{ row: number; col: number }[]>([]);
  const wordColors = [
    '#fde047',
    '#86efac',
    '#c4b5fd',
    '#fda4af',
    '#7dd3fc',
    '#fdba74',
    '#67e8f9',
    '#f0abfc',
  ];
  const [wordColorMap, setWordColorMap] = useState<Map<string, string>>(new Map());

  const cellSize = Math.min(
    (screenWidth - 32 - (useMobileLayout ? 0 : 200) - GRID_SIZE * 4) / GRID_SIZE,
    (screenHeight - (useMobileLayout ? 340 : 120) - GRID_SIZE * 4) / GRID_SIZE,
    useMobileLayout ? 34 : 45
  );
  const cellWithMargin = cellSize + 4;
  const gridContainerRef = useRef<View>(null);
  const isDraggingRef = useRef(false);

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
    setShowHint(true);
    setGameKey((k) => k + 1);
    isProcessing.current = false;
    currentSelectionRef.current = [];
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (!startTime || gameComplete) return;
    const interval = setInterval(
      () => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)),
      1000
    );
    return () => clearInterval(interval);
  }, [startTime, gameComplete]);

  const checkForWord = useCallback(
    (cells: { row: number; col: number }[]) => {
      if (cells.length < 3) return null;
      const letters = cells.map((c) => grid[c.row][c.col].letter).join('');
      const reversed = letters.split('').reverse().join('');

      for (const pw of placedWords) {
        if (foundWords.has(pw.word)) continue;
        if ((letters === pw.word || reversed === pw.word) && cells.length === pw.cells.length) {
          const match =
            cells.every((c, i) => c.row === pw.cells[i].row && c.col === pw.cells[i].col) ||
            cells.every(
              (c, i) =>
                c.row === pw.cells[pw.cells.length - 1 - i].row &&
                c.col === pw.cells[pw.cells.length - 1 - i].col
            );
          if (match) return pw.word;
        }
      }
      return null;
    },
    [grid, placedWords, foundWords]
  );

  const handleWordFound = useCallback(
    (word: string) => {
      const newMap = new Map(wordColorMap);
      newMap.set(word, wordColors[foundWords.size % wordColors.length]);
      setWordColorMap(newMap);

      const newFound = new Set(foundWords);
      newFound.add(word);
      setFoundWords(newFound);

      setTimeout(() => {
        setSelectedCells([]);
        currentSelectionRef.current = [];
        isProcessing.current = false;
        if (newFound.size === placedWords.length) {
          setGameComplete(true);
        }
      }, 300);
    },
    [wordColorMap, foundWords, placedWords.length, wordColors]
  );

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

  // Handle touch/pan gesture for mobile
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
    currentSelectionRef.current = [cell];
    setSelectedCells([cell]);
  };

  const handlePanUpdate = (x: number, y: number) => {
    if (!isDraggingRef.current || isProcessing.current || gameComplete) return;
    if (currentSelectionRef.current.length === 0) return;

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
        const stepsRow = currentDirRow !== 0 ? (row - lastCell.row) / currentDirRow : 0;
        const stepsCol = currentDirCol !== 0 ? (col - lastCell.col) / currentDirCol : 0;

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
      const stepsRow = dirRow !== 0 ? (row - lastCell.row) / dirRow : 0;
      const stepsCol = dirCol !== 0 ? (col - lastCell.col) / dirCol : 0;

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
        handleWordFound(foundWord);
      }
    }
  };

  const handlePanEnd = () => {
    if (isDraggingRef.current && !isProcessing.current) {
      const foundWord = checkForWord(currentSelectionRef.current);
      if (!foundWord) {
        currentSelectionRef.current = [];
        setSelectedCells([]);
      }
      isDraggingRef.current = false;
    }
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
    .shouldCancelWhenOutside(false)
    .hitSlop({ left: 0, right: 0, top: 0, bottom: 0 });

  // Handle mouse down on a cell (start drag on web)
  const handleCellMouseDown = (row: number, col: number) => {
    if (isProcessing.current || gameComplete) return;

    if (!firstCellSelected) {
      setFirstCellSelected(true);
      setStartTime(Date.now());
    }

    setShowHint(false);
    setIsDragging(true);
    currentSelectionRef.current = [{ row, col }];
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
    currentSelectionRef.current = newSelection;
    setSelectedCells(newSelection);

    // Check if we found a word
    const foundWord = checkForWord(newSelection);
    if (foundWord) {
      isProcessing.current = true;
      handleWordFound(foundWord);
    }
  };

  // Handle mouse up (end drag on web)
  const handleMouseUp = () => {
    if (isDragging && !isProcessing.current) {
      const foundWord = checkForWord(selectedCells);
      if (!foundWord) {
        currentSelectionRef.current = [];
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

  const getCellFoundColor = (r: number, c: number) => {
    for (const pw of placedWords) {
      if (foundWords.has(pw.word) && pw.cells.some((cell) => cell.row === r && cell.col === c)) {
        return wordColorMap.get(pw.word);
      }
    }
    return undefined;
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const hintOpacity = useSharedValue(1);
  useEffect(() => {
    if (!showHint) {
      hintOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [showHint]);

  const hintStyle = useAnimatedStyle(() => ({
    opacity: hintOpacity.value,
  }));

  // Show loader while detecting device type on web
  if (isDetectingDevice) {
    return <Loader />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <StatusBar style="dark" />
        <View style={{ backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <HeaderButton
              onPress={() => router.back()}
              icon="arrow-left"
              bgColor="#f1f5f9"
              iconColor="#64748b"
            />
            <Text style={{ fontWeight: 'bold', color: '#1e293b', fontSize: isWeb ? 20 : 18 }}>
              Torah Word Search
            </Text>
            <HeaderButton
              onPress={initializeGame}
              icon="refresh"
              bgColor="#ccfbf1"
              iconColor="#0d9488"
              rotate
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingVertical: 12,
              backgroundColor: '#f8fafc',
              gap: useMobileLayout ? 32 : 48,
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}
              >
                Time
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  fontSize: useMobileLayout ? 20 : 24,
                  marginTop: 4,
                }}
              >
                {formatTime(elapsedTime)}
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}
              >
                Found
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#0d9488',
                  fontSize: useMobileLayout ? 20 : 24,
                  marginTop: 4,
                }}
              >
                {foundWords.size}/{placedWords.length}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1, flexDirection: useMobileLayout ? 'column' : 'row' }}>
          {!useMobileLayout ? (
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
              }}
            >
              <View
                ref={gridContainerRef}
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
                {grid.map((row, ri) => (
                  <View key={ri} style={{ flexDirection: 'row' }}>
                    {row.map((cell, ci) => (
                      <Cell
                        key={`${ri}-${ci}`}
                        cell={cell}
                        isSelected={selectedCells.some((c) => c.row === ri && c.col === ci)}
                        isFoundWord={!!getCellFoundColor(ri, ci)}
                        foundWordColor={getCellFoundColor(ri, ci)}
                        onPressIn={() => handleCellMouseDown(ri, ci)}
                        onHover={() => handleCellMouseEnter(ri, ci)}
                        cellSize={cellSize}
                        index={ri * GRID_SIZE + ci}
                        gameKey={gameKey}
                      />
                    ))}
                  </View>
                ))}
                <Animated.View style={[hintStyle, { alignItems: 'center', marginTop: 12 }]}>
                  <Text style={{ fontSize: 12, color: '#94a3b8' }}>Drag to select words</Text>
                </Animated.View>
              </View>
            </ScrollView>
          ) : (
            <View
              style={{
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
              }}
            >
              <GestureDetector gesture={panGesture}>
                <View
                  ref={gridContainerRef}
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
                  {grid.map((row, ri) => (
                    <View key={ri} style={{ flexDirection: 'row' }}>
                      {row.map((cell, ci) => (
                        <Cell
                          key={`${ri}-${ci}`}
                          cell={cell}
                          isSelected={selectedCells.some((c) => c.row === ri && c.col === ci)}
                          isFoundWord={!!getCellFoundColor(ri, ci)}
                          foundWordColor={getCellFoundColor(ri, ci)}
                          onPressIn={() => {}}
                          onHover={() => {}}
                          cellSize={cellSize}
                          index={ri * GRID_SIZE + ci}
                          gameKey={gameKey}
                        />
                      ))}
                    </View>
                  ))}
                  <Animated.View style={[hintStyle, { alignItems: 'center', marginTop: 12 }]}>
                    <Text style={{ fontSize: 12, color: '#94a3b8' }}>Swipe to select words</Text>
                  </Animated.View>
                </View>
              </GestureDetector>
            </View>
          )}

          <View
            style={{
              width: useMobileLayout ? '100%' : 220,
              padding: 16,
              backgroundColor: useMobileLayout ? 'transparent' : 'white',
              borderLeftWidth: useMobileLayout ? 0 : 1,
              borderLeftColor: '#e2e8f0',
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                color: '#475569',
                marginBottom: 12,
                fontSize: useMobileLayout ? 14 : 16,
                textAlign: useMobileLayout ? 'center' : 'left',
              }}
            >
              Words to Find
            </Text>
            {!useMobileLayout ? (
              <ScrollView>
                {placedWords.map((w) => (
                  <WordListItem
                    key={w.word}
                    word={w.word}
                    isFound={foundWords.has(w.word)}
                    isWeb={isWeb}
                  />
                ))}
              </ScrollView>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                {placedWords.map((w) => (
                  <WordListItem
                    key={w.word}
                    word={w.word}
                    isFound={foundWords.has(w.word)}
                    isWeb={isWeb}
                  />
                ))}
              </View>
            )}
          </View>
        </View>

        {gameComplete && (
          <VictoryScreen
            elapsedTime={elapsedTime}
            totalWords={placedWords.length}
            onPlayAgain={initializeGame}
            onBackToHome={() => router.back()}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
