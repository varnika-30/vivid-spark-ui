import { createFileRoute } from "@tanstack/react-router";
import { DriverNotificationsPage } from "@/pages/driver/notifications-page";

export const Route = createFileRoute("/driver/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Fleetline" },
      { name: "description", content: "Stay updated on your deliveries and account activity." },
      { property: "og:title", content: "Notifications — Fleetline" },
      { property: "og:description", content: "Driver notifications and activity updates." },
    ],
  }),
  component: DriverNotificationsPage,
});
