import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { DataPagination } from "@/components/common/data-pagination";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertCircle,
  AlertTriangle,
  Award,
  Clock,
  Compass,
  Download,
  Fuel,
  Gauge,
  GraduationCap,
  Lightbulb,
  PackageCheck,
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
import { Page, Section } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatCard } from "@/components/fx/stat-card";
import { StatusPill } from "@/components/fx/status-pill";
import { MagneticButton } from "@/components/fx/magnetic-button";
import { LoadingGrid } from "@/components/fx/skeletons";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  behaviourSplit,
  deliveryVolume,
  drivers,
  fleetKpis,
  performanceTrend,
} from "@/data/fleet";
import { cn } from "@/lib/utils";

const chartTooltip = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    fontSize: "12px",
    color: "var(--popover-foreground)",
  },
};

// 1. TOP PERFORMING DRIVERS DATA
const topPerformingDrivers = [
  {
    rank: 1,
    name: "Rahul Sharma",
    city: "Pune, MH",
    score: 96,
    trend: "+3.4 pts",
    recommendedFor: "High-Value Deliveries",
    recommendedPillTone: "primary" as const,
    avatar: "RS",
  },
  {
    rank: 2,
    name: "Priya Nair",
    city: "Thane, MH",
    score: 94,
    trend: "+2.8 pts",
    recommendedFor: "Fragile Goods & Cold-Chain",
    recommendedPillTone: "success" as const,
    avatar: "PN",
  },
  {
    rank: 3,
    name: "Vikram Patil",
    city: "Mumbai, MH",
    score: 91,
    trend: "+1.5 pts",
    recommendedFor: "Long-Distance Routes",
    recommendedPillTone: "info" as const,
    avatar: "VP",
  },
  {
    rank: 4,
    name: "Imran Sheikh",
    city: "Bhiwandi, MH",
    score: 89,
    trend: "+4.2 pts",
    recommendedFor: "Priority Expedited Cargo",
    recommendedPillTone: "warning" as const,
    avatar: "IS",
  },
  {
    rank: 5,
    name: "Suresh Kumar",
    city: "Navi Mumbai, MH",
    score: 88,
    trend: "+0.9 pts",
    recommendedFor: "Heavy Commercial Freight",
    recommendedPillTone: "muted" as const,
    avatar: "SK",
  },
];

// 2. DRIVERS REQUIRING COACHING DATA
const coachingDrivers = [
  {
    name: "Aman Verma",
    city: "Nashik, MH",
    score: 74,
    trend: "-4.8 pts",
    area: "Night Speeding & Following Distance",
    reason: "71% of late-night speeding events recorded across the last 14 days on NH3 highway.",
    suggestedAction: "Schedule 15-min defensive driving & speed awareness module.",
    actionLabel: "Schedule Coaching",
    avatar: "AV",
  },
  {
    name: "Rohan Gupta",
    city: "Pune, MH",
    score: 78,
    trend: "-3.2 pts",
    area: "Harsh Braking & Sudden Acceleration",
    reason: "14 harsh deceleration telemetry alerts registered during urban transit stops.",
    suggestedAction: "Conduct vehicle brake sensor calibration & smooth driving review.",
    actionLabel: "Review Telemetry",
    avatar: "RG",
  },
  {
    name: "Sanjay Verma",
    city: "Bhiwandi, MH",
    score: 81,
    trend: "-2.1 pts",
    area: "Low On-Time SLA & Route Detours",
    reason: "3 consecutive late arrivals on Mumbai–Pune corridor due to unverified detours.",
    suggestedAction: "Re-assign route schedule & provide GPS navigation coaching.",
    actionLabel: "Re-assign Schedule",
    avatar: "SV",
  },
];

