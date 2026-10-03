import { NextResponse } from "next/server";
import { getBearerUser, requireAdmin } from "@/lib/auth-server";
import { getCatalogProductBySlug } from "@/lib/catalog";
import { deleteProductMediaUrls } from "@/lib/product-media";
import { revalidateStorefrontCatalog } from "@/lib/revalidate-storefront";
import { deleteDbProductBySlug, upsertDbProductBySlug } from "@/lib/product-repository";
import { normalizeSupplierUrl } from "@/lib/supplier-url";
import type { UpdateProductInput } from "@/lib/product-repository";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    requireAdmin(await getBearerUser(request.headers.get("authorization")));
    const { slug } = await context.params;
    const product = await getCatalogProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Could not load product." }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    requireAdmin(await getBearerUser(request.headers.get("authorization")));
    const { slug } = await context.params;
    const existing = await getCatalogProductBySlug(slug);
    if (!existing) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const body = (await request.json()) as UpdateProductInput;
    if (!body.name?.trim() || !body.categorySlug || !body.priceInr) {
      return NextResponse.json({ error: "Name, category, and price are required." }, { status: 400 });
    }
    if (!body.images?.length || !body.images[0]?.trim()) {
      return NextResponse.json({ error: "At least one image is required." }, { status: 400 });
    }

    const product = await upsertDbProductBySlug(slug, {
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
      specs: body.specs ?? existing.specs,
      badge:
        body.badge === "New" || body.badge === "Bestseller" || body.badge === "Sale"
          ? body.badge
          : undefined,
    });

    revalidateStorefrontCatalog(product);

    return NextResponse.json({ product });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Could not save product." }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    requireAdmin(await getBearerUser(request.headers.get("authorization")));
    const { slug } = await context.params;

    const removed = await deleteDbProductBySlug(slug);
    if (!removed) {
      return NextResponse.json(
        {
          error:
            "This demo catalog item is not in the database. Only saved or edited products can be deleted.",
        },
        { status: 400 }
      );
    }

    const mediaUrls = [
      ...removed.images,
      ...(removed.sizeChartImage ? [removed.sizeChartImage] : []),
    ];
    await deleteProductMediaUrls(mediaUrls);
    revalidateStorefrontCatalog(removed);

    return NextResponse.json({ ok: true, slug });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Could not delete product." }, { status: 500 });
  }
}
