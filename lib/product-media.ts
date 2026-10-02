import { Readable } from "stream";
import { GridFSBucket, ObjectId } from "mongodb";
import sharp from "sharp";
import { getDb } from "@/lib/mongodb";

const BUCKET = "kashu_product_media";
const MAX_WIDTH = 1400;
const WEBP_QUALITY = 82;
const MAX_INPUT_BYTES = 8 * 1024 * 1024;

export function mediaUrl(fileId: ObjectId | string): string {
  return `/api/media/${String(fileId)}`;
}

export async function optimizeImageToWebp(input: Buffer): Promise<Buffer> {
  if (input.length > MAX_INPUT_BYTES) {
    throw new Error("Image is too large. Maximum size is 8MB.");
  }
  return sharp(input)
    .rotate()
    .resize({ width: MAX_WIDTH, height: MAX_WIDTH, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();
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
