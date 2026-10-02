import type { Metadata } from "next";
import { AdminProductList } from "@/components/admin/admin-product-list";

export const metadata: Metadata = { title: "Admin · Products" };

export default function AdminProductsPage() {
  return <AdminProductList />;
}
