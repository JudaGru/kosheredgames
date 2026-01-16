import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

export default function FavoritesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-4">
        <View className="bg-pink-100 w-20 h-20 rounded-3xl items-center justify-center mb-4">
          <FontAwesome name="heart" size={32} color="#ec4899" />
        </View>
        <Text className="text-2xl font-bold text-slate-800 mb-2">Favorites</Text>
        <Text className="text-slate-500 text-center">
          Your favorite games will appear here.{'\n'}Coming soon!
        </Text>
      </View>
    </SafeAreaView>
  );
}
