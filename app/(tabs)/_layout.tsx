import React, { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  size?: number;
}) {
  return <FontAwesome size={props.size || 24} style={{ marginBottom: 0 }} {...props} />;
}

// Detect mobile browser and add fallback bottom padding
function useMobileBrowserBottomPadding(): number {
  const [extraPadding, setExtraPadding] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Detect mobile browser
    const isMobileBrowser = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // Check if standalone PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    // Add extra padding for mobile browsers (not PWAs) to account for gesture nav
    if (isMobileBrowser && !isStandalone) {
      setExtraPadding(12); // Extra padding for mobile browser gesture areas
    }
  }, []);

  return extraPadding;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const mobileBrowserPadding = useMobileBrowserBottomPadding();
  const { width } = useWindowDimensions();

  // Detect mobile web specifically (web with narrow viewport)
  const isMobileWeb = Platform.OS === 'web' && width < 768;

  // Safe area padding for devices with notches/gesture bars
  const safeAreaBottom = insets.bottom > 0 ? insets.bottom : mobileBrowserPadding;
  // Show labels on web (both desktop and mobile web)
  const showLabels = Platform.OS === 'web';
  // Icon size
  const iconSize = isMobileWeb ? 20 : 24;
  // Padding around the tab bar content
  const iconPadding = isMobileWeb ? 6 : 8;
  // Fixed tab bar height that includes room for labels
  const tabBarHeight = isMobileWeb ? 60 + safeAreaBottom : 70 + safeAreaBottom;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarShowLabel: showLabels, // Show labels on all web platforms
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? Colors.dark.background : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#1e293b' : '#e2e8f0',
          height: tabBarHeight,
          paddingBottom: safeAreaBottom + iconPadding,
          paddingTop: iconPadding,
        },
        tabBarLabelStyle: {
          fontSize: isMobileWeb ? 10 : 12,
          fontWeight: '600',
          marginTop: isMobileWeb ? -2 : 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} size={iconSize} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} size={iconSize} />,
        }}
      />
      <Tabs.Screen
        name="suggest-game"
        options={{
          title: 'Suggest',
          tabBarIcon: ({ color }) => <TabBarIcon name="lightbulb-o" color={color} size={iconSize} />,
        }}
      />
      <Tabs.Screen
        name="feedback"
        options={{
          title: 'Feedback',
          tabBarIcon: ({ color }) => <TabBarIcon name="comment" color={color} size={iconSize} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => <TabBarIcon name="info-circle" color={color} size={iconSize} />,
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
