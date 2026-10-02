"use client";

import { useEffect, useState } from "react";
import { ProductPurchaseActions } from "@/components/product/product-purchase-actions";
import { PURCHASE_ANCHOR_ID } from "@/lib/constants";
import type { Product } from "@/types/product";

/** Shown on scroll when main purchase buttons leave the viewport (mobile/tablet only). */
export function ProductStickyBar({ product }: { product: Product }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const anchor = document.getElementById(PURCHASE_ANCHOR_ID);
    if (!anchor) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { root: null, threshold: 0, rootMargin: "0px 0px -1px 0px" }
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  if (product.stock === 0 || !visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-paper shadow-[0_-4px_24px_rgba(17,17,17,0.06)] safe-pb xl:hidden"
      aria-label="Quick purchase"
    >
      <div className="container-kashu py-3 pl-12 sm:pl-0">
        <ProductPurchaseActions product={product} variant="sticky" />
      </div>
    </div>
  );
}
