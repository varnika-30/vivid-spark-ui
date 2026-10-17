import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DataPagination } from "@/components/common/data-pagination";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Download,
  FileText,
  Filter,
  Fuel,
  Gauge,
  HelpCircle,
  Info,
  Lightbulb,
  MapPin,
  MapPinned,
  Package,
  RotateCcw,
  Route as RouteIcon,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Timer,
  TrendingDown,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatCard } from "@/components/fx/stat-card";
import { StatusPill, type Tone } from "@/components/fx/status-pill";
import { MagneticButton } from "@/components/fx/magnetic-button";
import { LoadingGrid } from "@/components/fx/skeletons";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { fadeUp, stagger } from "@/lib/motion-presets";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface TimelineEventItem {
  time: string;
  event: string;
  location: string;
  severity: "Info" | "Low" | "Medium" | "High" | "Critical";
  description?: string;
}

export interface CompletedTripItem {
  tripId: string;
  deliveryId: string;
  driver: string;
  vehicle: string;
  completionDate: string;
  duration: string;
  distance: string;
  drivingScore: number;
  hasIncident: boolean;
  incidentDetail?: string;
  status: "Completed";
  pickupLocation: string;
  dropLocation: string;
  startTime: string;
  endTime: string;
  behaviour: {
    speeding: { count: number; risk: "Low" | "Medium" | "High"; diff: string };
    braking: { count: number; risk: "Low" | "Medium" | "High"; diff: string };
    acceleration: { count: number; risk: "Low" | "Medium" | "High"; diff: string };
    cornering: { count: number; risk: "Low" | "Medium" | "High"; diff: string };
    idleTime: { duration: string; risk: "Low" | "Medium" | "High"; diff: string };
  };
  timeline: TimelineEventItem[];
  aiSummary: {
    overall: string;
    braking: string;
    acceleration: string;
    incident: string;
    routeEfficiency: string;
  };
}

