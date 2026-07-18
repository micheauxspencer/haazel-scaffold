"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type DataTableAlign = "left" | "center" | "right";
export type DataTableBadgeVariant = "default" | "secondary" | "destructive" | "outline" | "ghost";

export interface DataTableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  align?: DataTableAlign;
  render?: (row: Record<string, unknown>) => ReactNode;
}

export interface DataTableStatusBadge {
  /** Column key whose value should render as a ui/badge instead of plain text. */
  key: string;
  /** Maps that column's raw cell value to a badge variant. */
  variant: (value: unknown) => DataTableBadgeVariant;
}

export interface DataTableProProps {
  columns: DataTableColumn[];
  rows: Record<string, unknown>[];
  /** Optional card title shown above the table with a live row count. */
  caption?: string;
  statusBadge?: DataTableStatusBadge;
  pageSize?: number;
  emptyState?: ReactNode;
  className?: string;
}

type SortState = { key: string; direction: "asc" | "desc" } | null;

function alignClass(align?: DataTableAlign) {
  return align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  const an = Number(a);
  const bn = Number(b);
  if (a !== "" && b !== "" && !Number.isNaN(an) && !Number.isNaN(bn)) return an - bn;
  return String(a).localeCompare(String(b));
}

function SortIcon({ active, direction }: { active: boolean; direction?: "asc" | "desc" }) {
  return (
    <ChevronDownIcon
      aria-hidden
      className={cn(
        "size-3.5 transition-transform duration-[var(--duration-fast)] [transition-timing-function:var(--ease-standard)]",
        active ? "text-foreground" : "text-muted-foreground/40",
        active && direction === "asc" && "rotate-180",
      )}
    />
  );
}

/**
 * Generic sortable, paginated table on top of `ui/table` — no external
 * table library. Sticky header inside a max-height scroll region, optional
 * status→badge column, client-side sort on any `sortable` column.
 */
export default function DataTablePro({
  columns,
  rows,
  caption,
  statusBadge,
  pageSize = 8,
  emptyState,
  className = "",
}: DataTableProProps) {
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const dir = sort.direction === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => compareValues(a[sort.key], b[sort.key]) * dir);
  }, [rows, sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const start = currentPage * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  const handleSort = (key: string) => {
    setPage(0);
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  };

  return (
    <Card className={cn("gap-0 py-0", className)}>
      {caption && (
        <CardHeader className="gap-1 border-b py-3.5">
          <CardTitle className="text-sm">{caption}</CardTitle>
          <CardDescription className="font-mono text-overline uppercase tracking-[0.14em]">
            {sorted.length} {sorted.length === 1 ? "record" : "records"}
          </CardDescription>
        </CardHeader>
      )}

      <CardContent className="px-0">
        <div className="max-h-[26rem] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow className="hover:bg-transparent">
                {columns.map((col) => {
                  const activeSort = sort && sort.key === col.key ? sort : null;
                  return (
                    <TableHead
                      key={col.key}
                      aria-sort={
                        col.sortable
                          ? activeSort
                            ? activeSort.direction === "asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                          : undefined
                      }
                      className={cn(
                        alignClass(col.align),
                        "font-mono text-overline uppercase tracking-[0.1em] text-muted-foreground",
                      )}
                    >
                      {col.sortable ? (
                        <button
                          type="button"
                          onClick={() => handleSort(col.key)}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-[var(--radius-sm)]",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                            col.align === "right" && "flex-row-reverse",
                          )}
                        >
                          {col.header}
                          <SortIcon active={!!activeSort} direction={activeSort?.direction} />
                        </button>
                      ) : (
                        col.header
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="h-40 text-center align-middle">
                    {emptyState ?? <span className="text-sm text-muted-foreground">No results.</span>}
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((row, i) => {
                  const key =
                    typeof row.id === "string" || typeof row.id === "number"
                      ? String(row.id)
                      : `${start + i}`;
                  return (
                    <TableRow key={key}>
                      {columns.map((col) => (
                        <TableCell
                          key={col.key}
                          className={cn(
                            alignClass(col.align),
                            col.align === "right" && "font-mono text-[0.8125rem] tabular-nums",
                          )}
                        >
                          {col.render
                            ? col.render(row)
                            : statusBadge && col.key === statusBadge.key
                              ? (
                                  <Badge variant={statusBadge.variant(row[col.key])}>
                                    {String(row[col.key] ?? "—")}
                                  </Badge>
                                )
                              : String(row[col.key] ?? "—")}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="justify-between gap-4">
        <p className="font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">
          {sorted.length === 0
            ? "0–0 of 0"
            : `${start + 1}–${Math.min(start + pageSize, sorted.length)} of ${sorted.length}`}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            aria-label="Previous page"
            className={cn(
              "flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-md)] text-muted-foreground",
              "transition-colors duration-[var(--duration-fast)] [transition-timing-function:var(--ease-standard)]",
              "hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            <ChevronLeftIcon aria-hidden className="size-4" />
          </button>
          <span className="min-w-12 text-center font-mono text-overline tabular-nums text-muted-foreground">
            {currentPage + 1} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={currentPage >= pageCount - 1}
            aria-label="Next page"
            className={cn(
              "flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-md)] text-muted-foreground",
              "transition-colors duration-[var(--duration-fast)] [transition-timing-function:var(--ease-standard)]",
              "hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            <ChevronRightIcon aria-hidden className="size-4" />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
