import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Clock, MapPin, Navigation, Package } from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatusPill, type Tone } from "@/components/fx/status-pill";
import { deliveries, statusMeta } from "@/data/fleet";

export const Route = createFileRoute("/driver/deliveries/")({
  head: () => ({
    meta: [
      { title: "My Deliveries — Fleetline" },
      { name: "description", content: "Your assigned pickups and drops for the day, with routes and timings." },
      { property: "og:title", content: "My Deliveries — Fleetline" },
      { property: "og:description", content: "Driver task list: assigned deliveries, routes and expected times." },
    ],
  }),
  component: DriverDeliveries,
});

function DriverDeliveries() {
  const tasks = deliveries.filter((d) => d.status !== "cancelled");

  return (
    <Page title="My Deliveries" description="Everything assigned to you today, in order of pickup.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tasks.map((d, i) => {
          const meta = statusMeta[d.status];
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 240, damping: 26 }}
            >
              <GlassPanel className="h-full">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-primary">{d.id}</span>
                  <StatusPill tone={meta.tone as Tone} pulse={d.status === "in-transit"}>
                    {meta.label}
                  </StatusPill>
                </div>
                <p className="mt-3 flex items-start gap-2 text-sm">
                  <Package className="mt-0.5 size-4 shrink-0 text-primary" /> {d.pickup}
                </p>
                <p className="mt-2 flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-success" /> {d.drop}
                </p>
                <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="size-3.5" /> Expected {d.expected}
                </p>
                <Link
                  to="/driver/deliveries/$deliveryId"
                  params={{ deliveryId: d.id }}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Navigation className="size-3.5" /> Open delivery
                </Link>
              </GlassPanel>
            </motion.div>
          );
        })}
      </div>
    </Page>
  );
}
