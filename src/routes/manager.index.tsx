import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
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
  AlertTriangle,
  Download,
  Gauge,
  Lightbulb,
  Sparkles,
  Timer,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import { Page, Section } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatCard } from "@/components/fx/stat-card";
import { MagneticButton } from "@/components/fx/magnetic-button";
import { StatusPill } from "@/components/fx/status-pill";
import { LoadingGrid } from "@/components/fx/skeletons";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import {
  behaviourSplit,
  deliveryVolume,
  drivers,
  fleetKpis,
  performanceTrend,
} from "@/data/fleet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/manager/")({
  head: () => ({
    meta: [
      { title: "Fleet Report — Fleetline" },
      {
        name: "description",
        content:
          "Fleet intelligence report: scores, on-time rates, driving behaviour and AI recommendations.",
      },
      { property: "og:title", content: "Fleet Report — Fleetline" },
      {
        property: "og:description",
        content: "Live fleet intelligence with AI-generated performance recommendations.",
      },
    ],
  }),
  component: FleetReport,
});

const kpiIcons = [Gauge, Users, Truck, Timer, AlertTriangle];

const chartTooltip = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    fontSize: "12px",
    color: "var(--popover-foreground)",
  },
};

function FleetReport() {
  const loading = useSimulatedLoading(650);

  return (
    <Page
      title="How the fleet is really performing"
      description="A live intelligence report across drivers, deliveries and driving behaviour for the last 30 days."
      actions={
        <>
          <StatusPill tone="primary" pulse>
            Updated 2 min ago
          </StatusPill>
          <MagneticButton variant="primary" icon={<Download className="size-4" />}>
            Export report
          </MagneticButton>
        </>
      }
    >
      {loading ? (
        <LoadingGrid cards={5} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {fleetKpis.map((kpi, i) => {
            const Icon = kpiIcons[i] ?? Gauge;
            return (
              <StatCard
                key={kpi.label}
                label={kpi.label}
                value={kpi.value}
                unit={kpi.unit}
                delta={kpi.delta}
                trend={kpi.trend}
                icon={<Icon className="size-4" />}
              />
            );
          })}
        </div>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <GlassPanel
          className="lg:col-span-2"
          title="Performance trend"
          subtitle="Fleet score vs. target"
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

        <GlassPanel title="Driving behaviour" subtitle="Share of flagged events">
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
        <GlassPanel className="lg:col-span-2" title="Weekly delivery volume" subtitle="Completed vs. delayed">
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

        <GlassPanel title="Top performing drivers" subtitle="By composite fleet score">
          <div className="space-y-2">
            {drivers.slice(0, 5).map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, type: "spring", stiffness: 260, damping: 26 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition-colors hover:border-border hover:bg-surface-2/50"
              >
                <span className="grid size-8 place-items-center rounded-lg bg-primary/12 text-xs font-semibold text-primary">
                  {d.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.name}</p>
                  <p className="text-[11px] text-muted-foreground">{d.city}</p>
                </div>
                <div className="w-20">
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.score}%` }}
                      transition={{ delay: 0.2 + i * 0.07, duration: 0.9, ease: "easeOut" }}
                      className="h-full rounded-full bg-[image:var(--gradient-primary)]"
                    />
                  </div>
                </div>
                <span className="w-8 text-right text-sm font-semibold">{d.score}</span>
              </motion.div>
            ))}
          </div>
        </GlassPanel>
      </div>

      <Section className="mt-4">
        <GlassPanel
          title="AI Insight Centre"
          subtitle="Generated from 18,320 km of telematics this month"
          actions={<StatusPill tone="primary">3 actions</StatusPill>}
          hoverable={false}
        >
          <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
            {[
              {
                icon: TrendingUp,
                title: "On-time rate dipped 1.4% on the Mumbai–Pune corridor",
                body: "Congestion between 4–7 PM added an average of 26 minutes. Shifting three afternoon departures to 2:30 PM recovers an estimated 84% of the lost time.",
                tone: "warning" as const,
              },
              {
                icon: Sparkles,
                title: "Assign high-priority medical freight to cold-chain certified drivers",
                body: "Priya Nair and Rahul Sharma have a 100% compliance record for temperature-sensitive shipments. Auto-routing REQ-10483 to them raises predicted success to 96%.",
                tone: "primary" as const,
              },
              {
                icon: Lightbulb,
                title: "Coaching opportunity: night-hour speeding",
                body: "Five drivers account for 71% of speeding events after 9 PM. A 15-minute micro-coaching module is projected to reduce risk exposure by 22% within a month.",
                tone: "info" as const,
              },
            ].map((insight, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/12 text-primary">
                      <insight.icon className="size-4" />
                    </span>
                    <span className="text-sm font-medium">{insight.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3 pl-11 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-3xl">{insight.body}</p>
                    <StatusPill tone={insight.tone}>Review</StatusPill>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </GlassPanel>
      </Section>
    </Page>
  );
}
