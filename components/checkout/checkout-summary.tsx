"use client";

import Image from "next/image";
import { formatInr } from "@/lib/currency";
import type { CartLine } from "@/hooks/cart-context";
import { formatCartVariant } from "@/lib/cart-line";
import { getCheckoutTotal, getShippingInr } from "@/lib/checkout-totals";

export function CheckoutSummary({
  lines,
  subtotal,
}: {
  lines: CartLine[];
  subtotal: number;
}) {
  const shipping = getShippingInr(subtotal);
  const total = getCheckoutTotal(subtotal);

  return (
    <aside className="border border-line bg-stone/20 p-6 lg:p-8 h-fit">
      <h2 className="font-display text-2xl text-ink mb-6">Order summary</h2>
      <ul className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {lines.map((line) => (
          <li key={line.lineKey} className="flex gap-3 text-sm">
            <div className="relative w-14 aspect-[4/5] bg-stone shrink-0">
              <Image src={line.image} alt="" fill className="object-cover" sizes="56px" unoptimized />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-ink truncate">{line.name}</p>
              <p className="text-muted text-xs mt-0.5">
                Qty {line.quantity}
                {formatCartVariant(line.color, line.size)
                  ? ` · ${formatCartVariant(line.color, line.size)}`
                  : ""}
              </p>
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
  return getCheckoutTotal(subtotal);
}
