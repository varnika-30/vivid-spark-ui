import { motion } from "motion/react";
import {
  CheckCircle2,
  Clock,
  Download,
  Info,
  MapPin,
  Package,
  Ruler,
  Scale,
  Star,
  Truck,
  User,
} from "lucide-react";
import { GlassPanel } from "@/components/fx/glass-panel";
import { MagneticButton } from "@/components/fx/magnetic-button";
import { StatusPill, type Tone } from "@/components/fx/status-pill";
import {
  deliveryActivity,
  deliveryPackage,
  drivers,
  statusMeta,
  trackingSteps,
  type Delivery,
} from "@/data/fleet";

/** Wireframe delivery-details layout: summary rail + locations, package, progress, updates. */
export function DeliveryDetails({ delivery }: { delivery: Delivery }) {
  const meta = statusMeta[delivery.status];
  const driver = drivers.find((d) => d.name === delivery.driver);

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <GlassPanel className="flex flex-col gap-6" hoverable={false}>
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Delivery summary
          </p>
          <div className="mt-3">
            <StatusPill tone={meta.tone as Tone} pulse={delivery.status === "in-transit"}>
              {meta.label}
            </StatusPill>
          </div>
          <h2 className="mt-3 text-lg font-semibold text-primary">{delivery.id}</h2>
          <p className="text-sm text-muted-foreground">{deliveryPackage.category} shipment</p>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Deliver before
            </p>
            <p className="mt-0.5">{delivery.expected}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Created on
            </p>
            <p className="mt-0.5">{delivery.createdOn}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Fleet manager
            </p>
            <p className="mt-0.5">{delivery.manager}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface-2/30 p-4">
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Driver</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-primary/12 text-primary">
              <User className="size-5" />
            </span>
            <div>
              <p className="text-sm font-medium">{delivery.driver}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="size-3 text-warning" /> {(driver?.rating ?? 4.8).toFixed(1)}
              </p>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="size-3.5" /> {driver?.vehicle ?? "Tata Ace EV"}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Quick actions
          </p>
          <MagneticButton
            variant="primary"
            className="w-full justify-center"
            icon={<MapPin className="size-4" />}
          >
            Track on Map
          </MagneticButton>
          <MagneticButton className="w-full justify-center" icon={<Download className="size-4" />}>
            Download Report
          </MagneticButton>
        </div>
      </GlassPanel>

      <div className="space-y-4">
        <GlassPanel title="Locations" subtitle="Pickup and drop points">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface-2/25 p-4">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Package className="size-3.5 text-primary" /> Pickup
              </p>
              <p className="mt-2 text-sm font-medium">{delivery.pickup}</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-2/25 p-4">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="size-3.5 text-success" /> Drop
              </p>
              <p className="mt-2 text-sm font-medium">{delivery.drop}</p>
            </div>
          </div>
        </GlassPanel>

        <div className="grid gap-4 lg:grid-cols-2">
          <GlassPanel title="Package information">
            <dl className="space-y-3 text-sm">
              {[
                { icon: Package, label: "Category", value: deliveryPackage.category },
                { icon: Scale, label: "Weight", value: deliveryPackage.weight },
                { icon: Ruler, label: "Size", value: deliveryPackage.size },
                { icon: Info, label: "Special instructions", value: deliveryPackage.instructions },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/12 text-primary">
                    <row.icon className="size-4" />
                  </span>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd className="text-sm">{row.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </GlassPanel>

          <GlassPanel title="Delivery progress">
            <div className="relative space-y-4 pl-6">
              <span className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-border" />
              {trackingSteps.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
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
          </GlassPanel>
        </div>

        <GlassPanel title="Fleet manager updates" subtitle={`Latest notes from ${delivery.manager}`}>
          <div className="space-y-3">
            {deliveryActivity.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border/70 bg-surface-2/25 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" /> {a.time}
                  </p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{a.body}</p>
              </motion.div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
