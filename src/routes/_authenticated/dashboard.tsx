import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Target, TrendingUp, CheckCircle2, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/common/stat-card";
import { SectionCard } from "@/components/common/section-card";
import { StatusBadge } from "@/components/common/status-badge";
import { analysesQuery, applicationsQuery, notificationsQuery, planQuery, profileQuery, projectsQuery } from "@/lib/api/queries";
import { isActiveApplication, largestGaps } from "@/lib/demo-rules";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Overview — CareerPilot AI" },
      { name: "description", content: "Your career pivot progress at a glance." },
      { property: "og:title", content: "Overview — CareerPilot AI" },
      { property: "og:description", content: "Your career pivot progress at a glance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context: { queryClient: qc } }) => Promise.all([qc.ensureQueryData(profileQuery), qc.ensureQueryData(analysesQuery), qc.ensureQueryData(planQuery), qc.ensureQueryData(projectsQuery), qc.ensureQueryData(applicationsQuery), qc.ensureQueryData(notificationsQuery)]),
  component: Overview,
});

function Overview() {
  const { data: { profile: user } } = useSuspenseQuery(profileQuery);
  const { data: { latest, history } } = useSuspenseQuery(analysesQuery);
  const { data: { weeks: weeklyPlans, phases, completedWeeks } } = useSuspenseQuery(planQuery);
  const { data: { projects, completed: completedProjects } } = useSuspenseQuery(projectsQuery);
  const { data: applications } = useSuspenseQuery(applicationsQuery);
  const { data: notifications } = useSuspenseQuery(notificationsQuery);
  const skills = latest?.skills ?? [];
  const readiness = latest?.readiness ?? 0;
  const previous = history.length > 1 ? history[history.length - 2] : undefined;
  const growth = latest && previous ? latest.readiness - previous.readiness : 0;
  const progressHistory = history.map((a) => ({ week: new Date(a.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }), score: a.readiness }));
  const tasks = phases.flatMap((p) => p.tasks);
  const done = tasks.filter((t) => t.done).length;
  const active = applications.filter(isActiveApplication).length;
  const gaps = largestGaps(skills, 4);
  const firstName = user.name.split(" ")[0] || "there";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back, {firstName}</p>
          {user.currentRole || user.targetRole ? <h2 className="mt-1 text-2xl font-semibold tracking-tight">{user.currentRole || "Your current role"} → <span className="text-primary">{user.targetRole || "Your target role"}</span></h2> : <h2 className="mt-1 text-2xl font-semibold tracking-tight"><Link to="/onboarding" className="text-primary">Set your career goals</Link></h2>}
        </div>
        <Button asChild><Link to="/roadmap">Continue roadmap <ArrowRight className="h-4 w-4" /></Link></Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Career readiness" value={latest ? `${readiness}%` : "—"} hint={latest ? "Based on skill coverage" : "Run a skill analysis"} icon={Target} />
        <StatCard label="Readiness growth" value={`${growth >= 0 ? "+" : ""}${growth} pts`} hint="Vs your previous analysis" icon={TrendingUp} tone="success" />
        <StatCard label="Roadmap tasks" value={`${completedWeeks.length}/${weeklyPlans.length}`} hint="Weeks completed" icon={CheckCircle2} tone="success" />
        <StatCard label="Active applications" value={String(active)} hint="Applied, assessment or interview" icon={Briefcase} tone="warning" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Readiness over time" description="From your saved skill analyses" className="lg:col-span-2">
          <div className="h-64">
            {progressHistory.length === 0 ? <div className="flex h-full items-center justify-center text-sm text-muted-foreground"><Link to="/skills" className="text-primary">Run your first skill analysis</Link>&nbsp;to start tracking readiness.</div> :
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressHistory} margin={{ left: -20, right: 8 }}>
                <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} /><stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)" }} />
                <Area type="monotone" dataKey="score" isAnimationActive={false} stroke="var(--chart-1)" strokeWidth={2} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>}
          </div>
        </SectionCard>
        <SectionCard title="Top skill gaps" action={<Button variant="ghost" size="sm" asChild><Link to="/skills">View all</Link></Button>}>
          {gaps.length === 0 && <p className="text-sm text-muted-foreground">No analysis yet. <Link to="/skills" className="text-primary">Analyse your skills</Link></p>}
          <ul className="space-y-4">
            {gaps.map((s) => (
              <li key={s.skill}>
                <div className="mb-1.5 flex justify-between text-sm"><span className="font-medium">{s.skill}</span><span className="text-muted-foreground">{s.current}/{s.required}</span></div>
                <Progress value={(s.current / s.required) * 100} className="h-2" />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Learning progress"><p className="mb-3 text-sm text-muted-foreground">{completedWeeks.length} of {weeklyPlans.length} weeks complete</p><Progress value={weeklyPlans.length ? completedWeeks.length / weeklyPlans.length * 100 : 0} /><p className="mt-4 text-sm">{done}/{tasks.length} phase tasks complete · {completedProjects.length} portfolio projects completed</p></SectionCard>
        <SectionCard title="Upcoming learning tasks"><ul className="space-y-3">{weeklyPlans.filter((w) => !w.completed).slice(0, 3).map((w) => <li key={w.week}><Link to="/roadmap" className="text-sm font-medium text-primary">Week {w.week}: {w.topic}</Link><p className="text-xs text-muted-foreground">{w.hours} study hours</p></li>)}</ul>{weeklyPlans.length > 0 && completedWeeks.length === weeklyPlans.length && <p className="text-sm text-success">All weeks completed.</p>}</SectionCard>
        <SectionCard title="Recent activity"><ul className="space-y-3">{notifications.slice(0, 4).map((n) => <li key={n.id}><p className="text-sm">{n.title}</p><p className="text-xs text-muted-foreground">{n.time}</p></li>)}{completedProjects.length > 0 && <li className="text-sm text-success">{completedProjects.length} portfolio {completedProjects.length === 1 ? "project" : "projects"} completed.</li>}{notifications.length === 0 && completedProjects.length === 0 && <li className="text-sm text-muted-foreground">No activity yet.</li>}</ul></SectionCard>
      </div>
      <SectionCard title="Recommended projects" description="Portfolio projects to prove your skills" action={<Button variant="ghost" size="sm" asChild><Link to="/projects">View projects</Link></Button>}><div className="grid gap-4 sm:grid-cols-2">{projects.slice(0, 2).map((p) => <div key={p.id} className="card-surface p-4"><h3 className="font-medium">{p.title}</h3><p className="mt-2 text-sm text-muted-foreground">{p.description}</p><p className="mt-3 text-xs text-primary">{p.technologies.join(" · ")}</p></div>)}</div></SectionCard>
      <SectionCard title="Recent applications" action={<Button variant="ghost" size="sm" asChild><Link to="/applications">Manage</Link></Button>}>
        {applications.length === 0 && <p className="py-3 text-sm text-muted-foreground">No applications yet. <Link to="/applications" className="text-primary">Add your first one</Link></p>}
        <ul className="divide-y">
          {applications.slice(0, 4).map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0"><p className="truncate text-sm font-medium">{a.role}</p><p className="text-xs text-muted-foreground">{a.company} · {a.location}</p></div>
              <StatusBadge status={a.status} />
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
