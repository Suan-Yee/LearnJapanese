"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { setCachedPath } from "@/lib/navigation-path-cache";

export function NavigationPersistence() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/kanji/") && pathname !== "/kanji") {
      setCachedPath("last_kanji_path", pathname);
    }
    if (pathname.startsWith("/vocabulary/") && pathname !== "/vocabulary") {
      setCachedPath("last_vocab_path", pathname);
    }
  }, [pathname]);

  return null;
}
