import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { format } from "date-fns";
import { CalendarIcon, PackagePlus, Send } from "lucide-react";
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

export const Route = createFileRoute("/client/create")({
  head: () => ({
    meta: [
      { title: "Create Delivery — Fleetline" },
      { name: "description", content: "Book a new delivery: pickup, drop, package details and schedule." },
      { property: "og:title", content: "Create Delivery — Fleetline" },
      { property: "og:description", content: "Book a delivery in under a minute." },
    ],
  }),
  component: CreateDelivery,
});

const addressFields = ["Address line 1", "Address line 2", "City", "State", "Zip code", "Country"];

function AddressBlock({ title }: { title: string }) {
  return (
    <GlassPanel title={title} hoverable={false}>
      <div className="grid gap-3 sm:grid-cols-2">
        {addressFields.map((f, i) => (
          <motion.div
            key={f}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="space-y-1.5"
          >
            <Label className="text-xs text-muted-foreground">{f}</Label>
            <Input placeholder={f} className="bg-surface/40" />
          </motion.div>
        ))}
      </div>
    </GlassPanel>
  );
}

type DateMode = "on" | "before" | "flexible";

const dateModes: { value: DateMode; label: string; hint: string }[] = [
  { value: "on", label: "Deliver on", hint: "Select an exact date" },
  { value: "before", label: "Deliver before", hint: "Select a deadline date" },
  { value: "flexible", label: "Flexible", hint: "Date is optional" },
];

function CreateDelivery() {
  const [mode, setMode] = useState<DateMode>("on");
  const [date, setDate] = useState<Date | undefined>();

  const activeMode = dateModes.find((m) => m.value === mode)!;

  const submit = () => {
    if (mode !== "flexible" && !date) {
      toast.error("Please pick a date", { description: activeMode.hint });
      return;
    }
    toast.success("Delivery request submitted", {
      description: "We'll assign a driver shortly.",
    });
  };

  return (
    <Page
      title="Create New Delivery"
      description="Tell us what's moving and where — we'll match the right driver automatically."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <AddressBlock title="Pickup at" />
        <AddressBlock title="Drop at" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <GlassPanel className="lg:col-span-2" title="Package details" hoverable={false}>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Weight</Label>
              <Input placeholder="e.g. 3.4 kg" className="bg-surface/40" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Size</Label>
              <Input placeholder="e.g. 40 × 30 × 20 cm" className="bg-surface/40" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Type of package</Label>
              <Select>
                <SelectTrigger className="bg-surface/40">
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
              <Label className="text-xs text-muted-foreground">Handle with care</Label>
              <Select>
                <SelectTrigger className="bg-surface/40">
                  <SelectValue placeholder="Yes / No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Priority</Label>
              <Select>
                <SelectTrigger className="bg-surface/40">
                  <SelectValue placeholder="Normal" />
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
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              {mode === "flexible" ? "Preferred date (optional)" : activeMode.label}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md border border-input bg-surface/40 px-3 py-2 text-left text-sm transition-colors hover:border-primary/40",
                    !date && "text-muted-foreground",
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
                  onSelect={setDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(v) => v && setMode(v as DateMode)}
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

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Any special instructions</Label>
            <Textarea
              rows={4}
              placeholder="Fragile items, gate codes, contact preferences…"
              className="w-full bg-surface/40"
            />
          </div>

          <div className="flex justify-end">
            <MagneticButton variant="primary" icon={<Send className="size-4" />} onClick={submit}>
              Submit request
            </MagneticButton>
          </div>
        </div>
      </GlassPanel>
    </Page>
  );
}
