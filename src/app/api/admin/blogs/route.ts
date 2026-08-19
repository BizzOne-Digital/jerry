import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import BlogPost from "@/models/BlogPost";
import { slugify } from "@/lib/commerce/utils";
import { revalidateBlog } from "@/lib/revalidation";

export async function GET() {
  return withAdmin(async () => {
    const items = await BlogPost.find().sort({ publishDate: -1, createdAt: -1 }).lean();
    return jsonOk(serialize({ items }));
  });
}

export async function POST(req: NextRequest) {
  return withAdmin(async () => {
    const body = await req.json();
    if (!body.title || !body.body) {
      return jsonError("Title and body are required");
    }

    const slug = body.slug ? slugify(body.slug) : slugify(body.title);
    const existing = await BlogPost.findOne({ slug });
    if (existing) return jsonError("Slug already exists");

    const post = await BlogPost.create({
      title: body.title,
      slug,
      excerpt: body.excerpt,
      coverImage: body.coverImage,
      authorName: body.authorName ?? "Sodapops Team",
      category: body.category,
      tags: body.tags ?? [],
      body: body.body,
      status: body.status ?? "draft",
      publishDate: body.publishDate,
      seo: body.seo,
    });

    revalidateBlog(slug);
    return jsonOk(serialize(post), 201);
  });
}
