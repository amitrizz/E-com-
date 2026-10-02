import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getCatalogProductBySlug } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  return { title: product ? `Edit · ${product.name}` : "Edit product" };
}

export default async function AdminEditProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-muted hover:text-ink mb-6 inline-block">
        ← All products
      </Link>
      <h1 className="font-display text-3xl sm:text-4xl mb-8">Edit product</h1>
      <ProductForm mode="edit" initial={product} />
    </div>
  );
}