const mockCompletedTrips: CompletedTripItem[] = [
  {
    tripId: "TRP-8421",
    deliveryId: "DEL-1044",
    driver: "Marcus Webb",
    vehicle: "VAN-118 · MH12 KJ 4410",
    completionDate: "Aug 06, 2026",
    duration: "2h 14m",
    distance: "38.4 km",
    drivingScore: 82,
    hasIncident: true,
    incidentDetail: "Driver reported temporary gate obstacle at loading dock B",
    status: "Completed",
    pickupLocation: "Gate 4, Bhiwandi Logistics Hub, Mumbai, MH",
    dropLocation: "Tower 2, Magarpatta Cybercity, Pune, MH",
    startTime: "08:30 AM",
    endTime: "10:44 AM",
    behaviour: {
      speeding: { count: 2, risk: "Medium", diff: "-25% vs prior trips" },
      braking: { count: 3, risk: "Medium", diff: "+1 vs prior trips" },
      acceleration: { count: 0, risk: "Low", diff: "0% vs prior trips" },
      cornering: { count: 1, risk: "Low", diff: "-50% vs prior trips" },
      idleTime: { duration: "12 mins", risk: "Low", diff: "4.8% of trip duration" },
    },
    timeline: [
      { time: "08:30 AM", event: "Trip Started", location: "Bhiwandi Hub Dispatch Bay 4", severity: "Info", description: "Driver completed pre-trip vehicle check." },
      { time: "08:42 AM", event: "Reached Pickup", location: "Gate 4 Loading Dock", severity: "Info", description: "Vehicle docked at Gate 4." },
      { time: "08:50 AM", event: "Package Collected", location: "Gate 4 Loading Dock", severity: "Info", description: "Manifest barcode scanned & POD verified." },
      { time: "09:22 AM", event: "Speeding Detected", location: "NH48 Express Corridor", severity: "Medium", description: "Speed reached 92 km/h in 80 km/h zone for 1.8 km." },
      { time: "09:55 AM", event: "Harsh Braking", location: "Khed Toll Plaza Approach", severity: "High", description: "Harsh deceleration event detected (-0.45g)." },
      { time: "10:28 AM", event: "Driver Reported Incident", location: "Loading Dock B Alley", severity: "Critical", description: "Temporary obstacle blocking tailgate ramp. 8-min delay." },
      { time: "10:40 AM", event: "Reached Destination", location: "Magarpatta Cybercity", severity: "Info", description: "Vehicle parked safely in unloading zone." },
      { time: "10:44 AM", event: "Delivery Completed", location: "Magarpatta Cybercity", severity: "Info", description: "Client signed digital proof of delivery." },
    ],
    aiSummary: {
      overall: "The driver maintained generally safe driving behaviour throughout most of the journey, with a driving score of 82.",
      braking: "Three harsh braking events were detected, primarily on the approach to the Khed Toll Plaza and delivery destination.",
      acceleration: "No rapid acceleration events were observed during transit.",
      incident: "A driver-reported incident occurred near the loading dock, resulting in an 8-minute unloading delay.",
      routeEfficiency: "Route adherence was 91%. Shifting departure time 30 minutes earlier is projected to avoid toll plaza braking incidents.",
    },
  },
  {
    tripId: "TRP-8422",
    deliveryId: "DEL-1045",
    driver: "Rahul Sharma",
    vehicle: "Tata Ace · MH12 AB 9912",
    completionDate: "Aug 06, 2026",
    duration: "3h 12m",
    distance: "148.0 km",
    drivingScore: 96,
    hasIncident: false,
    status: "Completed",
    pickupLocation: "Bhiwandi Hub, Mumbai, MH",
    dropLocation: "Kothrud Industrial Area, Pune, MH",
    startTime: "09:00 AM",
    endTime: "12:12 PM",
    behaviour: {
      speeding: { count: 0, risk: "Low", diff: "0% vs prior trips" },
      braking: { count: 0, risk: "Low", diff: "-100% vs prior trips" },
      acceleration: { count: 0, risk: "Low", diff: "0% vs prior trips" },
      cornering: { count: 0, risk: "Low", diff: "0% vs prior trips" },
      idleTime: { duration: "4 mins", risk: "Low", diff: "2.1% of trip duration" },
    },
    timeline: [
      { time: "09:00 AM", event: "Trip Started", location: "Bhiwandi Hub", severity: "Info" },
      { time: "09:12 AM", event: "Reached Pickup", location: "Warehouse Bay A1", severity: "Info" },
      { time: "09:18 AM", event: "Package Collected", location: "Warehouse Bay A1", severity: "Info" },
      { time: "10:45 AM", event: "Highway Checkpoint", location: "Lonavala Expressway", severity: "Low", description: "Smooth cruising speed of 78 km/h maintained." },
      { time: "12:08 PM", event: "Reached Destination", location: "Kothrud Depot", severity: "Info" },
      { time: "12:12 PM", event: "Delivery Completed", location: "Kothrud Depot", severity: "Info", description: "Recipients confirmed cargo integrity." },
    ],
    aiSummary: {
      overall: "Exceptional driving behaviour with perfect route adherence and a driving score of 96.",
      braking: "Zero harsh braking events detected across 148 km of highway transit.",
      acceleration: "Smooth throttle response throughout the entire journey.",
      incident: "No incidents or delays reported.",
      routeEfficiency: "Top-tier fuel efficiency (12.4 km/l). Recommended for high-value logistics dispatch.",
    },
  },
  {
    tripId: "TRP-8423",
    deliveryId: "DEL-1046",
    driver: "Priya Nair",
    vehicle: "Tata Intra · MH04 GH 1120",
    completionDate: "Aug 05, 2026",
    duration: "3h 48m",
    distance: "168.5 km",
    drivingScore: 94,
    hasIncident: false,
    status: "Completed",
    pickupLocation: "Thane Cold Storage, MH",
    dropLocation: "Satpur MIDC, Nashik, MH",
    startTime: "06:15 AM",
    endTime: "10:03 AM",
    behaviour: {
      speeding: { count: 0, risk: "Low", diff: "0% vs prior trips" },
      braking: { count: 1, risk: "Low", diff: "-50% vs prior trips" },
      acceleration: { count: 0, risk: "Low", diff: "0% vs prior trips" },
      cornering: { count: 1, risk: "Low", diff: "0% vs prior trips" },
      idleTime: { duration: "8 mins", risk: "Low", diff: "3.5% of trip duration" },
    },
    timeline: [
      { time: "06:15 AM", event: "Trip Started", location: "Thane Cold Storage", severity: "Info" },
      { time: "06:22 AM", event: "Reached Pickup", location: "Reefer Dock 3", severity: "Info" },
      { time: "06:30 AM", event: "Package Collected", location: "Reefer Dock 3", severity: "Info", description: "Temperature logged at 4°C." },
      { time: "08:15 AM", event: "Ghat Section Transit", location: "Kasara Ghat Pass", severity: "Low", description: "Controlled downhill braking registered." },
      { time: "10:00 AM", event: "Reached Destination", location: "Satpur MIDC", severity: "Info" },
      { time: "10:03 AM", event: "Delivery Completed", location: "Satpur MIDC", severity: "Info", description: "Cold-chain verification passed." },
    ],
    aiSummary: {
      overall: "Highly consistent cold-chain transport with a driving score of 94 and strict temperature compliance.",
      braking: "Only one minor deceleration event recorded at the Nashik exit toll plaza.",
      acceleration: "Smooth throttle curve throughout mountainous terrain.",
      incident: "Zero cargo handling or temperature compliance incidents.",
      routeEfficiency: "Optimal performance across Kasara Ghat pass. Excellent candidate for pharmaceutical dispatches.",
    },
  },
  {
    tripId: "TRP-8424",
    deliveryId: "DEL-1047",
    driver: "Aman Verma",
    vehicle: "Mahindra Bolero · MH15 AD 7781",
    completionDate: "Aug 05, 2026",
    duration: "2h 40m",
    distance: "116.2 km",
    drivingScore: 74,
    hasIncident: true,
    incidentDetail: "Late night speeding warning trigger on NH3 highway",
    status: "Completed",
    pickupLocation: "Pune Depot, MH",
    dropLocation: "Satara MIDC, MH",
    startTime: "10:15 PM",
    endTime: "12:55 AM",
    behaviour: {
      speeding: { count: 4, risk: "High", diff: "+100% vs prior trips" },
      braking: { count: 2, risk: "Medium", diff: "+1 vs prior trips" },
      acceleration: { count: 1, risk: "Medium", diff: "+1 vs prior trips" },
      cornering: { count: 2, risk: "Medium", diff: "+1 vs prior trips" },
      idleTime: { duration: "18 mins", risk: "Medium", diff: "11.2% of trip duration" },
    },
    timeline: [
      { time: "10:15 PM", event: "Trip Started", location: "Pune Depot", severity: "Info" },
      { time: "10:25 PM", event: "Package Collected", location: "Depot Dock 2", severity: "Info" },
      { time: "11:04 PM", event: "Speeding Warning", location: "NH3 Highway Leg 2", severity: "High", description: "Speed 98 km/h in 80 km/h zone for 3.4 km." },
      { time: "11:40 PM", event: "Harsh Braking", location: "Shirwal Checkpoint", severity: "High", description: "Sudden brake application (-0.52g)." },
      { time: "12:15 AM", event: "Driver Reported Incident", location: "Khambatki Ghat Bypass", severity: "Critical", description: "Unscheduled 12-min roadside stop for tire pressure check." },
      { time: "12:50 AM", event: "Reached Destination", location: "Satara MIDC", severity: "Info" },
      { time: "12:55 AM", event: "Delivery Completed", location: "Satara MIDC", severity: "Info" },
    ],
    aiSummary: {
      overall: "Driver exhibited late-night speeding and aggressive cornering along NH3 highway, resulting in a driving score of 74.",
      braking: "Two harsh deceleration telemetry flags registered on checkpoint approaches.",
      acceleration: "Rapid acceleration recorded post-toll dispatch.",
      incident: "Telematics flagged 4 night speeding alerts requiring dispatcher coaching.",
      routeEfficiency: "Fuel efficiency dropped to 8.6 km/l due to high-speed driving. Coaching recommended.",
    },
  },
];

