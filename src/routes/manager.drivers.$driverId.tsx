import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BadgeCheck,
  Car,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatCard } from "@/components/fx/stat-card";
import { StatusPill } from "@/components/fx/status-pill";
import { MagneticButton } from "@/components/fx/magnetic-button";
import { drivers, drivingBehaviour } from "@/data/fleet";
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
        { title: `${loaderData.driver.name} — Driver Profile · Fleetline` },
        {
          name: "description",
          content: `Profile, compliance documents and driving behaviour for ${loaderData.driver.name}.`,
        },
        { property: "og:title", content: `${loaderData.driver.name} — Driver Profile` },
        {
          property: "og:description",
          content: "Driver compliance, behaviour analytics and current assignment.",
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

function DriverDetail() {
  const { driver } = Route.useLoaderData();

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
            <ArrowLeft className="size-4" /> Back
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
            ].map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-border hover:bg-surface-2/40"
              >
                <span className="grid size-8 place-items-center rounded-lg bg-primary/12 text-primary">
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
      </div>

      <motion.div variants={fadeUp} className="mt-4 grid gap-4 lg:grid-cols-2">
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
      </motion.div>
    </Page>
  );
}
