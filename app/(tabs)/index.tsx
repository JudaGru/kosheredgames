import { ScrollView, View, RefreshControl } from 'react-native';
import { useState, useCallback, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { Header, AgeFilter } from '@/components/Header';
import { CategoryRow } from '@/components/CategoryRow';
import { Loader } from '@/components/Loader';
import { useIsMobileLayout } from '@/hooks/useDeviceType';
import { gameCategories } from '@/data/games';
import type { Game } from '@/types/game';

// Helper function to check if a game's age range matches the selected filter
function gameMatchesAgeFilter(gameAgeRange: string, filter: AgeFilter): boolean {
  if (filter === 'all') return true;

  // Parse the game's age range (e.g., "4-8", "6+", "10+", "8-14")
  const rangeMatch = gameAgeRange.match(/^(\d+)(?:-(\d+)|\+)?$/);
  if (!rangeMatch) return true; // If we can't parse, show the game

  const gameMinAge = parseInt(rangeMatch[1], 10);
  const gameMaxAge = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : 99; // "+" means no upper limit

  // Define filter ranges
  const filterRanges: Record<Exclude<AgeFilter, 'all'>, [number, number]> = {
    '3-5': [3, 5],
    '6-8': [6, 8],
    '9-12': [9, 12],
    '13+': [13, 99],
  };

  const [filterMin, filterMax] = filterRanges[filter];

  // Check if there's any overlap between game range and filter range
  return gameMinAge <= filterMax && gameMaxAge >= filterMin;
}

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [selectedAge, setSelectedAge] = useState<AgeFilter>('all');
  const { isMobile, isLoading: isDetectingDevice } = useIsMobileLayout();

  // Filter categories based on selected age
  const filteredCategories = useMemo(() => {
    if (selectedAge === 'all') return gameCategories;

    return gameCategories
      .map((category) => ({
        ...category,
        games: category.games.filter((game) =>
          gameMatchesAgeFilter(game.ageRange, selectedAge)
        ),
      }))
      .filter((category) => category.games.length > 0);
  }, [selectedAge]);

  // Trigger animation when screen comes into focus (including returning from a game)
  useFocusEffect(
    useCallback(() => {
      setAnimationKey(prev => prev + 1);
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const navigateToGame = useCallback((route: string) => {
    setNavigating(true);
    // Navigate immediately - loader shows instantly
    router.push(route as any);
    // Reset after navigation completes
    setTimeout(() => {
      setNavigating(false);
    }, 500);
  }, []);

  // Show loader while detecting device type on web - MUST be after all hooks
  if (isDetectingDevice) {
    return <Loader />;
  }

  const handleGamePress = (game: Game) => {
    // Route to the appropriate game screen
    if (game.id === 'match-12-tribes') {
      navigateToGame('/games/twelve-tribes');
    } else if (game.id === 'word-hanukkah-search') {
      navigateToGame('/games/hanukkah-word-search');
    } else if (game.id === 'flash-bereishis-basics') {
      navigateToGame('/games/bereishis-flashcards');
    } else if (game.id === 'trivia-jewish-history') {
      navigateToGame('/games/jewish-history-trivia');
    } else if (game.id === 'sequence-ten-makkos') {
      navigateToGame('/games/ten-makkos');
    } else if (game.id === 'word-shabbos-crossword') {
      navigateToGame('/games/shabbos-crossword');
    } else if (game.id === 'trivia-true-false') {
      navigateToGame('/games/true-false');
    } else if (game.id === 'trivia-who-am-i') {
      navigateToGame('/games/who-am-i');
    } else if (game.id === 'jigsaw-kotel') {
      navigateToGame('/games/jigsaw-kotel');
    } else if (game.id === 'jigsaw-menorah') {
      navigateToGame('/games/jigsaw-menorah');
    } else if (game.id === 'match-hebrew-letters') {
      navigateToGame('/games/alef-beis-match');
    } else if (game.id === 'match-holidays') {
      navigateToGame('/games/holiday-match');
    } else if (game.id === 'match-animals') {
      navigateToGame('/games/animal-match');
    } else if (game.id === 'match-shabbos') {
      navigateToGame('/games/shabbos-match');
    } else if (game.id === 'match-midos') {
      navigateToGame('/games/midos-match');
    } else if (game.id === 'flash-noach') {
      navigateToGame('/games/noach-flashcards');
    } else if (game.id === 'flash-lech-lecha') {
      navigateToGame('/games/lech-lecha-flashcards');
    } else if (game.id === 'flash-pesach') {
      navigateToGame('/games/pesach-flashcards');
    } else if (game.id === 'flash-shavuos') {
      navigateToGame('/games/shavuos-flashcards');
    } else if (game.id === 'flash-purim') {
      navigateToGame('/games/purim-flashcards');
    } else if (game.id === 'flash-yehoshua') {
      navigateToGame('/games/yehoshua-flashcards');
    } else if (game.id === 'word-shabbos-search') {
      navigateToGame('/games/shabbos-word-search');
    } else if (game.id === 'word-purim-search') {
      navigateToGame('/games/purim-word-search');
    } else if (game.id === 'word-pesach-search') {
      navigateToGame('/games/pesach-word-search');
    } else if (game.id === 'word-rosh-hashanah-search') {
      navigateToGame('/games/rosh-hashanah-word-search');
    } else if (game.id === 'word-torah-search') {
      navigateToGame('/games/torah-word-search');
    } else if (game.id === 'word-shabbos-crossword') {
      navigateToGame('/games/shabbos-crossword');
    } else if (game.id === 'word-purim-crossword') {
      navigateToGame('/games/purim-crossword');
    } else if (game.id === 'word-pesach-crossword') {
      navigateToGame('/games/pesach-crossword');
    } else if (game.id === 'word-hanukkah-crossword') {
      navigateToGame('/games/hanukkah-crossword');
    } else if (game.id === 'word-rosh-hashanah-crossword') {
      navigateToGame('/games/rosh-hashanah-crossword');
    } else if (game.id === 'word-torah-crossword') {
      navigateToGame('/games/torah-crossword');
    } else if (game.id === 'jigsaw-shabbos') {
      navigateToGame('/games/jigsaw-shabbos');
    } else if (game.id === 'jigsaw-sukkos') {
      navigateToGame('/games/jigsaw-sukkos');
    } else if (game.id === 'jigsaw-purim') {
      navigateToGame('/games/jigsaw-purim');
    } else if (game.id === 'jigsaw-torah') {
      navigateToGame('/games/jigsaw-torah');
    } else if (game.id === 'trivia-parsha') {
      navigateToGame('/games/parsha-trivia');
    } else if (game.id === 'trivia-halacha') {
      navigateToGame('/games/halacha-trivia');
    } else if (game.id === 'trivia-nach-true-false') {
      navigateToGame('/games/nach-true-false');
    } else if (game.id === 'trivia-holidays-true-false') {
      navigateToGame('/games/holidays-true-false');
    } else if (game.id === 'sequence-creation') {
      navigateToGame('/games/days-of-creation');
    } else if (game.id === 'sequence-yomim-tovim') {
      navigateToGame('/games/jewish-holidays-order');
    } else if (game.id === 'trivia-nach-who-am-i') {
      navigateToGame('/games/nach-who-am-i');
    } else if (game.id === 'trivia-gedolim-who-am-i') {
      navigateToGame('/games/gedolim-who-am-i');
    } else if (game.id === 'letter-grid-torah') {
      navigateToGame('/games/letter-grid-torah');
    } else {
      // For other games, show coming soon or navigate to a generic page
      console.log('Game pressed:');
    }
  };

  return (
    <View className="flex-1">
      <StatusBar style="dark" />

      {/* Navigation Loader Overlay */}
      <Loader overlay visible={navigating} />

      {/* Gradient Background */}
      <LinearGradient
        colors={['#f0fdfa', '#e0f2fe', '#f0f9ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />

      <Header
        selectedAge={selectedAge}
        onAgeChange={setSelectedAge}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16 }}
        refreshControl={
          isMobile ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0d9488"
              colors={['#0d9488', '#0ea5e9', '#0891b2']}
            />
          ) : undefined
        }
      >
        {/* Game Categories */}
        <View>
          {filteredCategories.map((category, index) => (
            <CategoryRow
              key={category.id}
              category={category}
              isLoading={isLoading}
              onGamePress={handleGamePress}
              categoryIndex={index}
              animationKey={animationKey}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
