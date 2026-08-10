import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CalendarDays, Gauge, MapPin, Truck } from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatCard } from "@/components/fx/stat-card";
import { StatusPill } from "@/components/fx/status-pill";
import { driverSchedule, driverStats } from "@/data/fleet";

export const Route = createFileRoute("/driver/")({
  head: () => ({
    meta: [
      { title: "Today — Driver Workspace · Fleetline" },
      { name: "description", content: "Your day at a glance: stops, distance, score and next pickup." },
      { property: "og:title", content: "Today — Driver Workspace · Fleetline" },
      { property: "og:description", content: "Stops, distance and safety score for the day." },
    ],
  }),
  component: DriverToday,
});

function DriverToday() {
  return (
    <Page title="Today" description="Six stops, 186 km planned. Your score is trending upward.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {driverStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} icon={<Gauge className="size-4" />} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <GlassPanel className="lg:col-span-2" title="Next stops" subtitle="Live route for today">
          <div className="relative space-y-3 pl-6">
            <span className="absolute left-[9px] top-2 h-[calc(100%-1rem)] w-px bg-border" />
            {driverSchedule.map((s, i) => (
              <motion.div
                key={s.time}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, type: "spring", stiffness: 250, damping: 26 }}
                whileHover={{ x: 4 }}
                className="relative rounded-xl border border-border bg-surface/40 p-3"
              >
                <span className="absolute -left-[21px] top-4 size-2.5 rounded-full bg-primary shadow-[var(--shadow-glow)]" />
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{s.title}</p>
                  <StatusPill tone={i === 1 ? "primary" : "muted"}>{s.time}</StatusPill>
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" /> {s.city}
                </p>
              </motion.div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel title="Quick actions" subtitle="Jump straight in">
          <div className="space-y-2">
            {[
              { to: "/driver/schedule", label: "My Schedule", icon: CalendarDays },
              { to: "/driver/deliveries", label: "List of Deliveries", icon: Truck },
              { to: "/driver/performance", label: "My Performance", icon: Gauge },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm transition-colors hover:border-primary/40 hover:bg-surface-2/50"
              >
                <span className="grid size-8 place-items-center rounded-lg bg-primary/12 text-primary">
                  <a.icon className="size-4" />
                </span>
                {a.label}
              </Link>
            ))}
          </div>
        </GlassPanel>
      </div>
    </Page>
  );
}
