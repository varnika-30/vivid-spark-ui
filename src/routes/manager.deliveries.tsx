import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ChevronDown, PackageSearch, Plus } from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatusPill, type Tone } from "@/components/fx/status-pill";
import { MagneticButton } from "@/components/fx/magnetic-button";
import { AnimatedSearch, FilterChips } from "@/components/fx/controls";
import { deliveries, statusMeta, type DeliveryStatus } from "@/data/fleet";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/manager/deliveries")({
  head: () => ({
    meta: [
      { title: "List of Deliveries — Fleetline" },
      {
        name: "description",
        content: "Live board of every delivery: status, assigned driver, payment and expected time.",
      },
      { property: "og:title", content: "List of Deliveries — Fleetline" },
      { property: "og:description", content: "Every active and completed delivery in one board." },
    ],
  }),
  component: DeliveriesPage,
});

const filters = [
  { value: "all", label: "All" },
  { value: "unassigned", label: "Unassigned" },
  { value: "assigned", label: "Assigned" },
  { value: "in-transit", label: "In transit" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "paused", label: "Paused" },
] as const;

function DeliveriesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");
  const [open, setOpen] = useState<(typeof deliveries)[number] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      deliveries.filter(
        (d) =>
          (filter === "all" || d.status === (filter as DeliveryStatus)) &&
          (d.id + d.driver + d.manager + d.pickup + d.drop)
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, filter],
  );

  return (
    <Page
      title="List of Deliveries"
      description="Every delivery in the network with live status, assignment and payment detail."
      actions={
        <MagneticButton variant="primary" icon={<Plus className="size-4" />}>
          New delivery
        </MagneticButton>
      }
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <AnimatedSearch value={query} onChange={setQuery} placeholder="Search delivery, driver or route…" />
        <FilterChips options={filters} value={filter} onChange={setFilter} layoutId="delivery-filter" />
      </div>

      <div className="mt-4 space-y-2">
        <AnimatePresence mode="popLayout">
          {rows.map((d, i) => {
            const meta = statusMeta[d.status];
            const isOpen = expanded === d.id;
            return (
              <motion.div
                key={d.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 260, damping: 28 }}
                whileHover={{ y: -2 }}
                className="overflow-hidden rounded-2xl glass transition-colors hover:border-primary/30"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : d.id)}
                  className="flex w-full flex-wrap items-center gap-4 p-4 text-left"
                >
                  <span className="font-medium text-primary">{d.id}</span>
                  <StatusPill tone={meta.tone as Tone} pulse={d.status === "in-transit"}>
                    {meta.label}
                  </StatusPill>
                  {d.concern && (
                    <StatusPill tone="destructive">
                      <AlertCircle className="size-3" /> Concern
                    </StatusPill>
                  )}
                  <span className="hidden text-sm text-muted-foreground md:inline">
                    {d.pickup} → {d.drop}
                  </span>
                  <span className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="hidden sm:inline">{d.driver}</span>
                    <span>{d.expected}</span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
                      <ChevronDown className="size-4" />
                    </motion.span>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-4">
                        {[
                          { label: "Created on", value: d.createdOn },
                          { label: "Fleet manager", value: d.manager },
                          { label: "Payment", value: `₹${d.amount.toLocaleString()} · ${d.method}` },
                          { label: "Expected delivery", value: d.expected },
                        ].map((item) => (
                          <div key={item.label}>
                            <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                              {item.label}
                            </p>
                            <p className="mt-1 text-sm">{item.value}</p>
                          </div>
                        ))}
                        <div className="sm:col-span-4">
                          <MagneticButton
                            variant="glass"
                            strength={0.15}
                            className="px-4 py-2 text-xs"
                            onClick={() => setOpen(d)}
                          >
                            Open delivery details
                          </MagneticButton>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {rows.length === 0 && (
        <GlassPanel className="mt-4 flex flex-col items-center gap-3 py-16 text-center" hoverable={false}>
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="grid size-14 place-items-center rounded-2xl bg-primary/12 text-primary"
          >
            <PackageSearch className="size-6" />
          </motion.span>
          <p className="text-sm font-medium">Nothing here yet</p>
          <p className="max-w-sm text-xs text-muted-foreground">
            No deliveries match this filter. Try a different status or clear the search.
          </p>
        </GlassPanel>
      )}

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="w-full glass-strong sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{open?.id}</SheetTitle>
            <SheetDescription>
              {open?.pickup} → {open?.drop}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-3 px-4 pb-6">
            {[
              { label: "Status", value: open ? statusMeta[open.status].label : "" },
              { label: "Driver", value: open?.driver ?? "" },
              { label: "Fleet manager", value: open?.manager ?? "" },
              { label: "Created on", value: open?.createdOn ?? "" },
              { label: "Expected", value: open?.expected ?? "" },
              { label: "Amount", value: open ? `₹${open.amount.toLocaleString()}` : "" },
              { label: "Payment method", value: open?.method ?? "" },
            ].map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between rounded-xl border border-border p-3 text-sm"
              >
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium">{row.value}</span>
              </motion.div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </Page>
  );
}
