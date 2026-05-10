"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import { VocabularyPageFallback } from "./VocabularyPageFallback";

type VocabularyFallbackVariant = "levels" | "lessons" | "table";

interface VocabularyContentGateProps {
  cacheKey: string;
  children: ReactNode;
  variant?: VocabularyFallbackVariant;
}

export function VocabularyContentGate({
  cacheKey,
  children,
  variant = "table",
}: VocabularyContentGateProps) {
  return (
    <VocabularyContentLoader key={cacheKey} variant={variant}>
      {children}
    </VocabularyContentLoader>
  );
}

function VocabularyContentLoader({
  children,
  variant,
}: {
  children: ReactNode;
  variant: VocabularyFallbackVariant;
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
    return <VocabularyPageFallback variant={variant} />;
  }

  return <>{children}</>;
}
