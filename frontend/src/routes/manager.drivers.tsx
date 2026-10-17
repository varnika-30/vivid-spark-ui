import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/manager/drivers")({
  component: () => <Outlet />,
});
