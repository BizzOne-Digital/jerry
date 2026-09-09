import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import Product from "@/models/Product";
import { slugify } from "@/lib/commerce/utils";
import { deleteProductUploads } from "@/lib/media/cleanup-uploads";
import { revalidateProduct } from "@/lib/revalidation";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const product = await Product.findById(id).lean();
    if (!product) return jsonError("Product not found", 404);
    return jsonOk(serialize(product));
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const body = await req.json();
    const update: Record<string, unknown> = { ...body };
    if (body.slug) update.slug = slugify(body.slug);
    if (body.sku) update.sku = String(body.sku).toUpperCase().trim();

    const product = await Product.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
    if (!product) return jsonError("Product not found", 404);

    revalidateProduct(product.slug);
    return jsonOk(serialize(product));
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const product = await Product.findByIdAndDelete(id).lean();
    if (!product) return jsonError("Product not found", 404);
    await deleteProductUploads(product as Parameters<typeof deleteProductUploads>[0]);
    revalidateProduct(product.slug);
    return jsonOk({ success: true });
  });
}
