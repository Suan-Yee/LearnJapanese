"use client";

import type { SentenceBreakdown as BreakdownType } from "@/lib/grammar";

const ROLE_COLORS: Record<string, string> = {
  topic: "bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border-pink-200/60 dark:border-pink-800/50",
  subject: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/50",
  particle: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/50",
  verb: "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300 border-green-200/60 dark:border-green-800/50",
  noun: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/50",
  adjective: "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200/60 dark:border-teal-800/50",
  adverb: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200/60 dark:border-cyan-800/50",
  copula: "bg-slate-50 text-slate-600 dark:bg-slate-900/40 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/50",
  auxiliary: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/50",
  conjunction: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200/60 dark:border-orange-800/50",
  other: "bg-gray-50 text-gray-600 dark:bg-gray-900/40 dark:text-gray-300 border-gray-200/60 dark:border-gray-700/50",
};

export function SentenceBreakdown({ parts }: { parts: BreakdownType[] }) {
  return (
    <div className="flex flex-wrap items-end gap-1 py-1.5">
      {parts.map((part, i) => (
        <div key={i} className="flex flex-col items-center">
          {part.reading && (
            <span className="text-[9px] text-muted-foreground/70 font-medium mb-0.5">
              {part.reading}
            </span>
          )}
          <span
            className={`inline-block rounded-md border px-2 py-1 text-sm font-bold leading-tight ${ROLE_COLORS[part.role] || ROLE_COLORS.other}`}
            title={part.gloss ? `${part.role}: ${part.gloss}` : part.role}
          >
            {part.word}
          </span>
          {part.gloss && (
            <span className="text-[8px] font-semibold text-muted-foreground/60 mt-0.5">
              {part.gloss}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
