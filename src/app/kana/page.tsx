import { KanaGrid } from "@/components/ui-custom/KanaGrid";
import { KanaContentGate } from "./KanaContentGate";

export default function KanaPage() {
  return (
    <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 mt-4">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground mb-2">
            Kana Practice
          </h1>
          <p className="text-muted-foreground text-lg">
            Learn hiragana and katakana with stroke order and example words.
          </p>
        </div>

        <KanaContentGate>
          <KanaGrid />
        </KanaContentGate>
      </div>
    </main>
  );
}
