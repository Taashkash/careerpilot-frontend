import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/landing/auth-card";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/forgot-password")({ head: () => pageHead("Forgot password", "Preview the CareerPilot password recovery demonstration."), component: () => <AuthCard key="forgot" mode="forgot" /> });