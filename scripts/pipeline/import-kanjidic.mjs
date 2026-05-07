import { resolveFromRoot, readTextIfExists, writeJson, stableId } from "./utils.mjs";
import { cleanText } from "./schemas.mjs";

function extractCharacters(xml) {
  const pattern = /<character>([\s\S]*?)<\/character>/g;
  const out = [];
  let match;
  while ((match = pattern.exec(xml)) !== null) {
    out.push(match[1]);
  }
  return out;
}

function firstTag(block, tagName) {
  const m = block.match(new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`));
  return cleanText(m?.[1] ?? "");
}

function allMeanings(block) {
  const pattern = /<meaning(?:\s[^>]*)?>([\s\S]*?)<\/meaning>/g;
  const out = [];
  let match;
  while ((match = pattern.exec(block)) !== null) {
    const text = cleanText(match[1]);
    if (text) out.push(text);
  }
  return out;
}

async function main() {
  const sourcePath = resolveFromRoot("data", "raw", "kanjidic2.xml");
  const xml = await readTextIfExists(sourcePath);
  if (!xml) {
    const payload = { meta: { source: "kanjidic2.xml", importedAt: new Date().toISOString(), count: 0, skipped: true }, items: [] };
    await writeJson(resolveFromRoot("data", "processed", "imports", "kanjidic.json"), payload);
    console.log("KANJIDIC2 import skipped (data/raw/kanjidic2.xml not found)");
    return;
  }

  const chars = extractCharacters(xml);
  const items = chars.map((charBlock) => {
    const literal = firstTag(charBlock, "literal");
    const jlpt = firstTag(charBlock, "jlpt");
    const grade = firstTag(charBlock, "grade");
    const strokeCount = firstTag(charBlock, "stroke_count");
    const meanings = allMeanings(charBlock);

    return {
      id: stableId("kdd", literal, jlpt, grade),
      literal,
      jlpt: jlpt ? `N${jlpt}` : "",
      grade,
      strokeCount: Number.parseInt(strokeCount, 10) || null,
      meanings,
    };
  }).filter((item) => item.literal);

  const payload = {
    meta: { source: "kanjidic2.xml", importedAt: new Date().toISOString(), count: items.length, skipped: false },
    items,
  };

  await writeJson(resolveFromRoot("data", "processed", "imports", "kanjidic.json"), payload);
  console.log(`KANJIDIC2 imported: ${items.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
