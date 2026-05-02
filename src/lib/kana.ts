export type KanaScript = "hiragana" | "katakana";
export type KanaGroup = "basic" | "voiced";

export type KanaExample = {
  word: string;
  reading: string;
  meaning: string;
};

export type KanaItem = {
  id: string;
  script: KanaScript;
  group: KanaGroup;
  character: string;
  romaji: string;
  row: string;
  examples: KanaExample[];
};

type KanaSeed = {
  character: string;
  romaji: string;
  row: string;
  examples: KanaExample[];
};

const hiraganaBasic: KanaSeed[] = [
  { character: "あ", romaji: "a", row: "vowels", examples: [{ word: "あめ", reading: "ame", meaning: "rain / candy" }] },
  { character: "い", romaji: "i", row: "vowels", examples: [{ word: "いぬ", reading: "inu", meaning: "dog" }] },
  { character: "う", romaji: "u", row: "vowels", examples: [{ word: "うみ", reading: "umi", meaning: "sea" }] },
  { character: "え", romaji: "e", row: "vowels", examples: [{ word: "えき", reading: "eki", meaning: "station" }] },
  { character: "お", romaji: "o", row: "vowels", examples: [{ word: "おに", reading: "oni", meaning: "demon" }] },
  { character: "か", romaji: "ka", row: "k", examples: [{ word: "かさ", reading: "kasa", meaning: "umbrella" }] },
  { character: "き", romaji: "ki", row: "k", examples: [{ word: "き", reading: "ki", meaning: "tree" }] },
  { character: "く", romaji: "ku", row: "k", examples: [{ word: "くつ", reading: "kutsu", meaning: "shoes" }] },
  { character: "け", romaji: "ke", row: "k", examples: [{ word: "けむり", reading: "kemuri", meaning: "smoke" }] },
  { character: "こ", romaji: "ko", row: "k", examples: [{ word: "こえ", reading: "koe", meaning: "voice" }] },
  { character: "さ", romaji: "sa", row: "s", examples: [{ word: "さかな", reading: "sakana", meaning: "fish" }] },
  { character: "し", romaji: "shi", row: "s", examples: [{ word: "しお", reading: "shio", meaning: "salt" }] },
  { character: "す", romaji: "su", row: "s", examples: [{ word: "すし", reading: "sushi", meaning: "sushi" }] },
  { character: "せ", romaji: "se", row: "s", examples: [{ word: "せんせい", reading: "sensei", meaning: "teacher" }] },
  { character: "そ", romaji: "so", row: "s", examples: [{ word: "そら", reading: "sora", meaning: "sky" }] },
  { character: "た", romaji: "ta", row: "t", examples: [{ word: "たこ", reading: "tako", meaning: "octopus" }] },
  { character: "ち", romaji: "chi", row: "t", examples: [{ word: "ちず", reading: "chizu", meaning: "map" }] },
  { character: "つ", romaji: "tsu", row: "t", examples: [{ word: "つき", reading: "tsuki", meaning: "moon" }] },
  { character: "て", romaji: "te", row: "t", examples: [{ word: "て", reading: "te", meaning: "hand" }] },
  { character: "と", romaji: "to", row: "t", examples: [{ word: "とけい", reading: "tokei", meaning: "clock" }] },
  { character: "な", romaji: "na", row: "n", examples: [{ word: "なつ", reading: "natsu", meaning: "summer" }] },
  { character: "に", romaji: "ni", row: "n", examples: [{ word: "にく", reading: "niku", meaning: "meat" }] },
  { character: "ぬ", romaji: "nu", row: "n", examples: [{ word: "ぬの", reading: "nuno", meaning: "cloth" }] },
  { character: "ね", romaji: "ne", row: "n", examples: [{ word: "ねこ", reading: "neko", meaning: "cat" }] },
  { character: "の", romaji: "no", row: "n", examples: [{ word: "のり", reading: "nori", meaning: "seaweed" }] },
  { character: "は", romaji: "ha", row: "h", examples: [{ word: "はな", reading: "hana", meaning: "flower / nose" }] },
  { character: "ひ", romaji: "hi", row: "h", examples: [{ word: "ひと", reading: "hito", meaning: "person" }] },
  { character: "ふ", romaji: "fu", row: "h", examples: [{ word: "ふね", reading: "fune", meaning: "boat" }] },
  { character: "へ", romaji: "he", row: "h", examples: [{ word: "へや", reading: "heya", meaning: "room" }] },
  { character: "ほ", romaji: "ho", row: "h", examples: [{ word: "ほし", reading: "hoshi", meaning: "star" }] },
  { character: "ま", romaji: "ma", row: "m", examples: [{ word: "まめ", reading: "mame", meaning: "bean" }] },
  { character: "み", romaji: "mi", row: "m", examples: [{ word: "みみ", reading: "mimi", meaning: "ear" }] },
  { character: "む", romaji: "mu", row: "m", examples: [{ word: "むし", reading: "mushi", meaning: "insect" }] },
  { character: "め", romaji: "me", row: "m", examples: [{ word: "め", reading: "me", meaning: "eye" }] },
  { character: "も", romaji: "mo", row: "m", examples: [{ word: "もも", reading: "momo", meaning: "peach" }] },
  { character: "や", romaji: "ya", row: "y", examples: [{ word: "やま", reading: "yama", meaning: "mountain" }] },
  { character: "ゆ", romaji: "yu", row: "y", examples: [{ word: "ゆき", reading: "yuki", meaning: "snow" }] },
  { character: "よ", romaji: "yo", row: "y", examples: [{ word: "よる", reading: "yoru", meaning: "night" }] },
  { character: "ら", romaji: "ra", row: "r", examples: [{ word: "らいおん", reading: "raion", meaning: "lion" }] },
  { character: "り", romaji: "ri", row: "r", examples: [{ word: "りんご", reading: "ringo", meaning: "apple" }] },
  { character: "る", romaji: "ru", row: "r", examples: [{ word: "るす", reading: "rusu", meaning: "absence" }] },
  { character: "れ", romaji: "re", row: "r", examples: [{ word: "れい", reading: "rei", meaning: "zero / example" }] },
  { character: "ろ", romaji: "ro", row: "r", examples: [{ word: "ろうそく", reading: "rousoku", meaning: "candle" }] },
  { character: "わ", romaji: "wa", row: "w", examples: [{ word: "わに", reading: "wani", meaning: "crocodile" }] },
  { character: "を", romaji: "wo", row: "w", examples: [{ word: "ほんをよむ", reading: "hon o yomu", meaning: "read a book" }] },
  { character: "ん", romaji: "n", row: "n", examples: [{ word: "みかん", reading: "mikan", meaning: "mandarin orange" }] },
];

