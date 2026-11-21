import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CareerBackground } from "@/lib/types";

export function CareerFields({ value, onChange }: { value: CareerBackground; onChange: (value: CareerBackground) => void }) {
  return <div className="grid gap-4 sm:grid-cols-2">
    {([ ["education", "Educational background"], ["experience", "Current experience"], ["technicalSkills", "Technical skills"], ["softSkills", "Soft skills"], ["industry", "Preferred industry"] ] as const).map(([key, label]) => <div key={key} className="space-y-1.5"><Label htmlFor={`career-${key}`}>{label}</Label><Input required id={`career-${key}`} value={value[key]} onChange={(e) => onChange({ ...value, [key]: e.target.value })} /></div>)}
    <div className="space-y-1.5"><Label htmlFor="timeline">Transition timeline</Label><Select value={value.timeline} onValueChange={(timeline) => onChange({ ...value, timeline })}><SelectTrigger id="timeline"><SelectValue /></SelectTrigger><SelectContent>{["1 month", "3 months", "6 months", "12 months"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
  </div>;
}