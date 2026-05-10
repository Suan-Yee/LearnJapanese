export function KanaPageFallback() {
  return (
    <div className="w-full max-w-5xl space-y-6">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border/60 bg-card/60 p-1 shadow-sm backdrop-blur-md sm:w-fit">
          <div className="h-12 animate-pulse rounded-xl bg-primary/10 sm:w-40" />
          <div className="h-12 animate-pulse rounded-xl bg-background-soft sm:w-40" />
        </div>
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

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <div className="space-y-3 rounded-2xl border border-border/60 bg-card/25 p-3 sm:p-4">
          <div className="space-y-2">
            <div className="h-6 w-36 animate-pulse rounded-full bg-background-soft" />
            <div className="h-4 w-72 max-w-full animate-pulse rounded-full bg-primary/10" />
          </div>
          <div className="rounded-2xl border-2 border-dotted border-primary/35 bg-card/35 p-2">
            <div className="space-y-1.5">
              {Array.from({ length: 11 }, (_, rowIndex) => (
                <div key={`basic-row-${rowIndex}`} className="mx-auto grid w-fit grid-cols-5 gap-1.5">
                  {Array.from({ length: 5 }, (_, colIndex) => (
                    <div
                      key={`basic-cell-${rowIndex}-${colIndex}`}
                      className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border border-border/60 bg-card/80 p-1"
                    >
                      <div className="h-7 w-7 animate-pulse rounded-full bg-primary/10" />
                      <div className="mt-1 h-2.5 w-7 animate-pulse rounded-full bg-background-soft" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-border/60 bg-card/25 p-3 sm:p-4">
          <div className="space-y-2">
            <div className="h-6 w-36 animate-pulse rounded-full bg-background-soft" />
            <div className="h-4 w-72 max-w-full animate-pulse rounded-full bg-primary/10" />
          </div>
          <div className="rounded-2xl border-2 border-dotted border-primary/35 bg-card/35 p-2">
            <div className="space-y-1.5">
              {Array.from({ length: 5 }, (_, rowIndex) => (
                <div key={`voiced-row-${rowIndex}`} className="mx-auto grid w-fit grid-cols-5 gap-1.5">
                  {Array.from({ length: 5 }, (_, colIndex) => (
                    <div
                      key={`voiced-cell-${rowIndex}-${colIndex}`}
                      className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border border-border/60 bg-card/80 p-1"
                    >
                      <div className="h-7 w-7 animate-pulse rounded-full bg-primary/10" />
                      <div className="mt-1 h-2.5 w-7 animate-pulse rounded-full bg-background-soft" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
