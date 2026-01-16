import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-4">
        <View className="bg-green-100 w-20 h-20 rounded-3xl items-center justify-center mb-4">
          <FontAwesome name="user" size={32} color="#10b981" />
        </View>
        <Text className="text-2xl font-bold text-slate-800 mb-2">Profile</Text>
        <Text className="text-slate-500 text-center">
          Your profile and settings.{'\n'}Coming soon!
        </Text>
      </View>
    </SafeAreaView>
  );
}
