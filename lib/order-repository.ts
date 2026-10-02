import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { Order, OrderAddress, OrderLine } from "@/types/order";

const COLLECTION = "kashu_orders";

function docToOrder(doc: Record<string, unknown>): Order {
  return {
    id: String(doc._id),
    orderNumber: String(doc.orderNumber),
    userId: doc.userId ? String(doc.userId) : undefined,
    email: String(doc.email),
    items: doc.items as OrderLine[],
    subtotalInr: Number(doc.subtotalInr),
    shippingInr: Number(doc.shippingInr),
    totalInr: Number(doc.totalInr),
    paymentMethod: "cod",
    address: doc.address as OrderAddress,
    status: (doc.status as Order["status"]) ?? "confirmed",
    createdAt: new Date(doc.createdAt as Date).toISOString(),
  };
}

export async function createOrder(input: {
  userId?: string;
  email: string;
  items: OrderLine[];
  subtotalInr: number;
  shippingInr: number;
  totalInr: number;
  address: OrderAddress;
}): Promise<Order> {
  const db = await getDb();
  const orderNumber = `KS-${Date.now().toString().slice(-6)}`;
  const doc = {
    orderNumber,
    userId: input.userId,
    email: input.email.trim().toLowerCase(),
    items: input.items,
    subtotalInr: input.subtotalInr,
    shippingInr: input.shippingInr,
    totalInr: input.totalInr,
    paymentMethod: "cod",
    address: input.address,
    status: "confirmed",
    createdAt: new Date(),
  };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return docToOrder({ ...doc, _id: result.insertedId });
}

export async function listOrdersForUser(userId: string, email: string): Promise<Order[]> {
  const db = await getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const docs = await db
    .collection(COLLECTION)
    .find({
      $or: [{ userId }, { email: normalizedEmail }],
    })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => docToOrder(d as Record<string, unknown>));
}

export async function listAllOrders(): Promise<Order[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
  return docs.map((d) => docToOrder(d as Record<string, unknown>));
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<Order | null> {
  if (!ObjectId.isValid(orderId)) return null;
  const db = await getDb();
  const result = await db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(orderId) },
    { $set: { status, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  return result ? docToOrder(result as Record<string, unknown>) : null;
}

export async function getOrderByNumber(
  orderNumber: string,
  userId: string,
  email: string
): Promise<Order | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({
    orderNumber,
    $or: [{ userId }, { email: email.trim().toLowerCase() }],
  });
  return doc ? docToOrder(doc as Record<string, unknown>) : null;
}
