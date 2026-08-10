import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Radar,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { navigation, roleMeta } from "./navigation";
import { notifications, type Role } from "@/data/fleet";
import { AuroraBackground } from "@/components/fx/aurora-background";
import { StatusPill } from "@/components/fx/status-pill";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion-presets";

function useActivePath() {
  return useRouterState({ select: (s) => s.location.pathname });
}

function Breadcrumbs({ role }: { role: Role }) {
  const pathname = useActivePath();
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = [roleMeta[role].title, ...parts.slice(1).map((p) => p.replace(/-/g, " "))];

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-xs md:flex">
      <AnimatePresence mode="popLayout">
        {crumbs.map((crumb, i) => (
          <motion.span
            key={crumb + i}
            layout
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={spring}
            className={cn(
              "capitalize",
              i === crumbs.length - 1 ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {crumb}
            {i < crumbs.length - 1 && <span className="ml-1.5 text-muted-foreground">/</span>}
          </motion.span>
        ))}
      </AnimatePresence>
    </nav>
  );
}

function NotificationBell() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.06, rotate: -6 }}
          whileTap={{ scale: 0.92 }}
          transition={spring}
          className="relative rounded-xl border border-border bg-surface/50 p-2.5 text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
        </motion.button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 rounded-2xl glass-strong p-2">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Notifications
        </p>
        <div className="space-y-1">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, ...spring }}
              whileHover={{ x: 3 }}
              className="cursor-pointer rounded-xl p-3 transition-colors hover:bg-surface-2/70"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{n.title}</p>
                <span className="text-[10px] text-muted-foreground">{n.time}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
            </motion.div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function AppShell({ role, children }: { role: Role; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useActivePath();
  const items = navigation[role];
  const meta = roleMeta[role];

  const isActive = (item: (typeof items)[number]) =>
    item.exact ? pathname === item.to : pathname.startsWith(item.to);

  return (
    <div className="relative flex min-h-screen w-full">
      <AuroraBackground />

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 84 : 260 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar/70 backdrop-blur-2xl md:flex"
      >
        <div className="flex h-16 items-center gap-3 px-5">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.08 }}
            transition={spring}
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]"
          >
            <Radar className="size-5" />
          </motion.div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="min-w-0"
              >
                <p className="truncate font-display text-sm font-semibold">Fleetline</p>
                <p className="truncate text-[11px] text-muted-foreground">{meta.title} workspace</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="mt-4 flex-1 space-y-1 px-3">
          {items.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-300",
                  active
                    ? "text-sidebar-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]"
                    transition={{ type: "spring", stiffness: 340, damping: 30 }}
                  />
                )}
                <motion.span
                  whileHover={{ scale: 1.14, rotate: 6 }}
                  transition={spring}
                  className="relative z-10"
                >
                  <item.icon className="size-4.5" />
                </motion.span>
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      className="relative z-10 truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        <div className="p-3">
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mb-3 rounded-2xl glass p-4"
              >
                <Sparkles className="size-4 text-primary" />
                <p className="mt-2 text-xs font-medium">AI Copilot is watching your fleet</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  3 optimisations available today.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-sidebar-border py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <motion.span animate={{ rotate: collapsed ? 180 : 0 }} transition={spring}>
              <ChevronLeft className="size-4" />
            </motion.span>
            {!collapsed && "Collapse"}
          </button>
        </div>
      </motion.aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/60 px-5 backdrop-blur-2xl md:px-8">
          <Link to="/" className="md:hidden">
            <div className="grid size-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
              <Radar className="size-5" />
            </div>
          </Link>
          <Breadcrumbs role={role} />
          <div className="ml-auto flex items-center gap-2">
            <StatusPill tone="success" pulse className="hidden lg:inline-flex">
              Live sync
            </StatusPill>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              className="rounded-xl border border-border bg-surface/50 p-2.5 text-muted-foreground hover:text-foreground"
              aria-label="Search"
            >
              <Search className="size-4" />
            </motion.button>
            <NotificationBell />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 rounded-xl border border-border bg-surface/50 py-1.5 pl-1.5 pr-3"
                >
                  <span className="grid size-7 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-xs font-semibold text-primary-foreground">
                    {meta.initials}
                  </span>
                  <span className="hidden text-left sm:block">
                    <span className="block text-xs font-medium leading-tight">{meta.person}</span>
                    <span className="block text-[10px] leading-tight text-muted-foreground">
                      {meta.title}
                    </span>
                  </span>
                  <ChevronRight className="hidden size-3 rotate-90 text-muted-foreground sm:block" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl glass-strong">
                <DropdownMenuLabel>{meta.person}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" /> Preferences
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/">
                    <LogOut className="mr-2 size-4" /> Sign out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Mobile / tablet nav */}
        <div className="flex gap-1.5 overflow-x-auto border-b border-border px-4 py-2 md:hidden">
          {items.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative whitespace-nowrap rounded-lg px-3 py-1.5 text-xs",
                  active ? "text-primary-foreground" : "text-muted-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="mobile-active"
                    className="absolute inset-0 rounded-lg bg-[image:var(--gradient-primary)]"
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
