import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ClueData { number: number; clue: string; answer: string; row: number; col: number; direction: 'across' | 'down'; }

const GRID_SIZE = 9;

const CLUES: ClueData[] = [
  { number: 1, clue: 'The Five Books of Moses', answer: 'TORAH', row: 0, col: 2, direction: 'across' },
  { number: 4, clue: 'A commandment', answer: 'MITZVAH', row: 2, col: 0, direction: 'across' },
  { number: 6, clue: 'A blessing we say', answer: 'BRACHA', row: 4, col: 1, direction: 'across' },
  { number: 7, clue: 'Faith in Hashem', answer: 'EMUNAH', row: 6, col: 0, direction: 'across' },
  { number: 2, clue: 'Weekly portion we read', answer: 'PARSHA', row: 0, col: 4, direction: 'down' },
  { number: 3, clue: 'Charity we give', answer: 'TZEDAKAH', row: 0, col: 6, direction: 'down' },
  { number: 5, clue: 'Prayer we say three times daily', answer: 'SHEMA', row: 3, col: 0, direction: 'down' },
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
  const getBgColor = () => { if (isCorrect && userLetter) return '#dcfce7'; if (isSelected) return '#ccfbf1'; if (isHighlighted) return '#f0fdfa'; return 'white'; };
  const getBorderColor = () => { if (isSelected) return '#0d9488'; if (isHighlighted) return '#5eead4'; return '#cbd5e1'; };
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
    <Pressable onPress={onPress} style={{ flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12, backgroundColor: isSelected ? '#f0fdfa' : isCompleted ? '#dcfce7' : 'white', borderRadius: 8, marginBottom: 6, borderWidth: isSelected ? 2 : 1, borderColor: isSelected ? '#0d9488' : isCompleted ? '#86efac' : '#e2e8f0' }}>
      <Text style={{ fontSize: 14, fontWeight: '700', color: '#0d9488', width: 24 }}>{clue.number}.</Text>
      <Text style={{ fontSize: 14, color: isCompleted ? '#166534' : '#334155', flex: 1, textDecorationLine: isCompleted ? 'line-through' : 'none' }}>{clue.clue}</Text>
      {isCompleted && <FontAwesome name="check" size={14} color="#22c55e" style={{ marginLeft: 8 }} />}
    </Pressable>
  );
}

function ConfettiParticle({ index }: { index: number }) {
  const translateY = useSharedValue(-100), translateX = useSharedValue(0), rotate = useSharedValue(0), opacity = useSharedValue(0), scale = useSharedValue(0);
  const emojis = ['✨', '📜', '⭐', '✡️', '🎊', '📖', '💫', '🕊️'];
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

function VictoryScreen({ onPlayAgain, onBackToHome }: { onPlayAgain: () => void; onBackToHome: () => void }) {
  const isWeb = Platform.OS === 'web';
  const trophyScale = useSharedValue(0);
  useEffect(() => { trophyScale.value = withDelay(300, withSpring(1, { damping: 8 })); }, []);
  const trophyStyle = useAnimatedStyle(() => ({ transform: [{ scale: trophyScale.value }] }));
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 100 }} pointerEvents="none">{Array.from({ length: 40 }).map((_, i) => <ConfettiParticle key={i} index={i} />)}</View>
      <Animated.View entering={FadeIn.duration(400).delay(200)} style={{ backgroundColor: 'white', borderRadius: 24, alignItems: 'center', width: '100%', maxWidth: 400, padding: isWeb ? 48 : 40 }}>
        <Animated.View style={trophyStyle}><Text style={{ fontSize: 72 }}>📜</Text></Animated.View>
        <Text style={{ fontWeight: 'bold', color: '#1e293b', marginTop: 24, fontSize: isWeb ? 36 : 28 }}>Kol HaKavod!</Text>
        <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 12, fontSize: 16 }}>You completed the Torah crossword!</Text>
        <Pressable onPress={onPlayAgain} style={{ backgroundColor: '#0d9488', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 32, marginTop: 32, width: '100%' }}><Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>Play Again</Text></Pressable>
        <Pressable onPress={onBackToHome} style={{ marginTop: 16, paddingVertical: 12 }}><Text style={{ color: '#64748b', fontWeight: '600', fontSize: 16, textAlign: 'center' }}>Back to Home</Text></Pressable>
      </Animated.View>
    </View>
  );
}

