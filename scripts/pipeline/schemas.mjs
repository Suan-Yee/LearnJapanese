export const JLPT_LEVELS = ["N5", "N4", "N3", "N2", "N1"];

export function normalizeLevel(raw) {
  if (!raw) return "N5";
  const normalized = String(raw).toUpperCase();
  return JLPT_LEVELS.includes(normalized) ? normalized : "N5";
}

export function cleanText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function pickMeaning(meaning = {}) {
  return {
    en: cleanText(meaning.en),
    my: cleanText(meaning.my),
  };
}
