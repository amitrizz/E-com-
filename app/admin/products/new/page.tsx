import type { Metadata } from "next";
import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = { title: "Admin · New product" };

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin/products" className="text-sm text-muted hover:text-ink mb-6 inline-block">
        ← Back to products
      </Link>
      <h1 className="font-display text-4xl mb-8">New product</h1>
      <ProductForm mode="create" />
    </div>
  );
}