export default function TorahCrosswordGame() {
  const isWeb = Platform.OS === 'web';
  const [grid] = useState(() => buildGrid());
  const [userInputs, setUserInputs] = useState<string[][]>(() => Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('')));
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedClue, setSelectedClue] = useState<ClueData | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const cellSize = isWeb ? 40 : 36;

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

  const initializeGame = useCallback(() => { setUserInputs(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''))); setSelectedCell(null); setSelectedClue(null); setGameComplete(false); setShowAnswers(false); }, []);

  const acrossClues = CLUES.filter(c => c.direction === 'across');
  const downClues = CLUES.filter(c => c.direction === 'down');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <StatusBar style="dark" />
      <TextInput ref={inputRef} value="" onChangeText={handleKeyInput} onKeyPress={e => { if (e.nativeEvent.key === 'Backspace') handleBackspace(); }} autoCapitalize="characters" autoCorrect={false} style={{ position: 'absolute', opacity: 0, height: 0 }} />
      <View style={{ backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
          <Pressable onPress={() => { Keyboard.dismiss(); router.back(); }} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' }}><FontAwesome name="arrow-left" size={18} color="#64748b" /></Pressable>
          <Text style={{ fontWeight: 'bold', color: '#1e293b', fontSize: isWeb ? 20 : 18 }}>Torah Crossword</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable onPress={() => setShowAnswers(!showAnswers)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center' }}><FontAwesome name={showAnswers ? 'eye-slash' : 'eye'} size={16} color="#d97706" /></Pressable>
            <Pressable onPress={initializeGame} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#ccfbf1', alignItems: 'center', justifyContent: 'center' }}><FontAwesome name="refresh" size={18} color="#0d9488" /></Pressable>
          </View>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, flexDirection: isWeb ? 'row' : 'column', gap: 20 }} showsVerticalScrollIndicator={false}>
        <View style={{ alignSelf: isWeb ? 'flex-start' : 'center', backgroundColor: 'white', borderRadius: 12, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 }}>
          {grid.map((row, ri) => <View key={ri} style={{ flexDirection: 'row' }}>{row.map((cell, ci) => <Cell key={`${ri}-${ci}`} row={ri} col={ci} correctLetter={cell} userLetter={userInputs[ri][ci]} isSelected={selectedCell?.row === ri && selectedCell?.col === ci} isHighlighted={highlightedCells.has(`${ri}-${ci}`)} cellNumber={getCellNumber(ri, ci)} onPress={() => handleCellPress(ri, ci)} cellSize={cellSize} isCorrect={cell !== null && userInputs[ri][ci].toUpperCase() === cell.toUpperCase()} showAnswer={showAnswers} />)}</View>)}
        </View>
        <View style={{ flex: isWeb ? 1 : undefined }}>
          <View style={{ marginBottom: 16 }}><Text style={{ fontWeight: 'bold', color: '#475569', marginBottom: 8, fontSize: isWeb ? 16 : 14 }}>Across</Text>{acrossClues.map(clue => <ClueItem key={`across-${clue.number}`} clue={clue} isSelected={selectedClue?.number === clue.number && selectedClue?.direction === 'across'} isCompleted={isWordComplete(clue)} onPress={() => handleCluePress(clue)} />)}</View>
          <View><Text style={{ fontWeight: 'bold', color: '#475569', marginBottom: 8, fontSize: isWeb ? 16 : 14 }}>Down</Text>{downClues.map(clue => <ClueItem key={`down-${clue.number}`} clue={clue} isSelected={selectedClue?.number === clue.number && selectedClue?.direction === 'down'} isCompleted={isWordComplete(clue)} onPress={() => handleCluePress(clue)} />)}</View>
        </View>
      </ScrollView>
      {gameComplete && <VictoryScreen onPlayAgain={initializeGame} onBackToHome={() => router.back()} />}
    </SafeAreaView>
  );
}
