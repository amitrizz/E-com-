import { NextResponse } from "next/server";
import { createSession } from "@/lib/session-repository";
import { authenticateUser } from "@/lib/user-repository";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email ?? "";
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await createSession(user);
    return NextResponse.json({ token, user });
  } catch {
    return NextResponse.json({ error: "Login failed. Check database connection." }, { status: 503 });
  }
}
