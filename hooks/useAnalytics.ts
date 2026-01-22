import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'expo-router';
import { Platform } from 'react-native';

const GA_MEASUREMENT_ID = 'G-QDXJ8YHQLY';

// Check if we're on web and gtag is available
const isGtagAvailable = () => {
  return Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Track page views with time on page
export function usePageTracking() {
  const pathname = usePathname();
  const pageStartTime = useRef<number>(Date.now());
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (!isGtagAvailable()) return;

    // Send time on previous page before tracking new page
    if (previousPath.current && previousPath.current !== pathname) {
      const timeOnPage = Math.round((Date.now() - pageStartTime.current) / 1000);

      window.gtag('event', 'page_time', {
        page_path: previousPath.current,
        engagement_time_msec: timeOnPage * 1000,
        time_on_page_seconds: timeOnPage,
      });
    }

    // Track new page view
    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_title: getPageTitle(pathname),
      page_location: window.location.href,
    });

    // Reset timer and store current path
    pageStartTime.current = Date.now();
    previousPath.current = pathname;

    // Track time on page when user leaves
    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - pageStartTime.current) / 1000);

      // Use sendBeacon for reliable tracking on page unload
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          client_id: GA_MEASUREMENT_ID,
          events: [{
            name: 'page_time',
            params: {
              page_path: pathname,
              time_on_page_seconds: timeOnPage,
              engagement_time_msec: timeOnPage * 1000,
            }
          }]
        });
        navigator.sendBeacon(
          `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=`,
          data
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);
}

// Track custom events (clicks, interactions, etc.)
export function useTrackEvent() {
  const trackEvent = useCallback((
    eventName: string,
    params?: Record<string, string | number | boolean>
  ) => {
    if (!isGtagAvailable()) return;

    window.gtag('event', eventName, {
      ...params,
    });
  }, []);

  return trackEvent;
}

// Track game-specific events
export function useGameAnalytics() {
  const trackEvent = useTrackEvent();
  const pathname = usePathname();

  const trackGameStart = useCallback((gameName?: string) => {
    trackEvent('game_start', {
      game_name: gameName || getGameNameFromPath(pathname),
      page_path: pathname,
    });
  }, [trackEvent, pathname]);

  const trackGameComplete = useCallback((gameName?: string, score?: number, timeSpent?: number) => {
    trackEvent('game_complete', {
      game_name: gameName || getGameNameFromPath(pathname),
      page_path: pathname,
      ...(score !== undefined && { score }),
      ...(timeSpent !== undefined && { time_spent_seconds: timeSpent }),
    });
  }, [trackEvent, pathname]);

  const trackGameAction = useCallback((action: string, details?: Record<string, string | number | boolean>) => {
    trackEvent('game_action', {
      game_name: getGameNameFromPath(pathname),
      action,
      page_path: pathname,
      ...details,
    });
  }, [trackEvent, pathname]);

  return {
    trackGameStart,
    trackGameComplete,
    trackGameAction,
  };
}

// Track button/link clicks
export function useClickTracking() {
  const trackEvent = useTrackEvent();

  const trackClick = useCallback((elementName: string, category?: string) => {
    trackEvent('click', {
      element_name: elementName,
      element_category: category || 'button',
    });
  }, [trackEvent]);

  return trackClick;
}

// Helper to get page title from pathname
function getPageTitle(pathname: string): string {
  if (pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/') {
    return 'Home';
  }

  // Extract game name from path like /games/jigsaw-menorah
  const gameName = getGameNameFromPath(pathname);
  if (gameName) {
    return gameName;
  }

  // Handle other routes
  const routeName = pathname.split('/').pop() || 'Home';
  return routeName.charAt(0).toUpperCase() + routeName.slice(1).replace(/-/g, ' ');
}

// Helper to extract game name from path
function getGameNameFromPath(pathname: string): string {
  const match = pathname.match(/\/games\/(.+)/);
  if (match) {
    return match[1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return '';
}
