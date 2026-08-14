import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, PackageSearch } from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatusPill, type Tone } from "@/components/fx/status-pill";
import { AnimatedSearch, FilterChips } from "@/components/fx/controls";
import { deliveries, statusMeta, type DeliveryStatus } from "@/data/fleet";

export const Route = createFileRoute("/manager/deliveries/")({
  head: () => ({
    meta: [
      { title: "Live Deliveries — Fleetline" },
      { name: "description", content: "Monitor every live delivery: status, driver, concerns and expected arrival." },
      { property: "og:title", content: "Live Deliveries — Fleetline" },
      { property: "og:description", content: "Operational board for every delivery in the fleet." },
    ],
  }),
  component: ManagerDeliveries,
});

type Filter = "all" | DeliveryStatus;

const filters: readonly { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unassigned", label: "Unassigned" },
  { value: "assigned", label: "Assigned" },
  { value: "in-transit", label: "In Transit" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "paused", label: "Paused" },
];

function ManagerDeliveries() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Filter>("all");

  const rows = deliveries.filter((d) => {
    const q = (d.id + d.driver + d.drop + d.manager).toLowerCase().includes(query.toLowerCase());
    return q && (status === "all" || d.status === status);
  });

  const options = filters.map((f) => ({
    ...f,
    count: f.value === "all" ? deliveries.length : deliveries.filter((d) => d.status === f.value).length,
  }));

  return (
    <Page title="Deliveries" description="Every active and historic delivery across the fleet.">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <AnimatedSearch value={query} onChange={setQuery} placeholder="Search delivery, driver or manager…" />
        <FilterChips options={options} value={status} onChange={setStatus} layoutId="manager-delivery-filter" />
      </div>

      <GlassPanel className="mt-4 p-0" hoverable={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-4 font-medium">ID</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Created On</th>
                <th className="px-5 py-4 font-medium">Driver</th>
                <th className="px-5 py-4 font-medium">Fleet Manager</th>
                <th className="px-5 py-4 font-medium">Concern</th>
                <th className="px-5 py-4 font-medium">Expected Delivery</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {rows.map((d, i) => {
                  const meta = statusMeta[d.status];
                  return (
                    <motion.tr
                      key={d.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() =>
                        navigate({ to: "/manager/deliveries/$deliveryId", params: { deliveryId: d.id } })
                      }
                      className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2/50"
                    >
                      <td className="px-5 py-4 font-medium text-primary">{d.id}</td>
                      <td className="px-5 py-4">
                        <StatusPill tone={meta.tone as Tone} pulse={d.status === "in-transit"}>
                          {meta.label}
                        </StatusPill>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{d.createdOn}</td>
                      <td className="px-5 py-4">{d.driver}</td>
                      <td className="px-5 py-4">{d.manager}</td>
                      <td className="px-5 py-4">
                        {d.concern ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-warning">
                            <AlertTriangle className="size-3.5" /> Raised
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{d.expected}</td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-primary/12 text-primary">
              <PackageSearch className="size-6" />
            </span>
            <p className="text-sm font-medium">No deliveries found</p>
          </div>
        )}
      </GlassPanel>
    </Page>
  );
}
