import { getProductDisplayContent } from "@/lib/parse-product-description";
import type { Product } from "@/types/product";

export function ProductDescriptionBlock({ product }: { product: Product }) {
  const { summary, specDetails, showLegacySpecs } = getProductDisplayContent(product);

  return (
    <div className="mt-6 sm:mt-8">
      {summary && (
        <p className="text-muted leading-relaxed text-[15px] sm:text-base">{summary}</p>
      )}

      {specDetails.length > 0 && (
        <section className="mt-8 sm:mt-10 border-t border-line pt-6 sm:pt-8">
          <h2 className="text-sm font-medium text-ink mb-5">Product details</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 text-sm">
            {specDetails.map((row) => (
              <div key={`${row.label}-${row.value.slice(0, 24)}`} className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wider text-muted">{row.label}</dt>
                <dd className="mt-1 text-charcoal leading-snug break-words">{row.value || "—"}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {showLegacySpecs && (
        <dl className="mt-8 sm:mt-12 space-y-3 text-sm border-t border-line pt-6 sm:pt-8 pb-2">
          <div>
            <dt className="text-muted inline">Material: </dt>
            <dd className="inline text-charcoal">{product.specs.material}</dd>
          </div>
          <div>
            <dt className="text-muted inline">Care: </dt>
            <dd className="inline text-charcoal">{product.specs.care}</dd>
          </div>
          <div>
            <dt className="text-muted inline">Origin: </dt>
            <dd className="inline text-charcoal">{product.specs.origin}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
