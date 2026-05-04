"use client";

import type { Conjugation } from "@/lib/grammar";

export function ConjugationTable({ data }: { data: Conjugation }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/60 bg-card/50 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-primary/5">
            {data.headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-widest text-primary/70"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-border/30 last:border-none transition-colors hover:bg-primary/[0.02]"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-2.5 ${ci === 0 ? "font-semibold text-foreground/80 text-xs" : "font-bold text-foreground"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
