import { useEffect } from 'react';
import { Platform } from 'react-native';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'game';
  gameData?: {
    name: string;
    description: string;
    gameType: string;
    ageRange: string;
    difficulty: string;
  };
}

const BASE_URL = 'https://alephplay.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export function SEO({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  gameData,
}: SEOProps) {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const fullTitle = `${title} | AlephPlay`;
    const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;

    // Update document title
    document.title = fullTitle;

    // Helper to update or create meta tag
    const updateMeta = (selector: string, content: string, attribute = 'content') => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (element) {
        element.setAttribute(attribute, content);
      } else {
        element = document.createElement('meta');
        const [attr, value] = selector.replace(/[\[\]'"]/g, '').split('=');
        if (attr.startsWith('property')) {
          element.setAttribute('property', value);
        } else if (attr.startsWith('name')) {
          element.setAttribute('name', value);
        }
        element.setAttribute(attribute, content);
        document.head.appendChild(element);
      }
    };

    // Update primary meta tags
    updateMeta('meta[name="title"]', fullTitle);
    updateMeta('meta[name="description"]', description);
    if (keywords) {
      updateMeta('meta[name="keywords"]', keywords);
    }

    // Update Open Graph tags
    updateMeta('meta[property="og:title"]', fullTitle);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[property="og:url"]', fullUrl);
    updateMeta('meta[property="og:image"]', image);
    updateMeta('meta[property="og:type"]', type);

    // Update Twitter tags
    updateMeta('meta[property="twitter:title"]', fullTitle);
    updateMeta('meta[property="twitter:description"]', description);
    updateMeta('meta[property="twitter:url"]', fullUrl);
    updateMeta('meta[property="twitter:image"]', image);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      canonical.href = fullUrl;
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = fullUrl;
      document.head.appendChild(canonical);
    }

    // Add game-specific structured data
    if (gameData) {
      const existingScript = document.querySelector('script[data-seo="game"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'game');
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: gameData.name,
        description: gameData.description,
        url: fullUrl,
        genre: ['Educational', 'Jewish Education', gameData.gameType],
        gamePlatform: 'Web Browser',
        applicationCategory: 'Game',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        audience: {
          '@type': 'EducationalAudience',
          educationalRole: 'student',
          audienceType: `Ages ${gameData.ageRange}`,
        },
        educationalLevel: gameData.difficulty,
        inLanguage: 'en',
        isAccessibleForFree: true,
        publisher: {
          '@type': 'Organization',
          name: 'AlephPlay',
          url: BASE_URL,
        },
      });
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      const gameScript = document.querySelector('script[data-seo="game"]');
      if (gameScript) {
        gameScript.remove();
      }
    };
  }, [title, description, keywords, image, url, type, gameData]);

  return null;
}

// Pre-defined SEO configs for common pages
export const seoConfigs = {
  home: {
    title: 'Free Jewish Educational Games for Kids',
    description:
      'Free educational Jewish games for children. Learn Torah, Hebrew, Parsha, holidays and more through fun matching games, flashcards, word searches, trivia, and puzzles. Safe, ad-free learning for ages 4+.',
    keywords:
      'Jewish games, Torah games, Hebrew learning, Parsha games, Jewish education, kosher games, kids games, educational games',
    url: '/',
  },
  categories: {
    title: 'Game Categories',
    description:
      'Browse all categories of Jewish educational games including matching games, flashcards, word searches, trivia, crosswords, and jigsaw puzzles.',
    keywords: 'Jewish game categories, Torah learning categories, Hebrew games by type',
    url: '/categories',
  },
  favorites: {
    title: 'My Favorite Games',
    description: 'Your saved favorite Jewish educational games. Quick access to the games you love most.',
    url: '/favorites',
  },
};

// Helper to generate game SEO config
export function getGameSEOConfig(game: {
  title: string;
  description: string;
  gameType: string;
  topic: string;
  ageRange: string;
  difficulty: string;
  route: string;
}) {
  const gameTypeLabels: Record<string, string> = {
    matching: 'Matching Game',
    flashcards: 'Flashcards',
    trivia: 'Trivia Game',
    'word-games': 'Word Game',
    'jigsaw-puzzles': 'Jigsaw Puzzle',
    sequencing: 'Sequencing Game',
  };

  const gameTypeLabel = gameTypeLabels[game.gameType] || 'Game';

  return {
    title: `${game.title} - Free ${gameTypeLabel}`,
    description: `${game.description} A free Jewish educational ${gameTypeLabel.toLowerCase()} about ${game.topic} for ages ${game.ageRange}. Play now at AlephPlay!`,
    keywords: `${game.title}, ${game.topic}, Jewish ${gameTypeLabel.toLowerCase()}, Torah games, Hebrew learning, kids games, educational games, ${game.topic} game`,
    url: game.route,
    type: 'game' as const,
    gameData: {
      name: game.title,
      description: game.description,
      gameType: gameTypeLabel,
      ageRange: game.ageRange,
      difficulty: game.difficulty,
    },
  };
}
