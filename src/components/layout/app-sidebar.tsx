import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { mainNav, bottomNav } from "./nav-items";

function NavLink({ item, onNavigate }: { item: (typeof mainNav)[number] | (typeof bottomNav)[number]; onNavigate?: (() => void) | undefined }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      activeOptions={{ exact: true }}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground"
    >
      <Icon className="h-4 w-4" />
      {item.title}
    </Link>
  );
}

export function AppSidebar({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col bg-sidebar px-3 py-5 text-sidebar-foreground">
      <Link to="/dashboard" onClick={onNavigate} className="mb-8 flex items-center gap-2.5 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Compass className="h-4 w-4" />
        </span>
        <span className="text-base font-semibold tracking-tight">CareerPilot AI</span>
      </Link>
      <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-muted">Workspace</p>
      <nav className="flex flex-col gap-1">
        {mainNav.map((i) => <NavLink key={i.to} item={i} onNavigate={onNavigate} />)}
      </nav>
      <nav className="mt-auto flex flex-col gap-1 border-t border-sidebar-border pt-4">
        {bottomNav.map((i) => <NavLink key={i.to} item={i} onNavigate={onNavigate} />)}
      </nav>
    </div>
  );
}
