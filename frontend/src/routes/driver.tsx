import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";

export const Route = createFileRoute("/driver")({
  component: () => (
    <AppShell role="driver">
      <Outlet />
    </AppShell>
  ),
});
