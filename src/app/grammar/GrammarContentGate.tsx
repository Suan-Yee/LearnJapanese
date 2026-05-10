"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import { GrammarPageFallback } from "./GrammarPageFallback";

type GrammarFallbackVariant = "levels" | "points" | "detail";

interface GrammarContentGateProps {
  cacheKey: string;
  children: ReactNode;
  variant?: GrammarFallbackVariant;
}

export function GrammarContentGate({
  cacheKey,
  children,
  variant = "detail",
}: GrammarContentGateProps) {
  return (
    <GrammarContentLoader key={cacheKey} variant={variant}>
      {children}
    </GrammarContentLoader>
  );
}

function GrammarContentLoader({
  children,
  variant,
}: {
  children: ReactNode;
  variant: GrammarFallbackVariant;
}) {
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
    return <GrammarPageFallback variant={variant} />;
  }

  return <>{children}</>;
}
