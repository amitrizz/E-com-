import type { Metadata } from "next";
import { OrderHistory } from "@/components/account/order-history";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <div className="container-kashu py-12 md:py-16 max-w-2xl">
      <h1 className="font-display text-4xl md:text-5xl text-ink mb-8">Orders</h1>
      <OrderHistory />
    </div>
  );
}
