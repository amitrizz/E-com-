"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "@/types/product";

type Ctx = {
  product: Product;
  selectedSize: string | undefined;
  setSelectedSize: (size: string | undefined) => void;
};

const ProductPurchaseContext = createContext<Ctx | null>(null);

export function ProductPurchaseProvider({
  product,
  children,
}: {
  product: Product;
  children: React.ReactNode;
}) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes?.[0]
  );

  const value = useMemo(
    () => ({ product, selectedSize, setSelectedSize }),
    [product, selectedSize]
  );

  return (
    <ProductPurchaseContext.Provider value={value}>{children}</ProductPurchaseContext.Provider>
  );
}

export function useProductPurchase() {
  const ctx = useContext(ProductPurchaseContext);
  if (!ctx) {
    throw new Error("useProductPurchase must be used within ProductPurchaseProvider");
  }
  return ctx;
}
