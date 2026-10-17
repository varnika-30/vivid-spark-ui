import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Info, MessageSquarePlus, ShieldAlert, X } from "lucide-react";
import {
  addConcern,
  type ConcernCategory,
  type ContextReason,
  type SystemDetectedEvent,
} from "@/data/concerns";
import { createConcern as apiCreateConcern } from "@/services/driver.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface RaiseConcernModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: ConcernCategory;
  initialDeliveryId?: string;
  initialTripId?: string;
  initialSystemEvent?: SystemDetectedEvent | undefined;
}

const concernCategories: { value: ConcernCategory; label: string; description: string }[] = [
  { value: "Package Issue", label: "Package Issue", description: "Damaged packaging, barcode scan problem, weight mismatch" },
  { value: "Pickup Issue", label: "Pickup Issue", description: "Gate access blocked, dock delay, warehouse loading issue" },
  { value: "Delivery Issue", label: "Delivery Issue", description: "Customer unavailable, address mismatch, access restriction" },
  { value: "Incorrect System Detection", label: "Incorrect System Detection", description: "Provide driver context for an automatically detected event" },
  { value: "Other", label: "Other", description: "General operational feedback or unexpected delay" },
];

const contextReasons: ContextReason[] = [
  "Detection was incorrect",
  "Sudden obstacle",
  "Traffic situation",
  "Road condition",
  "Emergency situation",
  "Other",
];

export function RaiseConcernModal({
  isOpen,
  onClose,
  initialCategory = "Package Issue",
  initialDeliveryId = "DEL-2026-0816",
  initialTripId = "TRP-8421",
  initialSystemEvent,
}: RaiseConcernModalProps) {
  const [category, setCategory] = useState<ConcernCategory>(initialCategory);
  const [deliveryId, setDeliveryId] = useState(initialDeliveryId);
  const [contextReason, setContextReason] = useState<ContextReason>("Sudden obstacle");
  const [description, setDescription] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const systemEvent = initialSystemEvent || (category === "Incorrect System Detection" ? {
    type: "Harsh Braking" as const,
    timestamp: "09:55 AM",
    location: "NH48 Express Corridor",
    details: "Harsh deceleration event detected (-0.45g)",
  } : undefined);

  const handleSubmit = async () => {
    const errors: Record<string, boolean> = {};

    if (!description.trim()) {
      errors["description"] = true;
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fill in the details", {
        description: "A short description of your concern is required.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiCreateConcern({
        category: category.toLowerCase().replace(/\s+/g, '_'),
        deliveryId: deliveryId ? deliveryId : undefined,
        tripId: initialTripId ? initialTripId : undefined,
        contextReason: category === "Incorrect System Detection" ? contextReason : undefined,
        driverDescription: description.trim(),
        systemEventType: category === "Incorrect System Detection" ? systemEvent?.type : undefined,
      }).catch(() => {});
    } catch {
      // Ignore API errors gracefully
    } finally {
      setIsSubmitting(false);
    }

    const added = addConcern({
      driverId: "DRV-1041",
      driverName: "Rahul Sharma",
      category,
      tripId: initialTripId,
      deliveryId,
      systemDetectedEvent: category === "Incorrect System Detection" ? systemEvent : undefined,
      contextReason: category === "Incorrect System Detection" ? contextReason : undefined,
      description: description.trim(),
    });

    toast.success("Concern Submitted", {
      description: `Your concern (${added.id}) has been recorded and sent to the Fleet Manager.`,
    });

    // Reset and close
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border/80 glass-strong p-5 sm:p-6 shadow-2xl z-10 space-y-5 overflow-hidden"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"
          />
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border pb-3.5">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <ShieldAlert className="size-4.5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-foreground">Raise a Concern</h3>
                <p className="text-xs text-muted-foreground">
                  Simple report form for operational issues & system event explanations
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Form Controls */}
          <div className="space-y-4 text-xs">
            {/* 1. Category Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Concern Category <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={(val) => setCategory(val as ConcernCategory)}>
                <SelectTrigger className="bg-surface/50 h-10 text-xs">
                  <SelectValue placeholder="Select concern category" />
                </SelectTrigger>
                <SelectContent>
                  {concernCategories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{c.label}</span>
                        <span className="text-[10px] text-muted-foreground">{c.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Related Delivery ID */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Related Delivery / Trip
              </Label>
              <Input
                value={deliveryId}
                onChange={(e) => setDeliveryId(e.target.value)}
                placeholder="e.g. DEL-2026-0816"
                className="bg-surface/50 h-9 font-mono text-xs"
              />
            </div>

            {/* 3. INCORRECT SYSTEM DETECTION SPECIAL FLOW */}
            {category === "Incorrect System Detection" && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-xs">
                  <AlertTriangle className="size-4 shrink-0" />
                  <span>System-Detected Event Context</span>
                </div>

                {systemEvent && (
                  <div className="p-3 rounded-xl bg-surface/80 border border-border/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{systemEvent.type}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">{systemEvent.timestamp}</span>
                    </div>
                    <p className="text-muted-foreground text-[11px]">{systemEvent.details} · {systemEvent.location}</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-semibold">
                    Primary Reason for Context
                  </Label>
                  <Select value={contextReason} onValueChange={(val) => setContextReason(val as ContextReason)}>
                    <SelectTrigger className="bg-surface/80 h-9 text-xs">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {contextReasons.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* IMPORTANT REASSURING NOTICE */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-primary/10 border border-primary/25 text-xs text-foreground">
                  <Info className="size-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    <strong className="text-primary font-bold block mb-0.5">Note:</strong>
                    Submitting context does <strong className="text-foreground">not erase or delete</strong> the system-recorded event. Your explanation will be attached alongside the event so the Fleet Manager can review both.
                  </p>
                </div>
              </div>
            )}

            {/* 4. Description / Details */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex justify-between">
                <span>Details / Explanation <span className="text-destructive">*</span></span>
                {formErrors["description"] && <span className="text-destructive text-[10px]">Required</span>}
              </Label>
              <Textarea
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (formErrors["description"]) setFormErrors((prev) => ({ ...prev, description: false }));
                }}
                placeholder={
                  category === "Incorrect System Detection"
                    ? "Explain what happened (e.g. car brake-checked, sudden animal on road)..."
                    : "Describe the issue or delay in simple terms..."
                }
                className={cn("bg-surface/50 text-xs leading-relaxed", formErrors["description"] && "border-destructive")}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary/90 cursor-pointer"
            >
              <MessageSquarePlus className="size-4" /> Submit Concern
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
