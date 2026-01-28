import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Hook to detect safe area insets on mobile web browsers.
 * Falls back to sensible defaults for Android/iOS browsers that don't report CSS env() values.
 */
export function useWebSafeArea(): SafeAreaInsets {
  const [insets, setInsets] = useState<SafeAreaInsets>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Try to get CSS env() values
    const getCSSEnvValue = (property: string): number => {
      const testEl = document.createElement('div');
      testEl.style.setProperty('padding-top', `env(${property}, 0px)`);
      document.body.appendChild(testEl);
      const computedPadding = parseFloat(getComputedStyle(testEl).paddingTop) || 0;
      document.body.removeChild(testEl);
      return computedPadding;
    };

    // Detect if this is a mobile browser
    const isMobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // Check if using standalone/PWA mode (no browser chrome)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    const calculateInsets = () => {
      let top = getCSSEnvValue('safe-area-inset-top');
      let right = getCSSEnvValue('safe-area-inset-right');
      let bottom = getCSSEnvValue('safe-area-inset-bottom');
      let left = getCSSEnvValue('safe-area-inset-left');

      // On mobile browsers (not standalone), add fallback padding
      if (isMobileBrowser && !isStandalone) {
        // Top: Account for browser address bar / status bar overlap
        // Most mobile browsers have ~40-56px for the status/address bar area
        if (top === 0) {
          top = 24; // Conservative default for top status area
        }

        // Bottom: Account for gesture navigation bar
        // Android gesture bar is typically ~24-34px, iOS home indicator ~34px
        if (bottom === 0) {
          bottom = 34;
        }
      }

      setInsets({ top, right, bottom, left });
    };

    calculateInsets();

    // Listen for orientation changes which might affect safe areas
    const handleResize = () => {
      calculateInsets();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return insets;
}
