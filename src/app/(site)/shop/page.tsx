import { Suspense } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { queryProducts } from "@/lib/data/products";
import { DEMO_FEATURED_PRODUCTS } from "@/lib/data/demo-products";
import { getPageByKey } from "@/lib/data/pages";
import { BRAND_IMAGES } from "@/lib/images";

export const metadata = { title: "Shop" };

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = await getPageByKey("shop");

  const filters = {
    category: typeof params.category === "string" ? params.category : undefined,
    search: typeof params.search === "string" ? params.search : undefined,
    sort: typeof params.sort === "string" ? params.sort : undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    page: params.page ? Number(params.page) : 1,
    limit: 12,
  };

  const result = await queryProducts(filters);
  const products = result.products.length > 0 ? result.products : DEMO_FEATURED_PRODUCTS;
  const total = result.total > 0 ? result.total : DEMO_FEATURED_PRODUCTS.length;
  const totalPages = result.totalPages > 0 ? result.totalPages : 1;
  const currentPage = result.page;

  return (
    <>
      <PageHero
        eyebrow="Shop"
        heading={page?.title ?? "The Collectibles Shop"}
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
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`/shop?${new URLSearchParams({ ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])), page: String(p) }).toString()}`}
                      className={`px-3 py-1 text-sm ${p === currentPage ? "text-arena-gold" : "text-arena-muted"}`}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
