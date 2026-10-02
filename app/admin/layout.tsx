import Link from "next/link";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="border-b border-line sticky top-14 sm:top-16 lg:top-[4.5rem] z-40 bg-paper/95 backdrop-blur-sm">
        <div className="container-kashu flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 pt-3 pb-0">
          <div className="flex items-center justify-between gap-4 pb-2 sm:pb-0">
            <p className="text-[11px] uppercase tracking-widest text-muted shrink-0">Kashu admin</p>
            <Link href="/shop" className="text-xs text-muted hover:text-ink sm:hidden">
              ← Store
            </Link>
          </div>
          <AdminNav />
          <Link
            href="/shop"
            className="hidden sm:inline text-xs text-muted hover:text-ink pb-3 shrink-0"
          >
            Back to store
          </Link>
        </div>
      </div>
      <div className="container-kashu py-10 md:py-14">{children}</div>
    </AdminGuard>
  );
}
