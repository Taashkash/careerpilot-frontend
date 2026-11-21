import { useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AppSidebar } from "./app-sidebar";
import { TopBar } from "./top-bar";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (PUBLIC_PATHS.includes(path)) return <>{children}</>;
  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block"><AppSidebar /></aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 border-none p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AppSidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenu={() => setOpen(true)} />
        <div role="status" className="border-b bg-primary-soft px-4 py-2 text-xs text-primary md:px-8">Frontend demo · Changes are temporary and reset on refresh. No real authentication or AI analysis.</div>
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
