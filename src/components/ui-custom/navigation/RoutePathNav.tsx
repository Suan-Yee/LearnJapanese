"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { getPublicAssetUrl } from "@/lib/public-asset";
import { cn } from "@/lib/utils";

interface RoutePathNavProps {
  children: ReactNode;
  className?: string;
}

export function RoutePathNav({ children, className }: RoutePathNavProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      <Image
        src={getPublicAssetUrl("/sprite/gif/rabbit.gif")}
        alt=""
        aria-hidden
        unoptimized
        width={48}
        height={48}
        className="pointer-events-none absolute -top-7 left-2 z-10 h-10 w-10 select-none object-contain"
      />
      <nav className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 shadow-sm backdrop-blur-sm transition-all hover:bg-card/60">
        {children}
      </nav>
    </div>
  );
}
