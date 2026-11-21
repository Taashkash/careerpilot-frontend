import { CheckCircle2, Target, TrendingUp } from "lucide-react";

const bars = [42, 49, 55, 61, 64, 68, 74];
const gaps = [{ s: "SQL", v: 53 }, { s: "Python", v: 36 }, { s: "Statistics", v: 47 }];

export function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-3xl bg-gradient-brand opacity-10 blur-2xl" />
      <div className="card-surface relative overflow-hidden shadow-[var(--shadow-elevated)]">
        <div className="flex items-center gap-1.5 border-b px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-border" /><span className="h-2.5 w-2.5 rounded-full bg-border" /><span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="ml-3 text-xs text-muted-foreground">careerpilot.ai/dashboard</span>
        </div>
        <div className="grid gap-4 p-5">
          <div className="grid grid-cols-3 gap-3">
            {[{ i: Target, l: "Readiness", v: "70%" }, { i: TrendingUp, l: "This week", v: "+4" }, { i: CheckCircle2, l: "Tasks", v: "12/30" }].map(({ i: I, l, v }) => (
              <div key={l} className="rounded-lg border p-3">
                <I className="h-4 w-4 text-primary" /><p className="mt-2 text-[11px] text-muted-foreground">{l}</p><p className="text-lg font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border p-4">
            <p className="mb-3 text-xs font-medium">Readiness over time</p>
            <div className="flex h-24 items-end gap-2">
              {bars.map((b, i) => <div key={i} className="flex-1 rounded-t bg-primary/80" style={{ height: `${b}%` }} />)}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="mb-3 text-xs font-medium">Top skill gaps · Data Analyst</p>
            <div className="space-y-2.5">
              {gaps.map((g) => (
                <div key={g.s}><div className="mb-1 flex justify-between text-[11px]"><span>{g.s}</span><span className="text-muted-foreground">{g.v}%</span></div>
                <div className="h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-success" style={{ width: `${g.v}%` }} /></div></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="card-surface animate-float absolute -bottom-5 -left-4 hidden items-center gap-2 px-3 py-2 text-xs sm:flex">
        <span className="h-2 w-2 rounded-full bg-success" /> Interview at Razorpay · Nov 25
      </div>
    </div>
  );
}
