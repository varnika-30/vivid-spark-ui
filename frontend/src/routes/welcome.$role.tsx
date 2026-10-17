import { createFileRoute } from "@tanstack/react-router";
import { WelcomePage } from "@/pages/welcome-page";

export const Route = createFileRoute("/welcome/$role")({
  head: () => ({
    meta: [
      { title: "Welcome — Fleetline Workspace" },
      {
        name: "description",
        content:
          "Your personalised Fleetline launchpad: jump into reports, deliveries, schedules and tracking.",
      },
      { property: "og:title", content: "Welcome — Fleetline Workspace" },
      {
        property: "og:description",
        content: "A premium launchpad into fleet reports, deliveries and live tracking.",
      },
    ],
  }),
  component: WelcomeRouteComponent,
});

function WelcomeRouteComponent() {
  const { role } = Route.useParams();
  return <WelcomePage role={role} />;
}
