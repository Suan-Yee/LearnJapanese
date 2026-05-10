export type KanjiFallbackVariant = "levels" | "lessons" | "grid";

interface KanjiPageFallbackProps {
  variant?: KanjiFallbackVariant;
}

export function KanjiPageFallback({
  variant = "grid",
}: KanjiPageFallbackProps) {
  return (
    <div className="w-full max-w-5xl space-y-6">
      {variant === "levels" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }, (_, index) => (
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
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-7 w-24 animate-pulse rounded-full bg-background-soft" />
                  <div className="h-4 w-28 animate-pulse rounded-full bg-primary/10" />
                </div>
                <div className="h-5 w-5 animate-pulse rounded-full bg-background-soft" />
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === "grid" && (
        <>
          <div className="flex flex-col gap-6 p-2 lg:flex-row lg:items-center lg:justify-between bg-card/40 backdrop-blur-md rounded-3xl border border-border/60 p-4 shadow-sm">
            <div className="flex w-full flex-col gap-4 sm:flex-row lg:w-auto">
              <div className="h-12 w-full animate-pulse rounded-xl bg-card/70 sm:w-52" />
              <div className="h-12 w-full animate-pulse rounded-xl bg-card/70 sm:w-40" />
            </div>
            <div className="h-12 w-full animate-pulse rounded-xl bg-card/70 lg:max-w-xl" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-1 items-center gap-4 sm:gap-5">
                    <div className="h-16 w-16 animate-pulse rounded-2xl bg-primary/10 sm:h-20 sm:w-20" />
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="h-3 w-16 animate-pulse rounded-full bg-primary/10" />
                      <div className="h-5 w-full animate-pulse rounded-full bg-background-soft" />
                      <div className="h-3 w-18 animate-pulse rounded-full bg-primary/10" />
                      <div className="h-5 w-4/5 animate-pulse rounded-full bg-background-soft" />
                    </div>
                  </div>

                  <div className="h-10 w-10 animate-pulse rounded-full bg-background-soft" />
                </div>

                <div className="mt-6 space-y-3 border-t border-border/60 pt-4">
                  <div className="h-6 w-2/3 animate-pulse rounded-full bg-background-soft" />
                  <div className="h-4 w-1/2 animate-pulse rounded-full bg-primary/10" />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/50 p-4 shadow-sm backdrop-blur-md">
            <div className="flex flex-col gap-3 min-[460px]:flex-row min-[460px]:items-center min-[460px]:justify-between">
              <div className="h-10 w-full animate-pulse rounded-xl bg-background-soft min-[460px]:w-32" />
              <div className="h-5 w-36 animate-pulse rounded-full bg-primary/10" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-background-soft min-[460px]:w-28" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
