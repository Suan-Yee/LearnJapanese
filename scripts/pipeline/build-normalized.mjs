import {
  resolveFromRoot,
  readJson,
  writeJson,
  stableId,
  toArray,
  todayIsoDate,
  pathExists,
} from "./utils.mjs";
import { normalizeLevel, cleanText, pickMeaning } from "./schemas.mjs";

function normalizeVocabItem(item) {
  const kanji = cleanText(item?.base?.kanji);
  const reading = cleanText(item?.base?.reading);
  const level = normalizeLevel(item?.jlpt);
  const meaning = pickMeaning(item?.logic?.meaning);

  return {
    id: stableId("voc", item?.word_id ?? `${kanji}|${reading}|${level}`),
    sourceId: cleanText(item?.word_id),
    jlpt: level,
    writing: { kanji, kana: reading, primary: kanji || reading },
    meanings: [meaning].filter((m) => m.en || m.my),
    pos: cleanText(item?.logic?.pos),
    category: cleanText(item?.logic?.category),
    usage: toArray(item?.usage).map((u) => ({
      jp: cleanText(u?.jp),
      reading: cleanText(u?.reading),
      en: cleanText(u?.en),
      my: cleanText(u?.my),
    })),
    lessonHint: Number.parseInt(String(item?.word_id).split("-")[0], 10) || null,
    createdAt: todayIsoDate(),
  };
}

function normalizeKanjiLesson(lesson) {
  const meta = lesson?.lesson_metadata ?? {};
  const level = normalizeLevel(meta?.jlpt_level);
  const lessonNumber = Number(meta?.lesson_id ?? 0);
  const lessonTitle = cleanText(meta?.title);

  return toArray(lesson?.vocabulary).map((k, index) => ({
    id: stableId("knj", level, lessonNumber, index, k?.kanji),
    sourceId: `${level}-${lessonNumber}-${index}`,
    jlpt: level,
    lessonNumber,
    lessonTitle,
    character: cleanText(k?.kanji),
    onyomi: cleanText(k?.onyomi),
    kunyomi: cleanText(k?.kunyomi),
    meanings: [pickMeaning(k?.meaning)].filter((m) => m.en || m.my),
    emoji: cleanText(k?.emoji),
    confusing: toArray(k?.confusing_kanji).map(cleanText).filter(Boolean),
    examples: toArray(k?.examples).map((example) => ({
      word: cleanText(example?.kanji),
      reading: cleanText(example?.reading),
      meaning: pickMeaning(example?.meaning),
    })),
    createdAt: todayIsoDate(),
  }));
}

function buildSentenceIndex(vocabulary, kanji, importedTatoebaItems) {
  const seen = new Map();

  const upsert = (key, sentencePatch) => {
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, sentencePatch);
      return;
    }
    existing.vocabIds = Array.from(new Set([...existing.vocabIds, ...sentencePatch.vocabIds]));
    existing.kanjiIds = Array.from(new Set([...existing.kanjiIds, ...sentencePatch.kanjiIds]));
    if (!existing.en && sentencePatch.en) existing.en = sentencePatch.en;
    if (!existing.my && sentencePatch.my) existing.my = sentencePatch.my;
  };

  for (const v of vocabulary) {
    for (const u of v.usage) {
      if (!u.jp) continue;
      const key = `${u.jp}|${u.reading}|${u.en}|${u.my}`;
      upsert(key, {
        id: stableId("sen", key),
        jp: u.jp,
        reading: u.reading,
        en: u.en,
        my: u.my,
        vocabIds: [v.id],
        kanjiIds: [],
      });
    }
  }

  for (const k of kanji) {
    for (const ex of k.examples) {
      if (!ex.word) continue;
      const key = `${ex.word}|${ex.reading}|${ex.meaning.en}|${ex.meaning.my}`;
      upsert(key, {
        id: stableId("sen", key),
        jp: ex.word,
        reading: ex.reading,
        en: ex.meaning.en,
        my: ex.meaning.my,
        vocabIds: [],
        kanjiIds: [k.id],
      });
    }
  }

  for (const item of importedTatoebaItems) {
    const key = `${item.jp}||${item.en}|${item.my}`;
    upsert(key, {
      id: item.id,
      jp: item.jp,
      reading: "",
      en: item.en,
      my: item.my,
      vocabIds: [],
      kanjiIds: [],
    });
  }

  return Array.from(seen.values());
}

