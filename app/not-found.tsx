import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-kashu py-32 text-center">
      <h1 className="font-display text-5xl text-ink">Page not found</h1>
      <p className="mt-4 text-muted">The piece you are looking for may have sold through.</p>
      <Link href="/shop" className="inline-block mt-8 text-sm border-b border-ink pb-1">
        Return to shop
      </Link>
    </div>
  );
}
