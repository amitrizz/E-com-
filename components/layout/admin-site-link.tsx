"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { useAuth } from "@/hooks/auth-context";

/** Visible in main header for store admins — opens the admin panel. */
export function AdminSiteLink({ className = "" }: { className?: string }) {
  const { user, status } = useAuth();

  if (status !== "authenticated" || user?.role !== "admin") return null;

  return (
    <Link
      href="/admin"
      className={`inline-flex items-center gap-1.5 text-sm text-charcoal hover:text-ink transition-colors py-2 px-2 sm:px-3 border border-line/80 hover:border-charcoal bg-stone/30 ${className}`}
      aria-label="Open admin panel"
    >
      <Shield size={16} className="text-accent shrink-0" aria-hidden />
      <span className="hidden sm:inline">Admin</span>
    </Link>
  );
}
