import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import Testimonial from "@/models/Testimonial";
import { revalidateTestimonials } from "@/lib/revalidation";

export async function GET() {
  return withAdmin(async () => {
    const items = await Testimonial.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    return jsonOk(serialize({ items }));
  });
}

export async function POST(req: NextRequest) {
  return withAdmin(async () => {
    const body = await req.json();
    if (!body.customerName || !body.text) {
      return jsonError("Customer name and text are required");
    }

    const testimonial = await Testimonial.create({
      customerName: body.customerName,
      title: body.title,
      location: body.location,
      text: body.text,
      rating: body.rating,
      avatar: body.avatar,
      featured: body.featured ?? false,
      sortOrder: body.sortOrder ?? 0,
      status: body.status ?? "draft",
    });

    revalidateTestimonials();
    return jsonOk(serialize(testimonial), 201);
  });
}
