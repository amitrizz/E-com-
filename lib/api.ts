import { categories } from "@/data/categories";
import { collections } from "@/data/collections";
import { getDbProductBySlug, listDbProducts } from "@/lib/product-repository";
import type { Category, Collection, Product } from "@/types/product";

async function allProducts(): Promise<Product[]> {
  try {
    return await listDbProducts();
  } catch {
    return [];
  }
}

export async function getProducts(): Promise<Product[]> {
  return allProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await getDbProductBySlug(slug);
  } catch {
    return null;
  }
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
