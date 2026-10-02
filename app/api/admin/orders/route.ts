import { NextResponse } from "next/server";
import { getBearerUser, requireAdmin } from "@/lib/auth-server";
import { listAllOrders } from "@/lib/order-repository";

export async function GET(request: Request) {
  try {
    requireAdmin(await getBearerUser(request.headers.get("authorization")));
    const orders = await listAllOrders();
    return NextResponse.json({ orders });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Could not load orders." }, { status: 500 });
  }
}
