import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  AlertTriangle,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Upload,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Page } from "@/components/fx/page";
import { GlassPanel } from "@/components/fx/glass-panel";
import { StatCard } from "@/components/fx/stat-card";
import { StatusPill, type Tone } from "@/components/fx/status-pill";
import { FilterChips } from "@/components/fx/controls";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getDriverDocuments,
  uploadDocument,
  subscribeDocuments,
  type DriverDocument,
  type DocumentVerificationStatus,
} from "@/data/documents";
import { cn } from "@/lib/utils";

const DRIVER_ID = "DRV-1041"; // Default logged-in driver Rahul Sharma

const filterTabs = [
  { value: "all", label: "All Documents" },
  { value: "action-required", label: "Action Required" },
  { value: "pending-verification", label: "Pending Verification" },
  { value: "verified", label: "Verified" },
] as const;

export function DriverDocumentStatusPage() {
  const [activeTab, setActiveTab] = useState<typeof filterTabs[number]["value"]>("all");
  const [documents, setDocuments] = useState<DriverDocument[]>(() => getDriverDocuments(DRIVER_ID));

  // Modals state
  const [selectedDocForUpload, setSelectedDocForUpload] = useState<DriverDocument | null>(null);
  const [selectedDocForView, setSelectedDocForView] = useState<DriverDocument | null>(null);

  // Upload Form state
  const [docNumber, setDocNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const update = () => {
      setDocuments(getDriverDocuments(DRIVER_ID));
    };
    const unsubscribe = subscribeDocuments(update);
    return () => unsubscribe();
  }, []);

  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    if (activeTab === "action-required") {
      return doc.status === "Expired" || doc.status === "Rejected" || doc.status === "Pending Upload";
    }
    if (activeTab === "pending-verification") {
      return doc.status === "Pending Verification";
    }
    if (activeTab === "verified") {
      return doc.status === "Verified";
    }
    return true;
  });

  // Summary counts
  const totalCount = documents.length;
  const verifiedCount = documents.filter((d) => d.status === "Verified").length;
  const pendingCount = documents.filter((d) => d.status === "Pending Verification").length;
  const actionRequiredCount = documents.filter(
    (d) => d.status === "Expired" || d.status === "Rejected" || d.status === "Pending Upload"
  ).length;

  const handleOpenUpload = (doc: DriverDocument) => {
    setSelectedDocForUpload(doc);
    setDocNumber(doc.docNumber);
    setIssueDate(doc.issueDate);
    setExpiryDate(doc.expiryDate);
    setFileName(`${doc.docType.toLowerCase().replace(/\s+/g, "_")}_renewed.pdf`);
    setSelectedFileUrl(undefined);
    setFormErrors({});
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedFileUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = () => {
    if (!selectedDocForUpload) return;
    const errors: Record<string, boolean> = {};
    if (!docNumber.trim()) errors["docNumber"] = true;
    if (!expiryDate.trim()) errors["expiryDate"] = true;

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fill in required document details.");
      return;
    }

    setUploading(true);
    setTimeout(() => {
      uploadDocument(selectedDocForUpload.id, {
        docNumber: docNumber.trim(),
        issueDate: issueDate.trim() || "Sep 13, 2026",
        expiryDate: expiryDate.trim(),
        fileName: fileName || `${selectedDocForUpload.docType.toLowerCase().replace(/\s+/g, "_")}_renewed.pdf`,
        fileUrl: selectedFileUrl,
        docType: selectedDocForUpload.docType,
        driverId: selectedDocForUpload.driverId,
        driverName: selectedDocForUpload.driverName,
      });

      setUploading(false);
      setSelectedDocForUpload(null);

      toast.success(`${selectedDocForUpload.docType} uploaded successfully`, {
        description: "Status is now Pending Verification. Fleet Manager has been notified.",
      });
    }, 600);
  };

  const getStatusTone = (status: DocumentVerificationStatus): Tone => {
    switch (status) {
      case "Verified":
        return "success";
      case "Pending Verification":
        return "primary";
      case "Expired":
      case "Rejected":
        return "destructive";
      case "Pending Upload":
        return "warning";
      default:
        return "muted";
    }
  };

  return (
    <Page
      title="Document Status & Compliance"
      description="View certificate status, receive expiration warnings, and submit renewed documents for Fleet Manager verification."
    >
      {/* 1. METRIC STAT CARDS */}
      <div className="grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Documents"
          value={String(totalCount)}
          sub="Required compliance"
          icon={<FileText className="size-4 text-primary" />}
        />
        <StatCard
          label="Verified"
          value={String(verifiedCount)}
          sub="Active & compliant"
          icon={<ShieldCheck className="size-4 text-success" />}
        />
        <StatCard
          label="Pending Verification"
          value={String(pendingCount)}
          sub="Awaiting manager review"
          icon={<Clock className="size-4 text-primary animate-pulse" />}
        />
        <StatCard
          label="Action Required"
          value={String(actionRequiredCount)}
          sub="Expired or rejected"
          icon={<ShieldAlert className="size-4 text-destructive" />}
        />
      </div>

      {/* 2. FILTER TAB STRIP */}
      <div className="mt-6 flex flex-nowrap items-center justify-between gap-3 w-full">
        <FilterChips
          options={filterTabs.map((t) => {
            let count = totalCount;
            if (t.value === "action-required") count = actionRequiredCount;
            if (t.value === "pending-verification") count = pendingCount;
            if (t.value === "verified") count = verifiedCount;
            return {
              value: t.value,
              label: t.label + (count > 0 ? ` (${count})` : ""),
            };
          })}
          value={activeTab}
          onChange={(val) => setActiveTab(val as any)}
          layoutId="driver-document-filter"
          className="min-w-0 flex-1"
        />
      </div>

      {/* 3. DOCUMENT CARDS GRID */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredDocs.map((doc, i) => {
            const isActionRequired =
              doc.status === "Expired" || doc.status === "Rejected" || doc.status === "Pending Upload";

            return (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassPanel
                  className={cn(
                    "h-full flex flex-col justify-between p-5 relative overflow-hidden transition-all duration-200",
                    isActionRequired && "border-destructive/40 bg-destructive/5 hover:border-destructive/60",
                    doc.status === "Pending Verification" && "border-primary/40 bg-primary/5 hover:border-primary/60"
                  )}
                >
                  <div>
                    {/* Top Row: Type & Status */}
                    <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/14 text-primary border border-primary/30">
                          {doc.docType.includes("Licence") ? (
                            <BadgeCheck className="size-5" />
                          ) : doc.docType.includes("Insurance") ? (
                            <ShieldCheck className="size-5 text-success" />
                          ) : doc.docType.includes("RC") ? (
                            <FileCheck className="size-5 text-primary" />
                          ) : (
                            <FileText className="size-5" />
                          )}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-foreground text-sm leading-tight">{doc.docType}</h4>
                            {doc.required !== undefined && (
                              <span
                                className={cn(
                                  "px-1.5 py-0.2 text-[9px] font-bold uppercase rounded-md tracking-wider border",
                                  doc.required
                                    ? "bg-warning/15 text-warning border-warning/30"
                                    : "bg-surface-2 text-muted-foreground border-border"
                                )}
                              >
                                {doc.required ? "Required" : "Optional"}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-muted-foreground block mt-0.5">
                            {doc.docNumber}
                          </span>
                        </div>
                      </div>
                      <StatusPill tone={getStatusTone(doc.status)} pulse={doc.status === "Pending Verification"}>
                        {doc.status}
                      </StatusPill>
                    </div>

                    {/* Expiry & Upload Info */}
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Issued: <strong className="text-foreground">{doc.issueDate}</strong></span>
                        <span>Expires: <strong className="text-foreground">{doc.expiryDate}</strong></span>
                      </div>

                      {doc.uploadedFileName && (
                        <div className="flex items-center gap-2 rounded-xl bg-surface-2/40 border border-border/50 p-2 text-[11px] text-muted-foreground">
                          <FileText className="size-3.5 text-primary shrink-0" />
                          <span className="truncate flex-1 font-mono">{doc.uploadedFileName}</span>
                          {doc.uploadedAt && <span className="text-[10px] shrink-0">{doc.uploadedAt}</span>}
                        </div>
                      )}

                      {/* Rejection Alert Box */}
                      {doc.status === "Rejected" && doc.rejectionReason && (
                        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-destructive">
                            <AlertCircle className="size-4 shrink-0" />
                            <span>Rejection Reason:</span>
                          </div>
                          <p className="text-destructive/90 leading-relaxed pl-5 font-medium">
                            "{doc.rejectionReason}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-end gap-2">
                    {doc.uploadedFileName && (
                      <button
                        onClick={() => setSelectedDocForView(doc)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-2/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
                      >
                        <Eye className="size-3.5" /> View
                      </button>
                    )}

                    {isActionRequired ? (
                      <button
                        onClick={() => handleOpenUpload(doc)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary/90 transition-all cursor-pointer"
                      >
                        <Upload className="size-3.5" /> Upload Renewed
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenUpload(doc)}
                        className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface/50 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        Replace File
                      </button>
                    )}
                  </div>
                </GlassPanel>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 4. UPLOAD DOCUMENT MODAL */}
      <AnimatePresence>
        {selectedDocForUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDocForUpload(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative w-full max-w-lg rounded-3xl border border-border bg-popover p-5 sm:p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                    <UploadCloud className="size-5 text-primary" /> Upload Renewed {selectedDocForUpload.docType}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Upload your renewed certificate for Fleet Manager review & verification.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDocForUpload(null)}
                  className="rounded-xl border border-border p-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {/* Document Number */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex justify-between">
                    <span>Certificate / Document Number <span className="text-destructive">*</span></span>
                    {formErrors["docNumber"] && <span className="text-destructive text-[10px]">Required</span>}
                  </Label>
                  <Input
                    placeholder="e.g. DL-MH12-202699"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className={cn("bg-surface/50 text-xs", formErrors["docNumber"] && "border-destructive")}
                  />
                </div>

                {/* Dates Row */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Issue Date</Label>
                    <Input
                      placeholder="e.g. Sep 10, 2026"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="bg-surface/50 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground flex justify-between">
                      <span>Expiry Date <span className="text-destructive">*</span></span>
                      {formErrors["expiryDate"] && <span className="text-destructive text-[10px]">Required</span>}
                    </Label>
                    <Input
                      placeholder="e.g. Sep 10, 2028"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className={cn("bg-surface/50 text-xs", formErrors["expiryDate"] && "border-destructive")}
                    />
                  </div>
                </div>

                {/* File Dropzone */}
                <div className="space-y-1 pt-1">
                  <Label className="text-xs text-muted-foreground">Upload Document File (PDF / JPG / PNG)</Label>
                  <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-surface-2/30 p-5 cursor-pointer transition-all text-center">
                    <Upload className="size-6 text-primary animate-bounce" />
                    <div>
                      <span className="font-semibold text-foreground text-xs block">
                        {fileName ? fileName : "Click to browse or drop file here"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">PDF, JPG, PNG up to 10MB</span>
                    </div>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleSimulatedFileUpload} />
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedDocForUpload(null)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadSubmit}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary/90 transition-all cursor-pointer"
                >
                  {uploading ? "Submitting..." : "Submit for Verification"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. VIEW DOCUMENT PREVIEW MODAL */}
      <AnimatePresence>
        {selectedDocForView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDocForView(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative w-full max-w-xl rounded-3xl border border-border bg-popover p-5 sm:p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary border border-primary/30">
                    <FileText className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-foreground">{selectedDocForView.docType}</h3>
                    <p className="text-xs text-mono text-muted-foreground">{selectedDocForView.docNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDocForView(null)}
                  className="rounded-xl border border-border p-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Scanned Certificate Card Preview */}
              <div className="rounded-2xl border border-border bg-surface-2/60 p-5 space-y-4 shadow-inner">
                <div className="flex items-center justify-between text-xs border-b border-border/50 pb-2">
                  <span className="font-mono text-muted-foreground">{selectedDocForView.uploadedFileName}</span>
                  <StatusPill tone={getStatusTone(selectedDocForView.status)}>
                    {selectedDocForView.status}
                  </StatusPill>
                </div>

                {/* Simulated Scanned Certificate Box */}
                <div className="rounded-xl border border-border/80 bg-background/90 p-5 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2 text-primary font-bold">
                    <span>GOVERNMENT COMPLIANCE CERTIFICATE</span>
                    <BadgeCheck className="size-4" />
                  </div>
                  <div className="space-y-1.5 text-[11px] text-muted-foreground">
                    <p>Holder: <strong className="text-foreground">{selectedDocForView.driverName}</strong> ({selectedDocForView.driverId})</p>
                    <p>Doc Type: <strong className="text-foreground">{selectedDocForView.docType}</strong></p>
                    <p>Doc #: <strong className="text-foreground">{selectedDocForView.docNumber}</strong></p>
                    <p>Issue Date: <strong className="text-foreground">{selectedDocForView.issueDate}</strong></p>
                    <p>Expiry Date: <strong className="text-foreground">{selectedDocForView.expiryDate}</strong></p>
                  </div>
                  <div className="pt-2 border-t border-border/40 text-[10px] text-success font-semibold flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Official Scanned Copy Uploaded & Recorded
                  </div>
                </div>

                {selectedDocForView.reviewedBy && (
                  <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-1">
                    <span>Reviewed by: <strong className="text-foreground">{selectedDocForView.reviewedBy}</strong></span>
                    <span>{selectedDocForView.reviewedAt}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => setSelectedDocForView(null)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Page>
  );
}
