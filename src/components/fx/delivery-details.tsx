import { motion } from "motion/react";
import {
  ArrowRight,
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
} from "@/data/fleet";
import { cn } from "@/lib/utils";

/** Delivery details: summary rail + locations, package, horizontal progress, updates. */
export function DeliveryDetails({ delivery }: { delivery: Delivery }) {
  const meta = statusMeta[delivery.status];
  const driver = drivers.find((d) => d.name === delivery.driver);

  const lastDone = trackingSteps.reduce((acc, s, i) => (s.done ? i : acc), -1);
  const activeIndex = Math.min(lastDone + 1, trackingSteps.length - 1);

  return (
    <div className="grid gap-4 lg:grid-cols-[290px_1fr]">
      {/* ── Delivery summary sidebar ─────────────────────────────── */}
      <GlassPanel className="flex flex-col gap-5" hoverable={false}>
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

        <div className="grid gap-2.5">
          {[
            { icon: CalendarClock, label: "Deliver before", value: delivery.expected },
            { icon: Clock, label: "Created on", value: delivery.createdOn },
            { icon: User, label: "Fleet manager", value: delivery.manager },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-start gap-3 rounded-xl border border-border/70 bg-surface-2/25 px-3 py-2.5"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/12 text-primary">
                <row.icon className="size-3.5" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {row.label}
                </p>
                <p className="truncate text-sm">{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-surface-2/30 p-4">
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Driver</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
              <User className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{delivery.driver}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="size-3 text-warning" /> {(driver?.rating ?? 4.8).toFixed(1)}
              </p>
            </div>
          </div>
          <div className="mt-3 border-t border-border/70 pt-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Vehicle</p>
            <p className="mt-1 flex items-center gap-2 text-sm">
              <Truck className="size-3.5 shrink-0 text-primary" />
              <span className="truncate">{driver?.vehicle ?? "Tata Ace EV"}</span>
            </p>
          </div>
        </div>

        <div className="mt-auto space-y-2">
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

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="space-y-4">
        <GlassPanel title="Locations" subtitle="Pickup and drop points">
          <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-2xl border border-border bg-surface-2/25 p-4">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Package className="size-3.5 text-primary" /> Pickup
              </p>
              <p className="mt-2 text-sm font-medium">{delivery.pickup}</p>
            </div>
            <div className="flex items-center justify-center gap-2 md:flex-col">
              <span className="h-px w-10 bg-gradient-to-r from-primary/60 to-success/60 md:h-10 md:w-px md:bg-gradient-to-b" />
              <span className="grid size-8 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/12 text-primary">
                <ArrowRight className="size-4 md:rotate-90" />
              </span>
              <span className="h-px w-10 bg-gradient-to-r from-primary/60 to-success/60 md:h-10 md:w-px md:bg-gradient-to-b" />
            </div>
            <div className="rounded-2xl border border-border bg-surface-2/25 p-4">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="size-3.5 text-success" /> Drop
              </p>
              <p className="mt-2 text-sm font-medium">{delivery.drop}</p>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel title="Package information">
          <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: Package, label: "Category", value: deliveryPackage.category },
              { icon: Scale, label: "Weight", value: deliveryPackage.weight },
              { icon: Ruler, label: "Size", value: deliveryPackage.size },
              { icon: Info, label: "Instructions", value: deliveryPackage.instructions },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-start gap-3 rounded-xl border border-border/70 bg-surface-2/25 p-3"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/12 text-primary">
                  <row.icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <dt className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {row.label}
                  </dt>
                  <dd className="text-sm">{row.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </GlassPanel>

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
