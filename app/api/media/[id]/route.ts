import { Readable } from "stream";
import { openProductImageStream } from "@/lib/product-media";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const stream = await openProductImageStream(id);
  if (!stream) {
    return new Response("Not found", { status: 404 });
  }

  const webStream = Readable.toWeb(stream) as ReadableStream;

  return new Response(webStream, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
