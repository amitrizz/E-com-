import Image from "next/image";
import Link from "next/link";
import { AdminProductEditLink } from "@/components/admin/admin-product-edit-link";
import { formatInr } from "@/lib/currency";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock === 0;
  const imageSrc = product.images[0];
  const gridImageUnoptimized =
    imageSrc.startsWith("/api/media") || imageSrc.startsWith("http");

  return (
    <article className="group relative">
      <AdminProductEditLink slug={product.slug} variant="card" />
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-stone">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized={gridImageUnoptimized}
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
          />
          {product.badge && (
            <span className="absolute left-3 top-3 text-[10px] uppercase tracking-widest bg-paper px-2 py-1 text-ink border border-line">
              {product.badge}
            </span>
          )}
          {soldOut && (
            <span className="absolute inset-0 flex items-center justify-center bg-paper/70 text-xs uppercase tracking-widest">
              Sold out
            </span>
          )}
        </div>
        <div className="pt-4 pr-2">
          <h3 className="text-xs sm:text-sm text-ink leading-snug line-clamp-2">{product.name}</h3>
          <p className="mt-1 text-sm text-charcoal">
            {formatInr(product.priceInr)}
            {product.compareAtInr && (
              <span className="ml-2 text-muted line-through">
                {formatInr(product.compareAtInr)}
              </span>
            )}
          </p>
        </div>
      </Link>
    </article>
  );
}
