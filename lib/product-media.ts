import { Readable } from "stream";
import { GridFSBucket, ObjectId } from "mongodb";
import sharp from "sharp";
import { MAX_UPLOAD_BYTES } from "@/lib/image-upload-limits";
import { getDb } from "@/lib/mongodb";

const BUCKET = "kashu_product_media";
const MAX_WIDTH = 1400;
const WEBP_QUALITY = 82;
const OPTIMIZE_TIMEOUT_MS = 45_000;

export function mediaUrl(fileId: ObjectId | string): string {
  return `/api/media/${String(fileId)}`;
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise
      .then((v) => {
        clearTimeout(timer);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(timer);
        reject(e);
      });
  });
}

export async function optimizeImageToWebp(input: Buffer): Promise<Buffer> {
  if (input.length > MAX_UPLOAD_BYTES) {
    throw new Error(`Image is too large. Maximum size is ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB.`);
  }

  const work = sharp(input, { failOn: "error", animated: true })
    .rotate()
    .resize({ width: MAX_WIDTH, height: MAX_WIDTH, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 2 })
    .toBuffer();

  try {
    return await withTimeout(
      work,
      OPTIMIZE_TIMEOUT_MS,
      "Image processing timed out. Try a smaller JPEG or PNG, or compress the file."
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not process image.";
    if (/avif|heif|heic|unsupported|Vips/i.test(msg)) {
      throw new Error(
        "Could not read this image format on the server. Export as JPEG or PNG and upload again."
      );
    }
    throw e instanceof Error ? e : new Error(msg);
  }
}

export async function uploadProductImage(
  fileBuffer: Buffer,
  originalName: string
): Promise<string> {
  const optimized = await optimizeImageToWebp(fileBuffer);
  const db = await getDb();
  const bucket = new GridFSBucket(db, { bucketName: BUCKET });
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const filename = `${Date.now()}-${safeName}.webp`;

  const id = await new Promise<ObjectId>((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: { originalName, optimized: true, contentType: "image/webp" },
    });
    uploadStream.on("error", reject);
    uploadStream.on("finish", () => resolve(uploadStream.id as ObjectId));
    Readable.from(optimized).pipe(uploadStream);
  });

  return mediaUrl(id);
}

const MEDIA_PATH = /^\/api\/media\/([a-f0-9]{24})$/i;

export async function deleteProductMediaUrl(url: string): Promise<void> {
  const match = url.trim().match(MEDIA_PATH);
  if (!match || !ObjectId.isValid(match[1])) return;
  const db = await getDb();
  const bucket = new GridFSBucket(db, { bucketName: BUCKET });
  try {
    await bucket.delete(new ObjectId(match[1]));
  } catch {
    /* file may already be gone */
  }
}

export async function deleteProductMediaUrls(urls: string[]): Promise<void> {
  const unique = [...new Set(urls)];
  await Promise.all(unique.map((u) => deleteProductMediaUrl(u)));
}

export async function openProductImageStream(fileId: string) {
  if (!ObjectId.isValid(fileId)) return null;
  const db = await getDb();
  const bucket = new GridFSBucket(db, { bucketName: BUCKET });
  try {
    const stream = bucket.openDownloadStream(new ObjectId(fileId));
    return stream;
  } catch {
    return null;
  }
}
