import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import Service from "@/models/Service";
import { slugify } from "@/lib/commerce/utils";
import { revalidateService } from "@/lib/revalidation";

export async function GET() {
  return withAdmin(async () => {
    const items = await Service.find().sort({ sortOrder: 1, title: 1 }).lean();
    return jsonOk(serialize({ items }));
  });
}

export async function POST(req: NextRequest) {
  return withAdmin(async () => {
    const body = await req.json();
    if (!body.title || !body.shortDescription) {
      return jsonError("Title and short description are required");
    }

    const slug = body.slug ? slugify(body.slug) : slugify(body.title);
    const existing = await Service.findOne({ slug });
    if (existing) return jsonError("Slug already exists");

    const service = await Service.create({
      title: body.title,
      slug,
      shortDescription: body.shortDescription,
      cardImage: body.cardImage,
      iconAccent: body.iconAccent ?? "gold",
      ctaLabel: body.ctaLabel ?? "Learn More",
      sortOrder: body.sortOrder ?? 0,
      status: body.status ?? "draft",
      detailHero: body.detailHero,
      overview: body.overview,
      benefits: body.benefits ?? [],
      processSteps: body.processSteps ?? [],
      importantNotes: body.importantNotes ?? [],
      serviceFaqs: body.serviceFaqs ?? [],
      detailImages: body.detailImages ?? [],
      featureSection: body.featureSection,
      cta: body.cta,
      seo: body.seo,
    });

    revalidateService(slug);
    return jsonOk(serialize(service), 201);
  });
}
