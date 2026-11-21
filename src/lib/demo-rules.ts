import { applicationStatuses, roleSkillProfiles, skills } from "./demo-data";
import type { ApplicationStatus, JobApplication } from "./types";

export const isApplicationStatus = (value: string): value is ApplicationStatus => applicationStatuses.some((status) => status === value);
export const demoSkillsForRole = (role: string) => roleSkillProfiles[role] ?? skills;
export const filterApplications = (apps: JobApplication[], query: string, status: string) => apps.filter((app) => (status === "All" || app.status === status) && `${app.company} ${app.role}`.toLowerCase().includes(query.trim().toLowerCase()));
export const validateDemoAccount = (name: string, email: string, password: string, signup: boolean) => {
  if (signup && !name.trim()) return "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
  if (password.length < 8) return "Use at least 8 characters for the demonstration password.";
  return "";
};