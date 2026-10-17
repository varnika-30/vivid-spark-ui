import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  HelpCircle,
  MapPin,
  PenTool,
  QrCode,
  ShieldCheck,
  Sparkles,
  User,
  X,
  ShieldAlert,
} from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatusPill } from "@/components/fx/status-pill";
import { FilterChips } from "@/components/fx/controls";
import { RaiseConcernModal } from "@/components/driver/raise-concern-modal";
import { cn } from "@/lib/utils";

const views = [
  { value: "day", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
] as const;

const weekDays = [
  { day: "Mon", date: "10", count: 3, workload: "High" },
  { day: "Tue", date: "11", count: 2, workload: "Normal" },
  { day: "Wed", date: "12", count: 4, workload: "High" },
  { day: "Thu", date: "13", count: 1, workload: "Light" },
  { day: "Fri", date: "14", count: 3, workload: "Normal" },
  { day: "Sat", date: "15", count: 0, workload: "Rest Day" },
  { day: "Sun", date: "16", count: 0, workload: "Rest Day" },
];

export type DeliveryStatus =
  | "At Pickup"
  | "In Transit"
  | "Completed"
  | "Cancelled"
  | "Failed (due to concern)";

export type PaymentMethod = "Cash" | "UPI" | "Card";
export type PaymentStatus = "Paid" | "Pending" | "Processing" | "Failed";

interface AssignedDelivery {
  id: string;
  status: DeliveryStatus;
  manager: string;
  pickup: string;
  drop: string;
  deadline: string;
  priority: "High" | "Express" | "Normal";
  note: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentId: string;
  paymentStatus: PaymentStatus;
  dateStr: string; // e.g. "Mon"
}

const initialDeliveries: AssignedDelivery[] = [
  {
    id: "DEL-2026-0816",
    status: "In Transit",
    manager: "Amit Rao",
    pickup: "Techlink Warehouse, Mumbai",
    drop: "Adira Corporate Office, Pune",
    deadline: "Today, 06:30 PM",
    priority: "High",
    note: "Handle with care • High value electronics • Call recipient prior to arrival",
    amount: 2450,
    paymentMethod: "UPI",
    paymentId: "TXN-9982410",
    paymentStatus: "Paid",
    dateStr: "Mon",
  },
  {
    id: "DEL-2026-0817",
    status: "At Pickup",
    manager: "Amit Rao",
    pickup: "Cold Hub, Thane",
    drop: "HealthMart, Nashik",
    deadline: "Today, 09:00 PM",
    priority: "Express",
    note: "Temperature controlled cargo (2-8°C) • Priority express delivery",
    amount: 5100,
    paymentMethod: "Card",
    paymentId: "—",
    paymentStatus: "Pending",
    dateStr: "Mon",
  },
  {
    id: "DEL-2026-0815",
    status: "Completed",
    manager: "Sneha Iyer",
    pickup: "Acme DC, Navi Mumbai",
    drop: "Retail Plaza, Thane",
    deadline: "Delivered Today, 11:30 AM",
    priority: "Normal",
    note: "Standard delivery • Signature recorded on receipt",
    amount: 1850,
    paymentMethod: "Cash",
    paymentId: "CASH-REC-84910",
    paymentStatus: "Paid",
    dateStr: "Mon",
  },
  {
    id: "DEL-2026-0820",
    status: "At Pickup",
    manager: "Amit Rao",
    pickup: "LogiPark, Pune",
    drop: "Satara Depot, Satara",
    deadline: "Tomorrow, 02:00 PM",
    priority: "Normal",
    note: "Heavy automotive components",
    amount: 3200,
    paymentMethod: "UPI",
    paymentId: "—",
    paymentStatus: "Pending",
    dateStr: "Tue",
  },
  {
    id: "DEL-2026-0821",
    status: "In Transit",
    manager: "Sneha Iyer",
    pickup: "Techlink Warehouse, Mumbai",
    drop: "Express Hub, Kolhapur",
    deadline: "Tomorrow, 07:30 PM",
    priority: "High",
    note: "Industrial machinery spare parts",
    amount: 4600,
    paymentMethod: "Card",
    paymentId: "TXN-9982421",
    paymentStatus: "Paid",
    dateStr: "Tue",
  },
  {
    id: "DEL-2026-0822",
    status: "At Pickup",
    manager: "Amit Rao",
    pickup: "Central DC, Thane",
    drop: "Solapur Mart, Solapur",
    deadline: "Wed, Aug 12, 05:00 PM",
    priority: "Express",
    note: "Medical devices shipment",
    amount: 6200,
    paymentMethod: "Cash",
    paymentId: "—",
    paymentStatus: "Pending",
    dateStr: "Wed",
  },
];

interface ActionStep {
  stepNum: number;
  type: "Pick up" | "Drop off";
  deliveryId: string;
  location: string;
}

const getActionSequence = (deliveriesList: AssignedDelivery[]): ActionStep[] => {
  const steps: ActionStep[] = [];
  if (deliveriesList.length === 0) return steps;

  const del16 = deliveriesList.find((d) => d.id === "DEL-2026-0816") || deliveriesList[0];
  const del17 = deliveriesList.find((d) => d.id === "DEL-2026-0817") || deliveriesList[1] || deliveriesList[0];
  const del15 = deliveriesList.find((d) => d.id === "DEL-2026-0815") || deliveriesList[2] || deliveriesList[0];

  if (del16) {
    steps.push({ stepNum: 1, type: "Pick up", deliveryId: del16.id, location: del16.pickup });
  }
  if (del17 && del17.id !== del16?.id) {
    steps.push({ stepNum: 2, type: "Pick up", deliveryId: del17.id, location: del17.pickup });
    steps.push({ stepNum: 3, type: "Drop off", deliveryId: del17.id, location: del17.drop });
  }
  if (del15 && del15.id !== del16?.id && del15.id !== del17?.id) {
    steps.push({ stepNum: 4, type: "Pick up", deliveryId: del15.id, location: del15.pickup });
  }
  if (del16) {
    steps.push({ stepNum: 5, type: "Drop off", deliveryId: del16.id, location: del16.drop });
  }
  if (del15 && del15.id !== del16?.id && del15.id !== del17?.id) {
    steps.push({ stepNum: 6, type: "Drop off", deliveryId: del15.id, location: del15.drop });
  }

  return steps;
};

function ActionStepCard({ step }: { step: ActionStep | undefined }) {
  if (!step) return null;
  const isPickup = step.type === "Pick up";

  return (
    <div className="relative flex-1 rounded-xl border border-border/80 bg-surface-2/95 p-3.5 shadow-md backdrop-blur-md space-y-2.5 transition-all hover:border-primary/50">
      {/* Top Header: Step #, Badge, and Delivery ID */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="size-6 rounded-full bg-primary/20 text-primary font-extrabold text-xs grid place-items-center shrink-0 border border-primary/30">
            {step.stepNum}
          </span>
          <span
            className={cn(
              "flex items-center gap-1.5 font-bold text-xs whitespace-nowrap px-2.5 py-0.5 rounded-lg border",
              isPickup
                ? "text-warning bg-warning/10 border-warning/30"
                : "text-success bg-success/10 border-success/30"
            )}
          >
            {isPickup ? (
              <>
                <ArrowUpRight className="size-3.5 shrink-0" /> Pick up
              </>
            ) : (
              <>
                <ArrowDownRight className="size-3.5 shrink-0" /> Drop off
              </>
            )}
          </span>
        </div>
        <span className="font-extrabold text-primary font-mono text-xs whitespace-nowrap">
          {step.deliveryId}
        </span>
      </div>

      {/* Bottom Location Line */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1.5 border-t border-border/40 min-w-0">
        <MapPin className="size-3.5 text-primary shrink-0" />
        <span className="truncate font-medium text-foreground/90">{step.location}</span>
      </div>
    </div>
  );
}

export function SchedulePage() {
  const [view, setView] = useState<(typeof views)[number]["value"]>("day");
  const [selectedDay, setSelectedDay] = useState<string>("Mon");
  const [deliveries, setDeliveries] = useState<AssignedDelivery[]>(initialDeliveries);
  const [showAiTooltip, setShowAiTooltip] = useState(false);
  const [expandedPaymentId, setExpandedPaymentId] = useState<string | null>(null);
  const [signatures, setSignatures] = useState<Record<string, string>>({
    "DEL-2026-0815": "R. K. Sharma (Acme Receiver)",
  });

  // AI Schedule Recommendation State (Today View Only)
  const [showAiRecommendations, setShowAiRecommendations] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Payment Gateway Modal State
  const [paymentDelivery, setPaymentDelivery] = useState<AssignedDelivery | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("UPI");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isConcernModalOpen, setIsConcernModalOpen] = useState(false);
  const [cashConfirmed, setCashConfirmed] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleStatusChange = (id: string, newStatus: DeliveryStatus) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
  };

  const handleSign = (id: string, name: string) => {
    setSignatures((prev) => ({ ...prev, [id]: name }));
  };

  const handleGenerateAiSchedule = () => {
    if (showAiRecommendations) {
      setShowAiRecommendations(false);
      return;
    }
    setIsGeneratingAi(true);
    setTimeout(() => {
      setIsGeneratingAi(false);
      setShowAiRecommendations(true);
    }, 400);
  };

  const openPaymentGateway = (del: AssignedDelivery) => {
    setPaymentDelivery(del);
    setSelectedMethod(del.paymentMethod || "UPI");
    setCashConfirmed(false);
  };

  const handleProcessPayment = () => {
    if (!paymentDelivery) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      const generatedTxnId =
        selectedMethod === "Cash"
          ? `CASH-REC-${Math.floor(10000 + Math.random() * 90000)}`
          : `TXN-${Math.floor(9000000 + Math.random() * 900000)}`;

      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === paymentDelivery.id
            ? {
                ...d,
                paymentStatus: "Paid",
                paymentMethod: selectedMethod,
                paymentId: generatedTxnId,
              }
            : d
        )
      );

      setIsProcessingPayment(false);
      setPaymentDelivery(null);
      setToastMsg(
        `Payment of ₹${paymentDelivery.amount.toLocaleString()} recorded successfully! (${generatedTxnId})`
      );
      setTimeout(() => setToastMsg(null), 5000);
    }, 1200);
  };

  const displayedDeliveries =
    view === "day"
      ? deliveries.filter((d) => d.dateStr === "Mon")
      : deliveries.filter((d) => d.dateStr === selectedDay);

  const actionSteps = getActionSequence(displayedDeliveries);

  return (
    <Page
      title="My Schedule"
      description="Assigned deliveries & workload overview for your assigned routes."
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <FilterChips options={views} value={view} onChange={setView} layoutId="schedule-view" />
          {/* AI Recommendation Available ONLY in Today View */}
          {view === "day" && (
            <button
              type="button"
              onClick={handleGenerateAiSchedule}
              className="flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/14 px-3.5 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-[var(--shadow-glow)] cursor-pointer"
            >
              <Sparkles className="size-3.5 animate-pulse text-primary" />
              {isGeneratingAi
                ? "Calculating optimum order..."
                : showAiRecommendations
                  ? "Hide Optimum Order"
                  : "✦ Optimum order for today’s deliveries"}
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsConcernModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
          >
            <ShieldAlert className="size-3.5" />
            Raise a Concern
          </button>
        </div>
      }
    >
      {/* 1. HEADER AI-ASSISTED INDICATOR WITH TOOLTIP */}
      <div className="relative mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/8 p-3.5 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-lg bg-primary/14 text-primary">
            <Sparkles className="size-4 animate-pulse" />
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">AI-assisted scheduling</span>
            <button
              type="button"
              onClick={() => setShowAiTooltip(!showAiTooltip)}
              className="text-muted-foreground hover:text-primary transition-colors"
              title="Click for scheduling details"
            >
              <HelpCircle className="size-3.5" />
            </button>
          </div>
        </div>
        <span className="text-[11px] text-muted-foreground font-medium">
          {view === "day"
            ? "AI can suggest an optimum sequence of pickup & drop-off steps for today."
            : "Assignments optimized based on delivery requirements, availability & workload."}
        </span>

        {/* Tooltip Popup */}
        <AnimatePresence>
          {showAiTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute left-4 top-12 z-20 max-w-sm rounded-xl border border-border/80 glass-strong p-3.5 text-xs shadow-2xl text-foreground"
            >
              <div className="flex items-center justify-between font-bold mb-1">
                <span>AI Dispatch & Scheduling</span>
                <button type="button" onClick={() => setShowAiTooltip(false)}>
                  <X className="size-3.5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Your schedule is dynamically generated by the FleetHub AI dispatcher to minimize deadhead kilometers and balance workload across assigned routes.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. CONTINUOUS JOURNEY ROUTE PANEL (1 -> 2 -> 3 down to 4 left to 5 left to 6) */}
      <AnimatePresence>
        {view === "day" && showAiRecommendations && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 space-y-3.5 rounded-2xl border border-primary/30 bg-primary/6 p-4.5 backdrop-blur-md shadow-[var(--shadow-glow)]"
          >
            {/* Heading & Intro */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-primary/20 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-xl bg-primary/20 text-primary">
                  <Sparkles className="size-4 animate-pulse" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Optimum order for today’s deliveries</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Recommended sequence of pickup and drop-off steps for your assigned routes.
                  </p>
                </div>
              </div>
              <StatusPill tone="primary">Suggested Sequence</StatusPill>
            </div>

            {/* CLEAN 3-COLUMN SERPENTINE SEQUENCE PANEL */}
            <div className="rounded-2xl border border-primary/20 bg-surface/80 glass p-5 sm:p-6 space-y-5">
              {/* DESKTOP 3-COLUMN SEQUENCE LAYOUT */}
              <div className="hidden md:block space-y-5">
                {/* TOP ROW: Step 1 -> Step 2 -> Step 3 */}
                <div className="grid grid-cols-3 gap-6 items-center">
                  {/* Step 1 */}
                  <div className="relative flex items-center gap-3">
                    <ActionStepCard step={actionSteps[0]} />
                    <div className="grid size-8 place-items-center rounded-full bg-primary/15 border border-primary/35 text-primary shrink-0 shadow-[var(--shadow-glow)]">
                      <ArrowRight className="size-4 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex items-center gap-3">
                    <ActionStepCard step={actionSteps[1]} />
                    <div className="grid size-8 place-items-center rounded-full bg-primary/15 border border-primary/35 text-primary shrink-0 shadow-[var(--shadow-glow)]">
                      <ArrowRight className="size-4 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <ActionStepCard step={actionSteps[2]} />
                  </div>
                </div>

                {/* DOWNWARD TRANSITION: Step 3 ↓ Step 4 */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-start-3 flex justify-center py-0.5">
                    <div className="grid size-8 place-items-center rounded-full bg-primary/15 border border-primary/35 text-primary shadow-[var(--shadow-glow)]">
                      <ArrowDown className="size-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>

                {/* BOTTOM ROW: Step 6 <- Step 5 <- Step 4 */}
                <div className="grid grid-cols-3 gap-6 items-center">
                  {/* Step 6 */}
                  <div className="relative">
                    <ActionStepCard step={actionSteps[5]} />
                  </div>

                  {/* Step 5 */}
                  <div className="relative flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-full bg-primary/15 border border-primary/35 text-primary shrink-0 shadow-[var(--shadow-glow)]">
                      <ArrowLeft className="size-4 stroke-[2.5]" />
                    </div>
                    <ActionStepCard step={actionSteps[4]} />
                  </div>

                  {/* Step 4 */}
                  <div className="relative flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-full bg-primary/15 border border-primary/35 text-primary shrink-0 shadow-[var(--shadow-glow)]">
                      <ArrowLeft className="size-4 stroke-[2.5]" />
                    </div>
                    <ActionStepCard step={actionSteps[3]} />
                  </div>
                </div>
              </div>

              {/* MOBILE VIEW (VERTICAL TIMELINE FALLBACK WITH DOWN ARROWS) */}
              <div className="grid md:hidden grid-cols-1 gap-3">
                {actionSteps.map((step, idx) => (
                  <div key={`${step.deliveryId}-${idx}`} className="flex flex-col items-center gap-2">
                    <div className="w-full">
                      <ActionStepCard step={step} />
                    </div>
                    {idx < actionSteps.length - 1 && (
                      <div className="grid size-7 place-items-center rounded-full bg-primary/14 border border-primary/30 text-primary my-0.5">
                        <ArrowDown className="size-4 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer Note */}
            <p className="text-[11px] text-muted-foreground text-center sm:text-left">
              This is a suggested order. Complete your deliveries safely based on road and traffic conditions.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Banner */}
      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-2 rounded-xl border border-success/30 bg-success/15 p-3 text-xs font-medium text-success"
        >
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{toastMsg}</span>
        </motion.div>
      )}

      {/* MAIN SCHEDULE VIEWS (TODAY / THIS WEEK / THIS MONTH) */}
      <div className="space-y-4">
        {/* VIEW 1: TODAY VIEW */}
        {view === "day" && (
          <GlassPanel
            title="Today's Assigned Deliveries"
            subtitle={`Monday, Aug 10, 2026 • ${displayedDeliveries.length} deliveries assigned for today`}
          >
            <div className="space-y-4">
              {displayedDeliveries.map((del) => (
                <div
                  key={del.id}
                  className={cn(
                    "rounded-2xl border p-4.5 transition-all duration-300",
                    del.status === "In Transit"
                      ? "border-primary/40 bg-primary/10 shadow-[var(--shadow-glow)]"
                      : del.status === "At Pickup"
                        ? "border-warning/30 bg-warning/8"
                        : del.status === "Completed"
                          ? "border-border/40 bg-surface/20 opacity-85"
                          : del.status === "Failed (due to concern)"
                            ? "border-destructive/30 bg-destructive/8"
                            : "border-border/60 bg-surface-2/30"
                  )}
                >
                  {/* Top Bar: ID, Fleet Manager, Priority & Status Dropdown */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-base font-extrabold text-primary">{del.id}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground bg-surface-2/60 px-2.5 py-0.5 rounded-md border border-border/50 font-medium">
                        <User className="size-3 text-primary" /> Manager: <strong className="text-foreground">{del.manager}</strong>
                      </span>
                      <StatusPill
                        tone={
                          del.priority === "Express"
                            ? "destructive"
                            : del.priority === "High"
                              ? "warning"
                              : "muted"
                        }
                      >
                        {del.priority} Priority
                      </StatusPill>
                    </div>

                    {/* Interactive Status Select Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">Status:</span>
                      <select
                        value={del.status}
                        onChange={(e) => handleStatusChange(del.id, e.target.value as DeliveryStatus)}
                        className={cn(
                          "rounded-xl border px-3 py-1.5 text-xs font-semibold focus:outline-none transition-colors cursor-pointer",
                          del.status === "In Transit"
                            ? "border-primary/50 bg-primary/14 text-primary"
                            : del.status === "Completed"
                              ? "border-success/50 bg-success/14 text-success"
                              : del.status === "At Pickup"
                                ? "border-warning/50 bg-warning/14 text-warning"
                                : del.status === "Failed (due to concern)"
                                  ? "border-destructive/50 bg-destructive/14 text-destructive"
                                  : "border-border bg-surface-2 text-muted-foreground"
                        )}
                      >
                        <option value="At Pickup">At Pickup</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Failed (due to concern)">Failed (due to concern)</option>
                      </select>
                    </div>
                  </div>

                  {/* Route Information: Pickup -> Drop */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 text-sm font-semibold text-foreground min-w-0">
                      <span className="flex items-center gap-1.5 shrink-0">
                        <MapPin className="size-4 text-primary" /> {del.pickup}
                      </span>
                      <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                      <span className="flex items-center gap-1.5 shrink-0">
                        <MapPin className="size-4 text-primary" /> {del.drop}
                      </span>
                    </div>

                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 shrink-0">
                      <Clock className="size-3.5 text-primary" /> Deadline: <strong className="text-foreground">{del.deadline}</strong>
                    </span>
                  </div>

                  {/* Extra Note */}
                  {del.note && (
                    <div className="rounded-xl bg-surface-2/40 p-2.5 text-xs text-muted-foreground mb-3 border border-border/40">
                      <strong className="text-foreground font-medium">Extra Note:</strong> {del.note}
                    </div>
                  )}

                  {/* Payment Summary & Action Gateway */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/40 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>Payment: <strong className="text-foreground font-semibold">₹{del.amount.toLocaleString()}</strong> ({del.paymentMethod})</span>
                      <StatusPill tone={del.paymentStatus === "Paid" ? "success" : "warning"}>
                        {del.paymentStatus}
                      </StatusPill>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      {del.paymentStatus === "Pending" ? (
                        <button
                          type="button"
                          onClick={() => openPaymentGateway(del)}
                          className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary/90 transition-all text-xs"
                        >
                          {del.paymentMethod === "Cash" ? (
                            <>
                              <Banknote className="size-3.5" /> Confirm Cash Collection
                            </>
                          ) : (
                            <>
                              <CreditCard className="size-3.5" /> Pay Now
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-success font-semibold flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> Payment Cleared
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setExpandedPaymentId(expandedPaymentId === del.id ? null : del.id)}
                        className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        Payment Details
                        <ChevronDown className={cn("size-3.5 transition-transform", expandedPaymentId === del.id && "rotate-180")} />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Payment Details & Signature Confirmation */}
                  <AnimatePresence>
                    {expandedPaymentId === del.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 overflow-hidden rounded-xl border border-border/60 bg-surface/40 p-4 space-y-3"
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-muted-foreground block text-[11px]">Total Amount</span>
                            <strong className="text-foreground text-sm font-bold">₹{del.amount.toLocaleString()}</strong>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[11px]">Payment Method</span>
                            <span className="font-semibold text-foreground">{del.paymentMethod}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[11px]">Transaction Reference</span>
                            <span className="font-mono text-foreground">{del.paymentId}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[11px]">Payment Status</span>
                            <StatusPill tone={del.paymentStatus === "Paid" ? "success" : "warning"}>
                              {del.paymentStatus}
                            </StatusPill>
                          </div>
                        </div>

                        {/* Signature confirmation area */}
                        <div className="pt-3 border-t border-border/40">
                          <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-2">
                            <span className="flex items-center gap-1.5">
                              <PenTool className="size-3.5 text-primary" />
                              Recipient Signature Confirmation
                            </span>
                            {signatures[del.id] && (
                              <span className="text-[11px] text-success font-medium flex items-center gap-1">
                                <CheckCircle2 className="size-3.5" /> Signed & Confirmed
                              </span>
                            )}
                          </div>
                          <div className="relative rounded-xl border border-dashed border-border/80 bg-background/60 p-4 text-center min-h-[60px] flex items-center justify-center">
                            {signatures[del.id] ? (
                              <span className="text-sm font-bold text-primary italic tracking-wider">
                                {signatures[del.id]}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Recipient signature required upon delivery completion
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center justify-end gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => handleSign(del.id, "R. K. Sharma (Confirmed)")}
                              className="rounded-lg bg-primary/14 text-primary border border-primary/30 px-3 py-1.5 font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              Confirm Signature
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </GlassPanel>
        )}

        {/* VIEW 2: THIS WEEK VIEW */}
        {view === "week" && (
          <GlassPanel
            title="Weekly Assigned Deliveries Overview"
            subtitle="Select a day to inspect assigned deliveries & workload"
          >
            {/* 7-Day Selector Bar */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map((w) => (
                <button
                  key={w.day}
                  type="button"
                  onClick={() => setSelectedDay(w.day)}
                  className={cn(
                    "flex flex-col items-center justify-between rounded-xl border p-2.5 text-center transition-all duration-200",
                    selectedDay === w.day
                      ? "border-primary bg-primary/15 text-primary shadow-[var(--shadow-glow)]"
                      : w.count > 0
                        ? "border-border/60 bg-surface-2/40 text-foreground hover:border-primary/40"
                        : "border-border/40 bg-surface/20 text-muted-foreground opacity-60"
                  )}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider">{w.day}</span>
                  <span className="text-lg font-extrabold my-1">{w.date}</span>
                  <span className="text-[10px] font-medium">
                    {w.count > 0 ? `${w.count} del` : "Rest"}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Day's Deliveries */}
            <div className="border-t border-border/60 pt-4">
              <h4 className="text-xs font-bold text-foreground mb-3 flex items-center justify-between">
                <span>Assigned Deliveries for {selectedDay}</span>
                <span className="text-muted-foreground font-normal">
                  {displayedDeliveries.length} items scheduled
                </span>
              </h4>

              {displayedDeliveries.length > 0 ? (
                <div className="space-y-3">
                  {displayedDeliveries.map((del) => (
                    <div
                      key={del.id}
                      className="rounded-xl border border-border/60 bg-surface-2/30 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">{del.id}</span>
                          <StatusPill
                            tone={
                              del.status === "In Transit"
                                ? "primary"
                                : del.status === "Completed"
                                  ? "success"
                                  : del.status === "At Pickup"
                                    ? "warning"
                                    : "info"
                            }
                          >
                            {del.status}
                          </StatusPill>
                          <span className="text-[11px] text-muted-foreground">• Manager: {del.manager}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                          <span>{del.pickup}</span>
                          <ArrowRight className="size-3 text-muted-foreground shrink-0" />
                          <span>{del.drop}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No deliveries assigned for {selectedDay}. Rest window active.
                </div>
              )}
            </div>
          </GlassPanel>
        )}

        {/* VIEW 3: THIS MONTH VIEW */}
        {view === "month" && (
          <GlassPanel
            title="Monthly Workload & Assignment Calendar"
            subtitle="Overview of delivery density & rest days across the month"
          >
            <div className="grid grid-cols-7 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <p key={d} className="pb-1 text-center text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                  {d}
                </p>
              ))}
              {Array.from({ length: 35 }).map((_, i) => {
                const dayNum = i + 1;
                const load = (i * 7) % 5;
                const isRest = (i % 7 === 5 || i % 7 === 6);
                return (
                  <motion.div
                    key={i}
                    whileHover={{ y: -2 }}
                    className={cn(
                      "aspect-square rounded-xl border p-2 text-[11px] flex flex-col justify-between transition-all cursor-pointer",
                      isRest
                        ? "border-border/30 bg-surface/20 text-muted-foreground opacity-50"
                        : load > 3
                          ? "border-primary/40 bg-primary/15 text-foreground"
                          : load > 1
                            ? "border-border/60 bg-surface-2/50 text-foreground"
                            : "border-border/40 bg-surface/30 text-muted-foreground"
                    )}
                  >
                    <span className="font-semibold">{dayNum <= 31 ? dayNum : dayNum - 31}</span>
                    {!isRest && load > 0 ? (
                      <div>
                        <span className="block font-bold text-foreground text-[10px]">{load} del</span>
                        <span className="block text-[9px] text-muted-foreground">
                          {load > 3 ? "High" : "Normal"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[9px] text-muted-foreground">Rest</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </GlassPanel>
        )}
      </div>

      {/* INTERACTIVE PAYMENT GATEWAY MODAL */}
      <AnimatePresence>
        {paymentDelivery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-md rounded-3xl border border-border/80 glass-strong p-6 shadow-2xl space-y-4 overflow-hidden"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
              />
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-lg bg-primary/14 text-primary">
                    <ShieldCheck className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-foreground">FleetHub Payment Gateway</h3>
                    <p className="text-xs text-muted-foreground">Delivery ID: {paymentDelivery.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentDelivery(null)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Amount Summary */}
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-3.5 text-center space-y-1">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
                  Amount Due
                </span>
                <span className="text-2xl font-extrabold text-primary">
                  ₹{paymentDelivery.amount.toLocaleString()}
                </span>
              </div>

              {/* Method Selection */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["UPI", "Card", "Cash"] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setSelectedMethod(method)}
                      className={cn(
                        "flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition-all",
                        selectedMethod === method
                          ? "border-primary bg-primary/15 text-primary shadow-[var(--shadow-glow)]"
                          : "border-border/60 bg-surface-2/40 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {method === "UPI" && <QrCode className="size-3.5" />}
                      {method === "Card" && <CreditCard className="size-3.5" />}
                      {method === "Cash" && <Banknote className="size-3.5" />}
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Method Specific UI */}
              {selectedMethod === "UPI" && (
                <div className="rounded-xl border border-border/60 bg-surface-2/40 p-4 text-center space-y-2">
                  <span className="text-xs text-muted-foreground block">Scan QR or authorize UPI handle</span>
                  <div className="mx-auto size-24 rounded-lg bg-foreground/90 p-2 flex items-center justify-center text-background font-mono text-xs font-bold">
                    [QR CODE]
                  </div>
                  <span className="text-[11px] font-mono text-primary font-semibold block">fleethub.pay@icici</span>
                </div>
              )}

              {selectedMethod === "Card" && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-muted-foreground mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      defaultValue="Rahul Sharma"
                      className="w-full rounded-xl border border-border/80 bg-surface-2 p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-muted-foreground mb-1">Card Number</label>
                    <input
                      type="text"
                      defaultValue="•••• •••• •••• 4819"
                      className="w-full rounded-xl border border-border/80 bg-surface-2 p-2.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              {selectedMethod === "Cash" && (
                <div className="rounded-xl border border-warning/30 bg-warning/10 p-3.5 text-xs space-y-2 text-foreground">
                  <div className="font-semibold text-warning flex items-center gap-1.5">
                    <Banknote className="size-4" />
                    Handover Cash Collection
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Please collect exact cash amount of <strong>₹{paymentDelivery.amount.toLocaleString()}</strong> from the recipient before confirming.
                  </p>
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={cashConfirmed}
                      onChange={(e) => setCashConfirmed(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary size-4"
                    />
                    <span className="text-xs font-medium text-foreground">I confirm cash collection</span>
                  </label>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-border/60 pt-3">
                <button
                  type="button"
                  onClick={() => setPaymentDelivery(null)}
                  disabled={isProcessingPayment}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-surface-2 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessingPayment || (selectedMethod === "Cash" && !cashConfirmed)}
                  onClick={handleProcessPayment}
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary/90 disabled:opacity-50 transition-all"
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="size-3 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Processing Payment...
                    </>
                  ) : selectedMethod === "Cash" ? (
                    "Confirm Cash Collection"
                  ) : (
                    `Pay ₹${paymentDelivery.amount.toLocaleString()} Now`
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <RaiseConcernModal
        isOpen={isConcernModalOpen}
        onClose={() => setIsConcernModalOpen(false)}
      />
    </Page>
  );
}
