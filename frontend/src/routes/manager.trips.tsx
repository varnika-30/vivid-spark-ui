import { createFileRoute } from "@tanstack/react-router";
import { ManagerTripsPage } from "@/pages/manager/trip-reports-page";

export const Route = createFileRoute("/manager/trips")({
  head: () => ({
    meta: [
      { title: "Trip Reports — Fleetline" },
      {
        name: "description",
        content: "Search and review completed deliveries, driving behaviour and incident reports.",
      },
      { property: "og:title", content: "Trip Reports — Fleetline" },
      { property: "og:description", content: "Individual completed trip performance and telemetry analysis." },
    ],
  }),
  component: ManagerTripsPage,
});
