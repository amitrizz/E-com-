import { categories } from "@/data/categories";
import { collections } from "@/data/collections";
import { products as seedProducts } from "@/data/products";
import { getDbProductBySlug, listDbProducts } from "@/lib/product-repository";
import type { Category, Collection, Product } from "@/types/product";

async function allProducts(): Promise<Product[]> {
  let dbItems: Product[] = [];
  try {
    dbItems = await listDbProducts();
  } catch {
    dbItems = [];
  }
  const slugs = new Set(dbItems.map((p) => p.slug));
  const seed = seedProducts.filter((p) => !slugs.has(p.slug));
  return [...dbItems, ...seed];
}

export async function getProducts(): Promise<Product[]> {
  return allProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const fromDb = await getDbProductBySlug(slug);
    if (fromDb) return fromDb;
  } catch {
    /* fall through */
  }
  return seedProducts.find((p) => p.slug === slug) ?? null;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const products = await allProducts();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.categorySlug.includes(q)
  );
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const products = await allProducts();
  return products.filter((p) => p.categorySlug === slug);
}

export async function getProductsByCollection(slug: string): Promise<Product[]> {
  const products = await allProducts();
  return products.filter((p) => p.collectionSlug === slug);
}

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getCollections(): Promise<Collection[]> {
  return collections;
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  return collections.find((c) => c.slug === slug) ?? null;
}

export async function getBestsellers(limit = 8): Promise<Product[]> {
  const products = await allProducts();
  return products.filter((p) => p.badge === "Bestseller").slice(0, limit);
}

export async function getNewArrivals(limit = 6): Promise<Product[]> {
  const products = await allProducts();
  return products.filter((p) => p.badge === "New").slice(0, limit);
}
