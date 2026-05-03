"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, Info, Hash, Layers, MessageCircle } from "lucide-react";
import type { VocabWord } from "@/lib/vocabulary";

interface VocabDetailModalProps {
  word: VocabWord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  languagePref: "en" | "mm" | "both";
}

function labelFromKey(value: string) {
  return value.replaceAll("_", " ");
}

export function VocabDetailModal({
  word,
  open,
  onOpenChange,
  languagePref,
}: VocabDetailModalProps) {
  if (!word) return null;

  const conjugations = Object.entries(word.logic.conjugations || {});
  const hasGrammar = !!word.logic.grammar_pattern;
  const hasExplanation = !!(word.logic.explanation?.en || word.logic.explanation?.my || word.logic.usage);
  const hasExamples = !!(word.usage && word.usage.length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] w-full max-w-[calc(100%-1rem)] overflow-hidden rounded-[2rem] border border-border/40 bg-card p-0 shadow-[0_32px_64px_rgba(0,0,0,0.1)] sm:max-w-3xl">
        <div className="max-h-[90vh] overflow-y-auto scrollbar-hide">
          <div className="px-8 py-8 sm:px-12 sm:py-10">
            {/* Tag Group */}
            <div className="mb-8 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full border-primary/20 bg-accent px-3 py-1 text-xs font-bold text-primary uppercase tracking-tight">{word.jlpt}</Badge>
              <Badge variant="outline" className="rounded-full border-primary/20 bg-accent px-3 py-1 text-xs font-bold text-primary uppercase tracking-tight">{labelFromKey(word.logic.pos)}</Badge>
              {word.logic.category && (
                <Badge variant="outline" className="rounded-full border-primary/20 bg-accent px-3 py-1 text-xs font-bold text-primary uppercase tracking-tight">
                  {word.logic.category}
                </Badge>
              )}
              <div className="ml-auto">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">#{word.word_id}</span>
              </div>
            </div>

            {/* Main Content: Definition Block */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-12">
              {/* Left Column: Japanese */}
              <div className="space-y-2 min-w-0 sm:shrink-0 sm:max-w-[45%]">
                <h1 className="font-heading text-4xl font-black tracking-tighter text-foreground sm:text-5xl break-words">
                  {word.base.kanji || word.base.reading}
                </h1>
                <p className="text-base font-medium text-muted-foreground sm:text-lg break-words">
                  {word.base.reading}
                </p>
              </div>
              
              {/* Vertical Accent Divider */}
              <div className="hidden h-16 w-px bg-rose-200/60 sm:block sm:shrink-0"></div>
              <div className="h-px w-12 bg-rose-200/60 sm:hidden"></div>

              {/* Right Column: Meanings */}
              <div className="space-y-1 min-w-0 flex-1">
                {(languagePref === "en" || languagePref === "both") && (
                  <p className="text-xl font-bold tracking-tight text-foreground sm:text-2xl break-words">
                    {word.logic.meaning?.en || "-"}
                  </p>
                )}
                {(languagePref === "mm" || languagePref === "both") && (
                  <p className={`font-bold text-primary/70 break-words ${languagePref === "both" ? "text-base" : "text-xl sm:text-2xl"}`}>
                    {word.logic.meaning?.my || "-"}
                  </p>
                )}
              </div>
            </div>
            
            {(hasGrammar || hasExplanation || hasExamples || conjugations.length > 0) && (
              <div className="mt-8 border-t border-primary/20/80 pt-4"></div>
            )}
          </div>

          {(hasGrammar || hasExplanation || hasExamples || conjugations.length > 0) && (
            <div className="space-y-8 px-8 pb-8 pt-0 sm:px-12 sm:pb-12">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-border/60 to-transparent"></div>
              {/* Grammar & Usage Section */}
            {(hasGrammar || hasExplanation) && (
              <section className="grid gap-6 sm:grid-cols-2">
                {hasGrammar && (
                  <div className="group rounded-[1.5rem] bg-primary/[0.03] p-6 transition-all hover:bg-primary/[0.05]">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm group-hover:scale-110 transition-transform">
                        <Hash className="h-4 w-4" />
                      </div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                        Grammar Pattern
                      </h3>
                    </div>
                    <p className="font-heading text-xl font-black tracking-tight text-foreground">
                      {word.logic.grammar_pattern}
                    </p>
                  </div>
                )}
                
                {hasExplanation && (
                  <div className="group rounded-[1.5rem] bg-muted/30 p-6 transition-all hover:bg-muted/50">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-muted-foreground shadow-sm group-hover:scale-110 transition-transform">
                        <Info className="h-4 w-4" />
                      </div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                        Usage & Details
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {word.logic.usage && (
                        <p className="text-sm font-bold leading-relaxed text-foreground/80">
                          {word.logic.usage}
                        </p>
                      )}
                      {word.logic.explanation?.en && (
                        <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                          {word.logic.explanation.en}
                        </p>
                      )}
                      {word.logic.explanation?.my && (
                        <p className="text-xs font-bold leading-relaxed text-muted-foreground/70">
                          {word.logic.explanation.my}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Examples Section */}
            {hasExamples && (
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Examples</h2>
                </div>
                <div className="grid gap-4">
                  {word.usage!.map((example, idx) => (
                    <div key={idx} className="group overflow-hidden rounded-[1.5rem] border border-border/40 bg-card p-5 sm:p-6 shadow-sm transition-all hover:bg-primary/[0.02] hover:border-primary/20 hover:shadow-md">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <p className="font-heading text-xl font-black tracking-tight text-foreground transition-colors group-hover:text-primary">
                            {example.jp}
                          </p>
                          {example.reading && (
                            <p className="text-sm font-medium text-muted-foreground/80">
                              {example.reading}
                            </p>
                          )}
                        </div>
                        
                        {(((languagePref === "en" || languagePref === "both") && example.en) || ((languagePref === "mm" || languagePref === "both") && example.my)) && (
                          <div className="h-px w-full bg-border/40 transition-colors group-hover:bg-primary/10"></div>
                        )}
                        
                        <div className="space-y-1.5">
                          {(languagePref === "en" || languagePref === "both") && example.en && (
                            <p className="text-sm font-medium text-foreground/90">
                              {example.en}
                            </p>
                          )}
                          {(languagePref === "mm" || languagePref === "both") && example.my && (
                            <p className={`font-bold text-primary/80 ${languagePref === "both" ? "text-xs" : "text-sm"}`}>
                              {example.my}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Conjugations Section */}
            {conjugations.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Layers className="h-4 w-4" />
                  </div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Conjugations</h2>
                </div>
                <div className="overflow-hidden rounded-[1.5rem] border border-border/40 bg-card shadow-sm">
                  <Table className="w-full">
                    <TableHeader className="bg-primary">
                      <TableRow className="border-none hover:bg-transparent">
                        <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary-foreground">Form</TableHead>
                        <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary-foreground">Japanese</TableHead>
                        <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary-foreground">English</TableHead>
                        <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary-foreground">Burmese</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {conjugations.map(([form, value]) => (
                        <TableRow key={form} className="group border-border/20 transition-colors hover:bg-primary/[0.02]">
                          <TableCell className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{labelFromKey(form)}</TableCell>
                          <TableCell className="px-6 py-4 font-heading text-lg font-black text-foreground group-hover:text-primary transition-colors">{value.jp || "-"}</TableCell>
                          <TableCell className="px-6 py-4 text-xs font-medium text-muted-foreground">{value.en || "-"}</TableCell>
                          <TableCell className="px-6 py-4 text-xs font-bold text-muted-foreground/70">{value.my || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>
            )}
          </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
