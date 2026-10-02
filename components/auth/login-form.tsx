"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { PasswordField } from "@/components/auth/password-field";
import { useAuth } from "@/hooks/auth-context";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account/orders";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const result = await login(email, password);
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push(next);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="login-email" className="block text-[11px] uppercase tracking-[0.14em] text-muted mb-2">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[3.25rem] border border-line bg-stone/30 px-4 text-sm outline-none focus:ring-2 focus:ring-accent/35 focus:border-accent/50"
          placeholder="you@email.com"
        />
      </div>

      <PasswordField
        id="login-password"
        label="Password"
        value={password}
        onChange={setPassword}
      />

      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-xs text-muted hover:text-ink border-b border-transparent hover:border-line pb-0.5">
          Forgot password?
        </Link>
      </div>

      {error && (
        <p className="text-sm text-red-800 bg-red-50 border border-red-200 px-3 py-2" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full h-[3.25rem] bg-ink text-paper text-sm tracking-[0.06em] uppercase disabled:opacity-50 transition-opacity hover:bg-charcoal"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
