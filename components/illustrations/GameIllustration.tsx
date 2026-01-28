import { MatchingIllustration } from './MatchingIllustration';
import { TwelveTribesIllustration } from './TwelveTribesIllustration';
import { FlashcardsIllustration } from './FlashcardsIllustration';
import { TriviaIllustration } from './TriviaIllustration';
import { WordGamesIllustration } from './WordGamesIllustration';
import { HanukkahWordSearchIllustration } from './HanukkahWordSearchIllustration';
import { ShabbosWordSearchIllustration } from './ShabbosWordSearchIllustration';
import { PurimWordSearchIllustration } from './PurimWordSearchIllustration';
import { PesachWordSearchIllustration } from './PesachWordSearchIllustration';
import { RoshHashanahWordSearchIllustration } from './RoshHashanahWordSearchIllustration';
import { TorahWordSearchIllustration } from './TorahWordSearchIllustration';
import { BereishisFlashcardsIllustration } from './BereishisFlashcardsIllustration';
import { JewishHistoryTriviaIllustration } from './JewishHistoryTriviaIllustration';
import { SequencingIllustration } from './SequencingIllustration';
import { TenMakkosIllustration } from './TenMakkosIllustration';
import { CrosswordIllustration } from './CrosswordIllustration';
import { TrueFalseIllustration } from './TrueFalseIllustration';
import { WhoAmIIllustration } from './WhoAmIIllustration';
import { JigsawPuzzlesIllustration } from './JigsawPuzzlesIllustration';
import { AlefBeisMatchIllustration } from './AlefBeisMatchIllustration';
import { BrachosMatchIllustration } from './BrachosMatchIllustration';
import { HolidayMatchIllustration } from './HolidayMatchIllustration';
import { AnimalMatchIllustration } from './AnimalMatchIllustration';
import { ShabbosMatchIllustration } from './ShabbosMatchIllustration';
import { MidosMatchIllustration } from './MidosMatchIllustration';
import { ParshaMatchIllustration } from './ParshaMatchIllustration';
import { MishnayosMatchIllustration } from './MishnayosMatchIllustration';
import { NoachFlashcardsIllustration } from './NoachFlashcardsIllustration';
import { LechLechaFlashcardsIllustration } from './LechLechaFlashcardsIllustration';
import { PesachFlashcardsIllustration } from './PesachFlashcardsIllustration';
import { ShavuosFlashcardsIllustration } from './ShavuosFlashcardsIllustration';
import { PurimFlashcardsIllustration } from './PurimFlashcardsIllustration';
import { YehoshuaFlashcardsIllustration } from './YehoshuaFlashcardsIllustration';
import { ShabbosCrosswordIllustration } from './ShabbosCrosswordIllustration';
import { PurimCrosswordIllustration } from './PurimCrosswordIllustration';
import { PesachCrosswordIllustration } from './PesachCrosswordIllustration';
import { HanukkahCrosswordIllustration } from './HanukkahCrosswordIllustration';
import { RoshHashanahCrosswordIllustration } from './RoshHashanahCrosswordIllustration';
import { TorahCrosswordIllustration } from './TorahCrosswordIllustration';
import { ShabbosJigsawIllustration } from './ShabbosJigsawIllustration';
import { SukkosJigsawIllustration } from './SukkosJigsawIllustration';
import { PurimJigsawIllustration } from './PurimJigsawIllustration';
import { TorahJigsawIllustration } from './TorahJigsawIllustration';
import { ParshaTriviaIllustration } from './ParshaTriviaIllustration';
import { HalachaTriviaIllustration } from './HalachaTriviaIllustration';
import { NachTrueFalseIllustration } from './NachTrueFalseIllustration';
import { HolidaysTrueFalseIllustration } from './HolidaysTrueFalseIllustration';
import { DaysOfCreationIllustration } from './DaysOfCreationIllustration';
import { JewishHolidaysOrderIllustration } from './JewishHolidaysOrderIllustration';
import { AvosImahosIllustration } from './AvosImahosIllustration';
import { NachWhoAmIIllustration } from './NachWhoAmIIllustration';
import { GedolimWhoAmIIllustration } from './GedolimWhoAmIIllustration';
import { LetterGridIllustration } from './LetterGridIllustration';
import { Colors, getTopicColor } from '@/constants/Colors';
import type { GameType } from '@/types/game';

interface GameIllustrationProps {
  gameType: GameType;
  topic?: string;
  title?: string;
  gameId?: string;
  width: number;
  height: number;
}

