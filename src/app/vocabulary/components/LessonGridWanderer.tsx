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
import { getPublicAssetUrl, usePublicAssetBasePath } from "@/lib/public-asset";

type LessonGridWandererProps = {
  children: ReactNode;
  words: string[];
};

type CharState = "walking" | "sitting" | "idle";
type Direction = 1 | -1;
type Segment = { min: number; max: number };
type JumpPlan = {
  startX: number;
  endX: number;
  startedAt: number;
  targetSegmentIndex: number;
};

const CAT_WIDTH = 84;
const CAT_HEIGHT = 84;
const CAT_LANE_HEIGHT = 88;
const CAT_LANE_TOP_OFFSET = 18;
const CARD_EDGE_PADDING = 16;
const WALK_SPEED = 0.8;
const RUN_FRAME_MS = 90;
const JUMP_FRAME_MS = 90;
const REACTION_FRAME_MS = 120;
const JUMP_DURATION_MS = 720;
const JUMP_ARC_HEIGHT = 28;
const REACTION_DURATION_MS = 1500;

const REACTION_TEXT = "\u4f55\u304b\u8d77\u304d\u3066\u3044\u308b\uff1f";
const FALLBACK_TEXT = "\u306d\u3080\u3044\u2026";
const FILLER = [
  "\u306d\u3080\u3044\u2026",
  "\u304c\u3093\u3070\u308c\uff01",
  "\u3059\u3054\u3044\uff01",
  "\u3048\u30fc\u3068\u2026",
  "\u306a\u308b\u307b\u3069",
  "\u3088\u3057\uff01",
  "\u3075\u3080\u3075\u3080",
  "\u304a\u3084\u3059\u307f",
  "\u305f\u306e\u3057\u3044",
  "\u308f\u304f\u308f\u304f",
  "\u3069\u304d\u3069\u304d",
  "\u306b\u3053\u306b\u3053",
  "\u3082\u3050\u3082\u3050",
  "\u3046\u3068\u3046\u3068",
  "\u3074\u304b\u3074\u304b",
];

function cleanWord(word: string) {
  return word
    .replace(/[ï¼»\[].*?[ï¼½\]]/g, "")
    .replace(/\(.*?\)/g, "")
    .replace(/ï¼ˆ.*?ï¼‰/g, "")
    .replace(/[ã€,]/g, " ")
    .trim();
}

function pickWord(words: string[]) {
  const pool = words.length > 0 ? words : FILLER;
  return pool[Math.floor(Math.random() * pool.length)] ?? FALLBACK_TEXT;
}

function buildSegments(host: HTMLDivElement) {
  const hostRect = host.getBoundingClientRect();
  const cards = Array.from(
    host.querySelectorAll<HTMLElement>("[data-lesson-card='true']"),
  );

  if (cards.length === 0) {
    return [{ min: 8, max: Math.max(8, host.offsetWidth - CAT_WIDTH - 8) }];
  }

  const cardRects = cards.map((card) => {
    const rect = card.getBoundingClientRect();
    return {
      top: rect.top - hostRect.top,
      left: rect.left - hostRect.left,
      right: rect.right - hostRect.left,
    };
  });

  const firstRowTop = Math.min(...cardRects.map((rect) => rect.top));
  const firstRowRects = cardRects.filter(
    (rect) => Math.abs(rect.top - firstRowTop) < 16,
  );

  return firstRowRects
    .map((rect) => ({
      min: Math.max(8, rect.left + CARD_EDGE_PADDING),
      max: Math.max(
        rect.left + CARD_EDGE_PADDING,
        rect.right - CAT_WIDTH - CARD_EDGE_PADDING,
      ),
    }))
    .sort((a, b) => a.min - b.min);
}

function applyTransform(
  node: HTMLDivElement | null,
  x: number,
  y: number,
) {
  if (!node) return;
  node.style.transform = `translate(${x}px, ${y}px)`;
}

