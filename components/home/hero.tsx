import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[72vh] sm:min-h-[80vh] md:min-h-[88vh] lg:min-h-[92vh] flex items-end">
      <Image
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=80"
        alt="Editorial outerwear in warm light"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/30 to-transparent" />
      <div className="container-kashu relative pb-12 sm:pb-16 md:pb-24 pt-24 sm:pt-28 md:pt-32 reveal">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
          Indian D2C · Leather & outerwear
        </p>
        <h1
          className="font-display text-ink max-w-[12ch] leading-[0.95] text-[clamp(3rem,8vw,7rem)]"
        >
          Quiet pieces for loud cities.
        </h1>
        <p className="mt-6 max-w-md text-muted text-base md:text-lg">
          Kashu edits essentials for commutes, monsoon evenings, and cabins overhead—without
          the noise of fast fashion.
        </p>
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <Link
            href="/shop"
            className="inline-flex h-12 items-center justify-center px-8 bg-ink text-paper text-sm tracking-wide hover:bg-charcoal transition-colors duration-300 touch-target w-full sm:w-auto"
          >
            Shop the edit
          </Link>
          <Link
            href="/collections/atelier-leather"
            className="inline-flex h-12 items-center justify-center px-8 border border-ink text-sm tracking-wide hover:bg-stone transition-colors duration-300 touch-target w-full sm:w-auto"
          >
            Atelier leather
          </Link>
        </div>
      </div>
    </section>
  );
}
