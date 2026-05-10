"use client";

import {
  useCallback,
  useEffect,
  memo,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

type LessonGridWandererProps = {
  children: ReactNode;
  words: string[];
};

type CharState = "walking" | "sitting" | "idle";
type Direction = 1 | -1;

const CAT_WIDTH = 84;
const CAT_HEIGHT = 84;
const CAT_LANE_HEIGHT = 88;
const CAT_LANE_TOP_OFFSET = 18;
const RUN_FRAME_MS = 90;
const REACTION_FRAME_MS = 120;
const REACTION_DURATION_MS = 1500;
const REACTION_TEXT = "何か起きている？";
const RUN_FRAMES: Record<Direction, string[]> = {
  1: [
    "/sprite/animations/animation-dc2f00f5/east/frame_000.png",
    "/sprite/animations/animation-dc2f00f5/east/frame_001.png",
    "/sprite/animations/animation-dc2f00f5/east/frame_002.png",
    "/sprite/animations/animation-dc2f00f5/east/frame_003.png",
    "/sprite/animations/animation-dc2f00f5/east/frame_004.png",
    "/sprite/animations/animation-dc2f00f5/east/frame_005.png",
  ],
  "-1": [
    "/sprite/animations/animation-dc2f00f5/west/frame_000.png",
    "/sprite/animations/animation-dc2f00f5/west/frame_001.png",
    "/sprite/animations/animation-dc2f00f5/west/frame_002.png",
    "/sprite/animations/animation-dc2f00f5/west/frame_003.png",
    "/sprite/animations/animation-dc2f00f5/west/frame_004.png",
    "/sprite/animations/animation-dc2f00f5/west/frame_005.png",
  ],
};
const ROTATION_FRAME: Record<Direction, string> = {
  1: "/sprite/rotations/east.png",
  "-1": "/sprite/rotations/west.png",
};
const REACTION_FRAMES = [
  "/sprite/reaction/frame_000.png",
  "/sprite/reaction/frame_001.png",
  "/sprite/reaction/frame_002.png",
  "/sprite/reaction/frame_003.png",
  "/sprite/reaction/frame_004.png",
  "/sprite/reaction/frame_005.png",
  "/sprite/reaction/frame_006.png",
];

function cleanWord(word: string) {
  return word
    .replace(/[［\[].*?[］\]]/g, "")
    .replace(/\(.*?\)/g, "")
    .replace(/（.*?）/g, "")
    .replace(/[、,]/g, " ")
    .trim();
}

const FILLER = [
  "ねむい…", "がんばれ！", "すごい！", "えーと…", "なるほど",
  "よし！", "ふむふむ", "おやすみ", "たのしい", "わくわく",
  "どきどき", "にこにこ", "もぐもぐ", "うとうと", "ぴかぴか",
];

function pickWord(words: string[]) {
  const pool = words.length > 0 ? words : FILLER;
  return pool[Math.floor(Math.random() * pool.length)] ?? "ねむい…";
}

/* ── Cat Sprite ────────────────────────────────────────────────────── */

const CatCharacter = memo(function CatCharacter({
  state,
  direction,
  isReacting,
  onClick,
}: {
  state: CharState;
  direction: Direction;
  isReacting: boolean;
  onClick: () => void;
}) {
  const [runFrameIdx, setRunFrameIdx] = useState(0);
  const [reactionFrameIdx, setReactionFrameIdx] = useState(0);
  const walking = state === "walking";
  const source = isReacting
    ? REACTION_FRAMES[reactionFrameIdx]
    : walking
      ? RUN_FRAMES[direction][runFrameIdx]
      : ROTATION_FRAME[direction];

  useEffect(() => {
    if (!walking || isReacting) return;
    const frameCount = RUN_FRAMES[direction].length;
    const id = window.setInterval(
      () => setRunFrameIdx((prev) => (prev + 1) % frameCount),
      RUN_FRAME_MS,
    );
    return () => window.clearInterval(id);
  }, [walking, direction, isReacting]);

  useEffect(() => {
    if (!isReacting) return;
    const frameCount = REACTION_FRAMES.length;
    const id = window.setInterval(
      () => setReactionFrameIdx((prev) => (prev + 1) % frameCount),
      REACTION_FRAME_MS,
    );
    return () => window.clearInterval(id);
  }, [isReacting]);

  return (
    <motion.div
      className="relative"
      style={{ width: CAT_WIDTH, height: CAT_HEIGHT }}
      animate={
        walking
          ? { y: [0, -2, 0] }
          : isReacting
            ? { y: [0, -1, 0, 1, 0] }
            : state === "sitting"
            ? { y: [2, 1, 2] }
            : { y: [0, -1, 0] }
      }
      transition={{
        repeat: Infinity,
        duration: walking ? 0.36 : 1.8,
        ease: "easeInOut",
      }}
      onClick={onClick}
    >
      <img
        src={source}
        alt=""
        draggable={false}
        aria-hidden="true"
        width={CAT_WIDTH}
        height={CAT_HEIGHT}
        className="relative z-10 block cursor-pointer select-none pointer-events-auto"
        style={{
          imageRendering: "pixelated",
          objectFit: "contain",
          filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.18))",
        }}
      />
    </motion.div>
  );
});

