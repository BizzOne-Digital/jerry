import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import Product from "@/models/Product";
import { slugify } from "@/lib/commerce/utils";
import { revalidateProduct } from "@/lib/revalidation";

export async function GET() {
  return withAdmin(async () => {
    const items = await Product.find().sort({ createdAt: -1 }).lean();
    return jsonOk(serialize({ items }));
  });
}

export async function POST(req: NextRequest) {
  return withAdmin(async () => {
    const body = await req.json();
    if (!body.name || !body.sku || body.price === undefined) {
      return jsonError("Name, SKU, and price are required");
    }

    const slug = body.slug ? slugify(body.slug) : slugify(body.name);
    const sku = String(body.sku).toUpperCase().trim();

    const existing = await Product.findOne({ $or: [{ slug }, { sku }] });
    if (existing) return jsonError("Slug or SKU already exists");

    const product = await Product.create({
      name: body.name,
      slug,
      sku,
      category: body.category ?? "Cards",
      tags: body.tags ?? [],
      shortDescription: body.shortDescription,
      longDescription: body.longDescription,
      price: body.price,
      compareAtPrice: body.compareAtPrice,
      stock: body.stock ?? 0,
      lowStockThreshold: body.lowStockThreshold ?? 3,
      allowBackorder: body.allowBackorder ?? false,
      condition: body.condition,
      featured: body.featured ?? false,
      onSale: body.onSale ?? false,
      status: body.status ?? "draft",
      images: body.images ?? [],
      seo: body.seo,
    });

    revalidateProduct(slug);
    return jsonOk(serialize(product), 201);
  });
}
