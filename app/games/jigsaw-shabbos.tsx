import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText, Circle, Ellipse } from 'react-native-svg';

// Shabbos illustration - candles, challah, and wine
function ShabbosImage({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="shabbosGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#1e1b4b" />
          <Stop offset="60%" stopColor="#312e81" />
          <Stop offset="100%" stopColor="#4338ca" />
        </LinearGradient>
        <LinearGradient id="candleGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#fef3c7" />
          <Stop offset="100%" stopColor="#fcd34d" />
        </LinearGradient>
        <LinearGradient id="tableGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#f5f5f4" />
          <Stop offset="100%" stopColor="#e7e5e4" />
        </LinearGradient>
      </Defs>

      {/* Night sky background */}
      <Rect x="0" y="0" width="400" height="300" fill="url(#shabbosGrad)" />

      {/* Stars */}
      <Circle cx="50" cy="40" r="1.5" fill="white" opacity="0.8" />
      <Circle cx="120" cy="25" r="1" fill="white" opacity="0.6" />
      <Circle cx="200" cy="50" r="1.5" fill="white" opacity="0.7" />
      <Circle cx="280" cy="35" r="1" fill="white" opacity="0.5" />
      <Circle cx="350" cy="55" r="1.5" fill="white" opacity="0.8" />
      <Circle cx="80" cy="70" r="1" fill="white" opacity="0.6" />
      <Circle cx="320" cy="20" r="1" fill="white" opacity="0.7" />

      {/* Window frame */}
      <Rect x="50" y="30" width="300" height="180" rx="8" fill="#1e293b" opacity="0.3" />

      {/* White tablecloth */}
      <Path d="M 0 200 Q 200 180 400 200 L 400 300 L 0 300 Z" fill="url(#tableGrad)" />
      <Path d="M 0 200 Q 200 180 400 200" stroke="#d4d4d4" strokeWidth="2" fill="none" />

      {/* Tablecloth pattern */}
      <Path d="M 30 240 L 30 280 M 70 235 L 70 285 M 110 232 L 110 290 M 150 230 L 150 295" stroke="#e5e5e5" strokeWidth="1" opacity="0.5" />
      <Path d="M 250 230 L 250 295 M 290 232 L 290 290 M 330 235 L 330 285 M 370 240 L 370 280" stroke="#e5e5e5" strokeWidth="1" opacity="0.5" />

      {/* Candlesticks holder base */}
      <Ellipse cx="200" cy="195" rx="100" ry="15" fill="#c0c0c0" opacity="0.3" />

      {/* Left candlestick */}
      <G transform="translate(130, 100)">
        {/* Base */}
        <Ellipse cx="20" cy="95" rx="18" ry="5" fill="#d4af37" />
        <Rect x="8" y="85" width="24" height="10" rx="2" fill="#d4af37" />
        <Rect x="12" y="60" width="16" height="25" rx="2" fill="#c9a227" />
        <Ellipse cx="20" cy="60" rx="10" ry="3" fill="#d4af37" />

        {/* Candle */}
        <Rect x="14" y="15" width="12" height="45" rx="2" fill="#fffef0" />
        <Ellipse cx="20" cy="15" rx="6" ry="2" fill="#fef9c3" />

        {/* Flame */}
        <Path d="M 20 15 Q 14 5 20 -10 Q 26 5 20 15" fill="#f97316" />
        <Path d="M 20 12 Q 16 5 20 -5 Q 24 5 20 12" fill="#fbbf24" />
        <Circle cx="20" cy="2" r="3" fill="#fef3c7" opacity="0.9" />

        {/* Glow */}
        <Circle cx="20" cy="0" r="25" fill="#fef3c7" opacity="0.15" />
        <Circle cx="20" cy="0" r="15" fill="#fef3c7" opacity="0.2" />
      </G>

      {/* Right candlestick */}
      <G transform="translate(230, 100)">
        {/* Base */}
        <Ellipse cx="20" cy="95" rx="18" ry="5" fill="#d4af37" />
        <Rect x="8" y="85" width="24" height="10" rx="2" fill="#d4af37" />
        <Rect x="12" y="60" width="16" height="25" rx="2" fill="#c9a227" />
        <Ellipse cx="20" cy="60" rx="10" ry="3" fill="#d4af37" />

        {/* Candle */}
        <Rect x="14" y="15" width="12" height="45" rx="2" fill="#fffef0" />
        <Ellipse cx="20" cy="15" rx="6" ry="2" fill="#fef9c3" />

        {/* Flame */}
        <Path d="M 20 15 Q 14 5 20 -10 Q 26 5 20 15" fill="#f97316" />
        <Path d="M 20 12 Q 16 5 20 -5 Q 24 5 20 12" fill="#fbbf24" />
        <Circle cx="20" cy="2" r="3" fill="#fef3c7" opacity="0.9" />

        {/* Glow */}
        <Circle cx="20" cy="0" r="25" fill="#fef3c7" opacity="0.15" />
        <Circle cx="20" cy="0" r="15" fill="#fef3c7" opacity="0.2" />
      </G>

      {/* Challah cover */}
      <G transform="translate(150, 210)">
        <Path d="M 0 40 Q 50 20 100 40 Q 50 55 0 40" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
        {/* Embroidery */}
        <SvgText x="50" y="42" fontSize="10" fill="#d97706" textAnchor="middle" fontWeight="bold">שבת</SvgText>
      </G>

      {/* Challah peeking out */}
      <G transform="translate(160, 235)">
        <Ellipse cx="40" cy="10" rx="35" ry="12" fill="#d4a574" />
        <Path d="M 15 8 Q 40 2 65 8" stroke="#a0785c" strokeWidth="2" fill="none" />
        <Path d="M 25 5 Q 40 0 55 5" stroke="#a0785c" strokeWidth="1.5" fill="none" />
      </G>

      {/* Kiddush cup */}
      <G transform="translate(310, 175)">
        <Path d="M 10 0 L 40 0 L 35 45 L 15 45 Z" fill="#c0c0c0" />
        <Ellipse cx="25" cy="0" rx="15" ry="5" fill="#d4d4d4" />
        <Ellipse cx="25" cy="45" rx="10" ry="3" fill="#a3a3a3" />
        <Rect x="20" y="45" width="10" height="12" fill="#b0b0b0" />
        <Ellipse cx="25" cy="57" rx="15" ry="5" fill="#c0c0c0" />
        {/* Wine */}
        <Ellipse cx="25" cy="8" rx="12" ry="4" fill="#7c2d12" opacity="0.9" />
      </G>

      {/* Flower vase */}
      <G transform="translate(50, 160)">
        <Path d="M 15 35 L 35 35 L 30 70 L 20 70 Z" fill="#60a5fa" />
        <Ellipse cx="25" cy="35" rx="10" ry="4" fill="#93c5fd" />
        {/* Flowers */}
        <Circle cx="20" cy="20" r="8" fill="#f472b6" />
        <Circle cx="30" cy="15" r="7" fill="#fb7185" />
        <Circle cx="25" cy="25" r="6" fill="#f9a8d4" />
        <Path d="M 25 35 L 20 25 M 25 35 L 30 20 M 25 35 L 25 28" stroke="#16a34a" strokeWidth="2" />
      </G>

      {/* Ambient glow overlay */}
      <Rect x="100" y="50" width="200" height="150" fill="#fef3c7" opacity="0.05" />
    </Svg>
  );
}

