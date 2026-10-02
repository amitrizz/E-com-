"use client";

import Link from "next/link";
import { useState } from "react";
import { LogOut, Package, Shield, User } from "lucide-react";
import { useAuth } from "@/hooks/auth-context";

export function AccountMenu({ className = "" }: { className?: string }) {
  const { user, status, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (status === "loading") {
    return (
      <span className={`p-2 text-muted ${className}`} aria-hidden>
        <User size={20} strokeWidth={1.5} />
      </span>
    );
  }

  if (!user) {
    return (
      <Link href="/login" className={`p-2 text-ink ${className}`} aria-label="Sign in">
        <User size={20} strokeWidth={1.5} />
      </Link>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="p-2 text-ink flex items-center gap-1"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <User size={20} strokeWidth={1.5} />
      </button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-64 border border-line bg-paper py-2 shadow-[0_8px_30px_rgba(17,17,17,0.08)]">
            <div className="px-4 py-3 border-b border-line mb-1">
              <p className="text-sm font-medium text-ink truncate">{user.name}</p>
              <p className="text-xs text-muted truncate mt-0.5">{user.email}</p>
            </div>
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-stone font-medium text-ink"
                onClick={() => setOpen(false)}
              >
                <Shield size={16} className="text-accent" /> Admin panel
              </Link>
            )}
            <Link
              href="/account/orders"
              className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-stone"
              onClick={() => setOpen(false)}
            >
              <Package size={16} /> Orders
            </Link>
            <button
              type="button"
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-stone text-left text-muted"
              onClick={() => {
                setOpen(false);
                logout();
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
