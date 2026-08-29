import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Page } from "@/components/fx/page";
import { DeliveryDetails } from "@/components/fx/delivery-details";
import { deliveries } from "@/data/fleet";

export const Route = createFileRoute("/driver/deliveries/$deliveryId")({
  loader: ({ params }) => {
    const delivery = deliveries.find((d) => d.id === params.deliveryId);
    if (!delivery) throw notFound();
    return { delivery };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Delivery unavailable — Fleetline" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.delivery.id} — My Delivery | Fleetline`;
    const description = `Route, package information and progress for ${loaderData.delivery.id}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: DriverDeliveryDetail,
});

function DriverDeliveryDetail() {
  const { delivery } = Route.useLoaderData();

  return (
    <Page
      title="Delivery Details"
      description={`${delivery.id} · ${delivery.pickup} → ${delivery.drop}`}
      actions={
        <Link
          to="/driver/deliveries"
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to my deliveries
        </Link>
      }
    >
      <DeliveryDetails delivery={delivery} />
    </Page>
  );
}
