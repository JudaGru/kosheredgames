import { View, Text, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { GameCarousel } from './GameCarousel';
import { useIsMobileLayout } from '@/hooks/useDeviceType';
import type { GameCategory, Game } from '@/types/game';

interface CategoryRowProps {
  category: GameCategory;
  isLoading?: boolean;
  onSeeAll?: () => void;
  onGamePress?: (game: Game) => void;
}

export function CategoryRow({
  category,
  isLoading = false,
  onSeeAll,
  onGamePress
}: CategoryRowProps) {
  const isMobile = useIsMobileLayout();

  return (
    <View className="mb-6">
      {/* Header - simple title only */}
      <View className="flex-row items-center justify-between px-4 mb-3">
        <Text className={`font-bold text-slate-800 ${isMobile ? 'text-lg' : 'text-xl'}`}>
          {category.title}
        </Text>

        {onSeeAll && (
          <Pressable
            onPress={onSeeAll}
            className="flex-row items-center active:opacity-70"
          >
            <Text className="text-teal-600 font-medium text-sm mr-1">
              See All
            </Text>
            <FontAwesome name="chevron-right" size={10} color="#0d9488" />
          </Pressable>
        )}
      </View>

      {/* Carousel */}
      <GameCarousel
        games={category.games}
        isLoading={isLoading}
        onGamePress={onGamePress}
      />
    </View>
  );
}

export default CategoryRow;
