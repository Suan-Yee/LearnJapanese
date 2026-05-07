"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BookmarkWordButtonProps {
  wordId: string;
  className?: string;
}

export function BookmarkWordButton({ wordId, className }: BookmarkWordButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem("vocab_bookmarks");
      if (saved) {
        try {
          const bookmarks = new Set(JSON.parse(saved));
          setIsBookmarked(bookmarks.has(wordId));
        } catch (e) {
          console.error("Failed to parse vocab bookmarks", e);
        }
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [wordId]);

  const onToggle = () => {
    try {
      const saved = localStorage.getItem("vocab_bookmarks");
      let bookmarks = new Set<string>();
      if (saved) {
        bookmarks = new Set(JSON.parse(saved));
      }
      
      if (bookmarks.has(wordId)) {
        bookmarks.delete(wordId);
        setIsBookmarked(false);
      } else {
        bookmarks.add(wordId);
        setIsBookmarked(true);
      }
      
      localStorage.setItem("vocab_bookmarks", JSON.stringify(Array.from(bookmarks)));
    } catch (e) {
      console.error("Failed to toggle bookmark", e);
    }
  };

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
