import { applicationStatuses, roleSkillProfiles, skills } from "./demo-data";
import type { ApplicationStatus, JobApplication, SkillLevel } from "./types";

export const isApplicationStatus = (value: string): value is ApplicationStatus => applicationStatuses.some((status) => status === value);
// Preset skill scores per role. Used as the analysis source until AI analysis is connected.
export const demoSkillsForRole = (role: string) => roleSkillProfiles[role] ?? skills;
export const filterApplications = (apps: JobApplication[], query: string, status: string) => apps.filter((app) => (status === "All" || app.status === status) && `${app.company} ${app.role}`.toLowerCase().includes(query.trim().toLowerCase()));
export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
export const validateAccount = (name: string, email: string, password: string, signup: boolean) => {
  if (signup && !name.trim()) return "Please enter your full name.";
  if (!isValidEmail(email)) return "Please enter a valid email address.";
  if (password.length < 8) return "Use at least 8 characters for your password.";
  return "";
};
/** Career readiness: average skill coverage (current capped at required), as a whole percentage. */
export const computeReadiness = (list: SkillLevel[]) => list.length ? Math.round(list.reduce((a, s) => a + Math.min(s.current, s.required) / s.required, 0) / list.length * 100) : 0;
export const largestGaps = (list: SkillLevel[], count: number) => [...list].sort((a, b) => (b.required - b.current) - (a.required - a.current)).slice(0, count);
export const isActiveApplication = (app: JobApplication) => app.status === "Applied" || app.status === "Assessment" || app.status === "Interview";
export const formatRelativeTime = (iso: string, now: Date = new Date()) => {
  const minutes = Math.max(0, Math.floor((now.getTime() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};
