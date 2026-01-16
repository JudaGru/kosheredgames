import { View, Platform, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

interface LoaderProps {
  /** If true, renders as an overlay. If false, renders as a full-screen page. */
  overlay?: boolean;
  /** Controls visibility when used as overlay. Ignored when overlay=false. */
  visible?: boolean;
}

export function Loader({ overlay = false, visible = true }: LoaderProps) {
  const isWeb = Platform.OS === 'web';

  // For overlay mode, hide when not visible
  if (overlay && !visible) return null;

  const size = isWeb ? 60 : 48;

  // Use CSS animations on web for reliable pulsing
  const webAnimationStyle1 = isWeb ? {
    animationName: 'pulse1',
    animationDuration: '2s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
  } : {};

  const webAnimationStyle2 = isWeb ? {
    animationName: 'pulse2',
    animationDuration: '2s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
    animationDelay: '0.5s',
  } : {};

  const webAnimationStyleDot = isWeb ? {
    animationName: 'pulseDot',
    animationDuration: '1.6s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
  } : {};

  // Inject CSS keyframes on web
  if (isWeb && typeof document !== 'undefined') {
    const styleId = 'loader-animations';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes pulse1 {
          0%, 100% { transform: scale(0.8); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 0.2; }
        }
        @keyframes pulse2 {
          0%, 100% { transform: scale(0.8); opacity: 0.4; }
          50% { transform: scale(1.4); opacity: 0.1; }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  const content = (
    <>
      {/* Outer ring */}
      <View
        style={[
          {
            position: 'absolute',
            width: size * 1.8,
            height: size * 1.8,
            borderRadius: size * 0.9,
            borderWidth: 2,
            borderColor: '#0d9488',
          },
          webAnimationStyle2 as any,
        ]}
      />

      {/* Inner ring */}
      <View
        style={[
          {
            position: 'absolute',
            width: size * 1.3,
            height: size * 1.3,
            borderRadius: size * 0.65,
            borderWidth: 2,
            borderColor: '#0d9488',
          },
          webAnimationStyle1 as any,
        ]}
      />

      {/* Center dot */}
      <View
        style={[
          {
            width: size * 0.35,
            height: size * 0.35,
            borderRadius: size * 0.175,
            backgroundColor: '#0d9488',
          },
          webAnimationStyleDot as any,
        ]}
      />
    </>
  );

  if (overlay) {
    return (
      <Animated.View
        entering={FadeIn.duration(50)}
        exiting={FadeOut.duration(80)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(248, 250, 252, 0.97)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {content}
      </Animated.View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {content}
    </View>
  );
}

export default Loader;
