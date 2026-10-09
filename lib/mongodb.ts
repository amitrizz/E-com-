import { MongoClient, type Db } from "mongodb";

const uri = process.env.DATABASE_URL;

if (!uri && process.env.NODE_ENV !== "production") {
  console.warn("[mongodb] DATABASE_URL is not set.");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(new Error("DATABASE_URL is not configured"));
  }
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 12_000,
      connectTimeoutMS: 12_000,
    });
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db();
}

export async function pingDatabase(): Promise<boolean> {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}
