import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react";
import { GrammarContentGate } from "@/app/grammar/GrammarContentGate";
import { GrammarExamplesSection } from "@/app/grammar/components/GrammarExamplesSection";
import { GrammarExplanationSection } from "@/app/grammar/components/GrammarExplanationSection";
import { GrammarHeader } from "@/app/grammar/components/GrammarHeader";
import { GrammarNotesSection } from "@/app/grammar/components/GrammarNotesSection";
import { BreadcrumbLink } from "@/components/ui-custom/navigation/BreadcrumbLink";
import { RoutePathNav } from "@/components/ui-custom/navigation/RoutePathNav";
import {
  getGrammarLessonPointParams,
  getGrammarPointInLesson,
  getGrammarLesson,
  isGrammarLevel,
  type GrammarLevel,
} from "@/lib/grammar";

export const dynamicParams = false;

type PointPageProps = {
  params: Promise<{ level: string; lessonNumber: string; pointId: string }>;
};

export function generateStaticParams() {
  return getGrammarLessonPointParams();
}

export default async function GrammarPointPage({ params }: PointPageProps) {
  const { level: rawLevel, lessonNumber: rawLesson, pointId } = await params;
  const level = rawLevel.toUpperCase();
  if (!isGrammarLevel(level)) notFound();

  const lessonNumber = parseInt(rawLesson, 10);
  if (Number.isNaN(lessonNumber)) notFound();

  const typedLevel = level as GrammarLevel;
  const point = getGrammarPointInLesson(typedLevel, lessonNumber, pointId);
  if (!point) notFound();

  const lesson = getGrammarLesson(typedLevel, lessonNumber);
  const allPoints = lesson?.points ?? [];
  const currentIndex = allPoints.findIndex((p) => p.id === pointId);
  const prevPoint = currentIndex > 0 ? allPoints[currentIndex - 1] : null;
  const nextPoint = currentIndex < allPoints.length - 1 ? allPoints[currentIndex + 1] : null;
  const totalPoints = allPoints.length;
  const currentNumber = currentIndex + 1;

  return (
    <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <RoutePathNav>
            <BreadcrumbLink
              href="/grammar"
              clearStorageKey="last_grammar_path"
              className="transition-colors hover:text-primary"
            >
              Grammar
            </BreadcrumbLink>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <Link href={`/grammar/${typedLevel}`} className="transition-colors hover:text-primary">
              {typedLevel}
            </Link>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <Link
              href={`/grammar/${typedLevel}/lesson/${lessonNumber}`}
              className="transition-colors hover:text-primary"
            >
              L{lessonNumber}
            </Link>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <span className="font-black text-primary/90">{point.pattern}</span>
          </RoutePathNav>

          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              {currentNumber} of {totalPoints}
            </span>
            <div className="flex items-center gap-1">
              {allPoints.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/grammar/${typedLevel}/lesson/${lessonNumber}/point/${p.id}`}
                  title={p.pattern}
                  className={`h-1.5 w-6 rounded-full transition-all ${
                    i < currentIndex
                      ? "bg-primary/45"
                      : i === currentIndex
                        ? "bg-primary shadow-[0_0_6px_rgba(244,63,94,0.4)]"
                        : "bg-border dark:bg-muted/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <Link
          href={`/grammar/${typedLevel}/lesson/${lessonNumber}`}
          className="group mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>{lesson?.title ?? `Lesson ${lessonNumber}`}</span>
        </Link>

        <GrammarContentGate
          cacheKey={`grammar-point-${typedLevel}-${lessonNumber}-${pointId}`}
          variant="detail"
        >
          <article className="space-y-8 pb-12">
            <GrammarHeader point={point} />

            <div className="rounded-[1.75rem] border border-border/70 bg-card/20 p-4 shadow-sm sm:p-5 lg:p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
                <GrammarExplanationSection explanation={point.explanation} />

                <GrammarNotesSection tips={point.tips} />

                <GrammarExamplesSection examples={point.examples} />

                {point.conjugation && (
                  <section className="space-y-4">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.22em] text-primary/65">
                      Conjugation
                    </h2>
                    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            {point.conjugation.headers.map((header, i) => (
                              <th
                                key={i}
                                className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {point.conjugation.rows.map((row, ri) => (
                            <tr key={ri} className="border-b border-border/40 last:border-0">
                              {row.map((cell, ci) => (
                                <td key={ci} className="px-4 py-3 font-medium text-foreground/90">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}
              </div>
            </div>

            <nav className="flex justify-end border-t border-border pt-6">
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
                {prevPoint ? (
                  <Link
                    href={`/grammar/${typedLevel}/lesson/${lessonNumber}/point/${prevPoint.id}`}
                    className="group flex min-h-16 w-full items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 transition-all hover:border-primary/30 hover:bg-primary/[0.03] hover:shadow-sm sm:w-[240px]"
                  >
                    <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                        Previous
                      </span>
                      <span className="block truncate text-sm font-bold text-foreground">
                        {prevPoint.pattern}
                      </span>
                    </div>
                  </Link>
                ) : null}

                {nextPoint ? (
                  <Link
                    href={`/grammar/${typedLevel}/lesson/${lessonNumber}/point/${nextPoint.id}`}
                    className="group flex min-h-16 w-full items-center justify-end gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-right transition-all hover:border-primary/30 hover:bg-primary/[0.03] hover:shadow-sm sm:w-[240px]"
                  >
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                        Next
                      </span>
                      <span className="block truncate text-sm font-bold text-foreground">
                        {nextPoint.pattern}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </Link>
                ) : null}
              </div>
            </nav>
          </article>
        </GrammarContentGate>
      </div>
    </main>
  );
}