export function GameIllustration({ gameType, topic, title, gameId, width, height }: GameIllustrationProps) {
  const gameColors = Colors.gameColors[gameType];
  const topicAccent = topic ? getTopicColor(topic) : '#fde047';

  const props = {
    width,
    height,
    primaryColor: gameColors.primary,
    secondaryColor: gameColors.secondary,
    accentColor: topicAccent,
    title,
  };

  // Check for specific game illustrations first
  if (gameId === 'word-hanukkah-search') {
    return <HanukkahWordSearchIllustration {...props} />;
  }
  if (gameId === 'word-shabbos-search') {
    return <ShabbosWordSearchIllustration {...props} />;
  }
  if (gameId === 'word-purim-search') {
    return <PurimWordSearchIllustration {...props} />;
  }
  if (gameId === 'word-pesach-search') {
    return <PesachWordSearchIllustration {...props} />;
  }
  if (gameId === 'word-rosh-hashanah-search') {
    return <RoshHashanahWordSearchIllustration {...props} />;
  }
  if (gameId === 'word-torah-search') {
    return <TorahWordSearchIllustration {...props} />;
  }
  if (gameId === 'flash-bereishis-basics') {
    return <BereishisFlashcardsIllustration {...props} />;
  }
  if (gameId === 'trivia-jewish-history') {
    return <JewishHistoryTriviaIllustration {...props} />;
  }
  if (gameId === 'sequence-ten-makkos') {
    return <TenMakkosIllustration {...props} />;
  }
  if (gameId === 'word-parsha-crossword') {
    return <CrosswordIllustration {...props} />;
  }
  if (gameId === 'trivia-true-false') {
    return <TrueFalseIllustration {...props} />;
  }
  if (gameId === 'trivia-who-am-i') {
    return <WhoAmIIllustration {...props} />;
  }
  if (gameId === 'match-12-tribes') {
    return <TwelveTribesIllustration {...props} />;
  }
  if (gameId === 'match-hebrew-letters') {
    return <AlefBeisMatchIllustration {...props} />;
  }
  if (gameId === 'match-brachos') {
    return <BrachosMatchIllustration {...props} />;
  }
  if (gameId === 'match-holidays') {
    return <HolidayMatchIllustration {...props} />;
  }
  if (gameId === 'match-parsha') {
    return <ParshaMatchIllustration {...props} />;
  }
  if (gameId === 'match-mishnayos') {
    return <MishnayosMatchIllustration {...props} />;
  }
  if (gameId === 'match-animals') {
    return <AnimalMatchIllustration {...props} />;
  }
  if (gameId === 'match-shabbos') {
    return <ShabbosMatchIllustration {...props} />;
  }
  if (gameId === 'match-midos') {
    return <MidosMatchIllustration {...props} />;
  }
  if (gameId === 'flash-noach') {
    return <NoachFlashcardsIllustration {...props} />;
  }
  if (gameId === 'flash-lech-lecha') {
    return <LechLechaFlashcardsIllustration {...props} />;
  }
  if (gameId === 'flash-pesach') {
    return <PesachFlashcardsIllustration {...props} />;
  }
  if (gameId === 'flash-shavuos') {
    return <ShavuosFlashcardsIllustration {...props} />;
  }
  if (gameId === 'flash-purim') {
    return <PurimFlashcardsIllustration {...props} />;
  }
  if (gameId === 'flash-yehoshua') {
    return <YehoshuaFlashcardsIllustration {...props} />;
  }
  if (gameId === 'word-shabbos-crossword') {
    return <ShabbosCrosswordIllustration {...props} />;
  }
  if (gameId === 'word-purim-crossword') {
    return <PurimCrosswordIllustration {...props} />;
  }
  if (gameId === 'word-pesach-crossword') {
    return <PesachCrosswordIllustration {...props} />;
  }
  if (gameId === 'word-hanukkah-crossword') {
    return <HanukkahCrosswordIllustration {...props} />;
  }
  if (gameId === 'word-rosh-hashanah-crossword') {
    return <RoshHashanahCrosswordIllustration {...props} />;
  }
  if (gameId === 'word-torah-crossword') {
    return <TorahCrosswordIllustration {...props} />;
  }
  if (gameId === 'jigsaw-shabbos') {
    return <ShabbosJigsawIllustration {...props} />;
  }
  if (gameId === 'jigsaw-sukkos') {
    return <SukkosJigsawIllustration {...props} />;
  }
  if (gameId === 'jigsaw-purim') {
    return <PurimJigsawIllustration {...props} />;
  }
  if (gameId === 'jigsaw-torah') {
    return <TorahJigsawIllustration {...props} />;
  }
  if (gameId === 'trivia-parsha') {
    return <ParshaTriviaIllustration {...props} />;
  }
  if (gameId === 'trivia-halacha') {
    return <HalachaTriviaIllustration {...props} />;
  }
  if (gameId === 'trivia-nach-true-false') {
    return <NachTrueFalseIllustration {...props} />;
  }
  if (gameId === 'trivia-holidays-true-false') {
    return <HolidaysTrueFalseIllustration {...props} />;
  }
  if (gameId === 'sequence-creation') {
    return <DaysOfCreationIllustration {...props} />;
  }
  if (gameId === 'sequence-yomim-tovim') {
    return <JewishHolidaysOrderIllustration {...props} />;
  }
  if (gameId === 'sequence-avos') {
    return <AvosImahosIllustration {...props} />;
  }
  if (gameId === 'trivia-nach-who-am-i') {
    return <NachWhoAmIIllustration {...props} />;
  }
  if (gameId === 'trivia-gedolim-who-am-i') {
    return <GedolimWhoAmIIllustration {...props} />;
  }
  if (gameId === 'letter-grid-torah') {
    return <LetterGridIllustration {...props} />;
  }

  switch (gameType) {
    case 'matching':
      return <MatchingIllustration {...props} />;
    case 'flashcards':
      return <FlashcardsIllustration {...props} />;
    case 'trivia':
      return <TriviaIllustration {...props} />;
    case 'word-games':
      return <WordGamesIllustration {...props} />;
    case 'sequencing':
      return <SequencingIllustration {...props} />;
    case 'jigsaw-puzzles':
      return <JigsawPuzzlesIllustration {...props} />;
    default:
      return <MatchingIllustration {...props} />;
  }
}

export default GameIllustration;