export function ManagerTripsPage() {
  const loading = useSimulatedLoading(500);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("30days");
  const [driverFilter, setDriverFilter] = useState("all");
  const [incidentFilter, setIncidentFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  // Selected Trip State for Detail View
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const selectedTrip = mockCompletedTrips.find((t) => t.tripId === selectedTripId) || null;

  // Filtered trips
  const filteredTrips = mockCompletedTrips.filter((t) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      t.tripId.toLowerCase().includes(query) ||
      t.deliveryId.toLowerCase().includes(query) ||
      t.driver.toLowerCase().includes(query);

    if (!matchesSearch) return false;
    if (driverFilter !== "all" && t.driver !== driverFilter) return false;
    if (incidentFilter === "incidents" && !t.hasIncident) return false;
    if (incidentFilter === "no-incidents" && t.hasIncident) return false;
    if (riskFilter === "low" && t.drivingScore < 90) return false;
    if (riskFilter === "medium" && (t.drivingScore < 80 || t.drivingScore >= 90)) return false;
    if (riskFilter === "high" && t.drivingScore >= 80) return false;
    return true;
  });

  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, dateRange, driverFilter, incidentFilter, riskFilter]);

  const totalPages = Math.ceil(filteredTrips.length / PAGE_SIZE);
  const paginatedTrips = filteredTrips.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleResetFilters = () => {
    setSearchQuery("");
    setDateRange("30days");
    setDriverFilter("all");
    setIncidentFilter("all");
    setRiskFilter("all");
  };

  const getScoreTone = (score: number): Tone => {
    if (score >= 90) return "success";
    if (score >= 80) return "primary";
    if (score >= 70) return "warning";
    return "destructive";
  };

  const getRiskTone = (risk: string): Tone => {
    if (risk === "Low") return "success";
    if (risk === "Medium") return "warning";
    return "destructive";
  };

  const getEventBadgeTone = (severity: TimelineEventItem["severity"]): Tone => {
    switch (severity) {
      case "Info":
        return "primary";
      case "Low":
        return "success";
      case "Medium":
        return "warning";
      case "High":
        return "warning";
      case "Critical":
        return "destructive";
      default:
        return "primary";
    }
  };

  return (
    <Page
      title="Trip Reports"
      description="Search and review completed deliveries, driving behaviour and incident reports."
      actions={
        <>
          <StatusPill tone="primary" pulse>
            Live Database • 528 Trips
          </StatusPill>
          <button className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer">
            <ShieldAlert className="size-4" /> Investigate Incident
          </button>
          <MagneticButton variant="primary" icon={<Download className="size-4" />}>
            Export Reports
          </MagneticButton>
        </>
      }
    >
      {/* SEAMLESS VIEW TOGGLE: DETAIL VIEW VS MAIN TRIP LIST */}
      <AnimatePresence mode="wait">
        {selectedTrip ? (
          /* ===================================================
             TRIP REPORT DETAIL VIEW (SELECTED TRIP)
             =================================================== */
          <motion.div
            key="trip-detail"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={stagger(0.06, 0.04)}
            className="space-y-6 pb-16"
          >
            {/* Navigation Back Header (Clean Header without duplicate Export) */}
            <motion.div variants={fadeUp} className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedTripId(null)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface/80 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all cursor-pointer"
                >
                  <ArrowLeft className="size-4" /> Back to Trip List
                </button>
                <span className="text-xs text-muted-foreground">/</span>
                <span className="text-xs font-mono font-bold text-primary">{selectedTrip.tripId}</span>
                <StatusPill tone="success">{selectedTrip.status}</StatusPill>
              </div>
            </motion.div>

            {/* A. TRIP OVERVIEW (COMPACT HORIZONTAL LAYOUT) */}
            <motion.div variants={fadeUp}>
              <GlassPanel title="Trip Overview" subtitle="Key trip specifications & driving score summary" hoverable={false}>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 text-xs">
                  <div className="p-2.5 rounded-xl bg-surface-2/40 border border-border/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Trip ID</span>
                    <span className="text-sm font-bold text-primary font-mono block mt-0.5">{selectedTrip.tripId}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-2/40 border border-border/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Driver</span>
                    <span className="text-sm font-bold text-foreground block mt-0.5">{selectedTrip.driver}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-2/40 border border-border/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Assigned Vehicle</span>
                    <span className="text-xs font-semibold text-muted-foreground block mt-0.5 truncate">{selectedTrip.vehicle}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-2/40 border border-border/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Delivery ID</span>
                    <span className="text-xs font-bold text-foreground font-mono block mt-0.5">{selectedTrip.deliveryId}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-2/40 border border-border/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Date</span>
                    <span className="text-xs font-semibold text-foreground block mt-0.5">{selectedTrip.completionDate}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-2/40 border border-border/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Duration</span>
                    <span className="text-xs font-semibold text-foreground block mt-0.5">{selectedTrip.duration}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-2/40 border border-border/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Distance</span>
                    <span className="text-xs font-semibold text-foreground block mt-0.5">{selectedTrip.distance}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/30">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">Driving Score</span>
                    <span className="text-base font-extrabold text-primary font-mono block mt-0.5">{selectedTrip.drivingScore} <span className="text-[10px] text-muted-foreground font-normal">/ 100</span></span>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>

            {/* B. ROUTE OVERVIEW (LEFT & RIGHT SPLIT) */}
            <motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-12">
              {/* Left Side: Visual Route Representation */}
              <GlassPanel className="lg:col-span-7" title="Route Overview" subtitle="Pickup point, transit path & drop-off location" hoverable={false}>
                <div className="rounded-2xl border border-primary/30 bg-surface-2/40 p-4 sm:p-5 space-y-4 shadow-inner">
                  {/* Pickup */}
                  <div className="flex items-start gap-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary border border-primary/30 shadow-[var(--shadow-glow)]">
                      <Package className="size-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Pickup Location</span>
                      <p className="text-sm font-bold text-foreground mt-0.5">{selectedTrip.pickupLocation}</p>
                    </div>
                  </div>

                  {/* Path Visual Graphic */}
                  <div className="relative pl-4 py-1 flex items-center gap-3">
                    <div className="h-10 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-success ml-0.5" />
                    <div className="flex items-center gap-2 rounded-xl bg-surface/80 px-3 py-1.5 border border-border text-xs text-muted-foreground">
                      <RouteIcon className="size-4 text-primary" />
                      <span>{selectedTrip.distance} • Transit route via NH48 highway</span>
                    </div>
                  </div>

                  {/* Drop-off */}
                  <div className="flex items-start gap-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-success/15 text-success border border-success/30 shadow-[var(--shadow-glow)]">
                      <MapPin className="size-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-success">Drop-off Location</span>
                      <p className="text-sm font-bold text-foreground mt-0.5">{selectedTrip.dropLocation}</p>
                    </div>
                  </div>
                </div>
              </GlassPanel>

              {/* Right Side: Trip Timeline Summary */}
              <GlassPanel className="lg:col-span-5" title="Trip Timeline Summary" subtitle="Actual event time range" hoverable={false}>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface/60">
                    <span className="text-muted-foreground font-medium flex items-center gap-2">
                      <Clock className="size-4 text-primary" /> Trip Started
                    </span>
                    <span className="font-bold text-foreground font-mono">{selectedTrip.startTime}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface/60">
                    <span className="text-muted-foreground font-medium flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-success" /> Delivery Completed
                    </span>
                    <span className="font-bold text-foreground font-mono">{selectedTrip.endTime}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-primary/20 bg-primary/5">
                    <span className="text-primary font-bold flex items-center gap-2">
                      <Timer className="size-4" /> Total Duration
                    </span>
                    <span className="font-extrabold text-primary font-mono text-sm">{selectedTrip.duration}</span>
                  </div>

                  <div className="pt-2 text-center text-[11px] text-muted-foreground">
                    Time range: <strong className="text-foreground">{selectedTrip.startTime} – {selectedTrip.endTime}</strong>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>

            {/* C. DRIVING BEHAVIOUR SUMMARY */}
            <motion.div variants={fadeUp}>
              <GlassPanel title="Driving Behaviour Summary" subtitle="Telemetry event counts, risk levels & prior trip comparisons" hoverable={false}>
                <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 text-xs">
                  {/* Speeding */}
                  <div className="rounded-2xl border border-border bg-surface/80 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-muted-foreground text-[11px] uppercase tracking-wider">Speeding Events</span>
                      <StatusPill tone={getRiskTone(selectedTrip.behaviour.speeding.risk)}>{selectedTrip.behaviour.speeding.risk} Risk</StatusPill>
                    </div>
                    <span className="text-2xl font-extrabold text-foreground block">{selectedTrip.behaviour.speeding.count} events</span>
                    <span className="text-[11px] text-muted-foreground block">{selectedTrip.behaviour.speeding.diff}</span>
                    <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(100, selectedTrip.behaviour.speeding.count * 33)}%` }} />
                    </div>
                  </div>

                  {/* Harsh Braking */}
                  <div className="rounded-2xl border border-border bg-surface/80 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-muted-foreground text-[11px] uppercase tracking-wider">Harsh Braking</span>
                      <StatusPill tone={getRiskTone(selectedTrip.behaviour.braking.risk)}>{selectedTrip.behaviour.braking.risk} Risk</StatusPill>
                    </div>
                    <span className="text-2xl font-extrabold text-foreground block">{selectedTrip.behaviour.braking.count} events</span>
                    <span className="text-[11px] text-muted-foreground block">{selectedTrip.behaviour.braking.diff}</span>
                    <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, selectedTrip.behaviour.braking.count * 33)}%` }} />
                    </div>
                  </div>

                  {/* Rapid Acceleration */}
                  <div className="rounded-2xl border border-border bg-surface/80 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-muted-foreground text-[11px] uppercase tracking-wider">Rapid Acceleration</span>
                      <StatusPill tone={getRiskTone(selectedTrip.behaviour.acceleration.risk)}>{selectedTrip.behaviour.acceleration.risk} Risk</StatusPill>
                    </div>
                    <span className="text-2xl font-extrabold text-foreground block">{selectedTrip.behaviour.acceleration.count} events</span>
                    <span className="text-[11px] text-muted-foreground block">{selectedTrip.behaviour.acceleration.diff}</span>
                    <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min(100, selectedTrip.behaviour.acceleration.count * 33)}%` }} />
                    </div>
                  </div>

                  {/* Sharp Cornering */}
                  <div className="rounded-2xl border border-border bg-surface/80 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-muted-foreground text-[11px] uppercase tracking-wider">Sharp Cornering</span>
                      <StatusPill tone={getRiskTone(selectedTrip.behaviour.cornering.risk)}>{selectedTrip.behaviour.cornering.risk} Risk</StatusPill>
                    </div>
                    <span className="text-2xl font-extrabold text-foreground block">{selectedTrip.behaviour.cornering.count} events</span>
                    <span className="text-[11px] text-muted-foreground block">{selectedTrip.behaviour.cornering.diff}</span>
                    <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${Math.min(100, selectedTrip.behaviour.cornering.count * 50)}%` }} />
                    </div>
                  </div>

                  {/* Idle Time */}
                  <div className="rounded-2xl border border-border bg-surface/80 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-muted-foreground text-[11px] uppercase tracking-wider">Idle Time</span>
                      <StatusPill tone={getRiskTone(selectedTrip.behaviour.idleTime.risk)}>{selectedTrip.behaviour.idleTime.risk} Risk</StatusPill>
                    </div>
                    <span className="text-2xl font-extrabold text-foreground block">{selectedTrip.behaviour.idleTime.duration}</span>
                    <span className="text-[11px] text-muted-foreground block">{selectedTrip.behaviour.idleTime.diff}</span>
                    <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-blue-400 rounded-full w-1/4" />
                    </div>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>

            {/* D. DRIVING EVENT TIMELINE (COMPLETE VERTICAL TIMELINE WITH SEVERITY BADGES) */}
            <motion.div variants={fadeUp}>
              <GlassPanel title="Driving Event Timeline" subtitle="Vertical chronological timeline of all transit events and telemetry alerts during this specific trip" hoverable={false}>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {selectedTrip.timeline.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 text-xs">
                      {/* Marker */}
                      <span className={cn(
                        "absolute -left-6 grid size-5 place-items-center rounded-full border text-[10px] font-bold z-10",
                        item.severity === "Critical" ? "bg-destructive text-destructive-foreground border-destructive" :
                        item.severity === "High" ? "bg-rose-500 text-white border-rose-500" :
                        item.severity === "Medium" ? "bg-amber-500 text-black border-amber-500" :
                        item.severity === "Low" ? "bg-emerald-500 text-black border-emerald-500" :
                        "bg-primary text-primary-foreground border-primary"
                      )}>
                        {idx + 1}
                      </span>

                      <div className="flex-1 rounded-xl border border-border/80 bg-surface/80 p-3.5 space-y-1.5 shadow-sm">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-bold text-foreground text-sm flex items-center gap-2">
                            {item.severity === "Critical" && <ShieldAlert className="size-4 text-destructive shrink-0" />}
                            {item.severity === "High" && <AlertTriangle className="size-4 text-amber-400 shrink-0" />}
                            {item.severity === "Medium" && <AlertCircle className="size-4 text-amber-400 shrink-0" />}
                            {item.severity === "Low" && <Info className="size-4 text-emerald-400 shrink-0" />}
                            {item.severity === "Info" && <CheckCircle2 className="size-4 text-primary shrink-0" />}
                            {item.event}
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-mono text-xs font-semibold">{item.time}</span>
                            <StatusPill tone={getEventBadgeTone(item.severity)}>
                              {item.severity}
                            </StatusPill>
                          </div>
                        </div>

                        <p className="text-muted-foreground text-xs">
                          Location: <span className="text-foreground font-semibold">{item.location}</span>
                        </p>

                        {item.description && (
                          <div className={cn(
                            "text-xs p-2.5 rounded-xl border mt-1 font-medium leading-relaxed",
                            item.severity === "Critical" || item.severity === "High"
                              ? "bg-destructive/10 border-destructive/30 text-rose-300"
                              : item.severity === "Medium"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                              : "bg-primary/10 border-primary/20 text-primary"
                          )}>
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>

            {/* E. AI TRIP SUMMARY (COMPLETE & SPECIFIC ANALYSIS FOR SELECTED TRIP) */}
            <motion.div variants={fadeUp}>
              <GlassPanel
                title="E. AI Trip Summary"
                subtitle={`AI-generated analysis of selected trip ${selectedTrip.tripId} (${selectedTrip.driver})`}
                actions={<StatusPill tone="primary">AI Trip Analysis</StatusPill>}
                hoverable={false}
              >
                <div className="space-y-4">
                  {/* Analysis Quotes Cards */}
                  <div className="grid gap-3.5 sm:grid-cols-2 text-xs">
                    {/* Overall Performance */}
                    <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 space-y-2 shadow-sm">
                      <span className="text-primary font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
                        <Sparkles className="size-4" /> Overall Driving Performance
                      </span>
                      <blockquote className="text-foreground leading-relaxed font-semibold text-sm italic">
                        "{selectedTrip.aiSummary.overall}"
                      </blockquote>
                    </div>

                    {/* Harsh Braking & Speeding */}
                    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2 shadow-sm">
                      <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
                        <AlertTriangle className="size-4" /> Braking & Speeding Observations
                      </span>
                      <blockquote className="text-foreground leading-relaxed font-semibold text-sm italic">
                        "{selectedTrip.aiSummary.braking}"
                      </blockquote>
                    </div>

                    {/* Acceleration */}
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2 shadow-sm">
                      <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
                        <CheckCircle2 className="size-4" /> Throttle & Acceleration
                      </span>
                      <blockquote className="text-foreground leading-relaxed font-semibold text-sm italic">
                        "{selectedTrip.aiSummary.acceleration}"
                      </blockquote>
                    </div>

                    {/* Incident Observations */}
                    <div className="rounded-2xl border border-border/80 bg-surface-2/60 p-4 space-y-2 shadow-sm">
                      <span className="text-foreground font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
                        <Info className="size-4 text-primary" /> Incident & Delivery Context
                      </span>
                      <blockquote className="text-muted-foreground leading-relaxed font-semibold text-sm italic">
                        "{selectedTrip.aiSummary.incident}"
                      </blockquote>
                    </div>
                  </div>

                  {/* Route & Driver Comparison Note */}
                  <div className="rounded-2xl border border-border bg-surface/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary border border-primary/30">
                        <Zap className="size-4.5" />
                      </div>
                      <div>
                        <span className="font-bold text-foreground block">Route & Prior Trip Comparison</span>
                        <span className="text-muted-foreground">{selectedTrip.aiSummary.routeEfficiency}</span>
                      </div>
                    </div>
                    <StatusPill tone="success">Verified Telematics</StatusPill>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>

            {/* ACTION FOOTER */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
              <button
                onClick={() => setSelectedTripId(null)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface/80 px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ArrowLeft className="size-4" /> Back to Completed Trips
              </button>

              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 cursor-pointer">
                  <ShieldAlert className="size-4" /> Flag for Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* ===================================================
             MAIN TRIP REPORTS LIST VIEW
             =================================================== */
          <motion.div
            key="trip-list"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={stagger(0.06, 0.04)}
            className="space-y-5"
          >
            {/* 1. TRIP SUMMARY CARDS (3 HORIZONTAL SUMMARY CARDS MOVED FIRST) */}
            {loading ? (
              <LoadingGrid cards={3} />
            ) : (
              <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-3">
                {/* 1. Completed Trips */}
                <StatCard
                  label="Completed Trips"
                  value="528"
                  sub="Last 30 days"
                  delta="+6%"
                  trend="up"
                  icon={<RouteIcon className="size-4 text-primary" />}
                />

                {/* 2. Trips With Incidents */}
                <StatCard
                  label="Trips With Incidents"
                  value="12"
                  sub="2.3% of completed trips"
                  delta="-2"
                  trend="down"
                  icon={<AlertTriangle className="size-4 text-amber-400" />}
                />

                {/* 3. Average Driving Score */}
                <StatCard
                  label="Average Driving Score"
                  value="88.4"
                  unit="/ 100"
                  sub="+4.2 pts vs last month"
                  delta="+4.2"
                  trend="up"
                  icon={<Gauge className="size-4 text-primary" />}
                />
              </motion.div>
            )}

            {/* 2. SEARCH AND FILTERS SECTION (NOW APPEARS DIRECTLY AFTER SUMMARY CARDS) */}
            <motion.div variants={fadeUp}>
              <GlassPanel title="Search & Filter Completed Trips" subtitle="Filter by ID, driver, date range, incident status & driving score" hoverable={false}>
                <div className="space-y-4 text-xs">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Search Input */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Search</label>
                      <div className="relative">
                        <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Delivery ID, Trip ID, Driver..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-surface/50 pl-8 h-9 text-xs"
                        />
                      </div>
                    </div>

                    {/* Date Range Filter */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Date Range</label>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="bg-surface/50 h-9 text-xs">
                          <SelectValue placeholder="Date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30days">Last 30 Days</SelectItem>
                          <SelectItem value="7days">Last 7 Days</SelectItem>
                          <SelectItem value="this-month">This Month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Driver Filter */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Driver</label>
                      <Select value={driverFilter} onValueChange={setDriverFilter}>
                        <SelectTrigger className="bg-surface/50 h-9 text-xs">
                          <SelectValue placeholder="All drivers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Drivers</SelectItem>
                          <SelectItem value="Marcus Webb">Marcus Webb</SelectItem>
                          <SelectItem value="Rahul Sharma">Rahul Sharma</SelectItem>
                          <SelectItem value="Priya Nair">Priya Nair</SelectItem>
                          <SelectItem value="Aman Verma">Aman Verma</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Incident Reported Filter */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Incident Status</label>
                      <Select value={incidentFilter} onValueChange={setIncidentFilter}>
                        <SelectTrigger className="bg-surface/50 h-9 text-xs">
                          <SelectValue placeholder="Incident status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Trips</SelectItem>
                          <SelectItem value="incidents">Incidents Only</SelectItem>
                          <SelectItem value="no-incidents">No Incidents</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Risk Level:</span>
                      <div className="flex items-center gap-1.5">
                        {["all", "low", "medium", "high"].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setRiskFilter(lvl)}
                            className={cn(
                              "px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer",
                              riskFilter === lvl ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]" : "bg-surface-2/60 text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                    >
                      <RotateCcw className="size-3.5" /> Reset Filters
                    </button>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>

            {/* 3. COMPLETED TRIPS TABLE */}
            <motion.div variants={fadeUp}>
              <GlassPanel className="p-0" hoverable={false}>
                <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                      <CheckCircle2 className="size-5 text-primary" /> Completed Trips Directory
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Select any trip row or click "View Report" to open the detailed trip report.
                    </p>
                  </div>
                  <StatusPill tone="primary">{filteredTrips.length} Trips Displayed</StatusPill>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[840px] text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="px-5 py-4 font-medium">Trip ID</th>
                        <th className="px-5 py-4 font-medium">Delivery ID</th>
                        <th className="px-5 py-4 font-medium">Driver</th>
                        <th className="px-5 py-4 font-medium">Completion Date</th>
                        <th className="px-5 py-4 font-medium">Driving Score</th>
                        <th className="px-5 py-4 font-medium">Incident</th>
                        <th className="px-5 py-4 font-medium">Status</th>
                        <th className="px-5 py-4 font-medium text-right">Report</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTrips.map((t, i) => (
                        <motion.tr
                          key={t.tripId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          onClick={() => setSelectedTripId(t.tripId)}
                          className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2/50"
                        >
                          <td className="px-5 py-4 font-bold text-primary font-mono">{t.tripId}</td>
                          <td className="px-5 py-4 font-semibold text-foreground font-mono">{t.deliveryId}</td>
                          <td className="px-5 py-4 font-semibold text-foreground">{t.driver}</td>
                          <td className="px-5 py-4 text-xs text-muted-foreground">{t.completionDate}</td>
                          <td className="px-5 py-4">
                            <StatusPill tone={getScoreTone(t.drivingScore)}>
                              {t.drivingScore} / 100
                            </StatusPill>
                          </td>
                          <td className="px-5 py-4">
                            {t.hasIncident ? (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
                                <AlertTriangle className="size-3.5" /> Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-success/15 px-2.5 py-1 text-xs font-semibold text-success border border-success/30">
                                <CheckCircle2 className="size-3.5" /> No
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <StatusPill tone="success">{t.status}</StatusPill>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTripId(t.tripId);
                              }}
                              className="inline-flex items-center gap-1 rounded-xl border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition-all cursor-pointer"
                            >
                              View Report <ChevronRight className="size-3.5" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <DataPagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalItems={filteredTrips.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setPage}
                />

                {filteredTrips.length === 0 && (
                  <div className="py-12 text-center text-xs text-muted-foreground">
                    No completed trips match your filter criteria. Try resetting your search filters.
                  </div>
                )}
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  );
}