function mergeJmdict(vocabulary, jmdictItems) {
  const byPrimary = new Map();
  for (const item of vocabulary) {
    byPrimary.set(item.writing.primary, item);
  }

  for (const jmd of jmdictItems) {
    const primary = jmd?.writing?.primary;
    if (!primary) continue;
    const current = byPrimary.get(primary);
    if (!current) continue;

    const existingEn = new Set(current.meanings.map((m) => m.en).filter(Boolean));
    for (const gloss of toArray(jmd.meanings)) {
      if (!existingEn.has(gloss)) {
        current.meanings.push({ en: gloss, my: "" });
      }
    }

    if (!current.pos && jmd.pos) current.pos = jmd.pos;
  }

  return vocabulary;
}

function mergeKanjidic(kanji, kanjidicItems) {
  const byChar = new Map();
  for (const item of kanji) {
    byChar.set(item.character, item);
  }

  for (const kdd of kanjidicItems) {
    const target = byChar.get(kdd.literal);
    if (!target) continue;

    if ((!target.jlpt || target.jlpt === "N5") && kdd.jlpt) {
      target.jlpt = normalizeLevel(kdd.jlpt);
    }

    const existingEn = new Set(target.meanings.map((m) => m.en).filter(Boolean));
    for (const meaning of toArray(kdd.meanings)) {
      if (!existingEn.has(meaning)) {
        target.meanings.push({ en: meaning, my: "" });
      }
    }
  }

  return kanji;
}

async function maybeReadImport(name) {
  const filePath = resolveFromRoot("data", "processed", "imports", `${name}.json`);
  if (!(await pathExists(filePath))) return { meta: { skipped: true, count: 0 }, items: [] };
  return readJson(filePath);
}

async function main() {
  const vocabRaw = await readJson(resolveFromRoot("src", "json", "vocab.json"));
  const kanjiN5 = await readJson(resolveFromRoot("src", "json", "kanji.json"));
  const kanjiN4 = await readJson(resolveFromRoot("src", "json", "kanji_n4.json"));

  const jmdictImport = await maybeReadImport("jmdict");
  const kanjidicImport = await maybeReadImport("kanjidic");
  const tatoebaImport = await maybeReadImport("tatoeba");

  let vocabulary = toArray(vocabRaw).map(normalizeVocabItem).filter((v) => v.writing.primary);
  let kanji = [...toArray(kanjiN5), ...toArray(kanjiN4)]
    .flatMap(normalizeKanjiLesson)
    .filter((k) => k.character);

  vocabulary = mergeJmdict(vocabulary, toArray(jmdictImport.items));
  kanji = mergeKanjidic(kanji, toArray(kanjidicImport.items));

  const sentences = buildSentenceIndex(vocabulary, kanji, toArray(tatoebaImport.items));

  const output = {
    meta: {
      version: 2,
      generatedAt: new Date().toISOString(),
      counts: {
        vocabulary: vocabulary.length,
        kanji: kanji.length,
        sentences: sentences.length,
      },
      sources: {
        core: ["src/json/vocab.json", "src/json/kanji.json", "src/json/kanji_n4.json"],
        imports: {
          jmdict: jmdictImport.meta,
          kanjidic: kanjidicImport.meta,
          tatoeba: tatoebaImport.meta,
        },
      },
    },
    vocabulary,
    kanji,
    sentences,
  };

  await writeJson(resolveFromRoot("data", "processed", "normalized.core.json"), output);
  await writeJson(resolveFromRoot("src", "data", "normalized.core.json"), output);

  console.log(`Normalized dataset created: vocab=${vocabulary.length}, kanji=${kanji.length}, sentences=${sentences.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
