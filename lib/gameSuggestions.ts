import { supabase, isSupabaseConfigured } from './supabase';
import { Platform } from 'react-native';

export interface GameSuggestionData {
  gameName: string;
  gameDescription?: string;
  email?: string;
}

export interface UpcomingGame {
  id: string;
  name: string;
  description: string;
  estimated_timeframe: string;
  created_at?: string;
}

/**
 * Submit a game suggestion using the existing feedback table.
 * The suggestion is stored with a special marker to distinguish it from regular feedback.
 */
export async function submitGameSuggestion(
  data: GameSuggestionData
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Game suggestions are not available in this environment.' };
  }

  try {
    // Use the existing feedback table with a special format
    // Rating of 0 indicates this is a game suggestion, not regular feedback
    const { error } = await supabase.from('feedback').insert({
      game_id: 'suggestion',
      game_name: data.gameName,
      rating: 0, // Special marker for game suggestions
      feedback_text: data.gameDescription || '',
      email: data.email || null,
      age_range: null,
      device_type: Platform.OS === 'web' ? 'web' : 'mobile',
      platform: Platform.OS,
    });

    if (error) {
      console.error('Error submitting game suggestion:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error submitting game suggestion:', err);
    return { success: false, error: 'Failed to submit suggestion. Please try again.' };
  }
}

/**
 * Fetch upcoming games from the upcoming_games table.
 * Includes failsafe handling for when the table doesn't exist yet.
 */
export async function fetchUpcomingGames(): Promise<{
  success: boolean;
  games?: UpcomingGame[];
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Upcoming games are not available in this environment.' };
  }

  try {
    // Try to fetch from the upcoming_games table
    const { data, error } = await supabase
      .from('upcoming_games')
      .select('id, name, description, estimated_timeframe, created_at')
      .eq('is_visible', true)
      .order('display_order', { ascending: true });

    if (error) {
      // Check if it's a "table doesn't exist" error
      if (
        error.code === '42P01' || // PostgreSQL: undefined_table
        error.message?.toLowerCase().includes('does not exist') ||
        error.message?.toLowerCase().includes('relation') ||
        error.code === 'PGRST116' // PostgREST: schema cache lookup failed
      ) {
        // Table doesn't exist yet - this is expected and not an error
        console.log('upcoming_games table not set up yet');
        return { success: true, games: [] };
      }

      console.error('Error fetching upcoming games:', error);
      return { success: false, error: error.message };
    }

    return { success: true, games: data || [] };
  } catch (err) {
    // Handle any unexpected errors gracefully
    console.error('Error fetching upcoming games:', err);

    // Return empty array instead of showing an error to the user
    // This provides a better UX when the table isn't set up yet
    return { success: true, games: [] };
  }
}
