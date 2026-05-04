"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, RefreshCcw, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

type StrokeState = "idle" | "loading" | "ready" | "missing" | "error";

const KANJIVG_RAW_BASE = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/kanji`;

interface KanjiStrokeViewerProps {
  character: string;
  variant?: "panel" | "hero";
}

function getKanjiSvgUrl(character: string) {
  const codePoint = character.codePointAt(0);

  if (!codePoint) return null;

  const fileName = `${codePoint.toString(16).padStart(5, "0")}.svg`;

  return `${KANJIVG_RAW_BASE}/${fileName}`;
}

function parseKanjiSvg(svgText: string) {
  const parser = new DOMParser();
  const document = parser.parseFromString(svgText, "image/svg+xml");

  if (document.querySelector("parsererror")) {
    throw new Error("Could not parse KanjiVG SVG.");
  }

  const svg = document.querySelector("svg");
  const viewBox = svg?.getAttribute("viewBox") ?? "0 0 109 109";
  const paths = Array.from(
    document.querySelectorAll('g[id^="kvg:StrokePaths_"] path'),
  )
    .map((path) => path.getAttribute("d"))
    .filter((value): value is string => Boolean(value));

  return { paths, viewBox };
}

export function KanjiStrokeViewer({ character, variant = "panel" }: KanjiStrokeViewerProps) {
  const [state, setState] = useState<StrokeState>("idle");
  const [paths, setPaths] = useState<string[]>([]);
  const [viewBox, setViewBox] = useState("0 0 109 109");
  const [playKey, setPlayKey] = useState(0);
  const [strokeIntervalSeconds, setStrokeIntervalSeconds] = useState(1);
  const intervalInputId = useId();

  const firstCharacter = useMemo(() => Array.from(character.trim())[0] ?? "", [character]);
  const isHero = variant === "hero";
  const strokeDuration = strokeIntervalSeconds * 0.72;

  useEffect(() => {
    if (!firstCharacter) return;

    const controller = new AbortController();

    async function loadStrokeData() {
      setState("loading");

      try {
        const svgUrl = getKanjiSvgUrl(firstCharacter);

        if (!svgUrl) {
          setPaths([]);
          setState("missing");
          return;
        }

        const response = await fetch(svgUrl, { signal: controller.signal });

        if (response.status === 404) {
          setPaths([]);
          setState("missing");
          return;
        }

        if (!response.ok) {
          throw new Error("KanjiVG request failed.");
        }

        const parsed = parseKanjiSvg(await response.text());

        if (parsed.paths.length === 0) {
          setPaths([]);
          setState("missing");
          return;
        }

        setPaths(parsed.paths);
        setViewBox(parsed.viewBox);
        setPlayKey((value) => value + 1);
        setState("ready");
      } catch {
        if (controller.signal.aborted) return;
        setPaths([]);
        setState("error");
      }
    }

    loadStrokeData();

    return () => controller.abort();
  }, [firstCharacter]);

  const replayButton = (
    <button
      type="button"
      disabled={state !== "ready"}
      onClick={() => setPlayKey((value) => value + 1)}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border px-3 text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50",
        isHero
          ? "border-border/35 bg-card/15 text-white shadow-sm backdrop-blur-md hover:bg-card/25"
          : "w-full border-primary/20 bg-card/70 text-primary hover:bg-primary/5 min-[420px]:w-auto",
      )}
      aria-label={`Replay ${firstCharacter} stroke animation`}
    >
      {playKey === 0 ? (
        <Play className="h-4 w-4" />
      ) : (
        <RefreshCcw className="h-4 w-4" />
      )}
      Replay
    </button>
  );

  const intervalControl = (
    <div
      className={cn(
        "flex w-full flex-col gap-2 rounded-xl border px-3 py-2",
        isHero
          ? "border-border/25 bg-card/10 text-white backdrop-blur-md"
          : "mb-3 border-primary/10 bg-card/60 text-primary",
      )}
    >
      <label
        htmlFor={intervalInputId}
        className={cn(
          "flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-widest",
          isHero ? "text-white/85" : "text-primary/75",
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          <Timer className="h-3.5 w-3.5" />
          Interval
        </span>
        <output htmlFor={intervalInputId} className="tracking-normal">
          {strokeIntervalSeconds}s
        </output>
      </label>
      <input
        id={intervalInputId}
        type="range"
        min={1}
        max={5}
        step={1}
        value={strokeIntervalSeconds}
        disabled={state !== "ready"}
        onChange={(event) => setStrokeIntervalSeconds(Number(event.target.value))}
        className={cn(
          "h-2 w-full cursor-pointer accent-current disabled:cursor-not-allowed disabled:opacity-50",
          isHero ? "text-white" : "text-primary",
        )}
        aria-label="Stroke interval in seconds"
      />
      <div
        className={cn(
          "flex justify-between text-[0.65rem] font-bold uppercase tracking-widest",
          isHero ? "text-white/65" : "text-muted-foreground",
        )}
      >
        <span>1s</span>
        <span>5s</span>
      </div>
    </div>
  );

  const drawing = (
    <div
      className={cn(
        "flex aspect-square w-full items-center justify-center",
        isHero ? "p-5 sm:p-7" : "rounded-2xl bg-background-soft/80 p-3",
      )}
    >
      {state === "loading" && (
        <span
          className={cn(
            "text-sm font-semibold",
            isHero ? "text-white/80" : "text-muted-foreground",
          )}
        >
          Loading strokes...
        </span>
      )}

      {(state === "missing" || state === "error") && (
        <span
          className={cn(
            "max-w-52 text-center text-sm font-semibold",
            isHero ? "text-white/80" : "text-muted-foreground",
          )}
        >
          Stroke data is not available for this character.
        </span>
      )}

      {state === "ready" && (
        <svg
          viewBox={viewBox}
          role="img"
          aria-label={`Stroke order animation for ${firstCharacter}`}
          className="h-full w-full"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isHero ? "4.5" : "3"}
            className={isHero ? "text-white/20" : "text-primary/15"}
          >
            {paths.map((path, index) => (
              <path key={`guide-${path}-${index}`} d={path} />
            ))}
          </g>
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isHero ? "4.5" : "3"}
            className={isHero ? "text-white" : "text-primary"}
          >
            {paths.map((path, index) => (
              <motion.path
                key={`${playKey}-${strokeIntervalSeconds}-${path}-${index}`}
                d={path}
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  delay: index * strokeIntervalSeconds,
                  duration: strokeDuration,
                  ease: [0.65, 0, 0.35, 1],
                }}
              />
            ))}
          </g>
        </svg>
      )}

      {state !== "ready" && firstCharacter && !isHero && (
        <span className="sr-only">{firstCharacter}</span>
      )}
    </div>
  );

  if (isHero) {
    return (
      <div className="relative z-10 flex w-full max-w-[260px] flex-col items-center gap-4 text-primary-foreground sm:max-w-[310px]">
        <div className="flex w-full items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-white/80">
            Stroke order
          </span>
          {replayButton}
        </div>
        {intervalControl}
        <div className="w-full rounded-3xl bg-card/10 shadow-inner backdrop-blur-sm">
          {drawing}
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
      <div className="mb-3 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-primary/80">
            Stroke order
          </h4>
        </div>
        {replayButton}
      </div>
      {intervalControl}

      {drawing}
    </section>
  );
}
