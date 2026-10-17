import { createFileRoute, notFound } from "@tanstack/react-router";
import { ClientDeliveryDetailPage } from "@/pages/client/delivery-detail-page";
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
  component: ClientDeliveryDetailRouteComponent,
});

function ClientDeliveryDetailRouteComponent() {
  const { delivery } = Route.useLoaderData();
  return <ClientDeliveryDetailPage delivery={delivery} />;
}
