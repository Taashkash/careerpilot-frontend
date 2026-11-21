import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Briefcase, Compass, Layers, LayoutDashboard, Map, Menu, Radar, Search, Sparkles, UserPlus, X, ListChecks, FolderKanban, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { sessionQuery } from "@/lib/api/queries";
import { Logo } from "@/components/landing/logo";
import { DashboardPreview } from "@/components/landing/dashboard-preview";

const desc = "CareerPilot AI is your AI-powered career pivot coach: find your skill gaps, follow a personalized learning roadmap and track every job application.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerPilot AI — Your AI career pivot coach" },
      { name: "description", content: desc },
      { property: "og:title", content: "CareerPilot AI — Your AI career pivot coach" },
      { property: "og:description", content: desc },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const navLinks = [{ href: "#features", label: "Features" }, { href: "#how-it-works", label: "How It Works" }, { href: "#about", label: "About" }];

const problems = [
  { icon: HelpCircle, title: "Unclear expectations", text: "You don't know which skills employers actually expect for the role you want." },
  { icon: Layers, title: "Resource overload", text: "Thousands of courses and tutorials, and no idea where to start or what to skip." },
  { icon: FolderKanban, title: "No project direction", text: "You're unsure which portfolio projects will prove you're ready." },
  { icon: ListChecks, title: "Scattered applications", text: "Applications live in spreadsheets, inboxes and memory — and slip through the cracks." },
];

const features = [
  { icon: LayoutDashboard, title: "Career Dashboard", text: "See your readiness score, progress and next steps at a glance." },
  { icon: Radar, title: "AI Skill Gap Analysis", text: "Compare your current skills with what your target role requires." },
  { icon: Map, title: "Personalized Learning Roadmap", text: "A week-by-week plan with resources and projects tailored to you." },
  { icon: Briefcase, title: "Application Tracker", text: "Track every application from wishlist to offer in one pipeline." },
];

const steps = [
  { icon: UserPlus, title: "Create your profile", text: "Tell us your background, experience and current skills." },
  { icon: Compass, title: "Select your target role", text: "Choose the career you want to move into." },
  { icon: Search, title: "Analyze your skill gaps", text: "See exactly where you stand and what to learn next." },
  { icon: BarChart3, title: "Follow & track", text: "Work through your roadmap and track applications as you go." },
];

function Landing() {
  const [open, setOpen] = useState(false);
  const { data: sessionUser } = useQuery(sessionQuery);
  const signedIn = !!sessionUser;
  return (
    <div className="min-h-screen bg-card">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4 md:px-6">
          <Logo />
          <nav className="hidden gap-6 md:flex">
            {navLinks.map((l) => <a key={l.href} href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{l.label}</a>)}
          </nav>
          <div className="ml-auto hidden items-center gap-2 md:flex">
            {signedIn ? <Button asChild><Link to="/dashboard">Go to dashboard</Link></Button> : <>
            <Button variant="ghost" asChild><Link to="/login">Log In</Link></Button>
            <Button asChild><Link to="/signup">Get Started</Link></Button></>}
          </div>
          <Button variant="ghost" size="icon" className="ml-auto md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        {open && (
          <div className="border-t px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              {navLinks.map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm">{l.label}</a>)}
            </nav>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {signedIn ? <Button asChild className="col-span-2"><Link to="/dashboard">Go to dashboard</Link></Button> : <>
              <Button variant="outline" asChild><Link to="/login">Log In</Link></Button>
              <Button asChild><Link to="/signup">Get Started</Link></Button></>}
            </div>
          </div>
        )}
      </header>

      <section className="bg-hero">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-2">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> AI-powered career pivot coach
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Your Career. Your Roadmap. <span className="text-gradient-brand">Your Next Move.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">Discover the skills you need, build a personalized learning roadmap, and take control of your career journey.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild><Link to="/signup">Get Started <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button size="lg" variant="outline" asChild><a href="#features">Explore Features</a></Button>
            </div>
          </div>
          <div className="animate-rise [animation-delay:150ms]"><DashboardPreview /></div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionHead eyebrow="The problem" title="Changing careers shouldn't feel like guesswork" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((p) => (
              <div key={p.title} className="card-surface lift p-6">
                <p.icon className="h-5 w-5 text-destructive" />
                <h3 className="mt-4 font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-16 py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionHead eyebrow="Features" title="Everything you need to make your next move" />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {features.map((f, i) => (
              <div key={f.title} className="card-surface lift group flex gap-5 p-6">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${i % 2 ? "bg-success-soft text-success" : "bg-primary-soft text-primary"}`}>
                  <f.icon className="h-5 w-5" />
                </span>
                <div><h3 className="font-semibold">{f.title}</h3><p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-16 bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionHead eyebrow="How it works" title="Four steps from where you are to where you want to be" />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{i + 1}</span>
                  {i < steps.length - 1 && <span className="hidden h-px flex-1 bg-border lg:block" />}
                </div>
                <s.icon className="mt-5 h-5 w-5 text-success" />
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="about" className="scroll-mt-16 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-primary">Why CareerPilot</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">One place for your entire career pivot</h2>
            <p className="mt-4 text-muted-foreground">Most career changers juggle a job board, a dozen course tabs, a to-do app and a spreadsheet. CareerPilot AI brings career planning, skill development and application tracking together, so every hour you spend learning moves you closer to the role you want.</p>
          </div>
          <div className="grid gap-3">
            {[["Plan", "Know your target role and exactly what it takes."], ["Grow", "Learn with a focused roadmap instead of random courses."], ["Land", "Apply strategically and never lose track of an opportunity."]].map(([t, d]) => (
              <div key={t} className="card-surface lift flex items-center gap-4 p-5">
                <span className="text-gradient-brand text-2xl font-bold">{t}</span>
                <p className="text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 md:px-6">
        <div className="mx-auto max-w-6xl rounded-3xl bg-sidebar px-6 py-16 text-center text-sidebar-foreground">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Stop guessing. Start growing.</h2>
          <p className="mx-auto mt-3 max-w-md text-sidebar-muted">Get a clear plan for your next career move in minutes.</p>
          <Button size="lg" className="mt-8" asChild><Link to="/signup">Build My Career Roadmap <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
      </section>

      <footer className="border-t bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
          <Logo />
          <nav className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            {navLinks.map((l) => <a key={l.href} href={l.href} className="hover:text-foreground">{l.label}</a>)}
            <Link to="/login" className="hover:text-foreground">Log In</Link>
            <Link to="/signup" className="hover:text-foreground">Sign Up</Link>
          </nav>
          <p className="text-sm text-muted-foreground">© 2026 CareerPilot AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}
