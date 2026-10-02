import { createHash, randomBytes } from "crypto";
import { getDb } from "@/lib/mongodb";
import type { AuthUser } from "@/types/auth";

const COLLECTION = "kashu_sessions";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(user: AuthUser): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const db = await getDb();
  await db.collection(COLLECTION).insertOne({
    tokenHash: hashToken(token),
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    createdAt: new Date(),
    revokedAt: null,
  });
  return token;
}

export async function getUserByToken(token: string): Promise<AuthUser | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({
    tokenHash: hashToken(token),
    revokedAt: null,
  });
  if (!doc) return null;
  return {
    id: String(doc.userId),
    email: String(doc.email),
    name: String(doc.name),
    role: doc.role as AuthUser["role"],
  };
}

export async function revokeToken(token: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).updateOne(
    { tokenHash: hashToken(token) },
    { $set: { revokedAt: new Date() } }
  );
}
