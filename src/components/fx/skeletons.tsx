import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "./glass-panel";
import { stagger } from "@/lib/motion-presets";

export function SkeletonBar({ className }: { className?: string }) {
  return <div className={cn("shimmer h-3 rounded-full bg-surface-2/80", className)} />;
}

/** Skeleton placeholder shown while a view "loads". */
export function LoadingGrid({ cards = 4 }: { cards?: number }) {
  return (
    <motion.div
      variants={stagger(0.05)}
      initial="hidden"
      animate="show"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {Array.from({ length: cards }).map((_, i) => (
        <GlassPanel key={i} hoverable={false} className="space-y-4">
          <SkeletonBar className="w-1/3" />
          <SkeletonBar className="h-7 w-2/3" />
          <SkeletonBar className="w-1/2" />
        </GlassPanel>
      ))}
    </motion.div>
  );
}

export function LoadingRows({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-border p-4">
          <SkeletonBar className="size-9 rounded-full" />
          <SkeletonBar className="w-1/4" />
          <SkeletonBar className="w-1/6" />
          <SkeletonBar className="ml-auto w-1/12" />
        </div>
      ))}
    </div>
  );
}
