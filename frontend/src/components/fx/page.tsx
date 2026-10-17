import type { ReactNode } from "react";
import { motion } from "motion/react";
import { fadeUp, pageTransition, stagger } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

interface PageProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Animated page wrapper: entrance transition, animated title, staggered content. */
export function Page({ title, description, actions, children, className }: PageProps) {
  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="show"
      exit="exit"
      className={cn("mx-auto w-full max-w-[1400px] px-5 pb-16 pt-6 md:px-8", className)}
    >
      <motion.header
        variants={stagger(0.06)}
        initial="hidden"
        animate="show"
        className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <motion.h1
            variants={fadeUp}
            className="text-3xl font-semibold tracking-tight md:text-4xl"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p variants={fadeUp} className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {description}
            </motion.p>
          )}
        </div>
        {actions && (
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
            {actions}
          </motion.div>
        )}
      </motion.header>

      <motion.div variants={stagger(0.07, 0.1)} initial="hidden" animate="show">
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Section({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & Record<string, unknown>) {
  return (
    <motion.section variants={fadeUp} className={cn(className)} {...rest}>
      {children}
    </motion.section>
  );
}
