"use client";

import Image from "next/image";
import { formatInr } from "@/lib/currency";
import { FREE_SHIPPING_THRESHOLD_INR } from "@/lib/constants";
import type { CartLine } from "@/hooks/cart-context";

const SHIPPING_FLAT = 149;

export function CheckoutSummary({
  lines,
  subtotal,
}: {
  lines: CartLine[];
  subtotal: number;
}) {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD_INR ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  return (
    <aside className="border border-line bg-stone/20 p-6 lg:p-8 h-fit">
      <h2 className="font-display text-2xl text-ink mb-6">Order summary</h2>
      <ul className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {lines.map((line) => (
          <li key={line.productId} className="flex gap-3 text-sm">
            <div className="relative w-14 aspect-[4/5] bg-stone shrink-0">
              <Image src={line.image} alt="" fill className="object-cover" sizes="56px" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-ink truncate">{line.name}</p>
              <p className="text-muted">Qty {line.quantity}</p>
            </div>
            <p className="text-charcoal shrink-0">{formatInr(line.priceInr * line.quantity)}</p>
          </li>
        ))}
      </ul>
      <dl className="space-y-2 text-sm border-t border-line pt-4">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd>{formatInr(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd>{shipping === 0 ? "Complimentary" : formatInr(shipping)}</dd>
        </div>
        <div className="flex justify-between text-base font-medium pt-3 border-t border-line mt-2">
          <dt>Total</dt>
          <dd>{formatInr(total)}</dd>
        </div>
      </dl>
    </aside>
  );
}

export function computeCheckoutTotal(subtotal: number): number {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD_INR ? 0 : SHIPPING_FLAT;
  return subtotal + shipping;
}
