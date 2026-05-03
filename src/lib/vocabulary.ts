import vocabData from "@/json/vocab.json";

export type JlptLevel = "N5" | "N4";

export type VocabConjugation = {
  jp: string;
  en: string;
  my: string;
};

export type VocabUsage = {
  jp: string;
  reading?: string;
  en: string;
  my: string;
};

export type VocabWord = {
  word_id: string;
  jlpt: JlptLevel;
  base: {
    kanji: string;
    reading: string;
  };
  logic: {
    pos: string;
    category?: string;
    meaning?: {
      en: string;
      my: string;
    };
    conjugations?: Record<string, VocabConjugation>;
    grammar_pattern?: string;
    explanation?: {
      en?: string;
      my?: string;
    };
    usage?: string;
  };
  usage?: VocabUsage[];
};

export const LEVEL_CONFIG: Record<JlptLevel, { startLesson: number; endLesson: number }> = {
  N5: { startLesson: 1, endLesson: 25 },
  N4: { startLesson: 26, endLesson: 50 },
};

const vocabWords = vocabData as VocabWord[];

export function getAllVocabulary() {
  return vocabWords;
}

export function getLevels() {
  return Object.keys(LEVEL_CONFIG) as JlptLevel[];
}

export function isLevel(value: string): value is JlptLevel {
  return value in LEVEL_CONFIG;
}

export function getWordIdParts(wordId: string) {
  const [lesson, wordIndex] = wordId.split("-").map(Number);
  return { lesson, wordIndex };
}

export function getLessonsByLevel(level: JlptLevel) {
  const config = LEVEL_CONFIG[level];
  return Array.from(
    { length: config.endLesson - config.startLesson + 1 },
    (_, index) => config.startLesson + index,
  );
}

export function getWordsByLesson(level: JlptLevel, lessonNumber: number) {
  return vocabWords.filter((word) => {
    const { lesson } = getWordIdParts(word.word_id);
    return word.jlpt === level && lesson === lessonNumber;
  });
}

export function getWordById(wordId: string) {
  return vocabWords.find((word) => word.word_id === wordId) ?? null;
}

export function getWordByRoute(level: JlptLevel, lessonNumber: number, wordIndex: number) {
  const word = getWordById(`${lessonNumber}-${wordIndex}`);
  if (!word || word.jlpt !== level) return null;
  return word;
}

export function getLessonWordCounts(level: JlptLevel) {
  return getLessonsByLevel(level).map((lesson) => ({
    lesson,
    count: getWordsByLesson(level, lesson).length,
  }));
}

export function getPrimaryMeaning(word: VocabWord) {
  if (word.logic.meaning) {
    return {
      en: word.logic.meaning.en ?? "",
      my: word.logic.meaning.my ?? "",
    };
  }

  if (!word.logic.conjugations) {
    return { en: "", my: "" };
  }

  const preferred =
    word.logic.conjugations.plain ??
    word.logic.conjugations.dictionary ??
    word.logic.conjugations.polite ??
    Object.values(word.logic.conjugations)[0];

  return {
    en: preferred?.en ?? "",
    my: preferred?.my ?? "",
  };
}

export function getJapaneseDisplay(word: VocabWord) {
  return word.base.kanji || word.base.reading;
}
