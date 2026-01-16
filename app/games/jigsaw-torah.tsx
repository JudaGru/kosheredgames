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

// Torah illustration - beautiful Torah scroll with crown and decorations
function TorahImage({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="torahBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#f0fdfa" />
          <Stop offset="50%" stopColor="#ccfbf1" />
          <Stop offset="100%" stopColor="#99f6e4" />
        </LinearGradient>
        <LinearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#78350f" />
          <Stop offset="50%" stopColor="#92400e" />
          <Stop offset="100%" stopColor="#78350f" />
        </LinearGradient>
        <LinearGradient id="crownGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#fcd34d" />
          <Stop offset="100%" stopColor="#b45309" />
        </LinearGradient>
        <LinearGradient id="parchment" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#fefce8" />
          <Stop offset="100%" stopColor="#fef3c7" />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="400" height="300" fill="url(#torahBg)" />

      {/* Decorative pattern */}
      <Circle cx="50" cy="50" r="30" fill="#14b8a6" opacity="0.1" />
      <Circle cx="350" cy="250" r="40" fill="#14b8a6" opacity="0.1" />
      <Circle cx="380" cy="60" r="20" fill="#0d9488" opacity="0.15" />
      <Circle cx="20" cy="240" r="25" fill="#0d9488" opacity="0.12" />

      {/* Rays of light behind Torah */}
      <G transform="translate(200, 150)">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <Path
            key={i}
            d={`M 0 0 L ${Math.cos(angle * Math.PI / 180) * 140} ${Math.sin(angle * Math.PI / 180) * 140}`}
            stroke="#fcd34d"
            strokeWidth="2"
            opacity="0.2"
          />
        ))}
      </G>

      {/* Torah scroll - main structure */}
      <G transform="translate(100, 60)">
        {/* Left Etz Chaim (Tree of Life) */}
        <G transform="translate(0, 0)">
          {/* Main pole */}
          <Rect x="0" y="20" width="25" height="160" rx="12" fill="url(#woodGrad)" />

          {/* Top finial */}
          <Circle cx="12.5" cy="20" r="15" fill="url(#crownGold)" />
          <Circle cx="12.5" cy="20" r="10" fill="#fcd34d" />
          <Circle cx="12.5" cy="20" r="5" fill="#0d9488" />

          {/* Bottom finial */}
          <Circle cx="12.5" cy="180" r="15" fill="url(#crownGold)" />
          <Circle cx="12.5" cy="180" r="10" fill="#fcd34d" />

          {/* Decorative rings */}
          <Ellipse cx="12.5" cy="50" rx="14" ry="5" fill="#d4af37" />
          <Ellipse cx="12.5" cy="150" rx="14" ry="5" fill="#d4af37" />
        </G>

        {/* Right Etz Chaim */}
        <G transform="translate(175, 0)">
          {/* Main pole */}
          <Rect x="0" y="20" width="25" height="160" rx="12" fill="url(#woodGrad)" />

          {/* Top finial */}
          <Circle cx="12.5" cy="20" r="15" fill="url(#crownGold)" />
          <Circle cx="12.5" cy="20" r="10" fill="#fcd34d" />
          <Circle cx="12.5" cy="20" r="5" fill="#0d9488" />

          {/* Bottom finial */}
          <Circle cx="12.5" cy="180" r="15" fill="url(#crownGold)" />
          <Circle cx="12.5" cy="180" r="10" fill="#fcd34d" />

          {/* Decorative rings */}
          <Ellipse cx="12.5" cy="50" rx="14" ry="5" fill="#d4af37" />
          <Ellipse cx="12.5" cy="150" rx="14" ry="5" fill="#d4af37" />
        </G>

        {/* Parchment/Klaf */}
        <Rect x="20" y="35" width="160" height="130" fill="url(#parchment)" />

        {/* Hebrew text on parchment */}
        <G transform="translate(30, 50)">
          <SvgText x="70" y="10" fontSize="14" fill="#78350f" textAnchor="middle" fontWeight="bold">בראשית</SvgText>
          <Rect x="20" y="20" width="100" height="3" rx="1" fill="#92400e" opacity="0.4" />
          <Rect x="25" y="30" width="90" height="3" rx="1" fill="#92400e" opacity="0.4" />
          <Rect x="20" y="40" width="100" height="3" rx="1" fill="#92400e" opacity="0.4" />
          <Rect x="30" y="50" width="80" height="3" rx="1" fill="#92400e" opacity="0.4" />
          <Rect x="20" y="60" width="100" height="3" rx="1" fill="#92400e" opacity="0.4" />
          <Rect x="25" y="70" width="90" height="3" rx="1" fill="#92400e" opacity="0.4" />
          <Rect x="20" y="80" width="100" height="3" rx="1" fill="#92400e" opacity="0.4" />
          <Rect x="35" y="90" width="70" height="3" rx="1" fill="#92400e" opacity="0.4" />
          <Rect x="20" y="100" width="100" height="3" rx="1" fill="#92400e" opacity="0.4" />
        </G>

        {/* Torah Crown (Keter Torah) */}
        <G transform="translate(55, -45)">
          {/* Crown base */}
          <Path d="M 0 50 L 90 50 L 85 35 L 75 45 L 65 25 L 55 40 L 45 20 L 35 40 L 25 25 L 15 45 L 5 35 Z" fill="url(#crownGold)" />

          {/* Crown top decoration */}
          <Circle cx="45" cy="15" r="8" fill="#fcd34d" />
          <Circle cx="45" cy="15" r="5" fill="#dc2626" />

          {/* Side jewels */}
          <Circle cx="20" cy="30" r="5" fill="#3b82f6" />
          <Circle cx="70" cy="30" r="5" fill="#22c55e" />

          {/* Crown rim */}
          <Rect x="5" y="45" width="80" height="8" rx="2" fill="#b45309" />
        </G>

        {/* Yad (pointer) */}
        <G transform="translate(70, 170)">
          <Rect x="0" y="0" width="60" height="8" rx="3" fill="#c0c0c0" />
          <Path d="M 60 4 L 75 4 L 75 0 L 85 4 L 75 8 L 75 4" fill="#c0c0c0" />
          <Circle cx="5" cy="4" r="6" fill="#d4d4d4" />
          <Rect x="5" y="-15" width="3" height="15" fill="#a3a3a3" />
        </G>
      </G>

      {/* Tablets (Luchos) in corner */}
      <G transform="translate(320, 180)">
        <Rect x="0" y="0" width="35" height="50" rx="5" fill="#94a3b8" />
        <Rect x="38" y="0" width="35" height="50" rx="5" fill="#94a3b8" />
        {/* Text lines */}
        <Rect x="6" y="10" width="23" height="3" fill="#475569" rx="1" />
        <Rect x="6" y="18" width="23" height="3" fill="#475569" rx="1" />
        <Rect x="6" y="26" width="23" height="3" fill="#475569" rx="1" />
        <Rect x="6" y="34" width="23" height="3" fill="#475569" rx="1" />
        <Rect x="6" y="42" width="23" height="3" fill="#475569" rx="1" />
        <Rect x="44" y="10" width="23" height="3" fill="#475569" rx="1" />
        <Rect x="44" y="18" width="23" height="3" fill="#475569" rx="1" />
        <Rect x="44" y="26" width="23" height="3" fill="#475569" rx="1" />
        <Rect x="44" y="34" width="23" height="3" fill="#475569" rx="1" />
        <Rect x="44" y="42" width="23" height="3" fill="#475569" rx="1" />
      </G>

      {/* Star of David */}
      <G transform="translate(30, 100)">
        <Path d="M 25 5 L 45 40 L 5 40 Z" fill="none" stroke="#0d9488" strokeWidth="3" />
        <Path d="M 25 45 L 5 10 L 45 10 Z" fill="none" stroke="#0d9488" strokeWidth="3" />
      </G>

      {/* Decorative Stars */}
      <Circle cx="60" cy="30" r="3" fill="#fcd34d" opacity="0.8" />
      <Circle cx="340" cy="50" r="4" fill="#fcd34d" opacity="0.7" />
      <Circle cx="370" cy="150" r="3" fill="#fcd34d" opacity="0.6" />

      {/* Bottom banner */}
      <G transform="translate(100, 255)">
        <Path d="M 0 0 L 200 0 L 195 15 L 200 30 L 0 30 L 5 15 Z" fill="#0d9488" />
        <SvgText x="100" y="22" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">עץ חיים היא</SvgText>
      </G>

      {/* Sparkles */}
      <Circle cx="150" cy="45" r="2" fill="white" opacity="0.9" />
      <Circle cx="250" cy="55" r="2" fill="white" opacity="0.8" />
      <Circle cx="180" cy="240" r="2" fill="white" opacity="0.7" />
    </Svg>
  );
}

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
            borderColor: isSelected ? '#0d9488' : piece.isPlaced ? '#14b8a6' : '#d1d5db',
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
          <TorahImage width={totalWidth} height={totalHeight} />
        </View>
        {piece.isPlaced && (
          <View style={{
            position: 'absolute',
            top: 2,
            right: 2,
            backgroundColor: '#14b8a6',
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

  const emojis = ['✨', '📜', '👑', '✡️', '⭐', '💫', '🕊️'];
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
                Kol HaKavod!
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
                backgroundColor: '#f0fdfa',
                borderRadius: 12,
                paddingVertical: 8,
                paddingHorizontal: 12,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#0d9488' }}>
                {formatTime(elapsedTime)}
              </Text>
              <Text style={{ fontSize: 9, color: '#0f766e', fontWeight: '600', textTransform: 'uppercase' }}>
                Time
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#ecfdf5',
                borderRadius: 12,
                paddingVertical: 8,
                paddingHorizontal: 12,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#059669' }}>
                {moves}
              </Text>
              <Text style={{ fontSize: 9, color: '#047857', fontWeight: '600', textTransform: 'uppercase' }}>
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
                  backgroundColor: '#0d9488',
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

export default function JigsawTorahGame() {
  const isWeb = Platform.OS === 'web';
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const GRID_ROWS = 3;
  const GRID_COLS = 4;

  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showVictoryScreen, setShowVictoryScreen] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-teal-50">
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
                Torah Puzzle
              </Text>
              <Text className="text-slate-500 text-xs mt-0.5">Sefer Torah</Text>
            </View>

            <AnimatedIconButton
              onPress={initializeGame}
              iconName="refresh"
              iconColor="#0d9488"
              bgColor="#f0fdfa"
              activeBgColor="#ccfbf1"
              spinOnPress
            />
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
              <Text className={`font-bold text-teal-600 ${isWeb ? 'text-xl' : 'text-lg'} mt-1`}>
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
              backgroundColor: '#f0fdfa',
              borderRadius: 12,
              borderWidth: 3,
              borderColor: '#99f6e4',
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
                  backgroundColor: '#14b8a6',
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
                  backgroundColor: '#14b8a6',
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
              ? 'Drag pieces to swap them'
              : 'Drag pieces to swap them'}
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
