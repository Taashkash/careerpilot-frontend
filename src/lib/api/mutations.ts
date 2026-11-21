// Database writes. Each sets user_id from the session; RLS rejects rows for anyone else.
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { TablesUpdate } from "@/integrations/supabase/types";
import { computeReadiness, demoSkillsForRole } from "@/lib/demo-rules";
import type { ApplicationStatus, CareerBackground, UserProfile } from "@/lib/types";
import { analysesQuery, applicationsQuery, notificationsQuery, planQuery, profileQuery, projectsQuery, requireUser, resumeQuery, seedPlan, toProfileBundle, type ProfileBundle } from "./queries";

const fail = (e: unknown) => toast.error(e instanceof Error ? e.message : "Something went wrong. Please try again.");

function useOptimistic<T>(key: QueryKey) {
  const qc = useQueryClient();
  return {
    qc,
    apply: async (update: (old: T) => T) => {
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<T>(key);
      if (previous !== undefined) qc.setQueryData<T>(key, update(previous));
      return { previous };
    },
    rollback: (ctx: { previous: T | undefined } | undefined) => { if (ctx?.previous !== undefined) qc.setQueryData(key, ctx.previous); },
    settle: () => qc.invalidateQueries({ queryKey: key }),
  };
}

// ---------- Profile ----------
export function useUpdateProfile() {
  const o = useOptimistic<ProfileBundle>(profileQuery.queryKey);
  return useMutation({
    mutationFn: async (patch: TablesUpdate<"profiles">) => {
      const user = await requireUser();
      const { error } = await supabase.from("profiles").update(patch).eq("user_id", user.id);
      if (error) throw error;
    },
    onMutate: (patch) => o.apply((old) => toProfileBundle({ ...old.row, ...patch }, old.profile.email)),
    onError: (e, _p, ctx) => { o.rollback(ctx); fail(e); },
    onSettled: o.settle,
  });
}

export const profilePatch = (p: UserProfile, b: CareerBackground): TablesUpdate<"profiles"> => ({
  full_name: p.name.trim(), current_position: p.currentRole.trim(), target_role: p.targetRole.trim(), location: p.location.trim(), bio: p.bio,
  education: b.education.trim(), experience: b.experience.trim(), technical_skills: b.technicalSkills.trim(), soft_skills: b.softSkills.trim(), industry: b.industry.trim(), timeline: b.timeline,
});

export function useSaveProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ profile, background, onboarded }: { profile: UserProfile; background: CareerBackground; onboarded?: boolean }) => {
      const user = await requireUser();
      const { error } = await supabase.from("profiles").update({ ...profilePatch(profile, background), ...(onboarded ? { onboarded: true } : {}) }).eq("user_id", user.id);
      if (error) throw error;
      const email = profile.email.trim();
      if (email && email !== user.email) {
        const res = await supabase.auth.updateUser({ email }, { emailRedirectTo: `${window.location.origin}/profile` });
        if (res.error) throw res.error;
        return { emailChangePending: true };
      }
      return { emailChangePending: false };
    },
    onError: fail,
    onSettled: () => qc.invalidateQueries({ queryKey: profileQuery.queryKey }),
  });
}

// ---------- Skill analysis ----------
export async function saveAnalysis(targetRole: string, jobDescription: string) {
  const user = await requireUser();
  const skills = demoSkillsForRole(targetRole);
  const { data, error } = await supabase.from("skill_analyses").insert({ user_id: user.id, target_role: targetRole, job_description: jobDescription, readiness: computeReadiness(skills) }).select("id").single();
  if (error) throw error;
  const gaps = skills.map((s, i) => ({ analysis_id: data.id, user_id: user.id, skill: s.skill, category: s.category, current_level: s.current, required_level: s.required, position: i }));
  const g = await supabase.from("skill_gaps").insert(gaps);
  if (g.error) throw g.error;
}

export function useRunAnalysis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ targetRole, jobDescription }: { targetRole: string; jobDescription: string }) => saveAnalysis(targetRole, jobDescription),
    onError: fail,
    onSettled: () => qc.invalidateQueries({ queryKey: analysesQuery.queryKey }),
  });
}

// ---------- Learning plan ----------
type Plan = Awaited<ReturnType<NonNullable<typeof planQuery.queryFn>>>;

export function useTogglePlanWeek() {
  const o = useOptimistic<Plan>(planQuery.queryKey);
  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase.from("learning_plan_weeks").update({ completed, completed_at: completed ? new Date().toISOString() : null }).eq("id", id);
      if (error) throw error;
    },
    onMutate: ({ id, completed }) => o.apply((old) => {
      const weeks = old.weeks.map((w) => w.id === id ? { ...w, completed } : w);
      return { ...old, weeks, completedWeeks: weeks.filter((w) => w.completed).map((w) => w.week) };
    }),
    onError: (e, _v, ctx) => { o.rollback(ctx); fail(e); },
    onSettled: o.settle,
  });
}

export function useToggleRoadmapTask() {
  const o = useOptimistic<Plan>(planQuery.queryKey);
  return useMutation({
    mutationFn: async ({ id, done }: { id: string; done: boolean }) => {
      const { error } = await supabase.from("roadmap_tasks").update({ done }).eq("id", id);
      if (error) throw error;
    },
    onMutate: ({ id, done }) => o.apply((old) => ({ ...old, phases: old.phases.map((p) => ({ ...p, tasks: p.tasks.map((t) => t.id === id ? { ...t, done } : t) })) })),
    onError: (e, _v, ctx) => { o.rollback(ctx); fail(e); },
    onSettled: o.settle,
  });
}

