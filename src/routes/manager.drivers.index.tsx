import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpDown, MapPin, Phone, Star, Truck, UserPlus, UserSearch } from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { TiltCard } from "@/components/fx/tilt-card";
import { StatusPill, type Tone } from "@/components/fx/status-pill";
import { MagneticButton } from "@/components/fx/magnetic-button";
import { AnimatedSearch, FilterChips } from "@/components/fx/controls";
import { LoadingRows } from "@/components/fx/skeletons";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { drivers, type Driver } from "@/data/fleet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/manager/drivers/")({
  head: () => ({
    meta: [
      { title: "Drivers — Fleetline" },
      {
        name: "description",
        content: "Browse fleet drivers as live cards: availability, safety score and vehicle assignment.",
      },
      { property: "og:title", content: "Drivers — Fleetline" },
      { property: "og:description", content: "Driver roster cards with live availability and scores." },
    ],
  }),
  component: DriversPage,
});

const statusFilters = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "on-trip", label: "On trip" },
  { value: "off-duty", label: "Off duty" },
] as const;

const statusTone: Record<Driver["status"], Tone> = {
  available: "success",
  "on-trip": "primary",
  "off-duty": "muted",
};

function DriversPage() {
  const loading = useSimulatedLoading(600);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusFilters)[number]["value"]>("all");
  const [sortDesc, setSortDesc] = useState(true);

  const cards = useMemo(() => {
    const filtered = drivers.filter(
      (d) =>
        (status === "all" || d.status === status) &&
        (d.name + d.city + d.id).toLowerCase().includes(query.toLowerCase()),
    );
    return [...filtered].sort((a, b) => (sortDesc ? b.score - a.score : a.score - b.score));
  }, [query, status, sortDesc]);

  return (
    <Page
      title="Drivers"
      description="Everyone on the road today, with live availability, safety scores and assignments."
      actions={
        <MagneticButton variant="primary" icon={<UserPlus className="size-4" />}>
          Add driver
        </MagneticButton>
      }
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <AnimatedSearch value={query} onChange={setQuery} placeholder="Search driver, city or ID…" />
        <FilterChips options={statusFilters} value={status} onChange={setStatus} layoutId="driver-filter" />
        <button
          onClick={() => setSortDesc((s) => !s)}
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-border px-3.5 py-2.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          Score
          <motion.span
            animate={{ rotate: sortDesc ? 0 : 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ArrowUpDown className="size-3.5" />
          </motion.span>
        </button>
      </div>

      {loading ? (
        <GlassPanel className="mt-4" hoverable={false}>
          <LoadingRows rows={5} />
        </GlassPanel>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {cards.map((d, i) => (
              <motion.div
                key={d.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 240, damping: 26 }}
              >
                <TiltCard className="h-full" intensity={5}>
                  <div
                    role="link"
                    tabIndex={0}
                    onClick={() =>
                      navigate({ to: "/manager/drivers/$driverId", params: { driverId: d.id } })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate({ to: "/manager/drivers/$driverId", params: { driverId: d.id } });
                      }
                    }}
                    className="flex h-full cursor-pointer flex-col p-5 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    <div className="flex items-start gap-3">
                      <motion.span
                        whileHover={{ scale: 1.06 }}
                        className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-sm font-semibold text-primary-foreground"
                      >
                        {d.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </motion.span>
                      <div className="min-w-0">
                        <p className="truncate font-display text-base font-semibold">{d.name}</p>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          {d.id}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <StatusPill tone={statusTone[d.status]} pulse={d.status === "on-trip"}>
                          {d.status.replace("-", " ")}
                        </StatusPill>
                      </div>
                    </div>

                    <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <Truck className="size-3.5 shrink-0 text-primary" /> {d.vehicle}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="size-3.5 shrink-0 text-primary" /> {d.city}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="size-3.5 shrink-0 text-primary" /> {d.phone}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-border/70 bg-surface-2/30 p-3 text-center">
                      <div>
                        <p className="font-display text-lg font-semibold">{d.score}</p>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                          Score
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center justify-center gap-1 font-display text-lg font-semibold">
                          {d.rating.toFixed(1)}
                          <Star className="size-3.5 text-warning" />
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                          Rating
                        </p>
                      </div>
                      <div>
                        <p className="font-display text-lg font-semibold">
                          {d.trips.toLocaleString()}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                          Trips
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Availability</span>
                        <span>{d.availability}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${d.availability}%` }}
                          transition={{ duration: 0.9, delay: 0.15 + i * 0.05, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full",
                            d.availability > 70
                              ? "bg-success"
                              : d.availability > 45
                                ? "bg-warning"
                                : "bg-destructive",
                          )}
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                      <MagneticButton
                        variant="primary"
                        strength={0.12}
                        className="flex-1 justify-center px-4 py-2 text-xs"
                        onClick={(e) => {
                          e?.stopPropagation?.();
                          navigate({
                            to: "/manager/drivers/$driverId",
                            params: { driverId: d.id },
                          });
                        }}
                      >
                        View profile
                      </MagneticButton>
                      <MagneticButton
                        variant="glass"
                        strength={0.12}
                        className="px-4 py-2 text-xs"
                        icon={<Phone className="size-3.5" />}
                        onClick={(e) => e?.stopPropagation?.()}
                      >
                        Call
                      </MagneticButton>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && cards.length === 0 && (
        <GlassPanel className="mt-4 flex flex-col items-center gap-3 py-16 text-center" hoverable={false}>
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="grid size-14 place-items-center rounded-2xl bg-primary/12 text-primary"
          >
            <UserSearch className="size-6" />
          </motion.span>
          <p className="text-sm font-medium">No drivers match this view</p>
        </GlassPanel>
      )}
    </Page>
  );
}
