import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Bell } from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { notifications } from "@/data/fleet";

export const Route = createFileRoute("/client/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Fleetline" },
      { name: "description", content: "Delivery updates, delays and concerns raised on your shipments." },
      { property: "og:title", content: "Notifications — Fleetline" },
      { property: "og:description", content: "Everything happening on your shipments." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <Page title="Notifications" description="Everything happening across your shipments.">
      <GlassPanel hoverable={false} className="space-y-2">
        {notifications.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ x: 4 }}
            className="flex items-start gap-3 rounded-xl border border-border p-4"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
              <Bell className="size-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.body}</p>
            </div>
            <span className="text-[11px] text-muted-foreground">{n.time}</span>
          </motion.div>
        ))}
      </GlassPanel>
    </Page>
  );
}
