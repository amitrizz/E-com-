"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const order = params.get("order") ?? "KS-000000";

  return (
    <div className="container-kashu py-20 md:py-28 max-w-lg text-center mx-auto">
      <p className="text-[11px] uppercase tracking-[0.2em] text-accent mb-4">Thank you</p>
      <h1 className="font-display text-4xl md:text-5xl text-ink">Order confirmed</h1>
      <p className="mt-6 text-muted leading-relaxed">
        Your order <span className="text-ink font-medium">#{order}</span> is confirmed. We will
        email you shipping updates shortly.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/account/orders"
          className="h-12 px-8 inline-flex items-center justify-center bg-ink text-paper text-sm"
        >
          View orders
        </Link>
        <Link
          href="/shop"
          className="h-12 px-8 inline-flex items-center justify-center border border-ink text-sm"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<p className="container-kashu py-20 text-muted">Loading…</p>}>
      <SuccessContent />
    </Suspense>
  );
}
