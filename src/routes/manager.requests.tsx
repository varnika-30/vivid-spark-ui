import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Filter, Sparkles, Star, Zap } from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatCard } from "@/components/fx/stat-card";
import { StatusPill, type Tone } from "@/components/fx/status-pill";
import { MagneticButton } from "@/components/fx/magnetic-button";
import { AnimatedSearch, FilterChips } from "@/components/fx/controls";
import { aiRecommendations, requests, type DeliveryRequest } from "@/data/fleet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/manager/requests")({
  head: () => ({
    meta: [
      { title: "Requested Deliveries — Fleetline" },
      {
        name: "description",
        content:
          "Review incoming delivery requests and assign the most suitable driver with AI recommendations.",
      },
      { property: "og:title", content: "Requested Deliveries — Fleetline" },
      {
        property: "og:description",
        content: "Assign incoming delivery requests to the best-matched driver in seconds.",
      },
    ],
  }),
  component: RequestsPage,
});

const filters = [
  { value: "all", label: "All Requests" },
  { value: "Pending", label: "Pending Assignment" },
  { value: "Assigned", label: "Assigned" },
  { value: "Review", label: "High Priority" },
] as const;

const priorityTone: Record<DeliveryRequest["priority"], Tone> = {
  High: "destructive",
  Medium: "warning",
  Low: "muted",
};

function RequestsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");
  const [selected, setSelected] = useState<DeliveryRequest | null>(null);

  const rows = useMemo(
    () =>
      requests.filter(
        (r) =>
          (filter === "all" || r.status === filter) &&
          (r.id + r.client + r.pickup + r.drop + r.package)
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, filter],
  );

  return (
    <Page
      title="Requested Deliveries"
      description="Review incoming delivery requests and assign the most suitable driver."
      actions={
        <MagneticButton variant="primary" icon={<Sparkles className="size-4" />}>
          Auto-assign with AI
        </MagneticButton>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Requests" value="56" delta="+12" sub="from yesterday" />
        <StatCard label="Pending Assignment" value="42" delta="75%" sub="of total" />
        <StatCard label="High Priority" value="7" delta="-2" trend="down" sub="requires action" />
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
        <AnimatedSearch value={query} onChange={setQuery} placeholder="Search request, client, route…" />
        <FilterChips options={filters} value={filter} onChange={setFilter} layoutId="request-filter" />
      </div>

      <GlassPanel className="mt-4 p-0" hoverable={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {["Request ID", "Client", "Pickup", "Drop", "Package", "Priority", "Preferred Date", "Status", ""].map(
                  (h) => (
                    <th key={h} className="whitespace-nowrap px-5 py-4 font-medium">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {rows.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.04, type: "spring", stiffness: 260, damping: 28 }}
                    className="group border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2/40"
                  >
                    <td className="px-5 py-4 font-medium text-primary">{r.id}</td>
                    <td className="px-5 py-4">{r.client}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{r.pickup}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{r.drop}</td>
                    <td className="px-5 py-4">{r.package}</td>
                    <td className="px-5 py-4">
                      <StatusPill tone={priorityTone[r.priority]}>{r.priority}</StatusPill>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                      {r.preferredDate}
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill tone={r.status === "Assigned" ? "success" : "info"}>
                        {r.status}
                      </StatusPill>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelected(r)}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                      >
                        Assign
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 px-6 py-16 text-center"
          >
            <motion.span
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="grid size-14 place-items-center rounded-2xl bg-primary/12 text-primary"
            >
              <Filter className="size-6" />
            </motion.span>
            <p className="text-sm font-medium">No requests match this view</p>
            <p className="max-w-sm text-xs text-muted-foreground">
              Try clearing the search or switching the filter to see the full request queue.
            </p>
          </motion.div>
        )}
      </GlassPanel>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl rounded-3xl glass-strong">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Assign {selected?.id}
              <StatusPill tone="primary" pulse>
                AI matched
              </StatusPill>
            </DialogTitle>
            <DialogDescription>
              {selected?.client} · {selected?.pickup} → {selected?.drop} · {selected?.weight}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {aiRecommendations.map((rec, i) => (
              <motion.div
                key={rec.driver}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i, type: "spring", stiffness: 240, damping: 24 }}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-border bg-surface/40 p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-sm font-semibold text-primary-foreground">
                      {rec.driver
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <div>
                      <p className="flex items-center gap-2 text-sm font-medium">
                        {rec.driver}
                        {rec.best && (
                          <StatusPill tone="success">
                            <Star className="size-3" /> Best match
                          </StatusPill>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{rec.match}% suitability</p>
                    </div>
                  </div>
                  <MagneticButton
                    variant={rec.best ? "primary" : "glass"}
                    strength={0.15}
                    className="px-4 py-2 text-xs"
                    icon={<Zap className="size-3.5" />}
                    onClick={() => {
                      toast.success(`Assigned to ${rec.driver}`, {
                        description: `${selected?.id} is now scheduled for pickup.`,
                      });
                      setSelected(null);
                    }}
                  >
                    Assign
                  </MagneticButton>
                </div>
                <ul className="mt-3 grid gap-1.5 sm:grid-cols-3">
                  {rec.reasons.map((reason) => (
                    <li key={reason} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="size-3.5 text-success" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
