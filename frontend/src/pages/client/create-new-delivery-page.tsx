import { useState } from "react";
import { motion } from "motion/react";
import { format } from "date-fns";
import { CalendarIcon, PackagePlus, Send } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { MagneticButton } from "@/components/fx/magnetic-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AddressBlock, type AddressBlockValues, type AddressBlockErrors } from "@/components/client/address-block";
import { createDeliveryRequest } from "@/services/client.service";

type DateMode = "on" | "before" | "flexible";

const dateModes: { value: DateMode; label: string; hint: string }[] = [
  { value: "on", label: "Deliver on", hint: "Select an exact date" },
  { value: "before", label: "Deliver before", hint: "Select a deadline date" },
  { value: "flexible", label: "Flexible", hint: "Date is optional" },
];

const initialAddress: AddressBlockValues = {
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

export function CreateDeliveryPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<DateMode>("on");
  const [date, setDate] = useState<Date | undefined>();
  const [submitting, setSubmitting] = useState(false);

  // Address states
  const [pickup, setPickup] = useState<AddressBlockValues>(initialAddress);
  const [drop, setDrop] = useState<AddressBlockValues>(initialAddress);

  // Package details state
  const [weight, setWeight] = useState("");
  const [size, setSize] = useState("");
  const [packageType, setPackageType] = useState("");
  const [handleWithCare, setHandleWithCare] = useState("");
  const [priority, setPriority] = useState("");
  const [instructions, setInstructions] = useState("");

  // Error tracking state
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const activeMode = dateModes.find((m) => m.value === mode)!;

  const handleModeChange = (newMode: string) => {
    if (!newMode) return;
    const m = newMode as DateMode;
    setMode(m);
    if (m === "flexible") {
      setDate(undefined);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy["date"];
        return copy;
      });
    }
  };

  const handlePickupChange = (field: keyof AddressBlockValues, val: string) => {
    setPickup((prev) => ({ ...prev, [field]: val }));
    if (errors[`pickup.${field}`]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[`pickup.${field}`];
        return copy;
      });
    }
  };

  const handleDropChange = (field: keyof AddressBlockValues, val: string) => {
    setDrop((prev) => ({ ...prev, [field]: val }));
    if (errors[`drop.${field}`]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[`drop.${field}`];
        return copy;
      });
    }
  };

  const submit = async () => {
    const newErrors: Record<string, boolean> = {};

    // Validate Pickup Address (required: address1, city, state, zip, country)
    if (!pickup.address1.trim()) newErrors["pickup.address1"] = true;
    if (!pickup.city.trim()) newErrors["pickup.city"] = true;
    if (!pickup.state.trim()) newErrors["pickup.state"] = true;
    if (!pickup.zip.trim()) newErrors["pickup.zip"] = true;
    if (!pickup.country.trim()) newErrors["pickup.country"] = true;

    // Validate Drop Address (required: address1, city, state, zip, country)
    if (!drop.address1.trim()) newErrors["drop.address1"] = true;
    if (!drop.city.trim()) newErrors["drop.city"] = true;
    if (!drop.state.trim()) newErrors["drop.state"] = true;
    if (!drop.zip.trim()) newErrors["drop.zip"] = true;
    if (!drop.country.trim()) newErrors["drop.country"] = true;

    // Validate Package Details
    if (!weight.trim() || !/^\d+$/.test(weight.trim())) newErrors["weight"] = true;
    if (!size.trim() || isNaN(Number(size.trim())) || !/^\d*\.?\d+$/.test(size.trim()) || Number(size.trim()) <= 0) newErrors["size"] = true;
    if (!packageType) newErrors["packageType"] = true;
    if (!handleWithCare) newErrors["handleWithCare"] = true;
    if (!priority) newErrors["priority"] = true;

    // Validate Date if "Deliver on" or "Deliver before"
    if ((mode === "on" || mode === "before") && !date) {
      newErrors["date"] = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const missingSections: string[] = [];
      if (Object.keys(newErrors).some((k) => k.startsWith("pickup."))) missingSections.push("Pickup address");
      if (Object.keys(newErrors).some((k) => k.startsWith("drop."))) missingSections.push("Drop address");
      if (
        newErrors["weight"] ||
        newErrors["size"] ||
        newErrors["packageType"] ||
        newErrors["handleWithCare"] ||
        newErrors["priority"]
      ) {
        missingSections.push("Package details");
      }
      if (newErrors["date"]) {
        missingSections.push(mode === "on" ? "Exact delivery date" : "Deadline date");
      }

      toast.error("Please fill in all required fields", {
        description: `Missing: ${missingSections.join(", ")}.`,
      });
      return;
    }

    setSubmitting(true);
    try {
      const pickupAddressStr = `${pickup.address1}, ${pickup.address2 ? pickup.address2 + ', ' : ''}${pickup.city}, ${pickup.state} ${pickup.zip}, ${pickup.country}`;
      const dropAddressStr = `${drop.address1}, ${drop.address2 ? drop.address2 + ', ' : ''}${drop.city}, ${drop.state} ${drop.zip}, ${drop.country}`;

      await createDeliveryRequest({
        pickupAddress: pickupAddressStr,
        dropAddress: dropAddressStr,
        packageCategory: packageType || 'General Goods',
        weightKg: parseFloat(weight) || 5,
        handleWithCare: handleWithCare === 'yes',
        priority: (priority.toLowerCase() as any) || 'normal',
        dateMode: mode,
        preferredDate: date ? date.toISOString() : undefined,
        specialInstructions: instructions || undefined,
        estimatedCost: 2450,
      });

      toast.success("Delivery request submitted", {
        description: "We'll assign a driver shortly.",
      });

      navigate({ to: "/client" });
    } catch (err: any) {
      toast.error(err.message || "Failed to submit delivery request");
    } finally {
      setSubmitting(false);
    }
  };

  const pickupErrors: AddressBlockErrors = {
    ...(errors["pickup.address1"] ? { address1: true } : {}),
    ...(errors["pickup.city"] ? { city: true } : {}),
    ...(errors["pickup.state"] ? { state: true } : {}),
    ...(errors["pickup.zip"] ? { zip: true } : {}),
    ...(errors["pickup.country"] ? { country: true } : {}),
  };

  const dropErrors: AddressBlockErrors = {
    ...(errors["drop.address1"] ? { address1: true } : {}),
    ...(errors["drop.city"] ? { city: true } : {}),
    ...(errors["drop.state"] ? { state: true } : {}),
    ...(errors["drop.zip"] ? { zip: true } : {}),
    ...(errors["drop.country"] ? { country: true } : {}),
  };

  return (
    <Page
      title="Create New Delivery"
      description="Tell us what's moving and where — we'll match the right driver automatically."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <AddressBlock
          title="Pickup at"
          values={pickup}
          onChange={handlePickupChange}
          errors={pickupErrors}
        />
        <AddressBlock
          title="Drop at"
          values={drop}
          onChange={handleDropChange}
          errors={dropErrors}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <GlassPanel className="lg:col-span-2" title="Package details" hoverable={false}>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center justify-between">
                <span>Weight (kg) <span className="text-destructive">*</span></span>
                {errors["weight"] && <span className="text-[10px] font-medium text-destructive">Integer required</span>}
              </Label>
              <Input
                type="number"
                step="1"
                placeholder="e.g. 15"
                value={weight}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d+$/.test(val)) {
                    setWeight(val);
                    if (errors["weight"]) setErrors((prev) => ({ ...prev, weight: false }));
                  }
                }}
                className={cn("bg-surface/40 transition-colors duration-200", errors["weight"] && "border-destructive focus-visible:ring-destructive")}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center justify-between">
                <span>Size / Dimensions (cm) <span className="text-destructive">*</span></span>
                {errors["size"] && <span className="text-[10px] font-medium text-destructive">Must be numeric</span>}
              </Label>
              <Input
                type="number"
                step="any"
                min="0"
                placeholder="e.g. 45.5"
                value={size}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d*\.?\d*$/.test(val)) {
                    setSize(val);
                    if (errors["size"]) setErrors((prev) => ({ ...prev, size: false }));
                  }
                }}
                className={cn("bg-surface/40 transition-colors duration-200", errors["size"] && "border-destructive focus-visible:ring-destructive")}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center justify-between">
                <span>Type of package <span className="text-destructive">*</span></span>
                {errors["packageType"] && <span className="text-[10px] font-medium text-destructive">Required</span>}
              </Label>
              <Select
                value={packageType}
                onValueChange={(val) => {
                  setPackageType(val);
                  if (errors["packageType"]) setErrors((prev) => ({ ...prev, packageType: false }));
                }}
              >
                <SelectTrigger className={cn("bg-surface/40 transition-colors duration-200", errors["packageType"] && "border-destructive focus-visible:ring-destructive")}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {["Document", "Clothes", "Food", "Furniture", "Electronics", "Medicine", "Supplies", "Other"].map((t) => (
                    <SelectItem key={t} value={t.toLowerCase()}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center justify-between">
                <span>Handle with care <span className="text-destructive">*</span></span>
                {errors["handleWithCare"] && <span className="text-[10px] font-medium text-destructive">Required</span>}
              </Label>
              <Select
                value={handleWithCare}
                onValueChange={(val) => {
                  setHandleWithCare(val);
                  if (errors["handleWithCare"]) setErrors((prev) => ({ ...prev, handleWithCare: false }));
                }}
              >
                <SelectTrigger className={cn("bg-surface/40 transition-colors duration-200", errors["handleWithCare"] && "border-destructive focus-visible:ring-destructive")}>
                  <SelectValue placeholder="Yes / No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center justify-between">
                <span>Priority <span className="text-destructive">*</span></span>
                {errors["priority"] && <span className="text-[10px] font-medium text-destructive">Required</span>}
              </Label>
              <Select
                value={priority}
                onValueChange={(val) => {
                  setPriority(val);
                  if (errors["priority"]) setErrors((prev) => ({ ...prev, priority: false }));
                }}
              >
                <SelectTrigger className={cn("bg-surface/40 transition-colors duration-200", errors["priority"] && "border-destructive focus-visible:ring-destructive")}>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel title="Summary" subtitle="Estimated on submission">
          <div className="space-y-3 text-sm">
            {[
              { label: "Estimated cost", value: "₹2,450" },
              { label: "Estimated transit", value: "4h 10m" },
              { label: "Driver match", value: "Auto (AI)" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between rounded-xl border border-border p-3">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium">{row.value}</span>
              </div>
            ))}
          </div>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-4 flex items-center gap-2 rounded-xl bg-primary/10 p-3 text-xs text-muted-foreground"
          >
            <PackagePlus className="size-4 text-primary" />
            Requests submitted before 4 PM are usually assigned the same day.
          </motion.div>
        </GlassPanel>
      </div>

      <GlassPanel className="mt-4" title="Date" hoverable={false}>
        <div className="space-y-4">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={handleModeChange}
            className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3"
          >
            {dateModes.map((m) => (
              <ToggleGroupItem
                key={m.value}
                value={m.value}
                className={cn(
                  "h-auto w-full flex-col items-start gap-0.5 rounded-xl border border-border bg-surface/40 px-4 py-3 text-left",
                  "data-[state=on]:border-primary/50 data-[state=on]:bg-primary/12 data-[state=on]:text-primary",
                )}
              >
                <span className="text-sm font-medium">{m.label}</span>
                <span className="text-[11px] font-normal text-muted-foreground">{m.hint}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          {mode !== "flexible" && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1.5"
            >
              <Label className="text-xs text-muted-foreground flex items-center justify-between">
                <span>{activeMode.label} <span className="text-destructive">*</span></span>
                {errors["date"] && <span className="text-[10px] font-medium text-destructive">Required</span>}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md border border-input bg-surface/40 px-3 py-2 text-left text-sm transition-colors hover:border-primary/40",
                      !date && "text-muted-foreground",
                      errors["date"] && "border-destructive focus-visible:ring-destructive"
                    )}
                  >
                    <CalendarIcon className="size-4 shrink-0 text-primary" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      if (d && errors["date"]) {
                        setErrors((prev) => ({ ...prev, date: false }));
                      }
                    }}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </motion.div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Any special instructions</Label>
            <Textarea
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Fragile items, gate codes, contact preferences…"
              className="w-full bg-surface/40"
            />
          </div>

          <div className="flex justify-end">
            <MagneticButton variant="primary" icon={<Send className="size-4" />} onClick={submit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit request"}
            </MagneticButton>
          </div>
        </div>
      </GlassPanel>
    </Page>
  );
}
