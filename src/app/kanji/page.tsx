"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { KanjiContentGate } from "./KanjiContentGate";
import {
  getKanjiLevelStats,
  getKanjiLevels,
  type KanjiLevel,
} from "@/lib/kanji";
import { getCachedPath } from "@/lib/navigation-path-cache";

export default function KanjiPage() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);
  const levels = getKanjiLevels();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const lastPath = getCachedPath("last_kanji_path");
      if (lastPath && lastPath !== "/kanji") {
        router.replace(lastPath);
      } else {
        setIsRedirecting(false);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  if (isRedirecting) {
    return <div className="flex-1 bg-background-soft" />;
  }

  return (
    <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 mt-4">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground mb-2">
            Kanji Practice
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose a JLPT level and study kanji by lesson.
          </p>
        </div>

        <KanjiContentGate cacheKey="kanji-levels" variant="levels">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {levels.map((level: KanjiLevel) => {
              const stats = getKanjiLevelStats(level);
              const hasLessons = stats.lessonCount > 0;

              return (
                <Link key={level} href={`/kanji/${level}`}>
                  <Card className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:bg-card hover:shadow-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Badge className="mb-4 rounded-full">{level}</Badge>
                        <h2 className="font-heading text-2xl font-bold text-foreground">
                          {level} Kanji
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {hasLessons
                            ? `${stats.lessonCount} lessons · ${stats.kanjiCount} kanji`
                            : "Lessons coming soon"}
                        </p>
                      </div>
                      <ArrowRight className="mt-1 h-5 w-5 text-primary" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </KanjiContentGate>
      </div>
    </main>
  );
}
