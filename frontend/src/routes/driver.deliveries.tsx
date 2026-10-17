import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/driver/deliveries")({
  component: () => <Outlet />,
});
