// Demo data only. Replace each export with a query to the database / API later.
import type { CareerBackground, JobApplication, Notification, PortfolioProject, RoadmapPhase, SkillLevel, UserProfile, WeeklyPlan } from "./types";

export const demoUser: UserProfile = {
  name: "Aarav Mehta",
  email: "aarav.mehta@example.com",
  currentRole: "Customer Support Specialist",
  targetRole: "Data Analyst",
  location: "Bengaluru, India",
  bio: "Support specialist with 3 years of experience moving into data analytics.",
};

export const targetRoles = ["Data Analyst", "Product Manager", "UX Designer", "Frontend Developer"];

export const skills: SkillLevel[] = [
  { skill: "SQL", current: 45, required: 85, category: "Technical" },
  { skill: "Excel", current: 80, required: 80, category: "Technical" },
  { skill: "Python", current: 25, required: 70, category: "Technical" },
  { skill: "Statistics", current: 35, required: 75, category: "Analytical" },
  { skill: "Data Viz", current: 50, required: 80, category: "Analytical" },
  { skill: "Communication", current: 90, required: 75, category: "Soft" },
  { skill: "Problem Solving", current: 75, required: 80, category: "Soft" },
];

export const progressHistory = [
  { week: "W1", score: 42 }, { week: "W2", score: 46 }, { week: "W3", score: 49 },
  { week: "W4", score: 53 }, { week: "W5", score: 55 }, { week: "W6", score: 61 },
  { week: "W7", score: 64 }, { week: "W8", score: 68 },
];

export const roadmap: RoadmapPhase[] = [
  { id: "p1", title: "Foundations", weeks: "Weeks 1–3", tasks: [
    { id: "t1", title: "SQL basics: SELECT, JOIN, GROUP BY", resource: "Mode SQL Tutorial", hours: 8, done: true },
    { id: "t2", title: "Descriptive statistics refresher", resource: "Khan Academy", hours: 6, done: true },
    { id: "t3", title: "Advanced Excel: pivots & lookups", resource: "ExcelJet", hours: 4, done: false },
  ]},
  { id: "p2", title: "Core analytics", weeks: "Weeks 4–7", tasks: [
    { id: "t4", title: "Python + pandas fundamentals", resource: "Kaggle Learn", hours: 12, done: false },
    { id: "t5", title: "Window functions & CTEs in SQL", resource: "PostgreSQL docs", hours: 6, done: false },
    { id: "t6", title: "Dashboards in Tableau or Power BI", resource: "Tableau Public", hours: 10, done: false },
  ]},
  { id: "p3", title: "Portfolio & job ready", weeks: "Weeks 8–12", tasks: [
    { id: "t7", title: "Build a support-ticket analysis project", resource: "Personal project", hours: 15, done: false },
    { id: "t8", title: "Publish portfolio on GitHub", resource: "GitHub Pages", hours: 4, done: false },
    { id: "t9", title: "Mock case interviews", resource: "Peer practice", hours: 6, done: false },
  ]},
];

export const applications: JobApplication[] = [
  { id: "a1", company: "Razorpay", role: "Junior Data Analyst", location: "Bengaluru", status: "Interview", appliedOn: "2026-11-02", salary: "₹9–12 LPA" },
  { id: "a2", company: "Swiggy", role: "Business Analyst", location: "Bengaluru", status: "Applied", appliedOn: "2026-11-10" },
  { id: "a3", company: "Freshworks", role: "Support Data Analyst", location: "Chennai", status: "Offer", appliedOn: "2026-10-18", salary: "₹10 LPA" },
  { id: "a4", company: "Zomato", role: "Analyst, Ops", location: "Gurugram", status: "Rejected", appliedOn: "2026-10-05" },
  { id: "a5", company: "CRED", role: "Data Analyst", location: "Remote", status: "Assessment", appliedOn: "2026-11-15", notes: "Complete the take-home SQL assessment.", jobUrl: "https://careers.cred.club/" },
  { id: "a6", company: "Meesho", role: "Product Analyst", location: "Bengaluru", status: "Applied", appliedOn: "2026-11-12" },
];

export const notifications: Notification[] = [
  { id: "n1", title: "Razorpay interview scheduled for Nov 25", time: "2h ago", read: false },
  { id: "n2", title: "You completed 2 roadmap tasks this week", time: "1d ago", read: false },
  { id: "n3", title: "New skill gap report available", time: "3d ago", read: true },
];

export const applicationStatuses = ["Applied", "Assessment", "Interview", "Offer", "Rejected"] as const;

export const demoBackground: CareerBackground = { education: "B.Com, Bangalore University", experience: "3 years in customer support", technicalSkills: "Excel, SQL basics", softSkills: "Communication, problem solving", industry: "Technology", timeline: "3 months", studyHours: 8, learningFormat: "Mixed" };
export const projects: PortfolioProject[] = [
  { id: "support", title: "Support ticket insights", description: "Investigate resolution times, recurring issues and customer satisfaction using a sample support dataset.", technologies: ["SQL", "Python", "pandas"], difficulty: "Beginner", duration: "2 weeks · 15 hours", skills: ["SQL", "Data cleaning", "Statistics"], deliverables: ["Cleaned dataset and documented queries", "Notebook with five business insights", "README with actionable recommendations"] },
  { id: "sales", title: "Sales performance dashboard", description: "Turn a sample retail dataset into a dashboard that explains revenue, regional performance and growth.", technologies: ["Excel", "Power BI"], difficulty: "Beginner", duration: "1 week · 10 hours", skills: ["Data Viz", "Excel", "Communication"], deliverables: ["Interactive dashboard", "KPI definitions and data dictionary", "One-page stakeholder summary"] },
  { id: "retention", title: "Customer retention study", description: "Explore churn patterns and compare customer cohorts to propose a measurable retention strategy.", technologies: ["Python", "pandas", "SQL"], difficulty: "Intermediate", duration: "3 weeks · 20 hours", skills: ["Statistics", "Python", "Problem Solving"], deliverables: ["Reproducible cohort analysis", "Retention charts", "Experiment proposal with success metrics"] },
];

