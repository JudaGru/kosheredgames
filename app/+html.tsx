import { ScrollViewStyleReset } from 'expo-router/html';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />

        {/* Primary Meta Tags */}
        <title>AlephPlay - Fun Jewish Educational Games for Kids - Ad-Free</title>
        <meta name="title" content="AlephPlay - Fun Jewish Educational Games for Kids - Ad-Free" />
        <meta
          name="description"
          content="Fun educational Jewish games for children. Learn Torah, Hebrew, Parsha, holidays and more through fun matching games, flashcards, word searches, trivia, and puzzles. Safe, ad-free learning for ages 4+."
        />
        <meta
          name="keywords"
          content="Jewish games, Torah games, Hebrew learning, Parsha games, Jewish education, kosher games, kids games, educational games, Shabbos games, holiday games, flashcards, word search, trivia, matching games"
        />
        <meta name="author" content="AlephPlay" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://alephplay.com" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alephplay.com/" />
        <meta property="og:title" content="AlephPlay - Fun Jewish Educational Games for Kids - Ad-Free" />
        <meta
          property="og:description"
          content="Fun, ad-free educational Jewish games for children. Learn Torah, Hebrew, Parsha, holidays and more through fun matching games, flashcards, word searches, trivia, and puzzles."
        />
        <meta property="og:image" content="https://alephplay.com/og-image.png" />
        <meta property="og:site_name" content="AlephPlay" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://alephplay.com/" />
        <meta property="twitter:title" content="AlephPlay - Fun Jewish Educational Games for Kids - Ad-Free" />
        <meta
          property="twitter:description"
          content="Fun, ad-free educational Jewish games for children. Learn Torah, Hebrew, Parsha, holidays and more through fun matching games, flashcards, word searches, trivia, and puzzles."
        />
        <meta property="twitter:image" content="https://alephplay.com/og-image.png" />

        {/* Additional SEO */}
        <meta name="theme-color" content="#0d9488" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AlephPlay" />
        <meta name="application-name" content="AlephPlay" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Favicon and Icons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/favicon.svg" color="#0d9488" />
        <meta name="msapplication-TileColor" content="#0d9488" />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'AlephPlay',
              url: 'https://alephplay.com',
              description: 'Fun, ad-free educational Jewish games for children',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://alephplay.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* Structured Data - Educational Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'AlephPlay',
              url: 'https://alephplay.com',
              description: 'Fun, ad-free educational Jewish games for children to learn Torah, Hebrew, and Jewish traditions',
              areaServed: 'Worldwide',
              audience: {
                '@type': 'EducationalAudience',
                educationalRole: 'student',
                audienceType: 'Children',
              },
            }),
          }}
        />

        {/* Structured Data - Software Application */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'AlephPlay',
              applicationCategory: 'EducationalApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5',
                ratingCount: '1',
              },
            }),
          }}
        />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QDXJ8YHQLY" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QDXJ8YHQLY', {
                send_page_view: false
              });
            `,
          }}
        />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Using raw CSS styles as an escape-hatch to ensure the background color never flickers in dark-mode. */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #fff;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}`;