// 3. RECOMMENDED ACTIONS CARDS DATA
const recommendedActionCards = [
  {
    title: "Drivers Requiring Coaching",
    icon: AlertTriangle,
    iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    count: "4 Drivers",
    reason: "Recurring score decline or unsafe night-hour driving behaviour.",
    driverChips: ["Aman Verma", "Rohan Gupta", "Sanjay Verma", "Karan Singh"],
    suggestedAction: "Schedule coaching sessions and temporarily reduce high-risk night assignments.",
    actionButton: "Schedule Coaching",
  },
  {
    title: "High-Value Delivery Candidates",
    icon: ShieldCheck,
    iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    count: "6 Drivers",
    reason: "Strong safety, reliability and performance scores consistently above 92.",
    driverChips: ["Priya Nair", "Rahul Sharma", "Vikram Patil", "Suresh Kumar"],
    suggestedAction: "Prioritize these drivers for premium, temperature-controlled, or high-value freight.",
    actionButton: "Assign High-Value",
  },
  {
    title: "Fragile Goods Restrictions",
    icon: PackageCheck,
    iconColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    count: "3 Drivers",
    reason: "Higher-than-average handling incidents or harsh vehicle acceleration telemetry.",
    driverChips: ["Rohan Gupta", "Sanjay Verma", "Deepak Joshi"],
    suggestedAction: "Temporarily avoid assigning fragile goods deliveries until score improvement is observed.",
    actionButton: "View Restrictions",
  },
  {
    title: "Most Improved Drivers",
    icon: TrendingUp,
    iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    count: "5 Drivers",
    reason: "Significant score improvement (+8.5 pts average) during recent 30-day evaluation period.",
    driverChips: ["Imran Sheikh", "Deepak Joshi", "Vikram Patil"],
    suggestedAction: "Recognize performance and consider assigning more complex or higher-paying routes.",
    actionButton: "Review Performance",
  },
  {
    title: "Long-Distance Delivery Recommendations",
    icon: Compass,
    iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    count: "8 Drivers",
    reason: "Strong long-distance endurance, excellent route adherence, and low fatigue risk indicators.",
    driverChips: ["Vikram Patil", "Suresh Kumar", "Rahul Sharma"],
    suggestedAction: "Prioritize for suitable inter-city highways and long-distance delivery assignments.",
    actionButton: "Assign Long-Distance",
  },
];

