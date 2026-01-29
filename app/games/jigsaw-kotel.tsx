import { SEO } from '@/components/SEO';
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
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useIsMobileLayout } from '../../hooks/useDeviceType';

// Kotel illustration - a stylized Western Wall scene
function KotelImage({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#87CEEB" />
          <Stop offset="100%" stopColor="#E0F4FF" />
        </LinearGradient>
        <LinearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#F5EBD7" />
          <Stop offset="50%" stopColor="#E8DABA" />
          <Stop offset="100%" stopColor="#D5C49A" />
        </LinearGradient>
        <LinearGradient id="plazaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#E8DCC8" />
          <Stop offset="100%" stopColor="#D4C4A8" />
        </LinearGradient>
      </Defs>

      {/* Sky - full background */}
      <Rect x="0" y="0" width="400" height="300" fill="url(#skyGrad)" />

      {/* The Western Wall - large stone wall filling most of the image */}
      <Rect x="0" y="50" width="400" height="220" fill="url(#wallGrad)" />

      {/* Horizontal mortar lines between stone rows */}
      <G stroke="#C4B48A" strokeWidth="2">
        <Path d="M 0 80 L 400 80" />
        <Path d="M 0 115 L 400 115" />
        <Path d="M 0 150 L 400 150" />
        <Path d="M 0 185 L 400 185" />
        <Path d="M 0 220 L 400 220" />
        <Path d="M 0 250 L 400 250" />
      </G>

      {/* Vertical mortar lines - staggered like real stones */}
      {/* Row 1 (top) */}
      <G stroke="#C4B48A" strokeWidth="1.5">
        <Path d="M 70 50 L 70 80" />
        <Path d="M 150 50 L 150 80" />
        <Path d="M 240 50 L 240 80" />
        <Path d="M 320 50 L 320 80" />
      </G>
      {/* Row 2 */}
      <G stroke="#C4B48A" strokeWidth="1.5">
        <Path d="M 40 80 L 40 115" />
        <Path d="M 110 80 L 110 115" />
        <Path d="M 190 80 L 190 115" />
        <Path d="M 280 80 L 280 115" />
        <Path d="M 360 80 L 360 115" />
      </G>
      {/* Row 3 */}
      <G stroke="#C4B48A" strokeWidth="1.5">
        <Path d="M 60 115 L 60 150" />
        <Path d="M 140 115 L 140 150" />
        <Path d="M 220 115 L 220 150" />
        <Path d="M 310 115 L 310 150" />
      </G>
      {/* Row 4 */}
      <G stroke="#C4B48A" strokeWidth="1.5">
        <Path d="M 50 150 L 50 185" />
        <Path d="M 130 150 L 130 185" />
        <Path d="M 200 150 L 200 185" />
        <Path d="M 290 150 L 290 185" />
        <Path d="M 370 150 L 370 185" />
      </G>
      {/* Row 5 */}
      <G stroke="#C4B48A" strokeWidth="1.5">
        <Path d="M 80 185 L 80 220" />
        <Path d="M 170 185 L 170 220" />
        <Path d="M 250 185 L 250 220" />
        <Path d="M 340 185 L 340 220" />
      </G>
      {/* Row 6 (bottom) */}
      <G stroke="#C4B48A" strokeWidth="1.5">
        <Path d="M 55 220 L 55 250" />
        <Path d="M 140 220 L 140 250" />
        <Path d="M 230 220 L 230 250" />
        <Path d="M 310 220 L 310 250" />
      </G>

      {/* Stone texture - subtle shadows on some stones */}
      <G fill="#C9B890" opacity="0.3">
        <Rect x="0" y="80" width="40" height="35" />
        <Rect x="150" y="50" width="90" height="30" />
        <Rect x="110" y="115" width="80" height="35" />
        <Rect x="290" y="150" width="80" height="35" />
        <Rect x="80" y="185" width="90" height="35" />
        <Rect x="230" y="220" width="80" height="30" />
      </G>

      {/* Kvitlach (prayer notes) - small white papers in the cracks */}
      <G fill="#FFFFFF">
        <Rect x="69" y="75" width="2" height="8" />
        <Rect x="149" y="110" width="2.5" height="7" />
        <Rect x="219" y="145" width="2" height="8" />
        <Rect x="129" y="180" width="2.5" height="7" />
        <Rect x="309" y="145" width="2" height="8" />
        <Rect x="79" y="215" width="2" height="7" />
        <Rect x="249" y="215" width="2.5" height="8" />
        <Rect x="189" y="110" width="2" height="6" />
        <Rect x="59" y="145" width="2" height="7" />
        <Rect x="339" y="180" width="2.5" height="8" />
      </G>

      {/* Plaza floor */}
      <Rect x="0" y="270" width="400" height="30" fill="url(#plazaGrad)" />

      {/* Mechitza hint - subtle line */}
      <Path d="M 0 270 L 400 270" stroke="#B8A888" strokeWidth="2" />

      {/* People praying at the wall - simple silhouettes */}
      {/* Person 1 - standing */}
      <G fill="#1C2833">
        <Rect x="45" y="235" width="10" height="28" rx="2" />
        <Circle cx="50" cy="228" r="7" />
      </G>

      {/* Person 2 - standing */}
      <G fill="#2C3E50">
        <Rect x="85" y="238" width="9" height="25" rx="2" />
        <Circle cx="89.5" cy="232" r="6" />
      </G>

      {/* Person 3 - bowing */}
      <G fill="#1C2833">
        <Path d="M 135 265 Q 140 250 145 240" stroke="#1C2833" strokeWidth="9" strokeLinecap="round" fill="none" />
        <Circle cx="148" cy="235" r="6" />
      </G>

      {/* Person 4 - standing */}
      <G fill="#2C3E50">
        <Rect x="180" y="236" width="10" height="27" rx="2" />
        <Circle cx="185" cy="229" r="7" />
      </G>

      {/* Person 5 - standing */}
      <G fill="#1C2833">
        <Rect x="225" y="240" width="8" height="23" rx="2" />
        <Circle cx="229" cy="234" r="5.5" />
      </G>

      {/* Person 6 - standing */}
      <G fill="#2C3E50">
        <Rect x="270" y="237" width="9" height="26" rx="2" />
        <Circle cx="274.5" cy="230" r="6.5" />
      </G>

      {/* Person 7 - standing */}
      <G fill="#1C2833">
        <Rect x="315" y="239" width="8" height="24" rx="2" />
        <Circle cx="319" cy="233" r="5.5" />
      </G>

      {/* Person 8 - standing far right */}
      <G fill="#2C3E50">
        <Rect x="355" y="236" width="10" height="27" rx="2" />
        <Circle cx="360" cy="229" r="7" />
      </G>

      {/* Sun in sky */}
      <Circle cx="350" cy="30" r="18" fill="#FFE87C" />
      <Circle cx="350" cy="30" r="14" fill="#FFF2A8" />

      {/* Subtle clouds */}
      <G fill="#FFFFFF" opacity="0.6">
        <Path d="M 30 20 Q 45 15 60 20 Q 75 25 90 20 Q 100 18 110 22 Q 95 28 80 25 Q 60 30 40 25 Q 25 28 30 20" />
        <Path d="M 150 35 Q 170 30 190 35 Q 205 38 220 33 Q 200 42 180 40 Q 160 43 150 35" />
      </G>

      {/* Birds */}
      <G fill="none" stroke="#555555" strokeWidth="1.5" strokeLinecap="round">
        <Path d="M 70 45 Q 75 40 80 45 Q 85 40 90 45" />
        <Path d="M 120 30 Q 124 26 128 30 Q 132 26 136 30" />
      </G>
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
    // Calculate which grid cell this position corresponds to
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

      // Calculate final position
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

  // Calculate the clip region for this piece
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
            borderColor: isSelected ? '#059669' : piece.isPlaced ? '#10b981' : '#d1d5db',
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
          <KotelImage width={totalWidth} height={totalHeight} />
        </View>
        {piece.isPlaced && (
          <View style={{
            position: 'absolute',
            top: 2,
            right: 2,
            backgroundColor: '#10b981',
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

// Confetti particle
function ConfettiParticle({ index }: { index: number }) {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const emojis = ['✨', '🕎', '⭐', '🎊', '🎉', '💫', '✡️'];
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

// Trophy SVG component
function TrophyIcon({ size = 80 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFD700" />
          <Stop offset="50%" stopColor="#FFC125" />
          <Stop offset="100%" stopColor="#DAA520" />
        </LinearGradient>
        <LinearGradient id="trophyShine" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FFFACD" />
          <Stop offset="100%" stopColor="#FFD700" />
        </LinearGradient>
        <LinearGradient id="baseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#8B4513" />
          <Stop offset="100%" stopColor="#654321" />
        </LinearGradient>
      </Defs>

      {/* Trophy cup */}
      <Path
        d="M 30 20 L 30 45 Q 30 60 50 65 Q 70 60 70 45 L 70 20 Z"
        fill="url(#trophyGold)"
      />

      {/* Inner cup shine */}
      <Path
        d="M 35 22 L 35 42 Q 35 52 50 56 Q 55 54 55 42 L 55 22 Z"
        fill="url(#trophyShine)"
        opacity="0.5"
      />

      {/* Left handle */}
      <Path
        d="M 30 25 Q 15 25 15 35 Q 15 48 30 48"
        stroke="url(#trophyGold)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Right handle */}
      <Path
        d="M 70 25 Q 85 25 85 35 Q 85 48 70 48"
        stroke="url(#trophyGold)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Stem */}
      <Rect x="45" y="65" width="10" height="12" fill="url(#trophyGold)" />

      {/* Base top */}
      <Rect x="35" y="77" width="30" height="5" rx="2" fill="url(#trophyGold)" />

      {/* Base bottom */}
      <Rect x="30" y="82" width="40" height="8" rx="2" fill="url(#baseGrad)" />

      {/* Star on trophy */}
      <Path
        d="M 50 30 L 52 36 L 58 36 L 53 40 L 55 46 L 50 42 L 45 46 L 47 40 L 42 36 L 48 36 Z"
        fill="#FFFACD"
      />

      {/* Sparkles */}
      <Circle cx="25" cy="15" r="2" fill="#FFD700" opacity="0.8" />
      <Circle cx="75" cy="15" r="1.5" fill="#FFD700" opacity="0.6" />
      <Circle cx="20" cy="55" r="1.5" fill="#FFD700" opacity="0.7" />
      <Circle cx="80" cy="55" r="2" fill="#FFD700" opacity="0.8" />
    </Svg>
  );
}

// Victory banner - slides up from bottom, doesn't cover the puzzle
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
  const playButtonScale = useSharedValue(1);
  const homeButtonScale = useSharedValue(1);

  useEffect(() => {
    trophyScale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 100 }));
  }, []);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }],
  }));

  const playButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playButtonScale.value }],
  }));

  const homeButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: homeButtonScale.value }],
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
        left: 0,
        right: 0,
        bottom: 0,
      }}
      pointerEvents="box-none"
    >
      <Confetti />

      <Animated.View
        entering={FadeIn.duration(300)}
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 20,
          paddingBottom: isWeb ? 32 : 40,
          paddingHorizontal: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 10,
        }}
      >
        {/* Top row: Trophy + Title + Stats */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left: Trophy and title */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Animated.View style={trophyStyle}>
              <TrophyIcon size={50} />
            </Animated.View>
            <View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '800',
                  color: '#1e293b',
                }}
              >
                Mazal Tov!
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: '#64748b',
                  marginTop: 2,
                }}
              >
                Puzzle Complete
              </Text>
            </View>
          </View>

          {/* Right: Stats */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#f0fdf4',
                borderRadius: 12,
                paddingVertical: 8,
                paddingHorizontal: 12,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#16a34a' }}>
                {formatTime(elapsedTime)}
              </Text>
              <Text style={{ fontSize: 9, color: '#15803d', fontWeight: '600', textTransform: 'uppercase' }}>
                Time
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#eff6ff',
                borderRadius: 12,
                paddingVertical: 8,
                paddingHorizontal: 12,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#2563eb' }}>
                {moves}
              </Text>
              <Text style={{ fontSize: 9, color: '#1d4ed8', fontWeight: '600', textTransform: 'uppercase' }}>
                Moves
              </Text>
            </View>
          </View>
        </View>

        {/* Buttons row */}
        <View style={{ flexDirection: 'row', marginTop: 16, gap: 12 }}>
          <Pressable
            onPress={onPlayAgain}
            onPressIn={() => {
              playButtonScale.value = withSpring(0.95, { damping: 15 });
            }}
            onPressOut={() => {
              playButtonScale.value = withSpring(1, { damping: 15 });
            }}
            style={{ flex: 1 }}
          >
            <Animated.View
              style={[
                playButtonStyle,
                {
                  backgroundColor: '#059669',
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: 'center',
                },
              ]}
            >
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>
                Play Again
              </Text>
            </Animated.View>
          </Pressable>

          <Pressable
            onPress={onBackToHome}
            onPressIn={() => {
              homeButtonScale.value = withSpring(0.95, { damping: 15 });
            }}
            onPressOut={() => {
              homeButtonScale.value = withSpring(1, { damping: 15 });
            }}
            style={{ flex: 1 }}
          >
            <Animated.View
              style={[
                homeButtonStyle,
                {
                  backgroundColor: '#f1f5f9',
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: 'center',
                },
              ]}
            >
              <Text style={{ color: '#475569', fontWeight: '600', fontSize: 15 }}>
                Back to Home
              </Text>
            </Animated.View>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

export default function JigsawKotelGame() {
  const isWeb = Platform.OS === 'web';
  const { isMobile } = useIsMobileLayout();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // SEO for this game page
  const seoConfig = {
    title: 'Kosel Jigsaw Puzzle - Fun Jewish Game',
    description: 'Piece together a beautiful image of the Western Wall (Kotel) in this fun jigsaw puzzle game. A fun Jewish educational game for ages 6+.',
    keywords: 'Kotel puzzle, Western Wall game, Jewish jigsaw puzzle, Eretz Yisroel games, Jerusalem puzzle, kosher games for kids',
    url: '/games/jigsaw-kotel',
    type: 'game' as const,
    gameData: {
      name: 'Kosel Jigsaw Puzzle',
      description: 'Piece together a beautiful image of the Western Wall',
      gameType: 'Jigsaw Puzzle',
      ageRange: '6+',
      difficulty: 'beginner',
    },
  };

  const GRID_ROWS = 3;
  const GRID_COLS = 4;

  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showVictoryScreen, setShowVictoryScreen] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Calculate puzzle dimensions - use isMobile for layout decisions
  const puzzleSize = useMemo(() => {
    const padding = isMobile ? 40 : 100;
    const headerHeight = isMobile ? 180 : 140;
    const maxWidth = Math.min(screenWidth - padding, 600);
    const maxHeight = screenHeight - headerHeight - padding;

    // Maintain 4:3 aspect ratio for the puzzle
    const aspectRatio = GRID_COLS / GRID_ROWS;
    let width = maxWidth;
    let height = width / aspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return { width, height };
  }, [screenWidth, screenHeight, isMobile]);

  const pieceWidth = puzzleSize.width / GRID_COLS;
  const pieceHeight = puzzleSize.height / GRID_ROWS;

  const boardOffset = useMemo(() => ({
    x: (screenWidth - puzzleSize.width) / 2,
    y: 0,
  }), [screenWidth, puzzleSize.width]);

  const initializeGame = useCallback(() => {
    // Create pieces in shuffled positions
    const newPieces: PuzzlePiece[] = [];
    const positions: { row: number; col: number }[] = [];

    // Generate all positions
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        positions.push({ row, col });
      }
    }

    // Shuffle positions
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // Create pieces with shuffled positions
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

    // Check if any pieces are already in correct position
    newPieces.forEach(piece => {
      if (piece.currentRow === piece.correctRow && piece.currentCol === piece.correctCol) {
        piece.isPlaced = true;
      }
    });

    setPieces(newPieces);
    setSelectedPiece(null);
    setMoves(0);
    setGameComplete(false);
    setShowVictoryScreen(false);
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
      // Swap pieces
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

    // Find if there's a piece at the target location
    const targetPiece = pieces.find(p => p.currentRow === targetRow && p.currentCol === targetCol && p.id !== pieceId);

    if (targetPiece && !targetPiece.isPlaced) {
      // Swap with target piece
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

  // Check for game completion
  useEffect(() => {
    if (pieces.length > 0 && pieces.every(p => p.isPlaced) && !gameComplete) {
      setGameComplete(true);
      // Delay showing victory screen so user can see completed puzzle
      setTimeout(() => {
        setShowVictoryScreen(true);
      }, 1500);
    }
  }, [pieces, gameComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const placedCount = pieces.filter(p => p.isPlaced).length;
  const totalPieces = GRID_ROWS * GRID_COLS;

  // Button animation values
  const backButtonScale = useSharedValue(1);
  const backButtonBg = useSharedValue(0);
  const refreshButtonScale = useSharedValue(1);
  const refreshButtonBg = useSharedValue(0);
  const refreshRotation = useSharedValue(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    refreshRotation.value = withSequence(
      withTiming(360, { duration: 500, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 0 })
    );
    setTimeout(() => {
      initializeGame();
      setIsRefreshing(false);
    }, 300);
  }, [initializeGame, isRefreshing]);

  // Back button handlers
  const handleBackPressIn = useCallback(() => {
    backButtonScale.value = withSpring(0.9, { damping: 15 });
  }, []);
  const handleBackPressOut = useCallback(() => {
    backButtonScale.value = withSpring(1, { damping: 15 });
  }, []);
  const handleBackHoverIn = useCallback(() => {
    backButtonScale.value = withSpring(1.08, { damping: 15 });
    backButtonBg.value = withTiming(1, { duration: 150 });
  }, []);
  const handleBackHoverOut = useCallback(() => {
    backButtonScale.value = withSpring(1, { damping: 15 });
    backButtonBg.value = withTiming(0, { duration: 150 });
  }, []);

  // Refresh button handlers
  const handleRefreshPressIn = useCallback(() => {
    refreshButtonScale.value = withSpring(0.9, { damping: 15 });
  }, []);
  const handleRefreshPressOut = useCallback(() => {
    refreshButtonScale.value = withSpring(1, { damping: 15 });
  }, []);
  const handleRefreshHoverIn = useCallback(() => {
    refreshButtonScale.value = withSpring(1.08, { damping: 15 });
    refreshButtonBg.value = withTiming(1, { duration: 150 });
  }, []);
  const handleRefreshHoverOut = useCallback(() => {
    refreshButtonScale.value = withSpring(1, { damping: 15 });
    refreshButtonBg.value = withTiming(0, { duration: 150 });
  }, []);

  const backButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backButtonScale.value }],
    backgroundColor: backButtonBg.value === 1 ? '#e2e8f0' : '#f1f5f9',
  }));

  const refreshButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: refreshButtonScale.value },
      { rotate: `${refreshRotation.value}deg` },
    ],
    backgroundColor: refreshButtonBg.value === 1 ? '#d1fae5' : '#ecfdf5',
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SEO {...seoConfig} />
      <SafeAreaView className="flex-1 bg-emerald-50">
        <StatusBar style="dark" />

        {/* Header */}
        <View className="bg-white border-b border-slate-200">
          <View className="flex-row items-center justify-between px-4 py-3">
            <Pressable
              onPress={() => router.back()}
              onPressIn={handleBackPressIn}
              onPressOut={handleBackPressOut}
              onHoverIn={isWeb ? handleBackHoverIn : undefined}
              onHoverOut={isWeb ? handleBackHoverOut : undefined}
              style={{ width: 40, height: 40 }}
            >
              <Animated.View
                style={[
                  backButtonStyle,
                  {
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
              >
                <FontAwesome name="arrow-left" size={18} color="#64748b" />
              </Animated.View>
            </Pressable>

            <View className="items-center flex-1 mx-4">
              <Text className={`font-bold text-slate-800 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                Kosel Puzzle
              </Text>
            </View>

            <Pressable
              onPress={handleRefresh}
              onPressIn={handleRefreshPressIn}
              onPressOut={handleRefreshPressOut}
              onHoverIn={isWeb ? handleRefreshHoverIn : undefined}
              onHoverOut={isWeb ? handleRefreshHoverOut : undefined}
              style={{ width: 40, height: 40 }}
            >
              <Animated.View
                style={[
                  refreshButtonStyle,
                  {
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
              >
                <FontAwesome name="refresh" size={18} color="#059669" />
              </Animated.View>
            </Pressable>
          </View>

          {/* Stats Bar */}
          <View
            className="flex-row justify-center py-3 bg-slate-50 border-t border-slate-100"
            style={{ gap: isMobile ? 24 : 48 }}
          >
            <View className="items-center">
              <Text className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Time</Text>
              <Text className={`font-bold text-slate-800 ${isMobile ? 'text-lg' : 'text-xl'} mt-1`}>
                {formatTime(elapsedTime)}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Moves</Text>
              <Text className={`font-bold text-slate-800 ${isMobile ? 'text-lg' : 'text-xl'} mt-1`}>
                {moves}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Placed</Text>
              <Text className={`font-bold text-emerald-600 ${isMobile ? 'text-lg' : 'text-xl'} mt-1`}>
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
              backgroundColor: '#e2e8f0',
              borderRadius: 12,
              borderWidth: 3,
              borderColor: '#cbd5e1',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Grid lines for visual reference */}
            {Array.from({ length: GRID_ROWS - 1 }).map((_, i) => (
              <View
                key={`h-${i}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: (i + 1) * pieceHeight,
                  height: 1,
                  backgroundColor: '#94a3b8',
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
                  backgroundColor: '#94a3b8',
                  opacity: 0.3,
                }}
              />
            ))}

            {/* Puzzle pieces */}
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
                gameKey={gameKey}
              />
            ))}
          </View>

          {/* Instructions */}
          <Text className="text-slate-500 text-sm mt-4 text-center px-8">
            {isWeb
              ? 'Drag pieces to swap them'
              : 'Drag pieces to swap them'
            }
          </Text>
        </View>

        {/* Victory Modal */}
        {showVictoryScreen && (
          <VictoryScreen
            elapsedTime={elapsedTime}
            moves={moves}
            onPlayAgain={() => {
              setShowVictoryScreen(false);
              initializeGame();
            }}
            onBackToHome={() => router.back()}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
