import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DataPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function DataPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: DataPaginationProps) {
  if (totalItems <= 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border/60 bg-surface/40 text-xs text-muted-foreground",
        className
      )}
    >
      <div>
        Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
        <span className="font-semibold text-foreground">{endItem}</span> of{" "}
        <span className="font-semibold text-foreground">{totalItems}</span> entries
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-surface-2/60 text-xs font-medium transition-colors",
            currentPage <= 1
              ? "opacity-40 cursor-not-allowed text-muted-foreground"
              : "hover:border-primary/50 hover:text-primary cursor-pointer"
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-3.5" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((p, idx) =>
            typeof p === "number" ? (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={cn(
                  "min-w-8 h-8 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  p === currentPage
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                    : "bg-surface-2/40 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                )}
              >
                {p}
              </button>
            ) : (
              <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground select-none">
                ...
              </span>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || totalPages === 0}
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-surface-2/60 text-xs font-medium transition-colors",
            currentPage >= totalPages || totalPages === 0
              ? "opacity-40 cursor-not-allowed text-muted-foreground"
              : "hover:border-primary/50 hover:text-primary cursor-pointer"
          )}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
