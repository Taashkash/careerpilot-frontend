CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  current_position text NOT NULL DEFAULT '',
  target_role text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  education text NOT NULL DEFAULT '',
  experience text NOT NULL DEFAULT '',
  technical_skills text NOT NULL DEFAULT '',
  soft_skills text NOT NULL DEFAULT '',
  industry text NOT NULL DEFAULT '',
  timeline text NOT NULL DEFAULT '3 months',
  study_hours integer NOT NULL DEFAULT 8 CHECK (study_hours BETWEEN 1 AND 40),
  learning_format text NOT NULL DEFAULT 'Mixed',
  notify_weekly boolean NOT NULL DEFAULT true,
  notify_interview boolean NOT NULL DEFAULT true,
  notify_tips boolean NOT NULL DEFAULT false,
  onboarded boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- TARGET ROLES (catalog)
CREATE TABLE public.target_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.target_roles TO authenticated;
GRANT ALL ON public.target_roles TO service_role;
ALTER TABLE public.target_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users read target roles" ON public.target_roles FOR SELECT TO authenticated USING (true);
INSERT INTO public.target_roles (name, description, position) VALUES
  ('Data Analyst', 'Turn business data into decisions with SQL, Python and dashboards.', 1),
  ('Product Manager', 'Shape product strategy, research users and prioritise roadmaps.', 2),
  ('UX Designer', 'Research, prototype and design usable digital experiences.', 3),
  ('Frontend Developer', 'Build accessible web interfaces with JavaScript and React.', 4);

-- RESUMES
CREATE TABLE public.resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  size_bytes integer NOT NULL DEFAULT 0,
  mime_type text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resumes TO authenticated;
GRANT ALL ON public.resumes TO service_role;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own resume" ON public.resumes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add own resume" ON public.resumes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own resume" ON public.resumes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own resume" ON public.resumes FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER resumes_updated_at BEFORE UPDATE ON public.resumes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SKILL ANALYSES + GAPS
CREATE TABLE public.skill_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  target_role text NOT NULL,
  job_description text NOT NULL DEFAULT '',
  readiness integer NOT NULL DEFAULT 0 CHECK (readiness BETWEEN 0 AND 100),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX skill_analyses_user_created_idx ON public.skill_analyses (user_id, created_at DESC);
GRANT SELECT, INSERT, DELETE ON public.skill_analyses TO authenticated;
GRANT ALL ON public.skill_analyses TO service_role;
ALTER TABLE public.skill_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own analyses" ON public.skill_analyses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add own analyses" ON public.skill_analyses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own analyses" ON public.skill_analyses FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.skill_gaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid NOT NULL REFERENCES public.skill_analyses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  skill text NOT NULL,
  category text NOT NULL DEFAULT 'Technical',
  current_level integer NOT NULL CHECK (current_level BETWEEN 0 AND 100),
  required_level integer NOT NULL CHECK (required_level BETWEEN 1 AND 100),
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX skill_gaps_analysis_idx ON public.skill_gaps (analysis_id);
GRANT SELECT, INSERT, DELETE ON public.skill_gaps TO authenticated;
GRANT ALL ON public.skill_gaps TO service_role;
ALTER TABLE public.skill_gaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own skill gaps" ON public.skill_gaps FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add own skill gaps" ON public.skill_gaps FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.skill_analyses a WHERE a.id = analysis_id AND a.user_id = auth.uid()));
CREATE POLICY "Users delete own skill gaps" ON public.skill_gaps FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- LEARNING PLAN WEEKS
CREATE TABLE public.learning_plan_weeks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  week integer NOT NULL CHECK (week BETWEEN 1 AND 52),
  task_key text NOT NULL DEFAULT '',
  topic text NOT NULL,
  objective text NOT NULL DEFAULT '',
  exercise text NOT NULL DEFAULT '',
  project text NOT NULL DEFAULT '',
  hours integer NOT NULL DEFAULT 0,
  resource text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '',
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, week)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_plan_weeks TO authenticated;
GRANT ALL ON public.learning_plan_weeks TO service_role;
ALTER TABLE public.learning_plan_weeks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own plan weeks" ON public.learning_plan_weeks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add own plan weeks" ON public.learning_plan_weeks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own plan weeks" ON public.learning_plan_weeks FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own plan weeks" ON public.learning_plan_weeks FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER learning_plan_weeks_updated_at BEFORE UPDATE ON public.learning_plan_weeks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ROADMAP TASKS
CREATE TABLE public.roadmap_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  task_key text NOT NULL,
  phase_key text NOT NULL,
  phase_title text NOT NULL,
  phase_weeks text NOT NULL DEFAULT '',
  phase_position integer NOT NULL DEFAULT 0,
  position integer NOT NULL DEFAULT 0,
  title text NOT NULL,
  resource text NOT NULL DEFAULT '',
  hours integer NOT NULL DEFAULT 0,
  done boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, task_key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.roadmap_tasks TO authenticated;
