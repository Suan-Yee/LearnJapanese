import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { GrammarContentGate } from "@/app/grammar/GrammarContentGate";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BreadcrumbLink } from "@/components/ui-custom/navigation/BreadcrumbLink";
import { RoutePathNav } from "@/components/ui-custom/navigation/RoutePathNav";
import {
  getGrammarLessonsByLevel,
  getGrammarLevels,
  GrammarLevel,
  isGrammarLevel,
} from "@/lib/grammar";

export const dynamicParams = false;

type LevelPageProps = {
  params: Promise<{ level: string }>;
};

export function generateStaticParams() {
  return getGrammarLevels().map((level) => ({ level }));
}

export default async function GrammarLevelPage({ params }: LevelPageProps) {
  const { level: rawLevel } = await params;
  const level = rawLevel.toUpperCase();
  if (!isGrammarLevel(level)) notFound();

  const typedLevel = level as GrammarLevel;
  const lessons = getGrammarLessonsByLevel(typedLevel);

  return (
    <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 mt-4">
          <RoutePathNav className="mb-6">
            <BreadcrumbLink
              href="/grammar"
              clearStorageKey="last_grammar_path"
              className="transition-colors hover:text-primary"
            >
              Grammar
            </BreadcrumbLink>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <span className="text-primary/90 font-black">{typedLevel}</span>
          </RoutePathNav>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground mb-2">
            {typedLevel} Grammar Lessons
          </h1>
          <p className="text-muted-foreground text-lg">
            Select a lesson to explore its grammar points.
          </p>
        </div>

        <GrammarContentGate cacheKey={`grammar-level-${typedLevel}`} variant="levels">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <Link
                key={lesson.lessonNumber}
                href={`/grammar/${typedLevel}/lesson/${lesson.lessonNumber}`}
              >
                <Card className="pixel-card p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge className="rounded-full bg-primary text-[10px] font-black shrink-0">
                          Lesson {lesson.lessonNumber}
                        </Badge>
                      </div>
                      <h2 className="truncate font-heading text-base font-bold leading-snug text-foreground">
                        {lesson.title}
                      </h2>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        {lesson.totalPoints} grammar point{lesson.totalPoints !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-primary" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </GrammarContentGate>
      </div>
    </main>
  );
}
