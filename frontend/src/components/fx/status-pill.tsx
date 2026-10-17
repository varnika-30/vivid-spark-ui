import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type Tone = "primary" | "success" | "warning" | "destructive" | "info" | "muted";

const tones: Record<Tone, string> = {
  primary: "bg-primary/14 text-primary border-primary/25",
  success: "bg-success/14 text-success border-success/25",
  warning: "bg-warning/14 text-warning border-warning/25",
  destructive: "bg-destructive/14 text-destructive border-destructive/25",
  info: "bg-info/14 text-info border-info/25",
  muted: "bg-muted text-muted-foreground border-border",
};

export function StatusPill({
  tone = "muted",
  children,
  pulse = false,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {pulse && (
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </motion.span>
  );
}
