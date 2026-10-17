export type DocumentVerificationStatus =
  | "Verified"
  | "Expired"
  | "Pending Upload"
  | "Pending Verification"
  | "Rejected";

export type DocumentType = string;

export interface GlobalDocumentRequirement {
  id: string;
  name: string;
  required: boolean;
  active: boolean;
  description?: string;
}

export interface DriverDocument {
  id: string;
  driverId: string;
  driverName: string;
  docType: DocumentType;
  docNumber: string;
  issueDate: string;
  expiryDate: string;
  status: DocumentVerificationStatus;
  uploadedFileUrl?: string;
  uploadedFileName?: string;
  uploadedAt?: string;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  required?: boolean;
}

export const initialGlobalRequirements: GlobalDocumentRequirement[] = [
  { id: "REQ-DL", name: "Driving Licence", required: true, active: true, description: "Official commercial driving licence" },
  { id: "REQ-RC", name: "Vehicle RC", required: true, active: true, description: "Vehicle registration certificate" },
  { id: "REQ-INS", name: "Insurance Policy", required: true, active: true, description: "Comprehensive vehicle insurance policy" },
  { id: "REQ-MED", name: "Medical Certificate", required: true, active: true, description: "Medical fitness certificate from registered practitioner" },
  { id: "REQ-PCC", name: "Police Clearance Certificate", required: true, active: true, description: "Police background verification certificate" },
];

