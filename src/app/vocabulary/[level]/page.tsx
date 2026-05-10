import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { LessonGridWanderer } from "@/app/vocabulary/components/LessonGridWanderer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BreadcrumbLink } from "@/components/ui-custom/navigation/BreadcrumbLink";
import { RoutePathNav } from "@/components/ui-custom/navigation/RoutePathNav";
import { VocabularyContentGate } from "../VocabularyContentGate";
import {
  getWordsByLesson,
  getLessonWordCounts,
  getLessonsByLevel,
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
  const walkerWords =
    typedLevel === "N5"
      ? getLessonsByLevel(typedLevel).flatMap((lesson) =>
          getWordsByLesson(typedLevel, lesson)
            .slice(0, 3)
            .map((word) => word.base.reading || word.base.kanji),
        )
      : [];

  return (
    <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 mt-4">
          <RoutePathNav className="mb-6">
            <BreadcrumbLink href="/vocabulary" clearStorageKey="last_vocab_path" className="transition-colors hover:text-primary">
              Vocab
            </BreadcrumbLink>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <span className="text-primary/90 font-black">{typedLevel}</span>
          </RoutePathNav>
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
          <LessonGridWanderer words={typedLevel === "N5" ? walkerWords : []}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lessons.map(({ lesson, count }) => (
                <Link key={lesson} href={`/vocabulary/${typedLevel}/lesson/${lesson}`}>
                  <Card
                    data-lesson-card="true"
                    className="pixel-card p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge className="shrink-0 rounded-full bg-primary text-[10px] font-black">
                            Lesson {lesson}
                          </Badge>
                        </div>
                        <h2 className="font-heading text-xl font-bold text-foreground">
                          Vocabulary Lesson
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">{count} words</p>
                      </div>
                      <ArrowRight className="h-5 w-5 shrink-0 text-primary" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </LessonGridWanderer>
        </VocabularyContentGate>
      </div>
    </main>
  );
}
