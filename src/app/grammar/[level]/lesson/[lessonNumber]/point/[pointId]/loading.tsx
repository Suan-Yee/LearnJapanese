import { GrammarPageFallback } from "@/app/grammar/GrammarPageFallback";

export default function GrammarPointLoading() {
  return (
    <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <GrammarPageFallback variant="detail" />
      </div>
    </main>
  );
}
