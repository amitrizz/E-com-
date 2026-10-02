"use client";

import { useState } from "react";
import { useCart } from "@/hooks/cart-context";
import type { Product } from "@/types/product";

export function AddToBagButton({
  product,
  size,
  compact,
  fullWidth,
}: {
  product: Product;
  size?: string;
  compact?: boolean;
  fullWidth?: boolean;
}) {
  const { addLine } = useCart();
  const [added, setAdded] = useState(false);
  const disabled = product.stock === 0;

  return (
    <button
      type="button"
      disabled={disabled}
      className={
        compact
          ? `h-11 px-3 bg-ink text-paper text-xs disabled:opacity-40 touch-target ${fullWidth ? "w-full" : "shrink-0"}`
          : `h-12 px-4 bg-ink text-paper text-sm disabled:opacity-40 touch-target ${fullWidth ? "w-full" : "w-full sm:w-auto sm:px-8"}`
      }
      onClick={() => {
        addLine({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          priceInr: product.priceInr,
          image: product.images[0],
          quantity: 1,
          color: product.colors[0],
          size: size || product.sizes?.[0],
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
    >
      {disabled ? "Sold out" : added ? "Added ✓" : "Add to bag"}
    </button>
  );
}
