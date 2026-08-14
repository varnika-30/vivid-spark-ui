import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Car,
  Clock,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Route as RouteIcon,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatCard } from "@/components/fx/stat-card";
import { StatusPill, type Tone } from "@/components/fx/status-pill";
import { MagneticButton } from "@/components/fx/magnetic-button";
import {
  deliveries,
  driverEmployment,
  driverMonthlyScore,
  driverTrips,
  drivers,
  drivingBehaviour,
} from "@/data/fleet";
import { fadeUp } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/manager/drivers/$driverId")({
  loader: ({ params }) => {
    const driver = drivers.find((d) => d.id === params.driverId);
    if (!driver) throw notFound();
    return { driver };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Driver not found — Fleetline" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.driver.name} — Driver Details · Fleetline` },
        {
          name: "description",
          content: `Profile, employment record, compliance documents, trips and driving behaviour for ${loaderData.driver.name}.`,
        },
        { property: "og:title", content: `${loaderData.driver.name} — Driver Details` },
        {
          property: "og:description",
          content: "Driver compliance, behaviour analytics, trip history and current assignment.",
        },
      ],
    };
  },
  component: DriverDetail,
});

const toneClass = {
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  destructive: "bg-destructive",
};

const tripTone: Record<string, Tone> = {
  Completed: "success",
  Delayed: "warning",
  Cancelled: "destructive",
};

