import { createFileRoute } from "@tanstack/react-router";
import { DriverDocumentStatusPage } from "@/pages/driver/document-status-page";

export const Route = createFileRoute("/driver/documents")({
  head: () => ({
    meta: [
      { title: "Document Status — Fleetline" },
      { name: "description", content: "View driver document status, expiration dates, and upload renewed certificates." },
      { property: "og:title", content: "Document Status — Fleetline" },
      { property: "og:description", content: "Driver certificate status and compliance document verification." },
    ],
  }),
  component: DriverDocumentStatusPage,
});
