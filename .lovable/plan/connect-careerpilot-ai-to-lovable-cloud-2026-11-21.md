# Connect CareerPilot AI to Lovable Cloud

## What exists today

**Pages (all kept as-is):** Landing `/`, Log in, Sign up, Forgot password, Reset password, Career Goals (onboarding), Overview (dashboard), Skill Analysis, Learning Roadmap, Portfolio Projects, Applications, Profile, Settings. Shared pieces: sidebar + top bar (notifications, account menu), CareerFields, ResumeUpload, LearningPreferences.

**Forms and inputs:**
- Sign up (name, email, password), Log in, Forgot password (email), Reset password (new password)
- Career Goals: name, current role, target role, education, experience, technical/soft skills, industry, timeline, resume
- Profile: same fields plus email, location, bio; resume; weekly study hours, learning format
- Skill Analysis: resume, target role, job description
- Roadmap: week checkboxes, phase task checkboxes, "Reset sample plan"
- Projects: save / mark complete
- Applications: add/edit dialog (company, role, location, dates, URL, notes, status), status change, delete, search/filter
- Settings: 3 notification switches, password change, log out, reset data

**Authentication:** simulated only. No account is created; logout just resets memory.

**Mock data:** sample user "Aarav Mehta", 6 sample applications, notifications, readiness history chart, skill presets per role, 3 roadmap phases, 12 weekly plans, 3 portfolio projects. Everything lives in memory and resets on refresh.

**Backend already configured:** Lovable Cloud is switched on and the app's connection to it is wired, but there are **no tables, no storage, and no sign-in enabled yet**. Nothing conflicts with Lovable Cloud, so nothing will be duplicated.

## What I will build (incrementally, verifying each step)

1. **Real accounts** - Sign up, log in, log out, forgot/reset password using email + password on the existing screens. New accounts confirm their email first (the screen will say "check your inbox"). All app pages require sign-in; signed-out visitors go to Log in. Same URLs, same layout.
2. **Profile & career goals** - Career Goals, Profile and Settings save to your account and load on every visit. Top bar and dashboard show your real name and email.
3. **Resumes** - Resume upload stores the file privately (PDF/DOCX, 5 MB), visible only to its owner; you can replace or remove it.
4. **Skill gaps** - "Run analysis" saves the result (target role, job description, skill scores) to your account. Scores still come from the existing role presets (no real AI yet), but they persist and drive the dashboard.
5. **Learning plan & progress** - Your 12-week plan and phase tasks are created for your account; checkboxes save permanently. "Reset sample plan" restores it.
6. **Portfolio projects** - Project list comes from the database; saved/completed status is stored per user.
7. **Applications** - Add, edit, status change, delete and search all save to your account.
8. **Dashboard** - Readiness, weekly growth, tasks done, active applications, readiness-over-time chart, upcoming tasks, recent activity and notifications all come from your real data. New accounts start empty (no sample Aarav data) with friendly empty states in the existing card style.
9. **Security** - Every table has Row Level Security: people can only see and change their own data. Shared catalogs (target roles, portfolio projects) are read-only for signed-in users.

Only wording that says "demo / simulated / resets on refresh" changes, because it would no longer be true. Design, colors, layout and navigation stay identical.

## Technical details

Tables (all user tables keyed by `user_id = auth.uid()`, GRANTs + RLS select/insert/update/delete own rows):
- `profiles` - name, current_role, target_role, location, bio, education, experience, technical_skills, soft_skills, industry, timeline, study_hours, learning_format, notification prefs, onboarded. Auto-created by signup trigger (name from signup metadata).
- `target_roles` - catalog (name, description), seeded with the 4 roles; authenticated read.
- `resumes` - one per user (file_name, storage_path, size, mime). Private `resumes` storage bucket, folder-per-user policies.
- `skill_analyses` (target_role, job_description, readiness) + `skill_gaps` (analysis_id, skill, category, current_level, required_level); latest analysis drives UI; analyses double as readiness history.
- `learning_plan_weeks` (week, topic, objective, exercise, project, hours, resource, url, completed) and `roadmap_tasks` (phase info, title, resource, hours, done) - copied from the plan template when the user first opens roadmap/dashboard or resets.
- `portfolio_projects` catalog (seeded with the 3 projects) + `user_projects` (saved, completed).
- `job_applications` (company, role, location, status check, applied_on, salary, job_url, interview_on, notes).
- `notifications` (title, read) - welcome notice on signup; trigger adds "interview scheduled" when an interview date is set.

Code:
- Routes move under the managed `_authenticated` layout (URLs unchanged); `__root` gets the auth listener.
- `DemoProvider` replaced by React Query hooks in `src/lib/api/` using the browser client with RLS; pages swap `useDemo()` for those hooks with no markup changes beyond empty states and copy.
- `src/lib/demo-rules.ts` keeps pure logic (readiness, filtering, validation); presets stay in `demo-data.ts` as plan/analysis templates.
- Tests updated: routing ids, validation, readiness math; old in-memory demo tests removed. End-to-end check with a signed-in test user (sign up/in, save profile, add application, tick a week, reload and confirm it persisted).
