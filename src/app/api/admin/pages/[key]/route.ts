import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import Page from "@/models/Page";
import { revalidatePage } from "@/lib/revalidation";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  return withAdmin(async () => {
    const page = await Page.findOne({ key }).lean();
    if (!page) return jsonError("Page not found", 404);
    return jsonOk(serialize(page));
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  return withAdmin(async () => {
    const body = await req.json();
    const page = await Page.findOneAndUpdate(
      { key },
      {
        $set: {
          ...(body.title !== undefined && { title: body.title }),
          ...(body.status !== undefined && { status: body.status }),
          ...(body.sections !== undefined && { sections: body.sections }),
          ...(body.seo !== undefined && { seo: body.seo }),
        },
      },
      { new: true }
    ).lean();

    if (!page) return jsonError("Page not found", 404);
    revalidatePage(key);
    return jsonOk(serialize(page));
  });
}
