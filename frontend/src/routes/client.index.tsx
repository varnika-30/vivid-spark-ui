import { createFileRoute } from "@tanstack/react-router";
import { ClientTrackPage } from "@/pages/client/track-page";

export const Route = createFileRoute("/client/")({
  head: () => ({
    meta: [
      { title: "Track Deliveries — Fleetline" },
      { name: "description", content: "Track your shipments: status, fleet manager, concerns and expected delivery." },
      { property: "og:title", content: "Track Deliveries — Fleetline" },
      { property: "og:description", content: "A live table of every shipment you have with Fleetline." },
    ],
  }),
  component: ClientTrackPage,
});
