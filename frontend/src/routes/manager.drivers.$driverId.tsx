import { createFileRoute, notFound } from "@tanstack/react-router";
import { ManagerDriverDetailPage } from "@/pages/manager/driver-information-page";
import { drivers } from "@/data/fleet";

import { getManagerDriverById } from "@/services/manager.service";
import { registerDriverInStore, type Driver } from "@/data/fleet";
import { initDriverDocuments } from "@/data/documents";

export const Route = createFileRoute("/manager/drivers/$driverId")({
  loader: async ({ params }) => {
    let driver = drivers.find((d) => d.id === params.driverId || d.id.toLowerCase() === params.driverId.toLowerCase());
    if (!driver) {
      try {
        const res = await getManagerDriverById(params.driverId);
        if (res.data) {
          const d = res.data;
          const mappedDriver: Driver = {
            id: d.id,
            name: d.name,
            phone: d.phone || "",
            email: d.email || "",
            city: d.city || "Not provided",
            score: d.score || 0,
            availability: d.availability ?? 100,
            status: (d.status === "on_trip" ? "on-trip" : d.status === "off_duty" ? "off-duty" : d.status) as Driver["status"],
            vehicle: d.vehicle || "Not assigned",
            trips: d.trips || 0,
            rating: d.rating || 0,
            strengths: [],
            improvements: [],
          };
          registerDriverInStore(mappedDriver, d.employment);
          initDriverDocuments(mappedDriver.id, mappedDriver.name);
          driver = mappedDriver;
        }
      } catch (err) {
        console.warn("Could not fetch driver by ID from backend:", err);
      }
    }
    if (!driver) throw notFound();
    return { driver };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Driver not found — Fleetline" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.driver.name} — Driver Details · Fleetline` },
        {
          name: "description",
          content: `Profile, employment record, compliance documents, trips and driving behaviour for ${loaderData.driver.name}.`,
        },
        { property: "og:title", content: `${loaderData.driver.name} — Driver Details` },
        {
          property: "og:description",
          content: "Driver compliance, behaviour analytics, trip history and current assignment.",
        },
      ],
    };
  },
  component: ManagerDriverDetailRouteComponent,
});

function ManagerDriverDetailRouteComponent() {
  const { driver } = Route.useLoaderData();
  return <ManagerDriverDetailPage driver={driver} />;
}
