import { createFileRoute } from "@tanstack/react-router";
import { CreateDeliveryPage } from "@/pages/client/create-new-delivery-page";

export const Route = createFileRoute("/client/create")({
  head: () => ({
    meta: [
      { title: "Create Delivery — Fleetline" },
      { name: "description", content: "Book a new delivery: pickup, drop, package details and schedule." },
      { property: "og:title", content: "Create Delivery — Fleetline" },
      { property: "og:description", content: "Book a delivery in under a minute." },
    ],
  }),
  component: CreateDeliveryPage,
});
