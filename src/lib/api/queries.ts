// Database reads. Every query relies on Row Level Security, so rows are always the signed-in user's own.
import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { roadmap as roadmapTemplate, weeklyPlans as weekTemplate } from "@/lib/demo-data";
import { formatRelativeTime, isApplicationStatus } from "@/lib/demo-rules";
import type { CareerBackground, JobApplication, Notification, PlanWeek, PortfolioProject, ResumeFile, RoadmapPhase, SkillAnalysis, UserProfile } from "@/lib/types";

export async function requireUser() {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) throw new Error("Your session has ended. Please log in again.");
  return user;
}

export type ProfileBundle = { row: Tables<"profiles">; profile: UserProfile; background: CareerBackground; preferences: Record<string, boolean>; onboarded: boolean };

export function toProfileBundle(row: Tables<"profiles">, email: string): ProfileBundle {
  return {
    row,
    profile: { name: row.full_name, email, currentRole: row.current_position, targetRole: row.target_role, location: row.location, bio: row.bio },
    background: { education: row.education, experience: row.experience, technicalSkills: row.technical_skills, softSkills: row.soft_skills, industry: row.industry, timeline: row.timeline, studyHours: row.study_hours, learningFormat: row.learning_format },
    preferences: { weekly: row.notify_weekly, interview: row.notify_interview, tips: row.notify_tips },
    onboarded: row.onboarded,
  };
}

export const sessionQuery = queryOptions({
  queryKey: ["session"],
  queryFn: async () => (await supabase.auth.getSession()).data.session?.user ?? null,
  staleTime: Infinity,
});

export const profileQuery = queryOptions({
  queryKey: ["profile"],
  queryFn: async () => {
    const user = await requireUser();
    const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    let row = data;
    if (!row) {
      const meta: Record<string, unknown> = user.user_metadata ?? {};
      const name = typeof meta["full_name"] === "string" ? meta["full_name"] : "";
      const created = await supabase.from("profiles").insert({ user_id: user.id, full_name: name }).select("*").single();
      if (created.error) throw created.error;
      row = created.data;
    }
    return toProfileBundle(row, user.email ?? "");
  },
});

export const targetRolesQuery = queryOptions({
  queryKey: ["target-roles"],
  queryFn: async () => {
    const { data, error } = await supabase.from("target_roles").select("name").order("position");
    if (error) throw error;
    return data.map((r) => r.name);
  },
  staleTime: 60 * 60 * 1000,
});

export const resumeQuery = queryOptions({
  queryKey: ["resume"],
  queryFn: async (): Promise<ResumeFile | null> => {
    const { data, error } = await supabase.from("resumes").select("*").maybeSingle();
    if (error) throw error;
    return data ? { id: data.id, fileName: data.file_name, storagePath: data.storage_path, sizeBytes: data.size_bytes } : null;
  },
});

export const analysesQuery = queryOptions({
  queryKey: ["analyses"],
  queryFn: async () => {
    const { data, error } = await supabase.from("skill_analyses")
      .select("id, target_role, job_description, readiness, created_at, skill_gaps(skill, category, current_level, required_level, position)")
      .order("created_at", { ascending: false }).limit(12);
    if (error) throw error;
    const list: SkillAnalysis[] = data.map((a) => ({
      id: a.id, targetRole: a.target_role, jobDescription: a.job_description, readiness: a.readiness, createdAt: a.created_at,
      skills: [...a.skill_gaps].sort((x, y) => x.position - y.position).map((g) => ({ skill: g.skill, category: g.category, current: g.current_level, required: g.required_level })),
    }));
    return { latest: list[0] ?? null, history: [...list].reverse() };
  },
});

