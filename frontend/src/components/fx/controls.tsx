import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Search field with animated focus glow and clear affordance. */
export function AnimatedSearch({
  value,
  onChange,
  onSearch,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch?: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [focused, setFocused] = useState(false);

  const handleSearchSubmit = () => {
    if (onSearch) {
      onSearch(value.trim());
    }
  };

  return (
    <motion.div
      animate={focused ? { scale: 1.01 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "relative flex items-center gap-2 rounded-xl border bg-surface/50 px-3 py-2 transition-colors duration-300",
        focused ? "border-primary/60 shadow-[var(--shadow-glow)]" : "border-border",
        className,
      )}
    >
      <button
        type="button"
        onClick={handleSearchSubmit}
        className="shrink-0 p-0 text-muted-foreground hover:text-primary transition-colors cursor-pointer border-none bg-transparent outline-none"
        aria-label="Submit search"
      >
        <Search
          className={cn(
            "size-4 transition-colors",
            focused ? "text-primary" : "text-muted-foreground",
          )}
        />
      </button>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearchSubmit();
          }
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            onClick={() => {
              onChange("");
              if (onSearch) onSearch("");
            }}
            className="rounded-md p-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground cursor-pointer"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** Filter chips with a sliding active indicator and single-line overflow control. */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  layoutId = "chip-indicator",
  className,
}: {
  options: readonly { value: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
  layoutId?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden rounded-xl border border-border bg-surface/40 p-1 px-1.5",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <motion.button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors duration-300 cursor-pointer",
              active
                ? "text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-lg bg-[image:var(--gradient-primary)]"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative flex items-center gap-1">
              {opt.label}
              {opt.count !== undefined && (
                <span
                  className={cn(
                    "ml-1 rounded-full px-1.5 py-0.5 text-[10px] leading-none font-semibold",
                    active
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-surface-2 text-muted-foreground",
                  )}
                >
                  {opt.count}
                </span>
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
