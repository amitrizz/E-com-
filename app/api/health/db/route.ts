import { NextResponse } from "next/server";
import { pingDatabase } from "@/lib/mongodb";

export async function GET() {
  const ok = await pingDatabase();
  if (!ok) {
    return NextResponse.json(
      { ok: false, error: "Database unreachable or DATABASE_URL missing" },
      { status: 503 }
    );
  }
  return NextResponse.json({ ok: true });
}
