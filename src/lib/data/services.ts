import { connectDB } from "@/lib/db/connect";
import Service from "@/models/Service";
import { CACHE_TAGS } from "@/lib/revalidation";
import { unstable_cache } from "next/cache";

import type { SerializedService } from "@/types/cms";

export const getPublishedServices = unstable_cache(
  async (): Promise<SerializedService[]> => {
    await connectDB();
    const services = await Service.find({ status: "published" }).sort({ sortOrder: 1 }).lean();
    return JSON.parse(JSON.stringify(services));
  },
  ["published-services"],
  { tags: [CACHE_TAGS.services], revalidate: 60 }
);

export const getServiceBySlug = (slug: string) =>
  unstable_cache(
    async (): Promise<SerializedService | null> => {
      await connectDB();
      const service = await Service.findOne({ slug, status: "published" }).lean();
      return service ? JSON.parse(JSON.stringify(service)) : null;
    },
    [`service-${slug}`],
    { tags: [CACHE_TAGS.services], revalidate: 60 }
  )();

export async function getAllServicesAdmin() {
  await connectDB();
  const services = await Service.find().sort({ sortOrder: 1 }).lean();
  return JSON.parse(JSON.stringify(services));
}
