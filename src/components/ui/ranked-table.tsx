"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

export interface RankedRow {
  key: string;
  label: string;
  count: number;
}

const PAGE_SIZE = 30;

const TIER_BG = ["from-accent to-blue", "from-blue to-prp", "from-prp to-err"] as const;
const TIER_TEXT = ["text-accent", "text-blue", "text-prp"] as const;
// Static class strings (not interpolated) so Tailwind's JIT scanner can find them.
const TIER_HOVER = ["group-hover:text-accent", "group-hover:text-blue", "group-hover:text-prp"] as const;
function tierFor(rank: number): 0 | 1 | 2 {
  return rank <= 5 ? 0 : rank <= 15 ? 1 : 2;
}

/**
 * Search + paginate a ranked (label, count) list entirely client-side, 30
 * rows per page in the same 2-column tiered-rank style the original static
 * top-30 list used — the underlying datasets here (skills ~261 rows, roles
 * ~9 rows) are small enough that a single fetch + local filtering beats
 * round-tripping to the API on every keystroke or page click.
 */
export function RankedTable({
  rows,
  countLabel = "Job postings",
  searchPlaceholder = "Search…",
}: {
  rows: RankedRow[];
  countLabel?: string;
  searchPlaceholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? rows.filter((r) => r.label.toLowerCase().includes(q)) : rows;
  }, [rows, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const maxCount = rows[0]?.count ?? 1;

  return (
    <div>
      <div className="relative mb-4">
        <Search className="w-3.5 h-3.5 text-t3 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder={searchPlaceholder}
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-s2 border border-b1 text-xs text-t1 placeholder:text-t3 focus:outline-none focus:border-accent/40"
        />
      </div>

      {pageRows.length === 0 ? (
        <p className="text-xs text-t3 py-8 text-center">No matches for &quot;{query}&quot;</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1.5">
          {pageRows.map((r, i) => {
            const rank = (currentPage - 1) * PAGE_SIZE + i + 1;
            const pct = Math.round((r.count / maxCount) * 100);
            const tier = tierFor(rank);
            return (
              <div key={r.key} className="flex items-center gap-3 py-1.5 group">
                <span className="w-7 shrink-0 text-right text-[11px] font-mono text-t3">
                  {rank}
                </span>
                <span className={`text-xs font-semibold text-t1 flex-1 ${TIER_HOVER[tier]} transition-colors`}>
                  {r.label}
                </span>
                <div className="w-20 h-1.5 rounded-full bg-s2 overflow-hidden shrink-0">
                  <div className={`h-full rounded-full bg-gradient-to-r ${TIER_BG[tier]}`} style={{ width: `${pct}%` }} />
                </div>
                <span className={`text-[10px] font-mono w-10 text-right shrink-0 ${TIER_TEXT[tier]} font-bold`}>
                  {r.count.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-b1">
        <span className="text-[10px] text-t3">
          {filtered.length === 0 ? "0" : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)}`} of {filtered.length.toLocaleString()} · {countLabel}
        </span>
        {pages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-md border border-b1 text-t2 disabled:opacity-30 hover:enabled:border-accent/40 hover:enabled:text-accent transition-colors"
            >
              Prev
            </button>
            <span className="text-[10px] text-t3">Page {currentPage} of {pages}</span>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={currentPage >= pages}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-md border border-b1 text-t2 disabled:opacity-30 hover:enabled:border-accent/40 hover:enabled:text-accent transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
