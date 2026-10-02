"use client";

import Image from "next/image";
import { useProductPurchase } from "@/components/product/product-purchase-context";

export function ProductSizeGuide() {
  const { product, selectedColor, setSelectedColor, selectedSize, setSelectedSize } =
    useProductPurchase();
  const colors = product.colors?.filter(Boolean) ?? [];
  const showColors = colors.length > 1;
  const sizes = product.sizes?.filter(Boolean) ?? [];
  const chartUrl = product.sizeChartImage?.trim();

  if (!showColors && sizes.length === 0 && !chartUrl) return null;

  return (
    <div className="mt-6 space-y-5">
      {showColors && (
        <div>
          <p className="text-sm text-ink mb-2">Color</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const active = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`min-h-11 px-4 text-sm border touch-target transition-colors ${
                    active
                      ? "border-ink bg-ink text-paper"
                      : "border-line bg-paper text-ink hover:border-charcoal"
                  }`}
                  aria-pressed={active}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <p className="text-sm text-ink mb-2">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const active = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[2.75rem] h-11 px-3 text-sm border touch-target transition-colors ${
                    active
                      ? "border-ink bg-ink text-paper"
                      : "border-line bg-paper text-ink hover:border-charcoal"
                  }`}
                  aria-pressed={active}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {chartUrl && (
        <div>
          <p className="text-sm text-ink mb-2">Size guide</p>
          <div className="relative w-full max-w-md border border-line bg-stone aspect-[4/3]">
            <Image
              src={chartUrl}
              alt={`${product.name} size chart`}
              fill
              className="object-contain p-2"
              sizes="(max-width: 768px) 100vw, 28rem"
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}
