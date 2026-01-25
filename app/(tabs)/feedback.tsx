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
import { submitFeedback, FeedbackData } from '@/lib/feedback';
import { getIsSupabaseConfigured } from '@/lib/supabase';

export default function FeedbackScreen() {
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(true); // Optimistically show form

  // Check configuration on mount
  useEffect(() => {
    setIsConfigured(getIsSupabaseConfigured());
  }, []);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const data: FeedbackData = {
      rating,
      feedbackText: feedbackText.trim(),
      email: email.trim() || undefined,
    };

    const result = await submitFeedback(data);

    setIsSubmitting(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || 'Failed to submit feedback');
    }
  };

  const handleReset = () => {
    setRating(0);
    setFeedbackText('');
    setEmail('');
    setSubmitted(false);
    setError(null);
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Text style={[styles.star, rating >= star && styles.starSelected]}>
              {rating >= star ? '\u2605' : '\u2606'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (!isConfigured) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centerContent}>
          <FontAwesome name="comment" size={48} color="#cbd5e1" />
          <Text style={styles.unavailableTitle}>Feedback Unavailable</Text>
          <Text style={styles.unavailableText}>
            Feedback is not available in this environment.
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
                Your feedback helps us improve AlephPlay and create better educational games for children.
              </Text>
              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetButtonText}>Send More Feedback</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.header}>
                <FontAwesome name="comment" size={32} color={Colors.primary[500]} />
                <Text style={styles.title}>Share Your Feedback</Text>
                <Text style={styles.subtitle}>
                  We'd love to hear from you! Your feedback helps us make AlephPlay better.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>How would you rate AlephPlay?</Text>
                {renderStars()}
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Tell us more (optional)</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="What do you like? What could be better? Any game suggestions?"
                  placeholderTextColor={Colors.text.secondary}
                  multiline
                  numberOfLines={5}
                  value={feedbackText}
                  onChangeText={setFeedbackText}
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
                  Only if you'd like us to follow up on your feedback
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
                    <Text style={styles.submitButtonText}>Submit Feedback</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
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
    marginBottom: 32,
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
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 40,
    color: '#d1d5db',
  },
  starSelected: {
    color: '#facc15',
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
});
