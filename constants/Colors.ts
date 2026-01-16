// Ocean & Sky - Fresh, clean, peaceful color palette
export const Colors = {
  // Primary - Soft Teal
  primary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Main primary - teal
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  // Secondary - Sky Blue
  secondary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Sky blue
    600: '#0284c7',
    700: '#0369a1',
  },
  // Accent - Sandy warm
  accent: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
  },
  // Game category colors - Ocean theme
  gameColors: {
    matching: {
      primary: '#0d9488', // Teal
      secondary: '#5eead4',
      background: '#f0fdfa',
    },
    flashcards: {
      primary: '#0284c7', // Sky blue
      secondary: '#7dd3fc',
      background: '#f0f9ff',
    },
    trivia: {
      primary: '#0891b2', // Cyan
      secondary: '#67e8f9',
      background: '#ecfeff',
    },
    'word-games': {
      primary: '#0369a1', // Deep sky
      secondary: '#38bdf8',
      background: '#f0f9ff',
    },
    sequencing: {
      primary: '#7c3aed', // Violet
      secondary: '#a78bfa',
      background: '#f5f3ff',
    },
    'jigsaw-puzzles': {
      primary: '#059669', // Emerald
      secondary: '#6ee7b7',
      background: '#ecfdf5',
    },
  },
  // Topic accent colors - warm sandy tones
  topicColors: [
    '#f59e0b', // Amber
    '#d97706', // Orange
    '#ea580c', // Deep orange
    '#0d9488', // Teal
    '#0891b2', // Cyan
    '#0284c7', // Sky
    '#7c3aed', // Violet
    '#c026d3', // Fuchsia
  ],
  // UI colors
  surface: {
    light: '#f8fafc', // Soft gray-blue
    DEFAULT: '#ffffff',
    dark: '#0f172a',
    sand: '#fef7ed', // Warm sand background
  },
  text: {
    primary: '#0f172a',
    secondary: '#64748b',
    inverse: '#ffffff',
  },
  // Theme colors for navigation
  light: {
    text: '#0f172a',
    background: '#ffffff',
    tint: '#0d9488',
    tabIconDefault: '#94a3b8',
    tabIconSelected: '#0d9488',
  },
  dark: {
    text: '#ffffff',
    background: '#0f172a',
    tint: '#2dd4bf',
    tabIconDefault: '#64748b',
    tabIconSelected: '#2dd4bf',
  },
};

// Get a consistent color for a topic based on its name
export function getTopicColor(topic: string): string {
  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = topic.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Colors.topicColors[Math.abs(hash) % Colors.topicColors.length];
}

export default Colors;
