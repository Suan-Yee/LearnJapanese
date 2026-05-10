import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { KanjiGrid } from "@/app/kanji/components/KanjiGrid";
import { KanjiQuizModal } from "@/app/kanji/components/KanjiQuizModal";
import { BreadcrumbLink } from "@/components/ui-custom/navigation/BreadcrumbLink";
import { RoutePathNav } from "@/components/ui-custom/navigation/RoutePathNav";
import { KanjiContentGate } from "../../../KanjiContentGate";
import {
  getKanjiLesson,
  getKanjiLessonsByLevel,
  getKanjiStaticLessonParams,
  isKanjiLevel,
  type KanjiLevel,
} from "@/lib/kanji";

export const dynamicParams = false;

type LessonPageProps = {
  params: Promise<{ level: string; lessonNumber: string }>;
};

export function generateStaticParams() {
  return getKanjiStaticLessonParams();
}

export default async function KanjiLessonPage({ params }: LessonPageProps) {
  const { level: rawLevel, lessonNumber: rawLessonNumber } = await params;
  const level = rawLevel.toUpperCase();
  if (!isKanjiLevel(level)) notFound();

  const typedLevel = level as KanjiLevel;
  const lessonNumber = Number(rawLessonNumber);
  if (!Number.isInteger(lessonNumber)) notFound();

  const lesson = getKanjiLesson(typedLevel, lessonNumber);
  if (!lesson) notFound();

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
            <Link href={`/kanji/${typedLevel}`} className="transition-colors hover:text-primary">
              {typedLevel}
            </Link>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <span className="text-primary/90 font-black">Lesson {lesson.lessonNumber}</span>
          </RoutePathNav>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground mb-2">
            Lesson {lesson.lessonNumber}
          </h1>
          <p className="text-muted-foreground text-lg">
            {lesson.title}
          </p>
        </div>

        <KanjiQuizModal lesson={lesson} />

        <KanjiContentGate
          cacheKey={`kanji-${typedLevel}-${lesson.lessonNumber}`}
          variant="grid"
        >
          <KanjiGrid level={typedLevel} lesson={lesson} lessons={lessons} />
        </KanjiContentGate>
      </div>
    </main>
  );
}
