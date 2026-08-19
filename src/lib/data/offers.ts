import { connectDB } from "@/lib/db/connect";
import Offer from "@/models/Offer";
import { CACHE_TAGS } from "@/lib/revalidation";
import { unstable_cache } from "next/cache";
import type { SerializedOffer } from "@/types/cms";

export const getPublishedOffers = unstable_cache(
  async (): Promise<SerializedOffer[]> => {
    await connectDB();
    const offers = await Offer.find({ status: "published" }).sort({ sortOrder: 1 }).lean();
    return JSON.parse(JSON.stringify(offers));
  },
  ["published-offers"],
  { tags: [CACHE_TAGS.offers], revalidate: 60 }
);

export const getOfferBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      await connectDB();
      const offer = await Offer.findOne({ slug, status: "published" }).lean();
      return offer ? JSON.parse(JSON.stringify(offer)) : null;
    },
    [`offer-${slug}`],
    { tags: [CACHE_TAGS.offers], revalidate: 60 }
  )();
