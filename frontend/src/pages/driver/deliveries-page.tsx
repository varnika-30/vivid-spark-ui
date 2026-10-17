import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Clock, MapPin, Navigation, Package, ShieldAlert } from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatusPill, type Tone } from "@/components/fx/status-pill";
import { deliveries, statusMeta } from "@/data/fleet";
import { RaiseConcernModal } from "@/components/driver/raise-concern-modal";
import { DataPagination } from "@/components/common/data-pagination";

export function DriverDeliveriesPage() {
  const [isConcernModalOpen, setIsConcernModalOpen] = useState(false);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState("DEL-2026-0816");
  const [page, setPage] = useState(1);

  const tasks = deliveries.filter((d) => d.status !== "cancelled");
  const PAGE_SIZE = 6;
  const totalPages = Math.ceil(tasks.length / PAGE_SIZE);
  const paginatedTasks = tasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Page
      title="My Deliveries"
      description="Everything assigned to you today, in order of pickup."
      actions={
        <button
          onClick={() => setIsConcernModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
        >
          <ShieldAlert className="size-4" /> Raise a Concern
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {paginatedTasks.map((d, i) => {
          const meta = statusMeta[d.status];
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 240, damping: 26 }}
            >
              <GlassPanel className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-primary">{d.id}</span>
                    <StatusPill tone={meta.tone as Tone} pulse={d.status === "in-transit"}>
                      {meta.label}
                    </StatusPill>
                  </div>
                  <p className="mt-3 flex items-start gap-2 text-sm">
                    <Package className="mt-0.5 size-4 shrink-0 text-primary" /> {d.pickup}
                  </p>
                  <p className="mt-2 flex items-start gap-2 text-sm">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-success" /> {d.drop}
                  </p>
                  <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="size-3.5" /> Expected {d.expected}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Link
                    to="/driver/deliveries/$deliveryId"
                    params={{ deliveryId: d.id }}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-xs transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <Navigation className="size-3.5" /> Open delivery
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedDeliveryId(d.id);
                      setIsConcernModalOpen(true);
                    }}
                    className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 cursor-pointer"
                    title="Raise a Concern"
                  >
                    <ShieldAlert className="size-3.5" />
                  </button>
                </div>
              </GlassPanel>
            </motion.div>
          );
        })}
      </div>

      <DataPagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={tasks.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        className="mt-4 rounded-2xl border border-border/80"
      />

      <RaiseConcernModal
        isOpen={isConcernModalOpen}
        onClose={() => setIsConcernModalOpen(false)}
        initialDeliveryId={selectedDeliveryId}
      />
    </Page>
  );
}
