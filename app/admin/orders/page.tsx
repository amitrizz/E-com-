import type { Metadata } from "next";
import { AdminOrderList } from "@/components/admin/admin-order-list";

export const metadata: Metadata = { title: "Admin · Orders" };

export default function AdminOrdersPage() {
  return <AdminOrderList />;
}