export const weeklyPlans: WeeklyPlan[] = [
  { week: 1, taskId: "t1", topic: "SQL foundations", objective: "Retrieve and aggregate business data.", exercise: "Write SELECT, JOIN and GROUP BY queries on a retail dataset.", project: "Create a weekly sales summary.", hours: 4, resource: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/" },
  { week: 2, taskId: "t2", topic: "Descriptive statistics", objective: "Interpret distributions and summary metrics.", exercise: "Calculate mean, median and variance for ticket response times.", project: "Write a customer satisfaction insight brief.", hours: 6, resource: "Khan Academy", url: "https://www.khanacademy.org/math/statistics-probability" },
  { week: 3, taskId: "t3", topic: "Advanced Excel", objective: "Summarise data with pivots and lookups.", exercise: "Build a pivot table and XLOOKUP model.", project: "Create an operations reporting workbook.", hours: 4, resource: "ExcelJet", url: "https://exceljet.net/" },
  { week: 4, taskId: "t4", topic: "Python basics", objective: "Use functions, lists and dictionaries.", exercise: "Load CSV rows and compute totals.", project: "Build a small reporting script.", hours: 6, resource: "Kaggle Learn", url: "https://www.kaggle.com/learn/python" },
  { week: 5, taskId: "t4", topic: "pandas and cleaning", objective: "Prepare messy data for analysis.", exercise: "Handle missing values and duplicates.", project: "Publish a data quality notebook.", hours: 6, resource: "Kaggle pandas", url: "https://www.kaggle.com/learn/pandas" },
  { week: 6, taskId: "t5", topic: "Advanced SQL", objective: "Apply window functions and CTEs.", exercise: "Rank products and compute rolling averages.", project: "Build a cohort query report.", hours: 6, resource: "PostgreSQL tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" },
  { week: 7, taskId: "t6", topic: "Dashboard design", objective: "Communicate KPIs visually.", exercise: "Create three charts and a filterable dashboard.", project: "Sales performance dashboard.", hours: 10, resource: "Tableau Public", url: "https://public.tableau.com/" },
  { week: 8, taskId: "t7", topic: "Project scoping", objective: "Frame a useful business question.", exercise: "Define support metrics and a data dictionary.", project: "Support ticket insights: scope and clean.", hours: 5, resource: "Kaggle datasets", url: "https://www.kaggle.com/datasets" },
  { week: 9, taskId: "t7", topic: "Exploratory analysis", objective: "Discover trends and root causes.", exercise: "Compare ticket segments and response times.", project: "Support ticket insights: analyse.", hours: 5, resource: "pandas guide", url: "https://pandas.pydata.org/docs/user_guide/" },
  { week: 10, taskId: "t7", topic: "Business storytelling", objective: "Translate findings into recommendations.", exercise: "Present five insights with supporting charts.", project: "Support ticket insights: deliver.", hours: 5, resource: "Storytelling with data", url: "https://www.storytellingwithdata.com/blog" },
  { week: 11, taskId: "t8", topic: "Portfolio publishing", objective: "Make your work reproducible and accessible.", exercise: "Document setup, methods and limitations.", project: "Publish your portfolio and README.", hours: 4, resource: "GitHub Pages", url: "https://docs.github.com/en/pages" },
  { week: 12, taskId: "t9", topic: "Interview preparation", objective: "Explain decisions and solve analytical cases.", exercise: "Practice two SQL interviews and one business case.", project: "Record a five-minute project walkthrough.", hours: 6, resource: "SQL practice", url: "https://www.hackerrank.com/domains/sql" },
];

export const skillExplanations: Record<string, string> = { SQL: "Query and combine business data accurately.", Excel: "Validate data and deliver lightweight reports.", Python: "Automate cleaning and repeatable analysis.", Statistics: "Interpret uncertainty and avoid misleading conclusions.", "Data Viz": "Make trends accessible to decision-makers.", Communication: "Explain findings to non-technical stakeholders.", "Problem Solving": "Translate ambiguous questions into measurable analyses." };
export const roleSkillProfiles: Record<string, SkillLevel[]> = {
  "Data Analyst": skills,
  "Product Manager": [{ skill: "Product Strategy", current: 30, required: 85, category: "Analytical" }, { skill: "User Research", current: 40, required: 80, category: "Analytical" }, { skill: "SQL", current: 45, required: 60, category: "Technical" }, { skill: "Communication", current: 90, required: 85, category: "Soft" }],
  "UX Designer": [{ skill: "Figma", current: 20, required: 85, category: "Technical" }, { skill: "User Research", current: 40, required: 85, category: "Analytical" }, { skill: "Prototyping", current: 25, required: 80, category: "Technical" }, { skill: "Communication", current: 90, required: 80, category: "Soft" }],
  "Frontend Developer": [{ skill: "JavaScript", current: 25, required: 85, category: "Technical" }, { skill: "React", current: 15, required: 80, category: "Technical" }, { skill: "HTML / CSS", current: 40, required: 85, category: "Technical" }, { skill: "Problem Solving", current: 75, required: 80, category: "Soft" }],
};