export function FleetReportPage() {
  const loading = useSimulatedLoading(550);
  const navigate = useNavigate();

  // Modal States
  const [coachingModalOpen, setCoachingModalOpen] = useState(false);
  const [selectedCoachingDriver, setSelectedCoachingDriver] = useState("Aman Verma");
  const [coachingModule, setCoachingModule] = useState("Defensive Driving & Speed Awareness");
  const [coachingDate, setCoachingDate] = useState("2026-09-15T10:00");
  const [coachingNotes, setCoachingNotes] = useState("Focus on night highway speed limit compliance and telemetry alerts.");

  const [highValueModalOpen, setHighValueModalOpen] = useState(false);
  const [selectedHighValueDriver, setSelectedHighValueDriver] = useState("Priya Nair");
  const [freightType, setFreightType] = useState("Pharmaceuticals Cold-Chain");
  const [assignmentRoute, setAssignmentRoute] = useState("MH-14 Pune to Mumbai Express Hub");

  const [restrictionsModalOpen, setRestrictionsModalOpen] = useState(false);
  const [activeRestrictionsDriver, setActiveRestrictionsDriver] = useState("Rohan Gupta");

  const [performanceModalOpen, setPerformanceModalOpen] = useState(false);

  const [longDistanceModalOpen, setLongDistanceModalOpen] = useState(false);
  const [selectedLongDistanceDriver, setSelectedLongDistanceDriver] = useState("Vikram Patil");
  const [highwayCorridor, setHighwayCorridor] = useState("NH48 Mumbai - Pune - Bengaluru Highway");
  const [vehicleAssigned, setVehicleAssigned] = useState("MH-12-FC-4921 (Tata Prima Container)");

  const handleCardAction = (actionButton: string) => {
    switch (actionButton) {
      case "Schedule Coaching":
        setSelectedCoachingDriver("Aman Verma");
        setCoachingModalOpen(true);
        break;
      case "Assign High-Value":
        setSelectedHighValueDriver("Priya Nair");
        setHighValueModalOpen(true);
        break;
      case "View Restrictions":
        setActiveRestrictionsDriver("Rohan Gupta");
        setRestrictionsModalOpen(true);
        break;
      case "Review Performance":
        setPerformanceModalOpen(true);
        break;
      case "Assign Long-Distance":
        setSelectedLongDistanceDriver("Vikram Patil");
        setLongDistanceModalOpen(true);
        break;
      default:
        toast.info(`Action triggered: ${actionButton}`);
    }
  };

  const handleCoachingDriverAction = (actionLabel: string, driverName: string) => {
    if (actionLabel === "Schedule Coaching") {
      setSelectedCoachingDriver(driverName);
      setCoachingModalOpen(true);
    } else if (actionLabel === "Review Telemetry") {
      setActiveRestrictionsDriver(driverName);
      setRestrictionsModalOpen(true);
    } else if (actionLabel === "Re-assign Schedule") {
      setSelectedLongDistanceDriver(driverName);
      setLongDistanceModalOpen(true);
    } else {
      toast.info(`${actionLabel} for ${driverName}`);
    }
  };

  const [topDriverPage, setTopDriverPage] = useState(1);
  const TOP_DRIVER_PAGE_SIZE = 5;
  const totalTopDriverPages = Math.ceil(topPerformingDrivers.length / TOP_DRIVER_PAGE_SIZE);
  const paginatedTopDrivers = topPerformingDrivers.slice((topDriverPage - 1) * TOP_DRIVER_PAGE_SIZE, topDriverPage * TOP_DRIVER_PAGE_SIZE);

  return (
    <Page
      title="How the fleet is really performing"
      description="Live intelligence report & overall company analytics across drivers, deliveries, and telemetry for the last 30 days."
      actions={
        <>
          <StatusPill tone="primary" pulse>
            Live Sync • Updated 2 min ago
          </StatusPill>
          <MagneticButton
            variant="primary"
            icon={<Download className="size-4" />}
            onClick={() => toast.success("Fleet intelligence report export started (PDF/CSV)")}
          >
            Export Report
          </MagneticButton>
        </>
      }
    >
      {/* 1. TOP SUMMARY METRICS (5 CARDS) */}
      {loading ? (
        <LoadingGrid cards={5} />
      ) : (
        <div className="grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-5">
          {/* Card 1: Fleet Score */}
          <div className="rounded-2xl border border-border bg-surface/80 p-4 shadow-sm backdrop-blur-xl transition-all hover:border-primary/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Fleet Score</span>
                <span className="grid size-7 place-items-center rounded-lg bg-primary/12 text-primary">
                  <Gauge className="size-4" />
                </span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-foreground tracking-tight">88.4</span>
                <span className="text-xs text-muted-foreground font-medium">/ 100</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-xs">
              <span className="text-[11px] text-muted-foreground">Average Fleet Score</span>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-success">
                <TrendingUp className="size-3.5" /> +4.2 pts
              </span>
            </div>
          </div>

          {/* Card 2: Active Drivers */}
          <StatCard
            label="Active Drivers"
            value="142"
            sub="98% on-duty rate"
            delta="+8"
            trend="up"
            icon={<Users className="size-4 text-primary" />}
          />

          {/* Card 3: Completed Deliveries & Distance Covered */}
          <div className="rounded-2xl border border-border bg-surface/80 p-4 shadow-sm backdrop-blur-xl transition-all hover:border-primary/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Completed Deliveries</span>
                <span className="grid size-7 place-items-center rounded-lg bg-primary/12 text-primary">
                  <Truck className="size-4" />
                </span>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-foreground tracking-tight">1,248</span>
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-success">
                  <TrendingUp className="size-3.5" /> +12%
                </span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border/50 text-xs">
              <span className="text-[11px] font-semibold text-muted-foreground">18,320 km covered</span>
            </div>
          </div>

          {/* Card 4: On-Time Rate */}
          <StatCard
            label="On-Time Rate"
            value="94.2"
            unit="%"
            sub="Target: 92.0%"
            delta="+1.8%"
            trend="up"
            icon={<Timer className="size-4 text-primary" />}
          />

          {/* Card 5: Open Concerns */}
          <StatCard
            label="Open Concerns"
            value="3"
            sub="Requires manager review"
            delta="-2"
            trend="down"
            icon={<AlertTriangle className="size-4 text-amber-400" />}
          />
        </div>
      )}

      {/* 2. PERFORMANCE ANALYSIS (CHARTS & VISUALIZATIONS) */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <GlassPanel
          className="lg:col-span-2"
          title="Performance Trend"
          subtitle="Composite fleet score vs. target score"
          actions={<StatusPill tone="success">+17 pts since Dec</StatusPill>}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrend}>
                <defs>
                  <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} domain={[60, 100]} />
                <Tooltip {...chartTooltip} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  fill="url(#scoreFill)"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="var(--chart-2)"
                  strokeDasharray="5 5"
                  strokeWidth={1.5}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel title="Driving Behaviour" subtitle="Share of telemetry flagged events">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={behaviourSplit}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={95}
                  paddingAngle={4}
                  stroke="none"
                >
                  {behaviourSplit.map((_, i) => (
                    <Cell key={i} fill={`var(--chart-${i + 1})`} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }}
                />
                <Tooltip {...chartTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <GlassPanel className="lg:col-span-3" title="Weekly Trip & Delivery Volume" subtitle="Completed vs. delayed shipments across all regional corridors">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryVolume} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip {...chartTooltip} cursor={{ fill: "var(--surface-2)", opacity: 0.4 }} />
                <Bar dataKey="completed" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="delayed" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>

      {/* 3. TOP PERFORMING DRIVERS */}
      <GlassPanel className="mt-4 p-0" hoverable={false}>
        <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <Award className="size-5 text-primary" /> Top Performing Drivers
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Highest scoring drivers with performance trends & route/freight suitability recommendations.
            </p>
          </div>
          <StatusPill tone="success">Top 5 Leaderboard</StatusPill>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-4 font-medium w-16">Rank</th>
                <th className="px-5 py-4 font-medium">Driver</th>
                <th className="px-5 py-4 font-medium">Driver Score</th>
                <th className="px-5 py-4 font-medium">Trend</th>
                <th className="px-5 py-4 font-medium">Recommended For</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTopDrivers.map((drv, i) => (
                <motion.tr
                  key={drv.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2/40"
                >
                  <td className="px-5 py-4 font-extrabold text-foreground">
                    <span className={cn(
                      "grid size-7 place-items-center rounded-lg text-xs font-extrabold",
                      drv.rank === 1 ? "bg-amber-400/20 text-amber-300 border border-amber-400/30" :
                      drv.rank === 2 ? "bg-slate-300/20 text-slate-200 border border-slate-300/30" :
                      drv.rank === 3 ? "bg-amber-700/20 text-amber-400 border border-amber-700/30" :
                      "bg-surface-2 text-muted-foreground"
                    )}>
                      #{drv.rank}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-xl bg-primary/15 font-bold text-xs text-primary border border-primary/20">
                        {drv.avatar}
                      </span>
                      <div>
                        <span className="font-bold text-foreground block text-sm">{drv.name}</span>
                        <span className="text-xs text-muted-foreground">{drv.city}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 font-extrabold text-base text-primary font-mono">
                    {drv.score} <span className="text-xs text-muted-foreground font-normal">/ 100</span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2.5 py-1 rounded-lg border border-success/20">
                      <TrendingUp className="size-3.5" /> {drv.trend}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <StatusPill tone={drv.recommendedPillTone}>
                      {drv.recommendedFor}
                    </StatusPill>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <DataPagination
          currentPage={topDriverPage}
          totalPages={totalTopDriverPages}
          totalItems={topPerformingDrivers.length}
          pageSize={TOP_DRIVER_PAGE_SIZE}
          onPageChange={setTopDriverPage}
        />
      </GlassPanel>

      {/* 4. DRIVERS REQUIRING COACHING SECTION */}
      <GlassPanel className="mt-4 p-0 border-amber-500/30 bg-amber-500/5" hoverable={false}>
        <div className="p-4 sm:p-5 border-b border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <GraduationCap className="size-5 text-amber-400" /> Drivers Requiring Coaching
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Identify drivers with declining safety scores or telemetry alerts needing dispatcher intervention.
            </p>
          </div>
          <StatusPill tone="warning">3 Intervention Alerts</StatusPill>
        </div>

        <div className="p-4 sm:p-5 grid gap-4 grid-cols-1 md:grid-cols-3">
          {coachingDrivers.map((drv, i) => (
            <motion.div
              key={drv.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-amber-500/20 bg-surface/90 p-4 space-y-3 shadow-md flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-xl bg-amber-500/15 text-amber-400 font-bold text-xs border border-amber-500/30">
                      {drv.avatar}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-foreground text-sm">{drv.name}</h4>
                      <span className="text-[11px] text-muted-foreground">{drv.city}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-amber-400 font-mono block">{drv.score}</span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-destructive">
                      <TrendingDown className="size-3" /> {drv.trend}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="size-3.5 shrink-0" />
                  <span>Area: {drv.area}</span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Reason:</strong> {drv.reason}
                </p>

                <div className="text-xs text-foreground/90 bg-surface-2/60 p-2.5 rounded-xl border border-border/60">
                  <strong className="text-primary block text-[11px] uppercase tracking-wider mb-0.5">Suggested Action</strong>
                  {drv.suggestedAction}
                </div>
              </div>

              <button
                onClick={() => handleCoachingDriverAction(drv.actionLabel, drv.name)}
                className="w-full mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 py-2 px-3 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
              >
                <GraduationCap className="size-4" /> {drv.actionLabel}
              </button>
            </motion.div>
          ))}
        </div>
      </GlassPanel>

      {/* 5. FLEET INTELLIGENCE INSIGHTS */}
      <Section className="mt-4">
        <GlassPanel
          title="Fleet Intelligence Insights"
          subtitle="AI-detected patterns, trends, risks, operational bottlenecks, and overall fleet performance analysis"
          actions={<StatusPill tone="primary">Fleet-Wide Intelligence</StatusPill>}
          hoverable={false}
        >
          <div className="grid gap-3.5 grid-cols-1 md:grid-cols-2">
            {[
              {
                icon: TrendingUp,
                title: "Overall Fleet Performance & Score Trends",
                body: "Fleet composite score improved +4.2 points month-over-month, driven primarily by a 12% reduction in harsh braking events across urban routes.",
                badge: "Positive Trend",
                tone: "success" as const,
              },
              {
                icon: Clock,
                title: "Delivery Efficiency & Corridor Bottlenecks",
                body: "On-time arrival rate dipped 1.4% on the Mumbai–Pune corridor between 4 PM–7 PM due to toll plaza congestion. Shifting 3 afternoon departures to 2:30 PM recovers 84% of lost transit time.",
                badge: "Efficiency Opportunity",
                tone: "warning" as const,
              },
              {
                icon: Zap,
                title: "Regional On-Time SLA Distribution",
                body: "Western region corridors achieved 96.8% SLA compliance. Southern routes experienced a 3.2% increase in idle time during loading dock handovers.",
                badge: "Regional Analysis",
                tone: "info" as const,
              },
              {
                icon: AlertCircle,
                title: "Fleet Risk Patterns & Night Telemetry",
                body: "71% of night-hour speeding alerts originated from 5 specific transit legs after 9 PM. Targeted micro-coaching is projected to reduce overall fleet risk exposure by 22%.",
                badge: "Risk Mitigation",
                tone: "destructive" as const,
              },
            ].map((insight) => (
              <div
                key={insight.title}
                className="rounded-2xl border border-border/80 bg-surface/90 p-4 space-y-2.5 transition-all hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-xl bg-primary/12 text-primary">
                      <insight.icon className="size-4" />
                    </span>
                    <h4 className="font-bold text-foreground text-sm">{insight.title}</h4>
                  </div>
                  <StatusPill tone={insight.tone}>{insight.badge}</StatusPill>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-10">
                  {insight.body}
                </p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </Section>

      {/* 6. RECOMMENDED ACTIONS */}
      <Section className="mt-4">
        <GlassPanel
          title="Recommended Actions"
          subtitle="Actionable AI-generated suggestions and dispatcher recommendation cards"
          actions={<StatusPill tone="primary">5 Action Cards</StatusPill>}
          hoverable={false}
        >
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {recommendedActionCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl border border-border bg-surface/90 p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-primary/40 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className={cn("grid size-9 place-items-center rounded-xl border shadow-sm", card.iconColor)}>
                          <Icon className="size-5" />
                        </span>
                        <div>
                          <h4 className="font-extrabold text-foreground text-sm leading-tight">{card.title}</h4>
                          <span className="text-[11px] font-bold text-primary">{card.count}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Reason</span>
                      <p className="text-xs text-muted-foreground leading-relaxed">{card.reason}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Relevant Drivers</span>
                      <div className="flex flex-wrap gap-1.5">
                        {card.driverChips.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-lg border border-border/80 bg-surface-2/60 px-2 py-0.5 text-[11px] font-semibold text-foreground"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-surface-2/40 p-3 space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">Suggested Action</span>
                      <p className="text-xs font-medium text-foreground leading-relaxed">{card.suggestedAction}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCardAction(card.actionButton)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary/90 transition-all cursor-pointer"
                  >
                    <UserCheck className="size-4" /> {card.actionButton}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </GlassPanel>
      </Section>

      {/* 1. Schedule Coaching Dialog */}
      <Dialog open={coachingModalOpen} onOpenChange={setCoachingModalOpen}>
        <DialogContent className="sm:max-w-[500px] border-amber-500/30 bg-surface/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <GraduationCap className="size-5 text-amber-400" />
              Schedule Driver Coaching Session
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Assign safety awareness modules and schedule 1-on-1 coaching for drivers with telemetry alerts.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Target Driver</label>
              <Select value={selectedCoachingDriver} onValueChange={setSelectedCoachingDriver}>
                <SelectTrigger className="w-full bg-surface-2/60 border-border">
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aman Verma">Aman Verma (Score: 74 - Night Speeding)</SelectItem>
                  <SelectItem value="Rohan Gupta">Rohan Gupta (Score: 78 - Harsh Braking)</SelectItem>
                  <SelectItem value="Sanjay Verma">Sanjay Verma (Score: 81 - Route Detours)</SelectItem>
                  <SelectItem value="Karan Singh">Karan Singh (Score: 76 - High Idle Time)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Coaching Module</label>
              <Select value={coachingModule} onValueChange={setCoachingModule}>
                <SelectTrigger className="w-full bg-surface-2/60 border-border">
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Defensive Driving & Speed Awareness">Defensive Driving & Speed Awareness</SelectItem>
                  <SelectItem value="Harsh Braking & Vehicle Calibration">Harsh Braking & Vehicle Calibration</SelectItem>
                  <SelectItem value="Urban Route Detours & SLA Compliance">Urban Route Detours & SLA Compliance</SelectItem>
                  <SelectItem value="Night Corridor Fatigue & Speeding Risk">Night Corridor Fatigue & Speeding Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Scheduled Date & Time</label>
              <Input
                type="datetime-local"
                value={coachingDate}
                onChange={(e) => setCoachingDate(e.target.value)}
                className="bg-surface-2/60 border-border text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Dispatcher Notes & Objectives</label>
              <Input
                value={coachingNotes}
                onChange={(e) => setCoachingNotes(e.target.value)}
                placeholder="Enter specific focus areas..."
                className="bg-surface-2/60 border-border text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setCoachingModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold"
              onClick={() => {
                const formattedDate = new Date(coachingDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                toast.success(`Coaching session scheduled for ${selectedCoachingDriver} on ${formattedDate}`);
                setCoachingModalOpen(false);
              }}
            >
              <GraduationCap className="size-4 mr-1.5" />
              Schedule Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Assign High-Value Dialog */}
      <Dialog open={highValueModalOpen} onOpenChange={setHighValueModalOpen}>
        <DialogContent className="sm:max-w-[500px] border-emerald-500/30 bg-surface/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <ShieldCheck className="size-5 text-emerald-400" />
              Assign High-Value & Cold-Chain Freight
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Prioritize top-performing drivers (Safety Score 90+) for premium, cold-chain, or fragile cargo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Select Candidate Driver</label>
              <Select value={selectedHighValueDriver} onValueChange={setSelectedHighValueDriver}>
                <SelectTrigger className="w-full bg-surface-2/60 border-border">
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rahul Sharma">Rahul Sharma (Score: 96 - Rank #1)</SelectItem>
                  <SelectItem value="Priya Nair">Priya Nair (Score: 94 - Rank #2)</SelectItem>
                  <SelectItem value="Vikram Patil">Vikram Patil (Score: 91 - Rank #3)</SelectItem>
                  <SelectItem value="Imran Sheikh">Imran Sheikh (Score: 89 - Rank #4)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Freight Category</label>
              <Select value={freightType} onValueChange={setFreightType}>
                <SelectTrigger className="w-full bg-surface-2/60 border-border">
                  <SelectValue placeholder="Select freight type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pharmaceuticals Cold-Chain">Pharmaceuticals Cold-Chain (2°C - 8°C)</SelectItem>
                  <SelectItem value="High-Value Electronics & Hardware">High-Value Electronics & Hardware</SelectItem>
                  <SelectItem value="Fragile Glassware & Precision Tools">Fragile Glassware & Precision Tools</SelectItem>
                  <SelectItem value="Priority Expedited Express Vault">Priority Expedited Express Vault</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Destination Corridor</label>
              <Select value={assignmentRoute} onValueChange={setAssignmentRoute}>
                <SelectTrigger className="w-full bg-surface-2/60 border-border">
                  <SelectValue placeholder="Select corridor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MH-14 Pune to Mumbai Express Hub">MH-14 Pune to Mumbai Express Hub</SelectItem>
                  <SelectItem value="Thane-Bhiwandi Pharma Logistics Center">Thane-Bhiwandi Pharma Logistics Center</SelectItem>
                  <SelectItem value="Navi Mumbai International Airport Freight Zone">Navi Mumbai Airport Freight Zone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setHighValueModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold"
              onClick={() => {
                toast.success(`Assigned ${freightType} to ${selectedHighValueDriver} for ${assignmentRoute}`);
                setHighValueModalOpen(false);
              }}
            >
              <ShieldCheck className="size-4 mr-1.5" />
              Assign Freight
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. View Restrictions Dialog */}
      <Dialog open={restrictionsModalOpen} onOpenChange={setRestrictionsModalOpen}>
        <DialogContent className="sm:max-w-[520px] border-rose-500/30 bg-surface/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <PackageCheck className="size-5 text-rose-400" />
              Fragile Goods & Dispatch Restrictions
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Review telematics risk flags and restriction policies currently applied to drivers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="size-4" /> Active Restrictions Log (3 Drivers)
                </span>
                <StatusPill tone="destructive">Restricted</StatusPill>
              </div>
              <p className="text-xs text-muted-foreground">
                Drivers listed below are temporarily restricted from fragile goods, high-value freight, or night express assignments due to telematics alerts.
              </p>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {[
                { name: "Rohan Gupta", score: 78, restriction: "Fragile Goods & Cold-Chain", reason: "14 harsh braking telematics alerts in urban transit." },
                { name: "Sanjay Verma", score: 81, restriction: "Time-Critical SLA Express", reason: "3 consecutive late arrivals on Mumbai-Pune corridor." },
                { name: "Deepak Joshi", score: 79, restriction: "Heavy Over-Dimensional Cargo", reason: "Excessive rapid acceleration events on slope gradients." },
              ].map((drv) => (
                <div
                  key={drv.name}
                  onClick={() => setActiveRestrictionsDriver(drv.name)}
                  className={cn(
                    "rounded-xl border p-3 cursor-pointer transition-all space-y-1",
                    activeRestrictionsDriver === drv.name
                      ? "border-rose-500/60 bg-rose-500/15"
                      : "border-border/60 bg-surface-2/40 hover:border-rose-500/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-foreground text-xs">{drv.name}</span>
                    <span className="text-xs font-bold text-rose-400 font-mono">Score: {drv.score}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    <strong className="text-foreground">Restriction:</strong> {drv.restriction}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    <strong className="text-foreground">Trigger:</strong> {drv.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setRestrictionsModalOpen(false)}>
              Close
            </Button>
            <Button
              size="sm"
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold"
              onClick={() => {
                toast.success(`Restrictions acknowledged and updated for ${activeRestrictionsDriver}`);
                setRestrictionsModalOpen(false);
              }}
            >
              <PackageCheck className="size-4 mr-1.5" />
              Acknowledge & Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Review Performance Dialog */}
      <Dialog open={performanceModalOpen} onOpenChange={setPerformanceModalOpen}>
        <DialogContent className="sm:max-w-[500px] border-cyan-500/30 bg-surface/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <TrendingUp className="size-5 text-cyan-400" />
              Most Improved Drivers - 30-Day Evaluation
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Recognize top score improvement trends and manage driver commendations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs text-cyan-300">Average Growth Rate</h5>
                <p className="text-xs text-muted-foreground">+8.5 pts average improvement across 5 evaluated drivers</p>
              </div>
              <span className="text-lg font-extrabold text-cyan-400 font-mono">+8.5</span>
            </div>

            <div className="space-y-2">
              {[
                { name: "Imran Sheikh", trend: "+4.2 pts", score: 89, category: "Expedited Cargo Specialist" },
                { name: "Deepak Joshi", trend: "+3.8 pts", score: 79, category: "Urban Route Efficiency" },
                { name: "Vikram Patil", trend: "+1.5 pts", score: 91, category: "Highway Corridor Endurance" },
              ].map((d) => (
                <div key={d.name} className="flex items-center justify-between rounded-xl border border-border/60 bg-surface-2/40 p-3">
                  <div>
                    <div className="font-bold text-xs text-foreground">{d.name}</div>
                    <div className="text-[11px] text-muted-foreground">{d.category}</div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-md">
                      <TrendingUp className="size-3" /> {d.trend}
                    </span>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">Score: {d.score}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPerformanceModalOpen(false);
                navigate({ to: "/manager/drivers" });
              }}
            >
              <Users className="size-4 mr-1.5" />
              View Drivers Directory
            </Button>
            <Button
              size="sm"
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
              onClick={() => {
                toast.success("Performance commendations and recognition bonuses issued to top drivers!");
                setPerformanceModalOpen(false);
              }}
            >
              <Award className="size-4 mr-1.5" />
              Issue Recognition Bonus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Assign Long-Distance Dialog */}
      <Dialog open={longDistanceModalOpen} onOpenChange={setLongDistanceModalOpen}>
        <DialogContent className="sm:max-w-[500px] border-blue-500/30 bg-surface/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Compass className="size-5 text-blue-400" />
              Assign Long-Distance Highway Corridors
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Dispatch high-endurance drivers to suitable inter-city highways and multi-state transit routes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Select Endurance Driver</label>
              <Select value={selectedLongDistanceDriver} onValueChange={setSelectedLongDistanceDriver}>
                <SelectTrigger className="w-full bg-surface-2/60 border-border">
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vikram Patil">Vikram Patil (Score: 91 - Long-Distance Specialist)</SelectItem>
                  <SelectItem value="Suresh Kumar">Suresh Kumar (Score: 88 - Heavy Commercial)</SelectItem>
                  <SelectItem value="Rahul Sharma">Rahul Sharma (Score: 96 - Inter-City Master)</SelectItem>
                  <SelectItem value="Imran Sheikh">Imran Sheikh (Score: 89 - Night/Highway Certified)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Highway Corridor</label>
              <Select value={highwayCorridor} onValueChange={setHighwayCorridor}>
                <SelectTrigger className="w-full bg-surface-2/60 border-border">
                  <SelectValue placeholder="Select highway corridor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NH48 Mumbai - Pune - Bengaluru Highway">NH48 Mumbai - Pune - Bengaluru Highway</SelectItem>
                  <SelectItem value="NH3 Mumbai - Nashik Intercity Expressway">NH3 Mumbai - Nashik Intercity Expressway</SelectItem>
                  <SelectItem value="NH66 Konkan Coast Delivery Route">NH66 Konkan Coast Delivery Route</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Assigned Commercial Vehicle</label>
              <Select value={vehicleAssigned} onValueChange={setVehicleAssigned}>
                <SelectTrigger className="w-full bg-surface-2/60 border-border">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MH-12-FC-4921 (Tata Prima Container)">MH-12-FC-4921 (Tata Prima Container)</SelectItem>
                  <SelectItem value="MH-04-EV-8820 (BharatBenz Heavy Hauler)">MH-04-EV-8820 (BharatBenz Heavy Hauler)</SelectItem>
                  <SelectItem value="MH-43-AK-1029 (Eicher Pro 6028 Multi-Axle)">MH-43-AK-1029 (Eicher Pro 6028 Multi-Axle)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setLongDistanceModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold"
              onClick={() => {
                toast.success(`Dispatched ${selectedLongDistanceDriver} on ${highwayCorridor}`);
                setLongDistanceModalOpen(false);
              }}
            >
              <Compass className="size-4 mr-1.5" />
              Dispatch Route
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
