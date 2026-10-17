import { createFileRoute, notFound } from "@tanstack/react-router";
import { DriverDeliveryDetailPage } from "@/pages/driver/delivery-detail-page";
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
  component: DriverDeliveryDetailRouteComponent,
});

function DriverDeliveryDetailRouteComponent() {
  const { delivery } = Route.useLoaderData();
  return <DriverDeliveryDetailPage delivery={delivery} />;
}
