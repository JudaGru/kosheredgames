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
import Svg, { Defs, G, LinearGradient, Path, Rect, Stop, Circle, Ellipse } from 'react-native-svg';

// Animated icon button with hover/press effects
function AnimatedIconButton({
  onPress,
  iconName,
  iconColor,
  bgColor,
  activeBgColor,
  spinOnPress = false,
}: {
  onPress: () => void;
  iconName: 'arrow-left' | 'refresh';
  iconColor: string;
  bgColor: string;
  activeBgColor: string;
  spinOnPress?: boolean;
}) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (spinOnPress) {
      rotation.value = withSequence(
        withTiming(rotation.value + 360, { duration: 500, easing: Easing.out(Easing.cubic) })
      );
    }
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ width: 40, height: 40 }}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: bgColor,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <FontAwesome name={iconName} size={18} color={iconColor} />
      </Animated.View>
    </Pressable>
  );
}

// Menorah illustration - the golden Menorah from the Beis Hamikdash
function MenorahImage({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#1a237e" />
          <Stop offset="50%" stopColor="#0d1b4a" />
          <Stop offset="100%" stopColor="#060d24" />
        </LinearGradient>
        <LinearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#ffd700" />
          <Stop offset="25%" stopColor="#ffec8b" />
          <Stop offset="50%" stopColor="#ffd700" />
          <Stop offset="75%" stopColor="#daa520" />
          <Stop offset="100%" stopColor="#b8860b" />
        </LinearGradient>
        <LinearGradient id="goldLight" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#fff8dc" />
          <Stop offset="50%" stopColor="#ffd700" />
          <Stop offset="100%" stopColor="#daa520" />
        </LinearGradient>
        <LinearGradient id="goldDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#daa520" />
          <Stop offset="100%" stopColor="#8b6914" />
        </LinearGradient>
        <LinearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <Stop offset="0%" stopColor="#ff4500" />
          <Stop offset="30%" stopColor="#ff6b35" />
          <Stop offset="60%" stopColor="#ffa500" />
          <Stop offset="85%" stopColor="#ffd700" />
          <Stop offset="100%" stopColor="#fffacd" />
        </LinearGradient>
        <LinearGradient id="flameInner" x1="0%" y1="100%" x2="0%" y2="0%">
          <Stop offset="0%" stopColor="#ffcc00" />
          <Stop offset="50%" stopColor="#fff8dc" />
          <Stop offset="100%" stopColor="#ffffff" />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="400" height="400" fill="url(#bgGrad)" />

      {/* Stars */}
      <Circle cx="45" cy="35" r="1.5" fill="white" opacity="0.8" />
      <Circle cx="90" cy="55" r="1" fill="white" opacity="0.5" />
      <Circle cx="130" cy="25" r="1.2" fill="white" opacity="0.6" />
      <Circle cx="270" cy="30" r="1.5" fill="white" opacity="0.7" />
      <Circle cx="310" cy="55" r="1" fill="white" opacity="0.5" />
      <Circle cx="355" cy="40" r="1.3" fill="white" opacity="0.8" />
      <Circle cx="375" cy="75" r="1" fill="white" opacity="0.4" />
      <Circle cx="25" cy="85" r="1.2" fill="white" opacity="0.6" />
      <Circle cx="60" cy="120" r="0.8" fill="white" opacity="0.4" />
      <Circle cx="340" cy="110" r="0.8" fill="white" opacity="0.4" />

      {/* Stepped base - three tiers like the Beis Hamikdash menorah */}
      <Rect x="90" y="365" width="220" height="18" rx="2" fill="url(#goldDark)" />
      <Rect x="105" y="352" width="190" height="16" rx="2" fill="url(#goldGrad)" />
      <Rect x="120" y="340" width="160" height="14" rx="2" fill="url(#goldLight)" />

      {/* Main central stem with decorative elements */}
      <Rect x="188" y="150" width="24" height="190" fill="url(#goldGrad)" />

      {/* Central stem decorative knobs (kaftorim) */}
      <Ellipse cx="200" cy="320" rx="20" ry="12" fill="url(#goldLight)" />
      <Ellipse cx="200" cy="290" rx="16" ry="9" fill="url(#goldGrad)" />
      <Ellipse cx="200" cy="260" rx="14" ry="8" fill="url(#goldLight)" />
      <Ellipse cx="200" cy="230" rx="12" ry="7" fill="url(#goldGrad)" />

      {/* Seven branches - proper curved branches */}
      {/* Outer left branch */}
      <Path
        d="M 188 290 C 140 290 70 250 70 150 L 70 95"
        stroke="url(#goldGrad)"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />
      {/* Middle left branch */}
      <Path
        d="M 188 260 C 150 260 110 230 110 150 L 110 115"
        stroke="url(#goldGrad)"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />
      {/* Inner left branch */}
      <Path
        d="M 188 230 C 160 230 150 200 150 150 L 150 135"
        stroke="url(#goldGrad)"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />

      {/* Outer right branch */}
      <Path
        d="M 212 290 C 260 290 330 250 330 150 L 330 95"
        stroke="url(#goldGrad)"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />
      {/* Middle right branch */}
      <Path
        d="M 212 260 C 250 260 290 230 290 150 L 290 115"
        stroke="url(#goldGrad)"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />
      {/* Inner right branch */}
      <Path
        d="M 212 230 C 240 230 250 200 250 150 L 250 135"
        stroke="url(#goldGrad)"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />

      {/* Central stem top */}
      <Rect x="188" y="75" width="24" height="80" fill="url(#goldGrad)" />

      {/* Oil cups - goblet shaped */}
      {/* Center cup */}
      <Path d="M 185 75 L 188 90 L 212 90 L 215 75 Q 200 65 185 75 Z" fill="url(#goldLight)" />
      {/* Left cups */}
      <Path d="M 55 95 L 58 110 L 82 110 L 85 95 Q 70 85 55 95 Z" fill="url(#goldLight)" />
      <Path d="M 95 115 L 98 130 L 122 130 L 125 115 Q 110 105 95 115 Z" fill="url(#goldLight)" />
      <Path d="M 135 135 L 138 150 L 162 150 L 165 135 Q 150 125 135 135 Z" fill="url(#goldLight)" />
      {/* Right cups */}
      <Path d="M 315 95 L 318 110 L 342 110 L 345 95 Q 330 85 315 95 Z" fill="url(#goldLight)" />
      <Path d="M 275 115 L 278 130 L 302 130 L 305 115 Q 290 105 275 115 Z" fill="url(#goldLight)" />
      <Path d="M 235 135 L 238 150 L 262 150 L 265 135 Q 250 125 235 135 Z" fill="url(#goldLight)" />

      {/* Flames - seven flames */}
      {/* Center flame */}
      <G transform="translate(200, 45)">
        <Ellipse cx="0" cy="15" rx="15" ry="20" fill="#ffd700" opacity="0.3" />
        <Path d="M 0 30 C -10 20 -8 5 0 -18 C 8 5 10 20 0 30 Z" fill="url(#flameGrad)" />
        <Path d="M 0 25 C -5 18 -4 8 0 -8 C 4 8 5 18 0 25 Z" fill="url(#flameInner)" />
      </G>

      {/* Left flames */}
      <G transform="translate(70, 65)">
        <Ellipse cx="0" cy="12" rx="12" ry="16" fill="#ffd700" opacity="0.25" />
        <Path d="M 0 25 C -8 17 -7 5 0 -14 C 7 5 8 17 0 25 Z" fill="url(#flameGrad)" />
        <Path d="M 0 20 C -4 14 -3 6 0 -6 C 3 6 4 14 0 20 Z" fill="url(#flameInner)" />
      </G>
      <G transform="translate(110, 85)">
        <Ellipse cx="0" cy="12" rx="12" ry="16" fill="#ffd700" opacity="0.25" />
        <Path d="M 0 25 C -8 17 -7 5 0 -14 C 7 5 8 17 0 25 Z" fill="url(#flameGrad)" />
        <Path d="M 0 20 C -4 14 -3 6 0 -6 C 3 6 4 14 0 20 Z" fill="url(#flameInner)" />
      </G>
      <G transform="translate(150, 105)">
        <Ellipse cx="0" cy="12" rx="12" ry="16" fill="#ffd700" opacity="0.25" />
        <Path d="M 0 25 C -8 17 -7 5 0 -14 C 7 5 8 17 0 25 Z" fill="url(#flameGrad)" />
        <Path d="M 0 20 C -4 14 -3 6 0 -6 C 3 6 4 14 0 20 Z" fill="url(#flameInner)" />
      </G>

      {/* Right flames */}
      <G transform="translate(330, 65)">
        <Ellipse cx="0" cy="12" rx="12" ry="16" fill="#ffd700" opacity="0.25" />
        <Path d="M 0 25 C -8 17 -7 5 0 -14 C 7 5 8 17 0 25 Z" fill="url(#flameGrad)" />
        <Path d="M 0 20 C -4 14 -3 6 0 -6 C 3 6 4 14 0 20 Z" fill="url(#flameInner)" />
      </G>
      <G transform="translate(290, 85)">
        <Ellipse cx="0" cy="12" rx="12" ry="16" fill="#ffd700" opacity="0.25" />
        <Path d="M 0 25 C -8 17 -7 5 0 -14 C 7 5 8 17 0 25 Z" fill="url(#flameGrad)" />
        <Path d="M 0 20 C -4 14 -3 6 0 -6 C 3 6 4 14 0 20 Z" fill="url(#flameInner)" />
      </G>
      <G transform="translate(250, 105)">
        <Ellipse cx="0" cy="12" rx="12" ry="16" fill="#ffd700" opacity="0.25" />
        <Path d="M 0 25 C -8 17 -7 5 0 -14 C 7 5 8 17 0 25 Z" fill="url(#flameGrad)" />
        <Path d="M 0 20 C -4 14 -3 6 0 -6 C 3 6 4 14 0 20 Z" fill="url(#flameInner)" />
      </G>

      {/* Decorative flowers on branches (perachim) */}
      <Circle cx="85" cy="220" r="8" fill="url(#goldLight)" />
      <Circle cx="115" cy="195" r="7" fill="url(#goldGrad)" />
      <Circle cx="145" cy="175" r="6" fill="url(#goldLight)" />
      <Circle cx="315" cy="220" r="8" fill="url(#goldLight)" />
      <Circle cx="285" cy="195" r="7" fill="url(#goldGrad)" />
      <Circle cx="255" cy="175" r="6" fill="url(#goldLight)" />

      {/* Glow effect from flames */}
      <Ellipse cx="200" cy="60" rx="100" ry="50" fill="#ffd700" opacity="0.08" />
      <Ellipse cx="200" cy="80" rx="150" ry="60" fill="#ff8c00" opacity="0.04" />
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
            borderColor: isSelected ? '#d97706' : piece.isPlaced ? '#f59e0b' : '#d1d5db',
            borderRadius: 4,
            overflow: 'hidden',
            backgroundColor: '#0a1628',
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
          <MenorahImage width={totalWidth} height={totalHeight} />
        </View>
        {piece.isPlaced && (
          <View style={{
            position: 'absolute',
            top: 2,
            right: 2,
            backgroundColor: '#f59e0b',
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

  const emojis = ['✨', '🕎', '⭐', '🎊', '🎉', '💫', '🔥'];
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
          <Text style={{ fontSize: 72 }}>🕎</Text>
        </Animated.View>

        <Text className={`font-bold text-slate-800 mt-6 ${isWeb ? 'text-4xl' : 'text-3xl'}`}>
          Mazal Tov!
        </Text>
        <Text className="text-slate-500 text-center mt-3 text-base">
          You completed the Menorah puzzle!
        </Text>

        <Animated.View entering={FadeIn.duration(400).delay(500)} className="mt-8 flex-row" style={{ gap: 16 }}>
          <View className="items-center bg-amber-50 rounded-2xl py-4 px-6">
            <Text className="text-3xl font-bold text-amber-600">{formatTime(elapsedTime)}</Text>
            <Text className="text-xs text-amber-700 mt-1 uppercase tracking-wide font-semibold">
              Time
            </Text>
          </View>
          <View className="items-center bg-sky-50 rounded-2xl py-4 px-6">
            <Text className="text-3xl font-bold text-sky-600">{moves}</Text>
            <Text className="text-xs text-sky-700 mt-1 uppercase tracking-wide font-semibold">
              Moves
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(800)} style={{ width: '100%' }}>
          <Pressable
            onPress={onPlayAgain}
            style={{
              backgroundColor: '#d97706',
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 32,
              marginTop: 32,
              shadowColor: '#d97706',
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

export default function JigsawMenorahGame() {
  const isWeb = Platform.OS === 'web';
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // 4x4 grid for intermediate difficulty
  const GRID_ROWS = 4;
  const GRID_COLS = 4;

  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const puzzleSize = useMemo(() => {
    const padding = isWeb ? 100 : 40;
    const headerHeight = isWeb ? 140 : 180;
    const maxWidth = Math.min(screenWidth - padding, 500);
    const maxHeight = screenHeight - headerHeight - padding;

    // Square puzzle for menorah
    const size = Math.min(maxWidth, maxHeight);

    return { width: size, height: size };
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
    setGameKey(k => k + 1);
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
      <SafeAreaView className="flex-1 bg-amber-50">
        <StatusBar style="dark" />

        {/* Header */}
        <View className="bg-white border-b border-slate-200">
          <View className="flex-row items-center justify-between px-4 py-3">
            <AnimatedIconButton
              onPress={() => router.back()}
              iconName="arrow-left"
              iconColor="#64748b"
              bgColor="#f1f5f9"
              activeBgColor="#e2e8f0"
            />

            <View className="items-center flex-1 mx-4">
              <Text className={`font-bold text-slate-800 ${isWeb ? 'text-xl' : 'text-lg'}`}>
                Menorah Puzzle
              </Text>
              <Text className="text-slate-500 text-xs mt-0.5">The Golden Menorah</Text>
            </View>

            <AnimatedIconButton
              onPress={initializeGame}
              iconName="refresh"
              iconColor="#d97706"
              bgColor="#fffbeb"
              activeBgColor="#fef3c7"
              spinOnPress
            />
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
              <Text className={`font-bold text-amber-600 ${isWeb ? 'text-xl' : 'text-lg'} mt-1`}>
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
              backgroundColor: '#1e293b',
              borderRadius: 12,
              borderWidth: 3,
              borderColor: '#d97706',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Grid lines */}
            {Array.from({ length: GRID_ROWS - 1 }).map((_, i) => (
              <View
                key={`h-${i}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: (i + 1) * pieceHeight,
                  height: 1,
                  backgroundColor: '#f59e0b',
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
                  backgroundColor: '#f59e0b',
                  opacity: 0.3,
                }}
              />
            ))}

            {/* Puzzle pieces */}
            {pieces.map(piece => (
              <PieceComponent
                key={`${gameKey}-${piece.id}`}
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
                gameKey={gameKey}
              />
            ))}
          </View>

          {/* Instructions */}
          <Text className="text-slate-500 text-sm mt-4 text-center px-8">
            {isWeb
              ? 'Drag pieces to swap them, or click two pieces to swap their positions'
              : 'Tap two pieces to swap them, or drag pieces to move them'}
          </Text>
        </View>

        {/* Victory Modal */}
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
