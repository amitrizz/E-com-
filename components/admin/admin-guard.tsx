"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/auth-context";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!user) {
      router.replace("/login?next=/admin");
      return;
    }
    if (user.role !== "admin") {
      router.replace("/");
    }
  }, [user, status, router]);

  if (status === "loading") {
    return <p className="container-kashu py-20 text-muted">Checking access…</p>;
  }
  if (!user || user.role !== "admin") {
    return (
      <div className="container-kashu py-20">
        <p className="text-muted">Redirecting…</p>
        <Link href="/login" className="text-sm underline mt-4 inline-block">Login as admin</Link>
      </div>
    );
  }

  return <>{children}</>;
}
