"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/products/new", label: "Add product" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin/products") return pathname === "/admin/products";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-1 overflow-x-auto scrollbar-none -mx-1 px-1"
      aria-label="Admin sections"
    >
      {tabs.map((tab) => {
        const active = isActive(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`shrink-0 px-4 py-2.5 text-sm border-b-2 transition-colors touch-target whitespace-nowrap ${
              active
                ? "border-ink text-ink font-medium"
                : "border-transparent text-muted hover:text-ink hover:border-line"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
