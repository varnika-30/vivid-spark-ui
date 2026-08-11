import { useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "glass" | "ghost";

interface MagneticButtonProps extends Omit<ComponentPropsWithoutRef<"button">, "onAnimationStart" | "style" | "onDrag" | "onDragStart" | "onDragEnd"> {
  children: ReactNode;
  variant?: Variant;
  /** @deprecated retained for API compatibility — interaction is now a fixed subtle tilt. */
  strength?: number;
  /** Max tilt in degrees toward the cursor (clamped to 5). */
  tilt?: number;
  /** Enables a slow idle float. Use for hero / primary action buttons only. */
  float?: boolean;
  icon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)] animate-gradient-pan hover:shadow-[0_10px_30px_-8px_color-mix(in_oklab,var(--primary)_55%,transparent)]",
  glass: "glass-strong text-foreground hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-surface-2/60",
};

const soft = { stiffness: 220, damping: 26, mass: 0.6 };

/** Button that stays anchored, tilting subtly toward the cursor with a gentle hover lift. */
export function MagneticButton({
  children,
  className,
  variant = "glass",
  tilt = 4,
  float = false,
  icon,
  onClick,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const deg = Math.min(Math.max(tilt, 0), 5);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-1, 1], [deg, -deg]), soft);
  const ry = useSpring(useTransform(px, [-1, 1], [-deg, deg]), soft);
  const tx = useSpring(useTransform(px, [-1, 1], [-5, 5]), soft);
  const ty = useSpring(useTransform(py, [-1, 1], [-5, 5]), soft);

  return (
    <motion.div
      className={float ? "inline-flex" : "contents"}
      {...(float
        ? {
            animate: { y: [0, -3, 0] },
            transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const },
          }
        : {})}
    >
      <motion.button
        ref={ref}
        style={{ x: tx, y: ty, rotateX: rx, rotateY: ry, transformPerspective: 800 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        onPointerMove={(e) => {
          const rect = ref.current?.getBoundingClientRect();
          if (!rect) return;
          px.set(((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) || 0);
          py.set(((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) || 0);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
        onClick={(e) => {
          const rect = ref.current?.getBoundingClientRect();
          if (rect) {
            const id = Date.now();
            setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
            setTimeout(() => setRipples((r) => r.filter((item) => item.id !== id)), 650);
          }
          onClick?.(e);
        }}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-3 text-sm font-medium",
          "transition-shadow duration-500 will-change-transform",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          variants[variant],
          className,
        )}
        {...props}
      >
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="pointer-events-none absolute rounded-full bg-foreground/20"
            initial={{ width: 0, height: 0, opacity: 0.4, x: r.x, y: r.y }}
            animate={{ width: 320, height: 320, opacity: 0, x: r.x - 160, y: r.y - 160 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          />
        ))}
        {icon && <span className="relative flex items-center">{icon}</span>}
        <span className="relative">{children}</span>
      </motion.button>
    </motion.div>
  );
}
