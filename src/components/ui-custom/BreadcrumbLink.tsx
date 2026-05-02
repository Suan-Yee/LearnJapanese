"use client";

import Link from "next/link";
import React from "react";

interface BreadcrumbLinkProps extends React.ComponentProps<typeof Link> {
  clearStorageKey?: "last_vocab_path" | "last_kanji_path";
}

export function BreadcrumbLink({ href, clearStorageKey, children, onClick, ...props }: BreadcrumbLinkProps) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        if (clearStorageKey) {
          localStorage.removeItem(clearStorageKey);
        }
        if (onClick) {
          onClick(e);
        }
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
