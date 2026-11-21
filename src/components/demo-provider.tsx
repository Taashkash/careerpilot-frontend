import { createContext, useContext, useState, type ReactNode } from "react";
import { applications as seedApps, demoBackground, demoUser, roadmap as seedRoadmap } from "@/lib/demo-data";
import type { CareerBackground, JobApplication, RoadmapPhase, UserProfile } from "@/lib/types";

function useDemoState() {
  const [profile, setProfile] = useState<UserProfile>(demoUser);
  const [background, setBackground] = useState<CareerBackground>(demoBackground);
  const [applications, setApplications] = useState<JobApplication[]>(seedApps);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>(seedRoadmap);
  const [resume, setResume] = useState<File | null>(null);
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const [completedProjects, setCompletedProjects] = useState<string[]>([]);
  const [completedWeeks, setCompletedWeeks] = useState<number[]>([1, 2]);
  const [preferences, setPreferences] = useState<Record<string, boolean>>({ weekly: true, interview: true, tips: false });
  const [demoSignedIn, setDemoSignedIn] = useState(false);
  const reset = () => { setProfile(demoUser); setBackground(demoBackground); setApplications(seedApps); setRoadmap(seedRoadmap); setResume(null); setSavedProjects([]); setCompletedProjects([]); setCompletedWeeks([1, 2]); setPreferences({ weekly: true, interview: true, tips: false }); setDemoSignedIn(false); };
  return { profile, setProfile, background, setBackground, applications, setApplications, roadmap, setRoadmap, resume, setResume, savedProjects, setSavedProjects, completedProjects, setCompletedProjects, completedWeeks, setCompletedWeeks, preferences, setPreferences, demoSignedIn, setDemoSignedIn, reset };
}
const DemoContext = createContext<ReturnType<typeof useDemoState> | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) { const state = useDemoState(); return <DemoContext.Provider value={state}>{children}</DemoContext.Provider>; }
export function useDemo() { const state = useContext(DemoContext); if (!state) throw new Error("DemoProvider is required"); return state; }