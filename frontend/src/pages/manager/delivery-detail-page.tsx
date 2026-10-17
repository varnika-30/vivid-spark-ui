import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Page } from "@/components/fx/page";
import { DeliveryDetails } from "@/components/fx/delivery-details";
import type { Delivery } from "@/data/fleet";

export function ManagerDeliveryDetailPage({ delivery }: { delivery: Delivery }) {
  return (
    <Page
      title="Delivery Details"
      description={`${delivery.id} · ${delivery.pickup} → ${delivery.drop}`}
      actions={
        <Link
          to="/manager/deliveries"
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to deliveries
        </Link>
      }
    >
      <DeliveryDetails delivery={delivery} />
    </Page>
  );
}
