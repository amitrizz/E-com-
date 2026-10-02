import { MAX_UPLOAD_BYTES } from "@/lib/image-upload-limits";

const UPLOAD_TIMEOUT_MS = 90_000;

export async function uploadAdminImages(
  files: File[],
  token: string | null
): Promise<{ urls?: string[]; error?: string }> {
  if (!token) {
    return { error: "Session expired. Sign in again and retry." };
  }

  for (const file of files) {
    if (file.size > MAX_UPLOAD_BYTES) {
      return {
        error: `“${file.name}” is too large. Max ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB per file on this host.`,
      };
    }
  }

  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  try {
    const res = await fetch("/api/admin/upload-images", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      signal: controller.signal,
    });

    let data: { urls?: string[]; error?: string } = {};
    try {
      data = await res.json();
    } catch {
      return {
        error: res.ok
          ? "Upload failed."
          : `Upload failed (${res.status}). Check DATABASE_URL on the server and try a smaller JPEG/PNG.`,
      };
    }

    if (!res.ok) {
      return { error: data.error ?? "Upload failed." };
    }
    return { urls: data.urls };
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      return {
        error:
          "Upload timed out. Use a smaller image (under 4MB) or JPEG/PNG instead of AVIF.",
      };
    }
    return { error: "Upload failed. Check your connection and try again." };
  } finally {
    clearTimeout(timer);
  }
}
