"use client";

import { Card } from "@/components/ui/card";
import { Bookmark, BookmarkCheck } from "lucide-react";
import type { KanjiItem } from "@/lib/kanji";
import { PronunciationButton } from "./PronunciationButton";

interface KanjiCardProps {
  kanji: KanjiItem;
  languagePref: "en" | "mm" | "both";
  isBookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent) => void;
  onClick: (kanji: KanjiItem) => void;
}

export function KanjiCard({ kanji, languagePref, isBookmarked, onToggleBookmark, onClick }: KanjiCardProps) {
  return (
    <Card
      onClick={() => onClick(kanji)}
      className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(225,29,72,0.12)] active:scale-95 sm:p-6"
    >
      <div className="flex w-full items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-gradient-to-br from-raspberry/10 to-transparent shadow-inner transition-colors duration-300 group-hover:bg-card sm:h-20 sm:w-20">
            <span className="font-heading text-4xl font-bold text-primary sm:text-5xl">
              {kanji.character}
            </span>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
            <div className="flex flex-col">
              <span className="mb-1 text-[10px] font-bold uppercase leading-none tracking-widest text-primary/60 sm:text-xs">
                Onyomi
              </span>
              <span className="truncate text-sm font-bold leading-none text-foreground sm:text-base">
                {kanji.onyomi}
              </span>
            </div>
            <div className="mt-1 flex flex-col">
              <span className="mb-1 text-[10px] font-bold uppercase leading-none tracking-widest text-primary/60 sm:text-xs">
                Kunyomi
              </span>
              <span className="truncate text-sm font-bold leading-none text-foreground sm:text-base">
                {kanji.kunyomi}
              </span>
            </div>
          </div>
        </div>

        <div className="ml-2 flex shrink-0 flex-col items-end gap-2">
          <div className="origin-top-right text-3xl drop-shadow-sm transition-transform duration-300 group-hover:scale-110 sm:text-4xl">
            {kanji.emoji}
          </div>
          <PronunciationButton
            text={kanji.kunyomi || kanji.onyomi || kanji.character}
            label={`Pronounce ${kanji.character}`}
            className="h-9 w-9 rounded-xl"
            iconClassName="h-4 w-4"
          />
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-border/60 pt-4">
        <div className="flex flex-col gap-1 pr-4">
          {(languagePref === "en" || languagePref === "both") && (
            <span className="line-clamp-1 font-heading text-xl font-bold text-foreground transition-colors sm:text-2xl">
              {kanji.meaning.en}
            </span>
          )}
          {(languagePref === "mm" || languagePref === "both") && (
            <span
              className={`line-clamp-1 font-bold text-foreground/80 transition-colors ${
                languagePref === "both"
                  ? "text-sm sm:text-base"
                  : "font-heading text-xl sm:text-2xl"
              }`}
            >
              {kanji.meaning.my}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onToggleBookmark}
          className={`inline-flex shrink-0 h-10 w-10 items-center justify-center rounded-2xl transition-all ${
            isBookmarked
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "border border-border/60 bg-primary/5 text-primary hover:bg-primary/25"
          }`}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark kanji"}
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-5 w-5" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </button>
      </div>
    </Card>
  );
}
