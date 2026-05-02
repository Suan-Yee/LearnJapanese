"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function NavigationPersistence() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/kanji/") && pathname !== "/kanji") {
      localStorage.setItem("last_kanji_path", pathname);
    }
    if (pathname.startsWith("/vocabulary/") && pathname !== "/vocabulary") {
      localStorage.setItem("last_vocab_path", pathname);
    }
  }, [pathname]);

  return null;
}
