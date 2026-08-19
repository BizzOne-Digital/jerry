import { connectDB } from "@/lib/db/connect";
import SiteSettings from "@/models/SiteSettings";
import { CACHE_TAGS } from "@/lib/revalidation";
import { unstable_cache } from "next/cache";

export const getSiteSettings = unstable_cache(
  async () => {
    await connectDB();
    let settings = await SiteSettings.findOne({ singletonKey: "default" }).lean();
    if (!settings) {
      settings = await SiteSettings.create({ singletonKey: "default" });
    }
    return JSON.parse(JSON.stringify(settings));
  },
  ["site-settings"],
  { tags: [CACHE_TAGS.settings], revalidate: 60 }
);

export async function getSiteSettingsFresh() {
  await connectDB();
  let settings = await SiteSettings.findOne({ singletonKey: "default" }).lean();
  if (!settings) {
    settings = await SiteSettings.create({ singletonKey: "default" });
  }
  return JSON.parse(JSON.stringify(settings));
}
