import { motion } from "motion/react";
import {
  CalendarClock,
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
  type DeliveryStatus,
} from "@/data/fleet";
import { cn } from "@/lib/utils";

const getRouteProgress = (status: DeliveryStatus): { percent: number; label: string } => {
  switch (status) {
    case "unassigned":
      return { percent: 8, label: "Awaiting Assignment · Pickup Point" };
    case "assigned":
      return { percent: 18, label: "Driver Assigned · Preparing at Pickup" };
    case "in-transit":
      return { percent: 64, label: "In Transit · Moving to Drop Location" };
    case "completed":
      return { percent: 100, label: "Delivered · Drop Completed" };
    case "paused":
      return { percent: 50, label: "Trip Paused En Route" };
    case "cancelled":
      return { percent: 8, label: "Delivery Cancelled" };
    default:
      return { percent: 25, label: "En Route" };
  }
};

/** Redesigned Delivery details: clean summary panel, structured package list, interactive route indicator. */
export function DeliveryDetails({ delivery }: { delivery: Delivery }) {
  const meta = statusMeta[delivery.status];
  const driver = drivers.find((d) => d.name === delivery.driver);
  const routeState = getRouteProgress(delivery.status);

  const lastDone = trackingSteps.reduce((acc, s, i) => (s.done ? i : acc), -1);
  const activeIndex = Math.min(lastDone + 1, trackingSteps.length - 1);

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      {/* ── 1. Delivery summary sidebar ─────────────────────────────── */}
      <GlassPanel className="flex flex-col justify-between gap-6 p-7 h-full" hoverable={false}>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Delivery summary
              </p>
              <StatusPill tone={meta.tone as Tone} pulse={delivery.status === "in-transit"}>
                {meta.label}
              </StatusPill>
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-primary">{delivery.id}</h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {deliveryPackage.category} Shipment
            </p>
          </div>

          <div className="h-px bg-border/60" />

          {/* Structured summary information */}
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-2 py-0.5">
              <span className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <CalendarClock className="size-4 text-primary shrink-0" />
                Deliver before
              </span>
              <span className="font-semibold text-foreground truncate">{delivery.expected}</span>
            </div>
            <div className="flex items-center justify-between gap-2 py-0.5">
              <span className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <Clock className="size-4 text-primary shrink-0" />
                Created on
              </span>
              <span className="font-medium text-foreground truncate">{delivery.createdOn}</span>
            </div>
            <div className="flex items-center justify-between gap-2 py-0.5">
              <span className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <User className="size-4 text-primary shrink-0" />
                Fleet manager
              </span>
              <span className="font-medium text-foreground truncate">{delivery.manager}</span>
            </div>
          </div>

          <div className="h-px bg-border/60" />

          {/* Driver & Vehicle Details */}
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Driver & Vehicle
            </p>
            <div className="flex items-center gap-3.5">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/14 text-primary font-semibold">
                <User className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-foreground">{delivery.driver}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  {driver && driver.trips > 0 && driver.rating > 0 ? (
                    <>
                      <Star className="size-3.5 text-warning fill-warning" /> {driver.rating.toFixed(1)} rating
                    </>
                  ) : (
                    <span>New Driver (0 trips)</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground pt-1.5">
              <Truck className="size-4 text-primary shrink-0" />
              <span className="truncate font-medium text-foreground text-sm">{driver?.vehicle || "Not assigned"}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="h-px bg-border/60 mb-6" />

          {/* Quick Actions */}
          <div className="space-y-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Quick actions
            </p>
            <div className="flex flex-col gap-4 pt-1">
              <MagneticButton
                variant="primary"
                className="w-full justify-center py-3.5 text-sm"
                icon={<MapPin className="size-4" />}
              >
                Track on Map
              </MagneticButton>
              <MagneticButton className="w-full justify-center py-3.5 text-sm" icon={<Download className="size-4" />}>
                Download Report
              </MagneticButton>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* ── Package Information (Structured list, no inner cards) ── */}
        <GlassPanel title="Package Information" subtitle="Cargo specifications & handling guidelines" hoverable={false}>
          <div className="divide-y divide-border/60">
            {[
              { icon: Package, label: "Category", value: deliveryPackage.category },
              { icon: Scale, label: "Weight", value: deliveryPackage.weight },
              { icon: Ruler, label: "Size", value: deliveryPackage.size },
              { icon: Info, label: "Instructions", value: deliveryPackage.instructions },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-4 py-3.5 first:pt-1 last:pb-1">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                  <row.icon className="size-4" />
                </span>
                <div className="flex flex-1 items-center justify-between min-w-0 gap-4">
                  <span className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                    {row.label}
                  </span>
                  <span className="text-sm font-semibold text-foreground text-right truncate">
                    {row.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* ── Locations section with Interactive Route Indicator ── */}
        <GlassPanel title="Locations & Route" subtitle={routeState.label} hoverable={false}>
          <div className="space-y-6">
            {/* Interactive Visual Route Track */}
            <div className="relative pt-3 pb-8 px-4">
              <div className="relative h-2.5 w-full rounded-full bg-surface-2/80 border border-border/60 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${routeState.percent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-[image:var(--gradient-primary)] rounded-full"
                />
              </div>

              {/* Dynamic Animated Truck Icon Marker */}
              <motion.div
                initial={{ left: "0%" }}
                animate={{ left: `${routeState.percent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute top-0 -translate-x-1/2 z-20 flex flex-col items-center"
              >
                <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)] border border-primary-foreground/20">
                  <Truck className="size-4" />
                </span>
                <span className="mt-1 flex items-center gap-1 rounded-full bg-surface/90 px-2 py-0.5 text-[10px] font-bold text-primary border border-border/80 backdrop-blur-md shadow-sm whitespace-nowrap">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                  </span>
                  {routeState.percent}%
                </span>
              </motion.div>
            </div>

            {/* Pickup & Drop Details Side-by-Side */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-surface-2/20 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                  <Package className="size-4" /> Pickup Location
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">{delivery.pickup}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Scheduled pickup & loading</p>
              </div>

              <div className="rounded-xl border border-border/60 bg-surface-2/20 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-success">
                  <MapPin className="size-4" /> Drop Location
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">{delivery.drop}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Final destination & unloading</p>
              </div>
            </div>
          </div>
        </GlassPanel>

        {/* ── Delivery progress ───────────────────────────────────── */}
        <GlassPanel title="Delivery progress" subtitle="Completed, active and upcoming stages">
          <div className="relative overflow-x-auto pb-1">
            <div className="flex min-w-[640px] items-start">
              {trackingSteps.map((step, i) => {
                const done = step.done;
                const active = i === activeIndex && !done;
                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="relative flex flex-1 flex-col items-center px-1 text-center"
                  >
                    {i > 0 && (
                      <span
                        className={cn(
                          "absolute left-0 top-[15px] h-0.5 w-1/2 -translate-x-1/2",
                          done ? "bg-primary" : "bg-border",
                        )}
                      />
                    )}
                    {i < trackingSteps.length - 1 && (
                      <span
                        className={cn(
                          "absolute right-0 top-[15px] h-0.5 w-1/2 translate-x-1/2",
                          trackingSteps[i + 1]?.done ? "bg-primary" : "bg-border",
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "relative z-10 grid size-8 place-items-center rounded-full border",
                        done && "border-primary bg-primary text-primary-foreground",
                        active &&
                          "border-primary/60 bg-primary/15 text-primary shadow-[var(--shadow-glow)]",
                        !done && !active && "border-border bg-surface text-muted-foreground",
                      )}
                    >
                      {done ? (
                        <CheckCircle2 className="size-4" />
                      ) : active ? (
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />
                          <span className="relative inline-flex size-2 rounded-full bg-current" />
                        </span>
                      ) : (
                        <span className="size-1.5 rounded-full bg-current" />
                      )}
                    </span>
                    <p
                      className={cn(
                        "mt-2 text-xs font-medium",
                        !done && !active && "text-muted-foreground",
                        active && "text-primary",
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{step.time}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </GlassPanel>

        {/* ── Fleet manager updates ───────────────────────────────── */}
        <GlassPanel title="Fleet manager updates" subtitle={`Latest notes from ${delivery.manager}`}>
          <div className="grid gap-3 md:grid-cols-2">
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
                  <p className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
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
