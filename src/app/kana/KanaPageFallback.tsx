export function KanaPageFallback() {
  return (
    <div className="w-full max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border/60 bg-card/60 p-1 shadow-sm backdrop-blur-md sm:w-fit">
          <div className="h-12 animate-pulse rounded-xl bg-primary/10 sm:w-40" />
          <div className="h-12 animate-pulse rounded-xl bg-background-soft sm:w-40" />
        </div>

        <div className="h-12 w-full animate-pulse rounded-xl bg-card/70 shadow-sm lg:max-w-sm" />
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm backdrop-blur-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-4 w-28 animate-pulse rounded-full bg-primary/10" />
            <div className="h-4 w-64 max-w-full animate-pulse rounded-full bg-background-soft" />
          </div>
          <div className="h-7 w-20 animate-pulse rounded-full bg-background-soft" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="h-6 w-36 animate-pulse rounded-full bg-background-soft" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded-full bg-primary/10" />
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-3 md:grid-cols-10">
          {Array.from({ length: 46 }, (_, index) => (
            <div
              key={index}
              className="flex aspect-square min-h-16 flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/80 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="h-8 w-8 animate-pulse rounded-full bg-primary/10 sm:h-10 sm:w-10" />
              <div className="mt-2 h-3 w-8 animate-pulse rounded-full bg-background-soft" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="h-6 w-36 animate-pulse rounded-full bg-background-soft" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded-full bg-primary/10" />
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-3 md:grid-cols-10">
          {Array.from({ length: 25 }, (_, index) => (
            <div
              key={index}
              className="flex aspect-square min-h-16 flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/80 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="h-8 w-8 animate-pulse rounded-full bg-primary/10 sm:h-10 sm:w-10" />
              <div className="mt-2 h-3 w-8 animate-pulse rounded-full bg-background-soft" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
