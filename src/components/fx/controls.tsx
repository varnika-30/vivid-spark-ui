import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Search field with animated focus glow and clear affordance. */
export function AnimatedSearch({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      animate={focused ? { scale: 1.01 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "relative flex min-w-0 flex-1 items-center gap-2 rounded-xl border bg-surface/50 px-3 py-2.5 transition-colors duration-300",
        focused ? "border-primary/60 shadow-[var(--shadow-glow)]" : "border-border",
        className,
      )}
    >
      <Search
        className={cn(
          "size-4 shrink-0 transition-colors",
          focused ? "text-primary" : "text-muted-foreground",
        )}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
            onClick={() => onChange("")}
            className="rounded-md p-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** Filter chips with a sliding active indicator. */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  layoutId = "chip-indicator",
}: {
  options: readonly { value: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
  layoutId?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-surface/40 p-1.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <motion.button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-300",
              active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-lg bg-[image:var(--gradient-primary)]"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {opt.label}
              {opt.count !== undefined && (
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px]",
                    active ? "bg-primary-foreground/20" : "bg-surface-2",
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