/** Writes the template plan for the user. `overwrite` also clears completion (used by reset). */
export async function seedPlan(userId: string, overwrite: boolean) {
  const weeks = weekTemplate.map((w) => ({ user_id: userId, week: w.week, task_key: w.taskId, topic: w.topic, objective: w.objective, exercise: w.exercise, project: w.project, hours: w.hours, resource: w.resource, url: w.url, completed: false, completed_at: null }));
  const tasks = roadmapTemplate.flatMap((p, pi) => p.tasks.map((t, ti) => ({ user_id: userId, task_key: t.id, phase_key: p.id, phase_title: p.title, phase_weeks: p.weeks, phase_position: pi, position: ti, title: t.title, resource: t.resource, hours: t.hours, done: false })));
  const w = await supabase.from("learning_plan_weeks").upsert(weeks, { onConflict: "user_id,week", ignoreDuplicates: !overwrite });
  if (w.error) throw w.error;
  const t = await supabase.from("roadmap_tasks").upsert(tasks, { onConflict: "user_id,task_key", ignoreDuplicates: !overwrite });
  if (t.error) throw t.error;
}

async function readPlan() {
  const [weeks, tasks] = await Promise.all([
    supabase.from("learning_plan_weeks").select("*").order("week"),
    supabase.from("roadmap_tasks").select("*").order("phase_position").order("position"),
  ]);
  if (weeks.error) throw weeks.error;
  if (tasks.error) throw tasks.error;
  return { weeks: weeks.data, tasks: tasks.data };
}

export const planQuery = queryOptions({
  queryKey: ["plan"],
  queryFn: async () => {
    let plan = await readPlan();
    if (!plan.weeks.length || !plan.tasks.length) {
      const user = await requireUser();
      await seedPlan(user.id, false);
      plan = await readPlan();
    }
    const weeks: PlanWeek[] = plan.weeks.map((w) => ({ id: w.id, week: w.week, taskId: w.task_key, topic: w.topic, objective: w.objective, exercise: w.exercise, project: w.project, hours: w.hours, resource: w.resource, url: w.url, completed: w.completed }));
    const phases: RoadmapPhase[] = [];
    for (const t of plan.tasks) {
      let phase = phases.find((p) => p.id === t.phase_key);
      if (!phase) { phase = { id: t.phase_key, title: t.phase_title, weeks: t.phase_weeks, tasks: [] }; phases.push(phase); }
      phase.tasks.push({ id: t.id, title: t.title, resource: t.resource, hours: t.hours, done: t.done });
    }
    return { weeks, phases, completedWeeks: weeks.filter((w) => w.completed).map((w) => w.week) };
  },
});

export const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: async () => {
    const [catalog, progress] = await Promise.all([
      supabase.from("portfolio_projects").select("*").order("position"),
      supabase.from("user_projects").select("project_id, saved, completed"),
    ]);
    if (catalog.error) throw catalog.error;
    if (progress.error) throw progress.error;
    const projects: PortfolioProject[] = catalog.data.map((p) => ({ id: p.id, title: p.title, description: p.description, technologies: p.technologies, difficulty: p.difficulty === "Intermediate" ? "Intermediate" : "Beginner", duration: p.duration, skills: p.skills, deliverables: p.deliverables }));
    return { projects, saved: progress.data.filter((p) => p.saved).map((p) => p.project_id), completed: progress.data.filter((p) => p.completed).map((p) => p.project_id) };
  },
});

export function toJobApplication(r: Tables<"job_applications">): JobApplication {
  return {
    id: r.id, company: r.company, role: r.role, location: r.location || "—",
    status: isApplicationStatus(r.status) ? r.status : "Applied", appliedOn: r.applied_on,
    ...(r.salary ? { salary: r.salary } : {}), ...(r.job_url ? { jobUrl: r.job_url } : {}),
    ...(r.interview_on ? { interviewOn: r.interview_on.slice(0, 16) } : {}), ...(r.notes ? { notes: r.notes } : {}),
  };
}

export const applicationsQuery = queryOptions({
  queryKey: ["applications"],
  queryFn: async () => {
    const { data, error } = await supabase.from("job_applications").select("*").order("applied_on", { ascending: false }).order("created_at", { ascending: false });
    if (error) throw error;
    return data.map(toJobApplication);
  },
});

export const notificationsQuery = queryOptions({
  queryKey: ["notifications"],
  queryFn: async (): Promise<Notification[]> => {
    const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(20);
    if (error) throw error;
    return data.map((n) => ({ id: n.id, title: n.title, time: formatRelativeTime(n.created_at), read: n.read }));
  },
});
