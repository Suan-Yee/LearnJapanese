import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookmarkWordButton } from "@/components/ui-custom/BookmarkWordButton";
import {
  getJapaneseDisplay,
  getLessonsByLevel,
  getLevels,
  getWordByRoute,
  getWordsByLesson,
  isLevel,
  type JlptLevel,
} from "@/lib/vocabulary";

export const dynamicParams = false;

type WordPageProps = {
  params: Promise<{ level: string; lessonNumber: string; wordIndex: string }>;
};

export function generateStaticParams() {
  return getLevels().flatMap((level) =>
    getLessonsByLevel(level).flatMap((lessonNumber) =>
      getWordsByLesson(level, lessonNumber).map((word) => {
        const [, wordIndex] = word.word_id.split("-");
        return {
          level,
          lessonNumber: String(lessonNumber),
          wordIndex,
        };
      }),
    ),
  );
}

function labelFromKey(value: string) {
  return value.replaceAll("_", " ");
}

export default async function WordDetailPage({ params }: WordPageProps) {
  const { level: rawLevel, lessonNumber: rawLessonNumber, wordIndex: rawWordIndex } = await params;
  const level = rawLevel.toUpperCase();
  if (!isLevel(level)) notFound();

  const typedLevel = level as JlptLevel;
  const lessonNumber = Number(rawLessonNumber);
  const wordIndex = Number(rawWordIndex);
  const lessons = getLessonsByLevel(typedLevel);

  if (!Number.isInteger(lessonNumber) || !Number.isInteger(wordIndex) || !lessons.includes(lessonNumber)) {
    notFound();
  }

  const word = getWordByRoute(typedLevel, lessonNumber, wordIndex);
  if (!word) notFound();

  const conjugations = Object.entries(word.logic.conjugations || {});

  return (
    <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          href={`/vocabulary/${typedLevel}/lesson/${lessonNumber}`}
          className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to lesson {lessonNumber}
        </Link>

        <Card className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge>{word.jlpt}</Badge>
                <Badge variant="secondary">{word.logic.pos}</Badge>
                <Badge variant="outline">{word.word_id}</Badge>
              </div>
              <h1 className="font-heading text-4xl font-bold text-foreground">
                {getJapaneseDisplay(word)}
              </h1>
              <p className="mt-2 text-lg font-medium text-muted-foreground">{word.base.reading}</p>
            </div>
            <BookmarkWordButton wordId={word.word_id} />
          </div>
        </Card>

        <Card className="rounded-3xl border border-border/60 bg-card/80 p-0 py-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="border-b border-border/60 p-5">
            <h2 className="font-heading text-xl font-bold text-foreground">Conjugations</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-primary">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="w-[16%] text-primary-foreground font-bold uppercase tracking-widest pl-6 py-4">Form</TableHead>
                  <TableHead className="w-[28%] text-primary-foreground font-bold uppercase tracking-widest py-4">Japanese</TableHead>
                  <TableHead className="w-[28%] text-primary-foreground font-bold uppercase tracking-widest py-4">English</TableHead>
                  <TableHead className="w-[28%] text-primary-foreground font-bold uppercase tracking-widest pr-6 py-4">Burmese</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conjugations.length > 0 ? (
                  conjugations.map(([form, value]) => (
                    <TableRow key={form} className="border-border/30 hover:bg-primary/5">
                      <TableCell className="pl-6 font-semibold capitalize">{labelFromKey(form)}</TableCell>
                      <TableCell className="font-heading text-xl font-semibold">{value.jp || "-"}</TableCell>
                      <TableCell>{value.en || "-"}</TableCell>
                      <TableCell className="pr-6 font-medium">{value.my || "-"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      No conjugation details are available for this word.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </main>
  );
}
