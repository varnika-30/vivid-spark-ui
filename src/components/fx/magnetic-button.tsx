import { useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "glass" | "ghost";

interface MagneticButtonProps extends Omit<ComponentPropsWithoutRef<"button">, "onAnimationStart" | "style" | "onDrag" | "onDragStart" | "onDragEnd"> {
  children: ReactNode;
  variant?: Variant;
  strength?: number;
  icon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)] animate-gradient-pan",
  glass: "glass-strong text-foreground hover:border-primary/40",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-surface-2/60",
};

/** Button with magnetic cursor attraction, glow and ripple press feedback. */
export function MagneticButton({
  children,
  className,
  variant = "glass",
  strength = 0.35,
  icon,
  onClick,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const x = useSpring(useMotionValue(0), { stiffness: 240, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 240, damping: 18 });

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      onPointerMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
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
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variants[variant],
        className,
      )}
      {...props}
    >
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-foreground/25"
          initial={{ width: 0, height: 0, opacity: 0.5, x: r.x, y: r.y }}
          animate={{ width: 320, height: 320, opacity: 0, x: r.x - 160, y: r.y - 160 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        />
      ))}
      {icon && (
        <motion.span
          className="relative flex items-center"
          whileHover={{ rotate: 8, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 12 }}
        >
          {icon}
        </motion.span>
      )}
      <span className="relative">{children}</span>
    </motion.button>
  );
}
