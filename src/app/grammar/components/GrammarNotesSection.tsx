import type { GrammarPoint } from "@/lib/grammar";
import { GrammarTipsCallout } from "./GrammarTipsCallout";
import { cn } from "@/lib/utils";

export function GrammarNotesSection({
  tips,
  className,
}: {
  tips: GrammarPoint["tips"];
  className?: string;
}) {
  if (tips.length === 0) return null;

  return (
    <section className={cn("flex h-full flex-col gap-6", className)}>
      <h2 className="text-[11px] font-black uppercase tracking-[0.22em] text-primary/65">Notes</h2>
      <GrammarTipsCallout tips={tips} />
    </section>
  );
}
