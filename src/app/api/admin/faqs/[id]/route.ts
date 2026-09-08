import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import FAQ from "@/models/FAQ";
import { revalidateFaqs } from "@/lib/revalidation";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const item = await FAQ.findById(id).lean();
    if (!item) return jsonError("Not found", 404);
    return jsonOk(serialize(item));
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const body = await req.json();
    const item = await FAQ.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
    if (!item) return jsonError("Not found", 404);
    revalidateFaqs();
    return jsonOk(serialize(item));
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const item = await FAQ.findByIdAndDelete(id).lean();
    if (!item) return jsonError("Not found", 404);
    revalidateFaqs();
    return jsonOk({ success: true });
  });
}
