import { useId, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Upload, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resumeQuery } from "@/lib/api/queries";
import { useRemoveResume, useUploadResume } from "@/lib/api/mutations";

export function ResumeUpload() {
  const { data: resume } = useQuery(resumeQuery);
  const upload = useUploadResume();
  const remove = useRemoveResume();
  const [error, setError] = useState("");
  const id = useId();
  return <div className="space-y-2">
    <Label htmlFor={id} className="flex items-center gap-2"><Upload className="h-4 w-4 text-primary" /> Resume · PDF or DOCX</Label>
    <Input id={id} type="file" accept=".pdf,.docx" disabled={upload.isPending} onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; if (!/\.(pdf|docx)$/i.test(file.name) || file.size > 5 * 1024 * 1024) { setError("Choose a PDF or DOCX file under 5 MB."); e.target.value = ""; return; } setError(""); upload.mutate(file); e.target.value = ""; }} />
    <p className="text-xs text-muted-foreground">{upload.isPending ? "Uploading…" : "Up to 5 MB. Stored privately in your account; only you can access it."}</p>
    {resume && <div className="flex items-center gap-2 text-sm"><FileText className="h-4 w-4 shrink-0 text-success" /><span className="min-w-0 flex-1 break-all">{resume.fileName}</span><Button type="button" variant="ghost" size="icon" aria-label="Remove resume" title="Remove resume" disabled={remove.isPending} onClick={() => remove.mutate({ id: resume.id, storagePath: resume.storagePath })}><Trash2 /></Button></div>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
  </div>;
}
