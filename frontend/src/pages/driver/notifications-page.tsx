import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Calendar,
  CheckCheck,
  CheckCircle2,
  CreditCard,
  Sparkles,
  Truck,
} from "lucide-react";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatusPill, type Tone } from "@/components/fx/status-pill";
import { FilterChips } from "@/components/fx/controls";
import { cn } from "@/lib/utils";
import { DataPagination } from "@/components/common/data-pagination";

export interface DriverNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  type: "delivery" | "schedule" | "ai" | "system" | "payment";
}

const initialDriverNotifications: DriverNotification[] = [
  {
    id: "NOTIF-1",
    title: "New Delivery Assigned",
    body: "Delivery DEL-2026-0816 (Techlink Warehouse → Adira Corporate Office) has been assigned to you.",
    time: "10 mins ago",
    unread: true,
    type: "delivery",
  },
  {
    id: "NOTIF-2",
    title: "Schedule Updated",
    body: "Your delivery schedule has been updated with 1 optimized route adjustment.",
    time: "45 mins ago",
    unread: true,
    type: "schedule",
  },
  {
    id: "NOTIF-3",
    title: "AI Performance Insight Available",
    body: "New AI performance insight: Your speeding events reduced by 15% this week. Keep up the safe driving!",
    time: "2 hours ago",
    unread: true,
    type: "ai",
  },
  {
    id: "NOTIF-4",
    title: "Payment Cleared",
    body: "Payment of ₹2,450 for delivery DEL-2026-0816 has been verified and credited.",
    time: "Yesterday, 04:15 PM",
    unread: false,
    type: "payment",
  },
  {
    id: "NOTIF-5",
    title: "Weekly Deliveries Completed",
    body: "You have completed all assigned deliveries for the current dispatch window.",
    time: "Yesterday, 06:30 PM",
    unread: false,
    type: "system",
  },
];

const filterOptions = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
] as const;

export function DriverNotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [items, setItems] = useState<DriverNotification[]>(initialDriverNotifications);

  const unreadCount = items.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleRead = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const filteredItems = items.filter((n) => (filter === "unread" ? n.unread : true));

  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);
  const paginatedFilteredItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getNotifMeta = (type: DriverNotification["type"]) => {
    switch (type) {
      case "delivery":
        return { icon: Truck, tone: "primary" as Tone, label: "Delivery Update" };
      case "schedule":
        return { icon: Calendar, tone: "info" as Tone, label: "Schedule Update" };
      case "ai":
        return { icon: Sparkles, tone: "warning" as Tone, label: "AI Insight" };
      case "payment":
        return { icon: CreditCard, tone: "success" as Tone, label: "Payment Clear" };
      default:
        return { icon: CheckCircle2, tone: "muted" as Tone, label: "System Update" };
    }
  };

  return (
    <Page
      title="Notifications"
      description="Stay updated on your deliveries and account activity."
      actions={
        <div className="flex items-center gap-3">
          <FilterChips
            options={filterOptions}
            value={filter}
            onChange={(val) => setFilter(val as "all" | "unread")}
            layoutId="notif-filter"
          />
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-surface-2/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              <CheckCheck className="size-3.5 text-primary" />
              Mark all as read ({unreadCount})
            </button>
          )}
        </div>
      }
    >
      <GlassPanel
        title="Recent Activity Notifications"
        subtitle={
          filter === "unread"
            ? `Showing ${filteredItems.length} unread notification${filteredItems.length === 1 ? "" : "s"}`
            : `Total ${items.length} notifications (${unreadCount} unread)`
        }
      >
        {filteredItems.length > 0 ? (
          <>
            <div className="space-y-2.5">
              <AnimatePresence mode="popLayout">
                {paginatedFilteredItems.map((n, i) => {
                  const meta = getNotifMeta(n.type);
                  const Icon = meta.icon;

                  return (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ x: 4 }}
                      onClick={() => toggleRead(n.id)}
                      className={cn(
                        "group relative flex items-start gap-3.5 rounded-2xl border p-4 transition-all duration-200 cursor-pointer",
                        n.unread
                          ? "border-primary/30 bg-primary/8 shadow-[var(--shadow-glow)]"
                          : "border-border/60 bg-surface-2/30 hover:border-border"
                      )}
                    >
                      {/* Unread Pulse Indicator */}
                      {n.unread && (
                        <span className="absolute left-3 top-4 size-2 rounded-full bg-primary animate-pulse" />
                      )}

                      <span
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-xl border border-border/50 transition-colors",
                          n.unread ? "bg-primary/14 text-primary" : "bg-surface-2 text-muted-foreground"
                        )}
                      >
                        <Icon className="size-4" />
                      </span>

                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-foreground truncate">{n.title}</span>
                          <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{n.body}</p>
                      </div>

                      <span className="text-[11px] text-muted-foreground font-medium shrink-0 self-start mt-0.5">
                        {n.time}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <DataPagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={filteredItems.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              className="mt-4"
            />
          </>
        ) : (
          <div className="py-12 text-center text-xs text-muted-foreground">
            No unread notifications at this time. All caught up!
          </div>
        )}
      </GlassPanel>
    </Page>
  );
}
