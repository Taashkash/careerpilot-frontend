import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus, Trash2, Search, Pencil } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionCard } from "@/components/common/section-card";
import { StatusBadge } from "@/components/common/status-badge";
import { applicationStatuses } from "@/lib/demo-data";
import type { ApplicationStatus } from "@/lib/types";
import { applicationsQuery } from "@/lib/api/queries";
import { useDeleteApplication, useSaveApplication, useSetApplicationStatus } from "@/lib/api/mutations";
import { filterApplications, isApplicationStatus } from "@/lib/demo-rules";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/applications")({
  head: () => ({
    meta: [
      { title: "Applications — CareerPilot AI" },
      { name: "description", content: "Track every job application in one place." },
      { property: "og:title", content: "Applications — CareerPilot AI" },
      { property: "og:description", content: "Track every job application in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(applicationsQuery),
  component: Applications,
});

const colors = ["var(--muted-foreground)", "var(--chart-1)", "var(--chart-3)", "var(--chart-2)", "var(--destructive)"];

function Applications() {
  const { data: apps } = useSuspenseQuery(applicationsQuery);
  const save = useSaveApplication();
  const setAppStatus = useSetApplicationStatus();
  const remove = useDeleteApplication();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [open, setOpen] = useState(false);
  const blank = { company: "", role: "", location: "", status: "Applied" as ApplicationStatus, appliedOn: "", jobUrl: "", interviewOn: "", notes: "" };
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");

  const list = filterApplications(apps, q, status);
  const chart = applicationStatuses.map((s) => ({ status: s, count: apps.filter((a) => a.status === s).length }));

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim() || !form.appliedOn) { setError("Company, role and application date are required."); return; }
    if (form.jobUrl && !/^https?:\/\//i.test(form.jobUrl)) { setError("Use a complete http or https job URL."); return; }
    save.mutate({ id: editing, form }, { onSuccess: () => {
      setForm(blank); setEditing(null); setError(""); setOpen(false);
      toast.success(editing ? "Application updated." : "Application added.");
    } });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{[{ label: "Total applications", value: apps.length }, { label: "In progress", value: apps.filter((a) => ["Applied", "Assessment", "Interview"].includes(a.status)).length }, { label: "Offers", value: apps.filter((a) => a.status === "Offer").length }, { label: "Interviews", value: apps.filter((a) => a.status === "Interview").length }].map((s) => <div className="card-surface p-4" key={s.label}><p className="text-xs text-muted-foreground">{s.label}</p><p className="mt-2 text-2xl font-semibold">{s.value}</p></div>)}</div>
      <SectionCard title="Pipeline" description={`${apps.length} applications`}>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart} margin={{ left: -24 }}>
              <XAxis dataKey="status" interval={0} tickLine={false} axisLine={false} fontSize={10} stroke="var(--muted-foreground)" />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
              <Tooltip cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="count" isAnimationActive={false} radius={[6, 6, 0, 0]}>{chart.map((_, i) => <Cell key={i} fill={colors[i]} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="All applications" action={<Button size="sm" onClick={() => { setEditing(null); setError(""); setForm({ ...blank, appliedOn: new Date().toISOString().slice(0, 10) }); setOpen(true); }}><Plus className="h-4 w-4" /> Add</Button>}>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search company or role" className="pl-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="All">All statuses</SelectItem>{applicationStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {list.length === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">{apps.length === 0 ? "No applications yet. Click Add to track your first one." : "No applications match."}</p> : (
          <ul className="divide-y">
            {list.map((a) => (
              <li key={a.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{a.role} <span className="font-normal text-muted-foreground">· {a.company}</span></p>
                  <p className="text-xs text-muted-foreground">{a.location} · {a.appliedOn}{a.salary ? ` · ${a.salary}` : ""}</p>
                  {a.interviewOn && <p className="mt-1 text-xs text-primary">Interview: {a.interviewOn.replace("T", " · ")}</p>}
                  {a.notes && <p className="mt-1 break-words text-xs text-muted-foreground">{a.notes}</p>}
                  {a.jobUrl && /^https?:\/\//i.test(a.jobUrl) && <a href={a.jobUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-primary underline">View job ↗</a>}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={a.status} />
                  <Select value={a.status} onValueChange={(v) => { if (isApplicationStatus(v)) setAppStatus.mutate({ id: a.id, status: v }); }}>
                    <SelectTrigger className="h-8 w-32 text-xs" aria-label="Change status"><SelectValue /></SelectTrigger>
                    <SelectContent>{applicationStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" aria-label={`Edit ${a.company} application`} title="Edit application" onClick={() => { setEditing(a.id); setError(""); setForm({ company: a.company, role: a.role, location: a.location === "—" ? "" : a.location, status: a.status, appliedOn: a.appliedOn, jobUrl: a.jobUrl ?? "", interviewOn: a.interviewOn ?? "", notes: a.notes ?? "" }); setOpen(true); }}><Pencil /></Button>
                  <Button variant="ghost" size="icon" aria-label="Delete" title="Delete application" onClick={() => remove.mutate(a.id, { onSuccess: () => toast("Application removed") })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit application" : "Add application"}</DialogTitle></DialogHeader>
          <form onSubmit={add} className="max-h-[75vh] space-y-4 overflow-y-auto px-1">
            <div className="space-y-1.5"><Label htmlFor="c">Company</Label><Input id="c" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
            <div className="space-y-1.5"><Label htmlFor="r">Role</Label><Input id="r" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
            <div className="space-y-1.5"><Label htmlFor="l">Location</Label><Input id="l" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
            <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-1.5"><Label htmlFor="applied-date">Application date</Label><Input id="applied-date" type="date" required value={form.appliedOn} onChange={(e) => setForm({ ...form, appliedOn: e.target.value })} /></div><div className="space-y-1.5"><Label htmlFor="interview-date">Interview date and time</Label><Input id="interview-date" type="datetime-local" value={form.interviewOn} onChange={(e) => setForm({ ...form, interviewOn: e.target.value })} /></div></div>
            <div className="space-y-1.5"><Label htmlFor="job-url">Job URL</Label><Input id="job-url" type="url" value={form.jobUrl} onChange={(e) => setForm({ ...form, jobUrl: e.target.value })} placeholder="https://company.com/careers/role" /></div>
            <div className="space-y-1.5"><Label htmlFor="application-notes">Notes</Label><Textarea id="application-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <div className="space-y-1.5"><Label htmlFor="application-status">Status</Label>
              <Select value={form.status} onValueChange={(v) => { if (isApplicationStatus(v)) setForm({ ...form, status: v }); }}>
                <SelectTrigger id="application-status"><SelectValue /></SelectTrigger>
                <SelectContent>{applicationStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <p className="text-xs text-muted-foreground">Saved to your account.</p>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
