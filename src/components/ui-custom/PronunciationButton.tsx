"use client";

import { useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

type PronunciationButtonProps = {
  text: string;
  label?: string;
  className?: string;
  iconClassName?: string;
  stopPropagation?: boolean;
  showVariants?: boolean;
};

function parsePronunciationVariants(raw: string) {
  const withoutNotes = raw
    .replace(/[［\[].*?[］\]]/g, " ")
    .replace(/\(.*?\)/g, " ")
    .replace(/（.*?）/g, " ")
    .replace(/[～~]/g, " ")
    .trim();

  const variants = withoutNotes
    .split(/[、,\/・]/g)
    .map((v) => v.trim())
    .filter(Boolean);

  return variants.length > 0 ? variants : [raw.trim()].filter(Boolean);
}

function isShortUtterance(text: string) {
  const compact = text.replace(/\s+/g, "");
  return compact.length <= 2;
}

function getJapaneseVoice(voices: SpeechSynthesisVoice[]) {
  return (
    voices.find((voice) => voice.lang.toLowerCase() === "ja-jp") ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("ja")) ??
    null
  );
}

export function PronunciationButton({
  text,
  label,
  className,
  iconClassName,
  stopPropagation = true,
  showVariants = false,
}: PronunciationButtonProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const variants = useMemo(() => parsePronunciationVariants(text), [text]);
  const primaryText = variants[0] ?? text.trim();
  const ariaLabel = label ?? `Pronounce ${primaryText}`;
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return;

    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    const timer = window.setTimeout(loadVoices, 0);

    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.clearTimeout(timer);
      window.speechSynthesis.cancel();
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, [supported]);

  const japaneseVoice = useMemo(() => getJapaneseVoice(voices), [voices]);

  const speakText = (targetText: string, event: MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) event.stopPropagation();
    if (!supported || !targetText) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(targetText);
    utterance.lang = "ja-JP";
    utterance.rate = isShortUtterance(targetText) ? 0.68 : 0.8;
    utterance.pitch = 1;

    if (japaneseVoice) {
      utterance.voice = japaneseVoice;
    }

    window.speechSynthesis.speak(utterance);

    // Very short words are hard to catch in one pass, so replay once.
    if (isShortUtterance(targetText)) {
      const repeatUtterance = new SpeechSynthesisUtterance(targetText);
      repeatUtterance.lang = "ja-JP";
      repeatUtterance.rate = 0.68;
      repeatUtterance.pitch = 1;
      if (japaneseVoice) {
        repeatUtterance.voice = japaneseVoice;
      }
      window.speechSynthesis.speak(repeatUtterance);
    }
  };

  const speakPrimary = (event: MouseEvent<HTMLButtonElement>) => {
    speakText(primaryText, event);
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={speakPrimary}
        disabled={!supported || !primaryText}
        className={cn(
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-card text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-45",
          className,
        )}
        aria-label={ariaLabel}
        title={variants.length > 1 ? `${ariaLabel} (primary)` : ariaLabel}
      >
        {supported ? (
          <Volume2 className={cn("h-5 w-5", iconClassName)} />
        ) : (
          <VolumeX className={cn("h-5 w-5", iconClassName)} />
        )}
      </button>

      {showVariants && variants.length > 1 && (
        <div className="hidden items-center gap-1 sm:inline-flex">
          {variants.slice(1, 4).map((variant) => (
            <button
              key={variant}
              type="button"
              onClick={(event) => speakText(variant, event)}
              className="rounded-lg border border-dashed border-border/70 bg-card/70 px-2 py-1 text-[10px] font-semibold text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
              title={`Pronounce variant ${variant}`}
            >
              {variant}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
