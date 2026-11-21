// Domain types — mirror these as tables when connecting the database / FastAPI backend.
export type SkillLevel = { skill: string; current: number; required: number; category: string };
export type RoadmapTask = { id: string; title: string; resource: string; hours: number; done: boolean };
export type RoadmapPhase = { id: string; title: string; weeks: string; tasks: RoadmapTask[] };
export type ApplicationStatus = "Applied" | "Assessment" | "Interview" | "Offer" | "Rejected";
export type JobApplication = {
  id: string; company: string; role: string; location: string;
  status: ApplicationStatus; appliedOn: string; salary?: string; jobUrl?: string; interviewOn?: string; notes?: string;
};
export type Notification = { id: string; title: string; time: string; read: boolean };
export type UserProfile = {
  name: string; email: string; currentRole: string; targetRole: string;
  location: string; bio: string;
};

export type CareerBackground = {
  education: string; experience: string; technicalSkills: string; softSkills: string;
  industry: string; timeline: string; studyHours: number; learningFormat: string;
};
export type PortfolioProject = {
  id: string; title: string; description: string; technologies: string[];
  difficulty: "Beginner" | "Intermediate"; duration: string; skills: string[]; deliverables: string[];
};
export type WeeklyPlan = { week: number; taskId: string; topic: string; objective: string; exercise: string; project: string; hours: number; resource: string; url: string };
