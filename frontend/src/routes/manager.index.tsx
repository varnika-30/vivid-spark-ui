import { createFileRoute } from "@tanstack/react-router";
import { FleetReportPage } from "@/pages/manager/fleet-report-page";

export const Route = createFileRoute("/manager/")({
  head: () => ({
    meta: [
      { title: "Fleet Report — Fleetline" },
      { name: "description", content: "Comprehensive fleet performance, delivery metrics, and driver safety reports." },
      { property: "og:title", content: "Fleet Report — Fleetline" },
      { property: "og:description", content: "Fleet intelligence and operational reporting." },
    ],
  }),
  component: FleetReportPage,
});
