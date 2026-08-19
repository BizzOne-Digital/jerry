import { NextRequest } from "next/server";
import fs from "fs/promises";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import MediaAsset from "@/models/MediaAsset";
import { processAndSaveUpload } from "@/lib/media/upload";

export async function GET(req: NextRequest) {
  return withAdmin(async () => {
    const categoryId = req.nextUrl.searchParams.get("categoryId");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "100", 10);

    const filter = categoryId ? { categoryId } : {};
    const items = await MediaAsset.find(filter).sort({ sortOrder: 1, createdAt: -1 }).limit(limit).lean();
    return jsonOk(serialize({ items }));
  });
}

export async function POST(req: NextRequest) {
  return withAdmin(async (session) => {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const categoryId = formData.get("categoryId") as string | null;
    const altText = formData.get("altText") as string | null;

    if (!file) return jsonError("No file provided");

    const buffer = Buffer.from(await file.arrayBuffer());
    const processed = await processAndSaveUpload(buffer, file.name);

    const asset = await MediaAsset.create({
      originalName: file.name,
      diskPath: processed.diskPath,
      publicUrl: processed.publicUrl,
      mimeType: processed.mimeType,
      byteSize: processed.byteSize,
      width: processed.width,
      height: processed.height,
      altText: altText ?? file.name,
      categoryId: categoryId || undefined,
      uploadedBy: session.user.id,
      variants: processed.variants,
    });

    return jsonOk(serialize(asset), 201);
  });
}
