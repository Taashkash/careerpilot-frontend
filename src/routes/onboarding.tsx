import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { CareerFields } from "@/components/common/career-fields";
import { ResumeUpload } from "@/components/common/resume-upload";
import { SectionCard } from "@/components/common/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/onboarding")({ head: () => pageHead("Your career goals", "Build your demonstration career profile and transition goals."), component: Onboarding });
function Onboarding() {
  const demo = useDemo(); const navigate = useNavigate();
  const [profile, setProfile] = useState(demo.profile); const [background, setBackground] = useState(demo.background);
  const [error, setError] = useState("");
  return <div className="mx-auto max-w-3xl space-y-6"><div><p className="text-sm text-primary">Your next chapter</p><h2 className="mt-1 text-2xl font-semibold">Build your career profile</h2></div><SectionCard title="Background & goals" description="Temporary demonstration profile. Resume selection is optional."><form className="space-y-6" onSubmit={(e) => { e.preventDefault(); if (![profile.name, profile.currentRole, profile.targetRole, background.education, background.experience, background.technicalSkills, background.softSkills, background.industry].every((s) => s.trim())) { setError("Please complete your background and career goals."); return; } demo.setProfile(profile); demo.setBackground(background); navigate({ to: "/dashboard" }); }}>
    <div className="grid gap-4 sm:grid-cols-2">{([ ["name", "Full name"], ["currentRole", "Current role"], ["targetRole", "Target job role"] ] as const).map(([key, label]) => <div className="space-y-1.5" key={key}><Label htmlFor={`onboard-${key}`}>{label}</Label><Input id={`onboard-${key}`} required value={profile[key]} onChange={(e) => setProfile({ ...profile, [key]: e.target.value })} /></div>)}</div>
    <CareerFields value={background} onChange={setBackground} /><ResumeUpload />{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<div className="flex flex-wrap justify-end gap-2"><Button type="button" variant="ghost" onClick={() => navigate({ to: "/dashboard" })}>Use sample profile</Button><Button type="submit">Open my dashboard <ArrowRight /></Button></div></form></SectionCard></div>;
}