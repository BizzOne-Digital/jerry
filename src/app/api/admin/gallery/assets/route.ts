import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import MediaAsset from "@/models/MediaAsset";
import {
  deleteStoredUploadByUrl,
  isUploadFolder,
  MAX_STORED_UPLOAD_BYTES,
  mimeToExtension,
  saveStoredUpload,
  STORED_UPLOAD_MIMES,
} from "@/lib/media/stored-uploads";

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

    if (file.size > MAX_STORED_UPLOAD_BYTES) {
      return jsonError("File exceeds maximum size of 8MB");
    }

    const mimeType = file.type || "application/octet-stream";
    if (!STORED_UPLOAD_MIMES.has(mimeType) || !mimeToExtension(mimeType)) {
      return jsonError("Unsupported image format");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const saved = await saveStoredUpload("gallery", buffer, mimeType);

    const asset = await MediaAsset.create({
      originalName: file.name,
      diskPath: `stored://gallery/${saved.filename}`,
      publicUrl: saved.url,
      mimeType,
      byteSize: saved.size,
      altText: altText ?? file.name,
      categoryId: categoryId || undefined,
      uploadedBy: session.user.id,
      variants: [],
    });

    return jsonOk(serialize(asset), 201);
  });
}
