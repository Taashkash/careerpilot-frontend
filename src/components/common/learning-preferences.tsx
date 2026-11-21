import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDemo } from "@/components/demo-provider";
export function LearningPreferences() {
  const { background, setBackground } = useDemo();
  return <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-1.5"><Label htmlFor="study-hours">Weekly study hours</Label><Input id="study-hours" type="number" min={1} max={40} value={background.studyHours} onChange={(e) => { const hours = Number(e.target.value); if (hours >= 1 && hours <= 40) setBackground({ ...background, studyHours: hours }); }} /></div><div className="space-y-1.5"><Label htmlFor="learning-format">Preferred learning format</Label><Select value={background.learningFormat} onValueChange={(learningFormat) => setBackground({ ...background, learningFormat })}><SelectTrigger id="learning-format"><SelectValue /></SelectTrigger><SelectContent>{["Mixed", "Videos", "Reading", "Hands-on projects"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></div></div>;
}