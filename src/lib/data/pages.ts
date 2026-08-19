import { connectDB } from "@/lib/db/connect";
import Page from "@/models/Page";
import { CACHE_TAGS } from "@/lib/revalidation";
import { unstable_cache } from "next/cache";
import type { SerializedPage } from "@/types/cms";
import type { PageKey } from "@/types";

export const getPageByKey = (key: PageKey) =>
  unstable_cache(
    async (): Promise<SerializedPage | null> => {
      await connectDB();
      const page = await Page.findOne({ key, status: "published" }).lean();
      return page ? JSON.parse(JSON.stringify(page)) : null;
    },
    [`page-${key}`],
    { tags: [CACHE_TAGS.pages], revalidate: 60 }
  )();

export async function getPageByKeyFresh(key: PageKey) {
  await connectDB();
  const page = await Page.findOne({ key }).lean();
  return page ? JSON.parse(JSON.stringify(page)) : null;
}

export async function getAllPagesAdmin() {
  await connectDB();
  const pages = await Page.find().sort({ key: 1 }).lean();
  return JSON.parse(JSON.stringify(pages));
}
