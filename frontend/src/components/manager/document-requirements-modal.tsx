import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileCheck, Plus, X, Trash2, CheckCircle2, ShieldCheck, Info } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getGlobalDocumentRequirements,
  addGlobalDocumentRequirement,
  toggleGlobalRequirementActive,
  toggleGlobalRequirementRequired,
  deleteGlobalDocumentRequirement,
  subscribeDocuments,
  type GlobalDocumentRequirement,
} from "@/data/documents";
import { cn } from "@/lib/utils";

interface DocumentRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentRequirementsModal({ isOpen, onClose }: DocumentRequirementsModalProps) {
  const [requirements, setRequirements] = useState<GlobalDocumentRequirement[]>(() =>
    getGlobalDocumentRequirements()
  );

  // Add new document inline form state
  const [isAdding, setIsAdding] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocRequired, setNewDocRequired] = useState(true);
  const [newDocDescription, setNewDocDescription] = useState("");

  useEffect(() => {
    const update = () => {
      setRequirements([...getGlobalDocumentRequirements()]);
    };
    update();
    const unsub = subscribeDocuments(update);
    return () => unsub();
  }, [isOpen]);

  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) {
      toast.error("Please enter a document name.");
      return;
    }

    const added = addGlobalDocumentRequirement(newDocName.trim(), newDocRequired, newDocDescription.trim());
    toast.success(`"${added.name}" added to Global Document Requirements!`, {
      description: "All drivers will now see this requirement in their compliance dashboard.",
    });

    setNewDocName("");
    setNewDocDescription("");
    setNewDocRequired(true);
    setIsAdding(false);
  };

  const handleToggleActive = (id: string, name: string, currentActive: boolean) => {
    toggleGlobalRequirementActive(id);
    toast.info(`"${name}" is now ${!currentActive ? "Active" : "Inactive"}`);
  };

  const handleToggleRequired = (id: string, name: string, currentRequired: boolean) => {
    toggleGlobalRequirementRequired(id);
    toast.info(`"${name}" marked as ${!currentRequired ? "Required" : "Optional"}`);
  };

  const handleDeleteRequirement = (id: string, name: string) => {
    deleteGlobalDocumentRequirement(id);
    toast.error(`"${name}" requirement removed globally.`);
  };

  const handleSaveChanges = () => {
    toast.success("Document requirements saved & synchronized globally across FleetHub.");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-border/80 glass-strong p-5 sm:p-6 shadow-2xl z-10 space-y-4 overflow-hidden"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          />
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary border border-primary/30 shadow-[var(--shadow-glow)]">
                <FileCheck className="size-5" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">Document Requirements</h3>
                <p className="text-xs text-muted-foreground">Manage documents required from all drivers globally</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl border border-border p-1.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Banner Info */}
          <div className="flex items-start gap-2.5 rounded-2xl border border-primary/30 bg-primary/8 p-3 text-xs text-primary/90 shrink-0">
            <Info className="size-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Configured document requirements apply globally. Adding a document requirement will automatically make it appear in every driver's <strong>Document Status</strong> as <em>Pending Upload</em>.
            </p>
          </div>

          {/* Body List */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-0">
            {requirements.map((req) => (
              <div
                key={req.id}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all",
                  req.active
                    ? "border-border/80 bg-surface-2/40"
                    : "border-border/40 bg-surface-2/10 opacity-60"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface/60 border border-border text-primary">
                    <ShieldCheck className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-foreground text-sm truncate">{req.name}</h4>
                      <button
                        onClick={() => handleToggleRequired(req.id, req.name, req.required)}
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer",
                          req.required
                            ? "bg-warning/15 text-warning border border-warning/30"
                            : "bg-surface-2 text-muted-foreground border border-border"
                        )}
                        title="Click to toggle Required / Optional"
                      >
                        {req.required ? "Required" : "Optional"}
                      </button>
                    </div>
                    {req.description && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{req.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 shrink-0">
                  {/* Active Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      {req.active ? "Active" : "Inactive"}
                    </span>
                    <button
                      onClick={() => handleToggleActive(req.id, req.name, req.active)}
                      className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                        req.active ? "bg-primary" : "bg-surface-2 border-border"
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block size-5 transform rounded-full bg-foreground shadow-lg ring-0 transition duration-200 ease-in-out",
                          req.active ? "translate-x-5 bg-primary-foreground" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>

                  {/* Delete Option */}
                  <button
                    onClick={() => handleDeleteRequirement(req.id, req.name)}
                    className="p-1.5 rounded-xl border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors cursor-pointer"
                    title="Remove requirement"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Requirement Inline Form */}
            {isAdding ? (
              <form onSubmit={handleAddRequirement} className="rounded-2xl border border-primary/50 bg-primary/5 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Plus className="size-4" /> Add New Document Requirement
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs text-muted-foreground">Document Name <span className="text-destructive">*</span></Label>
                    <Input
                      placeholder="e.g. Fitness Certificate, PUC, Tax Permit"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      className="bg-surface/60 text-xs"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs text-muted-foreground">Description (Optional)</Label>
                    <Input
                      placeholder="e.g. Certificate issued by RTO or authorized testing center"
                      value={newDocDescription}
                      onChange={(e) => setNewDocDescription(e.target.value)}
                      className="bg-surface/60 text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2 pt-1">
                    <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newDocRequired}
                        onChange={(e) => setNewDocRequired(e.target.checked)}
                        className="rounded border-border bg-surface/60 text-primary focus:ring-primary"
                      />
                      <span>Mark as mandatory/required document for drivers</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary/90 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="size-3.5" /> Save Requirement
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/80 hover:border-primary/60 bg-surface-2/20 p-3.5 text-xs font-bold text-primary hover:bg-primary/5 transition-all cursor-pointer"
              >
                <Plus className="size-4" /> Add Document Requirement
              </button>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-3 shrink-0">
            <button
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary/90 transition-all cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
