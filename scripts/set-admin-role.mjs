import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { resolve } from "path";

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error("Usage: node scripts/set-admin-role.mjs user@email.com");
  process.exit(1);
}

function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const envPath = resolve(process.cwd(), ".env.local");
  const raw = readFileSync(envPath, "utf8");
  const match = raw.match(/DATABASE_URL=(.+)/);
  if (!match) throw new Error("DATABASE_URL not found in .env.local");
  return match[1].trim().replace(/^["']|["']$/g, "");
}

const uri = loadDatabaseUrl();
const client = new MongoClient(uri);
await client.connect();
const db = client.db();
const result = await db.collection("kashu_users").updateOne(
  { email },
  { $set: { role: "admin", updatedAt: new Date() } }
);
if (result.matchedCount === 0) {
  console.log("NO_USER: No account found for", email);
  process.exit(2);
}
const user = await db
  .collection("kashu_users")
  .findOne({ email }, { projection: { email: 1, role: 1, name: 1 } });
const sessions = await db.collection("kashu_sessions").updateMany(
  { email, revokedAt: null },
  { $set: { role: "admin" } }
);
console.log("Updated user:", user);
console.log("Active sessions updated:", sessions.modifiedCount);
await client.close();
