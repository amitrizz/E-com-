import { NextResponse } from "next/server";
import { getBearerUser } from "@/lib/auth-server";
import { getSavedAddress, saveSavedAddress } from "@/lib/user-repository";
import type { OrderAddress } from "@/types/order";

export async function GET(request: Request) {
  const user = await getBearerUser(request.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const address = await getSavedAddress(user.id);
    return NextResponse.json({ address });
  } catch {
    return NextResponse.json({ error: "Could not load address." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = await getBearerUser(request.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as OrderAddress;
    if (!body.fullName || !body.address || !body.city || !body.state || !body.pin || !body.phone) {
      return NextResponse.json({ error: "Complete address is required." }, { status: 400 });
    }
    await saveSavedAddress(user.id, body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save address." }, { status: 500 });
  }
}
