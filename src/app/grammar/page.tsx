import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getGrammarLevels, getGrammarLevelStats } from "@/lib/grammar";

export default function GrammarPage() {
  const levels = getGrammarLevels();

  return (
    <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 mt-4">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground mb-2">
            Grammar
          </h1>
          <p className="text-muted-foreground text-lg">
            Learn Japanese grammar patterns with clear explanations, conjugation tables, and example sentences.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {levels.map((level) => {
            const stats = getGrammarLevelStats(level);
            return (
              <Link key={level} href={`/grammar/${level}`}>
                <Card className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:bg-card hover:shadow-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge className="mb-4 rounded-full">{level}</Badge>
                      <h2 className="font-heading text-2xl font-bold text-foreground">
                        {level} Grammar
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {stats.lessonCount} lessons · {stats.pointCount} grammar points
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-5 w-5 text-primary" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
