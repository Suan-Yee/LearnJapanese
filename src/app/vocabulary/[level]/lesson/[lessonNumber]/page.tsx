import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { VocabTable } from "@/components/ui-custom/VocabTable";
import { BreadcrumbLink } from "@/components/ui-custom/BreadcrumbLink";
import { VocabularyContentGate } from "../../../VocabularyContentGate";
import {
  getLessonsByLevel,
  getLevels,
  getWordsByLesson,
  isLevel,
  type JlptLevel,
} from "@/lib/vocabulary";

export const dynamicParams = false;

type LessonPageProps = {
  params: Promise<{ level: string; lessonNumber: string }>;
};

export function generateStaticParams() {
  return getLevels().flatMap((level) =>
    getLessonsByLevel(level).map((lessonNumber) => ({
      level,
      lessonNumber: String(lessonNumber),
    })),
  );
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { level: rawLevel, lessonNumber: rawLessonNumber } = await params;
  const level = rawLevel.toUpperCase();
  if (!isLevel(level)) notFound();

  const typedLevel = level as JlptLevel;
  const lessonNumber = Number(rawLessonNumber);
  const lessons = getLessonsByLevel(typedLevel);
  if (!Number.isInteger(lessonNumber) || !lessons.includes(lessonNumber)) notFound();

  const words = getWordsByLesson(typedLevel, lessonNumber);
  if (words.length === 0) notFound();

  return (
    <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 mt-4">
          <nav className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 backdrop-blur-sm shadow-sm transition-all hover:bg-card/60">
            <BreadcrumbLink href="/vocabulary" clearStorageKey="last_vocab_path" className="transition-colors hover:text-primary">
              Vocab
            </BreadcrumbLink>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <Link href={`/vocabulary/${typedLevel}`} className="transition-colors hover:text-primary">
              {typedLevel}
            </Link>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <span className="text-primary/90 font-black">Lesson {lessonNumber}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground mb-2">
            Lesson {lessonNumber}
          </h1>
          <p className="text-muted-foreground text-lg">
            Compact vocabulary list with full conjugation details one click away.
          </p>
        </div>

        <VocabularyContentGate
          cacheKey={`vocabulary-${typedLevel}-${lessonNumber}`}
          variant="table"
        >
          <VocabTable level={typedLevel} lessonNumber={lessonNumber} lessons={lessons} words={words} />
        </VocabularyContentGate>
      </div>
    </main>
  );
}
