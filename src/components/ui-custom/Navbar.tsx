"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Menu, X, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export type TabType = "kana" | "vocabulary" | "kanji" | "grammar" | "search" | "saved" | "quiz";

const LAST_VOCAB_PATH_KEY = "nihongo:last-vocabulary-path";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const lastVocabularyPath = useRef("/vocabulary");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!pathname.startsWith("/vocabulary")) return;

    window.localStorage.setItem(LAST_VOCAB_PATH_KEY, pathname);
    lastVocabularyPath.current = pathname;
  }, [pathname]);

  const getLastVocabularyPath = () => {
    const stored = window.localStorage.getItem(LAST_VOCAB_PATH_KEY);
    if (stored?.startsWith("/vocabulary")) return stored;
    return lastVocabularyPath.current;
  };

  const handleVocabularyClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname.startsWith("/vocabulary")) return;

    event.preventDefault();
    router.push(getLastVocabularyPath());
  };

  const tabs: { id: TabType; label: string; href: string }[] = [
    { id: "kana", label: "Kana", href: "/kana" },
    { id: "vocabulary", label: "Vocabulary", href: pathname.startsWith("/vocabulary") ? pathname : "/vocabulary" },
    { id: "kanji", label: "Kanji", href: "/kanji" },
    { id: "grammar", label: "Grammar", href: "/grammar" },
    { id: "saved", label: "Saved", href: "/saved" },
    { id: "quiz", label: "Quiz", href: "/quiz" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl shadow-sm transition-colors relative">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/vocabulary" onClick={handleVocabularyClick} className="flex shrink-0 items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-raspberry to-raspberry-dark text-white shadow-md shadow-raspberry/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-bold font-heading text-xl tracking-tight text-foreground sm:text-2xl">
            Nihongo <span className="text-primary">Trainer</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden h-full sm:flex sm:min-w-[380px] sm:items-center sm:justify-end sm:gap-3">
          {tabs.map((tab) => {
            const baseHref = `/${tab.id}`;
            const isActive = pathname === baseHref || pathname.startsWith(`${baseHref}/`);
            return (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={tab.id === "vocabulary" ? handleVocabularyClick : undefined}
                className={`relative flex h-full min-w-16 items-center justify-center px-2 text-sm font-semibold transition-all hover:text-primary ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-t-full bg-primary shadow-[0_0_8px_rgba(225,29,72,0.6)] transition-colors" />
                )}
              </Link>
            );
          })}
          
          <div className="flex items-center ml-2 border-l border-border/50 pl-2 gap-1">
            <Link 
              href="/search" 
              className={`flex items-center justify-center rounded-xl p-2 transition-colors hover:bg-primary/5 hover:text-primary ${pathname.startsWith("/search") ? "text-primary bg-primary/5" : "text-muted-foreground"}`}
              title="Global Search"
            >
              <Search className="h-5 w-5" />
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center gap-2 sm:hidden">
          <Link 
            href="/search" 
            className={`flex items-center justify-center rounded-xl p-2 transition-colors hover:bg-primary/5 hover:text-primary ${pathname.startsWith("/search") ? "text-primary bg-primary/5" : "text-muted-foreground"}`}
            title="Global Search"
          >
            <Search className="h-5 w-5" />
          </Link>
          <ThemeToggle />
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-2 text-foreground flex items-center justify-center rounded-xl bg-card border border-border/60 shadow-sm"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-xl sm:hidden flex flex-col px-4 py-4 gap-2 z-40">
          {tabs.map((tab) => {
            const baseHref = `/${tab.id}`;
            const isActive = pathname === baseHref || pathname.startsWith(`${baseHref}/`);
            return (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={(e) => {
                  if (tab.id === "vocabulary") handleVocabularyClick(e);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center w-full rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  isActive ? "bg-primary/10 text-primary border border-primary/20" : "text-foreground hover:bg-muted border border-transparent"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
