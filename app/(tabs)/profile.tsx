import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { FeedbackModal } from '@/components/FeedbackModal';
import { Colors } from '@/constants/Colors';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function ProfileScreen() {
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-4">
        <View className="bg-green-100 w-20 h-20 rounded-3xl items-center justify-center mb-4">
          <FontAwesome name="user" size={32} color="#10b981" />
        </View>
        <Text className="text-2xl font-bold text-slate-800 mb-2">Profile</Text>
        <Text className="text-slate-500 text-center mb-8">
          Your profile and settings.{'\n'}Coming soon!
        </Text>

        {isSupabaseConfigured && (
          <TouchableOpacity
            style={styles.feedbackButton}
            onPress={() => setFeedbackVisible(true)}
          >
            <FontAwesome name="comment" size={18} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.feedbackButtonText}>Send Feedback</Text>
          </TouchableOpacity>
        )}
      </View>

      <FeedbackModal
        visible={feedbackVisible}
        onClose={() => setFeedbackVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[500],
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  feedbackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
