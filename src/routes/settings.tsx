import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/common/section-card";
import { useDemo } from "@/components/demo-provider";
import { LearningPreferences } from "@/components/common/learning-preferences";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/settings")({
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
  component: Settings,
});

const prefs = [
  { id: "weekly", label: "Weekly progress summary", desc: "A recap of your roadmap and readiness score." },
  { id: "interview", label: "Interview reminders", desc: "Reminders before scheduled interviews." },
  { id: "tips", label: "Learning tips", desc: "Suggested resources for your skill gaps." },
];

function Settings() {
  const { preferences: on, setPreferences: setOn, reset } = useDemo();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [password, setPassword] = useState({ current: "", next: "" });
  const [error, setError] = useState("");
  return (
    <div className="max-w-3xl space-y-6">
      <SectionCard title="Notifications">
        <ul className="divide-y">
          {prefs.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-4 py-4">
              <div><p className="text-sm font-medium">{p.label}</p><p className="text-xs text-muted-foreground">{p.desc}</p></div>
              <Switch aria-label={p.label} checked={!!on[p.id]} onCheckedChange={(v) => { setOn({ ...on, [p.id]: v }); toast.info("Demo preference updated. No notifications will be sent."); }} />
            </li>
          ))}
        </ul>
      </SectionCard>
      <SectionCard title="Learning preferences"><LearningPreferences /></SectionCard>
      <SectionCard title="Password" description="Simulated password change only. No credentials are stored or checked."><form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (!password.current || password.next.length < 8) { setError("Enter a current demo password and a new password of at least 8 characters."); return; } setError(""); setPassword({ current: "", next: "" }); toast.info("Password change simulated. No real password was changed."); }}><div className="space-y-1.5"><Label htmlFor="current-password">Current demo password</Label><Input id="current-password" type="password" autoComplete="off" value={password.current} onChange={(e) => setPassword({ ...password, current: e.target.value })} /></div><div className="space-y-1.5"><Label htmlFor="new-password">New demo password</Label><Input id="new-password" type="password" autoComplete="off" value={password.next} onChange={(e) => setPassword({ ...password, next: e.target.value })} /></div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" variant="outline">Simulate password change</Button></form></SectionCard>
      <SectionCard title="Account" description="End this demonstration or clear temporary changes. No real account will be affected.">
        <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => { reset(); navigate({ to: "/login" }); }}>Log out of demo</Button><Button variant="destructive" onClick={() => setConfirm(true)}>Reset demo data</Button></div>
      </SectionCard>
      <Dialog open={confirm} onOpenChange={setConfirm}><DialogContent><DialogHeader><DialogTitle>Reset the demonstration?</DialogTitle><DialogDescription>This clears your temporary profile, resume selection, progress and applications and restores the sample data.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setConfirm(false)}>Cancel</Button><Button variant="destructive" onClick={() => { reset(); setConfirm(false); toast.info("Sample data restored."); }}>Reset demo</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}
