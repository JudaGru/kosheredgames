import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, interpolate, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsMobileLayout } from '../../hooks/useDeviceType';

interface ClueData { number: number; clue: string; answer: string; row: number; col: number; direction: 'across' | 'down'; }

const GRID_SIZE = 10;

// VERIFIED LAYOUT (10x10):
//     0 1 2 3 4 5 6 7 8 9
//  0  P L A G U E S . . .    1-Across: PLAGUES
//  1  E . . . . . E . . .
//  2  S . . . . . D . . .
//  3  A . . . . . E . . .
//  4  C . . . . . R . . .
//  5  H . . . . . . . . .
//  6  . . . . . . . . . .
//  7  M A T Z A H . . . .    5-Across: MATZAH
//  8  . . . . . . . . . .
//  9  M A R O R . . . . .    6-Across: MAROR
//
// Verified intersections:
// 1. PLAGUES (0,0→0,6): P-L-A-G-U-E-S
// 2. PESACH (0,0→5,0) down: P-E-S-A-C-H
//    - (0,0): PLAGUES[0]=P, PESACH[0]=P ✓
// 3. SEDER (0,6→4,6) down: S-E-D-E-R
//    - (0,6): PLAGUES[6]=S, SEDER[0]=S ✓
// 4. MATZAH (7,0→7,5): M-A-T-Z-A-H (standalone)
// 5. MAROR (9,0→9,4): M-A-R-O-R (standalone)

const CLUES: ClueData[] = [
  // Across clues
  { number: 1, clue: 'Ten of these struck Egypt', answer: 'PLAGUES', row: 0, col: 0, direction: 'across' },
  { number: 5, clue: 'Unleavened bread eaten on Pesach', answer: 'MATZAH', row: 7, col: 0, direction: 'across' },
  { number: 6, clue: 'Bitter herbs on the Seder plate', answer: 'MAROR', row: 9, col: 0, direction: 'across' },
  // Down clues
  { number: 2, clue: 'The holiday celebrating freedom from Egypt', answer: 'PESACH', row: 0, col: 0, direction: 'down' },
  { number: 3, clue: 'The special Pesach meal', answer: 'SEDER', row: 0, col: 6, direction: 'down' },
];

function buildGrid(): (string | null)[][] {
  const grid: (string | null)[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
  for (const clue of CLUES) {
    const { answer, row, col, direction } = clue;
    for (let i = 0; i < answer.length; i++) {
      const r = direction === 'across' ? row : row + i;
      const c = direction === 'across' ? col + i : col;
      if (r < GRID_SIZE && c < GRID_SIZE) grid[r][c] = answer[i];
    }
  }
  return grid;
}

function getCellNumber(row: number, col: number): number | null {
  for (const clue of CLUES) { if (clue.row === row && clue.col === col) return clue.number; }
  return null;
}

function isCellActive(grid: (string | null)[][], row: number, col: number): boolean { return grid[row]?.[col] !== null; }

function Cell({ correctLetter, userLetter, isSelected, isHighlighted, cellNumber, onPress, cellSize, isCorrect, showAnswer }: { row: number; col: number; correctLetter: string | null; userLetter: string; isSelected: boolean; isHighlighted: boolean; cellNumber: number | null; onPress: () => void; cellSize: number; isCorrect: boolean; showAnswer: boolean; }) {
  if (correctLetter === null) return <View style={{ width: cellSize, height: cellSize, backgroundColor: '#1e293b' }} />;
  const getBgColor = () => { if (isCorrect && userLetter) return '#dcfce7'; if (isSelected) return '#fee2e2'; if (isHighlighted) return '#fef2f2'; return 'white'; };
  const getBorderColor = () => { if (isSelected) return '#dc2626'; if (isHighlighted) return '#f87171'; return '#cbd5e1'; };
  const displayLetter = showAnswer ? correctLetter : userLetter;
  return (
    <Pressable onPress={onPress} style={{ width: cellSize, height: cellSize, backgroundColor: getBgColor(), borderWidth: isSelected ? 2 : 1, borderColor: getBorderColor(), justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      {cellNumber && <Text style={{ position: 'absolute', top: 2, left: 3, fontSize: cellSize * 0.22, color: '#64748b', fontWeight: '600' }}>{cellNumber}</Text>}
      <Text style={{ fontSize: cellSize * 0.55, fontWeight: '700', color: isCorrect ? '#166534' : '#1e293b' }}>{displayLetter}</Text>
    </Pressable>
  );
}

function ClueItem({ clue, isSelected, isCompleted, onPress }: { clue: ClueData; isSelected: boolean; isCompleted: boolean; onPress: () => void; }) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12, backgroundColor: isSelected ? '#fef2f2' : isCompleted ? '#dcfce7' : 'white', borderRadius: 8, marginBottom: 6, borderWidth: isSelected ? 2 : 1, borderColor: isSelected ? '#dc2626' : isCompleted ? '#86efac' : '#e2e8f0' }}>
      <Text style={{ fontSize: 14, fontWeight: '700', color: '#dc2626', width: 24 }}>{clue.number}.</Text>
      <Text style={{ fontSize: 14, color: isCompleted ? '#166534' : '#334155', flex: 1, textDecorationLine: isCompleted ? 'line-through' : 'none' }}>{clue.clue}</Text>
      {isCompleted && <FontAwesome name="check" size={14} color="#22c55e" style={{ marginLeft: 8 }} />}
    </Pressable>
  );
}