const hiraganaVoiced: KanaSeed[] = [
  { character: "が", romaji: "ga", row: "g", examples: [{ word: "がっこう", reading: "gakkou", meaning: "school" }] },
  { character: "ぎ", romaji: "gi", row: "g", examples: [{ word: "ぎんこう", reading: "ginkou", meaning: "bank" }] },
  { character: "ぐ", romaji: "gu", row: "g", examples: [{ word: "ぐあい", reading: "guai", meaning: "condition" }] },
  { character: "げ", romaji: "ge", row: "g", examples: [{ word: "げんき", reading: "genki", meaning: "healthy" }] },
  { character: "ご", romaji: "go", row: "g", examples: [{ word: "ごはん", reading: "gohan", meaning: "rice / meal" }] },
  { character: "ざ", romaji: "za", row: "z", examples: [{ word: "ざっし", reading: "zasshi", meaning: "magazine" }] },
  { character: "じ", romaji: "ji", row: "z", examples: [{ word: "じかん", reading: "jikan", meaning: "time" }] },
  { character: "ず", romaji: "zu", row: "z", examples: [{ word: "ずっと", reading: "zutto", meaning: "continuously" }] },
  { character: "ぜ", romaji: "ze", row: "z", examples: [{ word: "ぜんぶ", reading: "zenbu", meaning: "all" }] },
  { character: "ぞ", romaji: "zo", row: "z", examples: [{ word: "ぞう", reading: "zou", meaning: "elephant" }] },
  { character: "だ", romaji: "da", row: "d", examples: [{ word: "だいがく", reading: "daigaku", meaning: "university" }] },
  { character: "ぢ", romaji: "ji", row: "d", examples: [{ word: "ちぢむ", reading: "chijimu", meaning: "to shrink" }] },
  { character: "づ", romaji: "zu", row: "d", examples: [{ word: "つづく", reading: "tsuzuku", meaning: "to continue" }] },
  { character: "で", romaji: "de", row: "d", examples: [{ word: "でんしゃ", reading: "densha", meaning: "train" }] },
  { character: "ど", romaji: "do", row: "d", examples: [{ word: "どようび", reading: "doyoubi", meaning: "Saturday" }] },
  { character: "ば", romaji: "ba", row: "b", examples: [{ word: "ばんごう", reading: "bangou", meaning: "number" }] },
  { character: "び", romaji: "bi", row: "b", examples: [{ word: "びょういん", reading: "byouin", meaning: "hospital" }] },
  { character: "ぶ", romaji: "bu", row: "b", examples: [{ word: "ぶた", reading: "buta", meaning: "pig" }] },
  { character: "べ", romaji: "be", row: "b", examples: [{ word: "べんきょう", reading: "benkyou", meaning: "study" }] },
  { character: "ぼ", romaji: "bo", row: "b", examples: [{ word: "ぼうし", reading: "boushi", meaning: "hat" }] },
  { character: "ぱ", romaji: "pa", row: "p", examples: [{ word: "ぱん", reading: "pan", meaning: "bread" }] },
  { character: "ぴ", romaji: "pi", row: "p", examples: [{ word: "ぴかぴか", reading: "pikapika", meaning: "shiny" }] },
  { character: "ぷ", romaji: "pu", row: "p", examples: [{ word: "ぷりん", reading: "purin", meaning: "pudding" }] },
  { character: "ぺ", romaji: "pe", row: "p", examples: [{ word: "ぺこぺこ", reading: "pekopeko", meaning: "hungry" }] },
  { character: "ぽ", romaji: "po", row: "p", examples: [{ word: "ぽち", reading: "pochi", meaning: "common pet name" }] },
];

