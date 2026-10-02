import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { getCollectionBySlug, getProductsByCollection } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCollectionBySlug(slug);
  return { title: c?.name ?? "Collection" };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();
  const products = await getProductsByCollection(slug);

  return (
    <>
      <div className="relative h-[50vh] md:h-[65vh]">
        <Image src={collection.heroImage} alt="" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-ink/30" />
        <div className="absolute bottom-0 left-0 right-0 container-kashu pb-12">
          <p className="text-paper/80 text-[11px] uppercase tracking-[0.2em]">{collection.tagline}</p>
          <h1 className="font-display text-paper text-[clamp(2.5rem,6vw,5rem)] mt-2">{collection.name}</h1>
        </div>
      </div>
      <div className="container-kashu py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
