import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowRight } from "lucide-react";
import { GrammarContentGate } from "@/app/grammar/GrammarContentGate";
import { Card } from "@/components/ui/card";
import { BreadcrumbLink } from "@/components/ui-custom/navigation/BreadcrumbLink";
import { RoutePathNav } from "@/components/ui-custom/navigation/RoutePathNav";
import {
  getGrammarLesson,
  getGrammarStaticLessonParams,
  isGrammarLevel,
  type GrammarLevel,
} from "@/lib/grammar";

export const dynamicParams = false;

type LessonPageProps = {
  params: Promise<{ level: string; lessonNumber: string }>;
};

export function generateStaticParams() {
  return getGrammarStaticLessonParams();
}

export default async function GrammarLessonPage({ params }: LessonPageProps) {
  const { level: rawLevel, lessonNumber: rawLesson } = await params;
  const level = rawLevel.toUpperCase();
  if (!isGrammarLevel(level)) notFound();

  const lessonNumber = parseInt(rawLesson, 10);
  if (Number.isNaN(lessonNumber)) notFound();

  const lesson = getGrammarLesson(level as GrammarLevel, lessonNumber);
  if (!lesson) notFound();

  return (
    <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 mt-4">
          {/* Breadcrumb */}
          <RoutePathNav className="mb-6">
            <BreadcrumbLink
              href="/grammar"
              clearStorageKey="last_grammar_path"
              className="transition-colors hover:text-primary"
            >
              Grammar
            </BreadcrumbLink>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <Link
              href={`/grammar/${level}`}
              className="transition-colors hover:text-primary"
            >
              {level}
            </Link>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <span className="text-primary/90 font-black">Lesson {lessonNumber}</span>
          </RoutePathNav>

          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground mb-2">
            {lesson.title}
          </h1>
          <p className="text-muted-foreground text-lg">
            {lesson.totalPoints} grammar point{lesson.totalPoints !== 1 ? "s" : ""} in this lesson.
          </p>
        </div>

        {/* Grammar Points List */}
        <GrammarContentGate
          cacheKey={`grammar-lesson-${level}-${lessonNumber}`}
          variant="points"
        >
          <div className="space-y-4">
            {lesson.points.map((point, index) => (
              <Link
                key={point.id}
                href={`/grammar/${level}/lesson/${lessonNumber}/point/${point.id}`}
              >
                <Card className="group mb-4 rounded-2xl border border-border/60 bg-card/80 p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card hover:shadow-lg sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary">
                          {index + 1}
                        </span>
                        {point.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border/40 bg-muted/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h2 className="font-heading text-xl font-black leading-snug tracking-tight text-foreground sm:text-2xl">
                        {point.pattern}
                      </h2>

                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold leading-relaxed text-foreground/80">
                          {point.meaning.en}
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {point.meaning.my}
                        </p>
                      </div>

                      {point.examples.length > 0 && (
                        <div className="rounded-lg border border-primary/15 bg-primary/[0.06] px-3.5 py-2.5">
                          <p className="truncate text-sm font-bold leading-snug text-primary/95">
                            {point.examples[0].ja}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-primary/70">
                            {point.examples[0].en}
                          </p>
                        </div>
                      )}
                    </div>

                    <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-primary opacity-60 transition-opacity group-hover:opacity-100" />
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
