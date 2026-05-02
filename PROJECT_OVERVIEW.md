# Nihongo Trainer Project Overview

Nihongo Trainer is a Next.js 16 App Router app for Japanese study. It has four main sections: kana practice, vocabulary browsing, kanji practice, and a daily quiz. The app uses React 19, TypeScript, Tailwind CSS 4, shadcn/Base UI primitives, lucide-react icons, and framer-motion for animation.

## How The App Runs

- `npm run dev` starts the local Next.js development server.
- `npm run build` creates a production build.
- `npm run start` serves the production build.
- `npm run lint` runs ESLint.

The source code lives under `src/`. The app uses the `@/*` path alias from `tsconfig.json`, so imports like `@/components/ui/button` point to `src/components/ui/button`.

## Routing Structure

This project uses the Next.js App Router in `src/app`.

- `src/app/layout.tsx` is the root layout. It loads Google fonts, global styles, the fixed background, the top navigation, and wraps pages in `RouteTransition`.
- `src/app/page.tsx` redirects `/` to `/vocabulary`.
- `src/app/kana/page.tsx` shows hiragana and katakana grids with detail popups.
- `src/app/vocabulary/page.tsx` shows available JLPT vocabulary levels.
- `src/app/vocabulary/[level]/page.tsx` shows lesson cards for a selected level.
- `src/app/vocabulary/[level]/lesson/[lessonNumber]/page.tsx` shows one lesson's vocabulary table.
- `src/app/vocabulary/[level]/lesson/[lessonNumber]/word/[wordIndex]/page.tsx` shows full conjugation details for one word.
- `src/app/kanji/page.tsx` shows the kanji practice section.
- `src/app/kanji/[level]/page.tsx` shows kanji lessons for a selected JLPT level.
- `src/app/kanji/[level]/lesson/[lessonNumber]/page.tsx` shows one lesson's kanji grid.
- `src/app/quiz/page.tsx` shows the daily quiz.

Dynamic routes use folders like `[level]`, `[lessonNumber]`, and `[wordIndex]`. These pages validate route params and call `notFound()` when a route does not match known data.

## Data Flow

Kana data is loaded from `src/lib/kana.ts`. Vocabulary data is loaded from `src/json/minna_target.json` through `src/lib/vocabulary.ts`.

`src/lib/kana.ts` defines:

- `KanaScript`, `KanaGroup`, `KanaItem`, and `KanaExample` types.
- `kanaItems`, which contains hiragana and katakana base sounds plus voiced sounds.
- `getKanaByScript()` for selecting one script's characters.

`src/lib/vocabulary.ts` defines:

- `JlptLevel`, `VocabWord`, and `VocabConjugation` types.
- `LEVEL_CONFIG`, which maps N5 to lessons 1-25 and N4 to lessons 26-50.
- `getLevels()` for available JLPT levels.
- `isLevel()` for route validation.
- `getLessonsByLevel()` for lesson ranges.
- `getWordsByLesson()` for lesson tables.
- `getWordByRoute()` for word detail pages.
- `getPrimaryMeaning()` and `getJapaneseDisplay()` for common display logic.

Kanji data is loaded from `src/json/kanji.json` through `src/lib/kanji.ts`. Quiz data currently lives as `mockQuestions` inside `src/components/ui-custom/QuizCard.tsx`.

## Kana Components

- `KanaGrid` is the interactive kana study surface. It handles hiragana/katakana switching, search, basic and voiced grids, and the details dialog.
- `KanaContentGate` shows `KanaPageFallback` briefly before the interactive grid is ready.
- `KanaPageFallback` renders a skeleton-only version of the kana controls and grids.
- The kana details dialog uses `KanjiStrokeViewer` to show stroke-order animation for the selected hiragana or katakana character.
- Each kana card includes romaji, and each details popup includes example words from `src/lib/kana.ts`.

## Vocabulary Components

- `VocabularyContentGate` is a client component that delays rendering for a short loading period and shows `VocabularyPageFallback` while waiting.
- `VocabularyPageFallback` renders skeleton-only loading UI for level, lesson, and table views.
- `VocabTable` is the interactive vocabulary lesson table. It handles lesson selection, language preference, search, furigana toggle, local bookmark state, responsive mobile cards, desktop table rows, and navigation to word detail pages.
- `BookmarkWordButton` is the local bookmark toggle used on word detail pages.

Vocabulary pages are mostly server components. They read data from `src/lib/vocabulary.ts`, validate params, and pass serializable data into client components where interactivity is needed.

## Kanji Components

- `KanjiPageFallback` renders kanji skeleton loading UI.
- `KanjiContentGate` shows `KanjiPageFallback` briefly before each kanji view is ready.
- `KanjiGrid` controls lesson selection, language preference, search, pagination, and the details dialog for one JSON-backed kanji lesson.
- `KanjiCard` renders one kanji card and reports clicks back to `KanjiGrid`.
- `KanjiStrokeViewer` converts a kanji character to a Unicode-based KanjiVG filename, fetches the raw stroke SVG from GitHub in the browser, parses SVG paths, and animates them with framer-motion.

## Quiz Components

- `QuizCard` is a client component with local state for the current question, selected answer, correctness, score, and completion screen.
- It uses `AnimatePresence` and `motion` from framer-motion for question transitions.
- The current quiz questions are mock data inside the component.

## Shared UI And Styling

- `src/app/globals.css` configures Tailwind CSS 4, shadcn styles, theme tokens, light/dark CSS variables, base styles, and page transition animation.
- `src/components/ui/*` contains reusable shadcn/Base UI primitives such as `Button`, `Card`, `Badge`, `Dialog`, `Select`, `Switch`, `Table`, and `Tabs`.
- `src/components/ui-custom/Navbar.tsx` renders the main navigation for Kana, Vocabulary, Kanji, and Quiz. It stores the last vocabulary path in `localStorage` so returning to Vocabulary can restore the user's previous vocabulary location.
- `src/components/ui-custom/RouteTransition.tsx` keys page content by pathname to trigger a small CSS fade on route changes.
- `src/lib/utils.ts` exports `cn()`, which combines `clsx` and `tailwind-merge` for clean className composition.

## Main Libraries Used

- Next.js: routing, server components, API routes, metadata, fonts, and caching.
- React: component state, transitions, effects, and Suspense.
- Tailwind CSS: layout, responsive styling, theme tokens, and skeleton animations.
- shadcn/Base UI: accessible UI primitives used by the local component wrappers.
- lucide-react: icons in navigation, buttons, tables, and cards.
- framer-motion: quiz transitions and kanji stroke animation.
- next-themes: installed for theme support, though the current root layout does not wrap the app with the included `ThemeProvider`.

## Current Implementation Notes

- Vocabulary is backed by JSON data.
- Kana is backed by typed local data in `src/lib/kana.ts`.
- Kanji is backed by JSON lesson data.
- Quiz content is currently hardcoded mock data.
- Bookmarks are local component state only and reset on reload.
- Vocabulary and kanji loading UIs intentionally show skeleton content only, with no loading label, description text, or intro panel.
- The KanjiVG stroke viewer depends on GitHub raw content availability for stroke data.
