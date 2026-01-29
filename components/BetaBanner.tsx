import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from '@/constants/Colors';

const BANNER_DISMISSED_KEY = 'beta_banner_dismissed';

export function BetaBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    checkBannerStatus();
  }, []);

  const checkBannerStatus = async () => {
    try {
      const dismissed = await AsyncStorage.getItem(BANNER_DISMISSED_KEY);
      if (!dismissed) {
        setIsVisible(true);
      }
    } catch {
      // If we can't read storage, show the banner
      setIsVisible(true);
    }
  };

  const dismissBanner = async () => {
    setIsVisible(false);
    try {
      await AsyncStorage.setItem(BANNER_DISMISSED_KEY, 'true');
    } catch {
      // Silently fail if we can't save
    }
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="gift-outline" size={20} color={Colors.accent[500]} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            <Text style={styles.betaBadge}>BETA</Text>
            {' '}Free during beta!
          </Text>
          <Text style={styles.subtitle}>
            Enjoy all games free while we're in beta. Premium features coming soon.
          </Text>
        </View>
        <TouchableOpacity
          onPress={dismissBanner}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Dismiss banner"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.accent[50],
    borderBottomWidth: 1,
    borderBottomColor: Colors.accent[200],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  betaBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent[500],
    backgroundColor: Colors.accent[100],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  subtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
  closeButton: {
    padding: 4,
  },
});
