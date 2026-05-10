import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentLesson: number;
  totalRange: [number, number];
  onPrevious: () => void;
  onNext: () => void;
  disablePrevious: boolean;
  disableNext: boolean;
}

export function Pagination({
  currentLesson,
  totalRange,
  onPrevious,
  onNext,
  disablePrevious,
  disableNext,
}: PaginationProps) {
  return (
    <div className="mt-8 flex flex-col items-stretch gap-3 rounded-2xl border border-border/60 bg-card/50 p-4 shadow-sm backdrop-blur-md min-[460px]:flex-row min-[460px]:items-center min-[460px]:justify-between">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={disablePrevious}
        className="h-10 rounded-xl border-primary/20 px-4 text-primary hover:bg-primary/5 disabled:opacity-50"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      <span className="text-center font-heading font-bold text-foreground/80">
        Lesson {currentLesson} of {totalRange[0]}-{totalRange[1]}
      </span>
      <Button
        variant="default"
        onClick={onNext}
        disabled={disableNext}
        className="h-10 rounded-xl px-4 shadow-md shadow-primary/20 transition-all hover:shadow-lg"
      >
        Next <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
