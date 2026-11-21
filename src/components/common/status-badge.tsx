import type { ApplicationStatus } from "@/lib/types";

const styles: Record<ApplicationStatus, string> = {
  Assessment: "bg-muted text-muted-foreground",
  Applied: "bg-primary-soft text-primary",
  Interview: "bg-warning-soft text-warning",
  Offer: "bg-success-soft text-success",
  Rejected: "bg-destructive-soft text-destructive",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>{status}</span>;
}
