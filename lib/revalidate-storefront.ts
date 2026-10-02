import { revalidatePath } from "next/cache";

/** Refresh shop/home/category pages after admin catalog changes. */
export function revalidateStorefrontCatalog(product?: {
  slug: string;
  categorySlug: string;
  collectionSlug?: string;
}) {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");

  if (!product) return;

  revalidatePath(`/products/${product.slug}`);
  revalidatePath(`/category/${product.categorySlug}`);
  if (product.collectionSlug) {
    revalidatePath(`/collections/${product.collectionSlug}`);
  }
}