const katakanaBasic: KanaSeed[] = [
  { character: "ア", romaji: "a", row: "vowels", examples: [{ word: "アイス", reading: "aisu", meaning: "ice cream" }] },
  { character: "イ", romaji: "i", row: "vowels", examples: [{ word: "イギリス", reading: "igirisu", meaning: "United Kingdom" }] },
  { character: "ウ", romaji: "u", row: "vowels", examples: [{ word: "ウール", reading: "uuru", meaning: "wool" }] },
  { character: "エ", romaji: "e", row: "vowels", examples: [{ word: "エアコン", reading: "eakon", meaning: "air conditioner" }] },
  { character: "オ", romaji: "o", row: "vowels", examples: [{ word: "オレンジ", reading: "orenji", meaning: "orange" }] },
  { character: "カ", romaji: "ka", row: "k", examples: [{ word: "カメラ", reading: "kamera", meaning: "camera" }] },
  { character: "キ", romaji: "ki", row: "k", examples: [{ word: "キウイ", reading: "kiui", meaning: "kiwi" }] },
  { character: "ク", romaji: "ku", row: "k", examples: [{ word: "クラス", reading: "kurasu", meaning: "class" }] },
  { character: "ケ", romaji: "ke", row: "k", examples: [{ word: "ケーキ", reading: "keeki", meaning: "cake" }] },
  { character: "コ", romaji: "ko", row: "k", examples: [{ word: "コーヒー", reading: "koohii", meaning: "coffee" }] },
  { character: "サ", romaji: "sa", row: "s", examples: [{ word: "サラダ", reading: "sarada", meaning: "salad" }] },
  { character: "シ", romaji: "shi", row: "s", examples: [{ word: "シャツ", reading: "shatsu", meaning: "shirt" }] },
  { character: "ス", romaji: "su", row: "s", examples: [{ word: "スープ", reading: "suupu", meaning: "soup" }] },
  { character: "セ", romaji: "se", row: "s", examples: [{ word: "セーター", reading: "seetaa", meaning: "sweater" }] },
  { character: "ソ", romaji: "so", row: "s", examples: [{ word: "ソファ", reading: "sofa", meaning: "sofa" }] },
  { character: "タ", romaji: "ta", row: "t", examples: [{ word: "タクシー", reading: "takushii", meaning: "taxi" }] },
  { character: "チ", romaji: "chi", row: "t", examples: [{ word: "チーズ", reading: "chiizu", meaning: "cheese" }] },
  { character: "ツ", romaji: "tsu", row: "t", examples: [{ word: "ツアー", reading: "tsuaa", meaning: "tour" }] },
  { character: "テ", romaji: "te", row: "t", examples: [{ word: "テレビ", reading: "terebi", meaning: "television" }] },
  { character: "ト", romaji: "to", row: "t", examples: [{ word: "トマト", reading: "tomato", meaning: "tomato" }] },
  { character: "ナ", romaji: "na", row: "n", examples: [{ word: "ナイフ", reading: "naifu", meaning: "knife" }] },
  { character: "ニ", romaji: "ni", row: "n", examples: [{ word: "ニュース", reading: "nyuusu", meaning: "news" }] },
  { character: "ヌ", romaji: "nu", row: "n", examples: [{ word: "ヌードル", reading: "nuudoru", meaning: "noodle" }] },
  { character: "ネ", romaji: "ne", row: "n", examples: [{ word: "ネクタイ", reading: "nekutai", meaning: "necktie" }] },
  { character: "ノ", romaji: "no", row: "n", examples: [{ word: "ノート", reading: "nooto", meaning: "notebook" }] },
  { character: "ハ", romaji: "ha", row: "h", examples: [{ word: "ハンバーガー", reading: "hanbaagaa", meaning: "hamburger" }] },
  { character: "ヒ", romaji: "hi", row: "h", examples: [{ word: "ヒーター", reading: "hiitaa", meaning: "heater" }] },
  { character: "フ", romaji: "fu", row: "h", examples: [{ word: "フォーク", reading: "fooku", meaning: "fork" }] },
  { character: "ヘ", romaji: "he", row: "h", examples: [{ word: "ヘルメット", reading: "herumetto", meaning: "helmet" }] },
  { character: "ホ", romaji: "ho", row: "h", examples: [{ word: "ホテル", reading: "hoteru", meaning: "hotel" }] },
  { character: "マ", romaji: "ma", row: "m", examples: [{ word: "マンガ", reading: "manga", meaning: "manga" }] },
  { character: "ミ", romaji: "mi", row: "m", examples: [{ word: "ミルク", reading: "miruku", meaning: "milk" }] },
  { character: "ム", romaji: "mu", row: "m", examples: [{ word: "ムービー", reading: "muubii", meaning: "movie" }] },
  { character: "メ", romaji: "me", row: "m", examples: [{ word: "メニュー", reading: "menyuu", meaning: "menu" }] },
  { character: "モ", romaji: "mo", row: "m", examples: [{ word: "モデル", reading: "moderu", meaning: "model" }] },
  { character: "ヤ", romaji: "ya", row: "y", examples: [{ word: "ヤード", reading: "yaado", meaning: "yard" }] },
  { character: "ユ", romaji: "yu", row: "y", examples: [{ word: "ユーロ", reading: "yuuro", meaning: "euro" }] },
  { character: "ヨ", romaji: "yo", row: "y", examples: [{ word: "ヨーグルト", reading: "yooguruto", meaning: "yogurt" }] },
  { character: "ラ", romaji: "ra", row: "r", examples: [{ word: "ラジオ", reading: "rajio", meaning: "radio" }] },
  { character: "リ", romaji: "ri", row: "r", examples: [{ word: "リモコン", reading: "rimokon", meaning: "remote control" }] },
  { character: "ル", romaji: "ru", row: "r", examples: [{ word: "ルール", reading: "ruuru", meaning: "rule" }] },
  { character: "レ", romaji: "re", row: "r", examples: [{ word: "レモン", reading: "remon", meaning: "lemon" }] },
  { character: "ロ", romaji: "ro", row: "r", examples: [{ word: "ロボット", reading: "robotto", meaning: "robot" }] },
  { character: "ワ", romaji: "wa", row: "w", examples: [{ word: "ワイン", reading: "wain", meaning: "wine" }] },
  { character: "ヲ", romaji: "wo", row: "w", examples: [{ word: "ヲタク", reading: "otaku", meaning: "enthusiast / geek" }] },
  { character: "ン", romaji: "n", row: "n", examples: [{ word: "パン", reading: "pan", meaning: "bread" }] },
];

