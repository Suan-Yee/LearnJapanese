import { resolveFromRoot, readTextIfExists, writeJson, stableId } from "./utils.mjs";
import { cleanText } from "./schemas.mjs";

async function main() {
  const sourcePath = resolveFromRoot("data", "raw", "tatoeba.jpn-eng.tsv");
  const tsv = await readTextIfExists(sourcePath);
  if (!tsv) {
    const payload = { meta: { source: "tatoeba.jpn-eng.tsv", importedAt: new Date().toISOString(), count: 0, skipped: true }, items: [] };
    await writeJson(resolveFromRoot("data", "processed", "imports", "tatoeba.json"), payload);
    console.log("Tatoeba import skipped (data/raw/tatoeba.jpn-eng.tsv not found)");
    return;
  }

  const lines = tsv.split(/\r?\n/).filter(Boolean);
  const items = lines.map((line) => {
    const [jp, en, my = ""] = line.split("\t");
    const jpClean = cleanText(jp);
    const enClean = cleanText(en);
    const myClean = cleanText(my);
    return {
      id: stableId("tat", jpClean, enClean, myClean),
      jp: jpClean,
      en: enClean,
      my: myClean,
    };
  }).filter((row) => row.jp);

  const payload = {
    meta: { source: "tatoeba.jpn-eng.tsv", importedAt: new Date().toISOString(), count: items.length, skipped: false },
    items,
  };

  await writeJson(resolveFromRoot("data", "processed", "imports", "tatoeba.json"), payload);
  console.log(`Tatoeba imported: ${items.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
