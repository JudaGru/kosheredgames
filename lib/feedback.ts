import { supabase } from './supabase';
import { Platform } from 'react-native';

export interface FeedbackData {
  gameId?: string;
  gameName?: string;
  rating: number;
  feedbackText: string;
  email?: string;
  ageRange?: string;
}

export interface FeedbackRecord extends FeedbackData {
  id: string;
  createdAt: string;
  deviceType: string;
  platform: string;
}

export async function submitFeedback(data: FeedbackData): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('feedback').insert({
      game_id: data.gameId || null,
      game_name: data.gameName || null,
      rating: data.rating,
      feedback_text: data.feedbackText,
      email: data.email || null,
      age_range: data.ageRange || null,
      device_type: Platform.OS === 'web' ? 'web' : 'mobile',
      platform: Platform.OS,
    });

    if (error) {
      console.error('Error submitting feedback:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error submitting feedback:', err);
    return { success: false, error: 'Failed to submit feedback. Please try again.' };
  }
}
