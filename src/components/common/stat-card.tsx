import type { LucideIcon } from "lucide-react";

export function StatCard({ label, value, hint, icon: Icon, tone = "primary" }: {
  label: string; value: string; hint?: string; icon: LucideIcon; tone?: "primary" | "success" | "warning";
}) {
  const tones = { primary: "bg-primary-soft text-primary", success: "bg-success-soft text-success", warning: "bg-warning-soft text-warning" };
  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tones[tone]}`}><Icon className="h-4 w-4" /></span>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
