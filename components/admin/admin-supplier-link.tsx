"use client";

import { ExternalLink } from "lucide-react";
import { normalizeSupplierUrl } from "@/lib/supplier-url";

type Props = {
  url?: string | null;
  className?: string;
  label?: string;
};

/** Admin-only external link to source marketplace listing */
export function AdminSupplierLink({
  url,
  className = "",
  label = "Source listing",
}: Props) {
  const href = normalizeSupplierUrl(url);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-xs border border-line px-2.5 py-1.5 hover:border-charcoal text-ink ${className}`}
    >
      <ExternalLink size={13} aria-hidden />
      {label}
    </a>
  );
}
