import { connectDB } from "@/lib/db/connect";
import Product from "@/models/Product";
import { CACHE_TAGS } from "@/lib/revalidation";
import { unstable_cache } from "next/cache";

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  inStock?: boolean;
  condition?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function queryProducts(filters: ProductFilters = {}) {
  try {
    await connectDB();

    const query: Record<string, unknown> = { status: "published" };
    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 12, 48);
    const skip = (page - 1) * limit;

    if (filters.category) query.category = filters.category;
    if (filters.featured) query.featured = true;
    if (filters.condition) query.condition = filters.condition;
    if (filters.inStock) query.stock = { $gt: 0 };
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) (query.price as Record<string, number>).$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) (query.price as Record<string, number>).$lte = filters.maxPrice;
    }

    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    switch (filters.sort) {
      case "price-asc":
        sort = { price: 1 };
        break;
      case "price-desc":
        sort = { price: -1 };
        break;
      case "name-asc":
        sort = { name: 1 };
        break;
      default:
        sort = { featured: -1, createdAt: -1 };
    }

    let products;
    let total;

    if (filters.search) {
      products = await Product.find({ ...query, $text: { $search: filters.search } })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
      total = await Product.countDocuments({ ...query, $text: { $search: filters.search } });
    } else {
      products = await Product.find(query).sort(sort).skip(skip).limit(limit).lean();
      total = await Product.countDocuments(query);
    }

    return {
      products: JSON.parse(JSON.stringify(products)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("queryProducts:", error);
    return { products: [], total: 0, page: filters.page ?? 1, totalPages: 0 };
  }
}

export const getFeaturedProducts = unstable_cache(
  async (limit = 8) => {
    try {
      await connectDB();
      const products = await Product.find({ status: "published" })
        .sort({ featured: -1, createdAt: -1 })
        .limit(limit)
        .lean();
      return JSON.parse(JSON.stringify(products));
    } catch (error) {
      console.error("getFeaturedProducts:", error);
      return [];
    }
  },
  ["featured-products"],
  { tags: [CACHE_TAGS.products], revalidate: 60 }
);

export const getProductBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      try {
        await connectDB();
        const product = await Product.findOne({ slug, status: "published" }).lean();
        return product ? JSON.parse(JSON.stringify(product)) : null;
      } catch (error) {
        console.error(`getProductBySlug(${slug}):`, error);
        return null;
      }
    },
    [`product-${slug}`],
    { tags: [CACHE_TAGS.products], revalidate: 60 }
  )();

export async function getProductsByIds(ids: string[]) {
  await connectDB();
  const products = await Product.find({ _id: { $in: ids }, status: "published" }).lean();
  return JSON.parse(JSON.stringify(products));
}
