const fs = require('fs');
const path = require('path');

const filePath = 'C:/2026/Nihon/nihongo-trainer/src/json/vocab.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let nounToVerbCount = 0;
let meaningCleanupCount = 0;
let phraseConsistencyCount = 0;
let categoryAccuracyCount = 0;

data.forEach(entry => {
  const kanji = entry.base.kanji || "";
  const reading = entry.base.reading || "";
  const logic = entry.logic;

  // 1. Noun-Verb Misclassification
  if (logic.pos === 'noun' && logic.conjugations) {
    const cleanKanji = kanji.replace(/［.*?］/g, '');
    const cleanReading = reading.replace(/［.*?］/g, '');
    const isMasu = cleanKanji.endsWith('ます') || cleanReading.endsWith('ます');

    if (kanji.includes('吸います') || reading.includes('すいます')) {
      logic.pos = 'verb_group_1';
      nounToVerbCount++;
    } else if (kanji.includes('撮ります') || reading.includes('とります')) {
      logic.pos = 'verb_group_1';
      nounToVerbCount++;
    } else if (kanji.includes('会います') || reading.includes('あいます')) {
      logic.pos = 'verb_group_1';
      nounToVerbCount++;
    } else if (kanji.includes('かけます') || reading.includes('かけます')) {
      logic.pos = 'verb_group_2';
      nounToVerbCount++;
    } else if (isMasu) {
      // General Rule
      const dictionaryForm = logic.conjugations.dictionary.jp;
      if (dictionaryForm.endsWith('する')) {
        logic.pos = 'verb_group_3';
      } else if (dictionaryForm.endsWith('る')) {
        // Heuristic: Check the te-form if it exists to distinguish group 1 and 2
        if (logic.conjugations.te && logic.conjugations.te.jp.endsWith('て') && !logic.conjugations.te.jp.endsWith('って') && !logic.conjugations.te.jp.endsWith('んで') && !logic.conjugations.te.jp.endsWith('いで') && !logic.conjugations.te.jp.endsWith('いて')) {
            // Group 2: たべる -> たべて, みる -> みて
            logic.pos = 'verb_group_2';
        } else {
            logic.pos = 'verb_group_1';
        }
      } else {
        logic.pos = 'verb_group_1';
      }
      nounToVerbCount++;
    }
  }

  // 2. Meaning Cleanup
  const cleanupMeaning = (m) => {
    if (!m || !m.en) return false;
    let en = m.en;
    const originalEn = en;

    // Remove (polite) variations
    en = en.replace(/\s*\(polite( form)?\)/gi, '');
    
    // Remove "is a ", "is an "
    // Handle cases like "is a meeting", "is ordinary / is a local train"
    en = en.replace(/(^|[\/\(;,])\s*is an?\s+/gi, '$1 ');
    
    // Remove standalone "is a" or "is an" if any left
    en = en.replace(/\bis an?\b\s+/gi, '');

    // Remove "to " prefix for verbs
    if (logic.pos && logic.pos.startsWith('verb_group_')) {
      en = en.replace(/(^|[\/\(;,])\s*to\s+/gi, '$1 ');
    }

    // Clean up double spaces and leading/trailing punctuation/spaces
    en = en.replace(/\s\s+/g, ' ').trim();
    // Remove leading/trailing separators that might be left after replacement
    en = en.replace(/^[\/\(;,]\s*/, '').replace(/\s*[\/\(;,]$/, '').trim();

    if (en !== originalEn) {
      m.en = en;
      return true;
    }
    return false;
  };

  let changed = false;
  if (cleanupMeaning(logic.meaning)) changed = true;
  
  if (logic.conjugations) {
    Object.values(logic.conjugations).forEach(conj => {
      if (cleanupMeaning(conj)) changed = true;
    });
  }
  if (changed) meaningCleanupCount++;

  // 3. Phrase Consistency
  const isPhrase = /[。？?!！]$/.test(kanji) || /[。？?!！]$/.test(reading);
  if (isPhrase || kanji === 'いらっしゃい。' || kanji === '失礼します。') {
    if (logic.pos !== 'other') {
      logic.pos = 'other';
      phraseConsistencyCount++;
    }
  }

  // 4. Category Accuracy
  if (kanji.includes('存じます') || kanji.includes('拝見します')) {
    if (logic.category !== 'action') {
      logic.category = 'action';
      categoryAccuracyCount++;
    }
  }
});

console.log(`Noun to Verb: ${nounToVerbCount}`);
console.log(`Meaning Cleanup: ${meaningCleanupCount}`);
console.log(`Phrase Consistency: ${phraseConsistencyCount}`);
console.log(`Category Accuracy: ${categoryAccuracyCount}`);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
