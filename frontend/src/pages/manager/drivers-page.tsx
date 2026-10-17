import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpDown, MapPin, Phone, Star, Truck, UserPlus, UserSearch, X, Plus, Mail, Building, FileCheck } from "lucide-react";
import { toast } from "sonner";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { TiltCard } from "@/components/fx/tilt-card";
import { StatusPill, type Tone } from "@/components/fx/status-pill";
import { MagneticButton } from "@/components/fx/magnetic-button";
import { AnimatedSearch, FilterChips } from "@/components/fx/controls";
import { LoadingRows } from "@/components/fx/skeletons";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { drivers, addDriver, registerDriverInStore, type Driver } from "@/data/fleet";
import { initDriverDocuments } from "@/data/documents";
import { DocumentRequirementsModal } from "@/components/manager/document-requirements-modal";
import { getManagerDrivers, createDriver } from "@/services/manager.service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { DataPagination } from "@/components/common/data-pagination";

const statusFilters = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "on-trip", label: "On trip" },
  { value: "off-duty", label: "Off duty" },
] as const;

const statusTone: Record<Driver["status"], Tone> = {
  available: "success",
  "on-trip": "primary",
  "off-duty": "muted",
};

export function ManagerDriversPage() {
  const loading = useSimulatedLoading(600);
  const navigate = useNavigate();
  const [driverList, setDriverList] = useState<Driver[]>(() => [...drivers]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusFilters)[number]["value"]>("all");
  const [sortDesc, setSortDesc] = useState(true);

  // Sync drivers from PostgreSQL database on mount
  useEffect(() => {
    let isMounted = true;
    getManagerDrivers()
      .then((res) => {
        if (isMounted && res.data && Array.isArray(res.data)) {
          res.data.forEach((d: any) => {
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
          });
          setDriverList([...drivers]);
        }
      })
      .catch((err) => {
        console.warn("Backend API notice:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Document Requirements & Add Driver Modal State
  const [isRequirementsModalOpen, setIsRequirementsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [joinedOn, setJoinedOn] = useState("");
  const [contractType, setContractType] = useState("");
  const [shiftWindow, setShiftWindow] = useState("");
  const [assignedDepot, setAssignedDepot] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [driverStatus, setDriverStatus] = useState<Driver["status"]>("available");
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setCity("");
    setAddress("");
    setEmergencyContactName("");
    setEmergencyContactPhone("");
    setEmployeeCode("");
    setJoinedOn("");
    setContractType("");
    setShiftWindow("");
    setAssignedDepot("");
    setLicenseNumber("");
    setLicenseExpiry("");
    setVehicle("");
    setDriverStatus("available");
    setFormErrors({});
  };

  const handleAddDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, boolean> = {};
    if (!name.trim()) errors.name = true;
    if (!phone.trim()) errors.phone = true;
    if (!email.trim()) errors.email = true;
    if (!city.trim()) errors.city = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required driver details (*)");
      return;
    }

    const payload = {
      fullName: name.trim(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim() || city.trim(),
      emergencyContactName: emergencyContactName.trim() || undefined,
      emergencyContactPhone: emergencyContactPhone.trim() || undefined,
      employeeCode: employeeCode.trim() || undefined,
      employeeId: employeeCode.trim() || undefined,
      joinedOn: joinedOn || undefined,
      contractType: contractType.trim() || undefined,
      shiftWindow: shiftWindow.trim() || undefined,
      shift: shiftWindow.trim() || undefined,
      assignedDepot: assignedDepot.trim() || city.trim(),
      depot: assignedDepot.trim() || city.trim(),
      licenseNumber: licenseNumber.trim() || undefined,
      licenceNo: licenseNumber.trim() || undefined,
      licenseExpiry: licenseExpiry || undefined,
      licenceExpiry: licenseExpiry || undefined,
      vehicle: vehicle.trim() || "Not assigned",
      status: driverStatus === "on-trip" ? "on_trip" : driverStatus === "off-duty" ? "off_duty" : "available",
    };

    try {
      const res = await createDriver(payload);
      const created = res.data;

      const mappedDriver: Driver = {
        id: created.id,
        name: created.name,
        phone: created.phone || payload.phone,
        email: created.email || payload.email,
        city: created.city || payload.city,
        score: 0,
        availability: 100,
        status: driverStatus,
        vehicle: created.vehicle || payload.vehicle || "Not assigned",
        trips: 0,
        rating: 0,
        strengths: [],
        improvements: [],
      };

      registerDriverInStore(mappedDriver, created.employment || {
        employeeId: payload.employeeCode || `FL-EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        joinedOn: payload.joinedOn || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        contractType: payload.contractType || "Not provided",
        shift: payload.shiftWindow || "Not provided",
        depot: payload.assignedDepot || payload.city || "Not assigned",
        reportingManager: "Not assigned",
        licenceNo: payload.licenseNumber || "Not provided",
        licenceExpiry: payload.licenseExpiry || "Not provided",
        emergencyContact: [payload.emergencyContactName, payload.emergencyContactPhone].filter(Boolean).join(" · ") || "Not provided",
        address: payload.address || payload.city || "Not provided",
      });

      initDriverDocuments(mappedDriver.id, mappedDriver.name);

      setDriverList([...drivers]);
      setIsAddModalOpen(false);
      resetForm();

      toast.success(`Driver ${mappedDriver.name} (${mappedDriver.id}) added to database!`, {
        description: "Driver profile persisted & default compliance documents initialized.",
      });
    } catch (err: any) {
      console.error("Backend create driver error:", err);
      toast.error(err?.message || "Failed to create driver in database. Please check connection and details.");
    }
  };

  const cards = useMemo(() => {
    const filtered = drivers.filter(
      (d) =>
        (status === "all" || d.status === status) &&
        (d.name + d.city + d.id).toLowerCase().includes(query.toLowerCase()),
    );
    return [...filtered].sort((a, b) => (sortDesc ? b.score - a.score : a.score - b.score));
  }, [query, status, sortDesc, driverList]);

  const PAGE_SIZE = 9;
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [query, status, sortDesc]);

  const totalPages = Math.ceil(cards.length / PAGE_SIZE);
  const paginatedCards = cards.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Page
      title="Drivers"
      description="Everyone on the road today, with live availability, safety scores and assignments."
      actions={
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsRequirementsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary shadow-[var(--shadow-glow)] hover:bg-primary/20 transition-all cursor-pointer"
          >
            <FileCheck className="size-4" />
            Document Requirements
          </button>
          <MagneticButton
            variant="primary"
            icon={<UserPlus className="size-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add driver
          </MagneticButton>
        </div>
      }
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <AnimatedSearch value={query} onChange={setQuery} placeholder="Search driver, city or ID…" />
        <FilterChips options={statusFilters} value={status} onChange={setStatus} layoutId="driver-filter" />
        <button
          onClick={() => setSortDesc((s) => !s)}
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-border px-3.5 py-2.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          Score
          <motion.span
            animate={{ rotate: sortDesc ? 0 : 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ArrowUpDown className="size-3.5" />
          </motion.span>
        </button>
      </div>

      {loading ? (
        <GlassPanel className="mt-4" hoverable={false}>
          <LoadingRows rows={5} />
        </GlassPanel>
      ) : (
        <>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {paginatedCards.map((d, i) => (
              <motion.div
                key={d.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 240, damping: 26 }}
              >
                <TiltCard className="h-full" intensity={5}>
                  <div
                    role="link"
                    tabIndex={0}
                    onClick={() =>
                      navigate({ to: "/manager/drivers/$driverId", params: { driverId: d.id } })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate({ to: "/manager/drivers/$driverId", params: { driverId: d.id } });
                      }
                    }}
                    className="flex h-full cursor-pointer flex-col p-5 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    <div className="flex items-start gap-3">
                      <motion.span
                        whileHover={{ scale: 1.06 }}
                        className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-sm font-semibold text-primary-foreground"
                      >
                        {d.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </motion.span>
                      <div className="min-w-0">
                        <p className="truncate font-display text-base font-semibold">{d.name}</p>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          {d.id}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <StatusPill tone={statusTone[d.status]} pulse={d.status === "on-trip"}>
                          {d.status.replace("-", " ")}
                        </StatusPill>
                      </div>
                    </div>

                    <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <Truck className="size-3.5 shrink-0 text-primary" /> {d.vehicle}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="size-3.5 shrink-0 text-primary" /> {d.city}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="size-3.5 shrink-0 text-primary" /> {d.phone}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-border/70 bg-surface-2/30 p-3 text-center">
                      <div>
                        <p className="font-display text-lg font-semibold">
                          {d.trips > 0 && d.score > 0 ? d.score : "N/A"}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                          Score
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center justify-center gap-1 font-display text-lg font-semibold">
                          {d.trips > 0 && d.rating > 0 ? (
                            <>
                              {d.rating.toFixed(1)}
                              <Star className="size-3.5 text-warning" />
                            </>
                          ) : (
                            "N/A"
                          )}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                          Rating
                        </p>
                      </div>
                      <div>
                        <p className="font-display text-lg font-semibold">
                          {d.trips.toLocaleString()}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                          Trips
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Availability</span>
                        <span>{d.availability}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${d.availability}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full",
                            d.availability > 70
                              ? "bg-success"
                              : d.availability > 40
                                ? "bg-warning"
                                : "bg-destructive",
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">{paginatedCards.length}</span> of{" "}
            <span className="font-medium text-foreground">{cards.length}</span> drivers
          </p>
          {totalPages > 1 && (
            <DataPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </>
    )}

      {!loading && cards.length === 0 && (
        <GlassPanel className="mt-4 flex flex-col items-center gap-3 py-16 text-center" hoverable={false}>
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="grid size-14 place-items-center rounded-2xl bg-primary/12 text-primary"
          >
            <UserSearch className="size-6" />
          </motion.span>
          <p className="text-sm font-medium">No drivers match this view</p>
        </GlassPanel>
      )}

      {/* ADD DRIVER MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative w-full max-w-2xl rounded-3xl border border-border bg-popover p-5 sm:p-6 shadow-2xl z-10 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary border border-primary/30 shadow-[var(--shadow-glow)]">
                    <UserPlus className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">Onboard New Driver</h3>
                    <p className="text-xs text-muted-foreground">Enter complete driver profile, contact & compliance details</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-border p-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleAddDriverSubmit} className="space-y-4 pt-3 overflow-y-auto pr-1 flex-1">
                {/* Section 1: Personal & Contact Information */}
                <div className="space-y-3 rounded-2xl border border-border/70 bg-surface-2/20 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-primary flex items-center gap-1.5">
                    <UserPlus className="size-3.5" /> Personal & Contact Details
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs text-muted-foreground">Full Name <span className="text-destructive">*</span></Label>
                      <Input
                        placeholder="e.g. Karan Singh"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (formErrors.name) setFormErrors((p) => ({ ...p, name: false }));
                        }}
                        className={cn("bg-surface/40 text-xs", formErrors.name && "border-destructive")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Phone Number <span className="text-destructive">*</span></Label>
                      <Input
                        placeholder="e.g. +91 98110 22334"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (formErrors.phone) setFormErrors((p) => ({ ...p, phone: false }));
                        }}
                        className={cn("bg-surface/40 text-xs", formErrors.phone && "border-destructive")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Email Address <span className="text-destructive">*</span></Label>
                      <Input
                        type="email"
                        placeholder="karan.singh@fleetline.io"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (formErrors.email) setFormErrors((p) => ({ ...p, email: false }));
                        }}
                        className={cn("bg-surface/40 text-xs", formErrors.email && "border-destructive")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Base City <span className="text-destructive">*</span></Label>
                      <Input
                        placeholder="e.g. Pune, MH"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (formErrors.city) setFormErrors((p) => ({ ...p, city: false }));
                        }}
                        className={cn("bg-surface/40 text-xs", formErrors.city && "border-destructive")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Residential Address</Label>
                      <Input
                        placeholder="e.g. B-204, Silver Oak, Baner, Pune"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="bg-surface/40 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Emergency Contact Name</Label>
                      <Input
                        placeholder="e.g. Sunita Sharma"
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                        className="bg-surface/40 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Emergency Contact Phone</Label>
                      <Input
                        placeholder="e.g. +91 98220 41199"
                        value={emergencyContactPhone}
                        onChange={(e) => setEmergencyContactPhone(e.target.value)}
                        className="bg-surface/40 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Employment & Operational Record */}
                <div className="space-y-3 rounded-2xl border border-border/70 bg-surface-2/20 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-primary flex items-center gap-1.5">
                    <Building className="size-3.5" /> Employment & Shift Details
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Employee ID</Label>
                      <Input
                        placeholder="e.g. FL-EMP-0380 (Auto-generated if empty)"
                        value={employeeCode}
                        onChange={(e) => setEmployeeCode(e.target.value)}
                        className="bg-surface/40 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Joined Date</Label>
                      <Input
                        type="date"
                        value={joinedOn}
                        onChange={(e) => setJoinedOn(e.target.value)}
                        className="bg-surface/40 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Contract Type</Label>
                      <select
                        value={contractType}
                        onChange={(e) => setContractType(e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface/60 p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">Select Contract Type</option>
                        <option value="Full-time · Permanent">Full-time · Permanent</option>
                        <option value="Full-time · Contract">Full-time · Contract</option>
                        <option value="Part-time">Part-time</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Shift Window</Label>
                      <Input
                        placeholder="e.g. Morning · 07:00 – 16:00"
                        value={shiftWindow}
                        onChange={(e) => setShiftWindow(e.target.value)}
                        className="bg-surface/40 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs text-muted-foreground">Assigned Depot</Label>
                      <Input
                        placeholder="e.g. Hinjewadi Depot, Pune"
                        value={assignedDepot}
                        onChange={(e) => setAssignedDepot(e.target.value)}
                        className="bg-surface/40 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Licence & Vehicle Record */}
                <div className="space-y-3 rounded-2xl border border-border/70 bg-surface-2/20 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-primary flex items-center gap-1.5">
                    <Truck className="size-3.5" /> Licence & Vehicle Record
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Licence Number</Label>
                      <Input
                        placeholder="e.g. MH12 2019 0044231"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        className="bg-surface/40 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Licence Expiry Date</Label>
                      <Input
                        type="date"
                        value={licenseExpiry}
                        onChange={(e) => setLicenseExpiry(e.target.value)}
                        className="bg-surface/40 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Assigned Vehicle</Label>
                      <Input
                        placeholder="e.g. Tata Ace EV · MH12 AB 9988"
                        value={vehicle}
                        onChange={(e) => setVehicle(e.target.value)}
                        className="bg-surface/40 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Initial Availability Status</Label>
                      <select
                        value={driverStatus}
                        onChange={(e) => setDriverStatus(e.target.value as any)}
                        className="w-full rounded-xl border border-border bg-surface/60 p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="available">Available</option>
                        <option value="on-trip">On Trip</option>
                        <option value="off-duty">Off Duty</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary/90 transition-all cursor-pointer"
                  >
                    <Plus className="size-4" /> Create Driver Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DocumentRequirementsModal
        isOpen={isRequirementsModalOpen}
        onClose={() => setIsRequirementsModalOpen(false)}
      />
    </Page>
  );
}
