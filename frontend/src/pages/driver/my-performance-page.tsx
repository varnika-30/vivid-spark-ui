import { useState } from "react";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertCircle,
  AlertTriangle,
  Award,
  CheckCircle2,
  Lightbulb,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatCard } from "@/components/fx/stat-card";
import { StatusPill } from "@/components/fx/status-pill";
import { FilterChips } from "@/components/fx/controls";
import { drivers } from "@/data/fleet";
import { cn } from "@/lib/utils";
import { RaiseConcernModal } from "@/components/driver/raise-concern-modal";
import type { SystemDetectedEvent } from "@/data/concerns";

const toneClass = {
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  destructive: "bg-destructive",
};

const timeFilters = [
  { value: "month", label: "This Month" },
  { value: "3months", label: "Last 3 Months" },
  { value: "year", label: "This Year" },
] as const;

interface BehaviourItem {
  label: string;
  value: number;
  tone: "success" | "warning" | "info" | "destructive";
}

const behavioursData: Record<string, BehaviourItem[]> = {
  month: [
    { label: "Harsh Braking", value: 82, tone: "warning" },
    { label: "Speeding", value: 46, tone: "success" },
    { label: "Rapid Acceleration", value: 68, tone: "info" },
    { label: "Cornering", value: 74, tone: "success" },
    { label: "Night Drive", value: 38, tone: "destructive" },
  ],
  "3months": [
    { label: "Harsh Braking", value: 76, tone: "success" },
    { label: "Speeding", value: 52, tone: "success" },
    { label: "Rapid Acceleration", value: 70, tone: "info" },
    { label: "Cornering", value: 78, tone: "success" },
    { label: "Night Drive", value: 42, tone: "warning" },
  ],
  year: [
    { label: "Harsh Braking", value: 80, tone: "info" },
    { label: "Speeding", value: 60, tone: "success" },
    { label: "Rapid Acceleration", value: 65, tone: "success" },
    { label: "Cornering", value: 72, tone: "success" },
    { label: "Night Drive", value: 45, tone: "destructive" },
  ],
};

const statsData: Record<string, { label: string; value: string; sub: string }[]> = {
  month: [
    { label: "Driver Score", value: "87", sub: "Top 12% of fleet" },
    { label: "Risk Level", value: "Low", sub: "Stable for 6 weeks" },
    { label: "Deliveries Completed", value: "24", sub: "This month" },
    { label: "Safety Grade", value: "A", sub: "Excellent" },
  ],
  "3months": [
    { label: "Driver Score", value: "85", sub: "Top 15% of fleet" },
    { label: "Risk Level", value: "Low", sub: "Stable for 3 months" },
    { label: "Deliveries Completed", value: "78", sub: "Last 3 months" },
    { label: "Safety Grade", value: "A", sub: "Consistently High" },
  ],
  year: [
    { label: "Driver Score", value: "83", sub: "Top 18% of fleet" },
    { label: "Risk Level", value: "Low", sub: "Stable for 2026" },
    { label: "Deliveries Completed", value: "245", sub: "This year" },
    { label: "Safety Grade", value: "A-", sub: "Solid Record" },
  ],
};

interface ChartPoint {
  periodLabel: string;
  score: number;
  delta: string;
  status: string;
}

const trendDataMap: Record<
  string,
  { subtitle: string; insight: string; data: ChartPoint[] }
