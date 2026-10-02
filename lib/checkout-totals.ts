import { FREE_SHIPPING_THRESHOLD_INR } from "@/lib/constants";

const SHIPPING_FLAT = 149;

export function getShippingInr(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD_INR ? 0 : SHIPPING_FLAT;
}

export function getCheckoutTotal(subtotal: number): number {
  return subtotal + getShippingInr(subtotal);
}
