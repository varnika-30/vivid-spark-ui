import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import {
  ArrowUpRight,
  CalendarDays,
  Compass,
  Gauge,
  MapPin,
  Package,
  PackagePlus,
  Radar,
  Route as RouteIcon,
  Truck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AuroraBackground } from "@/components/fx/aurora-background";
import { StatusPill } from "@/components/fx/status-pill";
import { TiltCard } from "@/components/fx/tilt-card";
import { roleMeta } from "@/components/layout/navigation";
import { type Role } from "@/data/fleet";
import { fadeUp, stagger } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

interface Launch {
  label: string;
  to: string;
  icon: LucideIcon;
  desc: string;
}

const launchers: Record<Role, Launch[]> = {
  manager: [
    { label: "Fleet Report", to: "/manager", icon: Gauge, desc: "Overall fleet score, metrics & intelligence" },
    { label: "List of Deliveries", to: "/manager/deliveries", icon: Truck, desc: "Live delivery board & driver dispatch" },
    { label: "Drivers", to: "/manager/drivers", icon: Users, desc: "142 active drivers, scores & duty status" },
    { label: "Trip Reports", to: "/manager/trips", icon: RouteIcon, desc: "Completed trip directory & route analysis" },
  ],
  driver: [
    { label: "My Schedule", to: "/driver/schedule", icon: CalendarDays, desc: "Today · 6 stops" },
    { label: "My Performance", to: "/driver/performance", icon: Gauge, desc: "Score 87 · Low risk" },
  ],
  client: [
    { label: "Track", to: "/client", icon: MapPin, desc: "6 active shipments" },
    { label: "Create New", to: "/client/create", icon: PackagePlus, desc: "Book a delivery in 60s" },
  ],
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

/** Futuristic decorative logistics background overlay with route paths, nodes, location pins & icons */
function ClientLogisticsDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
      {/* Abstract Grid Texture Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c712_1px,transparent_1px),linear-gradient(to_bottom,#0284c712_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Decorative Circular Icon Badges & Glowing Nodes in Outer Canvas Margins */}
      {/* 1. Top Left Location Pin Badge */}
      <div className="absolute left-[3%] xl:left-[5%] top-[18%] hidden md:flex flex-col items-center gap-2">
        <div className="grid size-12 place-items-center rounded-2xl border border-primary/30 bg-surface/30 backdrop-blur-xl shadow-[var(--shadow-glow)] animate-float-slow">
          <MapPin className="size-5 text-primary/80" />
        </div>
        <span className="size-2 rounded-full bg-primary animate-ping" />
      </div>

      {/* 2. Top Right Route/Compass Badge */}
      <div className="absolute right-[4%] xl:right-[6%] top-[16%] hidden md:flex flex-col items-center gap-2">
        <div className="grid size-12 place-items-center rounded-2xl border border-primary/30 bg-surface/30 backdrop-blur-xl shadow-[var(--shadow-glow)] animate-float-slow" style={{ animationDelay: "1.2s" }}>
          <Compass className="size-5 text-primary/80" />
        </div>
        <span className="size-2 rounded-full bg-primary animate-ping" style={{ animationDelay: "0.6s" }} />
      </div>

      {/* 3. Mid Left Package Badge */}
      <div className="absolute left-[2%] xl:left-[4%] top-[56%] hidden lg:flex flex-col items-center gap-2">
        <div className="grid size-11 place-items-center rounded-2xl border border-primary/25 bg-surface/20 backdrop-blur-xl shadow-[var(--shadow-glow)] animate-float-slow" style={{ animationDelay: "2.4s" }}>
          <Package className="size-4.5 text-primary/80" />
        </div>
        <span className="size-1.5 rounded-full bg-primary/70 animate-pulse" />
      </div>

      {/* 4. Mid Right Truck Motif Badge */}
      <div className="absolute right-[3%] xl:right-[5%] top-[60%] hidden lg:flex flex-col items-center gap-2">
        <div className="grid size-12 place-items-center rounded-2xl border border-primary/30 bg-surface/30 backdrop-blur-xl shadow-[var(--shadow-glow)] animate-float-slow" style={{ animationDelay: "1.8s" }}>
          <Truck className="size-5 text-primary/80" />
        </div>
        <span className="size-2 rounded-full bg-primary animate-ping" style={{ animationDelay: "1s" }} />
      </div>

      {/* Multiple Dotted Logistics Route Paths & Glowing Cyan Nodes SVG */}
      <svg className="absolute inset-0 size-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="clientRouteGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.55" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--chart-2)" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="clientRouteGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Primary Dotted Route Path 1 */}
        <path
          d="M 90 220 C 310 100 520 300 750 160 T 1180 240"
          fill="none"
          stroke="url(#clientRouteGrad1)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />

        {/* Secondary Dotted Route Path 2 */}
        <path
          d="M 150 480 Q 450 320 780 440 T 1220 360"
          fill="none"
          stroke="url(#clientRouteGrad2)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Glowing Cyan Location & Navigation Nodes */}
        <circle cx="90" cy="220" r="5" fill="var(--primary)" />
        <circle cx="90" cy="220" r="13" fill="var(--primary)" opacity="0.2" />

        <circle cx="1020" cy="210" r="4" fill="var(--primary)" />
        <circle cx="1020" cy="210" r="10" fill="var(--primary)" opacity="0.2" />

        <circle cx="450" cy="320" r="3.5" fill="var(--primary)" opacity="0.8" />
        <circle cx="780" cy="440" r="4" fill="var(--primary)" opacity="0.7" />
      </svg>

      {/* Dual Soft Cyan Radial Background Glows */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-primary/7 blur-[170px]" />
      <div className="absolute left-1/2 top-2/3 -translate-x-1/2 size-[450px] rounded-full bg-primary/5 blur-[140px]" />
    </div>
  );
}

