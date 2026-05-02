"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import {
  KanjiPageFallback,
  type KanjiFallbackVariant,
} from "./KanjiPageFallback";

interface KanjiContentGateProps {
  children: ReactNode;
  variant?: KanjiFallbackVariant;
  cacheKey: string;
}

export function KanjiContentGate({
  children,
  variant = "grid",
  cacheKey,
}: KanjiContentGateProps) {
  return (
    <KanjiContentLoader key={cacheKey} variant={variant}>
      {children}
    </KanjiContentLoader>
  );
}

function KanjiContentLoader({
  children,
  variant,
}: {
  children: ReactNode;
  variant: KanjiFallbackVariant;
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
    return <KanjiPageFallback variant={variant} />;
  }

  return <>{children}</>;
}
