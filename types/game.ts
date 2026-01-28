export type GameType = 'matching' | 'flashcards' | 'trivia' | 'word-games' | 'sequencing' | 'jigsaw-puzzles';

export interface Game {
  id: string;
  title: string;
  description: string;
  gameType: GameType;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  ageRange: string;
  comingSoon?: boolean;
}

export interface GameCategory {
  id: string;
  title: string;
  description: string;
  gameType: GameType;
  games: Game[];
}
