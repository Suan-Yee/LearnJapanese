import { QuizCard, type Question } from "@/components/ui-custom/QuizCard";
import { getNormalizedKanji, getNormalizedVocabulary } from "@/lib/pipeline-data";

function uniqueOptions(correct: string, distractors: string[], max = 4) {
  const set = new Set<string>([correct, ...distractors.filter(Boolean)]);
  return Array.from(set).slice(0, max);
}

function buildQuestions(): Question[] {
  const vocab = getNormalizedVocabulary().slice(0, 2);
  const kanji = getNormalizedKanji().slice(0, 2);
  const vocabPool = getNormalizedVocabulary();
  const kanjiPool = getNormalizedKanji();
  const questions: Question[] = [];

  for (const word of vocab) {
    if (!word.writing.primary || !word.writing.kana) continue;
    const distractors = vocabPool
      .filter((candidate) => candidate.id !== word.id)
      .slice(0, 8)
      .map((candidate) => candidate.writing.kana);
    questions.push({
      id: `vq-${word.id}`,
      question: `What is the reading of ${word.writing.primary}?`,
      options: uniqueOptions(word.writing.kana, distractors),
      correctAnswer: word.writing.kana,
    });
  }

  for (const item of kanji) {
    const meaning = item.meanings[0]?.en;
    if (!item.character || !meaning) continue;
    const distractors = kanjiPool
      .filter((candidate) => candidate.id !== item.id)
      .slice(0, 8)
      .map((candidate) => candidate.meanings[0]?.en ?? "")
      .filter(Boolean);
    questions.push({
      id: `kq-${item.id}`,
      question: `What does ${item.character} mean?`,
      options: uniqueOptions(meaning, distractors),
      correctAnswer: meaning,
    });
  }

  return questions.slice(0, 6);
}

export default function QuizPage() {
  const questions = buildQuestions();

  return (
    <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 mt-4">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground mb-2">
            Daily Quiz
          </h1>
          <p className="text-muted-foreground text-lg">
            Test your vocabulary and kanji knowledge.
          </p>
        </div>

        <QuizCard questions={questions} />
      </div>
    </main>
  );
}
