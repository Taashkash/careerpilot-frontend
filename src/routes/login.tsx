import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/landing/auth-card";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => (typeof search["redirect"] === "string" ? { redirect: search["redirect"] } : {}),
  head: () => ({
    meta: [
      { title: "Log In — CareerPilot AI" },
      { name: "description", content: "Log In to CareerPilot AI, your AI career pivot coach." },
      { property: "og:title", content: "Log In — CareerPilot AI" },
      { property: "og:description", content: "Log In to CareerPilot AI, your AI career pivot coach." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const { redirect } = Route.useSearch();
  return <AuthCard key="login" mode="login" redirectTo={redirect} />;
}
