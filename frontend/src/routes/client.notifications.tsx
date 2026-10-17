import { createFileRoute } from "@tanstack/react-router";
import { NotificationsPage } from "@/pages/client/notifications-page";

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
