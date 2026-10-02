import Link from "next/link";
import { BRAND_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper mt-auto">
      <div className="container-kashu py-12 sm:py-16 lg:py-20 grid gap-10 sm:gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="font-display text-3xl text-ink">{BRAND_NAME}</p>
          <p className="mt-4 max-w-sm text-muted text-sm leading-relaxed">
            Premium leather and outerwear for Indian cities—quiet silhouettes, honest materials,
            and pieces meant to last beyond a single season.
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted mb-4">Explore</p>
          <ul className="space-y-2 text-sm text-charcoal">
            <li><Link href="/shop" className="hover:text-ink">Shop all</Link></li>
            <li><Link href="/collections/monsoon-edit" className="hover:text-ink">Monsoon Edit</Link></li>
            <li><Link href="/about" className="hover:text-ink">Our story</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted mb-4">Support</p>
          <ul className="space-y-2 text-sm text-charcoal">
            <li><Link href="/account/orders" className="hover:text-ink">Orders</Link></li>
            <li><a href="mailto:support@kashu.in" className="hover:text-ink">support@kashu.in</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {BRAND_NAME}. Mumbai · Crafted in India.
      </div>
    </footer>
  );
}
