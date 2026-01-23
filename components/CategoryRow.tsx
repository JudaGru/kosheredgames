import { View, Text } from 'react-native';
import { GameCarousel } from './GameCarousel';
import { useIsMobileLayout } from '@/hooks/useDeviceType';
import type { GameCategory, Game } from '@/types/game';

interface CategoryRowProps {
  category: GameCategory;
  isLoading?: boolean;
  onGamePress?: (game: Game) => void;
  categoryIndex?: number;
  animationKey?: number;
}

export function CategoryRow({
  category,
  isLoading = false,
  onGamePress,
  categoryIndex = 0,
  animationKey = 0,
}: CategoryRowProps) {
  const { isMobile } = useIsMobileLayout();

  return (
    <View className="mb-6">
      {/* Header - simple title only */}
      <View className="px-4 mb-3">
        <Text className={`font-bold text-slate-800 ${isMobile ? 'text-lg' : 'text-xl'}`}>
          {category.title}
        </Text>
      </View>

      {/* Carousel */}
      <GameCarousel
        games={category.games}
        isLoading={isLoading}
        onGamePress={onGamePress}
        categoryIndex={categoryIndex}
        animationKey={animationKey}
      />
    </View>
  );
}

export default CategoryRow;
