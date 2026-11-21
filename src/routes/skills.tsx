import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionCard } from "@/components/common/section-card";
import { AiNotice } from "@/components/common/ai-notice";
import { targetRoles, skillExplanations } from "@/lib/demo-data";
import { demoSkillsForRole } from "@/lib/demo-rules";
import { useDemo } from "@/components/demo-provider";
import { ResumeUpload } from "@/components/common/resume-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skill Analysis — CareerPilot AI" },
      { name: "description", content: "Compare your current skills with your target role." },
      { property: "og:title", content: "Skill Analysis — CareerPilot AI" },
      { property: "og:description", content: "Compare your current skills with your target role." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SkillAnalysis,
});

function SkillAnalysis() {
  const { profile } = useDemo();
  const [role, setRole] = useState(profile.targetRole);
  const [resultRole, setResultRole] = useState(profile.targetRole);
  const [description, setDescription] = useState("");
  const [ran, setRan] = useState(false);
  const skills = demoSkillsForRole(resultRole);
  const missing = [...skills].filter((s) => s.current < s.required).sort((a, b) => (b.required - b.current) - (a.required - a.current));
  const matching = skills.filter((s) => s.current >= s.required);
  const [filter, setFilter] = useState("All");
  const cats = ["All", ...new Set(skills.map((s) => s.category))];
  const list = skills.filter((s) => filter === "All" || s.category === filter);

  return (
    <div className="space-y-6">
      <SectionCard title="Skill gap analysis" description="Select a resume and describe your target opportunity."><form className="grid gap-4 md:grid-cols-2" onSubmit={(e) => { e.preventDefault(); if (!role.trim()) return; setResultRole(role.trim()); setFilter("All"); setRan(true); toast.info("Simulated analysis complete — sample skills only. Your resume and job description were not processed."); }}>
        <ResumeUpload /><div className="space-y-2"><Label htmlFor="target-role">Target job role</Label><Input id="target-role" required value={role} onChange={(e) => setRole(e.target.value)} list="role-options" /><datalist id="role-options">{targetRoles.map((r) => <option key={r} value={r} />)}</datalist></div>
        <div className="space-y-2 md:col-span-2"><Label htmlFor="job-description">Job description</Label><Textarea id="job-description" rows={4} placeholder="Paste the opportunity’s responsibilities and requirements" value={description} onChange={(e) => setDescription(e.target.value)} /></div><div className="md:col-span-2"><Button type="submit"><Sparkles className="h-4 w-4" /> Run simulated analysis</Button></div>
      </form></SectionCard>
      <AiNotice>{`${ran ? "Simulated result" : "Sample skill profile"} for ${resultRole}${targetRoles.includes(resultRole) ? "" : " (Data Analyst sample fallback)"}. These are preset demonstration scores, not actual AI analysis of your resume or job description.`}</AiNotice>
      <div className="grid gap-4 sm:grid-cols-2"><div className="card-surface p-4"><p className="text-sm font-semibold text-success">Matching skills · {matching.length}</p><p className="mt-2 text-sm">{matching.map((s) => s.skill).join(" · ") || "No skills at the sample target level yet."}</p></div><div className="card-surface p-4"><p className="text-sm font-semibold text-warning">Missing target proficiency · {missing.length}</p><p className="mt-2 text-sm">{missing.map((s) => s.skill).join(" · ") || "All sample skills meet target proficiency."}</p></div></div>
      <div className="grid gap-6 lg:grid-cols-5">
        <SectionCard title="Skill map" description="Current vs required" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skills} outerRadius="70%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="skill" fontSize={11} stroke="var(--muted-foreground)" />
                <Radar name="Required" dataKey="required" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.15} />
                <Radar name="Current" dataKey="current" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} />
                <Legend wrapperStyle={{ fontSize: 12 }} /><Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
        <SectionCard title="Skill breakdown" className="lg:col-span-3"
          action={<div className="flex flex-wrap gap-1">{cats.map((c) => (
            <Button key={c} size="sm" variant={filter === c ? "secondary" : "ghost"} onClick={() => setFilter(c)}>{c}</Button>
          ))}</div>}>
          <ul className="space-y-4">
            {list.map((s) => {
              const gap = s.required - s.current;
              return (
                <li key={s.skill}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">{s.skill} <span className="ml-1 text-xs font-normal text-muted-foreground">{s.category} · {s.current >= 75 ? "Advanced" : s.current >= 40 ? "Intermediate" : "Beginner"}</span></span>
                    <span className={gap > 0 ? "text-xs font-medium text-warning" : "text-xs font-medium text-success"}>{gap > 0 ? `Gap ${gap}` : "On track"}</span>
                  </div>
                  <p className="mb-2 text-xs text-muted-foreground">Current {s.current}% · Required {s.required}%</p>
                  <Progress value={Math.min(100, (s.current / s.required) * 100)} className="h-2" />
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>
      <SectionCard title="Prioritised missing skills" description="Largest sample proficiency gaps first"><ol className="divide-y">{missing.map((s, i) => <li key={s.skill} className="py-4"><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold">{i + 1}. {s.skill}</h3><span className="text-xs text-warning">{s.required - s.current} point gap</span></div><p className="mt-2 text-sm text-muted-foreground">{skillExplanations[s.skill] ?? `Build ${s.skill} proficiency to perform the core responsibilities of a ${resultRole}.`}</p></li>)}</ol></SectionCard>
    </div>
  );
}
