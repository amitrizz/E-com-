import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { ProductPurchaseProvider } from "@/components/product/product-purchase-context";
import { ProductPurchaseActions } from "@/components/product/product-purchase-actions";
import { ProductSizeGuide } from "@/components/product/product-size-guide";
import { ProductStickyBar } from "@/components/product/product-sticky-bar";
import { PURCHASE_ANCHOR_ID } from "@/lib/constants";
import { AdminProductEditLink } from "@/components/admin/admin-product-edit-link";
import { ProductCard } from "@/components/product/product-card";
import { formatInr } from "@/lib/currency";
import { getProductBySlug, getProducts } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await getProducts())
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container-kashu py-8 sm:py-10 md:py-16 pb-[5.5rem] xl:pb-16">
      <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-16">
        <ProductImageGallery images={product.images} alt={product.name} />
        <div className="md:pt-2 lg:pt-8 min-w-0">
          {product.badge && (
            <span className="text-[10px] uppercase tracking-widest text-accent">{product.badge}</span>
          )}
          <div className="flex flex-wrap items-start justify-between gap-3 mt-2">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink">{product.name}</h1>
            <AdminProductEditLink slug={product.slug} variant="inline" />
          </div>
          <p className="mt-3 sm:mt-4 text-lg">
            {formatInr(product.priceInr)}
            {product.compareAtInr && (
              <span className="ml-2 text-muted line-through text-base">
                {formatInr(product.compareAtInr)}
              </span>
            )}
          </p>
          <p className="mt-2 text-sm text-muted">
            {product.stock === 0 ? "Sold out online" : product.stock < 5 ? `Only ${product.stock} left` : "In stock"}
          </p>
          <ProductPurchaseProvider product={product}>
            <ProductSizeGuide />
            <div id={PURCHASE_ANCHOR_ID}>
              <ProductPurchaseActions product={product} variant="inline" />
            </div>
            <ProductStickyBar product={product} />
          </ProductPurchaseProvider>
          <p className="mt-6 sm:mt-8 text-muted leading-relaxed text-[15px] sm:text-base">{product.description}</p>
          <dl className="mt-8 sm:mt-12 space-y-3 text-sm border-t border-line pt-6 sm:pt-8 pb-2">
            <div><dt className="text-muted inline">Material: </dt><dd className="inline text-charcoal">{product.specs.material}</dd></div>
            <div><dt className="text-muted inline">Care: </dt><dd className="inline text-charcoal">{product.specs.care}</dd></div>
            <div><dt className="text-muted inline">Origin: </dt><dd className="inline text-charcoal">{product.specs.origin}</dd></div>
          </dl>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-20 border-t border-line pt-16">
          <h2 className="font-display text-3xl mb-8">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
