import { motion } from "motion/react";
import { GlassPanel } from "@/components/fx/glass-panel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface AddressBlockValues {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface AddressBlockErrors {
  address1?: boolean;
  city?: boolean;
  state?: boolean;
  zip?: boolean;
  country?: boolean;
}

const addressFields: { key: keyof AddressBlockValues; label: string; placeholder: string; required: boolean }[] = [
  { key: "address1", label: "Address line 1", placeholder: "Address line 1", required: true },
  { key: "address2", label: "Address line 2", placeholder: "Address line 2", required: false },
  { key: "city", label: "City", placeholder: "City", required: true },
  { key: "state", label: "State", placeholder: "State", required: true },
  { key: "zip", label: "Zip code", placeholder: "Zip code", required: true },
  { key: "country", label: "Country", placeholder: "Country", required: true },
];

interface AddressBlockProps {
  title: string;
  values: AddressBlockValues;
  onChange: (field: keyof AddressBlockValues, value: string) => void;
  errors?: AddressBlockErrors;
}

export function AddressBlock({ title, values, onChange, errors = {} }: AddressBlockProps) {
  return (
    <GlassPanel title={title} hoverable={false}>
      <div className="grid gap-3 sm:grid-cols-2">
        {addressFields.map((f, i) => {
          const hasError = errors[f.key as keyof AddressBlockErrors];
          return (
            <motion.div
              key={f.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="space-y-1.5"
            >
              <Label className="text-xs text-muted-foreground flex items-center justify-between">
                <span>
                  {f.label}
                  {f.required && <span className="text-destructive ml-0.5">*</span>}
                </span>
                {hasError && <span className="text-[10px] font-medium text-destructive">Required</span>}
              </Label>
              <Input
                placeholder={f.placeholder}
                value={values[f.key]}
                onChange={(e) => onChange(f.key, e.target.value)}
                className={cn(
                  "bg-surface/40 transition-colors duration-200",
                  hasError && "border-destructive focus-visible:ring-destructive"
                )}
              />
            </motion.div>
          );
        })}
      </div>
    </GlassPanel>
  );
}