function HeaderButton({ onPress, icon, bgColor, iconColor, isRefresh }: { onPress: () => void; icon: string; bgColor: string; iconColor: string; isRefresh?: boolean; }) {
  const isWeb = Platform.OS === 'web';
  const scale = useSharedValue(1);
  const hoverBg = useSharedValue(0);
  const rotation = useSharedValue(0);

  const handleHoverIn = () => { if (isWeb) { scale.value = withSpring(1.1, { damping: 15, stiffness: 300 }); hoverBg.value = withTiming(1, { duration: 150 }); } };
  const handleHoverOut = () => { if (isWeb) { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); hoverBg.value = withTiming(0, { duration: 150 }); } };
  const handlePress = () => {
    scale.value = withSequence(withTiming(0.9, { duration: 100 }), withSpring(1, { damping: 15 }));
    if (isRefresh) { rotation.value = withSequence(withTiming(rotation.value + 360, { duration: 400, easing: Easing.out(Easing.cubic) })); }
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    backgroundColor: interpolate(hoverBg.value, [0, 1], [0, 1]) === 1 ? '#e2e8f0' : bgColor,
  }));

  return (
    <Pressable onPress={handlePress} onHoverIn={handleHoverIn} onHoverOut={handleHoverOut}>
      <Animated.View style={[animatedStyle, { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }]}>
        <FontAwesome name={icon as any} size={18} color={iconColor} />
      </Animated.View>
    </Pressable>
  );
}

function ConfettiParticle({ index }: { index: number }) {
  const translateY = useSharedValue(-100), translateX = useSharedValue(0), rotate = useSharedValue(0), opacity = useSharedValue(0), scale = useSharedValue(0);
  const emojis = ['✨', '🫓', '⭐', '🍷', '🎊', '📖', '💫', '🥬'];
  const emoji = emojis[index % emojis.length];
  const startLeft = useRef(10 + Math.random() * 80).current, fontSize = useRef(24 + Math.random() * 12).current;
  useEffect(() => {
    const delay = Math.random() * 400, randomX = (Math.random() - 0.5) * 200, dur = 2000 + Math.random() * 1000;
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 10 }));
    translateY.value = withDelay(delay, withTiming(600, { duration: dur, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) }));
    translateX.value = withDelay(delay, withTiming(randomX, { duration: dur }));
    rotate.value = withDelay(delay, withTiming(720, { duration: dur }));
    opacity.value = withDelay(delay + dur * 0.7, withTiming(0, { duration: 600 }));
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }, { translateX: translateX.value }, { rotate: `${rotate.value}deg` }, { scale: scale.value }], opacity: opacity.value }));
  return <Animated.View style={[style, { position: 'absolute', left: `${startLeft}%`, top: -50 }]}><Text style={{ fontSize }}>{emoji}</Text></Animated.View>;
}

function VictoryScreen({ onPlayAgain, onBackToHome, isMobile }: { onPlayAgain: () => void; onBackToHome: () => void; isMobile: boolean }) {
  const isDesktop = !isMobile;
  const trophyScale = useSharedValue(0);
  useEffect(() => { trophyScale.value = withDelay(300, withSpring(1, { damping: 8 })); }, []);
  const trophyStyle = useAnimatedStyle(() => ({ transform: [{ scale: trophyScale.value }] }));
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 100 }} pointerEvents="none">{Array.from({ length: 40 }).map((_, i) => <ConfettiParticle key={i} index={i} />)}</View>
      <Animated.View entering={FadeIn.duration(400).delay(200)} style={{ backgroundColor: 'white', borderRadius: 24, alignItems: 'center', width: '100%', maxWidth: 400, padding: isDesktop ? 48 : 40 }}>
        <Animated.View style={trophyStyle}><Text style={{ fontSize: 72 }}>🫓</Text></Animated.View>
        <Text style={{ fontWeight: 'bold', color: '#1e293b', marginTop: 24, fontSize: isDesktop ? 36 : 28 }}>Chag Sameach!</Text>
        <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 12, fontSize: 16 }}>You completed the Pesach crossword!</Text>
        <Pressable onPress={onPlayAgain} style={{ backgroundColor: '#dc2626', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 32, marginTop: 32, width: '100%' }}><Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>Play Again</Text></Pressable>
        <Pressable onPress={onBackToHome} style={{ marginTop: 16, paddingVertical: 12 }}><Text style={{ color: '#64748b', fontWeight: '600', fontSize: 16, textAlign: 'center' }}>Back to Home</Text></Pressable>
      </Animated.View>
    </View>
  );
}

