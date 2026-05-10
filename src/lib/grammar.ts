import grammarN5Json from "@/json/grammar_n5.json";

export type GrammarLevel = "N5" | "N4";

export type SentenceBreakdown = {
  word: string;
  reading?: string;
  role:
    | "topic"
    | "subject"
    | "particle"
    | "verb"
    | "noun"
    | "adjective"
    | "adverb"
    | "copula"
    | "auxiliary"
    | "conjunction"
    | "other";
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

type LegacyRawGrammarLesson = {
  lesson_metadata: {
    jlpt_level: string;
    lesson_id: number;
    title: string;
    total_points: number;
  };
  grammar_points: LegacyRawGrammarPoint[];
};

type LegacyRawGrammarPoint = {
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
};

type NewRawGrammarLesson = {
  course?: string;
  chapter: number;
  title: string;
  grammar_points: NewRawGrammarPoint[];
};

type NewRawGrammarPoint = {
  id: string;
  pattern: string;
  explanation?: string;
  translation_burmese?: string;
  meaning?: string;
  formation?: string[] | string;
  examples?: NewRawGrammarExample[];
  notes?: string | string[];
  tips?: string | string[];
  related?: string[];
  tags?: string[];
  conjugation?: Conjugation;
};

type NewRawGrammarExample = {
  japanese?: string;
  ja?: string;
  furigana?: string;
  reading?: string;
  romaji?: string;
  english?: string;
  en?: string;
  translation_burmese?: string;
  my?: string;
};

type RawGrammarLesson = LegacyRawGrammarLesson | NewRawGrammarLesson;

export const GRAMMAR_LEVELS: GrammarLevel[] = ["N5"];

const rawLessons = [...grammarN5Json] as RawGrammarLesson[];

function isLegacyLesson(lesson: RawGrammarLesson): lesson is LegacyRawGrammarLesson {
  return "lesson_metadata" in lesson;
}

function toArray(value?: string | string[]) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : value.trim() ? [value] : [];
}

function isNormalizedExample(example: GrammarExample | NewRawGrammarExample): example is GrammarExample {
  return (
    "ja" in example &&
    "en" in example &&
    "my" in example &&
    typeof example.ja === "string" &&
    typeof example.en === "string" &&
    typeof example.my === "string"
  );
}

function normalizeExample(example: GrammarExample | NewRawGrammarExample): GrammarExample {
  if (isNormalizedExample(example)) return example;

  return {
    ja: example.japanese ?? "",
    reading: example.furigana ?? example.reading ?? example.romaji ?? "",
    en: example.english ?? example.en ?? "",
    my: example.translation_burmese ?? example.my ?? "",
  };
}

function isLegacyPoint(
  point: LegacyRawGrammarPoint | NewRawGrammarPoint,
): point is LegacyRawGrammarPoint {
  return (
    "meaning" in point &&
    typeof point.meaning === "object" &&
    point.meaning !== null &&
    "formation" in point &&
    Array.isArray(point.formation)
  );
}

function normalizePoint(
  point: LegacyRawGrammarPoint | NewRawGrammarPoint,
  level: GrammarLevel,
  lessonNumber: number,
  lessonTitle: string,
): GrammarPoint {
  if (isLegacyPoint(point)) {
    return {
      ...point,
      examples: point.examples.map((example) => normalizeExample(example)),
      level,
      lessonNumber,
      lessonTitle,
    };
  }

  const notes = toArray(point.notes);
  const tips = toArray(point.tips);
  const explanationEn = point.explanation ?? point.meaning ?? "";
  const explanationMy = point.translation_burmese ?? "";

  return {
    id: point.id,
    level,
    lessonNumber,
    lessonTitle,
    pattern: point.pattern,
    meaning: {
      en: point.meaning ?? explanationEn,
      my: point.translation_burmese ?? "",
    },
    formation: Array.isArray(point.formation)
      ? point.formation
      : point.formation
        ? [point.formation]
        : [point.pattern],
    explanation: {
      en: explanationEn,
      my: explanationMy,
    },
    conjugation: point.conjugation,
    examples: (point.examples ?? []).map((example) => normalizeExample(example)),
    tips: [...notes, ...tips],
    related: point.related ?? [],
    tags: point.tags ?? [],
  };
}

export const grammarLessons: GrammarLesson[] = rawLessons.map((lesson) => {
  if (isLegacyLesson(lesson)) {
    const level = lesson.lesson_metadata.jlpt_level.toUpperCase() as GrammarLevel;
    const lessonNumber = lesson.lesson_metadata.lesson_id;
    const lessonTitle = lesson.lesson_metadata.title;

    return {
      level,
      lessonNumber,
      title: lessonTitle,
      totalPoints: lesson.lesson_metadata.total_points,
      points: lesson.grammar_points.map((point) =>
        normalizePoint(point, level, lessonNumber, lessonTitle),
      ),
    };
  }

  const level: GrammarLevel = "N5";
  const lessonNumber = lesson.chapter;
  const lessonTitle = lesson.title;

  return {
    level,
    lessonNumber,
    title: lessonTitle,
    totalPoints: lesson.grammar_points.length,
    points: lesson.grammar_points.map((point) =>
      normalizePoint(point, level, lessonNumber, lessonTitle),
    ),
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
  return grammarLessons.find((l) => l.level === level && l.lessonNumber === lessonNumber) ?? null;
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

export function getGrammarPointById(pointId: string): GrammarPoint | null {
  for (const lesson of grammarLessons) {
    const found = lesson.points.find((p) => p.id === pointId);
    if (found) return found;
  }
  return null;
}

export type ResolvedRelatedGrammar =
  | {
      kind: "link";
      id: string;
      pattern: string;
      level: GrammarLevel;
      lessonNumber: number;
    }
  | { kind: "text"; label: string };

export function resolveRelatedPoints(related: string[]): ResolvedRelatedGrammar[] {
  return related.map((ref) => {
    const resolved = getGrammarPointById(ref);
    if (resolved) {
      return {
        kind: "link",
        id: resolved.id,
        pattern: resolved.pattern,
        level: resolved.level,
        lessonNumber: resolved.lessonNumber,
      };
    }
    return { kind: "text", label: ref };
  });
}

export function getGrammarLessonPointParams() {
  return grammarLessons.flatMap((l) =>
    l.points.map((p) => ({
      level: l.level,
      lessonNumber: String(l.lessonNumber),
      pointId: p.id,
    })),
  );
}

export function getGrammarPointInLesson(
  level: GrammarLevel,
  lessonNumber: number,
  pointId: string,
): GrammarPoint | null {
  const lesson = getGrammarLesson(level, lessonNumber);
  if (!lesson) return null;
  return lesson.points.find((p) => p.id === pointId) ?? null;
}
