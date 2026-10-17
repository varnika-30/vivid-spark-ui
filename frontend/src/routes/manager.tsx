import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";

export const Route = createFileRoute("/manager")({
  component: () => (
    <AppShell role="manager">
      <Outlet />
    </AppShell>
  ),
});
