import { resolveFromRoot, readJson, writeJson, chunk } from "./utils.mjs";

async function main() {
  const normalized = await readJson(resolveFromRoot("data", "processed", "normalized.core.json"));
  const config = await readJson(resolveFromRoot("scripts", "pipeline", "pipeline.config.json"));

  const vocabByLevel = new Map();
  const kanjiByLevel = new Map();

  for (const v of normalized.vocabulary) {
    const list = vocabByLevel.get(v.jlpt) ?? [];
    list.push(v);
    vocabByLevel.set(v.jlpt, list);
  }

  for (const k of normalized.kanji) {
    const list = kanjiByLevel.get(k.jlpt) ?? [];
    list.push(k);
    kanjiByLevel.set(k.jlpt, list);
  }

  const levels = Array.from(new Set([...vocabByLevel.keys(), ...kanjiByLevel.keys()]));
  const lessons = [];

  for (const level of levels) {
    const rule = config.lessonSizing[level] ?? { vocabPerLesson: 20, kanjiPerLesson: 12 };
    const vocabChunks = chunk(vocabByLevel.get(level) ?? [], rule.vocabPerLesson);
    const kanjiChunks = chunk(kanjiByLevel.get(level) ?? [], rule.kanjiPerLesson);
    const max = Math.max(vocabChunks.length, kanjiChunks.length);

    for (let i = 0; i < max; i += 1) {
      lessons.push({
        id: `${level}-L${String(i + 1).padStart(2, "0")}`,
        jlpt: level,
        lessonNumber: i + 1,
        vocabIds: (vocabChunks[i] ?? []).map((v) => v.id),
        kanjiIds: (kanjiChunks[i] ?? []).map((k) => k.id),
      });
    }
  }

  const payload = {
    meta: {
      version: 1,
      generatedAt: new Date().toISOString(),
      count: lessons.length,
    },
    lessons,
  };

  await writeJson(resolveFromRoot("data", "processed", "lesson-plan.json"), payload);
  await writeJson(resolveFromRoot("src", "data", "lesson-plan.json"), payload);

  console.log(`Lesson plan created: ${lessons.length} lessons`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
