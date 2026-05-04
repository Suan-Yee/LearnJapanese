"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Trophy, Play, RefreshCcw, Circle, X } from "lucide-react";
import type { KanjiLesson, KanjiItem } from "@/lib/kanji";
import { cn } from "@/lib/utils";

interface KanjiQuizModalProps {
  lesson: KanjiLesson;
}

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}
  
type Question = {
  kanjiItem: KanjiItem;
  options: string[]; // 4 kanji characters
};

export function KanjiQuizModal({ lesson }: KanjiQuizModalProps) {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);

  const storageKey = `kanji_quiz_score_${lesson.level}_${lesson.lessonNumber}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setBestScore(parseInt(saved, 10));
    }
  }, [storageKey]);

  const generateQuestions = () => {
    const generated = lesson.kanji.map(k => {
      // Build distractor pool primarily from confusing_kanji
      const confusingPool = (k.confusing_kanji || []).filter(c => c !== k.character);
      
      // If confusing_kanji has less than 3, pad with other lesson kanji
      let pool = [...confusingPool];
      if (pool.length < 3) {
        const others = lesson.kanji
          .filter(other => other.id !== k.id && !pool.includes(other.character))
          .map(other => other.character);
        pool = [...pool, ...shuffleArray(others)];
      }

      // Pick 3 unique distractors
      const shuffledPool = shuffleArray(pool);
      const selectedDistractors = new Set<string>();
      for (const item of shuffledPool) {
        if (selectedDistractors.size >= 3) break;
        if (item !== k.character) {
          selectedDistractors.add(item);
        }
      }

      const incorrect = Array.from(selectedDistractors);
      const options = shuffleArray([k.character, ...incorrect]);
      return { kanjiItem: k, options };
    });
    setQuestions(shuffleArray(generated));
  };

  useEffect(() => {
    if (open) {
      generateQuestions();
      setCurrentIndex(0);
      setScore(0);
      setSelectedOption(null);
      setIsFinished(false);
    }
  }, [open, lesson]);

  const handleOptionClick = (option: string) => {
    if (selectedOption) return; // Prevent multiple clicks
    setSelectedOption(option);
    
    const isCorrect = option === questions[currentIndex].kanjiItem.character;
    if (isCorrect) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(i => i + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true);
        const newScore = isCorrect ? score + 1 : score;
        if (bestScore === null || newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem(storageKey, newScore.toString());
        }
      }
    }, 1200); // Delay for feedback
  };

  const resetQuiz = () => {
    generateQuestions();
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsFinished(false);
  };

  if (!lesson || lesson.kanji.length === 0) return null;

  const currentQ = questions[currentIndex];
  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent p-6 sm:p-8 border border-primary/20 shadow-sm relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 text-center sm:text-left">
          <h2 className="text-2xl font-black font-heading text-foreground tracking-tight">Challenge Yourself</h2>
          <p className="text-base font-medium text-muted-foreground mt-1.5 max-w-sm">
            Master the tricky kanji. Identify the correct character from similar-looking confusing options.
          </p>
        </div>
        <div className="relative z-10 flex flex-col items-center sm:items-end gap-3">
          {bestScore !== null && (
            <div className="flex flex-col items-center sm:items-end bg-card/80 px-4 py-2 rounded-xl border border-border/50 shadow-sm backdrop-blur-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Best Score</span>
              <span className="text-lg font-black text-primary leading-none mt-0.5">{bestScore} / {lesson.kanji.length}</span>
            </div>
          )}
          <Button onClick={() => setOpen(true)} className="rounded-full shadow-lg shadow-primary/20 gap-2 h-12 px-8 text-base transition-all hover:scale-105 active:scale-95">
            <Play className="w-5 h-5 fill-current" />
            <span className="font-bold">Start Quiz</span>
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-xl p-0 overflow-hidden rounded-[2rem] border-border/40 bg-card shadow-2xl gap-0">
          <DialogTitle className="sr-only">Kanji Quiz</DialogTitle>
          {isFinished ? (
            <div className="relative p-8 sm:p-10 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
              <button onClick={() => setOpen(false)} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-5 text-primary shadow-inner">
                <Trophy className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black font-heading mb-2 tracking-tight">Quiz Completed!</h2>
              <p className="text-muted-foreground text-lg mb-8 font-medium">
                You scored <strong className="text-primary text-2xl mx-1">{score}</strong> out of {questions.length}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl h-12 px-6 text-base font-bold border-border/60 hover:bg-muted/50">
                  Close
                </Button>
                <Button onClick={resetQuiz} className="rounded-xl gap-2 h-12 px-6 text-base shadow-lg shadow-primary/20">
                  <RefreshCcw className="w-4 h-4" />
                  Try Again
                </Button>
              </div>
            </div>
          ) : currentQ ? (
            <div className="flex flex-col animate-in fade-in duration-300">
              {/* Header / Progress */}
              <div className="px-5 py-4 bg-muted/30 border-b border-border/40 flex items-center justify-between gap-3">
                <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                    Score: {score}
                  </span>
                  <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <Progress value={progress} className="h-1 rounded-none bg-border/20" />

              {/* Question Area */}
              <div className="px-5 pt-5 pb-2 text-center space-y-1.5">
                <p className="text-[10px] font-black text-primary/70 uppercase tracking-[0.2em]">Select the correct Kanji</p>
                <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
                  {currentQ.kanjiItem.meaning.en}
                </h3>
                <p className="text-base sm:text-lg font-bold text-muted-foreground/80">
                  {currentQ.kanjiItem.meaning.my}
                </p>
                <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-accent text-xs font-bold text-primary tracking-wide">
                  {currentQ.kanjiItem.onyomi || currentQ.kanjiItem.kunyomi}
                </div>
              </div>

              {/* Options Grid */}
              <div className="p-5 pt-3">
                <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                  {currentQ.options.map((opt, i) => {
                    const isCorrectOption = opt === currentQ.kanjiItem.character;
                    const isSelected = selectedOption === opt;
                    
                    let stateClass = "bg-card border-border shadow-sm hover:border-primary/50 hover:bg-primary/5 hover:shadow-md text-foreground cursor-pointer";
                    if (selectedOption) {
                      if (isCorrectOption) {
                        stateClass = "bg-green-500/10 border-green-500 text-green-600 dark:text-green-400 shadow-lg shadow-green-500/10 scale-[1.03] z-10";
                      } else if (isSelected) {
                        stateClass = "bg-destructive/10 border-destructive text-destructive animate-shake shadow-inner";
                      } else {
                        stateClass = "bg-muted/40 border-border/20 opacity-40 scale-95";
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleOptionClick(opt)}
                        disabled={!!selectedOption}
                        className={cn(
                          "relative py-5 sm:py-6 w-full flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-300",
                          stateClass
                        )}
                      >
                        <span className={cn(
                          "font-heading font-bold text-center px-2 leading-tight",
                          opt.length >= 3 ? "text-base sm:text-xl" : "text-3xl sm:text-4xl"
                        )}>{opt}</span>
                        {selectedOption && isCorrectOption && (
                          <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}
                        {selectedOption && isSelected && !isCorrectOption && (
                          <div className="absolute -top-2 -right-2 w-7 h-7 bg-destructive rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                            <XCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground font-bold">Loading questions...</div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
