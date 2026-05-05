import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BreadcrumbLink } from "@/components/ui-custom/BreadcrumbLink";
import {
  getGrammarLessonsByLevel,
  getGrammarLevels,
  isGrammarLevel,
  type GrammarLevel,
} from "@/lib/grammar";

export const dynamicParams = false;

type Props = { params: Promise<{ level: string }> };

export function generateStaticParams() {
  return getGrammarLevels().map((level) => ({ level }));
}

export default async function GrammarLevelPage({ params }: Props) {
  const { level: rawLevel } = await params;
  const level = rawLevel.toUpperCase();
  if (!isGrammarLevel(level)) notFound();

  const typedLevel = level as GrammarLevel;
  const lessons = getGrammarLessonsByLevel(typedLevel);

  return (
    <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 backdrop-blur-sm shadow-sm transition-all hover:bg-card/60">
          <BreadcrumbLink href="/grammar" className="transition-colors hover:text-primary">
            Grammar
          </BreadcrumbLink>
          <ChevronRight className="h-3 w-3 opacity-40" />
          <span className="text-primary/90 font-black">{typedLevel}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground mb-2">
            Grammar Lessons
          </h1>
          <p className="text-muted-foreground text-lg">
            Select a lesson to study grammar patterns, formations, and example sentences.
          </p>
        </div>

        {lessons.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <Link
                key={lesson.lessonNumber}
                href={`/grammar/${typedLevel}/lesson/${lesson.lessonNumber}`}
              >
                <Card className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:bg-card hover:shadow-lg">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="font-heading text-xl font-bold text-foreground">
                        Lesson {lesson.lessonNumber}
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-foreground/80">
                        {lesson.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {lesson.points.length} grammar points
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 bg-card/70 p-8 text-center shadow-sm">
            <p className="font-semibold text-foreground">
              No {typedLevel} grammar lessons yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
