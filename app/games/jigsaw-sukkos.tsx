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
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText, Circle, Ellipse, Line } from 'react-native-svg';

// Sukkos illustration - a beautiful sukkah with decorations
function SukkosImage({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="sukkahSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#60a5fa" />
          <Stop offset="100%" stopColor="#bae6fd" />
        </LinearGradient>
        <LinearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#92400e" />
          <Stop offset="50%" stopColor="#a16207" />
          <Stop offset="100%" stopColor="#92400e" />
        </LinearGradient>
        <LinearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#84cc16" />
          <Stop offset="100%" stopColor="#65a30d" />
        </LinearGradient>
      </Defs>

      {/* Sky */}
      <Rect x="0" y="0" width="400" height="300" fill="url(#sukkahSky)" />

      {/* Sun */}
      <Circle cx="350" cy="50" r="30" fill="#fcd34d" opacity="0.9" />
      <Circle cx="350" cy="50" r="25" fill="#fde047" />

      {/* Clouds */}
      <G transform="translate(50, 40)">
        <Ellipse cx="30" cy="20" rx="25" ry="15" fill="white" opacity="0.9" />
        <Ellipse cx="55" cy="15" rx="20" ry="12" fill="white" opacity="0.9" />
        <Ellipse cx="70" cy="22" rx="18" ry="10" fill="white" opacity="0.9" />
      </G>

      {/* Ground/Grass */}
      <Rect x="0" y="250" width="400" height="50" fill="url(#groundGrad)" />

      {/* Sukkah structure */}
      {/* Back wall */}
      <Rect x="60" y="100" width="280" height="150" fill="#d4a574" opacity="0.3" />

      {/* Left wall/post */}
      <Rect x="50" y="90" width="20" height="170" fill="url(#woodGrad)" />
      <Rect x="50" y="90" width="20" height="170" fill="#78350f" opacity="0.3" />

      {/* Right wall/post */}
      <Rect x="330" y="90" width="20" height="170" fill="url(#woodGrad)" />
      <Rect x="330" y="90" width="20" height="170" fill="#78350f" opacity="0.3" />

      {/* Top beam */}
      <Rect x="45" y="80" width="315" height="15" fill="url(#woodGrad)" />

      {/* Schach (roof covering) */}
      <G>
        {/* Branch layers */}
        {[0, 1, 2, 3, 4].map((i) => (
          <G key={i}>
            <Path
              d={`M ${55 + i * 30} 75 Q ${70 + i * 30} 65 ${85 + i * 30} 75`}
              stroke="#166534"
              strokeWidth="8"
              fill="none"
            />
            <Path
              d={`M ${70 + i * 30} 80 Q ${85 + i * 30} 70 ${100 + i * 30} 80`}
              stroke="#15803d"
              strokeWidth="6"
              fill="none"
            />
          </G>
        ))}
        {/* More schach for coverage */}
        {[0, 1, 2, 3].map((i) => (
          <Path
            key={`schach2-${i}`}
            d={`M ${80 + i * 40} 72 L ${120 + i * 40} 72`}
            stroke="#22c55e"
            strokeWidth="5"
          />
        ))}
        {/* Stars peeking through schach */}
        <Circle cx="100" cy="60" r="2" fill="#fcd34d" opacity="0.4" />
        <Circle cx="200" cy="55" r="2" fill="#fcd34d" opacity="0.3" />
        <Circle cx="280" cy="65" r="2" fill="#fcd34d" opacity="0.35" />
      </G>

      {/* Decorations hanging from schach */}
      {/* Paper chains */}
      <G>
        <Circle cx="120" cy="100" r="8" fill="#ef4444" />
        <Circle cx="136" cy="100" r="8" fill="#3b82f6" />
        <Circle cx="152" cy="100" r="8" fill="#eab308" />
        <Circle cx="168" cy="100" r="8" fill="#22c55e" />
      </G>

      {/* Hanging fruit */}
      <G transform="translate(220, 95)">
        <Line x1="15" y1="0" x2="15" y2="15" stroke="#78350f" strokeWidth="2" />
        <Circle cx="15" cy="22" r="10" fill="#dc2626" /> {/* Apple */}
        <Path d="M 15 12 L 17 8 L 19 12" fill="#22c55e" /> {/* Leaf */}
      </G>

      <G transform="translate(270, 95)">
        <Line x1="15" y1="0" x2="15" y2="20" stroke="#78350f" strokeWidth="2" />
        <Ellipse cx="15" cy="32" rx="8" ry="12" fill="#f97316" /> {/* Orange/Esrog shape */}
      </G>

      {/* Pomegranate */}
      <G transform="translate(170, 95)">
        <Line x1="10" y1="0" x2="10" y2="12" stroke="#78350f" strokeWidth="2" />
        <Circle cx="10" cy="22" r="10" fill="#be123c" />
        <Path d="M 5 14 L 10 12 L 15 14" fill="#881337" />
      </G>

      {/* Lulav and Esrog on table */}
      <G transform="translate(80, 190)">
        {/* Small table */}
        <Rect x="0" y="40" width="80" height="5" rx="2" fill="#92400e" />
        <Rect x="5" y="45" width="5" height="25" fill="#78350f" />
        <Rect x="70" y="45" width="5" height="25" fill="#78350f" />

        {/* Lulav */}
        <Path d="M 50 40 L 50 -10" stroke="#65a30d" strokeWidth="4" />
        <Path d="M 50 0 Q 40 -20 50 -40" stroke="#84cc16" strokeWidth="3" fill="none" />
        <Path d="M 50 0 Q 60 -20 50 -40" stroke="#84cc16" strokeWidth="3" fill="none" />
        <Path d="M 50 5 Q 35 -10 50 -30" stroke="#a3e635" strokeWidth="2" fill="none" />
        <Path d="M 50 5 Q 65 -10 50 -30" stroke="#a3e635" strokeWidth="2" fill="none" />

        {/* Hadassim (myrtle) */}
        <Path d="M 45 20 L 42 -5" stroke="#166534" strokeWidth="3" />
        <Circle cx="40" cy="0" r="3" fill="#22c55e" />
        <Circle cx="43" cy="5" r="3" fill="#22c55e" />
        <Circle cx="41" cy="10" r="3" fill="#22c55e" />

        {/* Aravos (willow) */}
        <Path d="M 55 20 L 58 -5" stroke="#166534" strokeWidth="3" />
        <Ellipse cx="60" cy="0" rx="4" ry="6" fill="#86efac" />
        <Ellipse cx="58" cy="8" rx="4" ry="6" fill="#86efac" />

        {/* Esrog */}
        <Ellipse cx="25" cy="35" rx="12" ry="10" fill="#facc15" />
        <Path d="M 25 25 L 25 22 L 27 20" stroke="#a16207" strokeWidth="2" fill="none" />
      </G>

      {/* Chairs */}
      <G transform="translate(240, 200)">
        <Rect x="0" y="30" width="40" height="5" fill="#92400e" />
        <Rect x="0" y="35" width="5" height="25" fill="#78350f" />
        <Rect x="35" y="35" width="5" height="25" fill="#78350f" />
        <Rect x="0" y="0" width="5" height="35" fill="#92400e" />
      </G>

      {/* Ushpizin poster */}
      <G transform="translate(280, 130)">
        <Rect x="0" y="0" width="50" height="60" rx="3" fill="#fef3c7" />
        <Rect x="5" y="5" width="40" height="10" fill="#fcd34d" opacity="0.5" />
        <SvgText x="25" y="13" fontSize="8" fill="#92400e" textAnchor="middle" fontWeight="bold">אושפיזין</SvgText>
        <Rect x="8" y="20" width="34" height="2" fill="#d4d4d4" />
        <Rect x="8" y="26" width="30" height="2" fill="#d4d4d4" />
        <Rect x="8" y="32" width="32" height="2" fill="#d4d4d4" />
        <Rect x="8" y="38" width="28" height="2" fill="#d4d4d4" />
        <Rect x="8" y="44" width="34" height="2" fill="#d4d4d4" />
        <Rect x="8" y="50" width="30" height="2" fill="#d4d4d4" />
      </G>

      {/* Welcome mat */}
      <Rect x="170" y="255" width="60" height="8" rx="2" fill="#d4a574" />
      <SvgText x="200" y="262" fontSize="6" fill="#78350f" textAnchor="middle">ברוכים הבאים</SvgText>

      {/* Birds */}
      <Path d="M 30 80 Q 35 75 40 80 Q 45 75 50 80" stroke="#1e293b" strokeWidth="1.5" fill="none" />
      <Path d="M 380 100 Q 384 96 388 100 Q 392 96 396 100" stroke="#1e293b" strokeWidth="1.5" fill="none" />
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
            borderColor: isSelected ? '#65a30d' : piece.isPlaced ? '#84cc16' : '#d1d5db',
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
          <SukkosImage width={totalWidth} height={totalHeight} />
        </View>
        {piece.isPlaced && (
          <View style={{
            position: 'absolute',
            top: 2,
            right: 2,
            backgroundColor: '#84cc16',
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

  const emojis = ['✨', '🌿', '🍋', '🎋', '🍎', '💫', '✡️'];
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
          <Text style={{ fontSize: 72 }}>🌿</Text>
        </Animated.View>

        <Text className={`font-bold text-slate-800 mt-6 ${isWeb ? 'text-4xl' : 'text-3xl'}`}>
          Chag Sameach!
        </Text>
        <Text className="text-slate-500 text-center mt-3 text-base">
          You completed the Sukkos puzzle!
        </Text>

        <Animated.View entering={FadeIn.duration(400).delay(500)} className="mt-8 flex-row" style={{ gap: 16 }}>
          <View className="items-center bg-lime-50 rounded-2xl py-4 px-6">
            <Text className="text-3xl font-bold text-lime-600">{formatTime(elapsedTime)}</Text>
            <Text className="text-xs text-lime-700 mt-1 uppercase tracking-wide font-semibold">
              Time
            </Text>
          </View>
          <View className="items-center bg-green-50 rounded-2xl py-4 px-6">
            <Text className="text-3xl font-bold text-green-600">{moves}</Text>
            <Text className="text-xs text-green-700 mt-1 uppercase tracking-wide font-semibold">
              Moves
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(800)} style={{ width: '100%' }}>
          <Pressable
            onPress={onPlayAgain}
            style={{
              backgroundColor: '#65a30d',
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 32,
              marginTop: 32,
              shadowColor: '#65a30d',
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

export default function JigsawSukkosGame() {
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
      <SafeAreaView className="flex-1 bg-lime-50">
        <StatusBar style="dark" />

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
                Sukkos Puzzle
              </Text>
              <Text className="text-slate-500 text-xs mt-0.5">The Sukkah</Text>
            </View>

            <Pressable
              onPress={initializeGame}
              className="w-10 h-10 rounded-full bg-lime-50 items-center justify-center active:bg-lime-100"
            >
              <FontAwesome name="refresh" size={18} color="#65a30d" />
            </Pressable>
          </View>

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
              <Text className={`font-bold text-lime-600 ${isWeb ? 'text-xl' : 'text-lg'} mt-1`}>
                {placedCount}/{totalPieces}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-1 items-center justify-center p-4">
          <View
            style={{
              width: puzzleSize.width,
              height: puzzleSize.height,
              backgroundColor: '#ecfccb',
              borderRadius: 12,
              borderWidth: 3,
              borderColor: '#bef264',
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
                  backgroundColor: '#84cc16',
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
                  backgroundColor: '#84cc16',
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
