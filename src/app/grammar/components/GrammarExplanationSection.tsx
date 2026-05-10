import type { GrammarPoint } from "@/lib/grammar";
import { cn } from "@/lib/utils";

export function GrammarExplanationSection({
  explanation,
  className,
}: {
  explanation: GrammarPoint["explanation"];
  className?: string;
}) {
  return (
    <section className={cn("flex h-full flex-col gap-6", className)}>
      <h2 className="text-[11px] font-black uppercase tracking-[0.22em] text-primary/65">Explanation</h2>
      <div className="flex h-full flex-col space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <p className="text-[15px] leading-[1.75] text-foreground/90 sm:text-base">{explanation.en}</p>
        <hr className="border-border" />
        <p className="text-[15px] leading-[1.75] text-muted-foreground sm:text-base">{explanation.my}</p>
      </div>
    </section>
  );
}
