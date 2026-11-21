import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/landing/auth-card";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/forgot-password")({ head: () => pageHead("Forgot password", "Request a link to reset your CareerPilot AI password."), component: () => <AuthCard key="forgot" mode="forgot" /> });
