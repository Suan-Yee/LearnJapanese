import normalizedCore from "@/data/normalized.core.json";
import lessonPlan from "@/data/lesson-plan.json";

export type NormalizedMeaning = {
  en: string;
  my: string;
};

export type NormalizedVocab = {
  id: string;
  jlpt: string;
  writing: {
    kanji: string;
    kana: string;
    primary: string;
  };
  meanings: NormalizedMeaning[];
  pos: string;
};

export type NormalizedKanji = {
  id: string;
  jlpt: string;
  character: string;
  onyomi: string;
  kunyomi: string;
  meanings: NormalizedMeaning[];
};

export type NormalizedSentence = {
  id: string;
  jp: string;
  reading: string;
  en: string;
  my: string;
  vocabIds: string[];
  kanjiIds: string[];
};

type CoreDataShape = {
  vocabulary: NormalizedVocab[];
  kanji: NormalizedKanji[];
  sentences: NormalizedSentence[];
};

type LessonsShape = {
  lessons: {
    id: string;
    jlpt: string;
    lessonNumber: number;
    vocabIds: string[];
    kanjiIds: string[];
  }[];
};

const coreData = normalizedCore as CoreDataShape;
const lessonsData = lessonPlan as LessonsShape;

export function getNormalizedVocabulary() {
  return coreData.vocabulary;
}

export function getNormalizedKanji() {
  return coreData.kanji;
}

export function getNormalizedSentences() {
  return coreData.sentences;
}

export function getNormalizedLessons() {
  return lessonsData.lessons;
}
