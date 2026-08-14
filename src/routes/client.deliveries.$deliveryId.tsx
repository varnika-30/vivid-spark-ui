import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Page } from "@/components/fx/page";
import { DeliveryDetails } from "@/components/fx/delivery-details";
import { deliveries } from "@/data/fleet";

export const Route = createFileRoute("/client/deliveries/$deliveryId")({
  loader: ({ params }) => {
    const delivery = deliveries.find((d) => d.id === params.deliveryId);
    if (!delivery) throw notFound();
    return { delivery };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Delivery unavailable — Fleetline" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.delivery.id} — Delivery Details | Fleetline`;
    const description = `Live details for ${loaderData.delivery.id}: route, package information, progress and fleet manager updates.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ClientDeliveryDetail,
});

function ClientDeliveryDetail() {
  const { delivery } = Route.useLoaderData();

  return (
    <Page
      title="Delivery Details"
      description={`${delivery.id} · ${delivery.pickup} → ${delivery.drop}`}
      actions={
        <Link
          to="/client"
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to Track
        </Link>
      }
    >
      <DeliveryDetails delivery={delivery} />
    </Page>
  );
}
