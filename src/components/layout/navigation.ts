import {
  Bell,
  CalendarDays,
  ClipboardList,
  Gauge,
  LayoutDashboard,
  MapPin,
  PackagePlus,
  Route as RouteIcon,
  Truck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Role } from "@/data/fleet";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const roleMeta: Record<Role, { title: string; person: string; initials: string }> = {
  manager: { title: "Fleet Manager", person: "Amit Rao", initials: "AR" },
  driver: { title: "Driver", person: "Rahul Sharma", initials: "RS" },
  client: { title: "Client", person: "Acme Corp.", initials: "AC" },
};

export const navigation: Record<Role, NavItem[]> = {
  manager: [
    { label: "Fleet Report", to: "/manager", icon: Gauge, exact: true },
    { label: "Requested Deliveries", to: "/manager/requests", icon: ClipboardList },
    { label: "Drivers", to: "/manager/drivers", icon: Users },
    { label: "List of Deliveries", to: "/manager/deliveries", icon: Truck },
    { label: "Trip Reports", to: "/manager/trips", icon: RouteIcon },
  ],
  driver: [
    { label: "Today", to: "/driver", icon: LayoutDashboard, exact: true },
    { label: "My Schedule", to: "/driver/schedule", icon: CalendarDays },
    { label: "List of Deliveries", to: "/driver/deliveries", icon: Truck },
    { label: "My Performance", to: "/driver/performance", icon: Gauge },
  ],
  client: [
    { label: "Track", to: "/client", icon: MapPin, exact: true },
    { label: "Create New", to: "/client/create", icon: PackagePlus },
    { label: "Notifications", to: "/client/notifications", icon: Bell },
  ],
};
