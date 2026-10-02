import { NextResponse } from "next/server";
import { getBearerUser } from "@/lib/auth-server";

export async function GET(request: Request) {
  const user = await getBearerUser(request.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user });
}
