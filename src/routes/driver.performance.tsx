import { createFileRoute } from "@tanstack/react-router";
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
import { Award, Sparkles, TrendingUp } from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatCard } from "@/components/fx/stat-card";
import { StatusPill } from "@/components/fx/status-pill";
import { drivers, drivingBehaviour, driverStats, performanceTrend } from "@/data/fleet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/driver/performance")({
  head: () => ({
    meta: [
      { title: "My Performance — Fleetline" },
      { name: "description", content: "Track your driving performance, safety grade and AI coaching tips." },
      { property: "og:title", content: "My Performance — Fleetline" },
      { property: "og:description", content: "Safety grade, behaviour analytics and coaching tips." },
    ],
  }),
  component: PerformancePage,
});

const toneClass = {
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  destructive: "bg-destructive",
};

function PerformancePage() {
  const me = drivers[0]!;

  return (
    <Page
      title="My Performance"
      description="Track your driving performance and improve every day."
      actions={<StatusPill tone="success">Top 12% of fleet</StatusPill>}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {driverStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} icon={<Award className="size-4" />} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <GlassPanel className="lg:col-span-2" title="Performance trend" subtitle="Monthly driving score">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrend}>
                <defs>
                  <linearGradient id="driverFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} domain={[60, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="var(--chart-2)" strokeWidth={3} fill="url(#driverFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel title="Driving behaviour" subtitle="Rolling 30 days">
          <div className="space-y-4">
            {drivingBehaviour.map((b, i) => (
              <div key={b.label}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{b.label}</span>
                  <span className="font-medium">{b.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
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

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <GlassPanel title="AI coaching" subtitle="Personalised for your driving style">
          <div className="space-y-2">
            {[
              "Reduce harsh braking by 20% to reach an A+ safety grade.",
              "Maintain a 3-second following distance on the expressway.",
              "Shift your Pune departures 30 minutes earlier to avoid congestion.",
            ].map((tip, i) => (
              <motion.p
                key={tip}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-2 rounded-xl bg-primary/8 p-3 text-sm"
              >
                <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                {tip}
              </motion.p>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel title="Manager feedback" subtitle="From Amit Rao · 7 May 2026">
          <p className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
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
    </Page>
  );
}
