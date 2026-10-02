"use client";

import Link from "next/link";
import { Shield, X } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/hooks/auth-context";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/collections/atelier-leather", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/account/orders", label: "Orders" },
  { href: "/login", label: "Account" },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: Props) {
  const { user } = useAuth();
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 left-0 w-[min(100%,20rem)] bg-paper border-r border-line flex flex-col safe-pb">
        <div className="flex items-center justify-between h-16 px-4 border-b border-line">
          <span className="text-[11px] uppercase tracking-widest text-muted">Menu</span>
          <button type="button" onClick={onClose} className="touch-target p-2 -mr-2" aria-label="Close">
            <X size={22} />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-1">
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={onClose}
              className="touch-target flex items-center gap-2 py-3 px-2 text-lg font-display text-ink border-b border-accent/40 bg-stone/50"
            >
              <Shield size={18} className="text-accent" aria-hidden />
              Admin
            </Link>
          )}
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="touch-target flex items-center py-3 px-2 text-lg font-display text-ink border-b border-line/60"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
