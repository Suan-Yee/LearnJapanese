"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import { KanaPageFallback } from "./KanaPageFallback";

export function KanaContentGate({ children }: { children: ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const readyTimer = window.setTimeout(() => {
      startTransition(() => {
        setIsReady(true);
      });
    }, 1000);

    return () => {
      window.clearTimeout(readyTimer);
    };
  }, [startTransition]);

  if (!isReady || isPending) {
    return <KanaPageFallback />;
  }

  return <>{children}</>;
}
