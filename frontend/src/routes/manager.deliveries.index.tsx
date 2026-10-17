import { createFileRoute } from "@tanstack/react-router";
import { ManagerDeliveriesPage } from "@/pages/manager/deliveries-page";

export const Route = createFileRoute("/manager/deliveries/")({
  head: () => ({
    meta: [
      { title: "Live Deliveries — Fleetline" },
      { name: "description", content: "Monitor every live delivery: status, driver, concerns and expected arrival." },
      { property: "og:title", content: "Live Deliveries — Fleetline" },
      { property: "og:description", content: "Operational board for every delivery in the fleet." },
    ],
  }),
  component: ManagerDeliveriesPage,
});