function DriverDetail() {
  const { driver } = Route.useLoaderData();
  const employment = driverEmployment['default']!;
  const assignment = deliveries.find((d) => d.driver === driver.name) ?? deliveries[0]!;

  return (
    <Page
      title={driver.name}
      description={`${driver.id} · ${driver.city} · ${driver.trips.toLocaleString()} lifetime trips`}
      actions={
        <>
          <Link
            to="/manager/drivers"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to drivers
          </Link>
          <MagneticButton variant="primary" icon={<MessageSquare className="size-4" />}>
            Message driver
          </MagneticButton>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Driver Score" value={String(driver.score)} unit="/100" delta="+2.1" icon={<TrendingUp className="size-4" />} />
        <StatCard label="Availability" value={String(driver.availability)} unit="%" sub="next 7 days" icon={<BadgeCheck className="size-4" />} />
        <StatCard label="Rating" value={driver.rating.toFixed(1)} unit="/5" sub="client feedback" icon={<ShieldCheck className="size-4" />} />
        <StatCard label="Trips" value={driver.trips.toLocaleString()} sub="lifetime" icon={<Car className="size-4" />} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <GlassPanel title="Account information" subtitle="Personal & contact details">
          <dl className="space-y-3 text-sm">
            {[
              { icon: Phone, label: "Phone", value: driver.phone },
              { icon: Mail, label: "Email", value: driver.email },
              { icon: MapPin, label: "Base city", value: driver.city },
              { icon: Car, label: "Vehicle", value: driver.vehicle },
              { icon: MapPin, label: "Address", value: employment.address },
            ].map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-border hover:bg-surface-2/40"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/12 text-primary">
                  <row.icon className="size-4" />
                </span>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {row.label}
                  </dt>
                  <dd className="text-sm">{row.value}</dd>
                </div>
              </motion.div>
            ))}
          </dl>
        </GlassPanel>

        <GlassPanel title="Employment details" subtitle="Contract, depot & compliance record">
          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Employee ID", value: employment.employeeId },
              { label: "Joined on", value: employment.joinedOn },
              { label: "Contract", value: employment.contractType },
              { label: "Shift", value: employment.shift },
              { label: "Depot", value: employment.depot },
              { label: "Reporting manager", value: employment.reportingManager },
              { label: "Licence no.", value: employment.licenceNo },
              { label: "Licence expiry", value: employment.licenceExpiry },
              { label: "Emergency contact", value: employment.emergencyContact },
            ].map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-border/70 bg-surface-2/25 p-3"
              >
                <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  {row.label}
                </dt>
                <dd className="mt-1 text-sm">{row.value}</dd>
              </motion.div>
            ))}
          </dl>
        </GlassPanel>

        <GlassPanel title="Current assignment" subtitle="Live delivery in progress">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-primary">{assignment.id}</span>
              <StatusPill tone="primary" pulse>
                In progress
              </StatusPill>
            </div>
            <p className="flex items-start gap-2">
              <Package className="mt-0.5 size-4 shrink-0 text-primary" /> {assignment.pickup}
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-success" /> {assignment.drop}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4 shrink-0" /> Expected {assignment.expected}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="size-4 shrink-0" /> Manager {assignment.manager}
            </p>
            <Link
              to="/manager/deliveries/$deliveryId"
              params={{ deliveryId: assignment.id }}
              className="inline-flex w-full items-center justify-center rounded-xl border border-border px-4 py-2.5 text-xs transition-colors hover:border-primary/50 hover:text-primary"
            >
              Open delivery details
            </Link>
          </div>
        </GlassPanel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <GlassPanel title="Driving behaviour" subtitle="Rolling 30-day telematics">
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
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.08, ease: "easeOut" }}
                    className={cn("h-full rounded-full", toneClass[b.tone])}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="lg:col-span-2" title="Performance trend" subtitle="Driver score over the last 6 months">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={driverMonthlyScore} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="driverScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[60, 100]} stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2} fill="url(#driverScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>

      <motion.div variants={fadeUp} className="mt-4">
        <GlassPanel title="Recent trips" subtitle="Last five completed assignments" hoverable={false}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {driverTrips.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 240, damping: 26 }}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-border bg-surface-2/25 p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-primary">{t.id}</span>
                  <StatusPill tone={tripTone[t.status] ?? "muted"}>{t.status}</StatusPill>
                </div>
                <p className="mt-2 flex items-center gap-2 text-sm">
                  <RouteIcon className="size-4 text-muted-foreground" /> {t.route}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>{t.date}</span>
                  <span>{t.distance}</span>
                  <span>{t.duration}</span>
                  <span className="flex items-center gap-1">
                    <Star className="size-3 text-warning" />
                    {t.rating.toFixed(1)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassPanel>
      </motion.div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <GlassPanel title="Documents" subtitle="Compliance & verification">
          <div className="space-y-2">
            {[
              { name: "Driving Licence", status: "Verified", tone: "success" as const },
              { name: "Vehicle RC", status: "Verified", tone: "success" as const },
              { name: "Insurance", status: "Expires in 24 days", tone: "warning" as const },
              { name: "Medical Certificate", status: "Verified", tone: "success" as const },
              { name: "Police Clearance", status: "Pending upload", tone: "destructive" as const },
            ].map((doc, i) => (
              <motion.div
                key={doc.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ x: 3 }}
                className="flex items-center justify-between gap-3 rounded-xl border border-border p-3"
              >
                <span className="flex items-center gap-2 text-sm">
                  <FileText className="size-4 text-muted-foreground" />
                  {doc.name}
                </span>
                <StatusPill tone={doc.tone}>{doc.status}</StatusPill>
              </motion.div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel title="Strengths" subtitle="What this driver does exceptionally well">
          <ul className="space-y-2">
            {driver.strengths.map((s: string) => (
              <li key={s} className="flex items-start gap-2 rounded-xl bg-success/8 p-3 text-sm">
                <BadgeCheck className="mt-0.5 size-4 shrink-0 text-success" />
                {s}
              </li>
            ))}
          </ul>
        </GlassPanel>

        <GlassPanel title="Areas to improve" subtitle="Coaching recommendations from AI">
          <ul className="space-y-2">
            {driver.improvements.map((s: string) => (
              <li key={s} className="flex items-start gap-2 rounded-xl bg-warning/8 p-3 text-sm">
                <TrendingUp className="mt-0.5 size-4 shrink-0 text-warning" />
                {s}
              </li>
            ))}
          </ul>
        </GlassPanel>
      </div>
    </Page>
  );
}
