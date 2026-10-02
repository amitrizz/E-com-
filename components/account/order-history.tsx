"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatInr } from "@/lib/currency";
import { authHeaders, useAuth } from "@/hooks/auth-context";
import { formatCartVariant } from "@/lib/cart-line";
import type { Order } from "@/types/order";

const STATUS_LABEL: Record<Order["status"], string> = {
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
};

export function OrderHistory() {
  const { user, status, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!user || !token) {
      setLoading(false);
      return;
    }
    fetch("/api/orders", { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
        else setError(data.error ?? "Failed to load orders");
      })
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, [user, status, token]);

  if (status === "loading" || loading) {
    return <p className="text-muted text-sm">Loading orders…</p>;
  }

  if (!user) {
    return (
      <div>
        <p className="text-muted text-sm">Sign in to see your order history.</p>
        <Link href="/login?next=/account/orders" className="inline-block mt-6 text-sm border-b border-ink">
          Sign in
        </Link>
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-800">{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <div>
        <p className="text-muted text-sm">You have not placed any orders yet.</p>
        <Link href="/shop" className="inline-block mt-6 text-sm border-b border-ink">Continue shopping</Link>
      </div>
    );
  }

  return (
    <ul className="space-y-6">
      {orders.map((order) => (
        <li key={order.id} className="border border-line p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <p className="font-medium text-ink">#{order.orderNumber}</p>
              <p className="text-xs text-muted mt-1">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-widest border border-line px-2 py-1">
              {STATUS_LABEL[order.status]}
            </span>
          </div>
          <ul className="space-y-3">
            {order.items.map((item, idx) => (
              <li key={`${item.productId}-${idx}`} className="flex gap-3 text-sm">
                <div className="relative w-12 aspect-[4/5] bg-stone shrink-0">
                  <Image src={item.image} alt="" fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.slug}`} className="hover:underline truncate block">
                    {item.name}
                  </Link>
                  <p className="text-muted text-xs">
                    Qty {item.quantity}
                    {formatCartVariant(item.color, item.size)
                      ? ` · ${formatCartVariant(item.color, item.size)}`
                      : ""}
                  </p>
                </div>
                <p className="shrink-0">{formatInr(item.priceInr * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-line flex justify-between text-sm">
            <span className="text-muted">Cash on delivery · {order.address.city}</span>
            <span className="font-medium">{formatInr(order.totalInr)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
