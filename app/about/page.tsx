import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container-kashu py-16 md:py-24 max-w-2xl">
      <h1 className="font-display text-5xl text-ink">Our story</h1>
      <p className="mt-8 text-muted leading-relaxed">
        Kashu is a Mumbai-born label focused on leather accessories and outerwear for people who
        move between heat, rain, and air-conditioned rooms in a single day. We design in-house,
        produce in small runs with partner ateliers, and ship directly to you—no wholesale markup,
        no trend churn.
      </p>
      <p className="mt-6 text-muted leading-relaxed">
        Every piece is meant to soften with use: edges that darken, leather that records your
        commute. That is the luxury we care about—not logos, but longevity.
      </p>
    </div>
  );
}