> = {
  month: {
    subtitle: "Daily score progression for May 2026",
    insight: "Your performance score improved from 80 to 91 across May (+11 pts).",
    data: [
      { periodLabel: "May 1", score: 80, delta: "Baseline", status: "Month start" },
      { periodLabel: "May 5", score: 82, delta: "+2 from May 1", status: "Steady transit" },
      { periodLabel: "May 10", score: 84, delta: "+2 from May 5", status: "Improving" },
      { periodLabel: "May 15", score: 83, delta: "-1 from May 10", status: "Minor dip" },
      { periodLabel: "May 20", score: 86, delta: "+3 from May 15", status: "Strong recovery" },
      { periodLabel: "May 25", score: 89, delta: "+3 from May 20", status: "High score" },
      { periodLabel: "May 31", score: 91, delta: "+2 from May 25", status: "Optimal peak" },
    ],
  },
  "3months": {
    subtitle: "Checkpoint progression across Last 3 Months (Mar – May 2026)",
    insight: "Your score grew from 78 to 91 over the 3-month evaluation window (+13 pts).",
    data: [
      { periodLabel: "Mar 1", score: 78, delta: "Baseline", status: "Q1 start" },
      { periodLabel: "Mar 10", score: 80, delta: "+2 from Mar 1", status: "Improving" },
      { periodLabel: "Mar 20", score: 83, delta: "+3 from Mar 10", status: "Consistent" },
      { periodLabel: "Apr 1", score: 82, delta: "-1 from Mar 20", status: "Minor dip" },
      { periodLabel: "Apr 10", score: 84, delta: "+2 from Apr 1", status: "Steady growth" },
      { periodLabel: "Apr 20", score: 86, delta: "+2 from Apr 10", status: "Improving" },
      { periodLabel: "May 1", score: 85, delta: "-1 from Apr 20", status: "High baseline" },
      { periodLabel: "May 10", score: 88, delta: "+3 from May 1", status: "Strong growth" },
      { periodLabel: "May 20", score: 90, delta: "+2 from May 10", status: "Top tier" },
      { periodLabel: "May 31", score: 91, delta: "+1 from May 20", status: "Optimal peak" },
    ],
  },
  year: {
    subtitle: "12-month performance trend across 2026",
    insight: "Your overall performance score improved steadily by +17 pts throughout 2026.",
    data: [
      { periodLabel: "Jan", score: 75, delta: "Baseline", status: "Year start" },
      { periodLabel: "Feb", score: 76, delta: "+1 from Jan", status: "Improving" },
      { periodLabel: "Mar", score: 79, delta: "+3 from Feb", status: "Steady growth" },
      { periodLabel: "Apr", score: 82, delta: "+3 from Mar", status: "Consistent" },
      { periodLabel: "May", score: 85, delta: "+3 from Apr", status: "Solid progress" },
      { periodLabel: "Jun", score: 84, delta: "-1 from May", status: "Minor dip" },
      { periodLabel: "Jul", score: 87, delta: "+3 from Jun", status: "Improving" },
      { periodLabel: "Aug", score: 88, delta: "+1 from Jul", status: "High tier" },
      { periodLabel: "Sep", score: 89, delta: "+1 from Aug", status: "Consistent" },
      { periodLabel: "Oct", score: 90, delta: "+1 from Sep", status: "Top 15%" },
      { periodLabel: "Nov", score: 91, delta: "+1 from Oct", status: "Optimal peak" },
      { periodLabel: "Dec", score: 92, delta: "+1 from Nov", status: "Fleet leader" },
    ],
  },
};

