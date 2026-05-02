"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizCardProps {
  questions: Question[];
}

export function QuizCard({ questions }: QuizCardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer) return; // Prevent multiple clicks

    const correct = answer === questions[currentQuestionIndex].correctAnswer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setIsFinished(true);
      }
    }, 1500); // Wait a bit before moving to next question
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-xl mx-auto mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Card className="rounded-3xl p-8 sm:p-12 text-center bg-card/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-border/60">
            <div className="flex flex-col items-center justify-center space-y-6">
              <h2 className="text-3xl font-bold font-heading text-foreground">Quiz Completed!</h2>
              <div className="flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-br from-raspberry-light/20 to-raspberry/10 text-primary shadow-inner">
                <span className="text-6xl font-extrabold font-heading">{score}/{questions.length}</span>
              </div>
              <p className="text-muted-foreground font-medium text-lg">
                {score === questions.length 
                  ? "Perfect score! Outstanding job!" 
                  : "Good effort! Keep practicing."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full pt-6">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-2xl h-14 text-lg font-semibold border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all text-primary"
                  onClick={handleRetry}
                >
                  Retry Quiz
                </Button>
                <Button 
                  className="flex-1 rounded-2xl h-14 text-lg font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                  Review Mistakes
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const question = questions[currentQuestionIndex];

  return (
    <div className="w-full max-w-xl mx-auto mt-8">
      <Card className="rounded-3xl p-6 sm:p-10 bg-card/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-border/60 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-background-soft">
          <div 
            className="h-full bg-gradient-to-r from-raspberry-light to-raspberry transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col space-y-10 mt-4"
          >
            <div className="text-center space-y-3">
              <span className="text-sm font-bold text-primary uppercase tracking-widest bg-primary/10 px-4 py-1.5 rounded-full inline-block">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-foreground leading-snug">
                {question.question}
              </h3>
            </div>

            <div className="flex flex-col space-y-4">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectAnswer = option === question.correctAnswer;
                
                let buttonStyle = "bg-card border-2 border-border/50 text-foreground hover:border-primary/50 hover:bg-raspberry/5 hover:shadow-sm";
                
                if (selectedAnswer) {
                  if (isCorrectAnswer) {
                    buttonStyle = "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"; // Correct
                  } else if (isSelected && !isCorrectAnswer) {
                    buttonStyle = "bg-destructive border-destructive text-destructive-foreground shadow-lg shadow-destructive/20 animate-in shake"; // Wrong
                  } else {
                    buttonStyle = "bg-card border-border text-muted-foreground opacity-50"; // Unselected
                  }
                }

                return (
                  <button
                    key={index}
                    disabled={!!selectedAnswer}
                    onClick={() => handleAnswerClick(option)}
                    className={`w-full text-left px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${buttonStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