export function WelcomePage({ role }: { role: string }) {
  const safeRole: Role = (["manager", "driver", "client"] as const).includes(role as Role)
    ? (role as Role)
    : "manager";
  const meta = roleMeta[safeRole];
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 60, damping: 20 });
  const py = useSpring(my, { stiffness: 60, damping: 20 });
  const layer1X = useTransform(px, [-1, 1], [-26, 26]);
  const layer1Y = useTransform(py, [-1, 1], [-18, 18]);
  const layer2X = useTransform(px, [-1, 1], [18, -18]);
  const layer2Y = useTransform(py, [-1, 1], [12, -12]);

  const go = (to: string) => {
    setLeaving(true);
    setTimeout(() => navigate({ to }), 480);
  };

  return (
    <div
      onPointerMove={(e) => {
        mx.set((e.clientX / window.innerWidth) * 2 - 1);
        my.set((e.clientY / window.innerHeight) * 2 - 1);
      }}
      className="relative min-h-screen overflow-hidden"
    >
      <AuroraBackground />
      {(safeRole === "client" || safeRole === "driver" || safeRole === "manager") && <ClientLogisticsDecor />}

      {/* Cinematic transition curtain */}
      <AnimatePresence>
        {leaving && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 bg-[image:var(--gradient-primary)] opacity-90"
          />
        )}
      </AnimatePresence>

      {/* PARALLAX FLOATING DECORATIVE BACKGROUND BOXES */}
      <motion.div
        style={{ x: layer2X, y: layer2Y }}
        className="pointer-events-none absolute inset-0 z-0"
      >
        {/* 1. Top-Left Decorative Glass Box (Truck Motif) */}
        <div className="absolute left-[3%] xl:left-[5%] top-[8%] size-36 md:size-40 rounded-[2rem] border border-primary/20 bg-surface/20 backdrop-blur-2xl animate-float-slow grid place-items-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <Truck className="size-10 md:size-11 text-primary/25" />
        </div>

        {/* 2. Top-Right Decorative Glass Box (Route Symbol Motif) */}
        <div className="absolute right-[4%] xl:right-[6%] top-[12%] size-24 md:size-28 rotate-12 rounded-3xl border border-primary/20 bg-surface/20 backdrop-blur-2xl animate-float-slow grid place-items-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]" style={{ animationDelay: "1.2s" }}>
          <RouteIcon className="size-8 text-primary/25 -rotate-12" />
        </div>

        {/* 3. Bottom-Left Decorative Glass Box (Location Pin Motif) */}
        <div className="absolute bottom-[10%] left-[4%] xl:left-[8%] size-20 md:size-24 rounded-full border border-primary/25 bg-surface/20 backdrop-blur-2xl animate-float-slow grid place-items-center shadow-[0_8px_32px_rgba(0,0,0,0.25)]" style={{ animationDelay: "2.4s" }}>
          <MapPin className="size-7 text-primary/30" />
        </div>

        {/* 4. Bottom-Right Decorative Glass Box (Parcel / Package Motif) */}
        <div className="absolute bottom-[12%] right-[4%] xl:right-[8%] size-28 md:size-32 rounded-[1.75rem] border border-primary/20 bg-surface/15 backdrop-blur-2xl animate-float-slow grid place-items-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]" style={{ animationDelay: "1.8s" }}>
          <Package className="size-9 md:size-10 text-primary/25" />
        </div>
      </motion.div>

      {/* MAIN HERO CONTENT CONTAINER */}
      <motion.div
        animate={leaving ? { scale: 0.96, opacity: 0, filter: "blur(10px)" } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-10 md:py-14 text-center"
      >
        <motion.div
          variants={stagger(0.1, 0.15)}
          initial="hidden"
          animate="show"
          className="flex w-full flex-col items-center"
        >
          {/* HERO BADGE & GREETING */}
          <motion.div variants={fadeUp} className="flex items-center gap-2.5">
            <span className="grid size-9.5 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
              <Radar className="size-5" />
            </span>
            <StatusPill tone="primary" pulse>
              {meta.title} workspace
            </StatusPill>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-4 sm:mt-5 text-xs uppercase tracking-[0.4em] text-muted-foreground font-bold relative z-20"
          >
            {safeRole === "driver"
              ? "GOOD AFTERNOON, RAHUL"
              : `${greeting().toUpperCase()}, ${(meta.person.split(" ")[0] ?? "").toUpperCase()}`}
          </motion.p>

          {/* Large Hero Heading (Kept at prominent size: 6xl md:8xl lg:9xl) */}
          <motion.h1
            variants={fadeUp}
            style={{ x: layer1X, y: layer1Y }}
            className="mt-3 sm:mt-3.5 max-w-5xl text-balance text-6xl font-semibold leading-[0.92] tracking-tight md:text-8xl lg:text-9xl relative z-20"
          >
            Welcome
            <span className="block text-gradient animate-gradient-pan">back on route.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 sm:mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg relative z-20"
          >
            {safeRole === "manager"
              ? "142 drivers on duty, 56 requests waiting and one AI copilot ready to assign them."
              : safeRole === "driver"
                ? "Six stops planned for today. Check your schedule or review your performance."
                : "Six shipments moving right now — track them live or book a new delivery."}
          </motion.p>

          {/* PROMINENT NAVIGATION CARDS SECTION (PROPORTIONATE TO HERO HEADING) */}
          <motion.div
            variants={fadeUp}
            className={cn(
              "mx-auto mt-8 md:mt-10 grid w-full gap-4.5 md:gap-5 relative z-20 sm:grid-cols-2",
              safeRole === "manager" ? "max-w-5xl" : "max-w-4xl"
            )}
          >
            {launchers[safeRole].map((item, i) => (
              <FloatingLauncher
                key={item.to}
                item={item}
                index={i}
                onSelect={() => go(item.to)}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Prominent Navigation Launcher Card with enlarged icon badge, bold typography, and elevated presence */
function FloatingLauncher({
  item,
  index,
  onSelect,
}: {
  item: Launch;
  index: number;
  onSelect: () => void;
}) {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 5 + index * 0.6, repeat: Infinity, ease: "easeInOut" }}
      className="w-full"
    >
      <TiltCard
        intensity={4}
        className="rounded-3xl border-primary/30 bg-surface/35 backdrop-blur-xl shadow-[0_14px_45px_rgba(0,0,0,0.38)] hover:border-primary/70 hover:shadow-[0_0_38px_rgba(6,182,212,0.28)] transition-all duration-300"
      >
        <button
          type="button"
          onClick={onSelect}
          className="group flex w-full items-center justify-between gap-4 md:gap-5 text-left transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer p-6 sm:p-6.5 md:p-7"
        >
          {/* Left Icon Badge & Typography */}
          <div className="flex items-center gap-4 md:gap-4.5 min-w-0">
            <motion.span
              whileHover={{ rotate: 10, scale: 1.12 }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
              className="grid size-14 md:size-16 shrink-0 place-items-center rounded-2xl bg-primary/16 text-primary shadow-[var(--shadow-glow)] group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 border border-primary/20"
            >
              <item.icon className="size-6.5 md:size-7.5" />
            </motion.span>
            <div className="flex flex-col text-left min-w-0">
              <span className="block truncate text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
                {item.label}
              </span>
              <span className="mt-1 block truncate text-xs md:text-sm font-medium text-muted-foreground">
                {item.desc}
              </span>
            </div>
          </div>

          {/* Right Circular Arrow Action Button */}
          <span className="grid size-11 md:size-12 shrink-0 place-items-center rounded-full bg-surface-2/80 border border-border/70 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:shadow-[var(--shadow-glow)] transition-all duration-300">
            <ArrowUpRight className="size-5 md:size-5.5" />
          </span>
        </button>
      </TiltCard>
    </motion.div>
  );
}
