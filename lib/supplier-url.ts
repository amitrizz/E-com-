export function normalizeSupplierUrl(raw: string | undefined | null): string | undefined {
  const trimmed = raw?.trim();
  if (!trimmed) return undefined;
  try {
    const href = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    const url = new URL(href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}
