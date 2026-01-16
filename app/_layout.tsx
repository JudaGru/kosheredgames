import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { PageLoader } from '@/components/PageLoader';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

// Custom light theme with our colors
const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0d9488',
    background: '#ffffff',
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <PageLoader />;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ThemeProvider value={AppTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 200,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="games/twelve-tribes"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/jigsaw-kotel"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/jigsaw-menorah"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/alef-beis-match"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/holiday-match"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/animal-match"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/chumash-vocab-flashcards"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/dikduk-flashcards"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/rashi-flashcards"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/nach-flashcards"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/halacha-flashcards"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/shabbos-word-search"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/purim-word-search"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/pesach-word-search"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/rosh-hashanah-word-search"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/torah-word-search"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/shabbos-crossword"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/purim-crossword"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/pesach-crossword"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/hanukkah-crossword"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/rosh-hashanah-crossword"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/torah-crossword"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/jigsaw-shabbos"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/jigsaw-sukkos"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/jigsaw-purim"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/jigsaw-torah"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/parsha-trivia"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/halacha-trivia"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/nach-true-false"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/holidays-true-false"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/days-of-creation"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/jewish-holidays-order"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/nach-who-am-i"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="games/gedolim-who-am-i"
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
