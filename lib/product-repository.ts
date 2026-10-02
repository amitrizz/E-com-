import { getDb } from "@/lib/mongodb";
import type { Product, ProductSpecs } from "@/types/product";

const COLLECTION = "kashu_products";

export type CreateProductInput = {
  name: string;
  description: string;
  priceInr: number;
  compareAtInr?: number;
  categorySlug: string;
  collectionSlug?: string;
  colors: string[];
  sizes?: string[];
  sizeChartImage?: string;
  images: string[];
  stock: number;
  specs: ProductSpecs;
  badge?: Product["badge"];
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function docToProduct(doc: Record<string, unknown>): Product {
  return {
    id: String(doc._id ?? doc.id),
    slug: String(doc.slug),
    name: String(doc.name),
    description: String(doc.description),
    priceInr: Number(doc.priceInr),
    compareAtInr: doc.compareAtInr ? Number(doc.compareAtInr) : undefined,
    categorySlug: String(doc.categorySlug),
    collectionSlug: doc.collectionSlug ? String(doc.collectionSlug) : undefined,
    colors: (doc.colors as string[]) ?? [],
    sizes: doc.sizes as string[] | undefined,
    sizeChartImage: doc.sizeChartImage ? String(doc.sizeChartImage) : undefined,
    images: (doc.images as string[]) ?? [],
    badge: doc.badge as Product["badge"],
    stock: Number(doc.stock ?? 0),
    rating: Number(doc.rating ?? 4.5),
    reviewCount: Number(doc.reviewCount ?? 0),
    specs: doc.specs as ProductSpecs,
  };
}

export async function listDbProducts(): Promise<Product[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
  return docs.map((d) => docToProduct(d as Record<string, unknown>));
}

export async function getDbProductBySlug(slug: string): Promise<Product | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ slug });
  return doc ? docToProduct(doc as Record<string, unknown>) : null;
}

export type UpdateProductInput = CreateProductInput;

export async function upsertDbProductBySlug(
  slug: string,
  input: UpdateProductInput
): Promise<Product> {
  const db = await getDb();
  const existing = await db.collection(COLLECTION).findOne({ slug });
  const doc = {
    slug,
    ...input,
    rating: existing?.rating != null ? Number(existing.rating) : 4.5,
    reviewCount: existing?.reviewCount != null ? Number(existing.reviewCount) : 0,
    updatedAt: new Date(),
    ...(existing ? {} : { createdAt: new Date() }),
  };
  if (existing) {
    await db.collection(COLLECTION).updateOne({ slug }, { $set: doc });
    const updated = await db.collection(COLLECTION).findOne({ slug });
    return docToProduct(updated as Record<string, unknown>);
  }
  const result = await db.collection(COLLECTION).insertOne(doc);
  return docToProduct({ ...doc, _id: result.insertedId });
}

export async function createDbProduct(input: CreateProductInput): Promise<Product> {
  const db = await getDb();
  let baseSlug = slugify(input.name);
  let slug = baseSlug;
  let n = 1;
  while (await db.collection(COLLECTION).findOne({ slug })) {
    slug = `${baseSlug}-${n++}`;
  }
  const doc = {
    slug,
    ...input,
    rating: 4.5,
    reviewCount: 0,
    createdAt: new Date(),
  };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return docToProduct({ ...doc, _id: result.insertedId });
}
