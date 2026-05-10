import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export function GrammarTipsCallout({
  tips,
  title = "Tips",
  className,
}: {
  tips: string[];
  title?: string;
  className?: string;
}) {
  if (tips.length === 0) return null;

  return (
    <div
      className={cn(
        "h-full rounded-xl border border-amber-400/30 bg-amber-50/60 p-3.5 sm:p-4 dark:border-amber-500/20 dark:bg-amber-500/[0.06]",
        className,
      )}
    >
      <h3 className="mb-2.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-700/85 dark:text-amber-400/90">
        <Lightbulb className="size-3.5 shrink-0 opacity-85" aria-hidden />
        {title}
      </h3>
      <ul className="space-y-2">
        {tips.map((tip, ti) => (
          <li key={ti} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/80">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500/45 dark:bg-amber-400/40" aria-hidden />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
