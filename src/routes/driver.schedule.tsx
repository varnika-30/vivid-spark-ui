import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatusPill } from "@/components/fx/status-pill";
import { FilterChips } from "@/components/fx/controls";
import { driverSchedule } from "@/data/fleet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/driver/schedule")({
  head: () => ({
    meta: [
      { title: "My Schedule — Fleetline" },
      { name: "description", content: "Weekly and monthly driving schedule with stops, breaks and shifts." },
      { property: "og:title", content: "My Schedule — Fleetline" },
      { property: "og:description", content: "Plan your week: shifts, pickups, drops and breaks." },
    ],
  }),
  component: SchedulePage,
});

const views = [
  { value: "day", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
] as const;

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function SchedulePage() {
  const [view, setView] = useState<(typeof views)[number]["value"]>("day");

  return (
    <Page
      title="My Schedule"
      description="Aug 5 – Aug 11, 2026 · 22 trips · 186 km planned today."
      actions={<FilterChips options={views} value={view} onChange={setView} layoutId="schedule-view" />}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <GlassPanel className="lg:col-span-2" title="Planner" subtitle="Drag-free overview of your commitments">
          <AnimatePresence mode="wait">
            {view === "day" ? (
              <motion.div
                key="day"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-2"
              >
                {driverSchedule.map((s, i) => (
                  <motion.div
                    key={s.time}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 rounded-xl border border-border bg-surface/40 p-3"
                  >
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3.5" /> {s.time}
                    </span>
                    <p className="flex-1 text-sm">{s.title}</p>
                    <StatusPill tone={s.type === "break" ? "warning" : "primary"}>{s.type}</StatusPill>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={view}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-7 gap-2"
              >
                {weekDays.map((d) => (
                  <p key={d} className="pb-1 text-center text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {d}
                  </p>
                ))}
                {Array.from({ length: view === "week" ? 7 : 35 }).map((_, i) => {
                  const load = (i * 7) % 5;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.012 }}
                      whileHover={{ y: -3, scale: 1.04 }}
                      className={cn(
                        "aspect-square rounded-xl border border-border p-2 text-[11px]",
                        load > 3 ? "bg-primary/15" : load > 1 ? "bg-surface-2/60" : "bg-surface/30",
                      )}
                    >
                      <span className="text-muted-foreground">{i + 1}</span>
                      {load > 1 && <span className="mt-1 block font-medium">{load} trips</span>}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassPanel>

        <GlassPanel title="Monthly summary" subtitle="August 2026">
          <div className="space-y-3">
            {[
              { label: "Scheduled trips", value: "22", icon: CalendarDays },
              { label: "Distance planned", value: "1,240 km", icon: MapPin },
              { label: "Rest windows", value: "9", icon: Clock },
            ].map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center justify-between rounded-xl border border-border p-3"
              >
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <row.icon className="size-4" /> {row.label}
                </span>
                <span className="font-display text-lg font-semibold">{row.value}</span>
              </motion.div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </Page>
  );
}
