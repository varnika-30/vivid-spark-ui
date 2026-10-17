import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/pages/login-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fleetline — Sign in to your fleet workspace" },
      {
        name: "description",
        content:
          "Sign in to Fleetline to manage drivers, deliveries and trip intelligence across your fleet.",
      },
      { property: "og:title", content: "Fleetline — Sign in to your fleet workspace" },
      {
        property: "og:description",
        content: "AI-assisted fleet operations for managers, drivers and clients.",
      },
    ],
  }),
  component: LoginPage,
});
