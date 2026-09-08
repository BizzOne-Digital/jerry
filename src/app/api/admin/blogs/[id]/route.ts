import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import BlogPost from "@/models/BlogPost";
import { slugify } from "@/lib/commerce/utils";
import { revalidateBlog } from "@/lib/revalidation";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const item = await BlogPost.findById(id).lean();
    if (!item) return jsonError("Not found", 404);
    return jsonOk(serialize(item));
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const body = await req.json();
    if (body.slug) body.slug = slugify(body.slug);

    const item = await BlogPost.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
    if (!item) return jsonError("Not found", 404);

    revalidateBlog(item.slug);
    return jsonOk(serialize(item));
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const item = await BlogPost.findByIdAndDelete(id).lean();
    if (!item) return jsonError("Not found", 404);
    revalidateBlog(item.slug);
    return jsonOk({ success: true });
  });
}
