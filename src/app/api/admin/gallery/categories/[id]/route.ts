import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import MediaCategory from "@/models/MediaCategory";
import MediaAsset from "@/models/MediaAsset";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const category = await MediaCategory.findById(id).lean();
    if (!category) return jsonError("Category not found", 404);
    return jsonOk(serialize(category));
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const body = await req.json();
    const category = await MediaCategory.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
    if (!category) return jsonError("Category not found", 404);
    return jsonOk(serialize(category));
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const assetCount = await MediaAsset.countDocuments({ categoryId: id });
    if (assetCount > 0) {
      return jsonError("Cannot delete category with assets. Move or delete assets first.");
    }
    const category = await MediaCategory.findByIdAndDelete(id).lean();
    if (!category) return jsonError("Category not found", 404);
    return jsonOk({ success: true });
  });
}
