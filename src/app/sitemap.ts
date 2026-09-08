import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db/connect";
import Product from "@/models/Product";
import { getSiteUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/services",
    "/shop",
    "/testimonials",
    "/faqs",
    "/contact",
    "/questionnaire",
    "/cart",
    "/checkout",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    await connectDB();
    const products = await Product.find({ status: "published" }).select("slug updatedAt").lean();

    return [
      ...staticRoutes,
      ...products.map((p) => ({
        url: `${base}/shop/${p.slug}`,
        lastModified: p.updatedAt ?? new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
