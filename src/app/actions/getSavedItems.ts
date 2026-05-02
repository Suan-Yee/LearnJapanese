"use server";

import { getWordById, type VocabWord } from "@/lib/vocabulary";
import { getKanjiById, type KanjiItem } from "@/lib/kanji";

export async function getSavedVocab(ids: string[]): Promise<VocabWord[]> {
  return ids.map(getWordById).filter((w): w is VocabWord => Boolean(w));
}

export async function getSavedKanji(ids: string[]): Promise<KanjiItem[]> {
  return ids.map(getKanjiById).filter((k): k is KanjiItem => Boolean(k));
}
