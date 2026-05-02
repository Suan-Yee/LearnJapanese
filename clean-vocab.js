const fs = require('fs/promises');
const path = require('path');

const API_KEY = process.env.API_KEY
if (!API_KEY) {
  console.error("ERROR: Please set the GEMINI_API_KEY environment variable.");
  console.error("Example: $env:GEMINI_API_KEY='your_key_here'; node clean-vocab.js");
  process.exit(1);
}

const INPUT_FILE = path.join(process.cwd(), 'src/json/minna_target.json');
const OUTPUT_FILE = path.join(process.cwd(), 'src/json/minna_target_corrected.json');
const BATCH_SIZE = 50; // Small batch to ensure the LLM outputs full valid JSON
const DELAY_MS = 6000; // 4 seconds delay between requests to prevent rate limiting

const PROMPT = `I am providing a JSON array of Japanese vocabulary. Please clean and correct the data according to these strict linguistic rules:

1. POS (Part of Speech) Logic:
   - NOUNS: If the word is a person, place, or thing (e.g., 社員, 学校, 肉), set logic.pos to "noun". CRITICAL: Nouns MUST NOT have conjugations. Delete the 'conjugations' object or set it to null for Nouns.
   - VERBS: Must represent a physical or mental action. 
     * Update logic.pos to "verb-group-1" (U-verbs), "verb-group-2" (Ru-verbs), or "verb-group-3" (Irregulars: 来る/する).
     * Special Case: If it's a "Suru-Noun" (e.g., 勉強, 掃除), set logic.pos to "suru-noun".
   - ADJECTIVES: Set logic.pos to "adjective-i" or "adjective-na".

2. Burmese (Unicode) Accuracy:
   - Provide the primary Burmese meaning inside 'logic.conjugations.dictionary.my'.
   - If it is a Verb, provide the Burmese meaning for each conjugation (polite, negative, past, te) reflecting the grammar change.
   - If it is a Noun, ensure the Burmese meaning is only in a simple definition field or the dictionary field.

3. Kanji & Reading:
   - Ensure 'base.reading' is the correct Hiragana for 'base.kanji' in an N5 context.

4. Quiz Categorization:
   - Add a "category" field inside the 'logic' object. Use one of these: "people", "work", "food", "nature", "time", "action", "object", "place".

Return ONLY the corrected JSON array. No conversational text. Keep the exact structure of the input objects: { word_id, jlpt, base: { kanji, reading }, logic: { pos, category, conjugations: { ... } } }.

Here is the JSON to correct:
`;

async function processBatch(batch) {
  // Use v1 for stable Gemini 3 Flash access
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const payload = {
    contents: [{ parts: [{ text: PROMPT + JSON.stringify(batch, null, 2) }] }],
    generationConfig: {
      temperature: 0.1
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  // Safety check: ensure the candidates and parts exist before accessing
  if (!data.candidates || !data.candidates[0].content.parts[0].text) {
    throw new Error("Unexpected API response structure");
  }

  let text = data.candidates[0].content.parts[0].text;

  // Strip markdown formatting if the model wraps it in ```json ... ```
  if (text.startsWith("```json")) {
    text = text.replace(/^```json\n/, "").replace(/\n```$/, "");
  } else if (text.startsWith("```")) {
    text = text.replace(/^```\n/, "").replace(/\n```$/, "");
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON response. Raw text:", text.substring(0, 500) + '...');
    throw e;
  }
}

async function main() {
  console.log("Loading vocabulary file...");
  const rawData = await fs.readFile(INPUT_FILE, 'utf-8');
  const vocabList = JSON.parse(rawData);
  const correctedVocabList = [];

  console.log(`Starting processing of ${vocabList.length} items in batches of ${BATCH_SIZE}...`);

  for (let i = 0; i < vocabList.length; i += BATCH_SIZE) {
    const batch = vocabList.slice(i, i + BATCH_SIZE);
    const currentBatchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(vocabList.length / BATCH_SIZE);

    console.log(`\nProcessing batch ${currentBatchNum} / ${totalBatches} (Items ${i + 1} to ${i + batch.length})...`);

    let success = false;
    let retries = 5;

    while (!success && retries > 0) {
      try {
        const correctedBatch = await processBatch(batch);
        correctedVocabList.push(...correctedBatch);
        success = true;
        console.log(`✅ Batch ${currentBatchNum} succeeded.`);
      } catch (error) {
        retries--;
        console.error(`❌ Error processing batch: ${error.message}. Retries left: ${retries}`);
        if (retries === 0) {
          console.error("Failed completely on this batch. Saving progress up to this point and exiting.");
          await fs.writeFile(OUTPUT_FILE, JSON.stringify(correctedVocabList, null, 4));
          process.exit(1);
        }
        console.log("Waiting 5 seconds before retrying...");
        await new Promise(r => setTimeout(r, 5000));
      }
    }

    // Save progress periodically so we don't lose data if it crashes
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(correctedVocabList, null, 4));

    if (i + BATCH_SIZE < vocabList.length) {
      console.log(`Waiting ${DELAY_MS / 1000}s to prevent rate limiting...`);
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  console.log(`\n🎉 Successfully processed all ${vocabList.length} items!`);
  console.log(`Data saved to: ${OUTPUT_FILE}`);
}

main().catch(console.error);
