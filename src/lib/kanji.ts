import kanjiN5Json from "@/json/kanji.json";
import kanjiN4Json from "@/json/kanji_n4.json";

export type KanjiLevel = "N5" | "N4";

export type KanjiMeaning = {
  en: string;
  my: string;
};

export type KanjiExample = {
  word: string;
  reading: string;
  meaning: KanjiMeaning;
};

export type KanjiItem = {
  id: string;
  level: KanjiLevel;
  lessonNumber: number;
  lessonTitle: string;
  character: string;
  onyomi: string;
  kunyomi: string;
  meaning: KanjiMeaning;
  emoji: string;
  examples: KanjiExample[];
  confusing_kanji: string[];
};

export type KanjiLesson = {
  level: KanjiLevel;
  lessonNumber: number;
  title: string;
  totalKanji: number;
  kanji: KanjiItem[];
};

type RawKanjiLesson = {
  lesson_metadata: {
    jlpt_level: string;
    lesson_id: number;
    title: string;
    total_kanji: number;
  };
  vocabulary: {
    kanji: string;
    onyomi: string;
    kunyomi: string;
    meaning: KanjiMeaning;
    emoji: string;
    examples: {
      kanji: string;
      reading: string;
      meaning: KanjiMeaning;
    }[];
    confusing_kanji?: string[];
  }[];
};

export const KANJI_LEVELS: KanjiLevel[] = ["N5", "N4"];

const rawLessons = [...kanjiN5Json, ...kanjiN4Json] as RawKanjiLesson[];

export const kanjiLessons: KanjiLesson[] = rawLessons.map((lesson) => {
  // ... mapping logic remains the same ...
  const level = lesson.lesson_metadata.jlpt_level.toUpperCase() as KanjiLevel;
  const lessonNumber = lesson.lesson_metadata.lesson_id;
  const lessonTitle = lesson.lesson_metadata.title;

  return {
    level,
    lessonNumber,
    title: lessonTitle,
    totalKanji: lesson.lesson_metadata.total_kanji,
    kanji: lesson.vocabulary.map((kanji, index) => ({
      id: `${level}-${lessonNumber}-${index}-${kanji.kanji}`,
      level,
      lessonNumber,
      lessonTitle,
      character: kanji.kanji,
      onyomi: kanji.onyomi,
      kunyomi: kanji.kunyomi,
      meaning: kanji.meaning,
      emoji: kanji.emoji,
      examples: kanji.examples.map((example) => ({
        word: example.kanji,
        reading: example.reading,
        meaning: example.meaning,
      })),
      confusing_kanji: kanji.confusing_kanji || [],
    })),
  };
});

export function getAllKanji() {
  return kanjiLessons.flatMap((lesson) => lesson.kanji);
}

export function getKanjiLevels() {
  return KANJI_LEVELS;
}

export function isKanjiLevel(value: string): value is KanjiLevel {
  return KANJI_LEVELS.includes(value as KanjiLevel);
}

export function getKanjiLessonsByLevel(level: KanjiLevel) {
  return kanjiLessons.filter((lesson) => lesson.level === level);
}

export function getKanjiLesson(level: KanjiLevel, lessonNumber: number) {
  return (
    kanjiLessons.find(
      (lesson) => lesson.level === level && lesson.lessonNumber === lessonNumber,
    ) ?? null
  );
}

export function getKanjiById(id: string) {
  for (const lesson of kanjiLessons) {
    const kanji = lesson.kanji.find((k) => k.id === id);
    if (kanji) return kanji;
  }
  return null;
}

export function getKanjiLevelStats(level: KanjiLevel) {
  const lessons = getKanjiLessonsByLevel(level);

  return {
    lessonCount: lessons.length,
    kanjiCount: lessons.reduce((total, lesson) => total + lesson.kanji.length, 0),
  };
}

export function getKanjiStaticLessonParams() {
  return kanjiLessons.map((lesson) => ({
    level: lesson.level,
    lessonNumber: String(lesson.lessonNumber),
  }));
}