const CatCharacter = memo(function CatCharacter({
  state,
  direction,
  isReacting,
  isJumping,
  runFrames,
  jumpFrames,
  rotationFrame,
  reactionFrames,
  onClick,
}: {
  state: CharState;
  direction: Direction;
  isReacting: boolean;
  isJumping: boolean;
  runFrames: Record<Direction, string[]>;
  jumpFrames: Record<Direction, string[]>;
  rotationFrame: Record<Direction, string>;
  reactionFrames: string[];
  onClick: () => void;
}) {
  const [runFrameIdx, setRunFrameIdx] = useState(0);
  const [jumpFrameIdx, setJumpFrameIdx] = useState(0);
  const [reactionFrameIdx, setReactionFrameIdx] = useState(0);
  const walking = state === "walking" && !isJumping;

  const source = isReacting
    ? reactionFrames[reactionFrameIdx]
    : isJumping
      ? jumpFrames[direction][jumpFrameIdx]
      : walking
        ? runFrames[direction][runFrameIdx]
        : rotationFrame[direction];

  useEffect(() => {
    if (!walking || isReacting) return;
    const frameCount = runFrames[direction].length;
    const id = window.setInterval(
      () => setRunFrameIdx((prev) => (prev + 1) % frameCount),
      RUN_FRAME_MS,
    );
    return () => window.clearInterval(id);
  }, [walking, direction, isReacting, runFrames]);

  useEffect(() => {
    if (!isJumping || isReacting) return;
    const frameCount = jumpFrames[direction].length;
    const id = window.setInterval(
      () => setJumpFrameIdx((prev) => (prev + 1) % frameCount),
      JUMP_FRAME_MS,
    );
    return () => window.clearInterval(id);
  }, [direction, isJumping, isReacting, jumpFrames]);

  useEffect(() => {
    if (!isReacting) return;
    const frameCount = reactionFrames.length;
    const id = window.setInterval(
      () => setReactionFrameIdx((prev) => (prev + 1) % frameCount),
      REACTION_FRAME_MS,
    );
    return () => window.clearInterval(id);
  }, [isReacting, reactionFrames]);

  return (
    <motion.div
      className={isJumping ? "pointer-events-none relative" : "relative"}
      style={{ width: CAT_WIDTH, height: CAT_HEIGHT }}
      animate={
        isJumping
          ? { y: 0 }
          : walking
            ? { y: [0, -2, 0] }
            : isReacting
              ? { y: [0, -1, 0, 1, 0] }
              : state === "sitting"
                ? { y: [2, 1, 2] }
                : { y: [0, -1, 0] }
      }
      transition={
        isJumping
          ? { duration: 0 }
          : {
              repeat: Infinity,
              duration: walking ? 0.36 : 1.8,
              ease: "easeInOut",
            }
      }
      onClick={isJumping ? undefined : onClick}
    >
      <img
        src={source}
        alt=""
        draggable={false}
        aria-hidden="true"
        width={CAT_WIDTH}
        height={CAT_HEIGHT}
        className={
          isJumping
            ? "relative z-10 block select-none"
            : "relative z-10 block cursor-pointer select-none pointer-events-auto"
        }
        style={{
          imageRendering: "pixelated",
          objectFit: "contain",
          filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.18))",
        }}
      />
    </motion.div>
  );
});

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
            className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-card/95 ring-1 ring-border/40"
            style={{ clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)" }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function LessonGridWanderer({ children, words }: LessonGridWandererProps) {
  const assetBasePath = usePublicAssetBasePath();
  const hostRef = useRef<HTMLDivElement>(null);
  const charRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(24);
  const jumpYRef = useRef(0);
  const segmentIndexRef = useRef(0);
  const jumpPlanRef = useRef<JumpPlan | null>(null);
  const reactionTimerRef = useRef<number | null>(null);
  const stateTimerRef = useRef<number | null>(null);

  const [wanderWidth, setWanderWidth] = useState(0);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [mutter, setMutter] = useState(FALLBACK_TEXT);
  const [charState, setCharState] = useState<CharState>("idle");
  const [direction, setDirection] = useState<Direction>(1);
  const [isReacting, setIsReacting] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  const cleanedWords = useMemo(
    () => words.map(cleanWord).filter(Boolean).slice(0, 40),
    [words],
  );
  const sprite = useCallback(
    (path: string) => getPublicAssetUrl(`/sprite/${path}`, assetBasePath),
    [assetBasePath],
  );
  const runFrames = useMemo<Record<Direction, string[]>>(
    () => ({
      1: [
        sprite("animations/animation-dc2f00f5/east/frame_000.png"),
        sprite("animations/animation-dc2f00f5/east/frame_001.png"),
        sprite("animations/animation-dc2f00f5/east/frame_002.png"),
        sprite("animations/animation-dc2f00f5/east/frame_003.png"),
        sprite("animations/animation-dc2f00f5/east/frame_004.png"),
        sprite("animations/animation-dc2f00f5/east/frame_005.png"),
      ],
      "-1": [
        sprite("animations/animation-dc2f00f5/west/frame_000.png"),
        sprite("animations/animation-dc2f00f5/west/frame_001.png"),
        sprite("animations/animation-dc2f00f5/west/frame_002.png"),
        sprite("animations/animation-dc2f00f5/west/frame_003.png"),
        sprite("animations/animation-dc2f00f5/west/frame_004.png"),
        sprite("animations/animation-dc2f00f5/west/frame_005.png"),
      ],
    }),
    [sprite],
  );
  const jumpFrames = useMemo<Record<Direction, string[]>>(
    () => ({
      1: [
        sprite("animations/animation-cd2933cb/east/frame_000.png"),
        sprite("animations/animation-cd2933cb/east/frame_001.png"),
        sprite("animations/animation-cd2933cb/east/frame_002.png"),
        sprite("animations/animation-cd2933cb/east/frame_003.png"),
        sprite("animations/animation-cd2933cb/east/frame_004.png"),
        sprite("animations/animation-cd2933cb/east/frame_005.png"),
        sprite("animations/animation-cd2933cb/east/frame_006.png"),
        sprite("animations/animation-cd2933cb/east/frame_007.png"),
      ],
      "-1": [
        sprite("animations/animation-cd2933cb/west/frame_000.png"),
        sprite("animations/animation-cd2933cb/west/frame_001.png"),
        sprite("animations/animation-cd2933cb/west/frame_002.png"),
        sprite("animations/animation-cd2933cb/west/frame_003.png"),
        sprite("animations/animation-cd2933cb/west/frame_004.png"),
        sprite("animations/animation-cd2933cb/west/frame_005.png"),
        sprite("animations/animation-cd2933cb/west/frame_006.png"),
        sprite("animations/animation-cd2933cb/west/frame_007.png"),
      ],
    }),
    [sprite],
  );
  const rotationFrame = useMemo<Record<Direction, string>>(
    () => ({
      1: sprite("rotations/east.png"),
      "-1": sprite("rotations/west.png"),
    }),
    [sprite],
  );
  const reactionFrames = useMemo(
    () => [
      sprite("reaction/frame_000.png"),
      sprite("reaction/frame_001.png"),
      sprite("reaction/frame_002.png"),
      sprite("reaction/frame_003.png"),
      sprite("reaction/frame_004.png"),
      sprite("reaction/frame_005.png"),
      sprite("reaction/frame_006.png"),
    ],
    [sprite],
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const measure = () => {
      const nextWidth = host.offsetWidth;
      const nextSegments = buildSegments(host);
      const nextSegmentIndex = Math.min(
        segmentIndexRef.current,
        nextSegments.length - 1,
      );
      const activeSegment = nextSegments[nextSegmentIndex] ?? nextSegments[0];

      segmentIndexRef.current = nextSegmentIndex;
      setWanderWidth(nextWidth);
      setSegments(nextSegments);

      if (activeSegment) {
        posRef.current = Math.min(
          activeSegment.max,
          Math.max(activeSegment.min, posRef.current),
        );
      }

      applyTransform(charRef.current, posRef.current, jumpYRef.current);
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(host);
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setMutter(pickWord(cleanedWords)), 2500);
    return () => window.clearInterval(id);
  }, [cleanedWords]);

  useEffect(() => {
    return () => {
      if (reactionTimerRef.current) window.clearTimeout(reactionTimerRef.current);
      if (stateTimerRef.current) window.clearTimeout(stateTimerRef.current);
    };
  }, []);

  const handleCatClick = useCallback(() => {
    if (isJumping) return;
    if (stateTimerRef.current) window.clearTimeout(stateTimerRef.current);
    if (reactionTimerRef.current) window.clearTimeout(reactionTimerRef.current);
    setIsReacting(true);
    reactionTimerRef.current = window.setTimeout(() => {
      setIsReacting(false);
      reactionTimerRef.current = null;
    }, REACTION_DURATION_MS);
  }, [isJumping]);

  const scheduleNext = useCallback((current: CharState) => {
    if (stateTimerRef.current) window.clearTimeout(stateTimerRef.current);

    let next: CharState;
    let delay: number;

    switch (current) {
      case "idle":
        next = "walking";
        delay = 2000 + Math.random() * 1500;
        break;
      case "walking":
        next = "sitting";
        delay = 4000 + Math.random() * 3000;
        break;
      case "sitting":
        next = "idle";
        delay = 3000 + Math.random() * 2000;
        break;
    }

    stateTimerRef.current = window.setTimeout(() => setCharState(next), delay);
  }, []);

  useEffect(() => {
    if (isReacting || isJumping) return;
    scheduleNext(charState);

    return () => {
      if (stateTimerRef.current) window.clearTimeout(stateTimerRef.current);
    };
  }, [charState, isJumping, isReacting, scheduleNext]);

  useEffect(() => {
    if (charState !== "walking" || isReacting || wanderWidth === 0 || segments.length === 0) {
      return;
    }

    let animId = 0;
    let dir = direction;

    const step = (timestamp: number) => {
      const segmentIndex = segmentIndexRef.current;
      const activeSegment = segments[segmentIndex];
      const jumpPlan = jumpPlanRef.current;

      if (!activeSegment) {
        animId = window.requestAnimationFrame(step);
        return;
      }

      if (jumpPlan) {
        const progress = Math.min(
          1,
          (timestamp - jumpPlan.startedAt) / JUMP_DURATION_MS,
        );

        posRef.current =
          jumpPlan.startX + (jumpPlan.endX - jumpPlan.startX) * progress;
        jumpYRef.current = -Math.sin(progress * Math.PI) * JUMP_ARC_HEIGHT;

        if (progress >= 1) {
          posRef.current = jumpPlan.endX;
          jumpYRef.current = 0;
          segmentIndexRef.current = jumpPlan.targetSegmentIndex;
          jumpPlanRef.current = null;
          setIsJumping(false);
        }
      } else {
        posRef.current += WALK_SPEED * dir;

        if (dir === 1 && posRef.current >= activeSegment.max) {
          posRef.current = activeSegment.max;

          if (segmentIndex < segments.length - 1) {
            jumpPlanRef.current = {
              startX: activeSegment.max,
              endX: segments[segmentIndex + 1].min,
              startedAt: timestamp,
              targetSegmentIndex: segmentIndex + 1,
            };
            jumpYRef.current = 0;
            setIsJumping(true);
          } else {
            dir = -1;
            setDirection(-1);
          }
        } else if (dir === -1 && posRef.current <= activeSegment.min) {
          posRef.current = activeSegment.min;

          if (segmentIndex > 0) {
            jumpPlanRef.current = {
              startX: activeSegment.min,
              endX: segments[segmentIndex - 1].max,
              startedAt: timestamp,
              targetSegmentIndex: segmentIndex - 1,
            };
            jumpYRef.current = 0;
            setIsJumping(true);
          } else {
            dir = 1;
            setDirection(1);
          }
        }
      }

      applyTransform(charRef.current, posRef.current, jumpYRef.current);
      animId = window.requestAnimationFrame(step);
    };

    animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [charState, direction, isReacting, segments, wanderWidth]);

  useEffect(() => {
    applyTransform(charRef.current, posRef.current, jumpYRef.current);
  }, [wanderWidth, segments]);

  const displayedMutter = isReacting ? REACTION_TEXT : mutter;

  if (wanderWidth === 0) {
    return <div ref={hostRef} className="relative">{children}</div>;
  }

  return (
    <div ref={hostRef} className="relative pt-20">
      {children}

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
              isJumping={isJumping}
              runFrames={runFrames}
              jumpFrames={jumpFrames}
              rotationFrame={rotationFrame}
              reactionFrames={reactionFrames}
              onClick={handleCatClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
