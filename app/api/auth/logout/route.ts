import { NextResponse } from "next/server";
import { revokeToken } from "@/lib/session-repository";

export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token) {
    try {
      await revokeToken(token);
    } catch {
      /* ignore */
    }
  }
  return NextResponse.json({ ok: true });
}
