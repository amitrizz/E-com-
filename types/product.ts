export type ProductBadge = "New" | "Bestseller" | "Sale";

export type ProductSpecs = {
  material: string;
  dimensions: string;
  care: string;
  origin: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceInr: number;
  compareAtInr?: number;
  categorySlug: string;
  collectionSlug?: string;
  colors: string[];
  sizes?: string[];
  /** Optimized size chart served from `/api/media/...` when uploaded in admin */
  sizeChartImage?: string;
  images: string[];
  badge?: ProductBadge;
  stock: number;
  rating: number;
  reviewCount: number;
  specs: ProductSpecs;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

export type Collection = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
};
