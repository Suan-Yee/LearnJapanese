import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { BreadcrumbLink } from "@/components/ui-custom/BreadcrumbLink";
import { GrammarCard } from "@/components/ui-custom/GrammarCard";
import {
  getGrammarLesson,
  getGrammarStaticLessonParams,
  isGrammarLevel,
  type GrammarLevel,
} from "@/lib/grammar";

export const dynamicParams = false;

type Props = {
  params: Promise<{ level: string; lessonNumber: string }>;
};

export function generateStaticParams() {
  return getGrammarStaticLessonParams();
}

export default async function GrammarLessonPage({ params }: Props) {
  const { level: rawLevel, lessonNumber: rawNum } = await params;
  const level = rawLevel.toUpperCase();
  if (!isGrammarLevel(level)) notFound();

  const lessonNumber = parseInt(rawNum, 10);
  const lesson = getGrammarLesson(level as GrammarLevel, lessonNumber);
  if (!lesson) notFound();

  return (
    <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 backdrop-blur-sm shadow-sm transition-all hover:bg-card/60">
          <BreadcrumbLink href="/grammar" className="transition-colors hover:text-primary">
            Grammar
          </BreadcrumbLink>
          <ChevronRight className="h-3 w-3 opacity-40" />
          <BreadcrumbLink href={`/grammar/${level}`} className="transition-colors hover:text-primary">
            {level}
          </BreadcrumbLink>
          <ChevronRight className="h-3 w-3 opacity-40" />
          <span className="text-primary/90 font-black">Lesson {lessonNumber}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground mb-2">
            {lesson.title}
          </h1>
          <p className="text-muted-foreground text-lg">
            {lesson.points.length} grammar points in this lesson
          </p>
        </div>

        <div className="space-y-4">
          {lesson.points.map((point, i) => (
            <GrammarCard key={point.id} point={point} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
