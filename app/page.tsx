import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { Newsletter } from "@/components/home/newsletter";
import { ProductCard } from "@/components/product/product-card";
import { getBestsellers, getCategories, getCollections, getNewArrivals } from "@/lib/api";

export default async function HomePage() {
  const [bestsellers, newArrivals, categories, collections] = await Promise.all([
    getBestsellers(4),
    getNewArrivals(4),
    getCategories(),
    getCollections(),
  ]);
  const featured = collections[0];

  return (
    <>
      <Hero />
      <section className="container-kashu py-14 sm:py-20 lg:py-32">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink max-w-lg leading-tight">
            Best sellers
          </h2>
          <Link href="/shop" className="text-sm text-muted hover:text-ink underline-offset-4 hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-10 md:gap-x-6">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="container-kashu py-20 md:py-32 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5 md:col-start-1 order-2 md:order-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone/80 mb-4">Featured</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">{featured.name}</h2>
            <p className="mt-4 text-stone/90 text-sm md:text-base max-w-md">{featured.description}</p>
            <Link
              href={`/collections/${featured.slug}`}
              className="inline-block mt-8 text-sm border-b border-accent text-paper pb-1"
            >
              Explore collection
            </Link>
          </div>
          <div className="md:col-span-6 md:col-start-7 relative aspect-[3/2] order-1 md:order-2">
            <Image
              src={featured.heroImage}
              alt={featured.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="container-kashu py-20 md:py-32">
        <h2 className="font-display text-4xl md:text-5xl text-ink mb-12">New arrivals</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="border-y border-line">
        <div className="container-kashu py-20 md:py-28">
          <h2 className="font-display text-3xl md:text-4xl mb-10">Shop by category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 auto-rows-fr">
            {categories.map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`group relative overflow-hidden bg-stone min-h-[140px] sm:min-h-[180px] aspect-[4/5] ${
                  i === 0 ? "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2" : ""
                }`}
              >
                <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-500" sizes="(max-width:640px) 50vw, 20vw" />
                <span className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-paper font-display text-lg sm:text-2xl drop-shadow-sm">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-kashu py-20 md:py-32 max-w-3xl">
        <h2 className="font-display text-4xl text-ink">Made slowly, worn daily</h2>
        <p className="mt-6 text-muted leading-relaxed">
          Kashu began in a Mumbai studio with a simple brief: build leather goods that survive monsoon
          commutes and still look composed at dinner. We work with small ateliers in Kanpur and
          Chennai, favor vegetable tanning, and release in limited runs so nothing sits in warehouse
          limbo.
        </p>
        <Link href="/about" className="inline-block mt-8 text-sm text-ink border-b border-line pb-1">
          Read our story
        </Link>
      </section>

      <Newsletter />
    </>
  );
}
