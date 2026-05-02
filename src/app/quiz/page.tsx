import { QuizCard, type Question } from "@/components/ui-custom/QuizCard";

const mockQuestions: Question[] = [
  {
    id: "1",
    question: "What is the reading of 日本?",
    options: ["にほん", "にっぽん", "ひもと", "にちほん"],
    correctAnswer: "にほん",
  },
  {
    id: "2",
    question: "What does 水 mean?",
    options: ["Fire", "Tree", "Water", "Earth"],
    correctAnswer: "Water",
  },
  {
    id: "3",
    question: "Select the kanji for 'Person'.",
    options: ["木", "人", "入", "八"],
    correctAnswer: "人",
  },
];

export default function QuizPage() {
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

        <QuizCard questions={mockQuestions} />
      </div>
    </main>
  );
}
