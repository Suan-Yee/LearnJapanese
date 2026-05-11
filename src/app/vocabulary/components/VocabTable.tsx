"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { LanguageSelect, type LanguagePref } from "@/components/ui-custom/LanguageSelect";
import { LessonSelect } from "@/components/ui-custom/LessonSelect";
import { Pagination } from "@/components/ui-custom/Pagination";
import { PronunciationButton } from "@/components/ui-custom/PronunciationButton";
import { SearchInput } from "@/components/ui-custom/SearchInput";
import { VocabDetailModal } from "@/components/ui-custom/VocabDetailModal";
import { getPublicAssetUrl, usePublicAssetBasePath } from "@/lib/public-asset";
import type { JlptLevel, VocabWord } from "@/lib/vocabulary";

interface VocabTableProps {
  level: JlptLevel;
  lessonNumber: number;
  lessons: number[];
  words: VocabWord[];
}

function getPrimaryMeaning(word: VocabWord) {
  if (word.logic.meaning) {
    return {
      en: word.logic.meaning.en ?? "",
      my: word.logic.meaning.my ?? "",
    };
  }

  if (!word.logic.conjugations) {
    return { en: "", my: "" };
  }

  const preferred =
    word.logic.conjugations.plain ??
    word.logic.conjugations.dictionary ??
    word.logic.conjugations.polite ??
    Object.values(word.logic.conjugations)[0];

  return {
    en: preferred?.en ?? "",
    my: preferred?.my ?? "",
  };
}

function getJapaneseDisplay(word: VocabWord) {
  return word.base.kanji || word.base.reading;
}

