import { ScrollView, View, Platform, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { Header } from '@/components/Header';
import { CategoryRow } from '@/components/CategoryRow';
import { NavigationLoader } from '@/components/NavigationLoader';
import { gameCategories } from '@/data/games';
import type { Game } from '@/types/game';

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [navigatingGameTitle, setNavigatingGameTitle] = useState<string | undefined>();
  const isWeb = Platform.OS === 'web';

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const navigateToGame = useCallback((route: string, title: string) => {
    setNavigatingGameTitle(title);
    setNavigating(true);
    // Navigate immediately - loader shows instantly
    router.push(route as any);
    // Reset after navigation completes
    setTimeout(() => {
      setNavigating(false);
      setNavigatingGameTitle(undefined);
    }, 500);
  }, []);

  const handleGamePress = (game: Game) => {
    // Route to the appropriate game screen
    if (game.id === 'match-12-tribes') {
      navigateToGame('/games/twelve-tribes', game.title);
    } else if (game.id === 'word-hanukkah-search') {
      navigateToGame('/games/hanukkah-word-search', game.title);
    } else if (game.id === 'flash-bereishis-basics') {
      navigateToGame('/games/bereishis-flashcards', game.title);
    } else if (game.id === 'trivia-jewish-history') {
      navigateToGame('/games/jewish-history-trivia', game.title);
    } else if (game.id === 'sequence-ten-makkos') {
      navigateToGame('/games/ten-makkos', game.title);
    } else if (game.id === 'word-shabbos-crossword') {
      navigateToGame('/games/shabbos-crossword', game.title);
    } else if (game.id === 'trivia-true-false') {
      navigateToGame('/games/true-false', game.title);
    } else if (game.id === 'trivia-who-am-i') {
      navigateToGame('/games/who-am-i', game.title);
    } else if (game.id === 'jigsaw-kotel') {
      navigateToGame('/games/jigsaw-kotel', game.title);
    } else if (game.id === 'jigsaw-menorah') {
      navigateToGame('/games/jigsaw-menorah', game.title);
    } else if (game.id === 'match-hebrew-letters') {
      navigateToGame('/games/alef-beis-match', game.title);
    } else if (game.id === 'match-holidays') {
      navigateToGame('/games/holiday-match', game.title);
    } else if (game.id === 'match-animals') {
      navigateToGame('/games/animal-match', game.title);
    } else if (game.id === 'match-shabbos') {
      navigateToGame('/games/shabbos-match', game.title);
    } else if (game.id === 'match-midos') {
      navigateToGame('/games/midos-match', game.title);
    } else if (game.id === 'flash-noach') {
      navigateToGame('/games/noach-flashcards', game.title);
    } else if (game.id === 'flash-lech-lecha') {
      navigateToGame('/games/lech-lecha-flashcards', game.title);
    } else if (game.id === 'flash-pesach') {
      navigateToGame('/games/pesach-flashcards', game.title);
    } else if (game.id === 'flash-shavuos') {
      navigateToGame('/games/shavuos-flashcards', game.title);
    } else if (game.id === 'flash-purim') {
      navigateToGame('/games/purim-flashcards', game.title);
    } else if (game.id === 'flash-yehoshua') {
      navigateToGame('/games/yehoshua-flashcards', game.title);
    } else if (game.id === 'word-shabbos-search') {
      navigateToGame('/games/shabbos-word-search', game.title);
    } else if (game.id === 'word-purim-search') {
      navigateToGame('/games/purim-word-search', game.title);
    } else if (game.id === 'word-pesach-search') {
      navigateToGame('/games/pesach-word-search', game.title);
    } else if (game.id === 'word-rosh-hashanah-search') {
      navigateToGame('/games/rosh-hashanah-word-search', game.title);
    } else if (game.id === 'word-torah-search') {
      navigateToGame('/games/torah-word-search', game.title);
    } else if (game.id === 'word-shabbos-crossword') {
      navigateToGame('/games/shabbos-crossword', game.title);
    } else if (game.id === 'word-purim-crossword') {
      navigateToGame('/games/purim-crossword', game.title);
    } else if (game.id === 'word-pesach-crossword') {
      navigateToGame('/games/pesach-crossword', game.title);
    } else if (game.id === 'word-hanukkah-crossword') {
      navigateToGame('/games/hanukkah-crossword', game.title);
    } else if (game.id === 'word-rosh-hashanah-crossword') {
      navigateToGame('/games/rosh-hashanah-crossword', game.title);
    } else if (game.id === 'word-torah-crossword') {
      navigateToGame('/games/torah-crossword', game.title);
    } else if (game.id === 'jigsaw-shabbos') {
      navigateToGame('/games/jigsaw-shabbos', game.title);
    } else if (game.id === 'jigsaw-sukkos') {
      navigateToGame('/games/jigsaw-sukkos', game.title);
    } else if (game.id === 'jigsaw-purim') {
      navigateToGame('/games/jigsaw-purim', game.title);
    } else if (game.id === 'jigsaw-torah') {
      navigateToGame('/games/jigsaw-torah', game.title);
    } else if (game.id === 'trivia-parsha') {
      navigateToGame('/games/parsha-trivia', game.title);
    } else if (game.id === 'trivia-halacha') {
      navigateToGame('/games/halacha-trivia', game.title);
    } else if (game.id === 'trivia-nach-true-false') {
      navigateToGame('/games/nach-true-false', game.title);
    } else if (game.id === 'trivia-holidays-true-false') {
      navigateToGame('/games/holidays-true-false', game.title);
    } else if (game.id === 'sequence-creation') {
      navigateToGame('/games/days-of-creation', game.title);
    } else if (game.id === 'sequence-yomim-tovim') {
      navigateToGame('/games/jewish-holidays-order', game.title);
    } else if (game.id === 'trivia-nach-who-am-i') {
      navigateToGame('/games/nach-who-am-i', game.title);
    } else if (game.id === 'trivia-gedolim-who-am-i') {
      navigateToGame('/games/gedolim-who-am-i', game.title);
    } else {
      // For other games, show coming soon or navigate to a generic page
      console.log('Game pressed:', game.title);
    }
  };

  const handleSeeAll = (categoryId: string) => {
    console.log('See all pressed:', categoryId);
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  return (
    <View className="flex-1">
      <StatusBar style="dark" />

      {/* Navigation Loader Overlay */}
      <NavigationLoader visible={navigating} gameTitle={navigatingGameTitle} />

      {/* Gradient Background */}
      <LinearGradient
        colors={['#f0fdfa', '#e0f2fe', '#f0f9ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />

      <Header onSearchPress={handleSearchPress} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16 }}
        refreshControl={
          !isWeb ? (
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
        <View className={`${isWeb ? 'pb-12' : 'pb-28'}`}>
          {gameCategories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              isLoading={isLoading}
              onSeeAll={() => handleSeeAll(category.id)}
              onGamePress={handleGamePress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
