import { NextResponse } from "next/server";
import { getBearerUser, requireAdmin } from "@/lib/auth-server";
import { MAX_UPLOAD_BYTES } from "@/lib/image-upload-limits";
import { uploadProductImage } from "@/lib/product-media";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILES = 6;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

function isAllowedImage(file: File): boolean {
  if (ALLOWED.has(file.type)) return true;
  const name = file.name.toLowerCase();
  return /\.(jpe?g|png|webp|gif|avif)$/.test(name);
}

export async function POST(request: Request) {
  try {
    requireAdmin(await getBearerUser(request.headers.get("authorization")));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const entries = formData.getAll("files").filter((f): f is File => f instanceof File);
    if (entries.length === 0) {
      return NextResponse.json({ error: "No images selected." }, { status: 400 });
    }
    if (entries.length > MAX_FILES) {
      return NextResponse.json({ error: `Maximum ${MAX_FILES} images per upload.` }, { status: 400 });
    }

    const urls: string[] = [];
    for (const file of entries) {
      if (!isAllowedImage(file)) {
        return NextResponse.json(
          {
            error: `Unsupported type: ${file.type || "unknown"}. Use JPEG, PNG, WebP, GIF, or AVIF.`,
          },
          { status: 400 }
        );
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        return NextResponse.json(
          {
            error: `“${file.name}” exceeds ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB. Compress or use JPEG/PNG.`,
          },
          { status: 400 }
        );
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const url = await uploadProductImage(buffer, file.name);
      urls.push(url);
    }

    return NextResponse.json({ urls });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
