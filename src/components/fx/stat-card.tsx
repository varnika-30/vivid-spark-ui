import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { TiltCard } from "./tilt-card";
import { fadeUp } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

/** Counts up to a numeric value when scrolled into view. */
export function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 90, damping: 22 });
  const text = useTransform(spring, (v) =>
    v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
  );
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, mv, value]);
  useEffect(() => text.on("change", setDisplay), [text]);

  return <span ref={ref}>{display}</span>;
}

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  trend?: "up" | "down";
  sub?: string;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  unit,
  delta,
  trend = "up",
  sub,
  icon,
  className,
}: StatCardProps) {
  const numeric = Number(value.replace(/,/g, ""));
  const isNumber = !Number.isNaN(numeric);
  const decimals = value.includes(".") ? 1 : 0;

  return (
    <motion.div variants={fadeUp} className={cn("h-full", className)}>
      <TiltCard className="h-full p-5" intensity={6}>
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
          {icon && (
            <motion.span
              className="rounded-lg bg-primary/12 p-2 text-primary"
              whileHover={{ rotate: 10, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
            >
              {icon}
            </motion.span>
          )}
        </div>
        <div className="mt-4 flex items-end gap-1.5">
          <span className="font-display text-3xl font-semibold tracking-tight">
            {isNumber ? <CountUp value={numeric} decimals={decimals} /> : value}
          </span>
          {unit && <span className="pb-1 text-sm text-muted-foreground">{unit}</span>}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          {delta && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
                trend === "up"
                  ? "bg-success/15 text-success"
                  : "bg-destructive/15 text-destructive",
              )}
            >
              {trend === "up" ? (
                <ArrowUpRight className="size-3" />
              ) : (
                <ArrowDownRight className="size-3" />
              )}
              {delta}
            </span>
          )}
          {sub && <span className="text-muted-foreground">{sub}</span>}
        </div>
      </TiltCard>
    </motion.div>
  );
}
