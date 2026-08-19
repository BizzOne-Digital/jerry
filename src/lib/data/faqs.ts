import { connectDB } from "@/lib/db/connect";
import FAQ from "@/models/FAQ";
import { CACHE_TAGS } from "@/lib/revalidation";
import { unstable_cache } from "next/cache";
import type { FaqCategory } from "@/types";
import type { SerializedFaq } from "@/types/cms";

export const getPublishedFaqs = unstable_cache(
  async (): Promise<SerializedFaq[]> => {
    await connectDB();
    const faqs = await FAQ.find({ status: "published" }).sort({ sortOrder: 1 }).lean();
    return JSON.parse(JSON.stringify(faqs));
  },
  ["published-faqs"],
  { tags: [CACHE_TAGS.faqs], revalidate: 60 }
);

export async function getFaqsByCategory(category?: FaqCategory) {
  await connectDB();
  const query = category ? { status: "published", category } : { status: "published" };
  const faqs = await FAQ.find(query).sort({ sortOrder: 1 }).lean();
  return JSON.parse(JSON.stringify(faqs));
}
