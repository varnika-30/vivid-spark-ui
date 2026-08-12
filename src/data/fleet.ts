/** Static demo data for the UI prototype. No backend involved. */

export type Role = "manager" | "driver" | "client";

export type DeliveryStatus =
  | "unassigned"
  | "assigned"
  | "in-transit"
  | "completed"
  | "cancelled"
  | "paused";

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  score: number;
  availability: number;
  status: "on-trip" | "available" | "off-duty";
  vehicle: string;
  trips: number;
  rating: number;
  strengths: string[];
  improvements: string[];
}

export interface DeliveryRequest {
  id: string;
  client: string;
  pickup: string;
  drop: string;
  package: string;
  priority: "High" | "Medium" | "Low";
  preferredDate: string;
  status: "Pending" | "Assigned" | "Review";
  weight: string;
}

export interface Delivery {
  id: string;
  status: DeliveryStatus;
  createdOn: string;
  manager: string;
  driver: string;
  pickup: string;
  drop: string;
  expected: string;
  concern: boolean;
  amount: number;
  method: "Cash" | "UPI" | "Card";
}

export const drivers: Driver[] = [
  {
    id: "DRV-1041",
    name: "Rahul Sharma",
    phone: "+91 98220 41122",
    email: "rahul.sharma@fleetline.io",
    city: "Pune, MH",
    score: 96,
    availability: 92,
    status: "available",
    vehicle: "Tata Ace · MH12 KJ 4410",
    trips: 1284,
    rating: 4.9,
    strengths: ["Excellent safety record", "Zero late pickups this quarter"],
    improvements: ["Maintain a safer following distance", "Reduce idle time in urban traffic"],
  },
  {
    id: "DRV-1120",
    name: "Vikram Patil",
    phone: "+91 98330 55210",
    email: "vikram.patil@fleetline.io",
    city: "Mumbai, MH",
    score: 91,
    availability: 78,
    status: "on-trip",
    vehicle: "Ashok Leyland · MH01 BC 2290",
    trips: 972,
    rating: 4.7,
    strengths: ["Handles high-value freight", "Great client feedback"],
    improvements: ["Braking smoothness", "Fuel efficiency on highways"],
  },
  {
    id: "DRV-1188",
    name: "Aman Verma",
    phone: "+91 90040 88123",
    email: "aman.verma@fleetline.io",
    city: "Nashik, MH",
    score: 87,
    availability: 64,
    status: "on-trip",
    vehicle: "Mahindra Bolero · MH15 AD 7781",
    trips: 640,
    rating: 4.5,
    strengths: ["Fast turnaround", "Flexible schedule"],
    improvements: ["Speeding during night hours", "Document upload delays"],
  },
  {
    id: "DRV-1204",
    name: "Priya Nair",
    phone: "+91 90210 33441",
    email: "priya.nair@fleetline.io",
    city: "Thane, MH",
    score: 94,
    availability: 88,
    status: "available",
    vehicle: "Tata Intra · MH04 GH 1120",
    trips: 810,
    rating: 4.8,
    strengths: ["Cold-chain certified", "Perfect POD compliance"],
    improvements: ["Break scheduling"],
  },
  {
    id: "DRV-1256",
    name: "Imran Sheikh",
    phone: "+91 99870 22004",
    email: "imran.sheikh@fleetline.io",
    city: "Pune, MH",
    score: 82,
    availability: 41,
    status: "off-duty",
    vehicle: "Eicher Pro · MH12 QP 6612",
    trips: 455,
    rating: 4.3,
    strengths: ["Long-haul experience"],
    improvements: ["Harsh cornering", "Route adherence"],
  },
];