GRANT ALL ON public.roadmap_tasks TO service_role;
ALTER TABLE public.roadmap_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own roadmap tasks" ON public.roadmap_tasks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add own roadmap tasks" ON public.roadmap_tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own roadmap tasks" ON public.roadmap_tasks FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own roadmap tasks" ON public.roadmap_tasks FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER roadmap_tasks_updated_at BEFORE UPDATE ON public.roadmap_tasks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PORTFOLIO PROJECTS (catalog)
CREATE TABLE public.portfolio_projects (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  technologies text[] NOT NULL DEFAULT '{}',
  difficulty text NOT NULL DEFAULT 'Beginner' CHECK (difficulty IN ('Beginner', 'Intermediate')),
  duration text NOT NULL DEFAULT '',
  skills text[] NOT NULL DEFAULT '{}',
  deliverables text[] NOT NULL DEFAULT '{}',
  target_role text NOT NULL DEFAULT 'Data Analyst',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_projects TO authenticated;
GRANT ALL ON public.portfolio_projects TO service_role;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users read projects" ON public.portfolio_projects FOR SELECT TO authenticated USING (true);
INSERT INTO public.portfolio_projects (id, title, description, technologies, difficulty, duration, skills, deliverables, target_role, position) VALUES
  ('support', 'Support ticket insights', 'Investigate resolution times, recurring issues and customer satisfaction using a sample support dataset.', ARRAY['SQL','Python','pandas'], 'Beginner', '2 weeks · 15 hours', ARRAY['SQL','Data cleaning','Statistics'], ARRAY['Cleaned dataset and documented queries','Notebook with five business insights','README with actionable recommendations'], 'Data Analyst', 1),
  ('sales', 'Sales performance dashboard', 'Turn a sample retail dataset into a dashboard that explains revenue, regional performance and growth.', ARRAY['Excel','Power BI'], 'Beginner', '1 week · 10 hours', ARRAY['Data Viz','Excel','Communication'], ARRAY['Interactive dashboard','KPI definitions and data dictionary','One-page stakeholder summary'], 'Data Analyst', 2),
  ('retention', 'Customer retention study', 'Explore churn patterns and compare customer cohorts to propose a measurable retention strategy.', ARRAY['Python','pandas','SQL'], 'Intermediate', '3 weeks · 20 hours', ARRAY['Statistics','Python','Problem Solving'], ARRAY['Reproducible cohort analysis','Retention charts','Experiment proposal with success metrics'], 'Data Analyst', 3);

-- USER PROJECTS
CREATE TABLE public.user_projects (
  user_id uuid NOT NULL,
  project_id text NOT NULL REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  saved boolean NOT NULL DEFAULT false,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, project_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_projects TO authenticated;
GRANT ALL ON public.user_projects TO service_role;
ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own project progress" ON public.user_projects FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add own project progress" ON public.user_projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own project progress" ON public.user_projects FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own project progress" ON public.user_projects FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER user_projects_updated_at BEFORE UPDATE ON public.user_projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- JOB APPLICATIONS
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  company text NOT NULL CHECK (length(trim(company)) > 0),
  role text NOT NULL CHECK (length(trim(role)) > 0),
  location text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied','Assessment','Interview','Offer','Rejected')),
  applied_on date NOT NULL DEFAULT current_date,
  salary text,
  job_url text,
  interview_on timestamp,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX job_applications_user_idx ON public.job_applications (user_id, applied_on DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own applications" ON public.job_applications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add own applications" ON public.job_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own applications" ON public.job_applications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own applications" ON public.job_applications FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER job_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON public.notifications (user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add own notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own notifications" ON public.notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Interview notification trigger
CREATE OR REPLACE FUNCTION public.notify_interview_scheduled()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.interview_on IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.interview_on IS DISTINCT FROM NEW.interview_on) THEN
    INSERT INTO public.notifications (user_id, title)
    VALUES (NEW.user_id, NEW.company || ' interview scheduled for ' || to_char(NEW.interview_on, 'Mon FMDD, HH24:MI'));
  END IF;
  RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.notify_interview_scheduled() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER job_applications_interview_notice AFTER INSERT OR UPDATE OF interview_on ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.notify_interview_scheduled();

-- New user signup: profile + welcome notification
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, coalesce(NEW.raw_user_meta_data ->> 'full_name', ''))
  ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.notifications (user_id, title)
  VALUES (NEW.id, 'Welcome to CareerPilot AI. Set your career goals to get started.');
  RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles for any accounts that already exist
INSERT INTO public.profiles (user_id, full_name)
SELECT id, coalesce(raw_user_meta_data ->> 'full_name', '') FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- RESUME FILE STORAGE POLICIES (bucket: resumes, folder per user)
CREATE POLICY "Users read own resume files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users upload own resume files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users update own resume files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own resume files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);