export default function PesachCrosswordGame() {
  const { isMobile } = useIsMobileLayout();
  const { width: screenWidth } = useWindowDimensions();
  const [grid] = useState(() => buildGrid());
  const [userInputs, setUserInputs] = useState<string[][]>(() => Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('')));
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedClue, setSelectedClue] = useState<ClueData | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const inputRef = useRef<TextInput>(null);
  // Calculate cell size based on screen width to prevent cutoff
  const maxCellSize = isMobile ? Math.floor((screenWidth - 48) / GRID_SIZE) : 40;
  const cellSize = isMobile ? Math.min(36, maxCellSize) : 40;

  const isWordComplete = useCallback((clue: ClueData): boolean => {
    const { answer, row, col, direction } = clue;
    for (let i = 0; i < answer.length; i++) {
      const r = direction === 'across' ? row : row + i;
      const c = direction === 'across' ? col + i : col;
      if (userInputs[r]?.[c]?.toUpperCase() !== answer[i]) return false;
    }
    return true;
  }, [userInputs]);

  useEffect(() => { if (CLUES.every(clue => isWordComplete(clue)) && !gameComplete) setGameComplete(true); }, [userInputs, isWordComplete, gameComplete]);

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
    const cluesForCell = CLUES.filter(clue => {
      const { answer, row: clueRow, col: clueCol, direction } = clue;
      for (let i = 0; i < answer.length; i++) {
        const r = direction === 'across' ? clueRow : clueRow + i;
        const c = direction === 'across' ? clueCol + i : clueCol;
        if (r === row && c === col) return true;
      }
      return false;
    });
    if (selectedCell?.row === row && selectedCell?.col === col && cluesForCell.length > 1) {
      const currentIndex = cluesForCell.findIndex(c => c.number === selectedClue?.number);
      setSelectedClue(cluesForCell[(currentIndex + 1) % cluesForCell.length]);
    } else {
      const acrossClue = cluesForCell.find(c => c.direction === 'across');
      setSelectedClue(acrossClue || cluesForCell[0] || null);
    }
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleCluePress = (clue: ClueData) => { setSelectedClue(clue); setSelectedCell({ row: clue.row, col: clue.col }); setTimeout(() => inputRef.current?.focus(), 50); };

  const handleKeyInput = (text: string) => {
    if (!selectedCell || !selectedClue) return;
    const letter = text.toUpperCase().slice(-1);
    if (!/^[A-Z]$/.test(letter) && letter !== '') return;
    const { row, col } = selectedCell;
    const newInputs = [...userInputs]; newInputs[row] = [...newInputs[row]]; newInputs[row][col] = letter; setUserInputs(newInputs);
    if (letter) {
      const { direction, answer, row: startRow, col: startCol } = selectedClue;
      let currentPos = direction === 'across' ? col - startCol : row - startRow;
      for (let i = currentPos + 1; i < answer.length; i++) {
        const nextRow = direction === 'across' ? startRow : startRow + i;
        const nextCol = direction === 'across' ? startCol + i : startCol;
        if (!newInputs[nextRow]?.[nextCol]) { setSelectedCell({ row: nextRow, col: nextCol }); return; }
      }
      if (currentPos + 1 < answer.length) {
        const nextRow = direction === 'across' ? startRow : startRow + currentPos + 1;
        const nextCol = direction === 'across' ? startCol + currentPos + 1 : startCol;
        setSelectedCell({ row: nextRow, col: nextCol });
      }
    }
  };

  const handleBackspace = () => {
    if (!selectedCell || !selectedClue) return;
    const { row, col } = selectedCell;
    if (!userInputs[row][col]) {
      const { direction, row: startRow, col: startCol } = selectedClue;
      let currentPos = direction === 'across' ? col - startCol : row - startRow;
      if (currentPos > 0) {
        const prevRow = direction === 'across' ? startRow : startRow + currentPos - 1;
        const prevCol = direction === 'across' ? startCol + currentPos - 1 : startCol;
        setSelectedCell({ row: prevRow, col: prevCol });
        const newInputs = [...userInputs]; newInputs[prevRow] = [...newInputs[prevRow]]; newInputs[prevRow][prevCol] = ''; setUserInputs(newInputs);
      }
    } else {
      const newInputs = [...userInputs]; newInputs[row] = [...newInputs[row]]; newInputs[row][col] = ''; setUserInputs(newInputs);
    }
  };

  const initializeGame = useCallback(() => {
    setIsRefreshing(true);
    setUserInputs(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('')));
    setSelectedCell(null);
    setSelectedClue(null);
    setGameComplete(false);
    setGameKey(k => k + 1);
    setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  const acrossClues = CLUES.filter(c => c.direction === 'across');
  const downClues = CLUES.filter(c => c.direction === 'down');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <StatusBar style="dark" />
      <TextInput ref={inputRef} value="" onChangeText={handleKeyInput} onKeyPress={e => { if (e.nativeEvent.key === 'Backspace') handleBackspace(); }} autoCapitalize="characters" autoCorrect={false} style={{ position: 'absolute', opacity: 0, height: 0 }} />
      <View style={{ backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
          <HeaderButton icon="arrow-left" bgColor="#f1f5f9" iconColor="#64748b" onPress={() => { Keyboard.dismiss(); router.back(); }} />
          <Text style={{ fontWeight: 'bold', color: '#1e293b', fontSize: !isMobile ? 20 : 18 }}>Pesach Crossword</Text>
          <HeaderButton icon="refresh" bgColor="#fee2e2" iconColor="#dc2626" isRefresh onPress={initializeGame} />
        </View>
      </View>
      {isRefreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Animated.View entering={FadeIn.duration(200)}><Text style={{ fontSize: 48 }}>🫓</Text></Animated.View>
          <Text style={{ marginTop: 16, color: '#64748b', fontSize: 16 }}>Resetting puzzle...</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, flexDirection: !isMobile ? 'row' : 'column', gap: 20 }} showsVerticalScrollIndicator={false}>
          <Animated.View key={`grid-${gameKey}`} entering={FadeInDown.duration(400).springify()} style={{ alignSelf: !isMobile ? 'flex-start' : 'center', backgroundColor: 'white', borderRadius: 12, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 }}>
            {grid.map((row, ri) => <View key={ri} style={{ flexDirection: 'row' }}>{row.map((cell, ci) => <Cell key={`${ri}-${ci}`} row={ri} col={ci} correctLetter={cell} userLetter={userInputs[ri][ci]} isSelected={selectedCell?.row === ri && selectedCell?.col === ci} isHighlighted={highlightedCells.has(`${ri}-${ci}`)} cellNumber={getCellNumber(ri, ci)} onPress={() => handleCellPress(ri, ci)} cellSize={cellSize} isCorrect={cell !== null && userInputs[ri][ci].toUpperCase() === cell.toUpperCase()} showAnswer={false} />)}</View>)}
          </Animated.View>
          <View style={{ flex: !isMobile ? 1 : undefined }}>
            <Animated.View entering={FadeIn.duration(300).delay(100)} style={{ marginBottom: 16 }}><Text style={{ fontWeight: 'bold', color: '#475569', marginBottom: 8, fontSize: !isMobile ? 16 : 14 }}>Across</Text>{acrossClues.map((clue, index) => <Animated.View key={`across-${clue.number}`} entering={FadeIn.duration(200).delay(150 + index * 50)}><ClueItem clue={clue} isSelected={selectedClue?.number === clue.number && selectedClue?.direction === 'across'} isCompleted={isWordComplete(clue)} onPress={() => handleCluePress(clue)} /></Animated.View>)}</Animated.View>
            <Animated.View entering={FadeIn.duration(300).delay(300)}><Text style={{ fontWeight: 'bold', color: '#475569', marginBottom: 8, fontSize: !isMobile ? 16 : 14 }}>Down</Text>{downClues.map((clue, index) => <Animated.View key={`down-${clue.number}`} entering={FadeIn.duration(200).delay(350 + index * 50)}><ClueItem clue={clue} isSelected={selectedClue?.number === clue.number && selectedClue?.direction === 'down'} isCompleted={isWordComplete(clue)} onPress={() => handleCluePress(clue)} /></Animated.View>)}</Animated.View>
          </View>
        </ScrollView>
      )}
      {gameComplete && <VictoryScreen onPlayAgain={initializeGame} onBackToHome={() => router.back()} isMobile={isMobile} />}
    </SafeAreaView>
  );
}
