import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import Service from "@/models/Service";
import { slugify } from "@/lib/commerce/utils";
import { deleteServiceUploads } from "@/lib/media/cleanup-uploads";
import { revalidateService } from "@/lib/revalidation";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const service = await Service.findById(id).lean();
    if (!service) return jsonError("Service not found", 404);
    return jsonOk(serialize(service));
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const body = await req.json();
    const update: Record<string, unknown> = { ...body };

    if (body.slug) update.slug = slugify(body.slug);
    if (body.title && !body.slug) update.slug = slugify(body.title);

    const service = await Service.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
    if (!service) return jsonError("Service not found", 404);

    revalidateService(service.slug);
    return jsonOk(serialize(service));
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const service = await Service.findByIdAndDelete(id).lean();
    if (!service) return jsonError("Service not found", 404);
    await deleteServiceUploads(service as Parameters<typeof deleteServiceUploads>[0]);
    revalidateService(service.slug);
    return jsonOk({ success: true });
  });
}
