"use client";

import { useState } from "react";
import { ChevronDown, Lightbulb, ChevronRight } from "lucide-react";
import type { GrammarPoint } from "@/lib/grammar";
import { SentenceBreakdown } from "./SentenceBreakdown";
import { ConjugationTable } from "./ConjugationTable";
import { cn } from "@/lib/utils";

export function GrammarCard({ point, index }: { point: GrammarPoint; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const [showMore, setShowMore] = useState(false);

  const primaryExample = point.examples[0];
  const extraExamples = point.examples.slice(1);
  const hasSecondary = point.conjugation || extraExamples.length > 0 || point.tips.length > 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 shadow-sm transition-all hover:shadow-md overflow-hidden">
      {/* ─── Layer 1: Always Visible — Pattern + Meaning ─── */}
      <button
        onClick={() => { setExpanded(!expanded); if (expanded) setShowMore(false); }}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-primary/[0.03]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center">
            {index + 1}
          </span>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-black font-heading text-foreground truncate">
              {point.pattern}
            </h3>
            <p className="text-sm font-medium text-muted-foreground truncate mt-0.5">
              {point.meaning.en} · {point.meaning.my}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0",
            expanded && "rotate-180"
          )}
        />
      </button>

      {/* ─── Layer 2: Primary Content — Formation, Explanation, Key Example ─── */}
      {expanded && (
        <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Formation — the most important "how to use" info */}
          <div className="flex flex-wrap gap-2 mb-4">
            {point.formation.map((f, i) => (
              <span
                key={i}
                className="inline-block rounded-lg bg-primary/8 border border-primary/20 px-3 py-1.5 text-sm font-bold text-foreground"
              >
                {f}
              </span>
            ))}
          </div>

          {/* Explanation — concise */}
          <p className="text-sm leading-relaxed text-foreground/85 mb-1">
            {point.explanation.en}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground mb-4">
            {point.explanation.my}
          </p>

          {/* Key Example — always show the first one prominently */}
          {primaryExample && (
            <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-4 space-y-2">
              <p className="text-lg font-bold text-foreground leading-snug">
                {primaryExample.ja}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {primaryExample.reading}
              </p>
              {primaryExample.breakdown && (
                <SentenceBreakdown parts={primaryExample.breakdown} />
              )}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 pt-1.5 border-t border-border/30 text-sm">
                <span className="font-semibold text-foreground/80">🇬🇧 {primaryExample.en}</span>
                <span className="font-medium text-muted-foreground">🇲🇲 {primaryExample.my}</span>
              </div>
            </div>
          )}

          {/* ─── Layer 3 Toggle ─── */}
          {hasSecondary && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border/40 bg-muted/30 text-xs font-bold text-muted-foreground uppercase tracking-widest transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <ChevronRight className={cn("w-3.5 h-3.5 transition-transform duration-200", showMore && "rotate-90")} />
              {showMore ? "Show less" : `More details${point.conjugation ? " · Conjugation" : ""}${extraExamples.length > 0 ? ` · ${extraExamples.length} more example${extraExamples.length > 1 ? "s" : ""}` : ""}${point.tips.length > 0 ? " · Tips" : ""}`}
            </button>
          )}

          {/* ─── Layer 3: Secondary Content ─── */}
          {showMore && (
            <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
              {/* Conjugation Table */}
              {point.conjugation && (
                <ConjugationTable data={point.conjugation} />
              )}

              {/* Extra Examples */}
              {extraExamples.length > 0 && (
                <div className="space-y-2">
                  {extraExamples.map((ex, ei) => (
                    <div
                      key={ei}
                      className="rounded-xl border border-border/30 bg-background-soft/30 p-3 space-y-1"
                    >
                      <p className="text-base font-bold text-foreground">{ex.ja}</p>
                      <p className="text-xs text-muted-foreground">{ex.reading}</p>
                      {ex.breakdown && <SentenceBreakdown parts={ex.breakdown} />}
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-sm">
                        <span className="font-semibold text-foreground/75">🇬🇧 {ex.en}</span>
                        <span className="font-medium text-muted-foreground">🇲🇲 {ex.my}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tips */}
              {point.tips.length > 0 && (
                <div className="rounded-xl bg-amber-500/5 border border-amber-500/15 p-3 space-y-1.5">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Tips
                  </h4>
                  <ul className="space-y-1">
                    {point.tips.map((tip, ti) => (
                      <li key={ti} className="flex items-start gap-2 text-sm text-foreground/75">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500/50 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
