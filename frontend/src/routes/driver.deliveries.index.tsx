import { createFileRoute } from "@tanstack/react-router";
import { DriverDeliveriesPage } from "@/pages/driver/deliveries-page";

export const Route = createFileRoute("/driver/deliveries/")({
  head: () => ({
    meta: [
      { title: "My Deliveries — Fleetline" },
      { name: "description", content: "Your assigned pickups and drops for the day, with routes and timings." },
      { property: "og:title", content: "My Deliveries — Fleetline" },
      { property: "og:description", content: "Driver task list: assigned deliveries, routes and expected times." },
    ],
  }),
  component: DriverDeliveriesPage,
});