const aiSummaryMap: Record<string, { summary: string; goalProgress: string }> = {
  month: {
    summary:
      '"Your driving performance has been consistent this week, Rahul. Speeding incidents have reduced by 15% compared to last week. Keep maintaining a safe following distance during highway transit."',
    goalProgress: "72%",
  },
  "3months": {
    summary:
      '"Over the past 3 months, your overall safety rating improved by 9 points. Harsh braking events dropped by 22% in quarter 2. Continue maintaining steady cornering speeds."',
    goalProgress: "85%",
  },
  year: {
    summary:
      '"Your 2026 performance trend shows continuous improvement across 245 deliveries. On-time rate remains at 98.4% with zero major safety infractions recorded."',
    goalProgress: "90%",
  },
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartPoint;
    const score = data.score;
    const periodLabel = data.periodLabel;
    const delta = data.delta;
    const status = data.status;

    return (
      <div className="rounded-xl border border-border/80 glass-strong bg-surface/95 p-3.5 shadow-2xl text-xs space-y-1.5 min-w-[150px]">
        <div className="flex items-center justify-between border-b border-border/50 pb-1 font-bold text-foreground">
          <span>{periodLabel}</span>
          <span className="text-primary font-mono text-sm font-extrabold">{score}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
          <span>Change:</span>
          <span
            className={cn(
              "font-semibold",
              delta.startsWith("+")
                ? "text-success"
                : delta.startsWith("-")
                  ? "text-warning"
                  : "text-muted-foreground"
            )}
          >
            {delta}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Status:</span>
          <span className="font-bold text-primary">{status}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function PerformancePage() {
  const me = drivers[0]!;
  const [timePeriod, setTimePeriod] = useState<"month" | "3months" | "year">("month");
  const [isConcernModalOpen, setIsConcernModalOpen] = useState(false);
  const [selectedSystemEvent, setSelectedSystemEvent] = useState<SystemDetectedEvent | undefined>();

  const currentStats = statsData[timePeriod] ?? statsData["month"]!;
  const currentBehaviours = behavioursData[timePeriod] ?? behavioursData["month"]!;
  const currentTrendConfig = trendDataMap[timePeriod] ?? trendDataMap["month"]!;
  const currentAiData = aiSummaryMap[timePeriod] ?? aiSummaryMap["month"]!;

  const handleReportDetection = (behaviourLabel: string) => {
    let eventType: SystemDetectedEvent["type"] = "Harsh Braking";
    if (behaviourLabel.includes("Speeding")) eventType = "Speeding";
    if (behaviourLabel.includes("Acceleration")) eventType = "Rapid Acceleration";
    if (behaviourLabel.includes("Cornering")) eventType = "Sharp Cornering";

    setSelectedSystemEvent({
      type: eventType,
      timestamp: "09:55 AM",
      location: "NH48 Express Corridor",
      details: `${behaviourLabel} detected by CAN bus telematics`,
    });
    setIsConcernModalOpen(true);
  };

  return (
    <Page
      title="My Performance"
      description="Track your driving performance, safety insights, and daily progress."
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setSelectedSystemEvent(undefined);
              setIsConcernModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
          >
            <ShieldAlert className="size-4" /> Raise a Concern
          </button>
          <FilterChips
            options={timeFilters}
            value={timePeriod}
            onChange={(val) => setTimePeriod(val as "month" | "3months" | "year")}
            layoutId="perf-period"
          />
          <StatusPill tone="success">Top 12% of fleet</StatusPill>
        </div>
      }
    >
      {/* PERFORMANCE METRICS CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {currentStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} icon={<Award className="size-4" />} />
        ))}
      </div>

      {/* PERFORMANCE TREND & DRIVING BEHAVIOUR */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Performance Trend Graph */}
        <GlassPanel className="lg:col-span-2" title="Performance trend" subtitle={currentTrendConfig.subtitle}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentTrendConfig.data}>
                <defs>
                  <linearGradient id="driverFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="periodLabel"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} domain={[60, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="var(--chart-2)" strokeWidth={3} fill="url(#driverFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-border/50 bg-surface/30 p-2.5 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-primary shrink-0 animate-pulse" />
            <span>{currentTrendConfig.insight}</span>
          </div>
        </GlassPanel>

        {/* Driving Behaviour Panel with Report Detection Action */}
        <GlassPanel title="Driving behaviour" subtitle="Assessment across key safety metrics">
          <div className="flex flex-col justify-between py-1.5 space-y-4 h-full">
            {currentBehaviours.map((b, i) => (
              <div key={b.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium flex items-center gap-2">
                    {b.label}
                    {(b.tone === "warning" || b.tone === "destructive") && (
                      <button
                        onClick={() => handleReportDetection(b.label)}
                        className="text-[10px] text-amber-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer font-semibold"
                        title="Report an issue with this detection"
                      >
                        <ShieldAlert className="size-3" /> Report Issue
                      </button>
                    )}
                  </span>
                  <span className="font-bold text-foreground">{b.value}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${b.value}%` }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.08 }}
                    className={cn("h-full rounded-full", toneClass[b.tone])}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      {/* RICHER AI DRIVER SUMMARY & AI COACHING GOAL */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Rich AI Driver Feedback Panel */}
        <GlassPanel
          className="lg:col-span-2"
          title="AI Driver Summary & Insights"
          subtitle="Real-time intelligent safety feedback & recommendations"
        >
          <div className="space-y-4">
            {/* Personalised AI Summary Banner */}
            <div className="rounded-xl border border-primary/25 bg-primary/8 p-3.5 text-xs leading-relaxed text-foreground">
              <div className="flex items-center gap-2 font-bold text-primary mb-1">
                <Sparkles className="size-4 animate-pulse" />
                <span>AI Performance Summary</span>
              </div>
              <p className="text-muted-foreground">{currentAiData.summary}</p>
            </div>

            {/* Concise AI Insights Cards */}
            <div className="grid gap-2.5 sm:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-success/30 bg-success/8 p-3 text-xs space-y-1"
              >
                <div className="flex items-center gap-1.5 font-semibold text-success">
                  <CheckCircle2 className="size-3.5" />
                  <span>Speed Reduction</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Speeding incidents reduced compared to last week.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-warning/30 bg-warning/8 p-3 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-semibold text-warning">
                  <span className="flex items-center gap-1.5"><AlertCircle className="size-3.5" /> Urban Transit</span>
                  <button
                    onClick={() => handleReportDetection("Harsh Braking")}
                    className="text-[10px] text-amber-400 hover:underline cursor-pointer font-bold"
                  >
                    Context
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Harsh braking observed during urban city driving.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-info/30 bg-info/8 p-3 text-xs space-y-1"
              >
                <div className="flex items-center gap-1.5 font-semibold text-info">
                  <Lightbulb className="size-3.5" />
                  <span>Safety Spacing</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Maintain a greater following distance on expressways.
                </p>
              </motion.div>
            </div>
          </div>
        </GlassPanel>

        {/* AI Focused Coaching Goal Card */}
        <GlassPanel title="AI Coaching Goal" subtitle="Weekly advisory focus">
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Target className="size-4 text-primary" /> Goal: Reduce Harsh Braking
              </span>
              <StatusPill tone="warning">{currentAiData.goalProgress} Completed</StatusPill>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Target: &lt; 4 events/week</span>
                <span className="font-semibold text-foreground">Timeframe: May 31</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: currentAiData.goalProgress }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </div>

            {/* Practical Driving Tip */}
            <div className="rounded-xl border border-border/50 bg-surface-2/40 p-3 text-muted-foreground text-[11px] leading-relaxed">
              <strong className="text-foreground font-semibold block mb-0.5">Practical Tip:</strong>
              "Anticipate slowdowns 100 meters early when approaching highway toll booths to reduce sudden deceleration."
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* STRENGTHS & AREAS TO IMPROVE (TWO COLUMN LAYOUT) */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* Left Column: Strengths */}
        <GlassPanel
          title="Key Driving Strengths"
          subtitle="Positive driving habits & operational highlights"
        >
          <div className="space-y-2.5">
            {[
              "Maintains safe highway speeds and controlled cornering",
              "Smooth acceleration resulting in excellent fuel efficiency",
              "Consistent 98.4% on-time delivery completion rate",
              "Flawless cargo documentation & professional client interaction",
            ].map((strength, i) => (
              <motion.div
                key={strength}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 rounded-xl border border-success/20 bg-success/8 p-3 text-xs font-medium text-foreground"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-success/15 text-success">
                  <ShieldCheck className="size-3.5" />
                </span>
                <span>{strength}</span>
              </motion.div>
            ))}
          </div>
        </GlassPanel>

        {/* Right Column: Areas to Improve */}
        <GlassPanel
          title="Areas to Improve"
          subtitle="Constructive advisory feedback for growth"
        >
          <div className="space-y-2.5">
            {[
              "Occasional harsh braking when navigating dense city traffic",
              "Increase following distance during monsoon & low visibility conditions",
              "Maintain consistent speed on expressways during late night drives",
              "Reduce idle engine time during afternoon delivery wait windows",
            ].map((area, i) => (
              <motion.div
                key={area}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 rounded-xl border border-warning/20 bg-warning/8 p-3 text-xs font-medium text-foreground"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-warning/15 text-warning">
                  <AlertTriangle className="size-3.5" />
                </span>
                <span>{area}</span>
              </motion.div>
            ))}
          </div>
        </GlassPanel>
      </div>

      {/* MANAGER FEEDBACK */}
      <div className="mt-4">
        <GlassPanel title="Manager feedback" subtitle="From Amit Rao · 7 May 2026">
          <p className="rounded-xl border border-border p-4 text-sm text-muted-foreground leading-relaxed">
            “Excellent turnaround on the Adira account this week, {me.name.split(" ")[0]}. Your
            documentation was flawless and the client specifically mentioned your professionalism.
            Keep an eye on idle time during afternoon stops.”
          </p>
          <div className="mt-3 flex items-center gap-2">
            <StatusPill tone="success">
              <TrendingUp className="size-3" /> Recommended for bonus
            </StatusPill>
          </div>
        </GlassPanel>
      </div>

      <RaiseConcernModal
        isOpen={isConcernModalOpen}
        onClose={() => setIsConcernModalOpen(false)}
        initialCategory="Incorrect System Detection"
        initialSystemEvent={selectedSystemEvent}
      />
    </Page>
  );
}
