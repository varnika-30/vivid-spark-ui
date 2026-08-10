import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpDown, Phone, UserPlus } from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
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
        content: "Browse fleet drivers, availability, scores and vehicle assignments in one board.",
      },
      { property: "og:title", content: "Drivers — Fleetline" },
      { property: "og:description", content: "Driver roster with live availability and scores." },
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
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusFilters)[number]["value"]>("all");
  const [sortDesc, setSortDesc] = useState(true);

  const rows = useMemo(() => {
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
      </div>

      <GlassPanel className="mt-4 p-0" hoverable={false}>
        {loading ? (
          <div className="p-4">
            <LoadingRows rows={5} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="px-5 py-4 font-medium">Driver</th>
                  <th className="px-5 py-4 font-medium">Vehicle</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Availability</th>
                  <th className="px-5 py-4 font-medium">
                    <button
                      onClick={() => setSortDesc((s) => !s)}
                      className="inline-flex items-center gap-1.5 hover:text-foreground"
                    >
                      Score
                      <motion.span animate={{ rotate: sortDesc ? 0 : 180 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                        <ArrowUpDown className="size-3.5" />
                      </motion.span>
                    </button>
                  </th>
                  <th className="px-5 py-4 text-right font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {rows.map((d, i) => (
                    <motion.tr
                      key={d.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: i * 0.05, type: "spring", stiffness: 250, damping: 26 }}
                      className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className="grid size-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-xs font-semibold text-primary-foreground"
                          >
                            {d.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </motion.span>
                          <div>
                            <p className="font-medium">{d.name}</p>
                            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Phone className="size-3" /> {d.phone}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{d.vehicle}</td>
                      <td className="px-5 py-4">
                        <StatusPill tone={statusTone[d.status]} pulse={d.status === "on-trip"}>
                          {d.status.replace("-", " ")}
                        </StatusPill>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${d.availability}%` }}
                              transition={{ duration: 0.8, delay: 0.15 + i * 0.05 }}
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
                          <span className="text-xs text-muted-foreground">{d.availability}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-display text-base font-semibold">{d.score}</td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          to="/manager/drivers/$driverId"
                          params={{ driverId: d.id }}
                          className="inline-flex rounded-lg border border-border px-3 py-1.5 text-xs transition-colors hover:border-primary/50 hover:text-primary"
                        >
                          View profile
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>
    </Page>
  );
}