const katakanaVoiced: KanaSeed[] = [
  { character: "ガ", romaji: "ga", row: "g", examples: [{ word: "ガラス", reading: "garasu", meaning: "glass" }] },
  { character: "ギ", romaji: "gi", row: "g", examples: [{ word: "ギター", reading: "gitaa", meaning: "guitar" }] },
  { character: "グ", romaji: "gu", row: "g", examples: [{ word: "グループ", reading: "guruupu", meaning: "group" }] },
  { character: "ゲ", romaji: "ge", row: "g", examples: [{ word: "ゲーム", reading: "geemu", meaning: "game" }] },
  { character: "ゴ", romaji: "go", row: "g", examples: [{ word: "ゴルフ", reading: "gorufu", meaning: "golf" }] },
  { character: "ザ", romaji: "za", row: "z", examples: [{ word: "サイズ", reading: "saizu", meaning: "size" }] },
  { character: "ジ", romaji: "ji", row: "z", examples: [{ word: "ジム", reading: "jimu", meaning: "gym" }] },
  { character: "ズ", romaji: "zu", row: "z", examples: [{ word: "ズボン", reading: "zubon", meaning: "pants" }] },
  { character: "ゼ", romaji: "ze", row: "z", examples: [{ word: "ゼロ", reading: "zero", meaning: "zero" }] },
  { character: "ゾ", romaji: "zo", row: "z", examples: [{ word: "ゾーン", reading: "zoon", meaning: "zone" }] },
  { character: "ダ", romaji: "da", row: "d", examples: [{ word: "ダンス", reading: "dansu", meaning: "dance" }] },
  { character: "ヂ", romaji: "ji", row: "d", examples: [{ word: "ヂーゼル", reading: "diizeru", meaning: "diesel" }] },
  { character: "ヅ", romaji: "zu", row: "d", examples: [{ word: "ヅラ", reading: "zura", meaning: "wig" }] },
  { character: "デ", romaji: "de", row: "d", examples: [{ word: "デパート", reading: "depaato", meaning: "department store" }] },
  { character: "ド", romaji: "do", row: "d", examples: [{ word: "ドア", reading: "doa", meaning: "door" }] },
  { character: "バ", romaji: "ba", row: "b", examples: [{ word: "バス", reading: "basu", meaning: "bus" }] },
  { character: "ビ", romaji: "bi", row: "b", examples: [{ word: "ビール", reading: "biiru", meaning: "beer" }] },
  { character: "ブ", romaji: "bu", row: "b", examples: [{ word: "ブログ", reading: "burogu", meaning: "blog" }] },
  { character: "ベ", romaji: "be", row: "b", examples: [{ word: "ベッド", reading: "beddo", meaning: "bed" }] },
  { character: "ボ", romaji: "bo", row: "b", examples: [{ word: "ボール", reading: "booru", meaning: "ball" }] },
  { character: "パ", romaji: "pa", row: "p", examples: [{ word: "パンダ", reading: "panda", meaning: "panda" }] },
  { character: "ピ", romaji: "pi", row: "p", examples: [{ word: "ピザ", reading: "piza", meaning: "pizza" }] },
  { character: "プ", romaji: "pu", row: "p", examples: [{ word: "プール", reading: "puuru", meaning: "pool" }] },
  { character: "ペ", romaji: "pe", row: "p", examples: [{ word: "ペン", reading: "pen", meaning: "pen" }] },
  { character: "ポ", romaji: "po", row: "p", examples: [{ word: "ポスト", reading: "posuto", meaning: "postbox" }] },
];

function makeKana(script: KanaScript, group: KanaGroup, seeds: KanaSeed[]) {
  return seeds.map((kana) => ({
    ...kana,
    id: `${script}-${group}-${kana.character}`,
    script,
    group,
  }));
}

export const kanaItems: KanaItem[] = [
  ...makeKana("hiragana", "basic", hiraganaBasic),
  ...makeKana("hiragana", "voiced", hiraganaVoiced),
  ...makeKana("katakana", "basic", katakanaBasic),
  ...makeKana("katakana", "voiced", katakanaVoiced),
];

export function getKanaByScript(script: KanaScript) {
  return kanaItems.filter((kana) => kana.script === script);
}
