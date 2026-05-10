import type { GrammarPoint } from "@/lib/grammar";
import { GrammarExampleSentenceCard } from "./GrammarExampleSentenceCard";
import { cn } from "@/lib/utils";

export function GrammarExamplesSection({
  examples,
  className,
}: {
  examples: GrammarPoint["examples"];
  className?: string;
}) {
  if (examples.length === 0) return null;

  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-[11px] font-black uppercase tracking-[0.22em] text-primary/65">Examples</h2>
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div
          className={cn(
            "space-y-3",
            examples.length > 2 && "max-h-[34rem] overflow-y-auto pr-2",
          )}
        >
          {examples.map((ex, i) => (
            <GrammarExampleSentenceCard key={`${ex.ja}-${i}`} example={ex} number={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
