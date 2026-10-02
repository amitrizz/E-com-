"use client";

import Link from "next/link";
import { AddToBagButton } from "@/components/product/add-to-bag-button";
import { useProductPurchase } from "@/components/product/product-purchase-context";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
  variant?: "inline" | "sticky";
};

const buyBase =
  "inline-flex items-center justify-center border border-ink bg-paper text-ink font-medium touch-target w-full";

export function ProductPurchaseActions({ product, variant = "inline" }: Props) {
  const { selectedColor, selectedSize } = useProductPurchase();

  if (product.stock === 0) {
    return <p className="text-sm text-muted mt-6">This item is sold out online.</p>;
  }

  const isSticky = variant === "sticky";
  const height = isSticky ? "h-11 text-xs" : "h-12 text-sm";
  const grid = `grid grid-cols-2 gap-2 sm:gap-3 w-full ${isSticky ? "" : "mt-6 max-w-xl md:max-w-none"}`;

  return (
    <div className={grid}>
      <AddToBagButton
        product={product}
        color={selectedColor}
        size={selectedSize}
        compact={isSticky}
        fullWidth
      />
      <Link href="/checkout" className={`${buyBase} ${height}`}>
        Buy now
      </Link>
    </div>
  );
}
