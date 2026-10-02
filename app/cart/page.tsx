"use client";

import Image from "next/image";
import Link from "next/link";
import { formatInr } from "@/lib/currency";
import { FREE_SHIPPING_THRESHOLD_INR } from "@/lib/constants";
import { useCart } from "@/hooks/cart-context";

export default function CartPage() {
  const { lines, subtotal, setQuantity, removeLine, hydrated } = useCart();

  if (!hydrated) {
    return <div className="container-kashu py-20 text-muted">Loading bag…</div>;
  }

  if (lines.length === 0) {
    return (
      <div className="container-kashu py-24 text-center">
        <h1 className="font-display text-4xl">Your bag is empty</h1>
        <Link href="/shop" className="inline-block mt-8 text-sm border-b border-ink pb-1">
          Continue shopping
        </Link>
      </div>
    );
  }

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_INR - subtotal);

  return (
    <div className="container-kashu py-12 md:py-20 max-w-3xl">
      <h1 className="font-display text-4xl mb-10">Bag</h1>
      {remaining > 0 && (
        <p className="text-sm text-muted mb-8">
          Add {formatInr(remaining)} more for complimentary shipping.
        </p>
      )}
      <ul className="divide-y divide-line">
        {lines.map((line) => (
          <li key={line.productId} className="flex gap-4 py-6">
            <div className="relative w-24 aspect-[4/5] bg-stone shrink-0">
              <Image src={line.image} alt="" fill className="object-cover" sizes="96px" />
            </div>
            <div className="flex-1">
              <Link href={`/products/${line.slug}`} className="text-ink hover:underline">
                {line.name}
              </Link>
              <p className="text-sm text-muted mt-1">{formatInr(line.priceInr)}</p>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <label className="sr-only" htmlFor={`qty-${line.productId}`}>Quantity</label>
                <input
                  id={`qty-${line.productId}`}
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => setQuantity(line.productId, Number(e.target.value))}
                  className="w-16 border border-line h-9 px-2"
                />
                <button type="button" className="text-muted hover:text-ink" onClick={() => removeLine(line.productId)}>
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex justify-between text-lg border-t border-line pt-8">
        <span>Subtotal</span>
        <span>{formatInr(subtotal)}</span>
      </div>
      <Link
        href="/checkout"
        className="mt-8 inline-flex h-12 w-full items-center justify-center bg-ink text-paper text-sm"
      >
        Checkout
      </Link>
    </div>
  );
}
