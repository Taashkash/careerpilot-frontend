import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/landing/auth-card";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — CareerPilot AI" },
      { name: "description", content: "Sign Up to CareerPilot AI, your AI career pivot coach." },
      { property: "og:title", content: "Sign Up — CareerPilot AI" },
      { property: "og:description", content: "Sign Up to CareerPilot AI, your AI career pivot coach." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <AuthCard key="signup" mode="signup" />,
});
