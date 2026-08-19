import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import Offer from "@/models/Offer";
import { slugify } from "@/lib/commerce/utils";
import { revalidateOffers } from "@/lib/revalidation";

export async function GET() {
  return withAdmin(async () => {
    const items = await Offer.find().sort({ sortOrder: 1, name: 1 }).lean();
    return jsonOk(serialize({ items }));
  });
}

export async function POST(req: NextRequest) {
  return withAdmin(async () => {
    const body = await req.json();
    if (!body.name || body.price === undefined) {
      return jsonError("Name and price are required");
    }

    const slug = body.slug ? slugify(body.slug) : slugify(body.name);
    const existing = await Offer.findOne({ slug });
    if (existing) return jsonError("Slug already exists");

    const offer = await Offer.create({
      name: body.name,
      slug,
      price: body.price,
      currency: body.currency ?? "USD",
      summary: body.summary,
      includedItems: body.includedItems ?? [],
      guaranteedItems: body.guaranteedItems ?? [],
      variableDisclaimer: body.variableDisclaimer,
      sportEventLabel: body.sportEventLabel,
      inventory: body.inventory ?? 0,
      availability: body.availability ?? "available",
      ctaLabel: body.ctaLabel ?? "Request Package",
      ctaHref: body.ctaHref ?? "/contact?inquiry=Buy",
      images: body.images ?? [],
      featured: body.featured ?? false,
      sortOrder: body.sortOrder ?? 0,
      status: body.status ?? "draft",
      seo: body.seo,
    });

    revalidateOffers();
    return jsonOk(serialize(offer), 201);
  });
}
