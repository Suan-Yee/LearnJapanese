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

const exampleWords: Record<string, KanaExample> = {
  あ: { word: "あめ", reading: "ame", meaning: "rain / candy" },
  い: { word: "いぬ", reading: "inu", meaning: "dog" },
  う: { word: "うみ", reading: "umi", meaning: "sea" },
  え: { word: "えき", reading: "eki", meaning: "station" },
  お: { word: "おに", reading: "oni", meaning: "demon" },
  か: { word: "かさ", reading: "kasa", meaning: "umbrella" },
  き: { word: "き", reading: "ki", meaning: "tree" },
  く: { word: "くつ", reading: "kutsu", meaning: "shoes" },
  け: { word: "けむり", reading: "kemuri", meaning: "smoke" },
  こ: { word: "こえ", reading: "koe", meaning: "voice" },
  さ: { word: "さかな", reading: "sakana", meaning: "fish" },
  し: { word: "しお", reading: "shio", meaning: "salt" },
  す: { word: "すし", reading: "sushi", meaning: "sushi" },
  せ: { word: "せんせい", reading: "sensei", meaning: "teacher" },
  そ: { word: "そら", reading: "sora", meaning: "sky" },
  た: { word: "たこ", reading: "tako", meaning: "octopus" },
  ち: { word: "ちず", reading: "chizu", meaning: "map" },
  つ: { word: "つき", reading: "tsuki", meaning: "moon" },
  て: { word: "て", reading: "te", meaning: "hand" },
  と: { word: "とけい", reading: "tokei", meaning: "clock" },
  な: { word: "なつ", reading: "natsu", meaning: "summer" },
  に: { word: "にく", reading: "niku", meaning: "meat" },
  ぬ: { word: "ぬの", reading: "nuno", meaning: "cloth" },
  ね: { word: "ねこ", reading: "neko", meaning: "cat" },
  の: { word: "のり", reading: "nori", meaning: "seaweed" },
  は: { word: "はな", reading: "hana", meaning: "flower / nose" },
  ひ: { word: "ひと", reading: "hito", meaning: "person" },
  ふ: { word: "ふね", reading: "fune", meaning: "boat" },
  へ: { word: "へや", reading: "heya", meaning: "room" },
  ほ: { word: "ほし", reading: "hoshi", meaning: "star" },
  ま: { word: "まめ", reading: "mame", meaning: "bean" },
  み: { word: "みみ", reading: "mimi", meaning: "ear" },
  む: { word: "むし", reading: "mushi", meaning: "insect" },
  め: { word: "め", reading: "me", meaning: "eye" },
  も: { word: "もも", reading: "momo", meaning: "peach" },
  や: { word: "やま", reading: "yama", meaning: "mountain" },
  ゆ: { word: "ゆき", reading: "yuki", meaning: "snow" },
  よ: { word: "よる", reading: "yoru", meaning: "night" },
  ら: { word: "らいおん", reading: "raion", meaning: "lion" },
  り: { word: "りんご", reading: "ringo", meaning: "apple" },
  る: { word: "るす", reading: "rusu", meaning: "absence" },
  れ: { word: "れい", reading: "rei", meaning: "zero / example" },
  ろ: { word: "ろうそく", reading: "rousoku", meaning: "candle" },
  わ: { word: "わに", reading: "wani", meaning: "crocodile" },
  を: { word: "ほんをよむ", reading: "hon o yomu", meaning: "read a book" },
  ん: { word: "みかん", reading: "mikan", meaning: "mandarin orange" },
  が: { word: "がっこう", reading: "gakkou", meaning: "school" },
  ぎ: { word: "ぎんこう", reading: "ginkou", meaning: "bank" },
  ぐ: { word: "ぐあい", reading: "guai", meaning: "condition" },
  げ: { word: "げんき", reading: "genki", meaning: "healthy" },
  ご: { word: "ごはん", reading: "gohan", meaning: "rice / meal" },
  ざ: { word: "ざっし", reading: "zasshi", meaning: "magazine" },
  じ: { word: "じかん", reading: "jikan", meaning: "time" },
  ず: { word: "ずっと", reading: "zutto", meaning: "continuously" },
  ぜ: { word: "ぜんぶ", reading: "zenbu", meaning: "all" },
  ぞ: { word: "ぞう", reading: "zou", meaning: "elephant" },
  だ: { word: "だいがく", reading: "daigaku", meaning: "university" },
  ぢ: { word: "ちぢむ", reading: "chijimu", meaning: "to shrink" },
  づ: { word: "つづく", reading: "tsuzuku", meaning: "to continue" },
  で: { word: "でんしゃ", reading: "densha", meaning: "train" },
  ど: { word: "どようび", reading: "doyoubi", meaning: "Saturday" },
  ば: { word: "ばんごう", reading: "bangou", meaning: "number" },
  び: { word: "びょういん", reading: "byouin", meaning: "hospital" },
  ぶ: { word: "ぶた", reading: "buta", meaning: "pig" },
  べ: { word: "べんきょう", reading: "benkyou", meaning: "study" },
  ぼ: { word: "ぼうし", reading: "boushi", meaning: "hat" },
  ぱ: { word: "ぱん", reading: "pan", meaning: "bread" },
  ぴ: { word: "ぴかぴか", reading: "pikapika", meaning: "shiny" },
  ぷ: { word: "ぷりん", reading: "purin", meaning: "pudding" },
  ぺ: { word: "ぺこぺこ", reading: "pekopeko", meaning: "hungry" },
  ぽ: { word: "ぽち", reading: "pochi", meaning: "common pet name" },
  ア: { word: "アイス", reading: "aisu", meaning: "ice cream" },
  イ: { word: "イギリス", reading: "igirisu", meaning: "United Kingdom" },
  ウ: { word: "ウール", reading: "uuru", meaning: "wool" },
  エ: { word: "エアコン", reading: "eakon", meaning: "air conditioner" },
  オ: { word: "オレンジ", reading: "orenji", meaning: "orange" },
  カ: { word: "カメラ", reading: "kamera", meaning: "camera" },
  キ: { word: "キウイ", reading: "kiui", meaning: "kiwi" },
  ク: { word: "クラス", reading: "kurasu", meaning: "class" },
  ケ: { word: "ケーキ", reading: "keeki", meaning: "cake" },
  コ: { word: "コーヒー", reading: "koohii", meaning: "coffee" },
  サ: { word: "サラダ", reading: "sarada", meaning: "salad" },
  シ: { word: "シャツ", reading: "shatsu", meaning: "shirt" },
  ス: { word: "スープ", reading: "suupu", meaning: "soup" },
  セ: { word: "セーター", reading: "seetaa", meaning: "sweater" },
  ソ: { word: "ソファ", reading: "sofa", meaning: "sofa" },
  タ: { word: "タクシー", reading: "takushii", meaning: "taxi" },
  チ: { word: "チーズ", reading: "chiizu", meaning: "cheese" },
  ツ: { word: "ツアー", reading: "tsuaa", meaning: "tour" },
  テ: { word: "テレビ", reading: "terebi", meaning: "television" },
  ト: { word: "トマト", reading: "tomato", meaning: "tomato" },
  ナ: { word: "ナイフ", reading: "naifu", meaning: "knife" },
  ニ: { word: "ニュース", reading: "nyuusu", meaning: "news" },
  ヌ: { word: "ヌードル", reading: "nuudoru", meaning: "noodle" },
  ネ: { word: "ネクタイ", reading: "nekutai", meaning: "necktie" },
  ノ: { word: "ノート", reading: "nooto", meaning: "notebook" },
  ハ: { word: "ハンバーガー", reading: "hanbaagaa", meaning: "hamburger" },
  ヒ: { word: "ヒーター", reading: "hiitaa", meaning: "heater" },
  フ: { word: "フォーク", reading: "fooku", meaning: "fork" },
  ヘ: { word: "ヘルメット", reading: "herumetto", meaning: "helmet" },
  ホ: { word: "ホテル", reading: "hoteru", meaning: "hotel" },
  マ: { word: "マンガ", reading: "manga", meaning: "manga" },
  ミ: { word: "ミルク", reading: "miruku", meaning: "milk" },
  ム: { word: "ムービー", reading: "muubii", meaning: "movie" },
  メ: { word: "メニュー", reading: "menyuu", meaning: "menu" },
  モ: { word: "モデル", reading: "moderu", meaning: "model" },
  ヤ: { word: "ヤード", reading: "yaado", meaning: "yard" },
  ユ: { word: "ユーロ", reading: "yuuro", meaning: "euro" },
  ヨ: { word: "ヨーグルト", reading: "yooguruto", meaning: "yogurt" },
  ラ: { word: "ラジオ", reading: "rajio", meaning: "radio" },
  リ: { word: "リモコン", reading: "rimokon", meaning: "remote control" },
  ル: { word: "ルール", reading: "ruuru", meaning: "rule" },
  レ: { word: "レモン", reading: "remon", meaning: "lemon" },
  ロ: { word: "ロボット", reading: "robotto", meaning: "robot" },
  ワ: { word: "ワイン", reading: "wain", meaning: "wine" },
  ヲ: { word: "ヲタク", reading: "otaku", meaning: "enthusiast / geek" },
  ン: { word: "パン", reading: "pan", meaning: "bread" },
  ガ: { word: "ガラス", reading: "garasu", meaning: "glass" },
  ギ: { word: "ギター", reading: "gitaa", meaning: "guitar" },
  グ: { word: "グループ", reading: "guruupu", meaning: "group" },
  ゲ: { word: "ゲーム", reading: "geemu", meaning: "game" },
  ゴ: { word: "ゴルフ", reading: "gorufu", meaning: "golf" },
  ザ: { word: "サイズ", reading: "saizu", meaning: "size" },
  ジ: { word: "ジム", reading: "jimu", meaning: "gym" },
  ズ: { word: "ズボン", reading: "zubon", meaning: "pants" },
  ゼ: { word: "ゼロ", reading: "zero", meaning: "zero" },
  ゾ: { word: "ゾーン", reading: "zoon", meaning: "zone" },
  ダ: { word: "ダンス", reading: "dansu", meaning: "dance" },
  ヂ: { word: "ヂーゼル", reading: "diizeru", meaning: "diesel" },
  ヅ: { word: "ヅラ", reading: "zura", meaning: "wig" },
  デ: { word: "デパート", reading: "depaato", meaning: "department store" },
  ド: { word: "ドア", reading: "doa", meaning: "door" },
  バ: { word: "バス", reading: "basu", meaning: "bus" },
  ビ: { word: "ビール", reading: "biiru", meaning: "beer" },
  ブ: { word: "ブログ", reading: "burogu", meaning: "blog" },
  ベ: { word: "ベッド", reading: "beddo", meaning: "bed" },
  ボ: { word: "ボール", reading: "booru", meaning: "ball" },
  パ: { word: "パンダ", reading: "panda", meaning: "panda" },
  ピ: { word: "ピザ", reading: "piza", meaning: "pizza" },
  プ: { word: "プール", reading: "puuru", meaning: "pool" },
  ペ: { word: "ペン", reading: "pen", meaning: "pen" },
  ポ: { word: "ポスト", reading: "posuto", meaning: "postbox" },
};

