import { NextResponse } from "next/server";
import { createSession } from "@/lib/session-repository";
import { createUserAccount } from "@/lib/user-repository";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      marketingOptIn?: boolean;
    };

    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";
    const firstName = body.firstName?.trim() ?? "";
    const lastName = body.lastName?.trim() ?? "";

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const user = await createUserAccount({
      email,
      password,
      firstName,
      lastName,
      marketingOptIn: body.marketingOptIn,
    });
    const token = await createSession(user);
    return NextResponse.json({ token, user }, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === "EMAIL_EXISTS") {
      return NextResponse.json(
        { error: "This email is already registered. Please log in instead." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}
