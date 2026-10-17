import { createFileRoute } from "@tanstack/react-router";
import { WelcomePage } from "@/pages/welcome-page";

export const Route = createFileRoute("/driver/")({
  head: () => ({
    meta: [
      { title: "Driver Workspace — Fleetline" },
      { name: "description", content: "Driver Portal landing workspace: review your schedule or performance." },
      { property: "og:title", content: "Driver Workspace — Fleetline" },
      { property: "og:description", content: "Check your assigned schedule or review your performance." },
    ],
  }),
  component: DriverLandingComponent,
});

function DriverLandingComponent() {
  return <WelcomePage role="driver" />;
}
