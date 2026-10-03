"use client";

import Link from "next/link";
import { AdminProductEditLink } from "@/components/admin/admin-product-edit-link";
import { AdminSupplierLink } from "@/components/admin/admin-supplier-link";
import { useAuth } from "@/hooks/auth-context";

type Props = {
  slug: string;
  supplierUrl?: string;
  showStoreLink?: boolean;
};

export function AdminProductStoreActions({
  slug,
  supplierUrl,
  showStoreLink = false,
}: Props) {
  const { user, status } = useAuth();
  if (status !== "authenticated" || user?.role !== "admin") return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AdminProductEditLink slug={slug} variant="inline" />
      <AdminSupplierLink url={supplierUrl} label="Platform listing" />
      {showStoreLink && (
        <Link
          href={`/products/${slug}`}
          className="inline-flex items-center h-10 px-4 border border-line text-sm text-muted hover:text-ink"
        >
          View on store
        </Link>
      )}
    </div>
  );
}
