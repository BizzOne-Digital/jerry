import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { BRAND_IMAGES } from "@/lib/images";
import { isPackageLogoImage } from "@/lib/image-utils";
import { PRODUCT_CATEGORIES } from "@/types";

const CATEGORY_IMAGES: Record<string, string> = {
  Cards: BRAND_IMAGES.cards,
  Autographs: BRAND_IMAGES.autographs,
  Memorabilia: BRAND_IMAGES.memorabilia,
  Tickets: BRAND_IMAGES.tickets,
  Packages: BRAND_IMAGES.allStar,
};

export function CategoryGrid() {
  return (
    <section className="bg-arena-navy/50 py-20">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow="Categories"
            heading="Explore the Collection"
            subheading="From rookie gems to championship relics — find your next grail."
          />
        </ScrollReveal>
        <div className="mt-12 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_CATEGORIES.map((cat, i) => {
            const imageUrl = CATEGORY_IMAGES[cat] ?? BRAND_IMAGES.collection;
            const isLogo = cat === "Packages" && isPackageLogoImage(imageUrl);
            return (
            <ScrollReveal key={cat} delay={i * 0.08} className="h-full">
              <Link
                href={`/shop?category=${encodeURIComponent(cat)}`}
                className="group relative block h-full min-h-[220px] overflow-hidden rounded-sm arena-glow sm:min-h-[260px]"
              >
                <Image
                  src={imageUrl}
                  alt={cat}
                  fill
                  className={
                    isLogo
                      ? "object-contain bg-arena-navy p-6"
                      : "object-cover transition-transform duration-500 group-hover:scale-105"
                  }
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-arena-black via-arena-black/40 to-transparent" />
                <span className="absolute bottom-4 left-4 font-display text-xl tracking-wider text-arena-cream">
                  {cat}
                </span>
              </Link>
            </ScrollReveal>
          );
          })}
        </div>
      </Container>
    </section>
  );
}
