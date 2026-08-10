import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** Ambient animated background: aurora gradients, grid, floating orbs. */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}>
      <div className="absolute inset-0 aurora animate-gradient-pan opacity-70" />
      <div className="absolute inset-0 surface-grid opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
      {[
        { size: 420, top: "8%", left: "6%", delay: 0 },
        { size: 300, top: "58%", left: "78%", delay: 1.5 },
        { size: 220, top: "72%", left: "18%", delay: 0.8 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/12 blur-3xl"
          style={{ width: orb.size, height: orb.size, top: orb.top, left: orb.left }}
          animate={{ y: [0, -30, 0], x: [0, 18, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{
            duration: 14 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
