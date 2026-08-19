import { connectDB } from "@/lib/db/connect";
import BlogPost from "@/models/BlogPost";
import { CACHE_TAGS } from "@/lib/revalidation";
import { unstable_cache } from "next/cache";
import type { SerializedBlogPost } from "@/types/cms";

export const getPublishedBlogPosts = unstable_cache(
  async (limit = 12): Promise<SerializedBlogPost[]> => {
    await connectDB();
    const posts = await BlogPost.find({ status: "published" })
      .sort({ publishDate: -1, createdAt: -1 })
      .limit(limit)
      .lean();
    return JSON.parse(JSON.stringify(posts));
  },
  ["published-blog-posts"],
  { tags: [CACHE_TAGS.blogs], revalidate: 60 }
);

export const getBlogPostBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      await connectDB();
      const post = await BlogPost.findOne({ slug, status: "published" }).lean();
      return post ? JSON.parse(JSON.stringify(post)) : null;
    },
    [`blog-${slug}`],
    { tags: [CACHE_TAGS.blogs], revalidate: 60 }
  )();