export function VocabTable({ level, lessonNumber, lessons, words }: VocabTableProps) {
  const router = useRouter();
  const assetBasePath = usePublicAssetBasePath();
  const [showFurigana, setShowFurigana] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [languagePref, setLanguagePref] = useState<LanguagePref>("both");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWord, setSelectedWord] = useState<VocabWord | null>(null);

  const currentLessonIndex = lessons.indexOf(lessonNumber);
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredWords = React.useMemo(() => {
    return words.filter((word) => {
      if (!normalizedSearch) return true;

      const meaning = getPrimaryMeaning(word);
      const searchableText = [
        word.word_id,
        word.logic.pos,
        word.base.kanji,
        word.base.reading,
        meaning.en,
        meaning.my,
        word.logic.grammar_pattern || "",
        word.logic.usage || "",
        word.logic.explanation?.en || "",
        word.logic.explanation?.my || "",
        ...Object.values(word.logic.conjugations || {}).flatMap((conjugation) => [
          conjugation.jp,
          conjugation.en,
          conjugation.my,
        ]),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [words, normalizedSearch]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem("vocab_bookmarks");
      if (saved) {
        try {
          setBookmarkedIds(new Set(JSON.parse(saved)));
        } catch (e) {
          console.error("Failed to parse vocab bookmarks", e);
        }
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem("vocab_bookmarks", JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const goToLesson = (nextLesson: number) => {
    router.push(`/vocabulary/${level}/lesson/${nextLesson}`);
  };

  const handleLessonChange = (value: number) => {
    goToLesson(value);
  };

  const handleViewDetails = (word: VocabWord) => {
    setSelectedWord(word);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-6 p-2 lg:flex-row lg:items-center lg:justify-between bg-card/40 backdrop-blur-md rounded-3xl border border-border/60 p-4 shadow-sm">
        <div className="flex w-full flex-col gap-4 sm:flex-row lg:w-auto">
          <LessonSelect
            value={lessonNumber}
            onChange={handleLessonChange}
            options={lessons.map((lesson) => ({
              value: lesson,
              label: `Lesson ${lesson}`,
            }))}
          />

          <LanguageSelect value={languagePref} onChange={setLanguagePref} />
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row lg:max-w-xl">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search word, reading, meaning..."
          />

          <div className="flex h-12 items-center justify-center gap-3 rounded-2xl border border-border/50 bg-card/70 px-5 py-2 shadow-sm backdrop-blur-md transition-all hover:bg-card hover:shadow-md sm:justify-start">
            <Switch
              id="furigana-toggle"
              checked={showFurigana}
              onCheckedChange={setShowFurigana}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="furigana-toggle" className="cursor-pointer text-xs font-bold uppercase tracking-widest text-foreground/70">
              Furigana
            </Label>
          </div>
        </div>
      </div>

      {filteredWords.length > 0 ? (
        <div className="space-y-3 md:hidden">
          {filteredWords.map((vocab) => {
            const meaning = getPrimaryMeaning(vocab);
            const bookmarked = bookmarkedIds.has(vocab.word_id);

            return (
              <Card
                key={vocab.word_id}
                className="group relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/80 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-1 hover:bg-card hover:shadow-[0_8px_30px_rgba(225,29,72,0.12)] duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center rounded-full bg-primary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                      {vocab.logic.pos}
                    </span>
                    <div className="mt-4 cursor-pointer" onClick={() => handleViewDetails(vocab)}>
                      {showFurigana && (
                        <p className="text-[11px] font-bold tracking-wide text-muted-foreground/60 transition-colors group-hover:text-primary/60">
                          {vocab.base.reading}
                        </p>
                      )}
                      <h3 className="font-heading text-3xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {getJapaneseDisplay(vocab)}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <PronunciationButton
                      text={vocab.base.reading || getJapaneseDisplay(vocab)}
                      label={`Pronounce ${getJapaneseDisplay(vocab)}`}
                    />
                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(vocab.word_id, e)}
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl transition-all ${bookmarked ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-card border border-border/60 text-muted-foreground hover:bg-primary/5 hover:text-primary"}`}
                      aria-label={bookmarked ? "Remove bookmark" : "Bookmark word"}
                    >
                      {bookmarked ? (
                        <BookmarkCheck className="h-5 w-5" />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewDetails(vocab)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-card border border-border/60 text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary"
                      aria-label={`View details for ${getJapaneseDisplay(vocab)}`}
                    >
                      <Image
                        src={getPublicAssetUrl("/sprite/paper.png", assetBasePath)}
                        alt=""
                        aria-hidden
                        width={20}
                        height={20}
                        className="h-7 w-7 object-contain"
                      />
                    </button>
                  </div>
                </div>

                <div className="mt-5 space-y-2 rounded-[1.5rem] bg-black/5 p-4 transition-colors group-hover:bg-primary/5">
                  {(languagePref === "en" || languagePref === "both") && (
                    <p className="text-sm font-bold leading-snug text-foreground">
                      {meaning.en || "-"}
                    </p>
                  )}
                  {(languagePref === "mm" || languagePref === "both") && (
                    <p className={`leading-snug text-foreground/70 ${languagePref === "both" ? "text-[11px] font-bold" : "text-sm font-bold"}`}>
                      {meaning.my || "-"}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card/70 p-8 text-center shadow-sm">
          <p className="font-semibold text-foreground">No vocabulary found.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a word, reading, part of speech, English meaning, or Burmese meaning.
          </p>
        </div>
      )}

      {filteredWords.length > 0 && (
      <Card className="hidden rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/60 overflow-hidden bg-card/80 backdrop-blur-xl p-0 py-0 md:flex">
        <div className="w-full overflow-hidden">
          <Table className="w-full table-fixed">
            <TableHeader className="bg-primary/80">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="w-[18%] px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground">Type</TableHead>
                <TableHead className="w-[28%] px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground">Japanese</TableHead>
                <TableHead className="w-[36%] px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground">Meaning</TableHead>
                <TableHead className="w-[9%] px-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground text-center">Save</TableHead>
                <TableHead className="w-[9%] px-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground text-center">Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWords.map((vocab) => {
                const meaning = getPrimaryMeaning(vocab);
                const bookmarked = bookmarkedIds.has(vocab.word_id);
                return (
                  <TableRow
                    key={vocab.word_id}
                    className="border-border/30 hover:bg-primary/5 group transition-all duration-300"
                  >
                    <TableCell className="w-[18%] px-2 py-3 pl-3 sm:pl-5">
                      <span className="inline-flex max-w-full items-center rounded-lg bg-background-soft px-2 py-1 text-[11px] font-medium text-muted-foreground shadow-sm transition-colors group-hover:bg-card sm:px-2.5 sm:text-xs">
                        <span className="min-w-0 wrap-break-word leading-tight">
                        {vocab.logic.pos}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="w-[28%] px-2 py-3 align-top">
                      <div className="flex flex-col gap-0.5 justify-center min-h-12" onClick={() => handleViewDetails(vocab)}>
                        {showFurigana && (
                          <span className="text-xs font-medium leading-tight text-muted-foreground break-all whitespace-normal">
                            {vocab.base.reading}
                          </span>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-base font-bold leading-tight tracking-wide text-primary sm:text-xl cursor-pointer hover:text-primary/80 transition-colors break-all whitespace-normal">
                            {getJapaneseDisplay(vocab)}
                          </span>
                          <PronunciationButton
                            text={vocab.base.reading || getJapaneseDisplay(vocab)}
                            label={`Pronounce ${getJapaneseDisplay(vocab)}`}
                            className="h-8 w-8 rounded-xl"
                            iconClassName="h-4 w-4"
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="w-[36%] px-2 py-3 align-top">
                      <div className="flex min-w-0 max-w-full flex-col gap-1">
                        {(languagePref === "en" || languagePref === "both") && (
                          <span className="block max-w-full whitespace-normal break-words text-sm font-medium leading-snug text-foreground [overflow-wrap:anywhere] sm:text-base">
                            {meaning.en || "-"}
                          </span>
                        )}
                        {(languagePref === "mm" || languagePref === "both") && (
                          <span className={`block max-w-full whitespace-normal break-words leading-snug font-bold text-foreground/80 [overflow-wrap:anywhere] ${languagePref === "both" ? "text-xs" : "text-sm font-medium text-foreground sm:text-base"}`}>
                            {meaning.my || "-"}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-[9%] px-1 py-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(vocab.word_id, e)}
                        className="inline-flex items-center justify-center rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-raspberry/10 hover:text-primary sm:p-2"
                        aria-label={bookmarked ? "Remove bookmark" : "Bookmark word"}
                      >
                        {bookmarked ? (
                          <BookmarkCheck className="w-5 h-5 text-primary fill-primary/20" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="w-[9%] px-1 py-3 pr-3 text-center sm:pr-5">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(vocab)}
                        className="inline-flex items-center justify-center rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 sm:p-2"
                        aria-label={`View details for ${getJapaneseDisplay(vocab)}`}
                        title="View vocabulary details"
                      >
                        <Image
                          src={getPublicAssetUrl("/sprite/paper.png", assetBasePath)}
                          alt=""
                          aria-hidden
                          width={20}
                          height={20}
                          className="h-7 w-7 object-contain"
                        />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
      )}

      <Pagination
        currentLesson={lessonNumber}
        totalRange={[lessons[0], lessons[lessons.length - 1]]}
        onPrevious={() => goToLesson(lessons[currentLessonIndex - 1])}
        onNext={() => goToLesson(lessons[currentLessonIndex + 1])}
        disablePrevious={currentLessonIndex <= 0}
        disableNext={currentLessonIndex === lessons.length - 1}
      />

      <VocabDetailModal 
        word={selectedWord}
        open={!!selectedWord}
        onOpenChange={(open) => !open && setSelectedWord(null)}
        languagePref={languagePref}
      />
    </div>
  );
}
