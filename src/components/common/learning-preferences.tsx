import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { profileQuery } from "@/lib/api/queries";
import { useUpdateProfile } from "@/lib/api/mutations";
export function LearningPreferences() {
  const { data } = useQuery(profileQuery);
  const update = useUpdateProfile();
  if (!data) return null;
  const { background } = data;
  return <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-1.5"><Label htmlFor="study-hours">Weekly study hours</Label><Input id="study-hours" type="number" min={1} max={40} value={background.studyHours} onChange={(e) => { const hours = Number(e.target.value); if (Number.isInteger(hours) && hours >= 1 && hours <= 40) update.mutate({ study_hours: hours }); }} /></div><div className="space-y-1.5"><Label htmlFor="learning-format">Preferred learning format</Label><Select value={background.learningFormat} onValueChange={(learning_format) => update.mutate({ learning_format })}><SelectTrigger id="learning-format"><SelectValue /></SelectTrigger><SelectContent>{["Mixed", "Videos", "Reading", "Hands-on projects"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></div></div>;
}
