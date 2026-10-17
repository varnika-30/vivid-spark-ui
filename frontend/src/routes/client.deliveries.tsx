import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/client/deliveries")({
  component: () => <Outlet />,
});
