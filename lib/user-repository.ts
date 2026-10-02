import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { hashPassword, verifyPassword } from "@/lib/password";
import type { AuthUser, UserRole } from "@/types/auth";
import type { OrderAddress } from "@/types/order";

const COLLECTION = "kashu_users";

export type DbUser = {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  marketingOptIn?: boolean;
  savedAddress?: OrderAddress;
  createdAt: Date;
};

function toAuthUser(doc: DbUser): AuthUser {
  return {
    id: String(doc._id),
    email: doc.email,
    name: doc.name,
    role: doc.role,
  };
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const db = await getDb();
  const doc = await db.collection<DbUser>(COLLECTION).findOne({
    email: email.trim().toLowerCase(),
  });
  return doc;
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthUser | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  return toAuthUser(user);
}

export async function createUserAccount(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  marketingOptIn?: boolean;
}): Promise<AuthUser> {
  const email = input.email.trim().toLowerCase();
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("EMAIL_EXISTS");
  }
  const name = `${input.firstName.trim()} ${input.lastName.trim()}`.trim();
  const passwordHash = await hashPassword(input.password);
  const db = await getDb();
  const doc: DbUser = {
    email,
    passwordHash,
    name,
    role: "user",
    marketingOptIn: input.marketingOptIn ?? false,
    createdAt: new Date(),
  };
  const result = await db.collection(COLLECTION).insertOne(doc);
  doc._id = result.insertedId;
  return toAuthUser(doc);
}

export async function getSavedAddress(userId: string): Promise<OrderAddress | null> {
  const db = await getDb();
  const doc = await db.collection<DbUser>(COLLECTION).findOne({
    _id: new ObjectId(userId),
  });
  return doc?.savedAddress ?? null;
}

export async function saveSavedAddress(userId: string, address: OrderAddress): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(userId) },
    { $set: { savedAddress: address, updatedAt: new Date() } }
  );
}
