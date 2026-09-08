import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import { deleteStoredUploadByUrl } from "@/lib/media/stored-uploads";
import MediaAsset from "@/models/MediaAsset";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const body = await req.json();
    const asset = await MediaAsset.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
    if (!asset) return jsonError("Asset not found", 404);
    return jsonOk(serialize(asset));
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const asset = await MediaAsset.findById(id);
    if (!asset) return jsonError("Asset not found", 404);

    if (asset.referenceCount > 0) {
      return jsonError("Cannot delete asset that is in use");
    }

    if (asset.publicUrl?.startsWith("/api/uploads/")) {
      await deleteStoredUploadByUrl(asset.publicUrl);
    }

    await asset.deleteOne();
    return jsonOk({ success: true });
  });
}
