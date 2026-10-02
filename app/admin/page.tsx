import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Admin" };

export default function AdminHomePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl sm:text-4xl text-ink">Admin</h1>
      <p className="mt-3 text-muted text-sm sm:text-base">
        Manage catalog, uploads, and storefront content. Use the tabs above or the shortcuts below.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/orders"
          className="block border border-line p-6 hover:border-charcoal transition-colors"
        >
          <p className="text-sm font-medium text-ink">Orders</p>
          <p className="text-xs text-muted mt-2">Process confirmed COD orders and mark delivered.</p>
        </Link>
        <Link
          href="/admin/products"
          className="block border border-line p-6 hover:border-charcoal transition-colors"
        >
          <p className="text-sm font-medium text-ink">Products</p>
          <p className="text-xs text-muted mt-2">View and manage items in your shop catalog.</p>
        </Link>
        <Link
          href="/admin/products/new"
          className="block border border-line p-6 hover:border-charcoal transition-colors"
        >
          <p className="text-sm font-medium text-ink">Add product</p>
          <p className="text-xs text-muted mt-2">Upload images, sizes, and size chart in one flow.</p>
        </Link>
        <Link
          href="/shop"
          className="block border border-line p-6 hover:border-charcoal transition-colors sm:col-span-2"
        >
          <p className="text-sm font-medium text-ink">View storefront</p>
          <p className="text-xs text-muted mt-2">Open the live shop as customers see it.</p>
        </Link>
      </div>
    </div>
  );
}
