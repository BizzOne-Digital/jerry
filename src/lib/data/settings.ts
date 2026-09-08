import { connectDB } from "@/lib/db/connect";
import SiteSettings from "@/models/SiteSettings";
import { CACHE_TAGS } from "@/lib/revalidation";
import { unstable_cache } from "next/cache";
import { DEFAULT_SITE_SETTINGS } from "@/lib/data/defaults";

export const getSiteSettings = unstable_cache(
  async () => {
    try {
      await connectDB();
      let settings = await SiteSettings.findOne({ singletonKey: "default" }).lean();
      if (!settings) {
        settings = await SiteSettings.create({ singletonKey: "default" });
      }
      return JSON.parse(JSON.stringify(settings));
    } catch (error) {
      console.error("getSiteSettings:", error);
      return JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS));
    }
  },
  ["site-settings"],
  { tags: [CACHE_TAGS.settings], revalidate: 60 }
);

export async function getSiteSettingsFresh() {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne({ singletonKey: "default" }).lean();
    if (!settings) {
      settings = await SiteSettings.create({ singletonKey: "default" });
    }
    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error("getSiteSettingsFresh:", error);
    return JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS));
  }
}
