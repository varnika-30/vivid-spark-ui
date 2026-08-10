import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Clock, Fuel, MapPinned, Route as RouteIcon } from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatCard } from "@/components/fx/stat-card";
import { StatusPill } from "@/components/fx/status-pill";
import { performanceTrend } from "@/data/fleet";

export const Route = createFileRoute("/manager/trips")({
  head: () => ({
    meta: [
      { title: "Trip Reports — Fleetline" },
      {
        name: "description",
        content: "Completed trip analysis: distance, duration, fuel efficiency and route adherence.",
      },
      { property: "og:title", content: "Trip Reports — Fleetline" },
      { property: "og:description", content: "Completed trip analytics across the fleet." },
    ],
  }),
  component: TripsPage,
});

const trips = [
  { id: "TRP-8841", driver: "Rahul Sharma", route: "Mumbai → Pune", distance: 148, duration: "3h 12m", fuel: 12.4, adherence: 98 },
  { id: "TRP-8842", driver: "Priya Nair", route: "Thane → Nashik", distance: 168, duration: "3h 48m", fuel: 11.1, adherence: 94 },
  { id: "TRP-8843", driver: "Vikram Patil", route: "Mumbai → Nagpur", distance: 812, duration: "13h 20m", fuel: 8.6, adherence: 91 },
  { id: "TRP-8844", driver: "Aman Verma", route: "Pune → Satara", distance: 116, duration: "2h 40m", fuel: 13.2, adherence: 87 },
  { id: "TRP-8845", driver: "Imran Sheikh", route: "Pune → Mumbai", distance: 152, duration: "3h 30m", fuel: 10.4, adherence: 82 },
];

function TripsPage() {
  return (
    <Page
      title="Trip Reports"
      description="Completed trips with distance, duration, fuel efficiency and route adherence."
      actions={<StatusPill tone="info">Last 7 days</StatusPill>}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Completed Trips" value="528" delta="+6%" icon={<RouteIcon className="size-4" />} />
        <StatCard label="Avg. Duration" value="4.2" unit="h" delta="-8m" trend="up" icon={<Clock className="size-4" />} />
        <StatCard label="Avg. Efficiency" value="11.4" unit="km/l" delta="+0.6" icon={<Fuel className="size-4" />} />
        <StatCard label="Route Adherence" value="93" unit="%" delta="+1.8" icon={<MapPinned className="size-4" />} />
      </div>

      <GlassPanel className="mt-4" title="Efficiency trend" subtitle="Composite trip quality score by month">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceTrend}>
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
              <Line type="monotone" dataKey="score" stroke="var(--chart-1)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassPanel>

      <GlassPanel className="mt-4 p-0" hoverable={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {["Trip ID", "Driver", "Route", "Distance", "Duration", "Efficiency", "Adherence"].map((h) => (
                  <th key={h} className="px-5 py-4 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trips.map((t, i) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, type: "spring", stiffness: 250, damping: 26 }}
                  className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2/40"
                >
                  <td className="px-5 py-4 font-medium text-primary">{t.id}</td>
                  <td className="px-5 py-4">{t.driver}</td>
                  <td className="px-5 py-4 text-muted-foreground">{t.route}</td>
                  <td className="px-5 py-4">{t.distance} km</td>
                  <td className="px-5 py-4">{t.duration}</td>
                  <td className="px-5 py-4">{t.fuel} km/l</td>
                  <td className="px-5 py-4">
                    <StatusPill tone={t.adherence > 92 ? "success" : t.adherence > 85 ? "warning" : "destructive"}>
                      {t.adherence}%
                    </StatusPill>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </Page>
  );
}