/* ── Speech Bubble ─────────────────────────────────────────────────── */

function SpeechBubble({ text }: { text: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial={{ opacity: 0, y: 4, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -4, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
      >
        <div className="relative rounded-xl bg-card/95 px-3 py-1.5 text-[11px] font-bold text-foreground shadow-lg ring-1 ring-border/40 backdrop-blur-md">
          {text}
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-card/95 ring-1 ring-border/40"
            style={{ clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)" }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Main Component ────────────────────────────────────────────────── */

export function LessonGridWanderer({ children, words }: LessonGridWandererProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const charRef = useRef<HTMLDivElement>(null);
  const [wanderWidth, setWanderWidth] = useState(0);
  const [mutter, setMutter] = useState("ねむい…");
  const [charState, setCharState] = useState<CharState>("idle");
  const [direction, setDirection] = useState<Direction>(1);
  const [isReacting, setIsReacting] = useState(false);
  const posRef = useRef(24);
  const reactionTimerRef = useRef<number | null>(null);
  const stateTimerRef = useRef<number | null>(null);

  const cleanedWords = useMemo(
    () => words.map(cleanWord).filter(Boolean).slice(0, 40),
    [words],
  );

  /* measure wander width */
  useEffect(() => {
    const measure = () => {
      const host = hostRef.current;
      if (!host) return;
      setWanderWidth(host.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* cycle words */
  useEffect(() => {
    const id = window.setInterval(() => setMutter(pickWord(cleanedWords)), 2500);
    return () => window.clearInterval(id);
  }, [cleanedWords]);

  useEffect(() => {
    return () => {
      if (reactionTimerRef.current) window.clearTimeout(reactionTimerRef.current);
    };
  }, []);

  const handleCatClick = useCallback(() => {
    if (stateTimerRef.current) window.clearTimeout(stateTimerRef.current);
    if (reactionTimerRef.current) window.clearTimeout(reactionTimerRef.current);
    setIsReacting(true);
    reactionTimerRef.current = window.setTimeout(() => {
      setIsReacting(false);
      reactionTimerRef.current = null;
    }, REACTION_DURATION_MS);
  }, []);

  const scheduleNext = useCallback((current: CharState) => {
    if (stateTimerRef.current) window.clearTimeout(stateTimerRef.current);
    let next: CharState;
    let delay: number;
    switch (current) {
      case "idle":    next = "walking"; delay = 2000 + Math.random() * 1500; break;
      case "walking": next = "sitting"; delay = 4000 + Math.random() * 3000; break;
      case "sitting": next = "idle";    delay = 3000 + Math.random() * 2000; break;
    }
    stateTimerRef.current = window.setTimeout(() => setCharState(next), delay);
  }, []);

  useEffect(() => {
    if (isReacting) return;
    scheduleNext(charState);
    return () => { if (stateTimerRef.current) window.clearTimeout(stateTimerRef.current); };
  }, [charState, isReacting, scheduleNext]);

  /* walking – use rAF + ref to avoid per-frame setState */
  useEffect(() => {
    if (charState !== "walking" || isReacting || wanderWidth === 0) return;

    const speed = 0.8;
    let animId: number;
    let dir = direction;

    const step = () => {
      posRef.current += speed * dir;
      const maxX = wanderWidth - CAT_WIDTH;
      const minX = 8;

      if (posRef.current >= maxX) { posRef.current = maxX; dir = -1; setDirection(-1); }
      else if (posRef.current <= minX) { posRef.current = minX; dir = 1; setDirection(1); }

      if (charRef.current) {
        charRef.current.style.transform = `translateX(${posRef.current}px)`;
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charState, isReacting, wanderWidth]);

  useEffect(() => {
    if (!charRef.current) return;
    charRef.current.style.transform = `translateX(${posRef.current}px)`;
  }, [wanderWidth]);

  const displayedMutter = isReacting ? REACTION_TEXT : mutter;

  if (wanderWidth === 0) {
    return <div ref={hostRef} className="relative">{children}</div>;
  }

  return (
    <div ref={hostRef} className="relative pt-20">
      {children}

      {/* character lane – sits inside the top gap */}
      <div
        className="pointer-events-none absolute inset-x-0 z-20"
        style={{ top: CAT_LANE_TOP_OFFSET, height: CAT_LANE_HEIGHT }}
      >
        <div
          ref={charRef}
          className="absolute bottom-0 pointer-events-auto"
        >
          <div className="relative">
            <SpeechBubble text={displayedMutter} />
            <CatCharacter
              state={charState}
              direction={direction}
              isReacting={isReacting}
              onClick={handleCatClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
