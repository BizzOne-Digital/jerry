import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Product from "@/models/Product";
import Service from "@/models/Service";
import { rateLimit, getClientIp } from "@/lib/auth/rate-limit";

export async function GET(request: Request) {
  const ip = getClientIp(request.headers);
  const { success } = rateLimit(`search:${ip}`, 30, 60_000);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "10", 10), 20);

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [], services: [] });
  }

  try {
    await connectDB();

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const [products, services] = await Promise.all([
      Product.find({
        status: "published",
        $or: [{ name: regex }, { shortDescription: regex }, { tags: regex }],
      })
        .select("name slug price images category")
        .limit(limit)
        .lean(),
      Service.find({
        status: "published",
        $or: [{ title: regex }, { shortDescription: regex }],
      })
        .select("title slug shortDescription cardImage")
        .limit(limit)
        .lean(),
    ]);

    return NextResponse.json({
      products: JSON.parse(JSON.stringify(products)),
      services: JSON.parse(JSON.stringify(services)),
    });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
