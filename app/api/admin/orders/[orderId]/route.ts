import { NextResponse } from "next/server";
import { getBearerUser, requireAdmin } from "@/lib/auth-server";
import { updateOrderStatus } from "@/lib/order-repository";
import type { Order } from "@/types/order";

type RouteContext = { params: Promise<{ orderId: string }> };

const ALLOWED: Order["status"][] = ["confirmed", "processing", "shipped", "delivered"];

export async function PATCH(request: Request, context: RouteContext) {
  try {
    requireAdmin(await getBearerUser(request.headers.get("authorization")));
    const { orderId } = await context.params;
    const body = (await request.json()) as { status?: Order["status"] };
    if (!body.status || !ALLOWED.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
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
