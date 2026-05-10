type GrammarFallbackVariant = "levels" | "points" | "detail";

interface GrammarPageFallbackProps {
  variant?: GrammarFallbackVariant;
}

export function GrammarPageFallback({
  variant = "detail",
}: GrammarPageFallbackProps) {
  return (
    <div className="w-full max-w-5xl space-y-6">
      {variant === "levels" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="h-6 w-24 animate-pulse rounded-full bg-primary/10" />
                  <div className="h-5 w-4/5 animate-pulse rounded-full bg-background-soft" />
                  <div className="h-4 w-1/2 animate-pulse rounded-full bg-primary/10" />
                </div>
                <div className="h-5 w-5 animate-pulse rounded-full bg-background-soft" />
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === "points" && (
        <div className="space-y-4">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="h-7 w-7 animate-pulse rounded-lg bg-primary/10" />
                    <div className="h-5 w-14 animate-pulse rounded-full bg-muted/40" />
                    <div className="h-5 w-16 animate-pulse rounded-full bg-muted/40" />
                  </div>

                  <div className="h-7 w-1/2 animate-pulse rounded-full bg-background-soft" />

                  <div className="space-y-2">
                    <div className="h-4 w-2/3 animate-pulse rounded-full bg-background-soft" />
                    <div className="h-4 w-1/2 animate-pulse rounded-full bg-primary/10" />
                  </div>

                  <div className="rounded-lg border border-primary/15 bg-primary/[0.06] px-3.5 py-2.5">
                    <div className="h-4 w-3/4 animate-pulse rounded-full bg-primary/20" />
                    <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-primary/10" />
                  </div>
                </div>

                <div className="mt-1 h-5 w-5 animate-pulse rounded-full bg-background-soft" />
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === "detail" && (
        <>
          <div className="space-y-4">
            <div className="h-10 w-64 animate-pulse rounded-full bg-card/70" />
            <div className="h-10 w-56 animate-pulse rounded-full bg-background-soft" />
          </div>

          <div className="space-y-8">
            <div className="rounded-[2rem] border border-border/60 bg-card/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="space-y-4">
                <div className="h-8 w-1/3 animate-pulse rounded-full bg-primary/10" />
                <div className="h-6 w-2/3 animate-pulse rounded-full bg-background-soft" />
                <div className="h-5 w-1/2 animate-pulse rounded-full bg-primary/10" />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border/70 bg-card/20 p-4 shadow-sm sm:p-5 lg:p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="h-3 w-24 animate-pulse rounded-full bg-primary/10" />
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
                    <div className="space-y-4">
                      <div className="h-5 w-full animate-pulse rounded-full bg-background-soft" />
                      <div className="h-5 w-4/5 animate-pulse rounded-full bg-background-soft" />
                      <div className="h-px w-full bg-border/70" />
                      <div className="h-4 w-2/3 animate-pulse rounded-full bg-primary/10" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-3 w-20 animate-pulse rounded-full bg-primary/10" />
                  <div className="rounded-xl border border-primary/15 bg-primary/[0.06] p-4">
                    <div className="space-y-3">
                      <div className="h-3 w-16 animate-pulse rounded-full bg-primary/20" />
                      <div className="h-4 w-full animate-pulse rounded-full bg-primary/10" />
                      <div className="h-4 w-5/6 animate-pulse rounded-full bg-primary/10" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-3 w-24 animate-pulse rounded-full bg-primary/10" />
                  <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
                    <div className="space-y-3">
                      {Array.from({ length: 3 }, (_, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-border/70 bg-background/70 p-4"
                        >
                          <div className="space-y-3">
                            <div className="h-5 w-3/4 animate-pulse rounded-full bg-background-soft" />
                            <div className="h-3 w-1/2 animate-pulse rounded-full bg-primary/10" />
                            <div className="h-4 w-2/3 animate-pulse rounded-full bg-primary/10" />
                            <div className="h-4 w-1/2 animate-pulse rounded-full bg-muted/40" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-3 w-28 animate-pulse rounded-full bg-primary/10" />
                  <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <div className="space-y-3">
                      <div className="h-10 w-full animate-pulse rounded-xl bg-background-soft" />
                      <div className="h-10 w-full animate-pulse rounded-xl bg-background-soft" />
                      <div className="h-10 w-full animate-pulse rounded-xl bg-background-soft" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <div className="h-16 w-full animate-pulse rounded-2xl bg-card/70 sm:w-[240px]" />
                <div className="h-16 w-full animate-pulse rounded-2xl bg-card/70 sm:w-[240px]" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
