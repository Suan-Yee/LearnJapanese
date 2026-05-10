import { GrammarPageFallback } from "@/app/grammar/GrammarPageFallback";

export default function GrammarLessonLoading() {
  return (
    <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 mt-4 space-y-4">
          <div className="h-10 w-56 animate-pulse rounded-full bg-card/70" />
          <div className="h-10 w-80 animate-pulse rounded-full bg-background-soft" />
          <div className="h-5 w-72 animate-pulse rounded-full bg-primary/10" />
        </div>

        <GrammarPageFallback variant="points" />
      </div>
    </main>
  );
}
