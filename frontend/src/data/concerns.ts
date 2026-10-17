export type ConcernCategory =
  | "Package Issue"
  | "Pickup Issue"
  | "Delivery Issue"
  | "Incorrect System Detection"
  | "Other";

export type ContextReason =
  | "Detection was incorrect"
  | "Sudden obstacle"
  | "Traffic situation"
  | "Road condition"
  | "Emergency situation"
  | "Other";

export interface SystemDetectedEvent {
  type: "Harsh Braking" | "Speeding" | "Rapid Acceleration" | "Sharp Cornering" | "Accident Event";
  timestamp: string;
  location: string;
  details: string;
}

export interface DriverConcern {
  id: string;
  driverId: string;
  driverName: string;
  category: ConcernCategory;
  tripId?: string | undefined;
  deliveryId?: string | undefined;
  systemDetectedEvent?: SystemDetectedEvent | undefined;
  contextReason?: ContextReason | undefined;
  description: string;
  submittedAt: string;
  status: "Pending Review" | "Reviewed & Verified" | "Dismissed";
}

export const initialConcerns: DriverConcern[] = [
  {
    id: "CON-9012",
    driverId: "DRV-1041",
    driverName: "Rahul Sharma",
    category: "Incorrect System Detection",
    tripId: "TRP-8421",
    deliveryId: "DEL-2026-0816",
    systemDetectedEvent: {
      type: "Harsh Braking",
      timestamp: "09:55 AM",
      location: "Khed Toll Plaza Approach",
      details: "Harsh deceleration event detected (-0.45g)",
    },
    contextReason: "Sudden obstacle",
    description: "Car in adjacent lane abruptly cut across toll queue without signaling, requiring quick braking to prevent collision.",
    submittedAt: "May 10, 2026, 10:12 AM",
    status: "Pending Review",
  },
  {
    id: "CON-9013",
    driverId: "DRV-1188",
    driverName: "Aman Verma",
    category: "Pickup Issue",
    tripId: "TRP-8424",
    deliveryId: "DEL-2026-0820",
    description: "Loading Dock B ramp obstructed by illegally parked maintenance truck. Delayed loading by 12 minutes.",
    submittedAt: "May 08, 2026, 11:30 PM",
    status: "Reviewed & Verified",
  },
  {
    id: "CON-9014",
    driverId: "DRV-1041",
    driverName: "Rahul Sharma",
    category: "Package Issue",
    tripId: "TRP-8422",
    deliveryId: "DEL-2026-0817",
    description: "Client requested double-layered protective tarp due to unexpected rain forecast at drop location.",
    submittedAt: "May 09, 2026, 02:45 PM",
    status: "Pending Review",
  },
];

let concernsList: DriverConcern[] = [...initialConcerns];
const listeners = new Set<() => void>();

export function getConcerns(): DriverConcern[] {
  return concernsList;
}

export function addConcern(concernData: Omit<DriverConcern, "id" | "submittedAt" | "status">): DriverConcern {
  const newConcern: DriverConcern = {
    ...concernData,
    id: `CON-${Math.floor(1000 + Math.random() * 9000)}`,
    submittedAt: new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    status: "Pending Review",
  };
  concernsList = [newConcern, ...concernsList];
  listeners.forEach((fn) => fn());
  return newConcern;
}

export function updateConcernStatus(id: string, status: DriverConcern["status"]): void {
  concernsList = concernsList.map((c: DriverConcern) => (c.id === id ? { ...c, status } : c));
  listeners.forEach((fn) => fn());
}

export function subscribeConcerns(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
