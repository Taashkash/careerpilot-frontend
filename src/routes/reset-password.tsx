import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/landing/auth-card";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/reset-password")({ head: () => pageHead("Reset password", "Choose a new password for your CareerPilot AI account."), component: () => <AuthCard key="reset" mode="reset" /> });
