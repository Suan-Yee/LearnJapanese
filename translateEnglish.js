import 'dotenv/config';
import fs from 'fs/promises';
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

async function batchUpdateEnglish() {
    const filePath = 'src/json/minna_target_corrected.json';
    const fileContent = await fs.readFile(filePath, 'utf-8');
    let data = JSON.parse(fileContent);

    // Target words missing Myanmar translation as per your JSON structure
    const missingData = data.filter(item => !item.logic?.meaning?.my || item.logic.meaning.my === "");
    
    console.log(`🚀 Starting update for ${missingData.length} words...`);

    // REDUCED BATCH SIZE: Prevents the AI response from being cut off (JSON truncation)
    const BATCH_SIZE = 12; 

    for (let i = 0; i < missingData.length; i += BATCH_SIZE) {
        const batch = missingData.slice(i, i + BATCH_SIZE);
        const kanjiList = batch.map(item => item.base.kanji || item.base.reading);

        const promptText = `Translate these Japanese words to Myanmar (Burmese). 
        Return ONLY a raw JSON object with a key "translations" containing an array of strings. 
        Ensure exactly ${batch.length} strings are in the array.
        Words: ${kanjiList.join(', ')}`;

        try {
            const response = await client.responses.create({
                model: "openai/gpt-oss-20b",
                input: promptText,
            });

            // CHECK: If output_text is empty, skip to avoid "Unexpected end of JSON"
            if (!response.output_text) {
                console.warn(`⚠️ Empty response at index ${i}. Skipping...`);
                continue;
            }

            let cleanText = response.output_text.replace(/```json|```/g, "").trim();
            
            // Try-Catch inside the loop so one bad JSON doesn't kill the whole script
            try {
                const result = JSON.parse(cleanText);
                const translations = result.translations || Object.values(result)[0];

                if (Array.isArray(translations)) {
                    batch.forEach((item, index) => {
                        if (translations[index]) {
                            if (!item.logic) item.logic = {};
                            if (!item.logic.meaning) item.logic.meaning = {};
                            item.logic.meaning.my = translations[index];
                        }
                    });
                    console.log(`✅ Progress: ${Math.min(i + BATCH_SIZE, missingData.length)} / ${missingData.length}`);
                }
            } catch (jsonErr) {
                console.error(`❌ JSON Parse Error at index ${i}:`, jsonErr.message);
                // Save progress so far even if this batch failed
                await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            }

            // Longer delay to be safe with rate limits
            await new Promise(resolve => setTimeout(resolve, 3000));

        } catch (error) {
            console.error(`❌ API Error at batch index ${i}:`, error.message);
            if (error.message.includes("429")) {
                console.log("⏳ Rate limit hit. Sleeping for 45s...");
                await new Promise(resolve => setTimeout(resolve, 45000));
                i -= BATCH_SIZE; 
            }
        }
    }

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log("🏁 Process complete.");
}

batchUpdateEnglish();