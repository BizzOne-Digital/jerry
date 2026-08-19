import { Suspense } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { queryProducts } from "@/lib/data/products";
import { DEMO_FEATURED_PRODUCTS } from "@/lib/data/demo-products";
import { BRAND_IMAGES } from "@/lib/images";

export const metadata = { title: "Shop" };

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseQueryString(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parsePrice(value: string | string[] | undefined): number | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function parsePage(value: string | string[] | undefined): number {
  if (typeof value !== "string") return 1;
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;

  const [result] = await Promise.all([
    queryProducts({
      category: parseQueryString(params.category),
      search: parseQueryString(params.search),
      sort: parseQueryString(params.sort),
      minPrice: parsePrice(params.minPrice),
      maxPrice: parsePrice(params.maxPrice),
      page: parsePage(params.page),
      limit: 12,
    }),
  ]);

  const products = result.products.length > 0 ? result.products : DEMO_FEATURED_PRODUCTS;
  const total = result.products.length > 0 ? result.total : DEMO_FEATURED_PRODUCTS.length;
  const totalPages = result.products.length > 0 ? result.totalPages : 1;
  const currentPage = result.page;

  return (
    <>
      <PageHero
        eyebrow="Shop"
        heading="The Collectibles Shop"
        subheading="Authenticated cards, memorabilia, tickets, and more."
        imageUrl={BRAND_IMAGES.cards}
      />
      <section className="py-16">
        <Container>
          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
            <Suspense fallback={<div className="h-64 animate-pulse rounded-sm bg-arena-surface" />}>
              <ProductFilters />
            </Suspense>
            <div className="min-w-0">
              <p className="mb-6 text-sm text-arena-muted">{total} products found</p>
              <ProductGrid products={products} />
              {totalPages > 1 && (
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    const qs = new URLSearchParams();
                    for (const [key, value] of Object.entries(params)) {
                      if (key === "page" || value === undefined) continue;
                      if (Array.isArray(value)) value.forEach((v) => qs.append(key, v));
                      else qs.set(key, value);
                    }
                    qs.set("page", String(p));
                    return (
                      <a
                        key={p}
                        href={`/shop?${qs.toString()}`}
                        className={`px-3 py-1 text-sm ${p === currentPage ? "text-arena-gold" : "text-arena-muted"}`}
                      >
                        {p}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
