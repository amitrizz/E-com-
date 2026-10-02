import type { Product, ProductSpecDetail } from "@/types/product";

export type ParsedProductText = {
  summary: string;
  specDetails: ProductSpecDetail[];
};

/** Turn pasted "Label: value" blocks into structured specs for the storefront. */
export function parsePastedProductText(raw: string): ParsedProductText {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const specDetails: ProductSpecDetail[] = [];
  const intro: string[] = [];

  for (const line of lines) {
    const match = line.match(/^([^:]{1,120}):\s*(.*)$/);
    if (match) {
      const label = match[1].trim();
      const value = match[2].trim();
      if (label.toLowerCase() === "name" && !value) continue;
      specDetails.push({ label, value });
      continue;
    }

    if (specDetails.length > 0 && !line.includes(":")) {
      const last = specDetails[specDetails.length - 1];
      last.value = last.value ? `${last.value} — ${line}` : line;
      continue;
    }

    intro.push(line);
  }

  const summary = intro.join(" ").trim();
  return { summary, specDetails };
}

export function getProductDisplayContent(product: Product): {
  summary: string;
  specDetails: ProductSpecDetail[];
  showLegacySpecs: boolean;
} {
  if (product.specDetails?.length) {
    return {
      summary: product.description,
      specDetails: product.specDetails,
      showLegacySpecs: false,
    };
  }

  const parsed = parsePastedProductText(product.description);
  if (parsed.specDetails.length >= 2) {
    return {
      summary: parsed.summary,
      specDetails: parsed.specDetails,
      showLegacySpecs: false,
    };
  }

  return {
    summary: product.description,
    specDetails: [],
    showLegacySpecs: true,
  };
}

export function formatProductTextForEditor(product: Product): string {
  if (product.specDetails?.length) {
    const block = product.specDetails.map((d) => `${d.label}: ${d.value}`).join("\n");
    return product.description ? `${product.description}\n\n${block}` : block;
  }
  return product.description;
}

export function inferSpecsFromDetails(
  details: ProductSpecDetail[],
  fallback: Product["specs"]
): Product["specs"] {
  const valueFor = (...labels: string[]) => {
    const lower = labels.map((l) => l.toLowerCase());
    const row = details.find((d) => lower.includes(d.label.toLowerCase()));
    return row?.value?.trim();
  };

  return {
    material:
      valueFor("Strap Material", "Case/Bezel Material", "Material") ?? fallback.material,
    dimensions: valueFor("Sizes", "Dimensions", "Dial Diameter") ?? fallback.dimensions,
    care: valueFor("Care") ?? fallback.care,
    origin: valueFor("Country of Origin", "Origin") ?? fallback.origin,
  };
}
