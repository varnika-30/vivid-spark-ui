import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/client/deliveries/")({
  beforeLoad: () => {
    throw redirect({ to: "/client" });
  },
  component: () => null,
});
