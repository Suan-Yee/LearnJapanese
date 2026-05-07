"use client";

import {
  useCallback,
  useEffect,
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

/* ── Chibi SVG ─────────────────────────────────────────────────────── */

function ChibiCharacter({ state, direction }: { state: CharState; direction: Direction }) {
  const sit = state === "sitting";
  const walk = state === "walking";

  return (
    <motion.svg
      width="48" height="56" viewBox="0 0 48 56"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `scaleX(${direction})` }}
      aria-hidden="true"
    >
      {/* shadow */}
      <motion.ellipse cx="24" cy="54" rx={sit ? 14 : 10} ry="2" fill="rgba(0,0,0,0.12)"
        animate={{ rx: sit ? 14 : walk ? [9, 11, 9] : 10 }}
        transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
      />

      <motion.g
        animate={walk ? { y: [0, -1.5, 0, -1.5, 0] } : sit ? { y: 4 } : { y: [0, -0.5, 0] }}
        transition={{ repeat: walk || !sit ? Infinity : 0, duration: walk ? 0.5 : 2.5, ease: "easeInOut" }}
      >
        {/* hair back */}
        <ellipse cx="24" cy="13" rx="13" ry="12" fill="#3b2820" />
        <ellipse cx="24" cy="12" rx="12.5" ry="11" fill="#4a332a" />
        {/* head */}
        <ellipse cx="24" cy="15" rx="11" ry="10.5" fill="#ffe4d0" />
        {/* bangs */}
        <path d="M13 13 C13 6,35 6,35 13 C35 10,30 7,24 8 C18 7,13 10,13 13Z" fill="#4a332a" />
        <path d="M13 13 C12 17,13.5 20,14 17 C14.5 14,13 12,13 13Z" fill="#4a332a" />
        <path d="M35 13 C36 17,34.5 20,34 17 C33.5 14,35 12,35 13Z" fill="#4a332a" />

        {/* eyes with blink */}
        <motion.g
          animate={sit ? { scaleY: [1, 0.1, 1, 1, 1, 1] } : { scaleY: [1, 1, 1, 0.1, 1, 1, 1, 1] }}
          transition={{ repeat: Infinity, duration: sit ? 3 : 4, ease: "easeInOut" }}
        >
          <ellipse cx="19.5" cy="16" rx="3" ry="3.2" fill="white" />
          <motion.ellipse cx="19.5" cy="16.3" rx="1.8" ry="2" fill="#2d1810"
            animate={walk ? { cx: [19.5, 20.5, 19.5] } : sit ? { cy: [16.3, 16.8, 16.3] } : {}}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
          <circle cx="20.2" cy="15.2" r="0.9" fill="white" />
          <circle cx="18.8" cy="17" r="0.4" fill="white" opacity="0.6" />

          <ellipse cx="28.5" cy="16" rx="3" ry="3.2" fill="white" />
          <motion.ellipse cx="28.5" cy="16.3" rx="1.8" ry="2" fill="#2d1810"
            animate={walk ? { cx: [28.5, 29.5, 28.5] } : sit ? { cy: [16.3, 16.8, 16.3] } : {}}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
          <circle cx="29.2" cy="15.2" r="0.9" fill="white" />
          <circle cx="27.8" cy="17" r="0.4" fill="white" opacity="0.6" />
        </motion.g>

        {/* blush */}
        <ellipse cx="16" cy="19" rx="2.5" ry="1.2" fill="#ffb3b3" opacity="0.5" />
        <ellipse cx="32" cy="19" rx="2.5" ry="1.2" fill="#ffb3b3" opacity="0.5" />

        {/* mouth */}
        <motion.path
          d={sit ? "M22 21 Q24 23.5 26 21" : "M22.5 21 Q24 22.5 25.5 21"}
          stroke="#c47060" strokeWidth="1" strokeLinecap="round" fill="none"
          animate={sit ? { d: ["M22 21 Q24 23.5 26 21", "M22.5 20.5 Q24 21.5 25.5 20.5", "M22 21 Q24 23.5 26 21"] } : {}}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />

        {/* body */}
        {sit ? (
          <>
            <path d="M17 26 C17 24,31 24,31 26 L32 38 C32 40,16 40,16 38Z" fill="#f43f5e" />
            <path d="M20 26 L24 29 L28 26" stroke="#e11d48" strokeWidth="0.8" fill="none" />
            <line x1="24" y1="29" x2="24" y2="36" stroke="#e11d48" strokeWidth="0.5" opacity="0.4" />
            <motion.path d="M17 30 C14 31,13 34,15 36 L17 37" stroke="#ffe4d0" strokeWidth="3.5" strokeLinecap="round" fill="none"
              animate={{ d: ["M17 30 C14 31,13 34,15 36 L17 37", "M17 30 C14 32,12 34,14 36 L16 37", "M17 30 C14 31,13 34,15 36 L17 37"] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            <motion.path d="M31 30 C34 31,35 34,33 36 L31 37" stroke="#ffe4d0" strokeWidth="3.5" strokeLinecap="round" fill="none"
              animate={{ d: ["M31 30 C34 31,35 34,33 36 L31 37", "M31 30 C34 32,36 34,34 36 L32 37", "M31 30 C34 31,35 34,33 36 L31 37"] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            <path d="M18 38 C17 42,16 44,18 45 L22 45 C23 44,22 42,21 38" fill="#3b4f7a" />
            <path d="M27 38 C26 42,27 44,29 45 L31 45 C32 44,31 42,30 38" fill="#3b4f7a" />
            <ellipse cx="19.5" cy="45.5" rx="3.5" ry="1.5" fill="#e11d48" />
            <ellipse cx="30" cy="45.5" rx="3.5" ry="1.5" fill="#e11d48" />
          </>
        ) : (
          <>
            <path d="M18 26 C18 24,30 24,30 26 L31 38 C31 39,17 39,17 38Z" fill="#f43f5e" />
            <path d="M20.5 26 L24 28.5 L27.5 26" stroke="#e11d48" strokeWidth="0.8" fill="none" />
            <line x1="24" y1="28.5" x2="24" y2="36" stroke="#e11d48" strokeWidth="0.5" opacity="0.4" />
            <motion.path d="M18 28 C15 30,14 34,15.5 36" stroke="#ffe4d0" strokeWidth="3" strokeLinecap="round" fill="none"
              animate={walk
                ? { d: ["M18 28 C15 30,14 34,15.5 36", "M18 28 C16 29,16 31,18 33", "M18 28 C15 30,14 34,15.5 36"] }
                : { d: ["M18 28 C15 30,14 34,15.5 36", "M18 28 C15 30.5,14 34,15.5 36.5", "M18 28 C15 30,14 34,15.5 36"] }}
              transition={{ repeat: Infinity, duration: walk ? 0.5 : 2, ease: "easeInOut" }}
            />
            <motion.path d="M30 28 C33 30,34 34,32.5 36" stroke="#ffe4d0" strokeWidth="3" strokeLinecap="round" fill="none"
              animate={walk
                ? { d: ["M30 28 C33 30,34 34,32.5 36", "M30 28 C32 29,32 31,30 33", "M30 28 C33 30,34 34,32.5 36"] }
                : { d: ["M30 28 C33 30,34 34,32.5 36", "M30 28 C33 30.5,34 34,32.5 36.5", "M30 28 C33 30,34 34,32.5 36"] }}
              transition={{ repeat: Infinity, duration: walk ? 0.5 : 2, ease: "easeInOut", delay: walk ? 0.25 : 0 }}
            />
            <motion.line x1="21" y1="38" x2="20" y2="47" stroke="#3b4f7a" strokeWidth="3.5" strokeLinecap="round"
              animate={walk ? { x2: [18, 22, 18], y2: [46, 47, 46] } : {}}
              transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
            />
            <motion.line x1="27" y1="38" x2="28" y2="47" stroke="#3b4f7a" strokeWidth="3.5" strokeLinecap="round"
              animate={walk ? { x2: [30, 26, 30], y2: [47, 46, 47] } : {}}
              transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
            />
            <motion.ellipse cx="20" cy="48" rx="3" ry="1.5" fill="#e11d48"
              animate={walk ? { cx: [18, 22, 18] } : {}} transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
            />
            <motion.ellipse cx="28" cy="48" rx="3" ry="1.5" fill="#e11d48"
              animate={walk ? { cx: [30, 26, 30] } : {}} transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
            />
          </>
        )}

        {/* ahoge */}
        <motion.path d="M23 3 Q24 0,25 3" stroke="#4a332a" strokeWidth="1.2" fill="none" strokeLinecap="round"
          animate={{ d: ["M23 3 Q24 0,25 3", "M22.5 3 Q24 -0.5,25.5 3", "M23 3 Q24 0,25 3"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
        <motion.path d="M21 4 Q22 2,23 4.5" stroke="#4a332a" strokeWidth="0.8" fill="none" strokeLinecap="round"
          animate={{ d: ["M21 4 Q22 2,23 4.5", "M20.5 4 Q22 1.5,23.5 4.5", "M21 4 Q22 2,23 4.5"] }}
          transition={{ repeat: Infinity, duration: 2.3, ease: "easeInOut" }}
        />
      </motion.g>
    </motion.svg>
  );
}

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
  const posRef = useRef(24);

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

  /* state machine */
  const stateTimerRef = useRef<number | null>(null);

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
    scheduleNext(charState);
    return () => { if (stateTimerRef.current) window.clearTimeout(stateTimerRef.current); };
  }, [charState, scheduleNext]);

  /* walking – use rAF + ref to avoid per-frame setState */
  useEffect(() => {
    if (charState !== "walking" || wanderWidth === 0) return;

    const speed = 0.8;
    let animId: number;
    let dir = direction;

    const step = () => {
      posRef.current += speed * dir;
      const maxX = wanderWidth - 56;
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
  }, [charState, wanderWidth]);

  if (wanderWidth === 0) {
    return <div ref={hostRef} className="relative">{children}</div>;
  }

  return (
    <div ref={hostRef} className="relative pt-16">
      {children}

      {/* character lane – sits inside the pt-16 gap */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 z-20">
        <div
          ref={charRef}
          className="absolute bottom-0"
          style={{ transform: `translateX(${posRef.current}px)` }}
        >
          <div className="relative">
            <SpeechBubble text={mutter} />
            <ChibiCharacter state={charState} direction={direction} />
          </div>
        </div>
      </div>
    </div>
  );
}
