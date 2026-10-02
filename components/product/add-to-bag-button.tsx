"use client";

import { useState } from "react";
import { useCart } from "@/hooks/cart-context";
import { buildCartLineKey } from "@/lib/cart-line";
import type { Product } from "@/types/product";

export function AddToBagButton({
  product,
  color,
  size,
  compact,
  fullWidth,
}: {
  product: Product;
  color?: string;
  size?: string;
  compact?: boolean;
  fullWidth?: boolean;
}) {
  const { addLine } = useCart();
  const [added, setAdded] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const disabled = product.stock === 0;

  const resolvedColor = color ?? product.colors?.[0];
  const resolvedSize = size ?? product.sizes?.[0];
  const needsColor = (product.colors?.length ?? 0) > 1;
  const needsSize = (product.sizes?.length ?? 0) > 0;

  return (
    <div className={fullWidth ? "w-full" : undefined}>
      <button
        type="button"
        disabled={disabled}
        className={
          compact
            ? `h-11 px-3 bg-ink text-paper text-xs disabled:opacity-40 touch-target ${fullWidth ? "w-full" : "shrink-0"}`
            : `h-12 px-4 bg-ink text-paper text-sm disabled:opacity-40 touch-target ${fullWidth ? "w-full" : "w-full sm:w-auto sm:px-8"}`
        }
        onClick={() => {
          if (needsColor && !resolvedColor) {
            setHint("Select a color.");
            return;
          }
          if (needsSize && !resolvedSize) {
            setHint("Select a size.");
            return;
          }
          setHint(null);
          addLine({
            lineKey: buildCartLineKey(product.id, resolvedColor, resolvedSize),
            productId: product.id,
            slug: product.slug,
            name: product.name,
            priceInr: product.priceInr,
            compareAtInr: product.compareAtInr,
            image: product.images[0],
            quantity: 1,
            color: resolvedColor,
            size: resolvedSize,
          });
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
      >
        {disabled ? "Sold out" : added ? "Added ✓" : "Add to bag"}
      </button>
      {hint && (
        <p className="text-xs text-red-700 mt-1" role="alert">{hint}</p>
      )}
    </div>
  );
}