export const requests: DeliveryRequest[] = [
  {
    id: "REQ-10481",
    client: "Acme Corp.",
    pickup: "Mumbai, MH",
    drop: "Pune, MH",
    package: "Electronics",
    priority: "High",
    preferredDate: "May 12, 2026",
    status: "Pending",
    weight: "3.4 kg",
  },
  {
    id: "REQ-10482",
    client: "Nord Retail",
    pickup: "Navi Mumbai, MH",
    drop: "Nagpur, MH",
    package: "Apparel",
    priority: "Medium",
    preferredDate: "May 13, 2026",
    status: "Pending",
    weight: "18 kg",
  },
  {
    id: "REQ-10483",
    client: "HealthMart",
    pickup: "Thane, MH",
    drop: "Nashik, MH",
    package: "Medical Supplies",
    priority: "High",
    preferredDate: "May 12, 2026",
    status: "Review",
    weight: "6 kg",
  },
  {
    id: "REQ-10484",
    client: "QuickBuild",
    pickup: "Pune, MH",
    drop: "Satara, MH",
    package: "Hardware",
    priority: "Low",
    preferredDate: "May 15, 2026",
    status: "Assigned",
    weight: "120 kg",
  },
  {
    id: "REQ-10485",
    client: "Tea Sky Ltd.",
    pickup: "Pune, MH",
    drop: "Mumbai, MH",
    package: "Food",
    priority: "Medium",
    preferredDate: "May 14, 2026",
    status: "Pending",
    weight: "42 kg",
  },
  {
    id: "REQ-10486",
    client: "Pharmaflex",
    pickup: "Nashik, MH",
    drop: "Aurangabad, MH",
    package: "Medical Supplies",
    priority: "High",
    preferredDate: "May 16, 2026",
    status: "Pending",
    weight: "9 kg",
  },
];

export const deliveries: Delivery[] = [
  {
    id: "DEL-2026-0816",
    status: "in-transit",
    createdOn: "May 09, 2026",
    manager: "Amit Rao",
    driver: "Rahul Sharma",
    pickup: "Techlink Warehouse, Mumbai",
    drop: "Adira Corporate Office, Pune",
    expected: "May 10, 06:30 PM",
    concern: false,
    amount: 2450,
    method: "UPI",
  },
  {
    id: "DEL-2026-0817",
    status: "assigned",
    createdOn: "May 09, 2026",
    manager: "Amit Rao",
    driver: "Priya Nair",
    pickup: "Cold Hub, Thane",
    drop: "HealthMart, Nashik",
    expected: "May 11, 11:00 AM",
    concern: true,
    amount: 5100,
    method: "Card",
  },
  {
    id: "DEL-2026-0818",
    status: "unassigned",
    createdOn: "May 10, 2026",
    manager: "Sneha Iyer",
    driver: "—",
    pickup: "Nord DC, Navi Mumbai",
    drop: "Nord Store, Nagpur",
    expected: "May 13, 05:00 PM",
    concern: false,
    amount: 9800,
    method: "Cash",
  },
  {
    id: "DEL-2026-0819",
    status: "completed",
    createdOn: "May 06, 2026",
    manager: "Amit Rao",
    driver: "Vikram Patil",
    pickup: "Acme Plant, Mumbai",
    drop: "Acme Depot, Pune",
    expected: "May 07, 02:15 PM",
    concern: false,
    amount: 3300,
    method: "UPI",
  },
  {
    id: "DEL-2026-0820",
    status: "paused",
    createdOn: "May 08, 2026",
    manager: "Sneha Iyer",
    driver: "Aman Verma",
    pickup: "QuickBuild Yard, Pune",
    drop: "Site 14, Satara",
    expected: "May 12, 09:00 AM",
    concern: true,
    amount: 14200,
    method: "Cash",
  },
  {
    id: "DEL-2026-0821",
    status: "cancelled",
    createdOn: "May 05, 2026",
    manager: "Amit Rao",
    driver: "Imran Sheikh",
    pickup: "Tea Sky Roastery, Pune",
    drop: "Cafe Row, Mumbai",
    expected: "May 06, 08:00 PM",
    concern: false,
    amount: 1750,
    method: "Card",
  },
];

export const fleetKpis = [
  { label: "Fleet Score", value: "87.4", delta: "+3.2", trend: "up" as const, unit: "/100" },
  { label: "Active Drivers", value: "142", delta: "+8", trend: "up" as const, unit: "" },
  { label: "Distance Covered", value: "18,320", delta: "+12%", trend: "up" as const, unit: "km" },
  { label: "On-time Rate", value: "81.2", delta: "-1.4", trend: "down" as const, unit: "%" },
  { label: "Open Concerns", value: "18", delta: "-5", trend: "up" as const, unit: "" },
];

