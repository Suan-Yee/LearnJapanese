import Link from "next/link";
import type { ResolvedRelatedGrammar } from "@/lib/grammar";
import { cn } from "@/lib/utils";

export function GrammarRelatedSection({
  items,
  className,
}: {
  items: ResolvedRelatedGrammar[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className={cn("rounded-2xl border border-border/50 bg-muted/25 p-5 dark:bg-muted/15", className)}>
      <h2 className="text-[11px] font-black uppercase tracking-[0.22em] text-primary/65">Related grammar</h2>
      <ul className="mt-4 flex flex-col gap-2">
        {items.map((item, i) =>
          item.kind === "link" ? (
            <li key={`${item.id}-${i}`}>
              <Link
                href={`/grammar/${item.level}/lesson/${item.lessonNumber}/point/${item.id}`}
                className="group flex items-center justify-between rounded-xl border border-border/40 bg-card/60 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary/[0.04]"
              >
                <span>{item.pattern}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary">
                  Open
                </span>
              </Link>
            </li>
          ) : (
            <li
              key={`${item.label}-${i}`}
              className="rounded-xl border border-dashed border-border/50 px-4 py-2.5 text-sm text-muted-foreground"
            >
              {item.label}
            </li>
          ),
        )}
      </ul>
    </section>
  );
}
