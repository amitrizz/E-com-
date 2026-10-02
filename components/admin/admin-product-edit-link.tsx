"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { useAuth } from "@/hooks/auth-context";

type Props = {
  slug: string;
  variant?: "card" | "inline";
};

export function AdminProductEditLink({ slug, variant = "card" }: Props) {
  const { user, status } = useAuth();

  if (status !== "authenticated" || user?.role !== "admin") {
    return null;
  }

  const href = `/admin/products/${slug}/edit`;

  if (variant === "inline") {
    return (
      <Link
        href={href}
        className="inline-flex items-center gap-2 h-10 px-4 border border-ink text-ink text-sm hover:bg-stone transition-colors"
      >
        <Pencil size={15} strokeWidth={1.5} aria-hidden />
        Edit product
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 h-8 px-2.5 bg-paper/95 border border-line text-[11px] uppercase tracking-wide text-ink shadow-sm hover:border-charcoal"
      aria-label={`Edit ${slug}`}
    >
      <Pencil size={12} strokeWidth={1.5} aria-hidden />
      Edit
    </Link>
  );
}
