import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, PackageSearch, Plus } from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatCard } from "@/components/fx/stat-card";
import { StatusPill, type Tone } from "@/components/fx/status-pill";
import { AnimatedSearch, FilterChips } from "@/components/fx/controls";
import { MagneticButton } from "@/components/fx/magnetic-button";
import { clientStats, deliveries, statusMeta, type DeliveryStatus } from "@/data/fleet";
import { DataPagination } from "@/components/common/data-pagination";

type Filter = "all" | DeliveryStatus;

const filters: readonly { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unassigned", label: "Unassigned" },
  { value: "assigned", label: "Assigned to driver" },
  { value: "in-transit", label: "In Transit" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "paused", label: "Paused" },
];

export function ClientTrackPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Filter>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [query, status]);

  const rows = deliveries.filter((d) => {
    const matchesQuery = (d.id + d.drop + d.manager).toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === "all" || d.status === status);
  });

  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const paginatedRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const options = filters.map((f) => ({
    ...f,
    count: f.value === "all" ? deliveries.length : deliveries.filter((d) => d.status === f.value).length,
  }));

  return (
    <Page
      title="Track"
      description="Every shipment you have with Fleetline, live."
      actions={
        <Link to="/client/create">
          <MagneticButton variant="primary" icon={<Plus className="size-4" />} float>
            Create New
          </MagneticButton>
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {clientStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} />
        ))}
      </div>

      <div className="mt-6 flex flex-nowrap items-center justify-between gap-3 w-full">
        <AnimatedSearch
          value={query}
          onChange={setQuery}
          placeholder="Search delivery ID, destination or fleet manager…"
          className="w-48 sm:w-56 shrink-0"
        />
        <FilterChips options={options} value={status} onChange={setStatus} layoutId="client-track-filter" className="flex-1 min-w-0" />
      </div>

      <GlassPanel className="mt-4 p-0" hoverable={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-4 font-medium">ID</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Created On</th>
                <th className="px-5 py-4 font-medium">Fleet Manager</th>
                <th className="px-5 py-4 font-medium">Concern</th>
                <th className="px-5 py-4 font-medium">Expected Delivery</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {paginatedRows.map((d, i) => {
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
                        navigate({ to: "/client/deliveries/$deliveryId", params: { deliveryId: d.id } })
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

        <DataPagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={rows.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />

        {rows.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <motion.span
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="grid size-14 place-items-center rounded-2xl bg-primary/12 text-primary"
            >
              <PackageSearch className="size-6" />
            </motion.span>
            <p className="text-sm font-medium">No shipments found</p>
          </div>
        )}
      </GlassPanel>
    </Page>
  );
}
