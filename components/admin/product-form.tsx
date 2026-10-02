"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductImageUpload } from "@/components/admin/product-image-upload";
import { SizeChartUpload } from "@/components/admin/size-chart-upload";
import { authHeaders, useAuth } from "@/hooks/auth-context";
import type { CatalogProduct } from "@/lib/catalog";
import {
  formatProductTextForEditor,
  inferSpecsFromDetails,
  parsePastedProductText,
} from "@/lib/parse-product-description";

const CATEGORIES = [
  { slug: "bags", label: "Bags" },
  { slug: "outerwear", label: "Outerwear" },
  { slug: "accessories", label: "Accessories" },
  { slug: "footwear", label: "Footwear" },
  { slug: "home", label: "Home" },
];

type Props =
  | { mode: "create" }
  | { mode: "edit"; initial: CatalogProduct };

export function ProductForm(props: Props) {
  const { token } = useAuth();
  const router = useRouter();
  const initial = props.mode === "edit" ? props.initial : null;

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(initial?.images ?? []);
  const [sizeChartUrl, setSizeChartUrl] = useState<string | null>(
    initial?.sizeChartImage ?? null
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (imageUrls.length === 0) {
      setError("Add at least one product image.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const rawDescription = String(fd.get("description") ?? "").trim();
    if (!rawDescription) {
      setError("Add a description or paste specification lines.");
      return;
    }
    setPending(true);
    const colors = String(fd.get("colors") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const sizesRaw = String(fd.get("sizes") ?? "").trim();
    const sizes = sizesRaw
      ? sizesRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;

    const parsed = parsePastedProductText(rawDescription);
    const formSpecs = {
      material: String(fd.get("material")),
      dimensions: String(fd.get("dimensions")),
      care: String(fd.get("care")),
      origin: String(fd.get("origin")),
    };
    const specs =
      parsed.specDetails.length > 0
        ? inferSpecsFromDetails(parsed.specDetails, formSpecs)
        : formSpecs;

    const body = {
      name: String(fd.get("name")),
      description:
        parsed.summary ||
        (parsed.specDetails.length > 0
          ? String(fd.get("name")).trim()
          : rawDescription),
      specDetails: parsed.specDetails.length > 0 ? parsed.specDetails : undefined,
      priceInr: Number(fd.get("priceInr")),
      compareAtInr: fd.get("compareAtInr") ? Number(fd.get("compareAtInr")) : undefined,
      categorySlug: String(fd.get("categorySlug")),
      collectionSlug: String(fd.get("collectionSlug") || "") || undefined,
      stock: Number(fd.get("stock") ?? 0),
      colors,
      sizes,
      sizeChartImage: sizeChartUrl ?? undefined,
      images: imageUrls,
      badge: String(fd.get("badge") || "") || undefined,
      specs,
    };

    const isEdit = props.mode === "edit";
    const res = await fetch(
      isEdit ? `/api/admin/products/${initial!.slug}` : "/api/admin/products",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify(body),
      }
    );
    const data = await res.json();
    setPending(false);
    if (!res.ok) {
      setError(data.error ?? "Could not save product");
      return;
    }
    router.push(`/admin/products`);
    router.refresh();
  }

  const colorsDefault = initial?.colors?.join(", ") ?? "";
  const sizesDefault = initial?.sizes?.join(", ") ?? "";

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      {props.mode === "edit" && initial && (
        <p className="text-xs text-muted">
          Slug: <span className="text-charcoal">{initial.slug}</span>
          {initial.catalogSource === "seed" && (
            <span className="ml-2 text-accent">· Saving will store this product in MongoDB</span>
          )}
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Field label="Product title" name="name" required defaultValue={initial?.name} />
        <div>
          <label className="block text-sm mb-2">Category</label>
          <select
            name="categorySlug"
            required
            defaultValue={initial?.categorySlug ?? "bags"}
            className="w-full h-12 border border-line px-3 text-sm bg-paper"
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm mb-2">Description &amp; specifications</label>
        <p className="text-xs text-muted mb-2">
          Paste supplier text with one line per field, e.g.{" "}
          <span className="text-charcoal">Dial Color: Rose Gold</span>. Optional intro lines
          without a colon appear above the spec grid on the product page.
        </p>
        <textarea
          name="description"
          rows={14}
          defaultValue={initial ? formatProductTextForEditor(initial) : undefined}
          placeholder={`NEW ARRIVAL FANCY WOMEN WATCH\n\nName: Example Watch\nStrap Material: Alloy\nDial Color: Rose Gold\nCountry of Origin: India`}
          className="w-full border border-line p-3 text-sm bg-paper font-mono text-[13px] leading-relaxed"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Field
          label="Price (INR)"
          name="priceInr"
          type="number"
          required
          defaultValue={initial?.priceInr != null ? String(initial.priceInr) : undefined}
        />
        <Field
          label="Compare-at (optional)"
          name="compareAtInr"
          type="number"
          defaultValue={
            initial?.compareAtInr != null ? String(initial.compareAtInr) : undefined
          }
        />
        <Field
          label="Stock"
          name="stock"
          type="number"
          required
          defaultValue={initial?.stock != null ? String(initial.stock) : "10"}
        />
      </div>

      <Field
        label="Colors (comma-separated)"
        name="colors"
        placeholder="Cognac, Black"
        defaultValue={colorsDefault}
      />

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <Field
          label="Sizes (comma-separated, optional)"
          name="sizes"
          placeholder="S, M, L, XL"
          defaultValue={sizesDefault}
        />
        <SizeChartUpload value={sizeChartUrl} onChange={setSizeChartUrl} />
      </div>

      <ProductImageUpload value={imageUrls} onChange={setImageUrls} />

      <fieldset className="border border-line p-4 space-y-4">
        <legend className="text-sm px-1">Specifications</legend>
        <Field
          label="Material"
          name="material"
          required
          defaultValue={initial?.specs.material ?? "Full-grain leather"}
        />
        <Field
          label="Dimensions"
          name="dimensions"
          required
          defaultValue={initial?.specs.dimensions ?? "See product imagery"}
        />
        <Field
          label="Care"
          name="care"
          required
          defaultValue={initial?.specs.care ?? "Store dry; condition quarterly"}
        />
        <Field
          label="Origin"
          name="origin"
          required
          defaultValue={initial?.specs.origin ?? "Crafted in India"}
        />
      </fieldset>

      <div className="grid md:grid-cols-2 gap-4">
        <Field
          label="Collection slug (optional)"
          name="collectionSlug"
          placeholder="atelier-leather"
          defaultValue={initial?.collectionSlug}
        />
        <div>
          <label className="block text-sm mb-2">Badge (optional)</label>
          <select
            name="badge"
            defaultValue={initial?.badge ?? ""}
            className="w-full h-12 border border-line px-3 text-sm bg-paper"
          >
            <option value="">None</option>
            <option value="New">New</option>
            <option value="Bestseller">Bestseller</option>
            <option value="Sale">Sale</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}

      <button type="submit" disabled={pending} className="h-12 px-10 bg-ink text-paper text-sm disabled:opacity-60">
        {pending
          ? "Saving…"
          : props.mode === "edit"
            ? "Save changes"
            : "Publish product"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-sm mb-2" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full h-12 border border-line px-3 text-sm bg-paper outline-none focus:ring-1 focus:ring-accent"
      />
    </div>
  );
}
