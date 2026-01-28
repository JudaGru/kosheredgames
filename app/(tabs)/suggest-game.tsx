import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { getIsSupabaseConfigured } from '@/lib/supabase';
import { submitGameSuggestion, fetchUpcomingGames, UpcomingGame } from '@/lib/gameSuggestions';

export default function SuggestGameScreen() {
  const [gameName, setGameName] = useState('');
  const [gameDescription, setGameDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(true);

  // Upcoming games state
  const [upcomingGames, setUpcomingGames] = useState<UpcomingGame[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [gamesError, setGamesError] = useState<string | null>(null);

  useEffect(() => {
    setIsConfigured(getIsSupabaseConfigured());
    loadUpcomingGames();
  }, []);

  const loadUpcomingGames = async () => {
    setIsLoadingGames(true);
    const result = await fetchUpcomingGames();
    if (result.success && result.games) {
      setUpcomingGames(result.games);
      setGamesError(null);
    } else {
      setGamesError(result.error || null);
    }
    setIsLoadingGames(false);
  };

  const handleSubmit = async () => {
    if (!gameName.trim()) {
      setError('Please enter a game name');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await submitGameSuggestion({
      gameName: gameName.trim(),
      gameDescription: gameDescription.trim(),
      email: email.trim() || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || 'Failed to submit suggestion');
    }
  };

  const handleReset = () => {
    setGameName('');
    setGameDescription('');
    setEmail('');
    setSubmitted(false);
    setError(null);
  };

  const getTimeframeColor = (timeframe: string) => {
    if (timeframe.toLowerCase().includes('soon') || timeframe.toLowerCase().includes('week')) {
      return Colors.primary[500];
    } else if (timeframe.toLowerCase().includes('month')) {
      return Colors.secondary[500];
    }
    return '#8b5cf6';
  };

  if (!isConfigured) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centerContent}>
          <FontAwesome name="lightbulb-o" size={48} color="#cbd5e1" />
          <Text style={styles.unavailableTitle}>Suggestions Unavailable</Text>
          <Text style={styles.unavailableText}>
            Game suggestions are not available in this environment.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {submitted ? (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <FontAwesome name="check" size={32} color={Colors.primary[500]} />
              </View>
              <Text style={styles.successTitle}>Thank You!</Text>
              <Text style={styles.successText}>
                Your game suggestion has been received. If it aligns with our mission of providing
                educational Jewish content, there's a high likelihood it will be added to AlephPlay!
              </Text>
              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetButtonText}>Suggest Another Game</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.header}>
                <FontAwesome name="lightbulb-o" size={32} color={Colors.primary[500]} />
                <Text style={styles.title}>Suggest a Game</Text>
                <Text style={styles.subtitle}>
                  Have an idea for a fun educational Jewish game? We'd love to hear it!
                </Text>
              </View>

              {/* Mission alignment notice */}
              <View style={styles.noticeCard}>
                <View style={styles.noticeIconContainer}>
                  <FontAwesome name="star" size={18} color="#f59e0b" />
                </View>
                <View style={styles.noticeContent}>
                  <Text style={styles.noticeTitle}>High Chance of Being Added!</Text>
                  <Text style={styles.noticeText}>
                    If your game suggestion aligns with our mission of providing strictly educational
                    Jewish content for children, there's a high likelihood it will be added to the app.
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Game Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Hebrew Alphabet Memory Match"
                  placeholderTextColor={Colors.text.secondary}
                  value={gameName}
                  onChangeText={setGameName}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Description (optional)</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe how the game would work, what it would teach, and why kids would enjoy it..."
                  placeholderTextColor={Colors.text.secondary}
                  multiline
                  numberOfLines={5}
                  value={gameDescription}
                  onChangeText={setGameDescription}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Email (optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor={Colors.text.secondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <Text style={styles.hint}>
                  Get notified when your suggested game is added
                </Text>
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isSubmitting && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <FontAwesome name="paper-plane" size={18} color="#fff" />
                    <Text style={styles.submitButtonText}>Submit Suggestion</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Upcoming Games Section */}
          <View style={styles.upcomingSection}>
            <View style={styles.sectionHeader}>
              <FontAwesome name="calendar" size={20} color={Colors.primary[500]} />
              <Text style={styles.sectionTitle}>Upcoming Games</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Games that are scheduled to be added to AlephPlay
            </Text>

            {isLoadingGames ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.primary[500]} />
                <Text style={styles.loadingText}>Loading upcoming games...</Text>
              </View>
            ) : gamesError ? (
              <View style={styles.emptyContainer}>
                <FontAwesome name="clock-o" size={32} color="#cbd5e1" />
                <Text style={styles.emptyTitle}>Coming Soon</Text>
                <Text style={styles.emptyText}>
                  Check back soon to see what games we're working on!
                </Text>
              </View>
            ) : upcomingGames.length === 0 ? (
              <View style={styles.emptyContainer}>
                <FontAwesome name="clock-o" size={32} color="#cbd5e1" />
                <Text style={styles.emptyTitle}>No Upcoming Games</Text>
                <Text style={styles.emptyText}>
                  We're always working on new games. Suggest one above and it might appear here!
                </Text>
              </View>
            ) : (
              <View style={styles.gamesList}>
                {upcomingGames.map((game) => (
                  <View key={game.id} style={styles.gameCard}>
                    <View style={styles.gameCardHeader}>
                      <Text style={styles.gameName}>{game.name}</Text>
                      <View style={[styles.timeframeBadge, { backgroundColor: getTimeframeColor(game.estimated_timeframe) + '20' }]}>
                        <FontAwesome name="clock-o" size={12} color={getTimeframeColor(game.estimated_timeframe)} />
                        <Text style={[styles.timeframeText, { color: getTimeframeColor(game.estimated_timeframe) }]}>
                          {game.estimated_timeframe}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.gameDescription}>{game.description}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  unavailableTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
  },
  unavailableText: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text.primary,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: '#fef9c3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fde047',
  },
  noticeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fef08a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 14,
    color: '#a16207',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: '#f8fafc',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: '#f8fafc',
    minHeight: 120,
  },
  hint: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginTop: 6,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[500],
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  successText: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  resetButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary[500],
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[500],
  },
  // Upcoming Games Section
  upcomingSection: {
    marginTop: 40,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 12,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  gamesList: {
    gap: 16,
  },
  gameCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  gameCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 12,
  },
  gameName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  timeframeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  timeframeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  gameDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});
