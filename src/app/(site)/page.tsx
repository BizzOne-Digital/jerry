import { HeroSection } from "@/components/sections/HeroSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { VaultSection } from "@/components/sections/VaultSection";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { OffersSection } from "@/components/sections/OffersSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { TicketCta } from "@/components/sections/TicketCta";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { getPageByKey } from "@/lib/data/pages";
import { getFeaturedProducts } from "@/lib/data/products";
import { getPublishedServices } from "@/lib/data/services";
import { getPublishedOffers } from "@/lib/data/offers";
import { getFeaturedTestimonials } from "@/lib/data/testimonials";
import { getPublishedFaqs } from "@/lib/data/faqs";
import { BRAND_IMAGES } from "@/lib/images";

export default async function HomePage() {
  const [page, products, services, offers, testimonials, faqs] = await Promise.all([
    getPageByKey("home"),
    getFeaturedProducts(8),
    getPublishedServices(),
    getPublishedOffers(),
    getFeaturedTestimonials(6),
    getPublishedFaqs(),
  ]);

  const hero = page?.sections?.find((s) => s.type === "hero");

  return (
    <>
      <HeroSection
        eyebrow={hero?.eyebrow ?? "Cards • Autographs • Memorabilia • Tickets"}
        heading={hero?.heading ?? "Collect. Trade. Experience the Game."}
        subheading={
          hero?.subheading ??
          hero?.body ??
          "Great pieces. Fair prices. The thrill of the game—collected."
        }
        cta={hero?.cta ?? { label: "Shop the Vault", href: "/shop" }}
        secondaryCta={hero?.secondaryCta ?? { label: "Sell or Trade", href: "/contact?inquiry=Trade" }}
        imageUrl={BRAND_IMAGES.hero}
      />
      <ManifestoSection />
      <CategoryGrid />
      <FeaturedProducts products={products} />
      <VaultSection />
      <ServicesGrid services={services} />
      <OffersSection offers={offers} />
      <TrustSection />
      <TestimonialsCarousel testimonials={testimonials} />
      <TicketCta />
      <FaqPreview faqs={faqs} />
    </>
  );
}