export const performanceTrend = [
  { month: "Dec", score: 74, target: 80 },
  { month: "Jan", score: 78, target: 80 },
  { month: "Feb", score: 76, target: 82 },
  { month: "Mar", score: 83, target: 84 },
  { month: "Apr", score: 86, target: 86 },
  { month: "May", score: 91, target: 88 },
];

export const deliveryVolume = [
  { day: "Mon", completed: 128, delayed: 12 },
  { day: "Tue", completed: 146, delayed: 9 },
  { day: "Wed", completed: 132, delayed: 18 },
  { day: "Thu", completed: 168, delayed: 7 },
  { day: "Fri", completed: 184, delayed: 14 },
  { day: "Sat", completed: 152, delayed: 6 },
  { day: "Sun", completed: 96, delayed: 4 },
];

export const behaviourSplit = [
  { name: "Smooth driving", value: 62 },
  { name: "Harsh braking", value: 18 },
  { name: "Speeding", value: 12 },
  { name: "Idling", value: 8 },
];

export const drivingBehaviour = [
  { label: "Harsh Braking", value: 82, tone: "success" as const },
  { label: "Speeding", value: 46, tone: "warning" as const },
  { label: "Rapid Acceleration", value: 68, tone: "info" as const },
  { label: "Cornering", value: 74, tone: "success" as const },
  { label: "Night Drive", value: 38, tone: "destructive" as const },
];

export const driverSchedule = [
  { time: "07:30", title: "Shift start · Techlink Warehouse", type: "shift", city: "Mumbai" },
  { time: "08:45", title: "Pickup · DEL-2026-0816", type: "pickup", city: "Mumbai" },
  { time: "11:20", title: "Checkpoint · Expressway toll", type: "checkpoint", city: "Lonavala" },
  { time: "13:00", title: "Break · 45 min", type: "break", city: "Lonavala" },
  { time: "15:30", title: "Drop · Adira Corporate Office", type: "drop", city: "Pune" },
  { time: "18:00", title: "Shift end · Depot return", type: "shift", city: "Pune" },
];

export const driverStats = [
  { label: "Driver Score", value: "87", sub: "Top 12% of fleet" },
  { label: "Risk Level", value: "Low", sub: "Stable for 6 weeks" },
  { label: "Deliveries Completed", value: "24", sub: "This month" },
  { label: "Safety Grade", value: "A", sub: "Excellent" },
];

export const clientStats = [
  { label: "Active Deliveries", value: "6", sub: "Assigned to a driver" },
  { label: "Pending Requests", value: "3", sub: "Awaiting assignment" },
  { label: "Concerns Raised", value: "1", sub: "Under review" },
  { label: "Delays", value: "2", sub: "Last 30 days" },
];

export const trackingSteps = [
  { label: "Requested", time: "May 09, 10:12 AM", done: true },
  { label: "Reviewed", time: "May 09, 11:40 AM", done: true },
  { label: "Assigned", time: "May 09, 01:05 PM", done: true },
  { label: "Picked Up", time: "May 10, 08:45 AM", done: true },
  { label: "In Transit", time: "May 10, 11:20 AM", done: true },
  { label: "Delivered", time: "Expected 06:30 PM", done: false },
];

export const notifications = [
  { id: 1, title: "Driver assigned", body: "Rahul Sharma accepted DEL-2026-0816.", time: "2m" },
  { id: 2, title: "Delay predicted", body: "Heavy traffic on Mumbai–Pune Expressway.", time: "18m" },
  { id: 3, title: "Concern raised", body: "HealthMart flagged packaging on DEL-…0817.", time: "1h" },
  { id: 4, title: "Report ready", body: "Weekly fleet intelligence report generated.", time: "3h" },
];

export const aiRecommendations = [
  {
    driver: "Rahul Sharma",
    match: 96,
    reasons: ["Excellent safety record", "Experienced with care unit", "Available in 12 min"],
    best: true,
  },
  {
    driver: "Vikram Patil",
    match: 91,
    reasons: ["High on-time delivery rate", "Familiar with this route", "Available in 25 min"],
    best: false,
  },
  {
    driver: "Aman Verma",
    match: 87,
    reasons: ["Medical freight trained", "Handles fragile cargo", "Available in 42 min"],
    best: false,
  },
];

