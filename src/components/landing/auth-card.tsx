import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "./logo";
import { Eye, EyeOff } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { validateDemoAccount } from "@/lib/demo-rules";

// Frontend demonstration only. No credentials are sent or stored.
export function AuthCard({ mode }: { mode: "login" | "signup" | "forgot" | "reset" }) {
  const navigate = useNavigate();
  const { profile, setProfile, setDemoSignedIn } = useDemo();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const signup = mode === "signup";
  const forgot = mode === "forgot";
  const reset = mode === "reset";
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = forgot ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "" : "Please enter a valid email address.") : reset ? (form.password.length >= 8 ? "" : "Use at least 8 characters.") : validateDemoAccount(form.name, form.email, form.password, signup);
    setError(message);
    if (message) return;
    if (forgot || reset) { setSubmitted(true); setForm({ name: "", email: "", password: "" }); return; }
    setProfile({ ...profile, name: signup ? form.name.trim() : profile.name, email: form.email });
    setDemoSignedIn(true);
    setForm({ name: "", email: "", password: "" });
    toast.info("Demo session opened. No real account was created.");
    navigate({ to: signup ? "/onboarding" : "/dashboard" });
  };
  const field = (k: keyof typeof form, label: string, type = "text"): ReactNode => (
    <div className="space-y-1.5"><Label htmlFor={k}>{label}</Label>
      <div className="relative"><Input id={k} type={k === "password" && visible ? "text" : type} autoComplete={k === "password" ? "off" : k === "email" ? "email" : "name"} className={k === "password" ? "pr-12" : ""} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
      {k === "password" && <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0" aria-label={visible ? "Hide password" : "Show password"} title={visible ? "Hide password" : "Show password"} onClick={() => setVisible(!visible)}>{visible ? <EyeOff /> : <Eye />}</Button>}</div></div>
  );
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="card-surface p-6">
           <h1 className="text-xl font-semibold">{forgot ? "Forgot password" : reset ? "Reset password" : signup ? "Create your account" : "Welcome back"}</h1>
           <p className="mt-2 text-xs text-muted-foreground">Frontend demo only. No real account, password storage, or email delivery. Changes reset on refresh.</p>
           {submitted ? <div className="mt-6 space-y-4" role="status"><p className="text-sm">{forgot ? "Reset request simulated. No email was sent." : "Password reset simulated. No real password was changed."}</p><Button asChild className="w-full"><Link to={forgot ? "/reset-password" : "/login"}>{forgot ? "Preview password reset" : "Back to login"}</Link></Button></div> : <form noValidate onSubmit={submit} className="mt-6 space-y-4">
            {signup && field("name", "Full name")}
             {!reset && field("email", "Email", "email")}
             {!forgot && field("password", "Password", "password")}
             {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
             {mode === "login" && <Link to="/forgot-password" className="block text-sm text-primary">Forgot password?</Link>}
             <Button type="submit" className="w-full">{forgot ? "Simulate reset request" : reset ? "Preview new password" : signup ? "Get Started" : "Log In"}</Button>
           </form>}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {signup ? "Already have an account? " : "New to CareerPilot? "}
          {signup ? <Link to="/login" className="font-medium text-primary">Log in</Link> : <Link to="/signup" className="font-medium text-primary">Sign up</Link>}
        </p>
      </div>
    </div>
  );
}
