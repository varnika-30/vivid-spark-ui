import { createFileRoute, notFound } from "@tanstack/react-router";
import { ManagerDeliveryDetailPage } from "@/pages/manager/delivery-detail-page";
import { deliveries } from "@/data/fleet";

export const Route = createFileRoute("/manager/deliveries/$deliveryId")({
  loader: ({ params }) => {
    const delivery = deliveries.find((d) => d.id === params.deliveryId);
    if (!delivery) throw notFound();
    return { delivery };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Delivery unavailable — Fleetline" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.delivery.id} — Delivery Control | Fleetline`;
    const description = `Operational view for ${loaderData.delivery.id}: driver, route, package and live progress.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ManagerDeliveryDetailRouteComponent,
});

function ManagerDeliveryDetailRouteComponent() {
  const { delivery } = Route.useLoaderData();
  return <ManagerDeliveryDetailPage delivery={delivery} />;
}
