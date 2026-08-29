import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import {
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  Gauge,
  MapPin,
  PackagePlus,
  Radar,
  Route as RouteIcon,
  Truck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AuroraBackground } from "@/components/fx/aurora-background";
import { MagneticButton } from "@/components/fx/magnetic-button";
import { StatusPill } from "@/components/fx/status-pill";
import { TiltCard } from "@/components/fx/tilt-card";
import { roleMeta } from "@/components/layout/navigation";
import type { Role } from "@/data/fleet";
import { fadeUp, stagger } from "@/lib/motion-presets";

export const Route = createFileRoute("/welcome/$role")({
  head: () => ({
    meta: [
      { title: "Welcome — Fleetline Workspace" },
      {
        name: "description",
        content:
          "Your personalised Fleetline launchpad: jump into reports, deliveries, schedules and tracking.",
      },
      { property: "og:title", content: "Welcome — Fleetline Workspace" },
      {
        property: "og:description",
        content: "A premium launchpad into fleet reports, deliveries and live tracking.",
      },
    ],
  }),
  component: WelcomePage,
});

interface Launch {
  label: string;
  to: string;
  icon: LucideIcon;
  desc: string;
}

const launchers: Record<Role, Launch[]> = {
  manager: [
    { label: "Fleet Report", to: "/manager", icon: Gauge, desc: "How the fleet is really performing" },
    {
      label: "Requested Deliveries",
      to: "/manager/requests",
      icon: ClipboardList,
      desc: "56 requests awaiting review",
    },
    { label: "Drivers", to: "/manager/drivers", icon: Users, desc: "142 active drivers" },
    { label: "List of Deliveries", to: "/manager/deliveries", icon: Truck, desc: "Live delivery board" },
    { label: "Trip Reports", to: "/manager/trips", icon: RouteIcon, desc: "Completed trip analysis" },
  ],
  driver: [
    { label: "My Schedule", to: "/driver/schedule", icon: CalendarDays, desc: "Today · 6 stops" },
    { label: "List of Deliveries", to: "/driver/deliveries", icon: Truck, desc: "3 in progress" },
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

function WelcomePage() {
  const { role } = Route.useParams();
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

      {/* Parallax floating decor */}
      <motion.div
        style={{ x: layer2X, y: layer2Y }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-[10%] top-[14%] size-44 rounded-[2rem] border border-border/50 bg-surface/20 backdrop-blur-2xl animate-float-slow" />
        <div className="absolute right-[12%] top-[22%] size-28 rotate-12 rounded-3xl border border-border/50 bg-surface/20 backdrop-blur-2xl animate-float-slow" />
        <div className="absolute bottom-[14%] left-[20%] size-20 rounded-full border border-primary/30 bg-primary/10 blur-[1px] animate-float-slow" />
        <div className="absolute bottom-[22%] right-[18%] size-36 rounded-[1.75rem] border border-border/40 bg-surface/10 backdrop-blur-2xl animate-float-slow" />
      </motion.div>

      <motion.div
        animate={leaving ? { scale: 0.96, opacity: 0, filter: "blur(10px)" } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-24 text-center"
      >
        <motion.div
          variants={stagger(0.1, 0.15)}
          initial="hidden"
          animate="show"
          className="flex w-full flex-col items-center"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
              <Radar className="size-5" />
            </span>
            <StatusPill tone="primary" pulse>
              {meta.title} workspace
            </StatusPill>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-14 text-[11px] uppercase tracking-[0.42em] text-muted-foreground"
          >
            {greeting()}, {meta.person.split(" ")[0]}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            style={{ x: layer1X, y: layer1Y }}
            className="mt-6 max-w-4xl text-balance text-6xl font-semibold leading-[0.92] tracking-tight md:text-8xl"
          >
            Welcome
            <span className="block text-gradient animate-gradient-pan">back on route.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-8 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {safeRole === "manager"
              ? "142 drivers on duty, 56 requests waiting and one AI copilot ready to assign them."
              : safeRole === "driver"
                ? "Six stops today, 186 km planned and your safety score is trending upward."
                : "Six shipments moving right now — track them live or book a new delivery."}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className={
              safeRole === "client"
                ? "mx-auto mt-16 grid w-full max-w-5xl gap-5 sm:grid-cols-2"
                : "mx-auto mt-16 grid w-full max-w-5xl justify-center gap-5 sm:grid-cols-2 lg:grid-cols-3"
            }
          >
            {launchers[safeRole].map((item, i) => (
              <FloatingLauncher
                key={item.to}
                item={item}
                index={i}
                compact={safeRole === "client"}
                onSelect={() => go(item.to)}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function FloatingLauncher({
  item,
  index,
  onSelect,
  compact = false,
}: {
  item: Launch;
  index: number;
  onSelect: () => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 5 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-full"
      >
        <TiltCard intensity={3} className="rounded-2xl">
          <MagneticButton
            onClick={onSelect}
            variant="glass"
            tilt={0}
            className="group w-full items-center gap-4 rounded-2xl border-0 bg-transparent px-5 py-4 text-left shadow-none"
          >
            <motion.span
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/14 text-primary shadow-[var(--shadow-glow)]"
            >
              <item.icon className="size-5" />
            </motion.span>
            <span className="block min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold tracking-tight">
                {item.label}
              </span>
              <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">
                {item.desc}
              </span>
            </span>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
          </MagneticButton>
        </TiltCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 5 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <TiltCard intensity={4} className="rounded-2xl">
        <MagneticButton
          onClick={onSelect}
          variant="glass"
          tilt={0}
          className="group w-full flex-col items-start gap-4 rounded-2xl border-0 bg-transparent p-6 text-left shadow-none"
        >
          <span className="flex w-full items-center justify-between">
            <motion.span
              whileHover={{ rotate: 10, scale: 1.12 }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
              className="grid size-11 place-items-center rounded-xl bg-primary/14 text-primary shadow-[var(--shadow-glow)]"
            >
              <item.icon className="size-5" />
            </motion.span>
            <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
          </span>
          <span className="block w-full">
            <span className="block text-base font-semibold tracking-tight">{item.label}</span>
            <span className="mt-1.5 block text-xs font-normal leading-relaxed text-muted-foreground">
              {item.desc}
            </span>
          </span>
        </MagneticButton>
      </TiltCard>
    </motion.div>
  );
}

