import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import MediaCategory from "@/models/MediaCategory";
import { slugify } from "@/lib/commerce/utils";

export async function GET() {
  return withAdmin(async () => {
    const items = await MediaCategory.find().sort({ sortOrder: 1, name: 1 }).lean();
    return jsonOk(serialize({ items }));
  });
}

export async function POST(req: NextRequest) {
  return withAdmin(async () => {
    const body = await req.json();
    if (!body.name) return jsonError("Name is required");

    const slug = body.slug ? slugify(body.slug) : slugify(body.name);
    const existing = await MediaCategory.findOne({ slug });
    if (existing) return jsonError("Slug already exists");

    const category = await MediaCategory.create({
      name: body.name,
      slug,
      coverImageUrl: body.coverImageUrl,
      sortOrder: body.sortOrder ?? 0,
      status: body.status ?? "active",
    });

    return jsonOk(serialize(category), 201);
  });
}
