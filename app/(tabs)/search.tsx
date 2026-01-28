import { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { gameCategories } from '@/data/games';
import type { Game } from '@/types/game';

// Flatten all games into a single array
const allGames: Game[] = gameCategories.flatMap(category => category.games);

// Get unique topics for quick filters
const topics = [...new Set(allGames.map(g => g.topic))].slice(0, 8);

const gameTypeIcons: Record<string, string> = {
  matching: 'th-large',
  flashcards: 'clone',
  trivia: 'question-circle',
  'word-games': 'font',
  sequencing: 'sort-numeric-asc',
  'jigsaw-puzzles': 'puzzle-piece',
};

// Routes must match home screen (index.tsx) exactly
const gameTypeRoutes: Record<string, string> = {
  // Matching games
  'match-12-tribes': '/games/twelve-tribes',
  'match-hebrew-letters': '/games/alef-beis-match',
  'match-holidays': '/games/holiday-match',
  'match-animals': '/games/animal-match',
  'match-shabbos': '/games/shabbos-match',
  'match-midos': '/games/midos-match',
  // Flashcard games
  'flash-bereishis-basics': '/games/bereishis-flashcards',
  'flash-noach': '/games/noach-flashcards',
  'flash-lech-lecha': '/games/lech-lecha-flashcards',
  'flash-pesach': '/games/pesach-flashcards',
  'flash-shavuos': '/games/shavuos-flashcards',
  'flash-purim': '/games/purim-flashcards',
  'flash-yehoshua': '/games/yehoshua-flashcards',
  // Trivia games
  'trivia-parsha': '/games/parsha-trivia',
  'trivia-jewish-history': '/games/jewish-history-trivia',
  'trivia-halacha': '/games/halacha-trivia',
  'trivia-true-false': '/games/true-false',
  'trivia-nach-true-false': '/games/nach-true-false',
  'trivia-holidays-true-false': '/games/holidays-true-false',
  'trivia-who-am-i': '/games/who-am-i',
  'trivia-nach-who-am-i': '/games/nach-who-am-i',
  'trivia-gedolim-who-am-i': '/games/gedolim-who-am-i',
  // Word search games
  'word-hanukkah-search': '/games/hanukkah-word-search',
  'word-shabbos-search': '/games/shabbos-word-search',
  'word-purim-search': '/games/purim-word-search',
  'word-pesach-search': '/games/pesach-word-search',
  'word-rosh-hashanah-search': '/games/rosh-hashanah-word-search',
  'word-torah-search': '/games/torah-word-search',
  // Crossword games
  'word-shabbos-crossword': '/games/shabbos-crossword',
  'word-purim-crossword': '/games/purim-crossword',
  'word-pesach-crossword': '/games/pesach-crossword',
  'word-hanukkah-crossword': '/games/hanukkah-crossword',
  'word-rosh-hashanah-crossword': '/games/rosh-hashanah-crossword',
  'word-torah-crossword': '/games/torah-crossword',
  // Jigsaw puzzles
  'jigsaw-kotel': '/games/jigsaw-kotel',
  'jigsaw-menorah': '/games/jigsaw-menorah',
  'jigsaw-shabbos': '/games/jigsaw-shabbos',
  'jigsaw-sukkos': '/games/jigsaw-sukkos',
  'jigsaw-purim': '/games/jigsaw-purim',
  'jigsaw-torah': '/games/jigsaw-torah',
  // Sequencing games
  'sequence-ten-makkos': '/games/ten-makkos',
  'sequence-creation': '/games/days-of-creation',
  'sequence-avos': '/games/avos-imahos',
  'sequence-yomim-tovim': '/games/jewish-holidays-order',
};

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const router = useRouter();

  const filteredGames = useMemo(() => {
    let results = allGames;

    if (selectedTopic) {
      results = results.filter(g => g.topic === selectedTopic);
    }

    if (query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      results = results.filter(
        g =>
          g.title.toLowerCase().includes(searchTerm) ||
          g.topic.toLowerCase().includes(searchTerm) ||
          g.description.toLowerCase().includes(searchTerm) ||
          g.gameType.toLowerCase().includes(searchTerm)
      );
    }

    return results;
  }, [query, selectedTopic]);

  const handleGamePress = (game: Game) => {
    const route = gameTypeRoutes[game.id];
    if (route) {
      router.push(route as any);
    }
  };

  const renderGame = ({ item }: { item: Game }) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => handleGamePress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.gameIcon, { backgroundColor: Colors.gameColors[item.gameType]?.background || '#f0fdfa' }]}>
        <FontAwesome
          name={gameTypeIcons[item.gameType] as any || 'gamepad'}
          size={20}
          color={Colors.gameColors[item.gameType]?.primary || Colors.primary[500]}
        />
      </View>
      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle}>{item.title}</Text>
        <Text style={styles.gameMeta}>{item.topic} - {item.ageRange}</Text>
      </View>
      <FontAwesome name="chevron-right" size={14} color={Colors.text.secondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Games</Text>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={16} color={Colors.text.secondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, topic, or type..."
          placeholderTextColor={Colors.text.secondary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
            <FontAwesome name="times-circle" size={18} color={Colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.topicsContainer}>
        <FlatList
          horizontal
          data={topics}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topicsList}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.topicChip,
                selectedTopic === item && styles.topicChipSelected,
              ]}
              onPress={() => setSelectedTopic(selectedTopic === item ? null : item)}
            >
              <Text
                style={[
                  styles.topicChipText,
                  selectedTopic === item && styles.topicChipTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredGames}
        keyExtractor={(item) => item.id}
        renderItem={renderGame}
        contentContainerStyle={styles.gamesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <FontAwesome name="search" size={48} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No games found</Text>
            <Text style={styles.emptyText}>Try a different search term or topic</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  clearButton: {
    padding: 4,
  },
  topicsContainer: {
    marginTop: 16,
  },
  topicsList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  topicChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    marginRight: 8,
  },
  topicChipSelected: {
    backgroundColor: Colors.primary[500],
  },
  topicChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  topicChipTextSelected: {
    color: '#fff',
  },
  gamesList: {
    padding: 20,
    paddingTop: 16,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  gameIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  gameMeta: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
});
