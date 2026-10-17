import type { ReactNode } from "react";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  hoverable?: boolean;
}

/** The base surface used across the app: glass, rounded, hover-elevating. */
export function GlassPanel({
  children,
  className,
  title,
  subtitle,
  actions,
  hoverable = true,
}: GlassPanelProps) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={hoverable ? { y: -3 } : {}}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className={cn(
        "relative overflow-hidden rounded-2xl glass p-5 transition-colors duration-500",
        hoverable && "hover:border-primary/30 hover:shadow-[var(--shadow-elevated)]",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />
      {(title || actions) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-base font-semibold">{title}</h3>}
            {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
}
