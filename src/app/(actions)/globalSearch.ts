
import { getAllVocabulary, getPrimaryMeaning, type VocabWord } from "@/lib/vocabulary";
import { getAllKanji, type KanjiItem } from "@/lib/kanji";

export async function searchGlobal(query: string): Promise<{ vocab: VocabWord[]; kanji: KanjiItem[] }> {
  const normalizedSearch = query.trim().toLowerCase();
  if (!normalizedSearch) return { vocab: [], kanji: [] };

  const allVocab = getAllVocabulary();
  const allKanji = getAllKanji();

  const filteredVocab = allVocab.filter((word) => {
    const meaning = getPrimaryMeaning(word);
    const searchableText = [
      word.logic.pos,
      word.base.kanji,
      word.base.reading,
      meaning.en,
      meaning.my,
      word.logic.grammar_pattern || "",
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearch);
  }).slice(0, 100); // Limit to 100 results for performance

  const filteredKanji = allKanji.filter((kanji) => {
    const searchableText = [
      kanji.character,
      kanji.onyomi,
      kanji.kunyomi,
      kanji.meaning.en,
      kanji.meaning.my,
      ...kanji.examples.flatMap((ex) => [ex.word, ex.reading, ex.meaning.en, ex.meaning.my]),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearch);
  }).slice(0, 100);

  return {
    vocab: filteredVocab,
    kanji: filteredKanji,
  };
}
