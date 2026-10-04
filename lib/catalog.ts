import { getDbProductBySlug, listDbProducts } from "@/lib/product-repository";
import type { Product } from "@/types/product";

export type CatalogProduct = Product & {
  catalogSource: "database";
};

export async function listCatalogProducts(): Promise<CatalogProduct[]> {
  try {
    const dbItems = await listDbProducts();
    return dbItems.map((p) => ({ ...p, catalogSource: "database" }));
  } catch {
    return [];
  }
}

export async function getCatalogProductBySlug(slug: string): Promise<CatalogProduct | null> {
  try {
    const fromDb = await getDbProductBySlug(slug);
    if (fromDb) return { ...fromDb, catalogSource: "database" };
  } catch {
    /* no database */
  }
  return null;
}
