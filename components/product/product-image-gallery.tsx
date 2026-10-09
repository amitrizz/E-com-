"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  alt: string;
};

function isUnoptimizedMedia(src: string) {
  return src.startsWith("/api/media") || src.startsWith("http");
}

export function ProductImageGallery({ images, alt }: Props) {
  const list = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const safeIndex = Math.min(active, Math.max(0, list.length - 1));
  const mainSrc = list[safeIndex] ?? list[0];

  if (!mainSrc) {
    return (
      <div className="relative w-full aspect-[4/5] bg-stone border border-line flex items-center justify-center text-sm text-muted">
        No image
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative w-full aspect-[4/5] max-h-[min(70vh,520px)] sm:max-h-[min(75vh,600px)] md:max-h-none overflow-hidden bg-stone">
        <Image
          key={mainSrc}
          src={mainSrc}
          alt={alt}
          fill
          priority={safeIndex === 0}
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          unoptimized={isUnoptimizedMedia(mainSrc)}
        />
      </div>

      {list.length > 1 && (
        <ul
          className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none"
          aria-label="Product images"
        >
          {list.map((src, i) => {
            const selected = i === safeIndex;
            return (
              <li key={`${src}-${i}`} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={`relative w-16 h-20 sm:w-[4.5rem] sm:h-[5.5rem] border overflow-hidden bg-stone touch-target ${
                    selected ? "border-ink ring-1 ring-ink" : "border-line hover:border-charcoal"
                  }`}
                  aria-label={`View image ${i + 1} of ${list.length}`}
                  aria-current={selected ? "true" : undefined}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="72px"
                    unoptimized={isUnoptimizedMedia(src)}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
