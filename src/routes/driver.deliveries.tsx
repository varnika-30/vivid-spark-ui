import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CheckCircle2, MapPin, Navigation } from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatusPill, type Tone } from "@/components/fx/status-pill";
import { MagneticButton } from "@/components/fx/magnetic-button";
import { deliveries, statusMeta } from "@/data/fleet";

export const Route = createFileRoute("/driver/deliveries")({
  head: () => ({
    meta: [
      { title: "My Deliveries — Fleetline" },
      { name: "description", content: "Today's assigned deliveries with pickup, drop and payment details." },
      { property: "og:title", content: "My Deliveries — Fleetline" },
      { property: "og:description", content: "Your assigned stops for the day." },
    ],
  }),
  component: DriverDeliveries,
});

function DriverDeliveries() {
  return (
    <Page title="List of Deliveries" description="Everything assigned to you today, in route order.">
      <div className="grid gap-4 lg:grid-cols-2">
        {deliveries.slice(0, 4).map((d, i) => {
          const meta = statusMeta[d.status];
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 240, damping: 24 }}
            >
              <GlassPanel
                title={d.id}
                subtitle={`${d.createdOn} · ₹${d.amount.toLocaleString()} · ${d.method}`}
                actions={
                  <StatusPill tone={meta.tone as Tone} pulse={d.status === "in-transit"}>
                    {meta.label}
                  </StatusPill>
                }
              >
                <div className="space-y-2 text-sm">
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" /> {d.pickup}
                  </p>
                  <p className="flex items-start gap-2">
                    <Navigation className="mt-0.5 size-4 shrink-0 text-success" /> {d.drop}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <MagneticButton variant="primary" strength={0.15} className="px-4 py-2 text-xs" icon={<Navigation className="size-3.5" />}>
                    Navigate
                  </MagneticButton>
                  <MagneticButton variant="glass" strength={0.15} className="px-4 py-2 text-xs" icon={<CheckCircle2 className="size-3.5" />}>
                    Mark delivered
                  </MagneticButton>
                </div>
              </GlassPanel>
            </motion.div>
          );
        })}
      </div>
    </Page>
  );
}
