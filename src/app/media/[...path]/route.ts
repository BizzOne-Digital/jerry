import { NextRequest, NextResponse } from "next/server";
import { createMediaReadStream, safeMediaPath } from "@/lib/media/upload";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const relativePath = path.join("/");
  const fullPath = safeMediaPath(relativePath);

  if (!fullPath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const stream = createMediaReadStream(fullPath);
  const ext = relativePath.split(".").pop()?.toLowerCase();
  const mime =
    ext === "webp"
      ? "image/webp"
      : ext === "png"
        ? "image/png"
        : ext === "jpg" || ext === "jpeg"
          ? "image/jpeg"
          : "application/octet-stream";

  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      "Content-Type": mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
