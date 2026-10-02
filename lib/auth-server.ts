import { getUserByToken } from "@/lib/session-repository";
import type { AuthUser } from "@/types/auth";

export async function getBearerUser(
  authorization: string | null
): Promise<AuthUser | null> {
  if (!authorization?.startsWith("Bearer ")) return null;
  const token = authorization.slice(7).trim();
  if (!token) return null;
  return getUserByToken(token);
}

export function requireAdmin(user: AuthUser | null): AuthUser {
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return user;
}
