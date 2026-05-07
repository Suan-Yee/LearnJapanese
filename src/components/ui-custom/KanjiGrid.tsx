"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { KanjiStrokeViewer } from "@/components/ui-custom/KanjiStrokeViewer";
import { KanjiCard } from "./KanjiCard";
import { SearchInput } from "./SearchInput";
import { Pagination } from "./Pagination";
import { LessonSelect } from "./LessonSelect";
import { LanguageSelect, type LanguagePref } from "./LanguageSelect";
import type { KanjiItem, KanjiLesson, KanjiLevel } from "@/lib/kanji";
import { PronunciationButton } from "./PronunciationButton";
import { BookOpen, Brush } from "lucide-react";

interface KanjiGridProps {
  level: KanjiLevel;
  lesson: KanjiLesson;
  lessons: KanjiLesson[];
}

export function KanjiGrid({ level, lesson, lessons }: KanjiGridProps) {
  const router = useRouter();
  const [selectedKanji, setSelectedKanji] = useState<KanjiItem | null>(null);
  const [languagePref, setLanguagePref] = useState<LanguagePref>("both");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedSearch = searchQuery.trim().toLowerCase();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem("kanji_bookmarks");
      if (saved) {
        try {
          setBookmarkedIds(new Set(JSON.parse(saved)));
        } catch (e) {
          console.error("Failed to parse kanji bookmarks", e);
        }
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem("kanji_bookmarks", JSON.stringify(Array.from(next)));
      return next;
    });
  };
  const currentLessonIndex = lessons.findIndex(
    (item) => item.lessonNumber === lesson.lessonNumber,
  );

  const filteredKanji = useMemo(() => {
    if (!normalizedSearch) return lesson.kanji;

    return lesson.kanji.filter((kanji) => {
      const searchableText = [
        kanji.character,
        kanji.onyomi,
        kanji.kunyomi,
        kanji.meaning.en,
        kanji.meaning.my,
        kanji.lessonTitle,
        ...kanji.examples.flatMap((example) => [
          example.word,
          example.reading,
          example.meaning.en,
          example.meaning.my,
        ]),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [lesson.kanji, normalizedSearch]);

  const goToLesson = (lessonNumber: number) => {
    router.push(`/kanji/${level}/lesson/${lessonNumber}`);
  };

  const handleLessonChange = (value: number) => {
    goToLesson(value);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-6 p-2 lg:flex-row lg:items-center lg:justify-between bg-card/40 backdrop-blur-md rounded-3xl border border-border/60 p-4 shadow-sm">
        <div className="flex w-full flex-col gap-4 sm:flex-row lg:w-auto">
          <LessonSelect
            value={lesson.lessonNumber}
            onChange={handleLessonChange}
            options={lessons.map((item) => ({
              value: item.lessonNumber,
              label: `Lesson ${item.lessonNumber}: ${item.title}`,
            }))}
          />
          <LanguageSelect value={languagePref} onChange={setLanguagePref} />
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row lg:max-w-xl">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search kanji, reading, meaning..."
          />
        </div>
      </div>

      {filteredKanji.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {filteredKanji.map((kanji) => (
            <KanjiCard
              key={kanji.id}
              kanji={kanji}
              languagePref={languagePref}
              isBookmarked={bookmarkedIds.has(kanji.id)}
              onToggleBookmark={(e) => toggleBookmark(kanji.id, e)}
              onClick={setSelectedKanji}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card/70 p-8 text-center shadow-sm">
          <p className="font-semibold text-foreground">No kanji found.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a kanji, reading, English meaning, or Burmese meaning.
          </p>
        </div>
      )}

      <Pagination
        currentLesson={lesson.lessonNumber}
        totalRange={[lessons[0].lessonNumber, lessons[lessons.length - 1].lessonNumber]}
        onPrevious={() => goToLesson(lessons[currentLessonIndex - 1].lessonNumber)}
        onNext={() => goToLesson(lessons[currentLessonIndex + 1].lessonNumber)}
        disablePrevious={currentLessonIndex <= 0}
        disableNext={currentLessonIndex === lessons.length - 1}
      />

      <Dialog open={!!selectedKanji} onOpenChange={(open) => !open && setSelectedKanji(null)}>
        <DialogContent className="max-h-[92vh] max-w-4xl overflow-hidden rounded-3xl border border-border/60 bg-card/95 p-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl sm:max-w-4xl">
          {selectedKanji && (
            <div className="max-h-[88vh] overflow-y-auto p-5 sm:p-7">
              <DialogHeader>
                <DialogTitle className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-primary/10 shadow-inner sm:h-24 sm:w-24">
                      <span className="font-heading text-5xl font-bold text-primary sm:text-6xl">
                        {selectedKanji.character}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="flex flex-wrap gap-2">
                        <Badge>{selectedKanji.level}</Badge>
                        <Badge variant="secondary">
                          Lesson {selectedKanji.lessonNumber}
                        </Badge>
                        <Badge variant="outline">{selectedKanji.lessonTitle}</Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap items-end gap-3">
                        {(languagePref === "en" || languagePref === "both") && (
                          <p className="font-heading text-3xl font-bold text-foreground">
                            {selectedKanji.meaning.en}
                          </p>
                        )}
                        {(languagePref === "mm" || languagePref === "both") && (
                          <p
                            className={`font-bold text-foreground/80 ${
                              languagePref === "both"
                                ? "text-lg"
                                : "font-heading text-3xl"
                            }`}
                          >
                            {selectedKanji.meaning.my}
                          </p>
                        )}
                        <span className="text-4xl leading-none">
                          {selectedKanji.emoji}
                        </span>
                        <PronunciationButton
                          text={selectedKanji.kunyomi || selectedKanji.onyomi || selectedKanji.character}
                          label={`Pronounce ${selectedKanji.character}`}
                        />
                      </div>
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
                <section className="space-y-4">
                  <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-bold uppercase tracking-widest text-primary/80">
                        Readings
                      </h3>
                    </div>
                    <div className="grid gap-3 min-[420px]:grid-cols-2">
                      <div className="rounded-2xl border border-border bg-card/70 p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary/70">
                          Onyomi
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <p className="wrap-break-word font-heading text-xl font-bold text-foreground">
                            {selectedKanji.onyomi}
                          </p>
                          <PronunciationButton
                            text={selectedKanji.onyomi}
                            label={`Pronounce onyomi ${selectedKanji.onyomi}`}
                            className="h-8 w-8 rounded-xl"
                            iconClassName="h-4 w-4"
                          />
                        </div>
                      </div>
                      <div className="rounded-2xl border border-border bg-card/70 p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary/70">
                          Kunyomi
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <p className="wrap-break-word font-heading text-xl font-bold text-foreground">
                            {selectedKanji.kunyomi}
                          </p>
                          <PronunciationButton
                            text={selectedKanji.kunyomi}
                            label={`Pronounce kunyomi ${selectedKanji.kunyomi}`}
                            className="h-8 w-8 rounded-xl"
                            iconClassName="h-4 w-4"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-bold uppercase tracking-widest text-primary/80">
                        Example words
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {selectedKanji.examples.map((example) => (
                        <div
                          key={`${selectedKanji.id}-${example.word}-${example.reading}`}
                          className="rounded-2xl border border-border bg-card/70 p-4"
                        >
                          <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="wrap-break-word font-heading text-2xl font-bold text-foreground">
                                  {example.word}
                                </p>
                                <PronunciationButton
                                  text={example.reading || example.word}
                                  label={`Pronounce ${example.word}`}
                                  className="h-8 w-8 rounded-xl"
                                  iconClassName="h-4 w-4"
                                />
                              </div>
                              <p className="wrap-break-word text-sm font-semibold text-muted-foreground">
                                {example.reading}
                              </p>
                            </div>
                            <div className="flex flex-col items-start gap-1 min-[420px]:items-end">
                              {(languagePref === "en" ||
                                languagePref === "both") && (
                                <p className="rounded-xl bg-background-soft px-3 py-2 text-sm font-bold text-foreground">
                                  {example.meaning.en}
                                </p>
                              )}
                              {(languagePref === "mm" ||
                                languagePref === "both") && (
                                <p className="px-2 py-0.5 text-xs font-bold text-foreground/80">
                                  {example.meaning.my}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <Brush className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-bold uppercase tracking-widest text-primary/80">
                        Writing note
                      </h3>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                      Replay the stroke animation and trace each stroke in order before practicing from memory.
                    </p>
                  </div>
                </section>

                <KanjiStrokeViewer character={selectedKanji.character} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
