import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, MapPin, PackageSearch } from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatCard } from "@/components/fx/stat-card";
import { StatusPill, type Tone } from "@/components/fx/status-pill";
import { AnimatedSearch } from "@/components/fx/controls";
import { clientStats, deliveries, statusMeta, trackingSteps } from "@/data/fleet";

export const Route = createFileRoute("/client/")({
  head: () => ({
    meta: [
      { title: "Track Deliveries — Fleetline" },
      { name: "description", content: "Track your shipments live: status, driver, and expected delivery time." },
      { property: "og:title", content: "Track Deliveries — Fleetline" },
      { property: "og:description", content: "Live shipment tracking with a step-by-step delivery timeline." },
    ],
  }),
  component: ClientTrack,
});

function ClientTrack() {
  const [query, setQuery] = useState("");
  const rows = deliveries.filter((d) =>
    (d.id + d.drop + d.driver).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Page title="Track" description="Every shipment you have with Fleetline, live.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {clientStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <AnimatedSearch value={query} onChange={setQuery} placeholder="Search delivery ID or destination…" />
          <AnimatePresence mode="popLayout">
            {rows.map((d, i) => {
              const meta = statusMeta[d.status];
              return (
                <motion.div
                  key={d.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -3 }}
                  className="flex flex-wrap items-center gap-3 rounded-2xl glass p-4 transition-colors hover:border-primary/30"
                >
                  <span className="font-medium text-primary">{d.id}</span>
                  <StatusPill tone={meta.tone as Tone} pulse={d.status === "in-transit"}>
                    {meta.label}
                  </StatusPill>
                  <span className="text-sm text-muted-foreground">{d.drop}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{d.expected}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {rows.length === 0 && (
            <GlassPanel className="flex flex-col items-center gap-3 py-16 text-center" hoverable={false}>
              <motion.span
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="grid size-14 place-items-center rounded-2xl bg-primary/12 text-primary"
              >
                <PackageSearch className="size-6" />
              </motion.span>
              <p className="text-sm font-medium">No shipments found</p>
            </GlassPanel>
          )}
        </div>

        <GlassPanel title="DEL-2026-0816" subtitle="Electronics · Mumbai → Pune">
          <div className="relative space-y-4 pl-6">
            <span className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-border" />
            {trackingSteps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative"
              >
                <span
                  className={`absolute -left-[22px] top-1 grid size-4 place-items-center rounded-full ${
                    step.done ? "bg-primary text-primary-foreground" : "border border-border bg-surface"
                  }`}
                >
                  {step.done && <CheckCircle2 className="size-3" />}
                </span>
                <p className="text-sm font-medium">{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.time}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 rounded-xl border border-border p-3 text-xs text-muted-foreground">
            <MapPin className="size-3.5 text-primary" /> Adira Corporate Office, Baner, Pune
          </p>
        </GlassPanel>
      </div>
    </Page>
  );
}
