export function buildCartLineKey(
  productId: string,
  color?: string,
  size?: string
): string {
  return `${productId}::${color ?? ""}::${size ?? ""}`;
}

export function formatCartVariant(color?: string, size?: string): string {
  const parts: string[] = [];
  if (color) parts.push(`Color: ${color}`);
  if (size) parts.push(`Size: ${size}`);
  return parts.join(" · ");
}