export const initialDocuments: DriverDocument[] = [
  // Rahul Sharma (DRV-1041)
  {
    id: "DOC-1041-DL",
    driverId: "DRV-1041",
    driverName: "Rahul Sharma",
    docType: "Driving Licence",
    docNumber: "DL-MH12-202100482",
    issueDate: "Nov 20, 2021",
    expiryDate: "Nov 20, 2026",
    status: "Verified",
    uploadedFileName: "rahul_sharma_driving_licence.pdf",
    uploadedAt: "Nov 21, 2021, 10:30 AM",
    reviewedBy: "Amit Rao",
    reviewedAt: "Nov 22, 2021, 09:15 AM",
    required: true,
  },
  {
    id: "DOC-1041-RC",
    driverId: "DRV-1041",
    driverName: "Rahul Sharma",
    docType: "Vehicle RC",
    docNumber: "RC-MH12KJ4410",
    issueDate: "Sep 10, 2021",
    expiryDate: "Sep 10, 2026",
    status: "Expired",
    uploadedFileName: "vehicle_rc_mh12kj4410.pdf",
    uploadedAt: "Sep 11, 2021, 02:00 PM",
    required: true,
  },
  {
    id: "DOC-1041-INS",
    driverId: "DRV-1041",
    driverName: "Rahul Sharma",
    docType: "Insurance Policy",
    docNumber: "INS-POL-99210",
    issueDate: "Mar 15, 2025",
    expiryDate: "Mar 15, 2027",
    status: "Verified",
    uploadedFileName: "tata_ace_insurance_policy.pdf",
    uploadedAt: "Mar 15, 2025, 11:45 AM",
    reviewedBy: "Amit Rao",
    reviewedAt: "Mar 16, 2025, 04:20 PM",
    required: true,
  },
  {
    id: "DOC-1041-MED",
    driverId: "DRV-1041",
    driverName: "Rahul Sharma",
    docType: "Medical Certificate",
    docNumber: "MED-CERT-2025",
    issueDate: "Aug 30, 2025",
    expiryDate: "Aug 30, 2026",
    status: "Pending Verification",
    uploadedFileName: "medical_fitness_certificate_rahul.jpg",
    uploadedAt: "Sep 13, 2026, 03:30 PM",
    required: true,
  },
  {
    id: "DOC-1041-PCC",
    driverId: "DRV-1041",
    driverName: "Rahul Sharma",
    docType: "Police Clearance Certificate",
    docNumber: "PCC-MH-2025-41",
    issueDate: "Jan 10, 2025",
    expiryDate: "Jan 10, 2027",
    status: "Verified",
    uploadedFileName: "pcc_rahul_sharma_2025.pdf",
    uploadedAt: "Jan 12, 2025, 01:10 PM",
    reviewedBy: "Amit Rao",
    reviewedAt: "Jan 13, 2025, 10:00 AM",
    required: true,
  },

  // Vikram Patil (DRV-1120)
  {
    id: "DOC-1120-DL",
    driverId: "DRV-1120",
    driverName: "Vikram Patil",
    docType: "Driving Licence",
    docNumber: "DL-MH01-201900112",
    issueDate: "Aug 01, 2019",
    expiryDate: "Aug 01, 2026",
    status: "Expired",
    uploadedFileName: "vikram_patil_dl_scanned.pdf",
    uploadedAt: "Aug 02, 2019, 09:00 AM",
    required: true,
  },
  {
    id: "DOC-1120-RC",
    driverId: "DRV-1120",
    driverName: "Vikram Patil",
    docType: "Vehicle RC",
    docNumber: "RC-MH01BC2290",
    issueDate: "Jan 10, 2022",
    expiryDate: "Jan 10, 2027",
    status: "Verified",
    uploadedFileName: "rc_mh01bc2290.pdf",
    uploadedAt: "Jan 11, 2022, 04:00 PM",
    reviewedBy: "Amit Rao",
    reviewedAt: "Jan 12, 2022, 11:30 AM",
    required: true,
  },
  {
    id: "DOC-1120-INS",
    driverId: "DRV-1120",
    driverName: "Vikram Patil",
    docType: "Insurance Policy",
    docNumber: "INS-POL-44120",
    issueDate: "Sep 12, 2025",
    expiryDate: "Sep 12, 2026",
    status: "Rejected",
    rejectionReason: "Illegible scan of insurance policy document. Expiry date and policy holder name cut off.",
    uploadedFileName: "insurance_policy_blurry.jpg",
    uploadedAt: "Sep 11, 2026, 05:15 PM",
    reviewedBy: "Amit Rao",
    reviewedAt: "Sep 12, 2026, 10:00 AM",
    required: true,
  },
  {
    id: "DOC-1120-MED",
    driverId: "DRV-1120",
    driverName: "Vikram Patil",
    docType: "Medical Certificate",
    docNumber: "MED-CERT-1120",
    issueDate: "Apr 10, 2025",
    expiryDate: "Apr 10, 2027",
    status: "Verified",
    uploadedFileName: "med_cert_vikram.pdf",
    uploadedAt: "Apr 10, 2025, 02:20 PM",
    reviewedBy: "Amit Rao",
    reviewedAt: "Apr 11, 2025, 09:40 AM",
    required: true,
  },
  {
    id: "DOC-1120-PCC",
    driverId: "DRV-1120",
    driverName: "Vikram Patil",
    docType: "Police Clearance Certificate",
    docNumber: "PCC-MH-2024-88",
    issueDate: "May 15, 2024",
    expiryDate: "May 15, 2026",
    status: "Expired",
    uploadedFileName: "pcc_vikram_old.pdf",
    uploadedAt: "May 16, 2024, 11:00 AM",
    required: true,
  },

  // Aman Verma (DRV-1188)
  {
    id: "DOC-1188-DL",
    driverId: "DRV-1188",
    driverName: "Aman Verma",
    docType: "Driving Licence",
    docNumber: "DL-MH15-202200994",
    issueDate: "Sep 01, 2022",
    expiryDate: "Sep 01, 2026",
    status: "Pending Verification",
    uploadedFileName: "dl_aman_verma_renewed.jpg",
    uploadedAt: "Sep 12, 2026, 08:45 PM",
    required: true,
  },
  {
    id: "DOC-1188-RC",
    driverId: "DRV-1188",
    driverName: "Aman Verma",
    docType: "Vehicle RC",
    docNumber: "RC-MH15AD7781",
    issueDate: "Jun 20, 2022",
    expiryDate: "Jun 20, 2027",
    status: "Verified",
    uploadedFileName: "rc_mh15ad7781.pdf",
    uploadedAt: "Jun 21, 2022, 10:00 AM",
    reviewedBy: "Amit Rao",
    reviewedAt: "Jun 22, 2022, 03:15 PM",
    required: true,
  },
  {
    id: "DOC-1188-INS",
    driverId: "DRV-1188",
    driverName: "Aman Verma",
    docType: "Insurance Policy",
    docNumber: "INS-POL-88231",
    issueDate: "Feb 14, 2025",
    expiryDate: "Feb 14, 2027",
    status: "Verified",
    uploadedFileName: "insurance_bolero_aman.pdf",
    uploadedAt: "Feb 14, 2025, 01:30 PM",
    reviewedBy: "Amit Rao",
    reviewedAt: "Feb 15, 2025, 09:00 AM",
    required: true,
  },
  {
    id: "DOC-1188-MED",
    driverId: "DRV-1188",
    driverName: "Aman Verma",
    docType: "Medical Certificate",
    docNumber: "MED-CERT-1188",
    issueDate: "Sep 05, 2025",
    expiryDate: "Sep 05, 2026",
    status: "Expired",
    uploadedFileName: "medical_cert_aman_2025.pdf",
    uploadedAt: "Sep 06, 2025, 11:20 AM",
    required: true,
  },
  {
    id: "DOC-1188-PCC",
    driverId: "DRV-1188",
    driverName: "Aman Verma",
    docType: "Police Clearance Certificate",
    docNumber: "PCC-MH-2025-99",
    issueDate: "Aug 10, 2025",
    expiryDate: "Aug 10, 2027",
    status: "Verified",
    uploadedFileName: "pcc_aman_verma.pdf",
    uploadedAt: "Aug 11, 2025, 03:00 PM",
    reviewedBy: "Amit Rao",
    reviewedAt: "Aug 12, 2025, 10:45 AM",
    required: true,
  },
];