export function useResetProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ includeProjects }: { includeProjects: boolean }) => {
      const user = await requireUser();
      await seedPlan(user.id, true);
      if (includeProjects) {
        const { error } = await supabase.from("user_projects").delete().eq("user_id", user.id);
        if (error) throw error;
      }
    },
    onError: fail,
    onSettled: () => Promise.all([qc.invalidateQueries({ queryKey: planQuery.queryKey }), qc.invalidateQueries({ queryKey: projectsQuery.queryKey })]),
  });
}

// ---------- Portfolio projects ----------
type Projects = Awaited<ReturnType<NonNullable<typeof projectsQuery.queryFn>>>;
export function useToggleProject() {
  const o = useOptimistic<Projects>(projectsQuery.queryKey);
  return useMutation({
    mutationFn: async ({ projectId, field, value }: { projectId: string; field: "saved" | "completed"; value: boolean }) => {
      const user = await requireUser();
      const row = field === "saved" ? { saved: value } : { completed: value, completed_at: value ? new Date().toISOString() : null };
      const { error } = await supabase.from("user_projects").upsert({ user_id: user.id, project_id: projectId, ...row }, { onConflict: "user_id,project_id" });
      if (error) throw error;
    },
    onMutate: ({ projectId, field, value }) => o.apply((old) => {
      const list = value ? [...new Set([...old[field], projectId])] : old[field].filter((id) => id !== projectId);
      return { ...old, [field]: list };
    }),
    onError: (e, _v, ctx) => { o.rollback(ctx); fail(e); },
    onSettled: o.settle,
  });
}

// ---------- Applications ----------
export type ApplicationForm = { company: string; role: string; location: string; status: ApplicationStatus; appliedOn: string; jobUrl: string; interviewOn: string; notes: string };

export function useSaveApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, form }: { id: string | null; form: ApplicationForm }) => {
      const user = await requireUser();
      const row = { company: form.company.trim(), role: form.role.trim(), location: form.location.trim(), status: form.status, applied_on: form.appliedOn, job_url: form.jobUrl.trim() || null, interview_on: form.interviewOn || null, notes: form.notes.trim() || null };
      const { error } = id ? await supabase.from("job_applications").update(row).eq("id", id) : await supabase.from("job_applications").insert({ ...row, user_id: user.id });
      if (error) throw error;
    },
    onError: fail,
    onSettled: () => Promise.all([qc.invalidateQueries({ queryKey: applicationsQuery.queryKey }), qc.invalidateQueries({ queryKey: notificationsQuery.queryKey })]),
  });
}

type Apps = Awaited<ReturnType<NonNullable<typeof applicationsQuery.queryFn>>>;
export function useSetApplicationStatus() {
  const o = useOptimistic<Apps>(applicationsQuery.queryKey);
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
      const { error } = await supabase.from("job_applications").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onMutate: ({ id, status }) => o.apply((old) => old.map((a) => a.id === id ? { ...a, status } : a)),
    onError: (e, _v, ctx) => { o.rollback(ctx); fail(e); },
    onSettled: o.settle,
  });
}

export function useDeleteApplication() {
  const o = useOptimistic<Apps>(applicationsQuery.queryKey);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("job_applications").delete().eq("id", id);
      if (error) throw error;
    },
    onMutate: (id) => o.apply((old) => old.filter((a) => a.id !== id)),
    onError: (e, _v, ctx) => { o.rollback(ctx); fail(e); },
    onSettled: o.settle,
  });
}

// ---------- Notifications ----------
type Notes = Awaited<ReturnType<NonNullable<typeof notificationsQuery.queryFn>>>;
export function useMarkNotificationsRead() {
  const o = useOptimistic<Notes>(notificationsQuery.queryKey);
  return useMutation({
    mutationFn: async (id: string | "all") => {
      const user = await requireUser();
      const q = supabase.from("notifications").update({ read: true }).eq("user_id", user.id);
      const { error } = id === "all" ? await q.eq("read", false) : await q.eq("id", id);
      if (error) throw error;
    },
    onMutate: (id) => o.apply((old) => old.map((n) => id === "all" || n.id === id ? { ...n, read: true } : n)),
    onError: (e, _v, ctx) => { o.rollback(ctx); fail(e); },
    onSettled: o.settle,
  });
}

// ---------- Resume ----------
export function useUploadResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const user = await requireUser();
      const existing = await supabase.from("resumes").select("storage_path").maybeSingle();
      const safeName = file.name.replace(/[^\w.-]+/g, "_");
      const path = `${user.id}/${Date.now()}-${safeName}`;
      const up = await supabase.storage.from("resumes").upload(path, file, { contentType: file.type || undefined, upsert: false });
      if (up.error) throw up.error;
      const { error } = await supabase.from("resumes").upsert({ user_id: user.id, file_name: file.name, storage_path: path, size_bytes: file.size, mime_type: file.type }, { onConflict: "user_id" });
      if (error) { await supabase.storage.from("resumes").remove([path]); throw error; }
      if (existing.data?.storage_path) await supabase.storage.from("resumes").remove([existing.data.storage_path]);
    },
    onError: fail,
    onSuccess: () => toast.success("Resume saved to your account."),
    onSettled: () => qc.invalidateQueries({ queryKey: resumeQuery.queryKey }),
  });
}

export function useRemoveResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, storagePath }: { id: string; storagePath: string }) => {
      const { error } = await supabase.from("resumes").delete().eq("id", id);
      if (error) throw error;
      await supabase.storage.from("resumes").remove([storagePath]);
    },
    onError: fail,
    onSettled: () => qc.invalidateQueries({ queryKey: resumeQuery.queryKey }),
  });
}

// ---------- Session ----------
export function useSignOut() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };
}
