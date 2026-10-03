"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatInr } from "@/lib/currency";
import { formatCartVariant } from "@/lib/cart-line";
import { authHeaders, useAuth } from "@/hooks/auth-context";
import { AdminSupplierLink } from "@/components/admin/admin-supplier-link";
import type { Order } from "@/types/order";

type Filter = "pending" | "processed" | "all";

const ADMIN_STATUS: Record<Order["status"], string> = {
  confirmed: "To process",
  processing: "Processed",
  shipped: "Shipped",
  delivered: "Delivered",
};

export function AdminOrderList() {
  const { token, status } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const r = await fetch("/api/admin/orders", { headers: authHeaders(token) });
      const data = await r.json();
      if (data.orders) {
        setOrders(data.orders as Order[]);
        setError(null);
      } else {
        setError(data.error ?? "Failed to load orders");
      }
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (status === "loading") return;
    if (!token) {
      setLoading(false);
      setError("Sign in as admin.");
      return;
    }
    load();
  }, [token, status, load]);

  const filtered = useMemo(() => {
    if (filter === "all") return orders;
    if (filter === "pending") return orders.filter((o) => o.status === "confirmed");
    return orders.filter((o) => o.status !== "confirmed");
  }, [orders, filter]);

  const pendingCount = useMemo(
    () => orders.filter((o) => o.status === "confirmed").length,
    [orders]
  );

  async function setStatus(orderId: string, next: Order["status"]) {
    if (!token) return;
    setUpdatingId(orderId);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Update failed");
        return;
      }
      setOrders((list) => list.map((o) => (o.id === orderId ? (data.order as Order) : o)));
    } catch {
      setError("Update failed");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">Orders</h1>
          <p className="text-sm text-muted mt-2">
            {pendingCount > 0
              ? `${pendingCount} order${pendingCount === 1 ? "" : "s"} awaiting processing.`
              : "No new orders waiting."}
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          {(
            [
              ["pending", "To process"],
              ["processed", "Processed"],
              ["all", "All"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`h-10 px-4 border ${
                filter === key ? "border-ink bg-ink text-paper" : "border-line text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-sm text-muted">Loading orders…</p>}
      {error && <p className="text-sm text-red-700 mb-4" role="alert">{error}</p>}

      {!loading && filtered.length === 0 && (
        <p className="text-muted text-sm">No orders in this view.</p>
      )}

      <ul className="space-y-6">
        {filtered.map((order) => (
          <li key={order.id} className="border border-line p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="font-medium">#{order.orderNumber}</p>
                <p className="text-xs text-muted mt-1">{order.email}</p>
                <p className="text-xs text-muted">
                  {new Date(order.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <span
                className={`text-[10px] uppercase tracking-widest px-2 py-1 border ${
                  order.status === "confirmed"
                    ? "border-accent text-accent bg-accent/5"
                    : "border-line text-muted"
                }`}
              >
                {ADMIN_STATUS[order.status]}
              </span>
            </div>

            <ul className="space-y-3 mb-4">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <div className="relative w-12 aspect-[4/5] bg-stone shrink-0">
                    <Image src={item.image} alt="" fill className="object-cover" sizes="48px" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-ink">{item.name}</p>
                    <p className="text-xs text-muted mt-0.5">
                      Qty {item.quantity}
                      {formatCartVariant(item.color, item.size)
                        ? ` · ${formatCartVariant(item.color, item.size)}`
                        : ""}
                    </p>
                    <div className="mt-2">
                      <AdminSupplierLink
                        url={item.supplierUrl}
                        label="Order on platform"
                      />
                    </div>
                    <p className="text-xs mt-1">
                      {formatInr(item.priceInr)} each
                      {item.compareAtInr && item.compareAtInr > item.priceInr && (
                        <span className="ml-2 text-muted line-through">
                          {formatInr(item.compareAtInr)}
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="shrink-0">{formatInr(item.priceInr * item.quantity)}</p>
                </li>
              ))}
            </ul>

            <div className="text-sm border-t border-line pt-4 space-y-1">
              <div className="flex justify-between text-muted">
                <span>Subtotal (sale prices)</span>
                <span>{formatInr(order.subtotalInr)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span>{order.shippingInr === 0 ? "Complimentary" : formatInr(order.shippingInr)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2">
                <span>Total (COD)</span>
                <span>{formatInr(order.totalInr)}</span>
              </div>
            </div>

            <p className="text-xs text-muted mt-3">
              {order.address.fullName} · {order.address.phone}
              <br />
              {order.address.address}, {order.address.city}, {order.address.state} {order.address.pin}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {order.status === "confirmed" && (
                <button
                  type="button"
                  disabled={updatingId === order.id}
                  onClick={() => setStatus(order.id, "processing")}
                  className="h-10 px-4 bg-ink text-paper text-sm disabled:opacity-50"
                >
                  {updatingId === order.id ? "Saving…" : "Mark as processed"}
                </button>
              )}
              {order.status === "processing" && (
                <>
                  <button
                    type="button"
                    disabled={updatingId === order.id}
                    onClick={() => setStatus(order.id, "shipped")}
                    className="h-10 px-4 border border-ink text-sm disabled:opacity-50"
                  >
                    Mark shipped
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === order.id}
                    onClick={() => setStatus(order.id, "delivered")}
                    className="h-10 px-4 bg-ink text-paper text-sm disabled:opacity-50"
                  >
                    Mark delivered
                  </button>
                </>
              )}
              {order.status === "shipped" && (
                <button
                  type="button"
                  disabled={updatingId === order.id}
                  onClick={() => setStatus(order.id, "delivered")}
                  className="h-10 px-4 bg-ink text-paper text-sm disabled:opacity-50"
                >
                  Mark delivered
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