const rowByRomaji = (romaji: string) => {
  if (["a", "i", "u", "e", "o"].includes(romaji)) return "vowels";
  if (["n"].includes(romaji)) return "n";
  return romaji[0];
};

function makeSeeds(pairs: [string, string][]): KanaSeed[] {
  return pairs.map(([character, romaji]) => ({
    character,
    romaji,
    row: rowByRomaji(romaji),
    examples: [exampleWords[character]],
  }));
}

const basicRomaji = [
  "a",
  "i",
  "u",
  "e",
  "o",
  "ka",
  "ki",
  "ku",
  "ke",
  "ko",
  "sa",
  "shi",
  "su",
  "se",
  "so",
  "ta",
  "chi",
  "tsu",
  "te",
  "to",
  "na",
  "ni",
  "nu",
  "ne",
  "no",
  "ha",
  "hi",
  "fu",
  "he",
  "ho",
  "ma",
  "mi",
  "mu",
  "me",
  "mo",
  "ya",
  "yu",
  "yo",
  "ra",
  "ri",
  "ru",
  "re",
  "ro",
  "wa",
  "wo",
  "n",
] as const;

const voicedRomaji = [
  "ga",
  "gi",
  "gu",
  "ge",
  "go",
  "za",
  "ji",
  "zu",
  "ze",
  "zo",
  "da",
  "ji",
  "zu",
  "de",
  "do",
  "ba",
  "bi",
  "bu",
  "be",
  "bo",
  "pa",
  "pi",
  "pu",
  "pe",
  "po",
] as const;

const hiraganaBasic = makeSeeds(
  [..."あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん"].map(
    (character, index) => [character, basicRomaji[index]],
  ),
);

const hiraganaVoiced = makeSeeds(
  [..."がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ"].map(
    (character, index) => [character, voicedRomaji[index]],
  ),
);

const katakanaBasic = makeSeeds(
  [..."アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"].map(
    (character, index) => [character, basicRomaji[index]],
  ),
);

const katakanaVoiced = makeSeeds(
  [..."ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ"].map(
    (character, index) => [character, voicedRomaji[index]],
  ),
);

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
