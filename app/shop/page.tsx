import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Shop",
};

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <div className="container-kashu py-10 sm:py-12 md:py-20">
      <header className="mb-8 sm:mb-12 md:mb-16 border-b border-line pb-6 sm:pb-8">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink">Shop</h1>
        <p className="mt-4 text-muted max-w-xl">
          {products.length} pieces across leather, outerwear, and home—filters and sort coming next.
        </p>
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-10">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
