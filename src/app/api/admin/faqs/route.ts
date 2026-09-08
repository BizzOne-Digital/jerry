import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import FAQ from "@/models/FAQ";
import { revalidateFaqs } from "@/lib/revalidation";

export async function GET() {
  return withAdmin(async () => {
    const items = await FAQ.find().sort({ category: 1, sortOrder: 1 }).lean();
    return jsonOk(serialize({ items }));
  });
}

export async function POST(req: NextRequest) {
  return withAdmin(async () => {
    const body = await req.json();
    if (!body.question || !body.answer) {
      return jsonError("Question and answer are required");
    }

    const faq = await FAQ.create({
      question: body.question,
      answer: body.answer,
      category: body.category ?? "General",
      relatedPageKey: body.relatedPageKey,
      sortOrder: body.sortOrder ?? 0,
      status: body.status ?? "draft",
    });

    revalidateFaqs();
    return jsonOk(serialize(faq), 201);
  });
}
