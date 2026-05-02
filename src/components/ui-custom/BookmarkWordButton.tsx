"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BookmarkWordButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  className?: string;
}

export function BookmarkWordButton({ isBookmarked, onToggle, className }: BookmarkWordButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onToggle}
      className={cn("rounded-xl border-primary/20 text-primary hover:bg-primary/5", className)}
    >
      {isBookmarked ? (
        <BookmarkCheck className="mr-2 h-4 w-4 fill-primary/20" />
      ) : (
        <Bookmark className="mr-2 h-4 w-4" />
      )}
      {isBookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  );
}
