import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import Offer from "@/models/Offer";
import { slugify } from "@/lib/commerce/utils";
import { revalidateOffers } from "@/lib/revalidation";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const offer = await Offer.findById(id).lean();
    if (!offer) return jsonError("Offer not found", 404);
    return jsonOk(serialize(offer));
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const body = await req.json();
    const update: Record<string, unknown> = { ...body };
    if (body.slug) update.slug = slugify(body.slug);

    const offer = await Offer.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
    if (!offer) return jsonError("Offer not found", 404);

    revalidateOffers();
    return jsonOk(serialize(offer));
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const offer = await Offer.findByIdAndDelete(id).lean();
    if (!offer) return jsonError("Offer not found", 404);
    revalidateOffers();
    return jsonOk({ success: true });
  });
}