export function createSamplePdfDataUrl(docType: string, docNumber: string, driverName: string, expiryDate: string): string {
  const content = `%PDF-1.4
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>> >> endobj
4 0 obj <</Length 280>> stream
BT
/F1 18 Tf
50 720 Td
(FLEETHUB COMPLIANCE CERTIFICATE) Tj
/F1 12 Tf
0 -35 Td
(Driver Name: ${driverName}) Tj
0 -20 Td
(Document Type: ${docType}) Tj
0 -20 Td
(Document Number: ${docNumber}) Tj
0 -20 Td
(Expiry Date: ${expiryDate}) Tj
0 -20 Td
(Verification Status: Official Record) Tj
0 -30 Td
(Verified by FleetHub Fleet Management System) Tj
ET
endstream
endobj
5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000240 00000 n 
0000000570 00000 n 
trailer <</Size 6 /Root 1 0 R>>
startxref
640
%%EOF`;

  const base64 = typeof window !== "undefined" && window.btoa ? btoa(unescape(encodeURIComponent(content))) : "";
  return `data:application/pdf;base64,${base64}`;
}

let globalRequirements: GlobalDocumentRequirement[] = [...initialGlobalRequirements];

let documentsList: DriverDocument[] = initialDocuments.map((doc) => ({
  ...doc,
  uploadedFileUrl: doc.uploadedFileUrl || (doc.status !== "Pending Upload" ? createSamplePdfDataUrl(doc.docType, doc.docNumber, doc.driverName, doc.expiryDate) : undefined),
}));

const listeners = new Set<() => void>();

function notifySubscribers() {
  listeners.forEach((fn) => fn());
}

export function getGlobalDocumentRequirements(): GlobalDocumentRequirement[] {
  return globalRequirements;
}

export function addGlobalDocumentRequirement(name: string, required: boolean = true, description?: string): GlobalDocumentRequirement {
  const cleanName = name.trim();
  const existing = globalRequirements.find((r) => r.name.toLowerCase() === cleanName.toLowerCase());
  if (existing) {
    existing.active = true;
    existing.required = required;
    if (description) existing.description = description;
    notifySubscribers();
    return existing;
  }
  const newReq: GlobalDocumentRequirement = {
    id: `REQ-${Date.now()}`,
    name: cleanName,
    required,
    active: true,
    description: description?.trim(),
  };
  globalRequirements.push(newReq);
  notifySubscribers();
  return newReq;
}

