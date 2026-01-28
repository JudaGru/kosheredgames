import React, { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

// Hook to detect if running in a mobile browser with potential overlays
function useWebSafeAreaBottom(): number {
  const [safeAreaBottom, setSafeAreaBottom] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Try to get the CSS env() value
    const getCSSEnvValue = () => {
      const testEl = document.createElement('div');
      testEl.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)';
      document.body.appendChild(testEl);
      const computedPadding = parseFloat(getComputedStyle(testEl).paddingBottom) || 0;
      document.body.removeChild(testEl);
      return computedPadding;
    };

    // Detect if this is a mobile browser
    const isMobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // Check if using standalone/PWA mode (no browser chrome)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    let bottomInset = getCSSEnvValue();

    // On mobile browsers (not standalone), add extra padding for gesture navigation
    // Android Chrome and other mobile browsers often have ~24-34px gesture bars
    if (isMobileBrowser && !isStandalone && bottomInset === 0) {
      // Use a sensible default for mobile browsers with gesture navigation
      bottomInset = 34;
    }

    setSafeAreaBottom(bottomInset);

    // Listen for orientation changes which might affect safe areas
    const handleResize = () => {
      let newInset = getCSSEnvValue();
      if (isMobileBrowser && !isStandalone && newInset === 0) {
        newInset = 34;
      }
      setSafeAreaBottom(newInset);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return safeAreaBottom;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const webSafeAreaBottom = useWebSafeAreaBottom();
  const isWeb = Platform.OS === 'web';

  // Use safe area inset for bottom padding, with a minimum of 8px
  // On web, use our custom hook that better detects mobile browser overlays
  const bottomInset = isWeb ? webSafeAreaBottom : insets.bottom;
  const bottomPadding = Math.max(bottomInset, 8);
  const tabBarHeight = 50 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? Colors.dark.background : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#1e293b' : '#e2e8f0',
          height: tabBarHeight,
          paddingBottom: bottomPadding,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => <TabBarIcon name="info-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="feedback"
        options={{
          title: 'Feedback',
          tabBarIcon: ({ color }) => <TabBarIcon name="comment" color={color} />,
        }}
      />
      <Tabs.Screen
        name="suggest-game"
        options={{
          title: 'Suggest',
          tabBarIcon: ({ color }) => <TabBarIcon name="lightbulb-o" color={color} />,
        }}
      />
      {/* Hide old tabs */}
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
