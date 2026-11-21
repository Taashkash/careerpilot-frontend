import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/common/section-card";
import { demoUser } from "@/lib/demo-data";
import { initials } from "@/lib/utils";
import type { UserProfile } from "@/lib/types";
import { useDemo } from "@/components/demo-provider";
import { CareerFields } from "@/components/common/career-fields";
import { ResumeUpload } from "@/components/common/resume-upload";
import { LearningPreferences } from "@/components/common/learning-preferences";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — CareerPilot AI" },
      { name: "description", content: "Manage your career profile and goals." },
      { property: "og:title", content: "Profile — CareerPilot AI" },
      { property: "og:description", content: "Manage your career profile and goals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

const fields: { key: keyof UserProfile; label: string }[] = [
  { key: "name", label: "Full name" }, { key: "email", label: "Email" },
  { key: "currentRole", label: "Current role" }, { key: "targetRole", label: "Target role" },
  { key: "location", label: "Location" },
];

function Profile() {
  const { profile, setProfile, background, setBackground } = useDemo();
  const [p, setP] = useState(profile);
  const [b, setB] = useState(background);
  const [error, setError] = useState("");
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="card-surface flex flex-col items-center p-6 text-center">
        <Avatar className="h-20 w-20"><AvatarFallback className="bg-primary-soft text-2xl font-semibold text-primary">{initials(p.name)}</AvatarFallback></Avatar>
        <h2 className="mt-4 text-lg font-semibold">{p.name}</h2>
        <p className="text-sm text-muted-foreground">{p.currentRole}</p>
        <span className="mt-3 rounded-full bg-success-soft px-3 py-1 text-xs font-medium text-success">Goal: {p.targetRole}</span>
      </div>
      <SectionCard title="Personal details" description="Saved for this session until accounts are connected." className="lg:col-span-2">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (![p.name, p.currentRole, p.targetRole, b.education, b.experience, b.technicalSkills, b.softSkills, b.industry].every((s) => s.trim()) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) { setError("Please complete your profile and enter a valid email."); return; } setError(""); setProfile(p); setBackground(b); toast.success("Profile updated for this temporary demo."); }}>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5"><Label htmlFor={f.key}>{f.label}</Label>
                <Input id={f.key} type={f.key === "email" ? "email" : "text"} required value={p[f.key]} onChange={(e) => setP({ ...p, [f.key]: e.target.value })} /></div>
            ))}
          </div>
          <div className="space-y-1.5"><Label htmlFor="bio">Bio</Label><Textarea id="bio" rows={4} value={p.bio} onChange={(e) => setP({ ...p, bio: e.target.value })} /></div>
          <CareerFields value={b} onChange={setB} />
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => { setP(profile); setB(background); setError(""); }}>Discard edits</Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </SectionCard>
      <SectionCard title="Resume management"><ResumeUpload /></SectionCard>
      <SectionCard title="Learning preferences" className="lg:col-span-2"><LearningPreferences /></SectionCard>
    </div>
  );
}
