"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatInr } from "@/lib/currency";
import { authHeaders, useAuth } from "@/hooks/auth-context";
import { AdminSupplierLink } from "@/components/admin/admin-supplier-link";
import type { CatalogProduct } from "@/lib/catalog";

export function AdminProductList() {
  const { token, status } = useAuth();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const r = await fetch("/api/admin/products", { headers: authHeaders(token) });
      const d = await r.json();
      if (d.products) {
        setProducts(d.products as CatalogProduct[]);
        setError(null);
      } else {
        setError(d.error ?? "Failed to load");
      }
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (status === "loading") return;
    if (!token) {
      setLoading(false);
      setError("Sign in as admin to view products.");
      return;
    }
    loadProducts();
  }, [token, status, loadProducts]);

  async function onDelete(p: CatalogProduct) {
    if (p.catalogSource !== "database") {
      setError("Demo catalog items cannot be deleted. They are built into the app.");
      return;
    }
    const ok = window.confirm(
      `Delete “${p.name}” from the shop?\n\nUploaded images in MongoDB will be removed. If this replaced a demo product, the demo version will show again.`
    );
    if (!ok || !token) return;

    setDeletingSlug(p.slug);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${p.slug}`, {
        method: "DELETE",
        headers: authHeaders(token),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not delete");
        return;
      }
      setProducts((list) => list.filter((item) => item.slug !== p.slug));
      await loadProducts();
    } catch {
      setError("Could not delete product.");
    } finally {
      setDeletingSlug(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">Products</h1>
          <p className="text-sm text-muted mt-2">
            Same catalog as the shop — demo items and MongoDB products. Edit any listing; delete database items only.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="h-11 px-6 inline-flex items-center bg-ink text-paper text-sm"
        >
          Add product
        </Link>
      </div>

      {loading && <p className="text-sm text-muted">Loading products…</p>}
      {error && !loading && <p className="text-sm text-red-700 mb-4" role="alert">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-muted">No products found.</p>
      )}

      {!loading && products.length > 0 && (
        <ul className="divide-y divide-line border border-line">
          {products.map((p) => (
            <li key={p.slug} className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
              <div className="relative w-14 h-16 shrink-0 border border-line bg-stone overflow-hidden">
                {p.images[0] && (
                  <Image
                    src={p.images[0]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                    unoptimized
                  />
                )}
              </div>
              <div className="flex-1 min-w-[12rem]">
                <p className="font-medium text-ink">{p.name}</p>
                <p className="text-sm text-muted mt-0.5">
                  {p.categorySlug} · {formatInr(p.priceInr)} · stock {p.stock}
                </p>
                <span
                  className={`inline-block mt-1.5 text-[10px] uppercase tracking-wider px-1.5 py-0.5 border ${
                    p.catalogSource === "database"
                      ? "border-ink/30 text-ink"
                      : "border-line text-muted"
                  }`}
                >
                  {p.catalogSource === "database" ? "Database" : "Demo catalog"}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-sm w-full sm:w-auto sm:justify-end">
                <Link
                  href={`/admin/products/${p.slug}/edit`}
                  className="h-10 px-4 inline-flex items-center border border-ink text-ink"
                >
                  Edit
                </Link>
                <Link
                  href={`/products/${p.slug}`}
                  className="h-10 px-4 inline-flex items-center text-muted underline"
                >
                  View store
                </Link>
                <AdminSupplierLink url={p.supplierUrl} className="h-10 !text-sm" label="Platform" />
                {p.catalogSource === "database" ? (
                  <button
                    type="button"
                    disabled={deletingSlug === p.slug}
                    onClick={() => onDelete(p)}
                    className="h-10 px-4 inline-flex items-center border border-red-800/40 text-red-800 disabled:opacity-50"
                  >
                    {deletingSlug === p.slug ? "Deleting…" : "Delete"}
                  </button>
                ) : (
                  <span
                    className="h-10 px-4 inline-flex items-center text-xs text-muted"
                    title="Built-in demo products cannot be deleted"
                  >
                    —
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
