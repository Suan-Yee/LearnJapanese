type VocabularyFallbackVariant = "levels" | "lessons" | "table";

interface VocabularyPageFallbackProps {
  variant?: VocabularyFallbackVariant;
}

export function VocabularyPageFallback({
  variant = "table",
}: VocabularyPageFallbackProps) {
  return (
    <div className="w-full max-w-5xl space-y-6">
      {variant === "levels" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <div className="h-6 w-16 animate-pulse rounded-full bg-primary/10" />
                  <div className="h-8 w-2/3 animate-pulse rounded-full bg-background-soft" />
                  <div className="h-4 w-1/2 animate-pulse rounded-full bg-primary/10" />
                </div>
                <div className="h-5 w-5 animate-pulse rounded-full bg-background-soft" />
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === "lessons" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-7 w-24 animate-pulse rounded-full bg-background-soft" />
                  <div className="h-4 w-16 animate-pulse rounded-full bg-primary/10" />
                </div>
                <div className="h-5 w-5 animate-pulse rounded-full bg-background-soft" />
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === "table" && (
        <>
          <div className="flex flex-col gap-6 p-2 lg:flex-row lg:items-center lg:justify-between bg-card/40 backdrop-blur-md rounded-3xl border border-border/60 p-4 shadow-sm">
            <div className="flex w-full flex-col gap-4 sm:flex-row lg:w-auto">
              <div className="h-12 w-full animate-pulse rounded-xl bg-card/70 sm:w-52" />
              <div className="h-12 w-full animate-pulse rounded-xl bg-card/70 sm:w-40" />
            </div>
            <div className="h-12 w-full animate-pulse rounded-xl bg-card/70 lg:max-w-xl" />
          </div>

          <div className="space-y-3 md:hidden">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="rounded-[2rem] border border-border/60 bg-card/80 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="h-6 w-16 animate-pulse rounded-full bg-primary/5" />
                    <div className="space-y-2">
                      <div className="h-3 w-20 animate-pulse rounded-full bg-muted/40" />
                      <div className="h-10 w-2/3 animate-pulse rounded-full bg-muted/40" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="h-10 w-10 animate-pulse rounded-2xl bg-muted/40" />
                    <div className="h-10 w-10 animate-pulse rounded-2xl bg-muted/40" />
                  </div>
                </div>
                <div className="mt-5 h-16 w-full animate-pulse rounded-[1.5rem] bg-black/5" />
              </div>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl md:block">
            <div className="grid grid-cols-[18%_28%_36%_9%_9%] bg-primary/5 px-6 py-5">
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="h-3 w-16 animate-pulse rounded-full bg-primary/20" />
              ))}
            </div>

            <div className="space-y-0">
              {Array.from({ length: 7 }, (_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[18%_28%_36%_9%_9%] items-start border-t border-border/10 px-6 py-5"
                >
                  <div className="pr-4">
                    <div className="h-6 w-14 animate-pulse rounded-lg bg-muted/40" />
                  </div>
                  <div className="space-y-2 pr-4">
                    <div className="h-3 w-20 animate-pulse rounded-full bg-muted/30" />
                    <div className="h-6 w-2/3 animate-pulse rounded-full bg-muted/40" />
                  </div>
                  <div className="space-y-2 pr-4">
                    <div className="h-5 w-3/4 animate-pulse rounded-full bg-muted/40" />
                    <div className="h-3 w-1/2 animate-pulse rounded-full bg-muted/30" />
                  </div>
                  <div className="flex justify-center">
                    <div className="h-9 w-9 animate-pulse rounded-full bg-muted/40" />
                  </div>
                  <div className="flex justify-center">
                    <div className="h-9 w-9 animate-pulse rounded-full bg-muted/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/50 p-4 shadow-sm backdrop-blur-md">
            <div className="flex flex-col gap-3 min-[460px]:flex-row min-[460px]:items-center min-[460px]:justify-between">
              <div className="h-10 w-full animate-pulse rounded-xl bg-background-soft min-[460px]:w-32" />
              <div className="h-5 w-44 animate-pulse rounded-full bg-primary/10" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-background-soft min-[460px]:w-28" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
