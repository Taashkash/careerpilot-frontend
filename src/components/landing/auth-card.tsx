import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "./logo";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isValidEmail, validateAccount } from "@/lib/demo-rules";

const safeRedirect = (path: string | undefined) => (path && path.startsWith("/") && !path.startsWith("//") ? path : undefined);

export function AuthCard({ mode, redirectTo }: { mode: "login" | "signup" | "forgot" | "reset"; redirectTo?: string | undefined }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const signup = mode === "signup";
  const forgot = mode === "forgot";
  const reset = mode === "reset";

  // Signed-in visitors skip the login and signup screens.
  useEffect(() => {
    if (mode !== "login" && mode !== "signup") return;
    supabase.auth.getSession().then(({ data }) => { if (data.session) navigate({ to: "/dashboard", replace: true }); });
  }, [mode, navigate]);

  const goAfterLogin = async (userId: string) => {
    const { data } = await supabase.from("profiles").select("onboarded").eq("user_id", userId).maybeSingle();
    await queryClient.invalidateQueries();
    const target = safeRedirect(redirectTo);
    if (!data?.onboarded) navigate({ to: "/onboarding" });
    else if (target) navigate({ href: target });
    else navigate({ to: "/dashboard" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = forgot ? (isValidEmail(form.email) ? "" : "Please enter a valid email address.") : reset ? (form.password.length >= 8 ? "" : "Use at least 8 characters.") : validateAccount(form.name, form.email, form.password, signup);
    setError(message);
    if (message) return;
    setBusy(true);
    try {
      const email = form.email.trim();
      if (forgot) {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (err) throw err;
        setSubmitted(true);
      } else if (reset) {
        const { data } = await supabase.auth.getSession();
        if (!data.session) throw new Error("This reset link is invalid or has expired. Request a new one.");
        const { error: err } = await supabase.auth.updateUser({ password: form.password });
        if (err) throw err;
        setSubmitted(true);
      } else if (signup) {
        const { data, error: err } = await supabase.auth.signUp({ email, password: form.password, options: { emailRedirectTo: `${window.location.origin}/login`, data: { full_name: form.name.trim() } } });
        if (err) throw err;
        if (data.session && data.user) { toast.success("Welcome to CareerPilot AI!"); await goAfterLogin(data.user.id); }
        else setSubmitted(true);
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password: form.password });
        if (err) throw new Error(err.message === "Invalid login credentials" ? "Incorrect email or password." : err.message);
        await goAfterLogin(data.user.id);
      }
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  const field = (k: keyof typeof form, label: string, type = "text"): ReactNode => (
    <div className="space-y-1.5"><Label htmlFor={k}>{label}</Label>
      <div className="relative"><Input id={k} type={k === "password" && visible ? "text" : type} autoComplete={k === "password" ? (signup || reset ? "new-password" : "current-password") : k === "email" ? "email" : "name"} className={k === "password" ? "pr-12" : ""} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
      {k === "password" && <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0" aria-label={visible ? "Hide password" : "Show password"} title={visible ? "Hide password" : "Show password"} onClick={() => setVisible(!visible)}>{visible ? <EyeOff /> : <Eye />}</Button>}</div></div>
  );
  const doneText = forgot ? "If an account exists for that email, a password reset link is on its way. Check your inbox." : reset ? "Your password has been updated." : "Check your inbox and click the confirmation link to activate your account, then log in.";
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="card-surface p-6">
           <h1 className="text-xl font-semibold">{forgot ? "Forgot password" : reset ? "Reset password" : signup ? "Create your account" : "Welcome back"}</h1>
           <p className="mt-2 text-xs text-muted-foreground">{forgot ? "Enter your email and we'll send you a reset link." : reset ? "Choose a new password for your account." : signup ? "Your profile, plan and applications are saved securely to your account." : "Log in to continue your career plan."}</p>
           {submitted ? <div className="mt-6 space-y-4" role="status"><p className="text-sm">{doneText}</p><Button asChild className="w-full"><Link to={reset ? "/dashboard" : "/login"}>{reset ? "Go to dashboard" : "Back to login"}</Link></Button></div> : <form noValidate onSubmit={submit} className="mt-6 space-y-4">
            {signup && field("name", "Full name")}
             {!reset && field("email", "Email", "email")}
             {!forgot && field("password", reset ? "New password" : "Password", "password")}
             {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
             {mode === "login" && <Link to="/forgot-password" className="block text-sm text-primary">Forgot password?</Link>}
             <Button type="submit" className="w-full" disabled={busy}>{busy ? "Please wait…" : forgot ? "Send reset link" : reset ? "Update password" : signup ? "Get Started" : "Log In"}</Button>
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
