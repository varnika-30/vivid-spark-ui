import { createFileRoute } from "@tanstack/react-router";
import { SchedulePage } from "@/pages/driver/my-schedule-page";

export const Route = createFileRoute("/driver/schedule")({
  head: () => ({
    meta: [
      { title: "My Schedule — Fleetline" },
      { name: "description", content: "Weekly and monthly driving schedule with stops, breaks and shifts." },
      { property: "og:title", content: "My Schedule — Fleetline" },
      { property: "og:description", content: "Plan your week: shifts, pickups, drops and breaks." },
    ],
  }),
  component: SchedulePage,
});
