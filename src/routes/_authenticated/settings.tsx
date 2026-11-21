import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/common/section-card";
import { supabase } from "@/integrations/supabase/client";
import { profileQuery } from "@/lib/api/queries";
import { useResetProgress, useSignOut, useUpdateProfile } from "@/lib/api/mutations";
import { LearningPreferences } from "@/components/common/learning-preferences";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CareerPilot AI" },
      { name: "description", content: "Notification and account preferences." },
      { property: "og:title", content: "Settings — CareerPilot AI" },
      { property: "og:description", content: "Notification and account preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQuery),
  component: Settings,
});

const prefs: { id: "weekly" | "interview" | "tips"; label: string; desc: string }[] = [
  { id: "weekly", label: "Weekly progress summary", desc: "A recap of your roadmap and readiness score." },
  { id: "interview", label: "Interview reminders", desc: "Reminders before scheduled interviews." },
  { id: "tips", label: "Learning tips", desc: "Suggested resources for your skill gaps." },
];

function Settings() {
  const { data: { preferences: on } } = useSuspenseQuery(profileQuery);
  const update = useUpdateProfile();
  const reset = useResetProgress();
  const signOut = useSignOut();
  const [confirm, setConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState({ current: "", next: "" });
  const [error, setError] = useState("");
  return (
    <div className="max-w-3xl space-y-6">
      <SectionCard title="Notifications">
        <ul className="divide-y">
          {prefs.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-4 py-4">
              <div><p className="text-sm font-medium">{p.label}</p><p className="text-xs text-muted-foreground">{p.desc}</p></div>
              <Switch aria-label={p.label} checked={!!on[p.id]} onCheckedChange={(v) => update.mutate({ [`notify_${p.id}`]: v }, { onSuccess: () => toast.success("Preference saved.") })} />
            </li>
          ))}
        </ul>
      </SectionCard>
      <SectionCard title="Learning preferences"><LearningPreferences /></SectionCard>
      <SectionCard title="Password" description="Change the password you use to log in."><form className="space-y-4" onSubmit={async (e) => { e.preventDefault(); if (!password.current || password.next.length < 8) { setError("Enter your current password and a new password of at least 8 characters."); return; } setError(""); setSaving(true); const { error: err } = await supabase.auth.updateUser({ password: password.next, current_password: password.current }); setSaving(false); if (err) { setError(err.message); return; } setPassword({ current: "", next: "" }); toast.success("Password updated."); }}><div className="space-y-1.5"><Label htmlFor="current-password">Current password</Label><Input id="current-password" type="password" autoComplete="current-password" value={password.current} onChange={(e) => setPassword({ ...password, current: e.target.value })} /></div><div className="space-y-1.5"><Label htmlFor="new-password">New password</Label><Input id="new-password" type="password" autoComplete="new-password" value={password.next} onChange={(e) => setPassword({ ...password, next: e.target.value })} /></div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" variant="outline" disabled={saving}>{saving ? "Updating…" : "Change password"}</Button></form></SectionCard>
      <SectionCard title="Account" description="Log out, or start your learning progress over. Your profile and applications are kept.">
        <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => void signOut()}>Log out</Button><Button variant="destructive" onClick={() => setConfirm(true)}>Reset learning progress</Button></div>
      </SectionCard>
      <Dialog open={confirm} onOpenChange={setConfirm}><DialogContent><DialogHeader><DialogTitle>Reset your learning progress?</DialogTitle><DialogDescription>This unticks every roadmap week and task and clears saved and completed portfolio projects. Your profile, resume, analyses and applications are kept.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setConfirm(false)}>Cancel</Button><Button variant="destructive" disabled={reset.isPending} onClick={() => reset.mutate({ includeProjects: true }, { onSuccess: () => { setConfirm(false); toast.info("Learning progress reset."); } })}>Reset progress</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}
