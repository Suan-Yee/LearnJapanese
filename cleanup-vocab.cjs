const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/json/vocab.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let changes = 0;
let meaningChanges = 0;
let posChanges = 0;
let categoryChanges = 0;
let conjugationRemovals = 0;

const prefixes = ["is a ", "is an ", "is ", "to ", "are "];

data.forEach(entry => {
    const logic = entry.logic;
    if (!logic) return;

    // Task 1: Meaning Cleanup
    if (logic.meaning && logic.meaning.en) {
        const originalMeaning = logic.meaning.en;
        for (const prefix of prefixes) {
            if (originalMeaning.toLowerCase().startsWith(prefix)) {
                logic.meaning.en = originalMeaning.slice(prefix.length);
                meaningChanges++;
                changes++;
                break;
            }
        }
    }

    // Task 2 & 4: POS Correction & Conjugation Cleanup
    const kanji = entry.base.kanji;
    const word_id = entry.word_id;

    if (logic.pos === "verb_group_3") {
        const isNotVerb = kanji.includes(' ') || 
                         kanji.includes('「') || 
                         kanji.includes('」') || 
                         kanji === "うしろ";
        
        if (isNotVerb) {
            logic.pos = "noun";
            posChanges++;
            changes++;
            if (logic.conjugations) {
                delete logic.conjugations;
                conjugationRemovals++;
            }
        }
    }

    // Specific fixes for word_id
    if (word_id === "10035" || word_id === "32-65") {
        if (logic.pos !== "adverb") {
            logic.pos = "adverb";
            posChanges++;
            changes++;
            if (logic.conjugations) {
                delete logic.conjugations;
                conjugationRemovals++;
            }
        }
    }

    if (word_id === "1-26") {
        if (logic.pos !== "other") {
            logic.pos = "other";
            posChanges++;
            changes++;
            if (logic.conjugations) {
                delete logic.conjugations;
                conjugationRemovals++;
            }
        }
    }

    // Task 3: Category Correction
    if (word_id === "1-18" || word_id === "1-19") {
        if (logic.category !== "people") {
            logic.category = "people";
            categoryChanges++;
            changes++;
        }
    }
    if (word_id === "1-44") {
        if (logic.category !== "people") {
            logic.category = "people";
            categoryChanges++;
            changes++;
        }
    }
    if (word_id === "1-10" || word_id === "1-11" || word_id === "1-12") {
        if (logic.category !== "people") {
            logic.category = "people";
            categoryChanges++;
            changes++;
        }
    }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

console.log(`Summary of changes:`);
console.log(`- Meaning prefixes removed: ${meaningChanges}`);
console.log(`- POS corrections: ${posChanges}`);
console.log(`- Category corrections: ${categoryChanges}`);
console.log(`- Conjugation objects removed: ${conjugationRemovals}`);
console.log(`- Total modifications: ${changes}`);
