import { NextResponse } from "next/server";
import { getStoredUpload, isSafeFilename, isUploadFolder } from "@/lib/media/stored-uploads";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ folder: string; filename: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { folder, filename } = await params;

  if (!isUploadFolder(folder) || !isSafeFilename(filename)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const doc = await getStoredUpload(folder, filename);
  if (!doc?.data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = Buffer.isBuffer(doc.data) ? doc.data : Buffer.from(doc.data as unknown as Uint8Array);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Length": String(doc.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
