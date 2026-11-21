import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { SectionCard } from "@/components/common/section-card";
import { AiNotice } from "@/components/common/ai-notice";
import { planQuery } from "@/lib/api/queries";
import { useResetProgress, useTogglePlanWeek, useToggleRoadmapTask } from "@/lib/api/mutations";

export const Route = createFileRoute("/_authenticated/roadmap")({
  head: () => ({
    meta: [
      { title: "Learning Roadmap — CareerPilot AI" },
      { name: "description", content: "Your personalized, step-by-step learning plan." },
      { property: "og:title", content: "Learning Roadmap — CareerPilot AI" },
      { property: "og:description", content: "Your personalized, step-by-step learning plan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(planQuery),
  component: Roadmap,
});

function Roadmap() {
  const { data: { weeks: weeklyPlans, phases, completedWeeks } } = useSuspenseQuery(planQuery);
  const toggleWeek = useTogglePlanWeek();
  const toggleTask = useToggleRoadmapTask();
  const reset = useResetProgress();
  const pct = weeklyPlans.length ? Math.round(completedWeeks.length / weeklyPlans.length * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="card-surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="flex-1">
          <div className="mb-2 flex justify-between text-sm"><span className="font-medium">Overall progress</span><span className="text-muted-foreground">{pct}%</span></div>
          <Progress value={pct} className="h-2.5" />
        </div>
        <Button variant="outline" disabled={reset.isPending} onClick={() => reset.mutate({ includeProjects: false }, { onSuccess: () => toast.info("Learning plan reset. All weeks and tasks are unticked.") })}><Sparkles className="h-4 w-4" /> Reset sample plan</Button>
      </div>
      <AiNotice>Data Analyst roadmap template — not AI-generated yet. Your progress is saved to your account.</AiNotice>
      <SectionCard title="Week-by-week plan" description={`${weeklyPlans.length} weeks · objectives, exercises and mini-projects`}>
        <div className="grid gap-4 md:grid-cols-2">{weeklyPlans.map((w) => <article key={w.id} className="card-surface p-4"><div className="flex items-start gap-3"><Checkbox id={`week-${w.week}`} checked={w.completed} onCheckedChange={(checked) => toggleWeek.mutate({ id: w.id, completed: checked === true })} className="mt-1" /><div className="min-w-0"><label htmlFor={`week-${w.week}`} className="cursor-pointer font-semibold">Week {w.week} · {w.topic}</label><p className="mt-1 text-xs text-primary">{w.hours} study hours</p></div></div><p className="mt-3 text-sm text-muted-foreground">{w.objective}</p><p className="mt-3 text-sm"><span className="font-medium">Exercise: </span>{w.exercise}</p><p className="mt-2 text-sm"><span className="font-medium">Mini-project: </span>{w.project}</p><a className="mt-3 inline-block text-sm text-primary underline underline-offset-4" href={w.url} target="_blank" rel="noopener noreferrer">{w.resource} ↗</a></article>)}</div>
      </SectionCard>
      <div className="grid gap-6 lg:grid-cols-3">
        {phases.map((p, i) => {
          const d = p.tasks.filter((t) => t.done).length;
          return (
            <SectionCard key={p.id} title={`${i + 1}. ${p.title}`} description={p.weeks}
              action={<span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary">{d}/{p.tasks.length}</span>}>
              <ul className="space-y-3">
                {p.tasks.map((t) => (
                  <li key={t.id}>
                    <label className="flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                      <Checkbox checked={t.done} onCheckedChange={(checked) => toggleTask.mutate({ id: t.id, done: checked === true })} className="mt-0.5" />
                      <span className="min-w-0">
                        <span className={`block text-sm font-medium ${t.done ? "text-muted-foreground line-through" : ""}`}>{t.title}</span>
                        <span className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">{t.resource} · <Clock className="h-3 w-3" />{t.hours}h</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}
