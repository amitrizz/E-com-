import { NextResponse } from "next/server";
import { getBearerUser } from "@/lib/auth-server";
import { getShippingInr, getCheckoutTotal } from "@/lib/checkout-totals";
import { getProductBySlug } from "@/lib/api";
import { createOrder, listOrdersForUser } from "@/lib/order-repository";
import { normalizeSupplierUrl } from "@/lib/supplier-url";
import { saveSavedAddress } from "@/lib/user-repository";
import type { OrderLine } from "@/types/order";

export async function GET(request: Request) {
  const user = await getBearerUser(request.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ error: "Sign in to view orders." }, { status: 401 });
  }
  try {
    const orders = await listOrdersForUser(user.id, user.email);
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Could not load orders." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await getBearerUser(request.headers.get("authorization"));

    const email = String(body.email ?? user?.email ?? "").trim().toLowerCase();
    const items = body.items as OrderLine[];
    if (!email || !items?.length) {
      return NextResponse.json({ error: "Email and items are required." }, { status: 400 });
    }

    const enrichedItems: OrderLine[] = await Promise.all(
      items.map(async (item) => {
        const product = await getProductBySlug(item.slug);
        const supplierUrl =
          normalizeSupplierUrl(item.supplierUrl) ??
          normalizeSupplierUrl(product?.supplierUrl);
        return supplierUrl ? { ...item, supplierUrl } : item;
      })
    );

    const subtotalInr = enrichedItems.reduce((s, i) => s + i.priceInr * i.quantity, 0);
    const shippingInr = getShippingInr(subtotalInr);
    const totalInr = getCheckoutTotal(subtotalInr);

    const order = await createOrder({
      userId: user?.id,
      email,
      items: enrichedItems,
      subtotalInr,
      shippingInr,
      totalInr,
      address: body.address,
    });

    if (user?.id && body.saveAddress !== false && body.address) {
      await saveSavedAddress(user.id, body.address);
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not place order." }, { status: 500 });
  }
}
