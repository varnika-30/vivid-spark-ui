import { createFileRoute } from "@tanstack/react-router";
import { PerformancePage } from "@/pages/driver/my-performance-page";

export const Route = createFileRoute("/driver/performance")({
  head: () => ({
    meta: [
      { title: "My Performance — Fleetline" },
      { name: "description", content: "Track your driving performance, safety grade and AI coaching tips." },
      { property: "og:title", content: "My Performance — Fleetline" },
      { property: "og:description", content: "Safety grade, behaviour analytics and coaching tips." },
    ],
  }),
  component: PerformancePage,
});
