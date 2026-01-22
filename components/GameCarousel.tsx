import { ScrollView } from 'react-native';
import { GameCard } from './GameCard';
import { GameCardSkeleton } from './GameCardSkeleton';
import type { Game } from '@/types/game';

interface GameCarouselProps {
  games: Game[];
  isLoading?: boolean;
  onGamePress?: (game: Game) => void;
  categoryIndex?: number;
  animationKey?: number;
}

export function GameCarousel({
  games,
  isLoading = false,
  onGamePress,
  categoryIndex = 0,
  animationKey = 0,
}: GameCarouselProps) {
  // Minimal gap like CrazyGames
  const gap = 8;

  if (isLoading) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap,
        }}
        className="flex-row"
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <GameCardSkeleton key={i} />
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap,
      }}
      className="flex-row"
    >
      {games.map((game, index) => (
        <GameCard
          key={game.id}
          game={game}
          onPress={() => onGamePress?.(game)}
          animationIndex={categoryIndex * 6 + index}
          animationKey={animationKey}
        />
      ))}
    </ScrollView>
  );
}

export default GameCarousel;
