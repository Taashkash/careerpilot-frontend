import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Compass className="h-4 w-4" /></span>
      <span className="text-base font-semibold tracking-tight">CareerPilot AI</span>
    </Link>
  );
}