export const statusMeta: Record<DeliveryStatus, { label: string; tone: string }> = {
  unassigned: { label: "Unassigned", tone: "muted" },
  assigned: { label: "Assigned", tone: "info" },
  "in-transit": { label: "In Transit", tone: "primary" },
  completed: { label: "Completed", tone: "success" },
  cancelled: { label: "Cancelled", tone: "destructive" },
  paused: { label: "Paused", tone: "warning" },
};

/* ------------------------------------------------------------------ */
/* Driver detail data (used by the dedicated Driver Details page)      */
/* ------------------------------------------------------------------ */

export interface DriverEmployment {
  employeeId: string;
  joinedOn: string;
  contractType: string;
  shift: string;
  depot: string;
  reportingManager: string;
  licenceNo: string;
  licenceExpiry: string;
  emergencyContact: string;
  address: string;
}

export const driverEmployment: Record<string, DriverEmployment> = {
  default: {
    employeeId: "FL-EMP-0231",
    joinedOn: "Mar 14, 2022",
    contractType: "Full-time · Permanent",
    shift: "Morning · 07:00 – 16:00",
    depot: "Hinjewadi Depot, Pune",
    reportingManager: "Amit Rao",
    licenceNo: "MH12 2019 0044231",
    licenceExpiry: "Nov 30, 2028",
    emergencyContact: "Sunita Sharma · +91 98220 41199",
    address: "B-204, Silver Oak Society, Baner Road, Pune, MH 411045",
  },
};

export interface DriverTrip {
  id: string;
  date: string;
  route: string;
  distance: string;
  duration: string;
  rating: number;
  status: "Completed" | "Delayed" | "Cancelled";
}

export const driverTrips: DriverTrip[] = [
  { id: "TRP-88214", date: "May 09, 2026", route: "Mumbai → Pune", distance: "148 km", duration: "3h 10m", rating: 4.9, status: "Completed" },
  { id: "TRP-88190", date: "May 07, 2026", route: "Pune → Nashik", distance: "210 km", duration: "4h 42m", rating: 4.7, status: "Delayed" },
  { id: "TRP-88151", date: "May 05, 2026", route: "Thane → Pune", distance: "162 km", duration: "3h 28m", rating: 5.0, status: "Completed" },
  { id: "TRP-88102", date: "May 02, 2026", route: "Pune → Satara", distance: "118 km", duration: "2h 35m", rating: 4.8, status: "Completed" },
  { id: "TRP-88044", date: "Apr 29, 2026", route: "Mumbai → Nagpur", distance: "824 km", duration: "14h 05m", rating: 4.4, status: "Completed" },
];

export const driverMonthlyScore = [
  { month: "Dec", score: 79 },
  { month: "Jan", score: 82 },
  { month: "Feb", score: 84 },
  { month: "Mar", score: 88 },
  { month: "Apr", score: 91 },
  { month: "May", score: 94 },
];

/* ------------------------------------------------------------------ */
/* Delivery detail data                                                */
/* ------------------------------------------------------------------ */

export const deliveryPackage = {
  category: "Electronics",
  weight: "3.4 kg",
  size: "M · 40 × 30 × 25 cm",
  handling: "Handle with care · Fragile",
  priority: "High · Normal",
  instructions: "Call the receptionist on arrival. Gate 2 entry only.",
};

export const deliveryActivity = [
  { title: "Delivery created", body: "Requested by Acme Corp.", time: "May 09, 10:12 AM" },
  { title: "Assigned to driver", body: "Rahul Sharma accepted the trip.", time: "May 09, 01:05 PM" },
  { title: "Picked up", body: "Techlink Warehouse, Mumbai.", time: "May 10, 08:45 AM" },
  { title: "In transit", body: "Crossed Lonavala checkpoint.", time: "May 10, 11:20 AM" },
];

export const requestContacts = {
  pickupContact: "Nilesh Kadam · +91 98200 11223",
  dropContact: "Ritu Malhotra · +91 98670 44112",
  payment: "Prepaid · UPI",
  reference: "PO-2026-4471",
  instructions: "Needs soft-cover load handling. Do not stack above 2 boxes.",
};
