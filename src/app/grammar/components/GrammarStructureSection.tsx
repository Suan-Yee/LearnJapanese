import type { GrammarPoint } from "@/lib/grammar";
import { cn } from "@/lib/utils";

export function GrammarStructureSection({
  formation,
  className,
}: {
  formation: GrammarPoint["formation"];
  className?: string;
}) {
  return (
    <section className={cn("flex h-full flex-col gap-4", className)}>
      <h2 className="text-[11px] font-black uppercase tracking-[0.22em] text-primary/65">Structure</h2>
      <div className="flex h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
          {formation.map((f, i) => (
            <span key={`${i}-${f}`} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden className="text-lg font-light text-muted-foreground/45">
                  +
                </span>
              )}
              <span className="inline-block rounded-xl border border-primary/25 bg-primary/[0.07] px-4 py-2.5 font-heading text-base font-bold tracking-tight text-foreground shadow-sm dark:bg-primary/10">
                {f}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
