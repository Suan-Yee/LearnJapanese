import { resolveFromRoot, readJson, writeJson } from "./utils.mjs";

function makeSeed(itemType, itemId, newIntervalDays) {
  return {
    key: `${itemType}:${itemId}`,
    itemType,
    itemId,
    state: "new",
    ease: 2.5,
    intervalDays: 0,
    dueInDays: newIntervalDays,
    lapses: 0,
    reps: 0,
    lastReviewedAt: null,
  };
}

async function main() {
  const normalized = await readJson(resolveFromRoot("data", "processed", "normalized.core.json"));
  const config = await readJson(resolveFromRoot("scripts", "pipeline", "pipeline.config.json"));
  const newIntervalDays = Number(config?.defaults?.reviewNewIntervalDays ?? 1);

  const reviewItems = [
    ...normalized.vocabulary.map((v) => makeSeed("vocab", v.id, newIntervalDays)),
    ...normalized.kanji.map((k) => makeSeed("kanji", k.id, newIntervalDays)),
    ...normalized.sentences.map((s) => makeSeed("sentence", s.id, newIntervalDays)),
  ];

  const payload = {
    meta: {
      version: 1,
      generatedAt: new Date().toISOString(),
      count: reviewItems.length,
    },
    reviewItems,
  };

  await writeJson(resolveFromRoot("data", "processed", "review-seeds.json"), payload);
  await writeJson(resolveFromRoot("src", "data", "review-seeds.json"), payload);

  console.log(`Review seeds created: ${reviewItems.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