export function toggleGlobalRequirementActive(id: string): void {
  globalRequirements = globalRequirements.map((r) =>
    r.id === id ? { ...r, active: !r.active } : r
  );
  notifySubscribers();
}

export function toggleGlobalRequirementRequired(id: string): void {
  globalRequirements = globalRequirements.map((r) =>
    r.id === id ? { ...r, required: !r.required } : r
  );
  notifySubscribers();
}

export function deleteGlobalDocumentRequirement(id: string): void {
  globalRequirements = globalRequirements.filter((r) => r.id !== id);
  notifySubscribers();
}

export function getDriverDocuments(driverId?: string): DriverDocument[] {
  if (!driverId) return documentsList;

  const activeReqs = globalRequirements.filter((r) => r.active);
  const driverDocsInStore = documentsList.filter((d) => d.driverId === driverId);
  const driverName = driverDocsInStore[0]?.driverName || "Driver";

  const resolvedDocs: DriverDocument[] = [];

  for (const req of activeReqs) {
    const existing = driverDocsInStore.find(
      (d) => d.docType.toLowerCase().trim() === req.name.toLowerCase().trim()
    );
    if (existing) {
      resolvedDocs.push({
        ...existing,
        required: req.required,
      });
    } else {
      resolvedDocs.push({
        id: `DOC-${driverId}-${req.id}`,
        driverId,
        driverName,
        docType: req.name,
        docNumber: "Pending Upload",
        issueDate: "N/A",
        expiryDate: "N/A",
        status: "Pending Upload",
        required: req.required,
      });
    }
  }

  // Preserve historical uploaded/verified docs even if requirement is currently inactive
  for (const doc of driverDocsInStore) {
    const isAlreadyIncluded = resolvedDocs.some((r) => r.id === doc.id);
    if (!isAlreadyIncluded && doc.status !== "Pending Upload") {
      resolvedDocs.push(doc);
    }
  }

  return resolvedDocs;
}

export function getAllDocuments(): DriverDocument[] {
  return documentsList;
}

export function uploadDocument(
  docId: string,
  payload: {
    docNumber: string;
    issueDate: string;
    expiryDate: string;
    fileName: string;
    fileUrl?: string;
    docType?: string;
    driverId?: string;
    driverName?: string;
  }
): DriverDocument | null {
  let updatedDoc: DriverDocument | null = null;
  const nowStr = new Date().toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const existingIndex = documentsList.findIndex((doc) => doc.id === docId);

  if (existingIndex !== -1) {
    const doc = documentsList[existingIndex];
    updatedDoc = {
      ...doc,
      docNumber: payload.docNumber || doc.docNumber,
      issueDate: payload.issueDate || doc.issueDate,
      expiryDate: payload.expiryDate || doc.expiryDate,
      uploadedFileName: payload.fileName || doc.uploadedFileName || "renewed_certificate.pdf",
      uploadedFileUrl: payload.fileUrl || doc.uploadedFileUrl || createSamplePdfDataUrl(doc.docType, payload.docNumber || doc.docNumber, doc.driverName, payload.expiryDate || doc.expiryDate),
      uploadedAt: nowStr,
      status: "Pending Verification",
      rejectionReason: undefined,
    };
    documentsList[existingIndex] = updatedDoc;
  } else {
    const targetDocType = payload.docType || "Document";
    const targetDriverId = payload.driverId || "DRV-1041";
    const targetDriverName = payload.driverName || "Rahul Sharma";

    updatedDoc = {
      id: docId,
      driverId: targetDriverId,
      driverName: targetDriverName,
      docType: targetDocType,
      docNumber: payload.docNumber || "DOC-NEW",
      issueDate: payload.issueDate || "Sep 13, 2026",
      expiryDate: payload.expiryDate || "Sep 13, 2027",
      status: "Pending Verification",
      uploadedFileName: payload.fileName || "uploaded_document.pdf",
      uploadedFileUrl: payload.fileUrl || createSamplePdfDataUrl(targetDocType, payload.docNumber || "DOC-NEW", targetDriverName, payload.expiryDate || "Sep 13, 2027"),
      uploadedAt: nowStr,
    };
    documentsList.push(updatedDoc);
  }

  notifySubscribers();
  return updatedDoc;
}

