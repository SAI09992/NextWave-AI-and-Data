import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskUtr(utr: string): string {
  if (!utr || utr.length <= 4) return utr || "••••";
  const start = utr.slice(0, 2);
  const end = utr.slice(-4);
  return `${start}${"•".repeat(Math.max(4, utr.length - 6))}${end}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return "—";
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function generateRegistrationId(prefix: string = "NGSOC-2026"): string {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomSuffix}`;
}

export function generateCertificateId(prefix: string = "NGSOC-2026-CERT"): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomSuffix}`;
}

export function formatCreditType(creditType: string): string {
  switch (creditType) {
    case 'PE_CSE': return 'PE — CSE';
    case 'PE_IT': return 'PE — IT';
    case 'UE': return 'UE — OTHER';
    case 'NON_CGPA': return 'NON CGPA';
    default: return creditType;
  }
}

/** Department-aware credit description for 2nd year NON_CGPA students */
export function formatCreditTypeDetailed(creditType: string, department?: string): string {
  if (creditType !== 'NON_CGPA') return formatCreditType(creditType);
  const dept = (department || '').toUpperCase().trim();
  const isCseOrIt = dept === 'CSE' || dept === 'IT' || dept === 'COMPUTER SCIENCE AND ENGINEERING' || dept === 'INFORMATION TECHNOLOGY';
  if (isCseOrIt) {
    return 'NON CGPA — 1 Group 3 Certificate + Program Elective';
  }
  return 'NON CGPA — 1 Group 3 Certificate + University Elective';
}
