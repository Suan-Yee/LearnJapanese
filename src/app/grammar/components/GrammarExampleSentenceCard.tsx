import type { GrammarExample } from "@/lib/grammar";
import { SentenceBreakdown } from "@/components/ui-custom/SentenceBreakdown";
import { cn } from "@/lib/utils";

export function GrammarExampleSentenceCard({
  example,
  number,
  className,
}: {
  example: GrammarExample;
  number: number;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "grid grid-cols-[auto_1fr] gap-3 rounded-xl border border-border/70 bg-background/70 p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/25 bg-primary/[0.08] text-sm font-black text-primary">
        {number}
      </div>

      <div className="min-w-0 space-y-3">
        <div className="space-y-1.5">
          <p className="text-lg font-bold leading-snug text-foreground">{example.ja}</p>
          <p className="text-xs font-medium text-muted-foreground">{example.reading}</p>
        </div>

        {example.breakdown && <SentenceBreakdown parts={example.breakdown} />}

        <div className="grid gap-2 border-t border-border/70 pt-3">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary/70">
              English
            </p>
            <p className="text-sm font-semibold leading-relaxed text-foreground/85">{example.en}</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary/70">
              Myanmar
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">{example.my}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
