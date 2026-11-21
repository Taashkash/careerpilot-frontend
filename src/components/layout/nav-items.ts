import { LayoutDashboard, Radar, Map, Briefcase, User, Settings, FolderKanban, UserPlus } from "lucide-react";

export const mainNav = [
  { title: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { title: "Skill Analysis", to: "/skills", icon: Radar },
  { title: "Learning Roadmap", to: "/roadmap", icon: Map },
  { title: "Portfolio Projects", to: "/projects", icon: FolderKanban },
  { title: "Applications", to: "/applications", icon: Briefcase },
] as const;

export const bottomNav = [
  { title: "Career Goals", to: "/onboarding", icon: UserPlus },
  { title: "Profile", to: "/profile", icon: User },
  { title: "Settings", to: "/settings", icon: Settings },
] as const;

export const pageTitles: Record<string, string> = Object.fromEntries(
  [...mainNav, ...bottomNav].map((i) => [i.to, i.title]),
);
