import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

export default function CategoriesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-4">
        <View className="bg-purple-100 w-20 h-20 rounded-3xl items-center justify-center mb-4">
          <FontAwesome name="th-large" size={32} color="#8b5cf6" />
        </View>
        <Text className="text-2xl font-bold text-slate-800 mb-2">Categories</Text>
        <Text className="text-slate-500 text-center">
          Browse all game categories.{'\n'}Coming soon!
        </Text>
      </View>
    </SafeAreaView>
  );
}
