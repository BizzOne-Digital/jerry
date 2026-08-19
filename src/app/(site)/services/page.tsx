import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { ServicesHorizontalScroll } from "@/components/sections/ServicesHorizontalScroll";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SITE_SERVICES } from "@/lib/data/site-services";
import { BRAND_IMAGES } from "@/lib/images";

export const metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What We Offer"
        heading="Collector Services"
        subheading="Buy, sell, trade, authenticate, and experience the game — all under one roof."
        imageUrl={BRAND_IMAGES.services}
      />

      <section className="border-b border-arena-border/40 py-14 lg:py-16">
        <Container className="max-w-3xl text-center">
          <p className="text-base leading-relaxed text-arena-muted sm:text-lg">
            Your trusted source for sports collectibles, autographs, memorabilia, and affordable game
            tickets. Whether you&apos;re a longtime collector, a sports fan, or just getting started, we
            make it easy to find great pieces at fair prices — and we don&apos;t stop at collectibles.
          </p>
        </Container>
      </section>

      <ServicesHorizontalScroll services={SITE_SERVICES} />

      <section className="py-20 lg:py-24">
        <Container className="text-center">
          <h2 className="font-display text-2xl text-arena-cream sm:text-3xl">Ready to get started?</h2>
          <p className="mx-auto mt-4 max-w-xl text-arena-muted">
            Browse the shop, request tickets, or tell us what you want to sell or trade.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/shop">
              <Button size="lg">Shop Collectibles</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
