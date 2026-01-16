import { Platform, useWindowDimensions } from 'react-native';
import { useMemo } from 'react';

/**
 * Detects if the user is on a mobile device (including mobile web browsers)
 * Uses user agent detection for web and screen width as fallback
 */
export function useDeviceType() {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const isWeb = Platform.OS === 'web';

    // For native apps, use Platform.OS directly
    if (!isWeb) {
      return {
        isWeb: false,
        isMobile: true,
        isMobileWeb: false,
        isDesktop: false,
      };
    }

    // For web, detect mobile browser using user agent and screen width
    let isMobileBrowser = false;

    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';

      // Check for mobile user agents
      isMobileBrowser = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent);

      // Also check for touch capability as additional signal
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // If touch device with narrow screen, likely mobile
      if (hasTouch && width < 768) {
        isMobileBrowser = true;
      }
    }

    // Small screens are treated as mobile regardless of user agent
    const isSmallScreen = width < 768;
    const isMobile = isMobileBrowser || isSmallScreen;

    return {
      isWeb: true,
      isMobile,
      isMobileWeb: isMobile,
      isDesktop: !isMobile,
    };
  }, [width]);
}

/**
 * Simple hook that returns true if the layout should be mobile-style
 * Use this in components instead of Platform.OS === 'web'
 */
export function useIsMobileLayout() {
  const { isMobile } = useDeviceType();
  return isMobile;
}
