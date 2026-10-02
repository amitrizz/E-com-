import { products as seedProducts } from "@/data/products";
import { getDbProductBySlug, listDbProducts } from "@/lib/product-repository";
import type { Product } from "@/types/product";

export type CatalogProduct = Product & {
  catalogSource: "seed" | "database";
};

export async function listCatalogProducts(): Promise<CatalogProduct[]> {
  let dbItems: Product[] = [];
  try {
    dbItems = await listDbProducts();
  } catch {
    dbItems = [];
  }
  const dbSlugs = new Set(dbItems.map((p) => p.slug));
  const fromDb: CatalogProduct[] = dbItems.map((p) => ({
    ...p,
    catalogSource: "database",
  }));
  const fromSeed: CatalogProduct[] = seedProducts
    .filter((p) => !dbSlugs.has(p.slug))
    .map((p) => ({ ...p, catalogSource: "seed" }));
  return [...fromDb, ...fromSeed];
}

export async function getCatalogProductBySlug(slug: string): Promise<CatalogProduct | null> {
  try {
    const fromDb = await getDbProductBySlug(slug);
    if (fromDb) return { ...fromDb, catalogSource: "database" };
  } catch {
    /* fall through */
  }
  const seed = seedProducts.find((p) => p.slug === slug);
  if (seed) return { ...seed, catalogSource: "seed" };
  return null;
}
