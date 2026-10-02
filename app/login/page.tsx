import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to track orders, save your bag, and access member shipping benefits."
      alternate={{
        prompt: "New to Kashu?",
        label: "Create an account",
        href: "/signup",
      }}
    >
      <Suspense fallback={<p className="text-muted text-sm">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
