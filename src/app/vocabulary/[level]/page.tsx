import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BreadcrumbLink } from "@/components/ui-custom/BreadcrumbLink";
import { VocabularyContentGate } from "../VocabularyContentGate";
import {
  getLessonWordCounts,
  getLevels,
  isLevel,
  LEVEL_CONFIG,
  type JlptLevel,
} from "@/lib/vocabulary";

export const dynamicParams = false;

type LevelPageProps = {
  params: Promise<{ level: string }>;
};

export function generateStaticParams() {
  return getLevels().map((level) => ({ level }));
}

export default async function LevelPage({ params }: LevelPageProps) {
  const { level: rawLevel } = await params;
  const level = rawLevel.toUpperCase();
  if (!isLevel(level)) notFound();

  const typedLevel = level as JlptLevel;
  const config = LEVEL_CONFIG[typedLevel];
  const lessons = getLessonWordCounts(typedLevel);

  return (
    <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 mt-4">
          <nav className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 backdrop-blur-sm shadow-sm transition-all hover:bg-card/60">
            <BreadcrumbLink href="/vocabulary" clearStorageKey="last_vocab_path" className="transition-colors hover:text-primary">
              Vocab
            </BreadcrumbLink>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <span className="text-primary/90 font-black">{typedLevel}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground mb-2">
            Lessons {config.startLesson}-{config.endLesson}
          </h1>
          <p className="text-muted-foreground text-lg">
            Select one lesson to view its vocabulary table.
          </p>
        </div>

        <VocabularyContentGate
          cacheKey={`vocabulary-level-${typedLevel}`}
          variant="lessons"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map(({ lesson, count }) => (
              <Link key={lesson} href={`/vocabulary/${typedLevel}/lesson/${lesson}`}>
                <Card className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:bg-card hover:shadow-lg">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="font-heading text-xl font-bold text-foreground">
                        Lesson {lesson}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">{count} words</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </VocabularyContentGate>
      </div>
    </main>
  );
}
