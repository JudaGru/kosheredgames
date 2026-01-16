import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  isWeb: Platform.OS === 'web',

  // Card dimensions
  card: {
    // Mobile: square cards
    mobile: {
      width: 140,
      height: 140,
    },
    // Web: landscape rectangles
    web: {
      width: 280,
      height: 158,
    },
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
};

export default Layout;
