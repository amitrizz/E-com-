"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { AccountMenu } from "@/components/layout/account-menu";
import { AdminSiteLink } from "@/components/layout/admin-site-link";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BRAND_NAME } from "@/lib/constants";
import { useCart } from "@/hooks/cart-context";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/collections/atelier-leather", label: "Collections" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-colors duration-300 safe-pt ${
          solid ? "bg-paper/95 border-b border-line backdrop-blur-sm" : "bg-paper/80 md:bg-transparent"
        }`}
      >
        <div className="container-kashu relative flex h-14 sm:h-16 lg:h-[4.5rem] items-center">
          <button
            type="button"
            className="touch-target md:hidden p-2 -ml-2 text-ink z-10"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          <Link
            href="/"
            className="font-display text-xl sm:text-2xl lg:text-[1.75rem] tracking-tight text-ink absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:mr-8"
          >
            {BRAND_NAME}
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-charcoal flex-1 justify-center">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-ink transition-colors duration-200 py-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 ml-auto z-10">
            <AdminSiteLink className="-mr-0.5 md:-mr-1" />
            <Link href="/shop" className="touch-target p-2 text-ink" aria-label="Search">
              <Search size={20} strokeWidth={1.5} />
            </Link>
            <AccountMenu />
            <Link href="/cart" className="touch-target relative p-2 text-ink" aria-label="Bag">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] text-[10px] font-semibold bg-accent text-paper rounded-full flex items-center justify-center px-1">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
