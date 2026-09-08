import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import Testimonial from "@/models/Testimonial";
import { revalidateTestimonials } from "@/lib/revalidation";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const item = await Testimonial.findById(id).lean();
    if (!item) return jsonError("Not found", 404);
    return jsonOk(serialize(item));
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const body = await req.json();
    const item = await Testimonial.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
    if (!item) return jsonError("Not found", 404);
    revalidateTestimonials();
    return jsonOk(serialize(item));
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const item = await Testimonial.findByIdAndDelete(id).lean();
    if (!item) return jsonError("Not found", 404);
    revalidateTestimonials();
    return jsonOk({ success: true });
  });
}
