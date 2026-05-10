import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BreadcrumbLink } from "@/components/ui-custom/navigation/BreadcrumbLink";
import { RoutePathNav } from "@/components/ui-custom/navigation/RoutePathNav";
import { KanjiContentGate } from "../KanjiContentGate";
import {
  getKanjiLessonsByLevel,
  getKanjiLevels,
  isKanjiLevel,
  type KanjiLevel,
} from "@/lib/kanji";

export const dynamicParams = false;

type LevelPageProps = {
  params: Promise<{ level: string }>;
};

export function generateStaticParams() {
  return getKanjiLevels().map((level) => ({ level }));
}

export default async function KanjiLevelPage({ params }: LevelPageProps) {
  const { level: rawLevel } = await params;
  const level = rawLevel.toUpperCase();
  if (!isKanjiLevel(level)) notFound();

  const typedLevel = level as KanjiLevel;
  const lessons = getKanjiLessonsByLevel(typedLevel);

  return (
    <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 mt-4">
          <RoutePathNav className="mb-6">
            <BreadcrumbLink href="/kanji" clearStorageKey="last_kanji_path" className="transition-colors hover:text-primary">
              Kanji
            </BreadcrumbLink>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <span className="text-primary/90 font-black">{typedLevel}</span>
          </RoutePathNav>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground mb-2">
            Kanji Lessons
          </h1>
          <p className="text-muted-foreground text-lg">
            Select one lesson to study kanji readings, meanings, examples, and strokes.
          </p>
        </div>

        <KanjiContentGate cacheKey={`kanji-level-${typedLevel}`} variant="lessons">
          {lessons.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lessons.map((lesson) => (
                <Link
                  key={lesson.lessonNumber}
                  href={`/kanji/${typedLevel}/lesson/${lesson.lessonNumber}`}
                >
                  <Card className="pixel-card p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge className="shrink-0 rounded-full bg-primary text-[10px] font-black">
                            Lesson {lesson.lessonNumber}
                          </Badge>
                        </div>
                        <h2 className="font-heading text-xl font-bold text-foreground">
                          {lesson.title}
                        </h2>
                        <p className="mt-1 text-sm font-semibold text-foreground/80">
                          {lesson.kanji.length} kanji
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 shrink-0 text-primary" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="pixel-card p-8 text-center">
              <p className="font-semibold text-foreground">
                No {typedLevel} kanji lessons yet.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add lessons to src/json/kanji.json and they will appear here.
              </p>
            </div>
          )}
        </KanjiContentGate>
      </div>
    </main>
  );
}
