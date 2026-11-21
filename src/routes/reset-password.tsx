import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/landing/auth-card";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/reset-password")({ head: () => pageHead("Reset password", "Preview setting a new password in the CareerPilot frontend demo."), component: () => <AuthCard key="reset" mode="reset" /> });