interface PuzzlePiece {
  id: number;
  correctRow: number;
  correctCol: number;
  currentRow: number;
  currentCol: number;
  isPlaced: boolean;
}

interface PieceComponentProps {
  piece: PuzzlePiece;
  pieceWidth: number;
  pieceHeight: number;
  totalWidth: number;
  totalHeight: number;
  isSelected: boolean;
  onSelect: () => void;
  onPlace: (targetRow: number, targetCol: number) => void;
  gridRows: number;
  gridCols: number;
  boardOffset: { x: number; y: number };
}

function PieceComponent({
  piece,
  pieceWidth,
  pieceHeight,
  totalWidth,
  totalHeight,
  isSelected,
  onSelect,
  onPlace,
  gridRows,
  gridCols,
  boardOffset,
}: PieceComponentProps) {
  const isWeb = Platform.OS === 'web';
  const scale = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const zIndex = useSharedValue(piece.isPlaced ? 1 : 10);
  const entranceScale = useSharedValue(0);

  useEffect(() => {
    entranceScale.value = withDelay(
      piece.id * 50,
      withSpring(1, { damping: 12, stiffness: 100 })
    );
  }, [piece.id]);

  const handlePlacement = useCallback((x: number, y: number) => {
    const relativeX = x - boardOffset.x;
    const relativeY = y - boardOffset.y;

    const targetCol = Math.round(relativeX / pieceWidth);
    const targetRow = Math.round(relativeY / pieceHeight);

    if (targetRow >= 0 && targetRow < gridRows && targetCol >= 0 && targetCol < gridCols) {
      onPlace(targetRow, targetCol);
    }
  }, [boardOffset, pieceWidth, pieceHeight, gridRows, gridCols, onPlace]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      scale.value = withSpring(1.1, { damping: 15 });
      zIndex.value = 100;
    })
    .onUpdate((event) => {
      offsetX.value = event.translationX;
      offsetY.value = event.translationY;
    })
    .onEnd((event) => {
      scale.value = withSpring(1, { damping: 15 });
      zIndex.value = piece.isPlaced ? 1 : 10;

      const currentX = piece.currentCol * pieceWidth + boardOffset.x + event.translationX;
      const currentY = piece.currentRow * pieceHeight + boardOffset.y + event.translationY;

      runOnJS(handlePlacement)(currentX, currentY);

      offsetX.value = withSpring(0);
      offsetY.value = withSpring(0);
    });

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      runOnJS(onSelect)();
    });

  const composedGesture = isWeb ? panGesture : Gesture.Exclusive(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: scale.value * entranceScale.value },
    ],
    zIndex: zIndex.value,
  }));

  const clipX = piece.correctCol * pieceWidth;
  const clipY = piece.correctRow * pieceHeight;

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          animatedStyle,
          {
            position: 'absolute',
            left: piece.currentCol * pieceWidth,
            top: piece.currentRow * pieceHeight,
            width: pieceWidth,
            height: pieceHeight,
            borderWidth: isSelected ? 3 : 1,
            borderColor: isSelected ? '#7c3aed' : piece.isPlaced ? '#8b5cf6' : '#d1d5db',
            borderRadius: 4,
            overflow: 'hidden',
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
            shadowOpacity: isSelected ? 0.3 : 0.15,
            shadowRadius: isSelected ? 8 : 4,
            elevation: isSelected ? 8 : 3,
          },
        ]}
      >
        <View style={{
          width: totalWidth,
          height: totalHeight,
          marginLeft: -clipX,
          marginTop: -clipY
        }}>
          <ShabbosImage width={totalWidth} height={totalHeight} />
        </View>
        {piece.isPlaced && (
          <View style={{
            position: 'absolute',
            top: 2,
            right: 2,
            backgroundColor: '#8b5cf6',
            borderRadius: 10,
            width: 16,
            height: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>✓</Text>
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

function ConfettiParticle({ index }: { index: number }) {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const emojis = ['✨', '🕯️', '⭐', '🍷', '🥖', '💫', '✡️'];
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

function VictoryScreen({
  elapsedTime,
  moves,
  onPlayAgain,
  onBackToHome,
}: {
  elapsedTime: number;
  moves: number;
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
          <Text style={{ fontSize: 72 }}>🕯️</Text>
        </Animated.View>

        <Text className={`font-bold text-slate-800 mt-6 ${isWeb ? 'text-4xl' : 'text-3xl'}`}>
          Gut Shabbos!
        </Text>
        <Text className="text-slate-500 text-center mt-3 text-base">
          You completed the Shabbos puzzle!
        </Text>

        <Animated.View entering={FadeIn.duration(400).delay(500)} className="mt-8 flex-row" style={{ gap: 16 }}>
          <View className="items-center bg-purple-50 rounded-2xl py-4 px-6">
            <Text className="text-3xl font-bold text-purple-600">{formatTime(elapsedTime)}</Text>
            <Text className="text-xs text-purple-700 mt-1 uppercase tracking-wide font-semibold">
              Time
            </Text>
          </View>
          <View className="items-center bg-violet-50 rounded-2xl py-4 px-6">
            <Text className="text-3xl font-bold text-violet-600">{moves}</Text>
            <Text className="text-xs text-violet-700 mt-1 uppercase tracking-wide font-semibold">
              Moves
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

export default function JigsawShabbosGame() {
  const isWeb = Platform.OS === 'web';
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const GRID_ROWS = 3;
  const GRID_COLS = 4;

  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const puzzleSize = useMemo(() => {
    const padding = isWeb ? 100 : 40;
    const headerHeight = isWeb ? 140 : 180;
    const maxWidth = Math.min(screenWidth - padding, 600);
    const maxHeight = screenHeight - headerHeight - padding;

    const aspectRatio = GRID_COLS / GRID_ROWS;
    let width = maxWidth;
    let height = width / aspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return { width, height };
  }, [screenWidth, screenHeight, isWeb]);

  const pieceWidth = puzzleSize.width / GRID_COLS;
  const pieceHeight = puzzleSize.height / GRID_ROWS;

  const boardOffset = useMemo(() => ({
    x: (screenWidth - puzzleSize.width) / 2,
    y: 0,
  }), [screenWidth, puzzleSize.width]);

  const initializeGame = useCallback(() => {
    const newPieces: PuzzlePiece[] = [];
    const positions: { row: number; col: number }[] = [];

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        positions.push({ row, col });
      }
    }

    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    let id = 0;
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const shuffledPos = positions[id];
        newPieces.push({
          id,
          correctRow: row,
          correctCol: col,
          currentRow: shuffledPos.row,
          currentCol: shuffledPos.col,
          isPlaced: false,
        });
        id++;
      }
    }

    newPieces.forEach(piece => {
      if (piece.currentRow === piece.correctRow && piece.currentCol === piece.correctCol) {
        piece.isPlaced = true;
      }
    });

    setPieces(newPieces);
    setSelectedPiece(null);
    setMoves(0);
    setGameComplete(false);
    setStartTime(null);
    setElapsedTime(0);
    setGameStarted(false);
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

  const handlePieceSelect = useCallback((pieceId: number) => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }

    const piece = pieces.find(p => p.id === pieceId);
    if (!piece || piece.isPlaced) return;

    if (selectedPiece === null) {
      setSelectedPiece(pieceId);
    } else if (selectedPiece === pieceId) {
      setSelectedPiece(null);
    } else {
      const otherPiece = pieces.find(p => p.id === selectedPiece);
      if (otherPiece && !otherPiece.isPlaced) {
        setPieces(prev => prev.map(p => {
          if (p.id === pieceId) {
            const newPiece = { ...p, currentRow: otherPiece.currentRow, currentCol: otherPiece.currentCol };
            newPiece.isPlaced = newPiece.currentRow === newPiece.correctRow && newPiece.currentCol === newPiece.correctCol;
            return newPiece;
          }
          if (p.id === selectedPiece) {
            const newPiece = { ...p, currentRow: piece.currentRow, currentCol: piece.currentCol };
            newPiece.isPlaced = newPiece.currentRow === newPiece.correctRow && newPiece.currentCol === newPiece.correctCol;
            return newPiece;
          }
          return p;
        }));
        setMoves(m => m + 1);
      }
      setSelectedPiece(null);
    }
  }, [pieces, selectedPiece, gameStarted]);

  const handlePiecePlace = useCallback((pieceId: number, targetRow: number, targetCol: number) => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }

    const piece = pieces.find(p => p.id === pieceId);
    if (!piece) return;

    const targetPiece = pieces.find(p => p.currentRow === targetRow && p.currentCol === targetCol && p.id !== pieceId);

    if (targetPiece && !targetPiece.isPlaced) {
      setPieces(prev => prev.map(p => {
        if (p.id === pieceId) {
          const newPiece = { ...p, currentRow: targetRow, currentCol: targetCol };
          newPiece.isPlaced = newPiece.currentRow === newPiece.correctRow && newPiece.currentCol === newPiece.correctCol;
          return newPiece;
        }
        if (p.id === targetPiece.id) {
          const newPiece = { ...p, currentRow: piece.currentRow, currentCol: piece.currentCol };
          newPiece.isPlaced = newPiece.currentRow === newPiece.correctRow && newPiece.currentCol === newPiece.correctCol;
          return newPiece;
        }
        return p;
      }));
      setMoves(m => m + 1);
    }

    setSelectedPiece(null);
  }, [pieces, gameStarted]);

  useEffect(() => {
    if (pieces.length > 0 && pieces.every(p => p.isPlaced)) {
      setGameComplete(true);
    }
  }, [pieces]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const placedCount = pieces.filter(p => p.isPlaced).length;
  const totalPieces = GRID_ROWS * GRID_COLS;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-purple-50">
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
                Shabbos Puzzle
              </Text>
              <Text className="text-slate-500 text-xs mt-0.5">Shabbos Candles</Text>
            </View>

            <Pressable
              onPress={initializeGame}
              className="w-10 h-10 rounded-full bg-purple-50 items-center justify-center active:bg-purple-100"
            >
              <FontAwesome name="refresh" size={18} color="#7c3aed" />
            </Pressable>
          </View>

          {/* Stats Bar */}
          <View
            className="flex-row justify-center py-3 bg-slate-50 border-t border-slate-100"
            style={{ gap: isWeb ? 48 : 24 }}
          >
            <View className="items-center">
              <Text className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Time</Text>
              <Text className={`font-bold text-slate-800 ${isWeb ? 'text-xl' : 'text-lg'} mt-1`}>
                {formatTime(elapsedTime)}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Moves</Text>
              <Text className={`font-bold text-slate-800 ${isWeb ? 'text-xl' : 'text-lg'} mt-1`}>
                {moves}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Placed</Text>
              <Text className={`font-bold text-purple-600 ${isWeb ? 'text-xl' : 'text-lg'} mt-1`}>
                {placedCount}/{totalPieces}
              </Text>
            </View>
          </View>
        </View>

        {/* Puzzle Board */}
        <View className="flex-1 items-center justify-center p-4">
          <View
            style={{
              width: puzzleSize.width,
              height: puzzleSize.height,
              backgroundColor: '#ede9fe',
              borderRadius: 12,
              borderWidth: 3,
              borderColor: '#c4b5fd',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {Array.from({ length: GRID_ROWS - 1 }).map((_, i) => (
              <View
                key={`h-${i}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: (i + 1) * pieceHeight,
                  height: 1,
                  backgroundColor: '#8b5cf6',
                  opacity: 0.3,
                }}
              />
            ))}
            {Array.from({ length: GRID_COLS - 1 }).map((_, i) => (
              <View
                key={`v-${i}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: (i + 1) * pieceWidth,
                  width: 1,
                  backgroundColor: '#8b5cf6',
                  opacity: 0.3,
                }}
              />
            ))}

            {pieces.map(piece => (
              <PieceComponent
                key={piece.id}
                piece={piece}
                pieceWidth={pieceWidth}
                pieceHeight={pieceHeight}
                totalWidth={puzzleSize.width}
                totalHeight={puzzleSize.height}
                isSelected={selectedPiece === piece.id}
                onSelect={() => handlePieceSelect(piece.id)}
                onPlace={(targetRow, targetCol) => handlePiecePlace(piece.id, targetRow, targetCol)}
                gridRows={GRID_ROWS}
                gridCols={GRID_COLS}
                boardOffset={boardOffset}
              />
            ))}
          </View>

          <Text className="text-slate-500 text-sm mt-4 text-center px-8">
            {isWeb
              ? 'Drag pieces to swap them, or click two pieces to swap their positions'
              : 'Tap two pieces to swap them, or drag pieces to move them'}
          </Text>
        </View>

        {gameComplete && (
          <VictoryScreen
            elapsedTime={elapsedTime}
            moves={moves}
            onPlayAgain={initializeGame}
            onBackToHome={() => router.back()}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
