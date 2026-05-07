import { resolveFromRoot, readTextIfExists, writeJson, stableId } from "./utils.mjs";
import { cleanText } from "./schemas.mjs";

function extractEntries(xml) {
  const entryPattern = /<entry>([\s\S]*?)<\/entry>/g;
  const entries = [];
  let match;
  while ((match = entryPattern.exec(xml)) !== null) {
    entries.push(match[1]);
  }
  return entries;
}

function firstTag(block, tagName) {
  const m = block.match(new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`));
  return cleanText(m?.[1] ?? "");
}

function allTags(block, tagName) {
  const pattern = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, "g");
  const values = [];
  let match;
  while ((match = pattern.exec(block)) !== null) {
    const value = cleanText(match[1]);
    if (value) values.push(value);
  }
  return values;
}

async function main() {
  const sourcePath = resolveFromRoot("data", "raw", "JMdict_e.xml");
  const xml = await readTextIfExists(sourcePath);
  if (!xml) {
    const payload = { meta: { source: "JMdict_e.xml", importedAt: new Date().toISOString(), count: 0, skipped: true }, items: [] };
    await writeJson(resolveFromRoot("data", "processed", "imports", "jmdict.json"), payload);
    console.log("JMdict import skipped (data/raw/JMdict_e.xml not found)");
    return;
  }

  const entries = extractEntries(xml);
  const items = entries.map((entry) => {
    const kanji = firstTag(entry, "keb");
    const reading = firstTag(entry, "reb");
    const glosses = allTags(entry, "gloss");
    const pos = allTags(entry, "pos").join(", ");

    return {
      id: stableId("jmd", kanji, reading, glosses.join("|")),
      writing: { kanji, kana: reading, primary: kanji || reading },
      meanings: glosses,
      pos,
    };
  }).filter((item) => item.writing.primary);

  const payload = {
    meta: { source: "JMdict_e.xml", importedAt: new Date().toISOString(), count: items.length, skipped: false },
    items,
  };

  await writeJson(resolveFromRoot("data", "processed", "imports", "jmdict.json"), payload);
  console.log(`JMdict imported: ${items.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