export function approveDocument(docId: string, reviewerName: string = "Amit Rao"): DriverDocument | null {
  let updatedDoc: DriverDocument | null = null;
  const nowStr = new Date().toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  documentsList = documentsList.map((doc) => {
    if (doc.id === docId) {
      updatedDoc = {
        ...doc,
        status: "Verified",
        reviewedBy: reviewerName,
        reviewedAt: nowStr,
        rejectionReason: undefined,
      };
      return updatedDoc;
    }
    return doc;
  });

  notifySubscribers();
  return updatedDoc;
}

export function rejectDocument(
  docId: string,
  rejectionReason: string,
  reviewerName: string = "Amit Rao"
): DriverDocument | null {
  let updatedDoc: DriverDocument | null = null;
  const nowStr = new Date().toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  documentsList = documentsList.map((doc) => {
    if (doc.id === docId) {
      updatedDoc = {
        ...doc,
        status: "Rejected",
        rejectionReason,
        reviewedBy: reviewerName,
        reviewedAt: nowStr,
      };
      return updatedDoc;
    }
    return doc;
  });

  notifySubscribers();
  return updatedDoc;
}

export function initDriverDocuments(driverId: string, driverName: string): DriverDocument[] {
  const cleanName = driverName.toLowerCase().replace(/\s+/g, "_");
  const newDocs: DriverDocument[] = [
    {
      id: `DOC-${driverId}-DL`,
      driverId,
      driverName,
      docType: "Driving Licence",
      docNumber: `DL-${driverId}-2026`,
      issueDate: "Jan 15, 2024",
      expiryDate: "Jan 15, 2029",
      status: "Verified",
      uploadedFileName: `${cleanName}_driving_licence.pdf`,
      uploadedAt: "Jan 16, 2024, 10:00 AM",
      reviewedBy: "Amit Rao",
      reviewedAt: "Jan 17, 2024, 02:00 PM",
      required: true,
    },
    {
      id: `DOC-${driverId}-RC`,
      driverId,
      driverName,
      docType: "Vehicle RC",
      docNumber: `RC-${driverId}-2026`,
      issueDate: "Feb 10, 2024",
      expiryDate: "Feb 10, 2029",
      status: "Verified",
      uploadedFileName: `vehicle_rc_${driverId.toLowerCase()}.pdf`,
      uploadedAt: "Feb 11, 2024, 11:30 AM",
      reviewedBy: "Amit Rao",
      reviewedAt: "Feb 12, 2024, 09:15 AM",
      required: true,
    },
    {
      id: `DOC-${driverId}-INS`,
      driverId,
      driverName,
      docType: "Insurance Policy",
      docNumber: `INS-${driverId}-2026`,
      issueDate: "Mar 01, 2026",
      expiryDate: "Mar 01, 2027",
      status: "Pending Verification",
      uploadedFileName: `insurance_policy_${cleanName}.pdf`,
      uploadedAt: "Mar 02, 2026, 04:20 PM",
      required: true,
    },
    {
      id: `DOC-${driverId}-MED`,
      driverId,
      driverName,
      docType: "Medical Certificate",
      docNumber: `MED-${driverId}-2026`,
      issueDate: "Apr 05, 2026",
      expiryDate: "Apr 05, 2027",
      status: "Verified",
      uploadedFileName: `medical_certificate_${cleanName}.pdf`,
      uploadedAt: "Apr 06, 2026, 01:10 PM",
      reviewedBy: "Amit Rao",
      reviewedAt: "Apr 07, 2026, 10:00 AM",
      required: true,
    },
    {
      id: `DOC-${driverId}-PCC`,
      driverId,
      driverName,
      docType: "Police Clearance Certificate",
      docNumber: `PCC-${driverId}-2026`,
      issueDate: "May 20, 2025",
      expiryDate: "May 20, 2027",
      status: "Pending Upload",
      required: true,
    },
  ];

  documentsList.push(...newDocs);
  notifySubscribers();
  return newDocs;
}

export function subscribeDocuments(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

