import { connectDB } from "@/lib/db/connect";
import Testimonial from "@/models/Testimonial";
import { CACHE_TAGS } from "@/lib/revalidation";
import { unstable_cache } from "next/cache";
import type { SerializedTestimonial } from "@/types/cms";

export const getPublishedTestimonials = unstable_cache(
  async (): Promise<SerializedTestimonial[]> => {
    try {
      await connectDB();
      const testimonials = await Testimonial.find({ status: "published" })
        .sort({ featured: -1, sortOrder: 1 })
        .lean();
      return JSON.parse(JSON.stringify(testimonials));
    } catch (error) {
      console.error("getPublishedTestimonials:", error);
      return [];
    }
  },
  ["published-testimonials"],
  { tags: [CACHE_TAGS.testimonials], revalidate: 60 }
);

export const getFeaturedTestimonials = unstable_cache(
  async (limit = 6): Promise<SerializedTestimonial[]> => {
    try {
      await connectDB();
      const testimonials = await Testimonial.find({ status: "published" })
        .sort({ featured: -1, sortOrder: 1 })
        .limit(limit)
        .lean();
      return JSON.parse(JSON.stringify(testimonials));
    } catch (error) {
      console.error("getFeaturedTestimonials:", error);
      return [];
    }
  },
  ["featured-testimonials"],
  { tags: [CACHE_TAGS.testimonials], revalidate: 60 }
);
