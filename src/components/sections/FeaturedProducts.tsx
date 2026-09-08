import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { DEMO_FEATURED_PRODUCTS } from "@/lib/data/demo-products";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images?: { url: string; alt?: string }[];
  category?: string;
  stock?: number;
  featured?: boolean;
  onSale?: boolean;
}

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const items = products.length > 0 ? products : DEMO_FEATURED_PRODUCTS;

  return (
    <section className="py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Featured Drops"
              heading="Hot From the Vault"
              subheading="Hand-picked collectibles ready for your showcase."
            />
          </ScrollReveal>
          <Link href="/shop">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="mt-10">
          <ProductGrid products={items} />
        </div>
      </Container>
    </section>
  );
}
