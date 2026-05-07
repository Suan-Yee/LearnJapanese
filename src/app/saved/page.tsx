"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { BookmarkCheck, Eye, BookOpen, Brush } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSavedVocab, getSavedKanji } from "@/app/(actions)/getSavedItems";
import type { VocabWord } from "@/lib/vocabulary";
import type { KanjiItem } from "@/lib/kanji";
import { getPrimaryMeaning } from "@/lib/vocabulary";
import { VocabDetailModal } from "@/components/ui-custom/VocabDetailModal";
import { KanjiCard } from "@/components/ui-custom/KanjiCard";
import { PronunciationButton } from "@/components/ui-custom/PronunciationButton";
import { LanguageSelect, type LanguagePref } from "@/components/ui-custom/LanguageSelect";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { KanjiStrokeViewer } from "@/components/ui-custom/KanjiStrokeViewer";

export default function SavedPage() {
  const [languagePref, setLanguagePref] = useState<LanguagePref>("both");
  
  const [vocabIds, setVocabIds] = useState<Set<string>>(new Set());
  const [kanjiIds, setKanjiIds] = useState<Set<string>>(new Set());
  
  const [savedVocab, setSavedVocab] = useState<VocabWord[]>([]);
  const [savedKanji, setSavedKanji] = useState<KanjiItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);

  const [selectedVocab, setSelectedVocab] = useState<VocabWord | null>(null);
  const [selectedKanji, setSelectedKanji] = useState<KanjiItem | null>(null);

  useEffect(() => {
    const loadBookmarks = async () => {
      const vSaved = localStorage.getItem("vocab_bookmarks");
      const kSaved = localStorage.getItem("kanji_bookmarks");
      
      const vIds = vSaved ? JSON.parse(vSaved) : [];
      const kIds = kSaved ? JSON.parse(kSaved) : [];
      
      setVocabIds(new Set(vIds));
      setKanjiIds(new Set(kIds));

      if (vIds.length > 0) {
        const vocabData = await getSavedVocab(vIds);
        setSavedVocab(vocabData);
      }
      
      if (kIds.length > 0) {
        const kanjiData = await getSavedKanji(kIds);
        setSavedKanji(kanjiData);
      }
      
      setIsLoading(false);
    };
    
    loadBookmarks();
  }, []);

  const toggleVocabBookmark = (id: string) => {
    setVocabIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("vocab_bookmarks", JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const toggleKanjiBookmark = (id: string, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setKanjiIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("kanji_bookmarks", JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const filteredVocab = savedVocab.filter(v => vocabIds.has(v.word_id));
  const filteredKanji = savedKanji.filter(k => kanjiIds.has(k.id));

  return (
    <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 mt-4 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground mb-2">
              Saved Items
            </h1>
            <p className="text-muted-foreground text-lg">
              Review your bookmarked vocabulary and kanji.
            </p>
          </div>
          <LanguageSelect value={languagePref} onChange={setLanguagePref} />
        </div>

        <Tabs defaultValue="vocab" className="w-full flex-col">
          <TabsList className="mb-8 inline-flex h-12 w-full max-w-sm items-center justify-center rounded-2xl bg-card/60 p-1 shadow-sm sm:w-auto">
            <TabsTrigger
              value="vocab"
              className="flex-1 rounded-xl px-8 py-2.5 text-sm font-bold uppercase tracking-widest transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              Vocabulary ({filteredVocab.length})
            </TabsTrigger>
            <TabsTrigger
              value="kanji"
              className="flex-1 rounded-xl px-8 py-2.5 text-sm font-bold uppercase tracking-widest transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              Kanji ({filteredKanji.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vocab" className="mt-0 w-full">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading saved vocabulary...</div>
            ) : filteredVocab.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVocab.map((vocab) => {
                  const meaning = getPrimaryMeaning(vocab);
                  return (
                    <Card
                      key={vocab.word_id}
                      className="group relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/80 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-1 hover:bg-card hover:shadow-[0_8px_30px_rgba(225,29,72,0.12)] duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex gap-2">
                            <span className="inline-flex items-center rounded-full bg-primary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                              {vocab.jlpt}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-primary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                              {vocab.logic.pos}
                            </span>
                          </div>
                          <div className="mt-4 cursor-pointer" onClick={() => setSelectedVocab(vocab)}>
                            <p className="text-[11px] font-bold tracking-wide text-muted-foreground/60 transition-colors group-hover:text-primary/60">
                              {vocab.base.reading}
                            </p>
                            <h3 className="font-heading text-3xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                              {vocab.base.kanji || vocab.base.reading}
                            </h3>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <PronunciationButton
                            text={vocab.base.reading || vocab.base.kanji}
                            label={`Pronounce ${vocab.base.kanji || vocab.base.reading}`}
                          />
                          <button
                            type="button"
                            onClick={() => toggleVocabBookmark(vocab.word_id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl transition-all bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
                            aria-label="Remove bookmark"
                          >
                            <BookmarkCheck className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedVocab(vocab)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-card border border-border/60 text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary"
                            aria-label="View details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 space-y-2 rounded-[1.5rem] bg-black/5 p-4 transition-colors group-hover:bg-primary/5">
                        {(languagePref === "en" || languagePref === "both") && (
                          <p className="text-sm font-bold leading-snug text-foreground">
                            {meaning.en || "-"}
                          </p>
                        )}
                        {(languagePref === "mm" || languagePref === "both") && (
                          <p className={`leading-snug text-foreground/70 ${languagePref === "both" ? "text-[11px] font-bold" : "text-sm font-bold"}`}>
                            {meaning.my || "-"}
                          </p>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-border/60 bg-card/70 p-8 text-center shadow-sm">
                <p className="font-semibold text-foreground">No saved vocabulary.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your bookmarked words will appear here.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="kanji" className="mt-0 w-full">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading saved kanji...</div>
            ) : filteredKanji.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {filteredKanji.map((kanji) => (
                  <KanjiCard
                    key={kanji.id}
                    kanji={kanji}
                    languagePref={languagePref}
                    isBookmarked={true}
                    onToggleBookmark={(e) => toggleKanjiBookmark(kanji.id, e)}
                    onClick={setSelectedKanji}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border/60 bg-card/70 p-8 text-center shadow-sm">
                <p className="font-semibold text-foreground">No saved kanji.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your bookmarked kanji will appear here.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Detail Modals */}
        <VocabDetailModal
          word={selectedVocab}
          open={!!selectedVocab}
          onOpenChange={(open) => !open && setSelectedVocab(null)}
          languagePref={languagePref}
        />

        <Dialog open={!!selectedKanji} onOpenChange={(open) => !open && setSelectedKanji(null)}>
          <DialogContent className="max-h-[92vh] max-w-4xl overflow-hidden rounded-3xl border border-border/60 bg-card/95 p-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl sm:max-w-4xl">
            {selectedKanji && (
              <div className="max-h-[88vh] overflow-y-auto p-5 sm:p-7">
                <DialogHeader>
                  <DialogTitle className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-primary/10 shadow-inner sm:h-24 sm:w-24">
                        <span className="font-heading text-5xl font-bold text-primary sm:text-6xl">
                          {selectedKanji.character}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="flex flex-wrap gap-2">
                          <Badge>{selectedKanji.level}</Badge>
                          <Badge variant="secondary">
                            Lesson {selectedKanji.lessonNumber}
                          </Badge>
                          <Badge variant="outline">{selectedKanji.lessonTitle}</Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap items-end gap-3">
                          {(languagePref === "en" || languagePref === "both") && (
                            <p className="font-heading text-3xl font-bold text-foreground">
                              {selectedKanji.meaning.en}
                            </p>
                          )}
                          {(languagePref === "mm" || languagePref === "both") && (
                            <p
                              className={`font-bold text-foreground/80 ${
                                languagePref === "both"
                                  ? "text-lg"
                                  : "font-heading text-3xl"
                              }`}
                            >
                              {selectedKanji.meaning.my}
                            </p>
                          )}
                          <span className="text-4xl leading-none">
                            {selectedKanji.emoji}
                          </span>
                          <PronunciationButton
                            text={selectedKanji.kunyomi || selectedKanji.onyomi || selectedKanji.character}
                            label={`Pronounce ${selectedKanji.character}`}
                          />
                        </div>
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
                          Readings
                        </h3>
                      </div>
                      <div className="grid gap-3 min-[420px]:grid-cols-2">
                        <div className="rounded-2xl border border-border bg-card/70 p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-primary/70">
                            Onyomi
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <p className="wrap-break-word font-heading text-xl font-bold text-foreground">
                              {selectedKanji.onyomi}
                            </p>
                            <PronunciationButton
                              text={selectedKanji.onyomi}
                              label={`Pronounce onyomi ${selectedKanji.onyomi}`}
                              className="h-8 w-8 rounded-xl"
                              iconClassName="h-4 w-4"
                            />
                          </div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card/70 p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-primary/70">
                            Kunyomi
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <p className="wrap-break-word font-heading text-xl font-bold text-foreground">
                              {selectedKanji.kunyomi}
                            </p>
                            <PronunciationButton
                              text={selectedKanji.kunyomi}
                              label={`Pronounce kunyomi ${selectedKanji.kunyomi}`}
                              className="h-8 w-8 rounded-xl"
                              iconClassName="h-4 w-4"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
                      <div className="mb-4 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary/80">
                          Example words
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {selectedKanji.examples.map((example) => (
                          <div
                            key={`${selectedKanji.id}-${example.word}-${example.reading}`}
                            className="rounded-2xl border border-border bg-card/70 p-4"
                          >
                            <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="wrap-break-word font-heading text-2xl font-bold text-foreground">
                                    {example.word}
                                  </p>
                                  <PronunciationButton
                                    text={example.reading || example.word}
                                    label={`Pronounce ${example.word}`}
                                    className="h-8 w-8 rounded-xl"
                                    iconClassName="h-4 w-4"
                                  />
                                </div>
                                <p className="wrap-break-word text-sm font-semibold text-muted-foreground">
                                  {example.reading}
                                </p>
                              </div>
                              <div className="flex flex-col items-start gap-1 min-[420px]:items-end">
                                {(languagePref === "en" ||
                                  languagePref === "both") && (
                                  <p className="rounded-xl bg-background-soft px-3 py-2 text-sm font-bold text-foreground">
                                    {example.meaning.en}
                                  </p>
                                )}
                                {(languagePref === "mm" ||
                                  languagePref === "both") && (
                                  <p className="px-2 py-0.5 text-xs font-bold text-foreground/80">
                                    {example.meaning.my}
                                  </p>
                                )}
                              </div>
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
                        Replay the stroke animation and trace each stroke in order before practicing from memory.
                      </p>
                    </div>
                  </section>

                  <KanjiStrokeViewer character={selectedKanji.character} />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
