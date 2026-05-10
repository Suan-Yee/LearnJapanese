import { Badge } from "@/components/ui/badge";
import type { GrammarPoint } from "@/lib/grammar";
import { cn } from "@/lib/utils";

export function GrammarHeader({
  point,
  className,
}: {
  point: GrammarPoint;
  className?: string;
}) {
  return (
    <header className={cn("rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <Badge className="rounded-full font-bold">{point.level}</Badge>
        {point.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {point.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-muted/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <h1 className="font-heading text-3xl font-black tracking-tight text-foreground sm:text-4xl">
        {point.pattern}
      </h1>
      <div className="max-w-prose space-y-1 border-l-4 border-primary/50 pl-4">
        <p className="text-base font-semibold leading-relaxed text-foreground/90 sm:text-lg">{point.meaning.en}</p>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{point.meaning.my}</p>
      </div>
    </header>
  );
}
