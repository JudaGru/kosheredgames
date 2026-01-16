import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

// Purim illustration - festive scene with megillah, costumes, and mishloach manos
function PurimImage({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="purimBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#fdf4ff" />
          <Stop offset="100%" stopColor="#f5d0fe" />
        </LinearGradient>
        <LinearGradient id="crownGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#fcd34d" />
          <Stop offset="100%" stopColor="#d97706" />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="400" height="300" fill="url(#purimBg)" />

      {/* Confetti/streamers */}
      <Circle cx="30" cy="40" r="5" fill="#ec4899" opacity="0.7" />
      <Circle cx="80" cy="60" r="4" fill="#8b5cf6" opacity="0.6" />
      <Circle cx="320" cy="30" r="6" fill="#3b82f6" opacity="0.7" />
      <Circle cx="370" cy="70" r="4" fill="#22c55e" opacity="0.6" />
      <Circle cx="50" cy="120" r="3" fill="#f59e0b" opacity="0.8" />
      <Circle cx="350" cy="150" r="5" fill="#ef4444" opacity="0.6" />
      <Rect x="100" y="20" width="15" height="4" rx="2" fill="#ec4899" transform="rotate(25 107 22)" opacity="0.7" />
      <Rect x="280" y="40" width="12" height="3" rx="1.5" fill="#8b5cf6" transform="rotate(-15 286 41)" opacity="0.6" />
      <Rect x="180" y="15" width="10" height="3" rx="1.5" fill="#22c55e" transform="rotate(10 185 16)" opacity="0.7" />

      {/* Megillah scroll */}
      <G transform="translate(50, 60)">
        {/* Left roller */}
        <Rect x="0" y="0" width="15" height="120" rx="7" fill="#8b4513" />
        <Rect x="2" y="-5" width="11" height="10" rx="3" fill="#a0522d" />
        <Rect x="2" y="115" width="11" height="10" rx="3" fill="#a0522d" />

        {/* Right roller */}
        <Rect x="85" y="0" width="15" height="120" rx="7" fill="#8b4513" />
        <Rect x="87" y="-5" width="11" height="10" rx="3" fill="#a0522d" />
        <Rect x="87" y="115" width="11" height="10" rx="3" fill="#a0522d" />

        {/* Parchment */}
        <Rect x="12" y="10" width="76" height="100" fill="#fef3c7" />

        {/* Hebrew text lines */}
        <Rect x="18" y="20" width="64" height="3" rx="1" fill="#92400e" opacity="0.5" />
        <Rect x="18" y="30" width="60" height="3" rx="1" fill="#92400e" opacity="0.5" />
        <Rect x="18" y="40" width="64" height="3" rx="1" fill="#92400e" opacity="0.5" />
        <Rect x="18" y="50" width="58" height="3" rx="1" fill="#92400e" opacity="0.5" />
        <Rect x="18" y="60" width="64" height="3" rx="1" fill="#92400e" opacity="0.5" />
        <Rect x="18" y="70" width="62" height="3" rx="1" fill="#92400e" opacity="0.5" />
        <Rect x="18" y="80" width="64" height="3" rx="1" fill="#92400e" opacity="0.5" />
        <Rect x="18" y="90" width="56" height="3" rx="1" fill="#92400e" opacity="0.5" />

        {/* Decorative crown on megillah */}
        <Path d="M 40 -15 L 35 5 L 42 -5 L 50 5 L 58 -5 L 65 5 L 60 -15 Z" fill="url(#crownGold)" />
        <Circle cx="50" cy="-10" r="3" fill="#dc2626" />
      </G>

      {/* Queen Esther figure */}
      <G transform="translate(180, 80)">
        {/* Dress */}
        <Path d="M 30 50 L 10 130 L 50 130 Z" fill="#7c3aed" />
        <Path d="M 30 50 L 15 130 L 45 130 Z" fill="#8b5cf6" />

        {/* Body */}
        <Ellipse cx="30" cy="55" rx="12" ry="15" fill="#fde68a" />

        {/* Head */}
        <Circle cx="30" cy="30" r="18" fill="#fde68a" />

        {/* Crown */}
        <Path d="M 15 18 L 12 30 L 20 22 L 30 32 L 40 22 L 48 30 L 45 18 Z" fill="url(#crownGold)" />
        <Circle cx="22" cy="20" r="2" fill="#dc2626" />
        <Circle cx="30" cy="18" r="2.5" fill="#3b82f6" />
        <Circle cx="38" cy="20" r="2" fill="#22c55e" />

        {/* Face */}
        <Circle cx="24" cy="28" r="2" fill="#1e293b" />
        <Circle cx="36" cy="28" r="2" fill="#1e293b" />
        <Path d="M 26 36 Q 30 40 34 36" stroke="#ec4899" strokeWidth="2" fill="none" />

        {/* Hair */}
        <Path d="M 12 30 Q 5 20 12 12 Q 20 5 30 8 Q 40 5 48 12 Q 55 20 48 30" fill="#1e293b" />

        {/* Scepter */}
        <Rect x="48" y="50" width="4" height="50" fill="#d4af37" />
        <Circle cx="50" cy="48" r="6" fill="#d4af37" />
        <Circle cx="50" cy="48" r="3" fill="#7c3aed" />
      </G>

      {/* Gragger */}
      <G transform="translate(280, 100)">
        <Rect x="15" y="0" width="10" height="30" rx="3" fill="#a0785c" />
        <Rect x="5" y="30" width="30" height="50" rx="5" fill="#fbbf24" />
        <Rect x="5" y="30" width="30" height="50" rx="5" fill="#d97706" opacity="0.3" />
        <Circle cx="20" cy="55" r="8" fill="#dc2626" />
        <SvgText x="20" y="60" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">ג</SvgText>
      </G>

      {/* Hamantaschen */}
      <G transform="translate(280, 180)">
        <Path d="M 30 5 L 55 50 L 5 50 Z" fill="#d4a574" />
        <Circle cx="30" cy="35" r="12" fill="#7c3aed" />
        <Path d="M 12 48 Q 30 55 48 48" stroke="#a0785c" strokeWidth="2" fill="none" />
      </G>

      <G transform="translate(330, 200)">
        <Path d="M 25 5 L 45 45 L 5 45 Z" fill="#d4a574" />
        <Circle cx="25" cy="30" r="10" fill="#dc2626" />
      </G>

      {/* Mishloach Manos basket */}
      <G transform="translate(50, 200)">
        {/* Basket */}
        <Path d="M 0 30 L 10 70 L 80 70 L 90 30 Z" fill="#d4a574" />
        <Path d="M 5 30 L 85 30" stroke="#a0785c" strokeWidth="2" />
        <Path d="M 10 40 L 80 40" stroke="#a0785c" strokeWidth="1.5" />
        <Path d="M 12 50 L 78 50" stroke="#a0785c" strokeWidth="1.5" />
        <Path d="M 15 60 L 75 60" stroke="#a0785c" strokeWidth="1.5" />

        {/* Handle */}
        <Path d="M 20 30 Q 45 -10 70 30" stroke="#a0785c" strokeWidth="5" fill="none" />

        {/* Items in basket */}
        <Circle cx="30" cy="20" r="12" fill="#f97316" /> {/* Orange */}
        <Rect x="45" y="10" width="20" height="25" rx="3" fill="#3b82f6" /> {/* Juice box */}
        <SvgText x="55" y="27" fontSize="8" fill="white" textAnchor="middle">🧃</SvgText>
        <Circle cx="70" cy="25" r="8" fill="#dc2626" /> {/* Apple */}

        {/* Cellophane wrap */}
        <Path d="M 0 28 Q 45 15 90 28" stroke="#93c5fd" strokeWidth="1" fill="none" opacity="0.5" />
        <Ellipse cx="45" cy="5" rx="35" ry="20" fill="#bfdbfe" opacity="0.2" />

        {/* Bow */}
        <Circle cx="45" cy="0" r="8" fill="#ec4899" />
        <Path d="M 30 0 Q 37 -8 45 0 Q 53 -8 60 0" fill="#f472b6" />
        <Path d="M 30 0 Q 37 8 45 0 Q 53 8 60 0" fill="#f472b6" />
      </G>

      {/* Mask */}
      <G transform="translate(340, 60)">
        <Ellipse cx="25" cy="25" rx="25" ry="20" fill="#fbbf24" />
        <Ellipse cx="15" cy="22" rx="7" ry="5" fill="white" />
        <Ellipse cx="35" cy="22" rx="7" ry="5" fill="white" />
        <Circle cx="15" cy="22" r="3" fill="#1e293b" />
        <Circle cx="35" cy="22" r="3" fill="#1e293b" />
        <Path d="M 25 28 L 22 33 L 28 33 Z" fill="#ec4899" />
        {/* Stick */}
        <Rect x="48" y="20" width="25" height="5" rx="2" fill="#a0785c" />
        {/* Feather */}
        <Path d="M 40 5 Q 50 -5 45 15 Q 42 5 40 5" fill="#8b5cf6" />
        <Path d="M 44 8 Q 55 0 50 18 Q 46 10 44 8" fill="#ec4899" />
      </G>

      {/* Decorative banner */}
      <G transform="translate(130, 220)">
        <Path d="M 0 0 L 140 0 L 135 15 L 140 30 L 0 30 L 5 15 Z" fill="#ec4899" />
        <SvgText x="70" y="22" fontSize="16" fill="white" textAnchor="middle" fontWeight="bold">!פורים שמח</SvgText>
      </G>

      {/* More confetti */}
      <Circle cx="200" cy="50" r="4" fill="#fbbf24" opacity="0.8" />
      <Circle cx="260" cy="45" r="3" fill="#ec4899" opacity="0.7" />
      <Rect x="150" y="30" width="8" height="3" rx="1" fill="#3b82f6" transform="rotate(-20 154 31)" opacity="0.6" />
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
  gameKey: number;
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
  gameKey,
}: PieceComponentProps) {
  const isWeb = Platform.OS === 'web';
  const scale = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const zIndex = useSharedValue(piece.isPlaced ? 1 : 10);
  const entranceScale = useSharedValue(0);

  useEffect(() => {
    // Reset and replay entrance animation when gameKey changes
    entranceScale.value = 0;
    entranceScale.value = withDelay(
      piece.id * 50,
      withSpring(1, { damping: 12, stiffness: 100 })
    );
  }, [piece.id, gameKey]);

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
            borderColor: isSelected ? '#db2777' : piece.isPlaced ? '#ec4899' : '#d1d5db',
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
          <PurimImage width={totalWidth} height={totalHeight} />
        </View>
        {piece.isPlaced && (
          <View style={{
            position: 'absolute',
            top: 2,
            right: 2,
            backgroundColor: '#ec4899',
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

  const emojis = ['✨', '🎭', '👑', '📜', '🔔', '🎉', '🍪'];
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
          <Text style={{ fontSize: 72 }}>🎭</Text>
        </Animated.View>

        <Text className={`font-bold text-slate-800 mt-6 ${isWeb ? 'text-4xl' : 'text-3xl'}`}>
          Freilichen Purim!
        </Text>
        <Text className="text-slate-500 text-center mt-3 text-base">
          You completed the Purim puzzle!
        </Text>

        <Animated.View entering={FadeIn.duration(400).delay(500)} className="mt-8 flex-row" style={{ gap: 16 }}>
          <View className="items-center bg-pink-50 rounded-2xl py-4 px-6">
            <Text className="text-3xl font-bold text-pink-600">{formatTime(elapsedTime)}</Text>
            <Text className="text-xs text-pink-700 mt-1 uppercase tracking-wide font-semibold">
              Time
            </Text>
          </View>
          <View className="items-center bg-fuchsia-50 rounded-2xl py-4 px-6">
            <Text className="text-3xl font-bold text-fuchsia-600">{moves}</Text>
            <Text className="text-xs text-fuchsia-700 mt-1 uppercase tracking-wide font-semibold">
              Moves
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

export default function JigsawPurimGame() {
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
      <SafeAreaView className="flex-1 bg-pink-50">
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
                Purim Puzzle
              </Text>
              <Text className="text-slate-500 text-xs mt-0.5">Megillas Esther</Text>
            </View>

            <Pressable
              onPress={initializeGame}
              className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center active:bg-pink-100"
            >
              <FontAwesome name="refresh" size={18} color="#db2777" />
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
              <Text className={`font-bold text-pink-600 ${isWeb ? 'text-xl' : 'text-lg'} mt-1`}>
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
              backgroundColor: '#fdf2f8',
              borderRadius: 12,
              borderWidth: 3,
              borderColor: '#fbcfe8',
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
                  backgroundColor: '#ec4899',
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
                  backgroundColor: '#ec4899',
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
