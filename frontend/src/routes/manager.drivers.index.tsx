import { createFileRoute } from "@tanstack/react-router";
import { ManagerDriversPage } from "@/pages/manager/drivers-page";

export const Route = createFileRoute("/manager/drivers/")({
  head: () => ({
    meta: [
      { title: "Drivers — Fleetline" },
      {
        name: "description",
        content: "Browse fleet drivers as live cards: availability, safety score and vehicle assignment.",
      },
      { property: "og:title", content: "Drivers — Fleetline" },
      { property: "og:description", content: "Driver roster cards with live availability and scores." },
    ],
  }),
  component: ManagerDriversPage,
});
