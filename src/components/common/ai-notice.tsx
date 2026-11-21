import { Info } from "lucide-react";

export function AiNotice({ children }: { children?: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-dashed bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      {children ?? "Showing demo data. AI analysis isn't connected yet."}
    </div>
  );
}
