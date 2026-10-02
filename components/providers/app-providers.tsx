"use client";

import { AuthProvider } from "@/hooks/auth-context";
import { CartProvider } from "@/hooks/cart-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
