import { NextResponse } from "next/server";
import { getBearerUser, requireAdmin } from "@/lib/auth-server";
import { getOrderById, updateOrderStatus } from "@/lib/order-repository";
import type { Order } from "@/types/order";

type RouteContext = { params: Promise<{ orderId: string }> };

const ALLOWED: Order["status"][] = ["confirmed", "processing", "shipped", "delivered"];

const NEXT_STATUS: Record<Order["status"], Order["status"] | null> = {
  confirmed: "processing",
  processing: "shipped",
  shipped: "delivered",
  delivered: null,
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    requireAdmin(await getBearerUser(request.headers.get("authorization")));
    const { orderId } = await context.params;
    const body = (await request.json()) as { status?: Order["status"] };
    if (!body.status || !ALLOWED.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const existing = await getOrderById(orderId);
    if (!existing) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    const expectedNext = NEXT_STATUS[existing.status];
    if (body.status !== expectedNext) {
      return NextResponse.json(
        {
          error: expectedNext
            ? `Order must move to “${expectedNext}” next (current: ${existing.status}).`
            : "This order is already delivered.",
        },
        { status: 400 }
      );
    }

    const order = await updateOrderStatus(orderId, body.status);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Could not update order." }, { status: 500 });
  }
}
