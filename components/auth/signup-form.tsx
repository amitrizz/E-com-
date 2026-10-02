"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PasswordField } from "@/components/auth/password-field";
import { useAuth } from "@/hooks/auth-context";

export function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const result = await signup({
      firstName: String(fd.get("firstName")),
      lastName: String(fd.get("lastName")),
      email: String(fd.get("email")),
      password,
      marketingOptIn: fd.get("marketing") === "on",
    });
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/account/orders");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-[11px] uppercase tracking-[0.14em] text-muted mb-2">
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            className="w-full h-[3.25rem] border border-line bg-stone/30 px-4 text-sm outline-none focus:ring-2 focus:ring-accent/35"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-[11px] uppercase tracking-[0.14em] text-muted mb-2">
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            required
            className="w-full h-[3.25rem] border border-line bg-stone/30 px-4 text-sm outline-none focus:ring-2 focus:ring-accent/35"
          />
        </div>
      </div>

      <div>
        <label htmlFor="signup-email" className="block text-[11px] uppercase tracking-[0.14em] text-muted mb-2">
          Email
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full h-[3.25rem] border border-line bg-stone/30 px-4 text-sm outline-none focus:ring-2 focus:ring-accent/35"
        />
      </div>

      <PasswordField
        id="signup-password"
        label="Password"
        name="password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        required
        minLength={8}
      />
      <PasswordField
        id="signup-confirm"
        label="Confirm password"
        name="confirm"
        value={confirm}
        onChange={setConfirm}
        autoComplete="new-password"
        required
        minLength={8}
      />

      <label className="flex items-start gap-3 text-sm text-muted cursor-pointer">
        <input type="checkbox" name="marketing" className="mt-1 accent-accent" />
        <span>Send me offers and new collection previews (optional).</span>
      </label>

      <p className="text-xs text-muted leading-relaxed">
        By creating an account you agree to our terms. Accounts are for shoppers only; store admins are
        provisioned separately.
      </p>

      {error && (
        <p className="text-sm text-red-800 bg-red-50 border border-red-200 px-3 py-2" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full h-[3.25rem] bg-ink text-paper text-sm tracking-[0.06em] uppercase disabled:opacity-50 hover:bg-charcoal"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
