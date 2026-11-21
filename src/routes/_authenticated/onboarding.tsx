import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { CareerFields } from "@/components/common/career-fields";
import { ResumeUpload } from "@/components/common/resume-upload";
import { SectionCard } from "@/components/common/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pageHead } from "@/lib/page-head";
import { analysesQuery, profileQuery } from "@/lib/api/queries";
import { saveAnalysis, useSaveProfile, useUpdateProfile } from "@/lib/api/mutations";
export const Route = createFileRoute("/_authenticated/onboarding")({ head: () => pageHead("Your career goals", "Build your career profile and transition goals."), loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(profileQuery), context.queryClient.ensureQueryData(analysesQuery)]), component: Onboarding });
function Onboarding() {
  const navigate = useNavigate(); const qc = useQueryClient();
  const { data } = useSuspenseQuery(profileQuery); const { data: analyses } = useSuspenseQuery(analysesQuery);
  const save = useSaveProfile(); const update = useUpdateProfile();
  const [profile, setProfile] = useState(data.profile); const [background, setBackground] = useState(data.background);
  const [error, setError] = useState("");
  return <div className="mx-auto max-w-3xl space-y-6"><div><p className="text-sm text-primary">Your next chapter</p><h2 className="mt-1 text-2xl font-semibold">Build your career profile</h2></div><SectionCard title="Background & goals" description="Saved to your account. Resume upload is optional."><form className="space-y-6" onSubmit={async (e) => { e.preventDefault(); if (![profile.name, profile.currentRole, profile.targetRole, background.education, background.experience, background.technicalSkills, background.softSkills, background.industry].every((s) => s.trim())) { setError("Please complete your background and career goals."); return; } setError("");
      try {
        await save.mutateAsync({ profile: { ...profile, email: data.profile.email }, background, onboarded: true });
        const role = profile.targetRole.trim();
        if (analyses.latest?.targetRole !== role) { await saveAnalysis(role, ""); await qc.invalidateQueries({ queryKey: analysesQuery.queryKey }); }
        toast.success("Career profile saved.");
        navigate({ to: "/dashboard" });
      } catch { /* toast shown by the mutation */ }
    }}>
    <div className="grid gap-4 sm:grid-cols-2">{([ ["name", "Full name"], ["currentRole", "Current role"], ["targetRole", "Target job role"] ] as const).map(([key, label]) => <div className="space-y-1.5" key={key}><Label htmlFor={`onboard-${key}`}>{label}</Label><Input id={`onboard-${key}`} required value={profile[key]} onChange={(e) => setProfile({ ...profile, [key]: e.target.value })} /></div>)}</div>
    <CareerFields value={background} onChange={setBackground} /><ResumeUpload />{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<div className="flex flex-wrap justify-end gap-2"><Button type="button" variant="ghost" onClick={() => { if (!data.onboarded) update.mutate({ onboarded: true }); navigate({ to: "/dashboard" }); }}>Skip for now</Button><Button type="submit" disabled={save.isPending}>Open my dashboard <ArrowRight /></Button></div></form></SectionCard></div>;
}
