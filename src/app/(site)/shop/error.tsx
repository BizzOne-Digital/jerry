"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { DEMO_FEATURED_PRODUCTS } from "@/lib/data/demo-products";

export default function ShopError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="py-24">
      <Container className="max-w-xl text-center">
        <h1 className="font-display text-2xl text-arena-cream sm:text-3xl">Shop temporarily unavailable</h1>
        <p className="mt-4 text-sm text-arena-muted sm:text-base">
          We couldn&apos;t load the full shop right now. You can still browse featured items below or try again.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Link href="/">
            <Button variant="outline">Go home</Button>
          </Link>
        </div>
        <div className="mt-12">
          <ProductGrid products={DEMO_FEATURED_PRODUCTS} />
        </div>
      </Container>
    </section>
  );
}
