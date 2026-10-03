import { NextResponse } from "next/server";
import { getBearerUser, requireAdmin } from "@/lib/auth-server";
import { listCatalogProducts } from "@/lib/catalog";
import { revalidateStorefrontCatalog } from "@/lib/revalidate-storefront";
import { createDbProduct } from "@/lib/product-repository";
import { normalizeSupplierUrl } from "@/lib/supplier-url";
import type { CreateProductInput } from "@/lib/product-repository";

export async function GET(request: Request) {
  try {
    const user = requireAdmin(await getBearerUser(request.headers.get("authorization")));
    void user;
    const products = await listCatalogProducts();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    requireAdmin(await getBearerUser(request.headers.get("authorization")));
    const body = (await request.json()) as CreateProductInput;
    if (!body.name?.trim() || !body.categorySlug || !body.priceInr) {
      return NextResponse.json({ error: "Name, category, and price are required." }, { status: 400 });
    }
    if (!body.images?.length || !body.images[0]?.trim()) {
      return NextResponse.json({ error: "At least one image URL is required." }, { status: 400 });
    }
    const product = await createDbProduct({
      name: body.name.trim(),
      description: body.description?.trim() || "",
      priceInr: Number(body.priceInr),
      compareAtInr: body.compareAtInr ? Number(body.compareAtInr) : undefined,
      categorySlug: body.categorySlug,
      collectionSlug: body.collectionSlug || undefined,
      colors: body.colors?.length ? body.colors : ["Default"],
      sizes: body.sizes?.length ? body.sizes : undefined,
      sizeChartImage: body.sizeChartImage?.trim() || undefined,
      images: body.images.map((u) => u.trim()).filter(Boolean),
      stock: Number(body.stock ?? 0),
      specDetails: body.specDetails?.length ? body.specDetails : undefined,
      supplierUrl: normalizeSupplierUrl(body.supplierUrl),
      specs: body.specs ?? {
        material: "See description",
        dimensions: "—",
        care: "Store dry",
        origin: "India",
      },
      badge:
        body.badge === "New" || body.badge === "Bestseller" || body.badge === "Sale"
          ? body.badge
          : undefined,
    });
    revalidateStorefrontCatalog(product);
    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Could not create product." }, { status: 500 });
  }
}
