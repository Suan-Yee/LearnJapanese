import { resolveFromRoot, readJson } from "./utils.mjs";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const normalized = await readJson(resolveFromRoot("data", "processed", "normalized.core.json"));
  const lessons = await readJson(resolveFromRoot("data", "processed", "lesson-plan.json"));
  const reviewSeeds = await readJson(resolveFromRoot("data", "processed", "review-seeds.json"));

  assert(normalized?.meta?.counts?.vocabulary > 0, "No vocabulary records in normalized output");
  assert(normalized?.meta?.counts?.kanji > 0, "No kanji records in normalized output");
  assert(Array.isArray(normalized.vocabulary), "normalized.vocabulary must be array");
  assert(Array.isArray(normalized.kanji), "normalized.kanji must be array");
  assert(Array.isArray(normalized.sentences), "normalized.sentences must be array");

  const vocabIds = new Set(normalized.vocabulary.map((v) => v.id));
  const kanjiIds = new Set(normalized.kanji.map((k) => k.id));

  for (const lesson of lessons.lessons) {
    for (const id of lesson.vocabIds) {
      assert(vocabIds.has(id), `Lesson references missing vocab id: ${id}`);
    }
    for (const id of lesson.kanjiIds) {
      assert(kanjiIds.has(id), `Lesson references missing kanji id: ${id}`);
    }
  }

  const expectedSeeds = normalized.vocabulary.length + normalized.kanji.length + normalized.sentences.length;
  assert(reviewSeeds.reviewItems.length === expectedSeeds, "Review seed count mismatch");

  console.log(`Pipeline validation passed (vocab=${normalized.vocabulary.length}, kanji=${normalized.kanji.length}, sentences=${normalized.sentences.length})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
