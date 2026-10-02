/** Vercel serverless request body limit is ~4.5MB; keep in sync with UI copy. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export function formatMaxUploadMb(): string {
  return `${MAX_UPLOAD_BYTES / (1024 * 1024)}MB`;
}
