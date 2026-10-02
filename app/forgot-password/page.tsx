import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset password"
      subtitle="Password reset via email is coming soon. Contact support@kashu.in if you need help."
      alternate={{ prompt: "Remembered it?", label: "Sign in", href: "/login" }}
    >
      <p className="text-sm text-muted">
        <Link href="/login" className="text-ink border-b border-accent/50">Back to sign in</Link>
      </p>
    </AuthShell>
  );
}
