import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <AuthShell
      title="Join Kashu"
      subtitle="Create your shopper account in a minute. We never share your email."
      alternate={{
        prompt: "Already have an account?",
        label: "Sign in",
        href: "/login",
      }}
    >
      <SignupForm />
    </AuthShell>
  );
}
