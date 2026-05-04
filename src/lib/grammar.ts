import grammarN5Json from "@/json/grammar_n5.json";

export type GrammarLevel = "N5" | "N4";

export type SentenceBreakdown = {
  word: string;
  reading?: string;
  role: "topic" | "subject" | "particle" | "verb" | "noun" | "adjective" | "adverb" | "copula" | "auxiliary" | "conjunction" | "other";
  gloss?: string;
};

export type GrammarExample = {
  ja: string;
  reading: string;
  en: string;
  my: string;
  breakdown?: SentenceBreakdown[];
};

export type Conjugation = {
  headers: string[];
  rows: string[][];
};

export type GrammarPoint = {
  id: string;
  level: GrammarLevel;
  lessonNumber: number;
  lessonTitle: string;
  pattern: string;
  meaning: { en: string; my: string };
  formation: string[];
  explanation: { en: string; my: string };
  conjugation?: Conjugation;
  examples: GrammarExample[];
  tips: string[];
  related: string[];
  tags: string[];
};

export type GrammarLesson = {
  level: GrammarLevel;
  lessonNumber: number;
  title: string;
  totalPoints: number;
  points: GrammarPoint[];
};

type RawGrammarLesson = {
  lesson_metadata: {
    jlpt_level: string;
    lesson_id: number;
    title: string;
    total_points: number;
  };
  grammar_points: {
    id: string;
    pattern: string;
    meaning: { en: string; my: string };
    formation: string[];
    explanation: { en: string; my: string };
    conjugation?: Conjugation;
    examples: GrammarExample[];
    tips: string[];
    related: string[];
    tags: string[];
  }[];
};

export const GRAMMAR_LEVELS: GrammarLevel[] = ["N5"];

const rawLessons = [...grammarN5Json] as RawGrammarLesson[];

export const grammarLessons: GrammarLesson[] = rawLessons.map((lesson) => {
  const level = lesson.lesson_metadata.jlpt_level.toUpperCase() as GrammarLevel;
  const lessonNumber = lesson.lesson_metadata.lesson_id;
  const lessonTitle = lesson.lesson_metadata.title;

  return {
    level,
    lessonNumber,
    title: lessonTitle,
    totalPoints: lesson.lesson_metadata.total_points,
    points: lesson.grammar_points.map((gp) => ({
      ...gp,
      level,
      lessonNumber,
      lessonTitle,
    })),
  };
});

export function getGrammarLevels() {
  return GRAMMAR_LEVELS;
}

export function isGrammarLevel(value: string): value is GrammarLevel {
  return GRAMMAR_LEVELS.includes(value as GrammarLevel);
}

export function getGrammarLessonsByLevel(level: GrammarLevel) {
  return grammarLessons.filter((l) => l.level === level);
}

export function getGrammarLesson(level: GrammarLevel, lessonNumber: number) {
  return grammarLessons.find(
    (l) => l.level === level && l.lessonNumber === lessonNumber
  ) ?? null;
}

export function getGrammarLevelStats(level: GrammarLevel) {
  const lessons = getGrammarLessonsByLevel(level);
  return {
    lessonCount: lessons.length,
    pointCount: lessons.reduce((t, l) => t + l.points.length, 0),
  };
}

export function getGrammarStaticLessonParams() {
  return grammarLessons.map((l) => ({
    level: l.level,
    lessonNumber: String(l.lessonNumber),
  }));
}
