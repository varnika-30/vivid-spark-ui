import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Navigation, Radio, ShieldAlert } from "lucide-react";
import { Page } from "@/components/fx/page";
import { DeliveryDetails } from "@/components/fx/delivery-details";
import type { Delivery } from "@/data/fleet";
import { RaiseConcernModal } from "@/components/driver/raise-concern-modal";
import { StatusPill } from "@/components/fx/status-pill";
import { GlassPanel } from "@/components/fx/glass-panel";

export function DriverDeliveryDetailPage({ delivery }: { delivery: Delivery }) {
  const [isConcernModalOpen, setIsConcernModalOpen] = useState(false);

  // Driver Confirmation local status stage state
  // 1: Reached Pickup (Auto), 2: Package Picked Up (Human), 3: In Transit (Auto), 4: Reached Destination (Auto), 5: Delivery Completed (Human)
  const [stage, setStage] = useState<number>(delivery.status === "completed" ? 5 : delivery.status === "in-transit" ? 3 : 2);

  return (
    <Page
      title="Delivery Details"
      description={`${delivery.id} · ${delivery.pickup} → ${delivery.drop}`}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsConcernModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 cursor-pointer"
          >
            <ShieldAlert className="size-4" /> Raise a Concern
          </button>
          <Link
            to="/driver/deliveries"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3.5 py-2 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to my deliveries
          </Link>
        </div>
      }
    >
      {/* DRIVER CONFIRMATION & SYSTEM DETECTION BAR */}
      <GlassPanel className="mb-4" title="Delivery Tracking & Stage Confirmation" subtitle="Automated geofence tracking & driver confirmation checkpoints" hoverable={false}>
        <div className="space-y-3">
          <div className="grid gap-2.5 sm:grid-cols-5 text-xs">
            {/* Stage 1: Reached Pickup (Auto) */}
            <div className={`p-3 rounded-xl border ${stage >= 1 ? "border-primary/40 bg-primary/10" : "border-border bg-surface/40"} space-y-1`}>
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-muted-foreground">
                <span className="flex items-center gap-1 text-primary"><Radio className="size-3 animate-pulse" /> Auto Geofence</span>
                <span>Stage 1</span>
              </div>
              <span className="font-bold text-foreground block">Reached Pickup</span>
              <span className="text-[10px] text-muted-foreground block">Auto-detected at 08:42 AM</span>
            </div>

            {/* Stage 2: Package Picked Up (Human Confirmation) */}
            <div className={`p-3 rounded-xl border ${stage >= 2 ? "border-primary/40 bg-primary/10" : "border-border bg-surface/40"} space-y-1`}>
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-muted-foreground">
                <span className="text-amber-400 font-semibold">✋ Driver Action</span>
                <span>Stage 2</span>
              </div>
              <span className="font-bold text-foreground block">Package Picked Up</span>
              {stage >= 2 ? (
                <span className="text-[10px] text-success font-semibold flex items-center gap-1"><CheckCircle2 className="size-3" /> Confirmed</span>
              ) : (
                <button
                  onClick={() => setStage(2)}
                  className="mt-1 px-2 py-1 rounded bg-primary text-[10px] font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Confirm Pickup
                </button>
              )}
            </div>

            {/* Stage 3: In Transit (Auto) */}
            <div className={`p-3 rounded-xl border ${stage >= 3 ? "border-primary/40 bg-primary/10" : "border-border bg-surface/40"} space-y-1`}>
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-muted-foreground">
                <span className="flex items-center gap-1 text-primary"><Radio className="size-3 animate-pulse" /> Auto Telematics</span>
                <span>Stage 3</span>
              </div>
              <span className="font-bold text-foreground block">In Transit</span>
              <span className="text-[10px] text-muted-foreground block">GPS tracking active</span>
            </div>

            {/* Stage 4: Reached Destination (Auto) */}
            <div className={`p-3 rounded-xl border ${stage >= 4 ? "border-primary/40 bg-primary/10" : "border-border bg-surface/40"} space-y-1`}>
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-muted-foreground">
                <span className="flex items-center gap-1 text-primary"><Radio className="size-3 animate-pulse" /> Auto Geofence</span>
                <span>Stage 4</span>
              </div>
              <span className="font-bold text-foreground block">Reached Destination</span>
              <span className="text-[10px] text-muted-foreground block">Auto-detected upon arrival</span>
            </div>

            {/* Stage 5: Delivery Completed (Human Confirmation) */}
            <div className={`p-3 rounded-xl border ${stage >= 5 ? "border-success/40 bg-success/10" : "border-border bg-surface/40"} space-y-1`}>
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-muted-foreground">
                <span className="text-amber-400 font-semibold">✋ Driver Action</span>
                <span>Stage 5</span>
              </div>
              <span className="font-bold text-foreground block">Delivery Completed</span>
              {stage >= 5 ? (
                <span className="text-[10px] text-success font-semibold flex items-center gap-1"><CheckCircle2 className="size-3" /> Completed</span>
              ) : (
                <button
                  onClick={() => setStage(5)}
                  className="mt-1 px-2 py-1 rounded bg-success text-[10px] font-bold text-success-foreground hover:bg-success/90 cursor-pointer"
                >
                  Complete Handover
                </button>
              )}
            </div>
          </div>
        </div>
      </GlassPanel>

      <DeliveryDetails delivery={delivery} />

      <RaiseConcernModal
        isOpen={isConcernModalOpen}
        onClose={() => setIsConcernModalOpen(false)}
        initialDeliveryId={delivery.id}
      />
    </Page>
  );
}
