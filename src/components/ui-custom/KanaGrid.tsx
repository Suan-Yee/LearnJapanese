"use client";

import { useMemo, useState } from "react";
import { BookOpen, Brush } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { KanjiStrokeViewer } from "@/components/ui-custom/KanjiStrokeViewer";
import {
  getKanaByScript,
  type KanaGroup,
  type KanaItem,
  type KanaScript,
} from "@/lib/kana";
import { cn } from "@/lib/utils";
import { SearchInput } from "./SearchInput";

const scripts: { value: KanaScript; label: string; description: string }[] = [
  {
    value: "hiragana",
    label: "Hiragana",
    description: "Native Japanese words and grammar",
  },
  {
    value: "katakana",
    label: "Katakana",
    description: "Loanwords, names, and emphasis",
  },
];

const groupLabels: Record<KanaGroup, string> = {
  basic: "Basic sounds",
  voiced: "Voiced sounds",
};

const groupDescriptions: Record<KanaGroup, string> = {
  basic: "The core kana chart for first-time reading practice.",
  voiced: "Dakuten and handakuten sounds built from the basic rows.",
};

export function KanaGrid() {
  const [activeScript, setActiveScript] = useState<KanaScript>("hiragana");
  const [selectedKana, setSelectedKana] = useState<KanaItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedSearch = searchQuery.trim().toLowerCase();

  const visibleKana = useMemo(() => {
    const kana = getKanaByScript(activeScript);
    if (!normalizedSearch) return kana;

    return kana.filter((item) => {
      const searchableText = [
        item.character,
        item.romaji,
        item.row,
        item.group,
        ...item.examples.flatMap((example) => [
          example.word,
          example.reading,
          example.meaning,
        ]),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [activeScript, normalizedSearch]);

  const selectedScript = scripts.find((script) => script.value === activeScript);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border/60 bg-card/60 p-1 shadow-sm backdrop-blur-md sm:w-fit">
          {scripts.map((script) => {
            const isActive = activeScript === script.value;

            return (
              <button
                key={script.value}
                type="button"
                onClick={() => {
                  setActiveScript(script.value);
                  setSearchQuery("");
                }}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center rounded-xl px-4 py-2 text-sm font-bold transition-all sm:min-w-40",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-card hover:text-primary",
                )}
              >
                <span>{script.label}</span>
                <span className={cn("text-[0.68rem] font-semibold", isActive ? "text-white/80" : "text-muted-foreground")}>
                  {script.value === "hiragana" ? "あいうえお" : "アイウエオ"}
                </span>
              </button>
            );
          })}
        </div>

        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search kana, romaji, example..."
        />
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm backdrop-blur-md">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">
              {selectedScript?.label}
            </p>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              {selectedScript?.description}
            </p>
          </div>
          <Badge variant="secondary" className="h-7 rounded-full px-3 font-bold">
            {visibleKana.length} kana
          </Badge>
        </div>
      </div>

      {(["basic", "voiced"] as KanaGroup[]).map((group) => {
        const groupKana = visibleKana.filter((kana) => kana.group === group);
        if (groupKana.length === 0) return null;

        return (
          <section key={group} className="space-y-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground">
                  {groupLabels[group]}
                </h2>
                <p className="text-sm font-medium text-muted-foreground">
                  {groupDescriptions[group]}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-3 md:grid-cols-10">
              {groupKana.map((kana) => (
                <button
                  key={kana.id}
                  type="button"
                  onClick={() => setSelectedKana(kana)}
                  className="group flex aspect-square min-h-16 flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/80 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:bg-card hover:shadow-lg focus-visible:ring-3 focus-visible:ring-primary/20"
                  aria-label={`Open details for ${kana.character}, ${kana.romaji}`}
                >
                  <span className="font-heading text-3xl font-bold leading-none text-foreground transition-colors group-hover:text-primary sm:text-4xl">
                    {kana.character}
                  </span>
                  <span className="mt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {kana.romaji}
                  </span>
                </button>
              ))}
            </div>
          </section>
        );
      })}

      <Dialog open={!!selectedKana} onOpenChange={(open) => !open && setSelectedKana(null)}>
        <DialogContent className="max-h-[92vh] max-w-4xl overflow-hidden rounded-3xl border border-border/60 bg-card/95 p-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl sm:max-w-4xl">
          {selectedKana && (
            <div className="max-h-[88vh] overflow-y-auto p-5 sm:p-7">
              <DialogHeader>
                <DialogTitle className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-primary/10 shadow-inner sm:h-24 sm:w-24">
                      <span className="font-heading text-5xl font-bold text-primary sm:text-6xl">
                        {selectedKana.character}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="flex flex-wrap gap-2">
                        <Badge>{selectedKana.script}</Badge>
                        <Badge variant="secondary">{selectedKana.group}</Badge>
                      </div>
                      <p className="mt-3 font-heading text-3xl font-bold text-foreground">
                        {selectedKana.romaji}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-muted-foreground">
                        Row: {selectedKana.row}
                      </p>
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
                <section className="space-y-4">
                  <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-bold uppercase tracking-widest text-primary/80">
                        Example words
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {selectedKana.examples.map((example) => (
                        <div
                          key={`${selectedKana.id}-${example.word}`}
                          className="rounded-2xl border border-border bg-card/70 p-4"
                        >
                          <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                            <div>
                              <p className="font-heading text-2xl font-bold text-foreground">
                                {example.word}
                              </p>
                              <p className="text-sm font-semibold text-muted-foreground">
                                {example.reading}
                              </p>
                            </div>
                            <p className="rounded-xl bg-background-soft px-3 py-2 text-sm font-bold text-foreground">
                              {example.meaning}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <Brush className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-bold uppercase tracking-widest text-primary/80">
                        Writing note
                      </h3>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                      Follow the stroke animation from start to finish, then replay it a few times before writing the kana by hand.
                    </p>
                  </div>
                </section>

                <KanjiStrokeViewer character={selectedKana.character} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
